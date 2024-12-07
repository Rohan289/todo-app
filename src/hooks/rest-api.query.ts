// hooks/useTodos.ts
import { TodoTaskType, TodoSubTaskType } from '@/app/ui/todoCard/TodoCard.model';
import { useQuery } from '@tanstack/react-query';

const fetchTodos: (queryString : string,pathParam: string) => Promise<unknown> = async (queryString : string,pathParam: string) => {

    const url = `/api/todo${pathParam ? `/${pathParam}` : queryString ? `?${queryString}` : ''}`;
    const response = await fetch(url, {
        cache: 'no-store',
    });

    if (!response.ok) {
        throw new Error('Failed to fetch todos');
    }

    const data = await response.json();
    return data.data; // Adjust based on your API response structure
};

const fetchAllTodos: (queryString : string,pathParam: string) => Promise<unknown> = async (queryString : string,pathParam: string) => {

    const url = `/api/todo${pathParam ? `/${pathParam}` : queryString ? `?${queryString}` : ''}`;
    const response = await fetch(url, {
        cache: 'no-store',
    });

    if (!response.ok) {
        throw new Error('Failed to fetch todos');
    }

    const data = await response.json();
    return data.data; // Adjust based on your API response structure
};



const fetchStories: (queryString : string,pathParam: string) => Promise<unknown> = async (queryString : string,pathParam: string) => {

    const url = `/api/story${pathParam ? `/${pathParam}` : queryString ? `?${queryString}` : ''}`;
    const response = await fetch(url, {
        cache: 'no-store',
    });

    if (!response.ok) {
        throw new Error('Failed to fetch todos');
    }

    const data = await response.json();
    return data.data; // Adjust based on your API response structure
};

const fetchEpics: (queryString : string,pathParam: string) => Promise<unknown> = async (queryString : string,pathParam: string) => {

    const url = `/api/epic${pathParam ? `/${pathParam}` : queryString ? `?${queryString}` : ''}`;
    const response = await fetch(url, {
        cache: 'no-store',
    });

    if (!response.ok) {
        throw new Error('Failed to fetch todos');
    }

    const data = await response.json();
    return data.data; // Adjust based on your API response structure
};

const fetchUsers: () => Promise<unknown> = async () => {

    const response = await fetch('/api/user', {
        cache: 'no-store',
    });

    if (!response.ok) {
        throw new Error('Failed to fetch users');
    }

    const data = await response.json();
    return data.data; // Adjust based on your API response structure
};

interface UseTodosParams {
    queryString?: string;
    pathParam?: string;
    type?: TodoTaskType;
    subType?:TodoSubTaskType;
}

interface UseTasksParams {
    enableQuery : boolean;
    queryString?: string;
    pathParam?: string;
    type?: TodoTaskType;
    subType?:TodoSubTaskType;
}

export const useTodos = <T>({ queryString = '', pathParam = '' }: UseTodosParams = {}) => {
    return useQuery<T, Error, T, [string, string, string]>({
        queryKey: ['todos', queryString, pathParam],
        queryFn: () => fetchAllTodos(queryString, pathParam) as Promise<T>,
    });
};

export const useStories = <T>({ enableQuery = false, queryString = '', pathParam = '' }: UseTasksParams, onSuccess?:() => void) => {
    const options = {
        enabled : enableQuery,
        onSuccess : () => {
            onSuccess?.();
        }
    }
    return useQuery({
        queryKey: ['stories', queryString, pathParam],
        queryFn: () => fetchStories(queryString, pathParam) as Promise<T>,
        ...options
    });
};

export const useEpics = <T>({ enableQuery = false, queryString = '', pathParam = '' }: UseTasksParams, onSuccess?:() => void) => {
    const options = {
        enabled : enableQuery,
        onSuccess : () => {
            onSuccess?.();
        }
    }
    return useQuery({
        queryKey: ['epics', queryString, pathParam],
        queryFn: () => fetchEpics(queryString, pathParam) as Promise<T>,
        ...options
    });
};

export const useUsers = () => {
    return useQuery({
        queryKey: ['users'],
        queryFn: fetchUsers,
    });
};