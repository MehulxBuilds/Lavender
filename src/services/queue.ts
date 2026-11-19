import { Queue } from "bullmq";
import { getRedisConnection } from "./redis";
import type { DBWriterMessage, PrReviewMessage } from "@/types";

export const REPOSITORY_QUEUE = "repository-data";
export const PR_REVIEW_QUEUE = "pr-review";
let repositoryQueue: Queue<DBWriterMessage> | undefined;
let reviewQueue: Queue<PrReviewMessage> | undefined;

function options() {
  return {
    connection: getRedisConnection(),
    defaultJobOptions: {
      removeOnComplete: { count: 100 },
      removeOnFail: { count: 500 },
    },
  };
}

export async function enqueueRepository(message: DBWriterMessage) {
  if (!repositoryQueue) {
    repositoryQueue = new Queue<DBWriterMessage>(REPOSITORY_QUEUE, options());
    repositoryQueue.on("error", (error) => console.error("Repository queue error:", error));
  }
  // Atomically enqueue both former Kafka consumer-group jobs.
  await repositoryQueue.addBulk([
    { name: "db-write", data: message, opts: { attempts: 3, backoff: { type: "exponential", delay: 1000 } } },
    { name: "repo-vectors", data: message, opts: { attempts: 3, backoff: { type: "exponential", delay: 1000 } } },
  ]);
}

export async function enqueuePrReview(message: PrReviewMessage) {
  if (!reviewQueue) {
    reviewQueue = new Queue<PrReviewMessage>(PR_REVIEW_QUEUE, options());
    reviewQueue.on("error", (error) => console.error("PR review queue error:", error));
  }
  // GitHub comments are not idempotent; avoid automatic failure retries.
  await reviewQueue.add("pr-review", message, { attempts: 1 });
}
