// hooks/useTodos.ts
import { useQuery } from '@tanstack/react-query';

const fetchTodos: (queryString : string) => Promise<unknown> = async (queryString : string) => {

    const url = queryString.length ? `/api/todo?${queryString}` : '/api/todo';
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

export const useTodos = (queryString = '') => {
    return useQuery({
        queryKey: ['todos',queryString],
        queryFn: () =>  fetchTodos(queryString),
    });
};

export const useUsers = () => {
    return useQuery({
        queryKey: ['users'],
        queryFn: fetchUsers,
    });
};