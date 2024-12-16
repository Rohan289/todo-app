import { addClient, removeClient } from '@/app/api/sseEvent';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
    const stream = new ReadableStream<string>({
        start(controller) {
            // Add the client
            const clientId = addClient(controller);

            // Handle connection close
            req.signal.addEventListener('abort', () => {
                removeClient(clientId);
            });

            // Keep the connection alive
            const intervalId = setInterval(() => {
                controller.enqueue(`: keep-alive\n\n`);
            }, 30000);

            // Cleanup on abort
            req.signal.addEventListener('abort', () => {
                clearInterval(intervalId);
            });
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