import { pineconeIndex } from "@/lib/pinecone";
import { embed } from "ai";
import { google } from "@ai-sdk/google";
import client from "@/lib/db";
import { getpullRequestDiff } from "./github";
import { inngest } from "@/inngest/client";

export const generateEmbedding = async (text: string) => {
    const { embedding } = await embed({
        model: google.textEmbeddingModel("gemini-embedding-001"),
        value: text,
        providerOptions: {
            google: {
                outputDimensionality: 768,
            },
        },
    });

    if (embedding.length !== 768) {
        throw new Error(`Invalid embedding dim: ${embedding.length}`);
    }

    return embedding;
};

export const indexCodebase = async (repoId: string, files: { path: string, content: string }[]) => {
    const vectors = [];

    for (const file of files) {
        const content = `File: ${file.path}\n\n${file.content}`;
        const truncatedContent = content.slice(0, 8000); 

        try {
            const embedding = await generateEmbedding(truncatedContent);

            vectors.push({
                id: `${repoId}-${file.path.replace(/\//g, '_')}`,
                values: embedding,
                metadata: {
                    repoId,
                    path: file.path,
                    content: truncatedContent
                }
            });

        } catch (error) {
            console.error(`Failed to embed ${file.path}:`, error);
        }
    };

    if (vectors.length > 0) {
        const batchSize = 100;

        for (let i = 0; i < vectors.length; i += batchSize) {
            const batch = vectors.slice(i, i + batchSize);

            await pineconeIndex.upsert(batch);
        }
    };

    console.log("Indexing complete");
};

export const retriveContext = async (query: string, repoId: string, topK: number = 5) => {
    const embedding = await generateEmbedding(query);

    const results = await pineconeIndex.query({
        vector: embedding,
        filter: { repoId },
        topK,
        includeMetadata: true,
    });

    return results.matches.map(match => match?.metadata?.content as string).filter(Boolean);
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

        const githubAccount = repository?.user?.accounts?.[0];

        if (!githubAccount?.accessToken) {
            throw new Error(`No Github access token found for repository owner`);
        };

        const token = githubAccount?.accessToken;

        const { title } = await getpullRequestDiff(token, owner, repo, prNumber);

        await inngest.send({
            name: "pr.review.requested",
            data: {
                owner,
                repo,
                prNumber,
                userId: repository.user.id,
                title,
            }
        });

        return {
            success: true,
            message: "Review Queued",
        }

    } catch (e) {
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
    }
};