import { TodoStatus } from "@/app/ui/todoCard/TodoCard.model";
import { Epic } from "@/models/Epic";
import { Story } from "@/models/Story";

interface EventPayloadData {
    newStatus : TodoStatus;
    story? : Story;
    epic? : Epic;
}

interface EventData {
    type: string;
    payload: EventPayloadData;
}

interface Client {
    id: number;
    controller: ReadableStreamDefaultController<string>;
}

let clients: Client[] = [];
let clientIdCounter = 0;

// Function to add a client
export const addClient = (controller: ReadableStreamDefaultController<string>, signal: AbortSignal) => {
    const clientId = clientIdCounter++;
    const newClient: Client = { id: clientId, controller };
    clients.push(newClient);

    console.log(`Client ${clientId} connected. Total clients: ${clients.length}`);

    // Cleanup on client disconnect
    signal.addEventListener('abort', () => {
        clients = clients.filter((client) => client.id !== clientId);
        console.log(`Client ${clientId} disconnected. Total clients: ${clients.length}`);
    });

    return clientId;
};

// Function to broadcast events to all clients
export const broadcastEvent = (event: EventData) => {
    clients.forEach((client) => {
        console.log('broadcasting event to client',client.id);
        client.controller.enqueue(`data: ${JSON.stringify(event)}\n\n`);
    });
};