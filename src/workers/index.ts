import { ensureTopicExists, startConsumer } from "@/services/kafka";
import { handleDBWrite } from "./handlers/db-write";
import { handleCreateRepoVectors } from "./handlers/repo-vectors";
import { handlePrReviewTOGithub } from "./handlers/pr-review";

export const initQueueConsumers = async () => {
  console.log("Starting Kafka workers...");

  await ensureTopicExists("repository-data");
  await ensureTopicExists("pr-review");

  await startConsumer("db-writer-group", "repository-data", handleDBWrite);
  await startConsumer(
    "repo-vector-group",
    "repository-data",
    handleCreateRepoVectors,
  );
  await startConsumer("pr-review-group", "pr-review", handlePrReviewTOGithub);

  console.log("All Kafka consumers are running.");
};
