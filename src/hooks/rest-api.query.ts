// hooks/useTodos.ts
import { TodoTaskType, TodoSubTaskType } from '@/app/ui/todoCard/TodoCard.model';
import { useQuery } from '@tanstack/react-query';


const fetchAllTodos: (queryString : string,pathParam: string) => Promise<unknown> = async (queryString : string,pathParam: string) => {
    let url = `/api/todo`;
    if(pathParam){
        url = `${url}/${pathParam}`;
    }
    if(queryString){
        url = `${url}?${queryString}`;
    }
    const response = await fetch(url, {
        cache: 'no-store',
    });

    if (!response.ok) {
        throw new Error('Failed to fetch todos');
    }

    const data = await response.json();
    return data.data; // Adjust based on your API response structure
};
const fetchComments = async (pathParam: string) => {
    const url = `/api/comment/${pathParam}`;
    try {
        const response = await fetch(url, {
            cache: 'no-store',
        });

        if (!response.ok) {
            throw new Error(`Error fetching comments: ${response.statusText}`);
        }

        const data = await response.json();

        // Check if data.data exists
        return data.data || []; // Return an empty array if data.data is undefined
    } catch (error) {
        console.error('Failed to fetch comments:', error);
        return []; // Return an empty array on error
    }
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

const fetchChildTasks: (storyId: string) => Promise<unknown> = async (storyId: string) => {

    const url = `/api/story/childTask/${storyId}`;
    const response = await fetch(url, {
        cache: 'no-store',
    });

    if (!response.ok) {
        throw new Error('Failed to fetch todos');
    }

    const data = await response.json();
    return data.data; // Adjust based on your API response structure
};

const fetchChildStories: (epicId: string) => Promise<unknown> = async (epicId: string) => {

    const url = `/api/epic/childStory/${epicId}`;
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

export const useComments = ({ pathParam = '' }: {pathParam : string}) => {
    return useQuery({
        queryKey: ['comments'],
        queryFn: () => fetchComments(pathParam) 
        
    });
};

export const useUsers = () => {
    return useQuery({
        queryKey: ['users'],
        queryFn: fetchUsers,
    });
};

export const useChildTasks = <T> (enableQuery : boolean, storyId : string,onSuccess?:() => void, onFailure?:() => void) => {
    const options = {
        enabled : enableQuery,
        onSuccess : () => {
            onSuccess?.();
        },
        onFailure : () => {
            onFailure?.();
        }
    }
    return useQuery({
        queryKey: ['childTasks', storyId],
        queryFn: () => fetchChildTasks(storyId) as Promise<T>,
        ...options
    });
  };

  export const useChildStories = <T> (enableQuery : boolean, epicId : string,onSuccess?:() => void, onFailure?:() => void) => {
    const options = {
        enabled : enableQuery,
        onSuccess : () => {
            onSuccess?.();
        },
        onFailure : () => {
            onFailure?.();
        }
    }
    return useQuery({
        queryKey: ['childStories', epicId],
        queryFn: () => fetchChildStories(epicId) as Promise<T>,
        ...options
    });
  };