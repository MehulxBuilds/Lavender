"use server";
import { auth } from "@/lib/auth";
import { getRemainingLimits, updateUserTier, updatePolarCustomerId } from "@/lib/subscription";
import { headers } from "next/headers";
import { polarClient } from "@/lib/polar";
import client from "@/lib/db";

export interface SubscriptionData {
    user: {
        id: string;
        name: string;
        email: string;
        subscriptionTier: string;
        subscriptionStatus: string | null;
        polarCustomerId: string | null;
        polarSubscriptionId: string | null;
    } | null;
    limits: {
        tier: "FREE" | "PRO";
        repositories: {
            current: number;
            limit: number | null;
            canAdd: boolean;
        };
        reviews: {
            [repositoryId: string]: {
                current: number;
                limit: number | null;
                canAdd: boolean;
            };
        };
    } | null;
}

export async function getSubscriptionData(): Promise<SubscriptionData> {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session?.user) {
        return { user: null, limits: null };
    }

    const user = await client.user.findUnique({
        where: { id: session.user.id }
    });

    if (!user) {
        return { user: null, limits: null };
    }

    const limits = await getRemainingLimits(user.id);

    return {
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            subscriptionTier: user.subscriptionTier || "FREE",
            subscriptionStatus: user.subscriptionStatus || null,
            polarCustomerId: user.polarCustomerId || null,
            polarSubscriptionId: user.polarSubscriptionId || null,
        },
        limits,
    };
}

export async function syncSubscriptionStatus() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session?.user) {
        throw new Error("Not authenticated");
    }

    let user = await client.user.findUnique({
        where: { id: session.user.id }
    });

    if (!user) {
        return { success: false, message: "User not found" };
    }

    try {
        // If polarCustomerId is missing, try to look up the Polar customer by email
        if (!user.polarCustomerId) {
            const customers = await polarClient.customers.list({
                email: user.email,
            });

            const polarCustomer = customers.result?.items?.[0];

            if (polarCustomer) {
                await updatePolarCustomerId(user.id, polarCustomer.id);
                user = { ...user, polarCustomerId: polarCustomer.id };
            } else {
                return { success: false, message: "No Polar customer found for this email" };
            }
        }

        // Fetch subscriptions from Polar
        const result = await polarClient.subscriptions.list({
            customerId: user.polarCustomerId,
        });

        const subscriptions = result.result?.items || [];

        // Find the most relevant subscription (active or most recent)
        const activeSub = subscriptions.find((sub: { status: string; id: string }) => sub.status === 'active');
        const latestSub = subscriptions[0]; // Assuming API returns sorted or we should sort

        if (activeSub) {
            await updateUserTier(user.id, "PRO", "ACTIVE", activeSub.id);
            return { success: true, status: "ACTIVE" };
        } else if (latestSub) {
            // If latest is canceled/expired
            const status = latestSub.status === 'canceled' ? 'CANCELED' : 'EXPIRED';
            // Only downgrade if we are sure it's not active
            if (latestSub.status !== 'active') {
                await updateUserTier(user.id, "FREE", status, latestSub.id);
            }
            return { success: true, status };
        }

        return { success: true, status: "NO_SUBSCRIPTION" };
    } catch (error) {
        console.error("Failed to sync subscription:", error);
        return { success: false, error: "Failed to sync with Polar" };
    }
}