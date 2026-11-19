import { enforceRateLimit, RateLimitError, RateLimitUnavailableError } from "@/lib/rate-limit";
import { indexRepositoryFiles, searchRepositoryContext } from "@/lib/pinecone";
import client from "@/lib/db";
import { getpullRequestDiff } from "./github";
import { enqueuePrReview } from "@/services/queue";

export const indexCodebase = async (repoId: string, files: { path: string; content: string }[]) => {
    // Propagate failures to BullMQ rather than reporting a partially indexed repo as successful.
    const indexed = await indexRepositoryFiles(repoId, files);
    console.log(`Indexing complete: ${indexed} files`);
    return indexed;
};

export const retriveContext = async (query: string, repoId: string, topK: number = 5) => {
    return searchRepositoryContext(query, repoId, topK);
};

export const reviewPullRequest = async (owner: string, repo: string, prNumber: number) => {

    try {

        const repository = await client.repository.findFirst({
            where: {
                owner,
                name: repo
            },
            include: {
                user: {
                    include: {
                        accounts: {
                            where: {
                                providerId: "github"
                            }
                        }
                    }
                }
            }
        });

        if (!repository) {
            throw new Error(`Repository ${owner}/${repo} not found in database, Please reconnect the repository.`);
        };


        await enforceRateLimit("prReview", repository.user.id);

        const githubAccount = repository?.user?.accounts?.[0];

        if (!githubAccount?.accessToken) {
            throw new Error(`No Github access token found for repository owner`);
        };

        const token = githubAccount?.accessToken;

        await getpullRequestDiff(token, owner, repo, prNumber);


        await enqueuePrReview({
            owner,
            repo,
            prNumber,
            userId: repository.user.id,
        });


        return {
            success: true,
            message: "Review Queued",
        }

    } catch (e) {
        if (e instanceof RateLimitError || e instanceof RateLimitUnavailableError) throw e;
        try {
            const repository = await client.repository.findFirst({
                where: {
                    owner,
                    name: repo
                }
            });

            if (repository) {
                await client.review.create({
                    data: {
                        repositoryId: repository.id,
                        prNumber: prNumber,
                        prTitle: "Failed to fetch PR details",
                        prUrl: `https://github.com/${owner}/${repo}/pull/${prNumber}`,
                        review: `Error: ${e instanceof Error ? e.message : "Unknown error occurred while fetching PR details."}`,
                        status: "failed"
                    }
                })
            }
        } catch (e) {
            console.error("Failed to log review error in database:", e);
        }
        throw e;
    }
};