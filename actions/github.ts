"use server";

import { Octokit } from "octokit";
import { auth } from "../src/lib/auth";
import client from "../src/lib/db";
import { headers } from "next/headers";

export const getGithubToken = async () => {
    const session = await auth.api.getSession({
        headers: await headers()
    })

    if (!session) {
        throw new Error("Unauthorized");
    }

    const account = await client.account.findFirst({
        where: {
            userId: session.user.id,
            providerId: "github"
        }
    })

    if (!account?.accessToken) {
        throw new Error("No github access token found");
    }

    return account.accessToken;
};

interface ContributionData {
    user: {
        contributionCollection: {
            contributionCalendar: {
                totalContributions: number,
                weeks: {
                    contributionDays: {
                        contributionCount: number,
                        date: string | Date,
                        color: string
                    }
                }
            }
        }
    }
};

export async function fetchUserContribution(token: string, username: string) {
    const octokit = new Octokit({ auth: token });

    const query = `
    query($username:String!){
        user(login:$username){
            contributionCollection{
                totalContributions
                weeks{
                    contributionDays{
                        contributionCount
                        date
                        color
                    }
                }
            }
        }
    }
    `;

    try {
        const response: ContributionData = await octokit.graphql(query, {
            username
        });

        return response.user.contributionCollection.contributionCalendar;
    } catch (e) {
        console.log(e)
    }
};