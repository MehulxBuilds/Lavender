import { env } from "@/lib/env";
import { Pinecone } from '@pinecone-database/pinecone';

export const pinecone = new Pinecone({
    apiKey: env.PINECONE_DB_API_KEY,
});
export const pineconeIndex = pinecone.index(env.PINECONE_DB_INDEX_NAME);