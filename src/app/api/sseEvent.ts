'use server';
import { TodoStatus } from '@/app/ui/todoCard/TodoCard.model';

export interface EventData {
    type: string;
    newStatus: TodoStatus;
    storyId?: number;
    epicId?: number;
}

interface Client {
    controller: ReadableStreamDefaultController<string>;
    id: number;
}

let clients: Client[] = [];
let clientId = 0;

// Add a client
export const addClient = (controller: ReadableStreamDefaultController<string>): number => {
    const id = clientId++;
    clients.push({ controller, id });
    return id;
};

// Remove a client
export const removeClient = (id: number) => {
    clients = clients.filter(client => client.id !== id);
};

// Send an event to all clients
export const sendEvent = (data: EventData) => {
    clients.forEach(client => {
        client.controller.enqueue(`data: ${JSON.stringify(data)}\n\n`);
    });
};

// Update task and notify clients
export const updateTask = (status: TodoStatus, storyId: number, epicId: number): void => {
    sendEvent({
        type: 'TASK_UPDATE',
        newStatus: status,
        storyId: storyId,
        epicId: epicId,
    });
};