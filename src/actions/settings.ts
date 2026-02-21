"use server";

import { auth } from "@/lib/auth";
import client from "@/lib/db";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { deleteWebhook } from "./github";

export const getUserProfile = async () => {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        });

        if (!session) {
            throw new Error("Unauthorized");
        };
        const user = await client.user.findUnique({
            where: {
                id: session.user.id,
            },
            select: {
                id: true,
                name: true,
                email: true,
                createdAt: true
            }
        });

        return user;
    } catch (e) {
        console.error(e);
        return null;
    }
};

export const updateUserProfile = async (data: { name: string, email: string }) => {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        });

        if (!session) {
            throw new Error("Unauthorized");
        };

        const updateUser = await client.user.update({
            where: {
                id: session.user.id
            },
            data: {
                name: data.name,
                email: data.email,
            },
            select: {
                id: true,
                name: true,
                email: true
            }
        });

        revalidatePath('/dashboard/settings', "page");

        return {
            success: true,
            user: updateUser
        }
    } catch (e) {
        console.error(e);
        return {
            success: false,
            error: "Failed to update profile"
        }
    }
};

export const getConnectedRepositories = async () => {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        });

        if (!session) {
            throw new Error("Unauthorized");
        };

        const repositories = await client.repository.findMany({
            where: {
                userId: session.user.id,
            },
            select: {
                id: true,
                name: true,
                fullName: true,
                url: true,
                createdAt: true
            },
            orderBy: {
                createdAt: "desc"
            }
        });

        return repositories;

    } catch (e) {
        console.error(e);
        return [];
    }
};

export const disconnectRepository = async (repositoryId: string) => {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        });

        if (!session) {
            throw new Error("Unauthorized");
        };

        const repository = await client.repository.findUnique({
            where: {
                id: repositoryId,
                userId: session.user.id
            }
        });

        if (!repository) {
            throw new Error("Repository not found");
        };

        await deleteWebhook(repository.owner, repository.name);

        await client.repository.delete({
            where: {
                id: repositoryId,
                userId: session.user.id,
            }
        });

        revalidatePath('/dashboard/settings', 'page');
        revalidatePath('/dashboard/repository', 'page');

        return {
            success: true,
        }
    } catch (e) {
        console.error(e);
        return {
            success: false,
            error: "Failed to disconnected repositories"
        }
    }
};

export const disconnectAllRepository = async () => {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        });

        if (!session) {
            throw new Error("Unauthorized");
        };

        const repository = await client.repository.findMany({
            where: {
                userId: session.user.id
            }
        });

        await Promise.all(repository.map(async (repo) => {
            await deleteWebhook(repo.owner, repo.name);
        }));

        const result = await client.repository.deleteMany({
            where: {
                userId: session.user.id,
            }
        });

        revalidatePath('/dashboard/settings', 'page');
        revalidatePath('/dashboard/repository', 'page');

        return {
            success: true,
            count: result.count,
        }
    } catch (e) {
        console.error(e);
        return {
            success: false,
            error: "Failed to disconnected repositories"
        }
    }
};