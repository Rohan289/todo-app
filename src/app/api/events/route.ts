import { addClient } from '@/lib/sseHelper';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic'; // Ensures this API route is always dynamically rendered

export async function GET(req: Request) {
    const stream = new ReadableStream<string>({
        start(controller) {
            addClient(controller, req.signal);

            // Send an initial message to confirm the connection
            controller.enqueue(`data: ${JSON.stringify({ message: 'Connected to SSE' })}\n\n`);
        },
    });

    return new NextResponse(stream, {
        headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
        },
    });
}