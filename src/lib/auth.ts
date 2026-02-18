import "server-only";

import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import client from "./db";
import { polar, checkout, portal, usage, webhooks } from "@polar-sh/better-auth";
import { polarClient } from "./polar";
import { updatePolarCustomerId, updateUserTier } from "./subscription";

export const auth = betterAuth({
    database: prismaAdapter(client, {
        provider: "postgresql",
    }),

    socialProviders: {
        github: {
            clientId: process.env.GITHUB_CLIENT_ID!,
            clientSecret: process.env.GITHUB_CLIENT_SECRET!,
            scope: ["repo"]
        }
    },

    plugins: [
        polar({
            client: polarClient,
            createCustomerOnSignUp: true,
            use: [
                checkout({
                    products: [
                        {
                            productId: "207870f2-f1bb-4f96-9b7d-1eaae7268769",
                            slug: "Lavendar", // Custom slug for easy reference in Checkout URL, e.g. /checkout/a-new-saas
                        },
                    ],
                    successUrl: process.env.POLAR_SUCCESS_URL,
                    authenticatedUsersOnly: true,
                }),
                portal({
                    returnUrl: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000/dashboard",
                }),
                usage(),
                webhooks({
                    secret: process.env.POLAR_WEBHOOK_SECRET!,
                    onSubscriptionActive: async (payload) => {
                        const customerId = payload.data.customerId;

                        const user = await client.user.findUnique({
                            where: {
                                polarCustomerId: customerId,
                            }
                        })

                        if (user) {
                            return updateUserTier(user.id, "PRO", "ACTIVE", payload.data.id);
                        }
                    },
                    onSubscriptionCanceled: async (payload) => {
                        const customerId = payload.data.customerId;

                        const user = await client.user.findUnique({
                            where: {
                                polarCustomerId: customerId,
                            }
                        })

                        if (user) {
                            return updateUserTier(user.id, user.subscriptionTier as any, "CANCELED");
                        }
                    },
                    onSubscriptionRevoked: async (payload) => {
                        const customerId = payload.data.customerId;

                        const user = await client.user.findUnique({
                            where: {
                                polarCustomerId: customerId,
                            }
                        })

                        if (user) {
                            return updateUserTier(user.id, "FREE", "EXPIRED");
                        }
                    },
                    onOrderPaid: async () => { },
                    onCustomerCreated: async (payload) => {
                        const user = await client.user.findUnique({
                            where: {
                                email: payload.data.email,
                            }
                        })

                        if (user) {
                            return updatePolarCustomerId(user.id, payload.data.id);
                        }
                    },
                })
            ],
        }),
    ],
});

