
'use client';
import { useTodos } from '@/hooks/rest-api.query';
import React from 'react';


const TodoDetails: React.FC<{ id: string }> = ({ id }) => {


  
  const { isFetching: isTodoFetching, data: todoData } = useTodos({pathParam : id});




  if (isTodoFetching) return <div>Loading...</div>;


  return (
    <div>{(todoData as unknown as object).toString()}</div>
  );
};

export default TodoDetails;