'use client';
import React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import TodoList from '../ui/todoList/TodoList';



const TodoListPage: React.FC = () => {
    const queryClient = new QueryClient(); // Initialize QueryClient here

    return (
        
        <DndProvider backend={HTML5Backend}>
            <QueryClientProvider client={queryClient}>
            <TodoList />
            </QueryClientProvider>
        </DndProvider>
    );
};

export default TodoListPage;