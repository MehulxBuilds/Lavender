import client from "@/lib/db";

export const handleDBWrite = async (message: {
  owner: string;
  repo: string;
  userId: string;
}) => {
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
