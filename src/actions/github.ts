"use server";

import { Octokit } from "octokit";
import { auth } from "@/lib/auth";
import client from "@/lib/db";
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
        contributionsCollection: {
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
    query($username: String!){
        user(login: $username){
            contributionsCollection{
                contributionCalendar{
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
    }
    `;

    try {
        const response: ContributionData = await octokit.graphql(query, {
            username: username
        });

        return response.user.contributionsCollection.contributionCalendar;
    } catch (e) {
        console.log(e)
    }
};

export const getRepository = async (page: number = 1, perPage = 10) => {
    const token = await getGithubToken();
    const octokit = new Octokit({ auth: token });

    const { data } = await octokit.rest.repos.listForAuthenticatedUser({
        sort: "updated",
        direction: "desc",
        visibility: "all",
        per_page: perPage,
        page: page,
    });

    return data;
}