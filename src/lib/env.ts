import { z } from "zod";
import { createEnv } from "@t3-oss/env-nextjs";

export const env = createEnv({
  server: {
    NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
    DATABASE_URL: z.url().min(1),
    BETTER_AUTH_SECRET: z.string().min(32),
    BETTER_AUTH_URL: z.url().min(1),
    UPSTASH_REDIS_REST_URL: z.url().min(1),
    UPSTASH_REDIS_REST_TOKEN: z.string().min(1),
    REDIS_URL: z.url().refine(
      (value) => ["redis:", "rediss:"].includes(new URL(value).protocol),
      "REDIS_URL must use redis:// or rediss://",
    ),
    OPENROUTER_API_KEY: z.string().min(1),
    OPENROUTER_TEXT_MODEL_ID: z.string().min(1),
    OPENROUTER_EMBEDDING_MODEL_ID: z.string().min(1),
    GITHUB_CLIENT_ID: z.string().min(1),
    GITHUB_CLIENT_SECRET: z.string().min(1),
    PINECONE_DB_API_KEY: z.string().min(1),
    PINECONE_DB_REGION: z.string().min(1),
    PINECONE_DB_INDEX_NAME: z.string().min(1),
    GOOGLE_GENERATIVE_AI_API_KEY: z.string().min(1),
  },
  client: {
    NEXT_PUBLIC_APP_BASE_URL: z.url().min(1),
  },
  experimental__runtimeEnv: {
    NEXT_PUBLIC_APP_BASE_URL: process.env.NEXT_PUBLIC_APP_BASE_URL,
  },
  emptyStringAsUndefined: true,
  skipValidation: process.env.SKIP_ENV_VALIDATION === "true",
});