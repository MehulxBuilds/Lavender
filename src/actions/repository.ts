"use server";

import { auth } from "@/lib/auth";
import client from "@/lib/db";
import { createWebhook, getRepository } from "./github";
import { headers } from "next/headers";
import { inngest } from "@/inngest/client";
import { produceMessage } from "@/services/kafka";
// import { canConnectRepository, incrementRepositoryCount } from "@/lib/subscription";

export const fetchRepositories = async (page: number = 1, perPage = 10) => {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session) {
        throw new Error("Unauthorized");
    };

    const githubRepos = await getRepository(page, perPage);

    const dbRepos = await client.repository.findMany({
        where: {
            userId: session.user.id
        }
    });

    const connectedRepoId = new Set(dbRepos.map((repo => repo.githubId)));

    return githubRepos.map((repo) => ({
        ...repo,
        isConnected: connectedRepoId.has(BigInt(repo.id))
    }));
}

export const connectRepository = async (owner: string, repo: string, githubId: number) => {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session) {
        throw new Error("Unauthorized");
    };

    // TODO: Check if user can connect more repo.
    // const canConnect = await canConnectRepository(session.user.id);

    // if (!canConnect) {
    //     throw new Error("Repository connection limit reached. Please upgrade your plan to connect more repositories.");
    // }

    const webhook = await createWebhook(owner, repo);

    if (webhook) {
        await client.repository.create({
            data: {
                githubId: BigInt(githubId),
                name: repo,
                owner,
                fullName: `${owner}/${repo}`,
                url: `https:/github.com/${owner}/${repo}`,
                userId: session.user.id,
            }
        })

        // TODO: inc. repo count
        // await incrementRepositoryCount(session.user.id);

        // Trigger repo indexing
        try {
            // await inngest.send({
            //     name: "repository.connected",
            //     data: {
            //         owner,
            //         repo,
            //         userId: session.user.id,
            //     }
            // })

            produceMessage("repository-data", `${owner}/${repo}`, {
                owner,
                repo,
                userId: session.user.id,
            }).catch(error => {
                console.error("Failed to produce message to Kafka:", error);
            });
            
        } catch (e) {
            console.error("Failed to trigger repository indexing:", e);
        }

    };

    return webhook;
}