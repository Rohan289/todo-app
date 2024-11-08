// hooks/useTodos.ts
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
}

export const useTodos = ({ queryString = '', pathParam = '' }: UseTodosParams = {}) => {
    return useQuery({
        queryKey: ['todos', queryString, pathParam], // Include pathParam in the query key
        queryFn: () => fetchTodos(queryString, pathParam), // Pass both parameters to the fetch function
    });
};

export const useUsers = () => {
    return useQuery({
        queryKey: ['users'],
        queryFn: fetchUsers,
    });
};