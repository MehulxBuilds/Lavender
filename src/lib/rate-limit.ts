import "server-only";

import { createHash } from "node:crypto";

import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { env } from "@/lib/env";

// Retain separate budgets for expensive operations while using the SDK.
const redis = new Redis({
  url: env.UPSTASH_REDIS_REST_URL,
  token: env.UPSTASH_REDIS_REST_TOKEN,
});

function createLimiter(name: string, limit: number, window: Parameters<typeof Ratelimit.slidingWindow>[1]) {
  return new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(limit, window),
    dynamicLimits: true,
    prefix: `voxara:ratelimit:${env.NODE_ENV}:${name}`,
  });
}

const limiters = {
  repositoryConnect: createLimiter("repository-connect", 5, "1 h"),
  repositoryList: createLimiter("repository-list", 30, "1 m"),
  prReview: createLimiter("pr-review", 10, "10 m"),
};

export class RateLimitError extends Error {
  constructor(public readonly retryAfter: number, public readonly limit: number) {
    super(`Too many requests. Try again in ${retryAfter} seconds.`);
    this.name = "RateLimitError";
  }
}

export class RateLimitUnavailableError extends Error {
  constructor() {
    super("Request limits are temporarily unavailable. Please try again shortly.");
    this.name = "RateLimitUnavailableError";
  }
}

export async function enforceRateLimit(policy: keyof typeof limiters, identifier: string) {
  const hash = createHash("sha256").update(identifier).digest("hex");
  let result: Awaited<ReturnType<Ratelimit["limit"]>>;
  try {
    result = await limiters[policy].limit(hash);
    await result.pending;
  } catch {
    throw new RateLimitUnavailableError();
  }
  // The SDK permits timed-out requests by default; keep our fail-closed policy.
  if (result.reason === "timeout") throw new RateLimitUnavailableError();
  if (!result.success) {
    throw new RateLimitError(Math.max(1, Math.ceil((result.reset - Date.now()) / 1000)), result.limit);
  }
  return { limit: result.limit, remaining: result.remaining };
}

export function rateLimitResponse(error: unknown): Response | undefined {
  if (error instanceof RateLimitError) {
    return Response.json({ error: error.message }, {
      status: 429,
      headers: { "Retry-After": String(error.retryAfter), "X-RateLimit-Limit": String(error.limit), "X-RateLimit-Remaining": "0", "Cache-Control": "no-store" },
    });
  }
  if (error instanceof RateLimitUnavailableError) {
    return Response.json({ error: error.message }, {
      status: 503, headers: { "Retry-After": "5", "Cache-Control": "no-store" },
    });
  }
}
