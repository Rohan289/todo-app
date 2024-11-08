'use client';
import TodoDetails from '@/app/ui/todoDetails/TodoDetails';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';

interface TodoDetailsPageProps {
  params: {
    id: string; // or number if you expect it to be a number
  };
}

const TodoDetailsPage: React.FC<TodoDetailsPageProps> = ({ params }) => {
  const queryClient = new QueryClient(); // Initialize QueryClient here
  const {id } = params;




  return (
      <QueryClientProvider client={queryClient}>
      <TodoDetails id={id} />
      </QueryClientProvider>
  );
};

export default TodoDetailsPage;