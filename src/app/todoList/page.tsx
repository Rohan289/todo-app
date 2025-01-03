'use client';
import React, { Suspense } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import TodoList from '../ui/todoList/TodoList';
import styles from './page.module.css';


const TodoListPage: React.FC = () => {
    const queryClient = new QueryClient(); // Initialize QueryClient here

    return (
        
        <DndProvider backend={HTML5Backend}>
            <QueryClientProvider client={queryClient}>
            <div className={styles.todoListContainer}>
            <h1>Your Todo List:</h1>
            <Suspense fallback={<div>Loading...</div>}>
            <TodoList />
            </Suspense>
            </div>
            </QueryClientProvider>
        </DndProvider>
    );
};

export default TodoListPage;