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

    trustedOrigins: [process.env.NEXT_PUBLIC_APP_BASE_URL!],

    plugins: [
        polar({
            client: polarClient,
            createCustomerOnSignUp: true,
            use: [
                checkout({
                    products: [
                        {
                            productId: "d777e3e8-fc3a-46db-94ff-0282b391d053",
                            slug: "pro", // Custom slug for easy reference in Checkout URL, e.g. /checkout/a-new-saas
                        },
                    ],
                    successUrl: process.env.POLAR_SUCCESS_URL || "/dashboard/subscription?success=true",
                    authenticatedUsersOnly: true,
                }),
                portal({
                    returnUrl: process.env.PORTAL_RETURN_URL || "http://localhost:3000/dashboard",
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

