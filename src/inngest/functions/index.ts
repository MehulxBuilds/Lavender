import { getRepoFileContents } from "@/actions/github";
import { indexCodebase } from "@/actions/rag";
import { inngest } from "@/inngest/client";
import client from "@/lib/db";

export const indexRepo = inngest.createFunction(
    { id: "index-repo" },
    { event: "repository.connected" },

    async({ event, step }) => {
        const { owner, repo, userId } = event.data;

        // Get-Files
        const files = await step.run("fetch-files", async() => {
            const account = await client.account.findFirst({
                where: {
                    userId: userId,
                    providerId: "github"
                }
            });

            if(!account?.accessToken) {
                throw new Error("No Github access token found");
            }

            return await getRepoFileContents(account.accessToken, owner, repo);
        });

        // Index-Codebase
        await step.run("index-codebase", async() => {
            await indexCodebase(`${owner}/${repo}`, files);
        });

        return { success: true, indexedFiles: files.length };
    }
);