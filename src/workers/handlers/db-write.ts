import client from "@/lib/db";
import { DBWriterMessage } from "@/types";

export const handleDBWrite = async (message: DBWriterMessage) => {
  const { owner, repo, userId } = message;

  console.log(`[db-writer] Processing repository: ${owner}/${repo}`);

  try {
    await client.repository.updateMany({
      where: { owner, name: repo, userId },
      data: { updatedAt: new Date() },
    });

    console.log(`[db-writer] Repository ${owner}/${repo} synced`);
  } catch (error) {
    console.error(`[db-writer] Failed to process ${owner}/${repo}:`, error);
    throw error;
  }
};
