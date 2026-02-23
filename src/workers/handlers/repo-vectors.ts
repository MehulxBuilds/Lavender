import { getRepoFileContents } from "@/actions/github";
import { indexCodebase } from "@/actions/rag";
import client from "@/lib/db";
import { RepoVectorMessage } from "@/types";

  export const handleCreateRepoVectors = async (message: RepoVectorMessage) => {
  const { owner, repo, userId } = message;

  console.log(`[repo-vectors] Indexing repository: ${owner}/${repo}`);

  try {
    const account = await client.account.findFirst({
      where: { userId, providerId: "github" },
    });

    if (!account?.accessToken) {
      throw new Error(`No GitHub access token found for user ${userId}`);
    }

    const files = await getRepoFileContents(account.accessToken, owner, repo);
    await indexCodebase(`${owner}/${repo}`, files);

    console.log(
      `[repo-vectors] Indexed ${files.length} files for ${owner}/${repo}`,
    );
  } catch (error) {
    console.error(`[repo-vectors] Failed to index ${owner}/${repo}:`, error);
    throw error;
  }
};
