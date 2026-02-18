"use server";

import { auth } from "@/lib/auth";
import client from "@/lib/db";
import { headers } from "next/headers";

export const getReviews = async () => {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        throw new Error("Unauthorized");
    }

    const reviews = await client.review.findMany({
        where: {
            repository: {
                userId: session.user.id,
            }
        },
        include: {
            repository: true,
        },
        orderBy: {
            createdAt: "desc",
        },
        take: 50
    });

    return reviews;
};