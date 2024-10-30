// hooks/useTodos.ts
import { useQuery } from '@tanstack/react-query';

const fetchTodos: () => Promise<unknown> = async () => {

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    console.log('enter',baseUrl);
    const response = await fetch(`${baseUrl}/api/todo`, {
        cache: 'no-store',
    });

    if (!response.ok) {
        throw new Error('Failed to fetch todos');
    }

    const data = await response.json();
    return data.data; // Adjust based on your API response structure
};
export const useTodos = () => {
    return useQuery({
        queryKey: ['todos'],
        queryFn: fetchTodos,
    });
};