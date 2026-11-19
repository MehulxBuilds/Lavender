import { Pinecone } from "@pinecone-database/pinecone";
import { z } from "zod";
import { env } from "@/lib/env";
import { generateEmbedding } from "./open-router";

export const pinecone = new Pinecone({ apiKey: env.PINECONE_DB_API_KEY });

const embeddingFieldSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("dense_vector"), dimension: z.number().int().positive() }),
  z.object({ type: z.literal("string"), embed: z.object({ model: z.string() }) }),
  z.object({ type: z.literal("semantic_text") }),
]);

const namedEmbeddingFieldsSchema = z.array(
  embeddingFieldSchema.and(z.object({ name: z.string().regex(/^[^_]/) })),
).length(1, "Pinecone index must declare exactly one named embedding field");

const indexSchema = z.object({
  host: z.string().min(1),
  schema: z.object({ fields: z.record(z.string(), z.unknown()) }),
});

const documentSchema = z.object({
  _id: z.string().min(1),
  repoId: z.string().min(1),
  path: z.string().min(1),
  content: z.string().min(1),
});

const contextSchema = z.array(z.object({ content: z.string().optional().default("") }))
  .transform((matches) => matches.map((match) => match.content).filter(Boolean));

async function getIndex() {
  const model = indexSchema.parse(await pinecone.indexes.describe(env.PINECONE_DB_INDEX_NAME));
  const fields = Object.entries(model.schema.fields).flatMap(([name, definition]) => {
    const result = embeddingFieldSchema.safeParse(definition);
    return result.success ? [{ name, ...result.data }] : [];
  });
  const [field] = namedEmbeddingFieldsSchema.parse(fields);

  return { index: pinecone.index({ host: model.host }), field };
}

export async function indexRepositoryFiles(repoId: string, files: { path: string; content: string }[]) {
  if (files.length === 0) return 0;
  const { index, field } = await getIndex();
  const batchSize = 20;

  for (let offset = 0; offset < files.length; offset += batchSize) {
    const documents = [];
    for (const file of files.slice(offset, offset + batchSize)) {
      const document = documentSchema.parse({
        _id: `${repoId}-${file.path.replace(/\//g, "_")}`,
        repoId,
        path: file.path,
        content: `File: ${file.path}\n\n${file.content}`.slice(0, 8000),
      });
      const value = field.type === "dense_vector"
        ? z.array(z.number()).length(field.dimension).parse(await generateEmbedding(document.content))
        : document.content;
      documents.push({ ...document, [field.name]: value });
    }

    if (field.type === "semantic_text") {
      // Older integrated indexes require the SDK's Records API.
      await index.upsertRecords({ records: documents });
    } else {
      await index.documents.upsert({ documents });
    }
  }
  return files.length;
}

export async function searchRepositoryContext(query: string, repoId: string, topK: number) {
  const { index, field } = await getIndex();
  const filter = { repoId: { $eq: repoId } };

  if (field.type === "semantic_text") {
    const response = await index.searchRecords({
      query: { inputs: { text: query }, topK, filter },
      fields: ["content"],
    });
    return contextSchema.parse(response.result.hits.map((hit) => hit.fields));
  }

  const scoreBy = field.type === "dense_vector"
    ? { type: "dense_vector", field: field.name, values: z.array(z.number()).length(field.dimension).parse(await generateEmbedding(query)) }
    : { type: "embed", field: field.name, query };
  const response = await index.documents.search({
    scoreBy: [scoreBy],
    topK,
    filter,
    includeFields: ["content"],
  });
  return contextSchema.parse(response.matches);
}
