import { env } from "@/lib/env";
import "server-only";

import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import client from "./db";

export const auth = betterAuth({
    database: prismaAdapter(client, {
        provider: "postgresql",
    }),

    socialProviders: {
        github: {
            clientId: env.GITHUB_CLIENT_ID,
            clientSecret: env.GITHUB_CLIENT_SECRET,
            scope: ["repo"]
        }
    },

    trustedOrigins: [env.NEXT_PUBLIC_APP_BASE_URL],

});
