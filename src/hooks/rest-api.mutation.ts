// hooks/useUpdateTodo.ts
import { CreateTodoType, CreateUser, LoginUser, TodoSubTaskType, TodoTaskType, TodoType } from '@/app/ui/todoCard/TodoCard.model';
import { User } from '@/models/User';
import { useMutation } from '@tanstack/react-query';

const updateTodo = async (id: number, todo: Partial<TodoType>) => {
    const response = await fetch(`/api/todo/${id}`, {
        method: 'PUT', // Use PUT for updates
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ todo }), // Pass the updated status in the request body
    });

    if (!response.ok) {
        throw new Error('Failed to update todo');
    }

    const data = await response.json();
    return data; // Adjust based on your API response structure
};

const createTodo = async (todo: CreateTodoType) => {
    const { type, subType } = todo; // Use subTaskType instead of subType
    let endpoint = '';

    // Determine the endpoint based on type and subTaskType
    if (type === TodoTaskType.TASK) {
        if (subType === TodoSubTaskType.BUG) {
            endpoint = '/api/bug';
        } else if (subType === TodoSubTaskType.FEATURE) {
            endpoint = '/api/feature';
        } else {
            throw new Error('Invalid subTaskType for TASK');
        }
    } else if (type === TodoTaskType.EPIC) {
        endpoint = '/api/epic';
    } else if (type === TodoTaskType.STORY) {
        endpoint = '/api/story';
    } else {
        throw new Error('Invalid task type');
    }

    // Make the fetch request to the determined endpoint
    const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(todo), // Pass the todo object in the request body
    });

    if (!response.ok) {
        throw new Error('Failed to create todo');
    }

    const data = await response.json();
    return data; // Adjust based on your API response structure
};

export const useUpdateTodo = (onSuccess?: () => void) => {
    return useMutation({
        onSuccess: () => {
            // Handle success here
            // Call the onSuccess callback if provided
            if (onSuccess) {
                onSuccess();
            }
        },
        mutationFn: ({ id, todo }: { id: number; todo: Partial<TodoType> }) => updateTodo(id, todo),
    });
};

export type TodoResponse = {
    id: number; // or number
    title: string;
    createdAt: string;
    updatedAt: string;
    assignedTo : User;
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

const createUser = async (todo : CreateUser) => {
    const response = await fetch('/api/user', {
        method: 'POST', 
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(todo), // Pass the updated status in the request body
    });

    if (!response.ok) {
        throw new Error('Failed to create user');
    }

    const data = await response.json();
    return data.data; // Adjust based on your API response structure
};

const loginUser = async (todo : LoginUser) => {
    const response = await fetch('/api/user', {
        method: 'POST', 
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(todo), // Pass the updated status in the request body
    });

    if (!response.ok) {
        throw new Error('Failed to login user');
    }

    const data = await response.json();
    return data.data; // Adjust based on your API response structure
};


export const useCreateUser = (onSuccess?: () => void,onError?: () => void) => {
    return useMutation<User, Error, CreateUser>({
        mutationFn: (todo : CreateUser) => createUser(todo),
        onSuccess: () => {
            // Handle success here
            // Call the onSuccess callback if provided
            if (onSuccess) {
                onSuccess();
            }
        },
        onError: () => {
            // Handle error here
            onError?.();
        },
    });
};

export const useLoginUser = (onSuccess?: (data: User) => void, onError?: () => void) => {
    return useMutation<User, Error, LoginUser>({
        mutationFn: (todo : LoginUser) => loginUser(todo),
        onSuccess: (data) => {
            // Handle success here
            // Call the onSuccess callback if provided
            if (onSuccess) {
                onSuccess(data);
            }
        },
        onError: () => {
            // Handle error here
            if(onError) {
            onError?.();
            }
        },
    });
};

