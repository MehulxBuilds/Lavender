import { Worker } from "bullmq";
import { getRedisConnection } from "@/services/redis";
import { REPOSITORY_QUEUE, PR_REVIEW_QUEUE } from "@/services/queue";
import type { DBWriterMessage, PrReviewMessage } from "@/types";
import { handleDBWrite } from "./handlers/db-write";
import { handleCreateRepoVectors } from "./handlers/repo-vectors";
import { handlePrReviewTOGithub } from "./handlers/pr-review";

export async function initQueueConsumers() {
  const connection = getRedisConnection(true);
  const workers = [
    new Worker<DBWriterMessage>(REPOSITORY_QUEUE, async (job) => {
      switch (job.name) {
        case "db-write": return handleDBWrite(job.data);
        case "repo-vectors": return handleCreateRepoVectors(job.data);
        default: throw new Error(`Unknown repository job: ${job.name}`);
      }
    }, { connection, concurrency: 2 }),
    new Worker<PrReviewMessage>(PR_REVIEW_QUEUE, async (job) => {
      await handlePrReviewTOGithub(job.data);
    }, { connection }),
  ];
  for (const worker of workers) {
    worker.on("error", (error) => console.error(`[${worker.name}] Worker error:`, error));
    worker.on("failed", (job, error) => console.error(`[${worker.name}] Job ${job?.id} failed:`, error));
  }
  const close = () => Promise.all(workers.map((worker) => worker.close()));
  try {
    await Promise.all(workers.map((worker) => worker.waitUntilReady()));
    console.log("BullMQ workers are running.");
    return close;
  } catch (error) {
    await Promise.allSettled(workers.map((worker) => worker.close(true)));
    throw error;
  }
}
