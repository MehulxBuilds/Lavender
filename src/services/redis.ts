import { env } from "@/lib/env";
import type { RedisOptions } from "bullmq";

// BullMQ uses the Upstash TCP URL; REST credentials are not needed here.
export function getRedisConnection(worker = false): RedisOptions {
  const url = new URL(env.REDIS_URL);
  if (!["redis:", "rediss:"].includes(url.protocol)) {
    throw new Error("REDIS_URL must use redis:// or rediss://");
  }
  return {
    host: url.hostname,
    port: Number(url.port || 6379),
    username: decodeURIComponent(url.username) || undefined,
    password: decodeURIComponent(url.password) || undefined,
    db: url.pathname && url.pathname !== "/" ? Number(url.pathname.slice(1)) : 0,
    ...(url.protocol === "rediss:" ? { tls: {} } : {}),
    maxRetriesPerRequest: worker ? null : 1,
    connectTimeout: 10000,
  };
}
