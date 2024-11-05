// hooks/useUpdateTodo.ts
import { CreateTodoType, TodoStatus } from '@/app/ui/todoCard/TodoCard.model';
import { useMutation } from '@tanstack/react-query';

const updateTodo = async (id: number, status: TodoStatus) => {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    const response = await fetch(`${baseUrl}/api/todo/${id}`, {
        method: 'PUT', // Use PUT for updates
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }), // Pass the updated status in the request body
    });

    if (!response.ok) {
        throw new Error('Failed to update todo');
    }

    const data = await response.json();
    return data; // Adjust based on your API response structure
};

const createTodo = async (todo : CreateTodoType) => {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    const response = await fetch(`${baseUrl}/api/todo`, {
        method: 'POST', 
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(todo), // Pass the updated status in the request body
    });

    if (!response.ok) {
        throw new Error('Failed to create todo');
    }

    const data = await response.json();
    return data; // Adjust based on your API response structure
};

export const useUpdateTodo = () => {
    return useMutation({
        mutationFn: ({ id, status }: { id: number; status: TodoStatus }) => updateTodo(id, status),
    });
};

export const useCreateTodo = () => {
    return useMutation({
        mutationFn: (todo : CreateTodoType) => createTodo(todo),
    });
};