import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        const { message } = await req.json();

        if (!message) {
            return NextResponse.json({ error: "Message is required" }, { status: 400 });
        }

        console.log("[SERVER LOG]:", message); // Logs appear in Vercel's Function Logs

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("[LOGGING ERROR]:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
