import { reviewPullRequest } from "@/actions/rag";
import { NextResponse, NextRequest } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const event = req.headers.get("x-github-event");

        if (event === "ping") {
            return NextResponse.json({
                message: "Pong"
            }, {
                status: 200
            });
        };

        if (event === "pull_request") {
            const action = body.action;
            const repo = body.repository.full_name;
            const prNumber = body.number;

            const [owner, repoName] = repo.split("/");

            if (action === "opened" || action === "synchronize") {
                reviewPullRequest(owner, repoName, prNumber)
                    .then(() => {
                        console.log(`Review completed for ${repo} #${prNumber}`);
                    })
                    .catch((err: any) => {
                        console.error(`Review Failed PR ${repo} #${prNumber}:`, err);
                    }
                );
            }
        };

        // TODO: Handle PR later!

        return NextResponse.json({
            message: "Event Processes"
        }, {
            status: 200
        });
    } catch (e) {
        console.error(e);
        return NextResponse.json({
            error: "internal server error",
        }, {
            status: 500
        })
    }
};