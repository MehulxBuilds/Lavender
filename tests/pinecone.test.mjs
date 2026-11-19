import { readFile } from 'node:fs/promises';
import assert from 'node:assert/strict';
import test from 'node:test';
import { randomUUID } from 'node:crypto';
import ts from 'typescript';

// Load the production adapter with only its external boundaries replaced.
async function adapter(fields, options = {}) {
  const calls = [];
  let embeddings = 0;
  const index = {
    documents: {
      upsert: async request => { calls.push(['documents.upsert', request]); if (options.writeError) throw options.writeError; },
      search: async request => { calls.push(['documents.search', request]); return { matches: [{ content: 'context' }] }; },
    },
    upsertRecords: async request => calls.push(['records.upsert', request]),
    searchRecords: async request => { calls.push(['records.search', request]); return { result: { hits: [{ fields: { content: 'context' } }] } }; },
    upsert: async request => calls.push(['vectors.upsert', request]),
    query: async request => { calls.push(['vectors.query', request]); return { matches: [{ metadata: { content: 'context' } }] }; },
  };
  const key = `pineconeTest${randomUUID().replaceAll('-', '')}`;
  globalThis[key] = {
    Pinecone: class {
      indexes = { describe: async () => ({ host: 'test.invalid', schema: { fields } }) };
      index() { return index; }
    },
    generateEmbedding: async () => {
      embeddings++;
      if (options.embeddingError) throw options.embeddingError;
      return Array(options.embeddingLength ?? 2048).fill(0.1);
    },
  };
  try {
    let source = await readFile(new URL('../src/lib/pinecone.ts', import.meta.url), 'utf8');
    source = source.replace(/^import .*from "@\/lib\/env";$/m, 'const env = { PINECONE_DB_API_KEY: "test", PINECONE_DB_INDEX_NAME: "test" };');
    source = source.replace(/^import .*from "@pinecone-database\/pinecone";$/m, `const { Pinecone } = globalThis.${key};`);
    source = source.replace(/^import .*from "\.\/open-router";$/m, `const { generateEmbedding } = globalThis.${key};`);
    source = source.replace('from "zod"', `from ${JSON.stringify(import.meta.resolve('zod'))}`);
    const { outputText } = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } });
    const module = await import(`data:text/javascript;base64,${Buffer.from(outputText).toString('base64')}`);
    return { ...module, calls, embeddings: () => embeddings };
  } finally {
    delete globalThis[key];
  }
}

const files = [{ path: 'index.ts', content: 'export const value = 1;' }];
for (const [kind, fields, write, search, embeddingCalls] of [
  ['document vectors', { embedding: { type: 'dense_vector', dimension: 2048 } }, 'documents.upsert', 'documents.search', 2],
  ['document integrated embeddings', { text: { type: 'string', embed: { model: 'test' } } }, 'documents.upsert', 'documents.search', 0],
  ['legacy integrated embeddings', { text: { type: 'semantic_text', dimension: 768 } }, 'records.upsert', 'records.search', 0],
]) {
  test(`${kind}: routes writes and reads through matching SDK APIs`, async () => {
    const app = await adapter(fields);
    assert.equal(await app.indexRepositoryFiles('owner/repo', files), 1);
    assert.deepEqual(await app.searchRepositoryContext('query', 'owner/repo', 5), ['context']);
    assert.deepEqual(app.calls.map(call => call[0]), [write, search]);
    const searchRequest = app.calls[1][1];
    assert.deepEqual(searchRequest.filter ?? searchRequest.query.filter, { repoId: { $eq: 'owner/repo' } });
    assert.equal(app.embeddings(), embeddingCalls);
    if (kind === 'document vectors') {
      assert.equal(app.calls[0][1].documents[0].embedding.length, 2048);
      assert.equal(searchRequest.scoreBy[0].type, 'dense_vector');
      assert.equal(searchRequest.scoreBy[0].field, 'embedding');
    }
    if (kind === 'document integrated embeddings') {
      assert.match(app.calls[0][1].documents[0].text, /File: index.ts/);
      assert.equal(searchRequest.scoreBy[0].type, 'embed');
    }
  });
}

test('dimension mismatch and embedding failures prevent writes', async () => {
  const fields = { embedding: { type: 'dense_vector', dimension: 768 } };
  const mismatch = await adapter(fields);
  await assert.rejects(mismatch.indexRepositoryFiles('owner/repo', files), /768/);
  assert.equal(mismatch.calls.length, 0);
  const failure = await adapter(fields, { embeddingError: new Error('embedding failed') });
  await assert.rejects(failure.indexRepositoryFiles('owner/repo', files), /embedding failed/);
  assert.equal(failure.calls.length, 0);
});

test('batches writes and propagates write failures for BullMQ retries', async () => {
  const fields = { text: { type: 'string', embed: { model: 'test' } } };
  const app = await adapter(fields);
  const many = Array.from({ length: 41 }, (_, i) => ({ path: `${i}.ts`, content: 'code' }));
  assert.equal(await app.indexRepositoryFiles('owner/repo', many), 41);
  assert.deepEqual(app.calls.map(call => call[1].documents.length), [20, 20, 1]);
  const failure = await adapter(fields, { writeError: new Error('upsert failed') });
  await assert.rejects(failure.indexRepositoryFiles('owner/repo', files), /upsert failed/);
});
