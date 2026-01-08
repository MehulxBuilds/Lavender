"use server";

import { auth } from "@/lib/auth";
import client from "@/lib/db";
import { createWebhook, getRepository } from "./github";
import { headers } from "next/headers";

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

export const connectRepository = async(owner: string, repo: string, githubId: number) => {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session) {
        throw new Error("Unauthorized");
    };

    // TODO: Check if user can connect more repo.

    const webhook = await createWebhook(owner, repo);

    if(webhook) {
        await client.repository.create({
            data: {
                githubId: BigInt(githubId),
                name: repo,
                owner,
                fullName: `${owner}/${repo}`,
                url: `http:/github.com/${owner}/${repo}`,
                userId: session.user.id,
            }
        })
    };

    // TODO: inc. repo count

    // TODO: Trigger repo index

    return webhook;
}