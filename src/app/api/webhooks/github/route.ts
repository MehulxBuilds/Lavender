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