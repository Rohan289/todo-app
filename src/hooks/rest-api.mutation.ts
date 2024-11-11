// hooks/useUpdateTodo.ts
import { CreateTodoType, TodoStatus } from '@/app/ui/todoCard/TodoCard.model';
import { User } from '@/models/User';
import { useMutation } from '@tanstack/react-query';

const updateTodoStatus = async (id: number, status: TodoStatus) => {
    const response = await fetch(`/api/todo/${id}`, {
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
    const response = await fetch('/api/todo', {
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

export const useUpdateTodoStatus = () => {
    return useMutation({
        mutationFn: ({ id, status }: { id: number; status: TodoStatus }) => updateTodoStatus(id, status),
    });
};

export type TodoResponse = {
    id: number; // or number
    title: string;
    createdAt: string;
    updatedAt: string;
    createdBy : User;
    content : string;
};

export const useCreateTodo = (onSuccess?: (data: TodoResponse) => void) => {
    return useMutation<TodoResponse, Error, CreateTodoType>({
        mutationFn: (todo : CreateTodoType) => createTodo(todo),
        onSuccess: (data) => {
            // Handle success here
            // Call the onSuccess callback if provided
            if (onSuccess) {
                onSuccess(data);
            }
        },
        onError: (error : Error) => {
            // Handle error here
            console.error('Error creating todo:', error);
        },
    });
};