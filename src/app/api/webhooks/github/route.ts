import { rateLimitResponse } from "@/lib/rate-limit";
import { reviewPullRequest } from "@/actions/rag";
import { NextResponse, NextRequest } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const text = await req.text();

        if (!text) {
            return new Response("ok");
        }

        const body = JSON.parse(text);

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
                await reviewPullRequest(owner, repoName, prNumber);
            }
        };

        // TODO: Handle PR later!

        return NextResponse.json({
            message: "Event Processes"
        }, {
            status: 200
        });
    } catch (e) {
        const limited = rateLimitResponse(e);
        if (limited) return limited;
        console.error(e);
        return NextResponse.json({
            error: "internal server error",
        }, {
            status: 500
        })
    }
};