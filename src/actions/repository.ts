"use server";

import { auth } from "@/lib/auth";
import client from "@/lib/db";
import { getRepository } from "./github";
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
        isConncted: connectedRepoId.has(BigInt(repo.id))
    }));
}