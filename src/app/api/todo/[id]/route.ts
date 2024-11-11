import { TodoRepository } from '@/repositories/todoRepository';
import { initializeDb } from '@/typeorm/datasource';
import { NextRequest, NextResponse } from 'next/server';



export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    await initializeDb();
  const todoId = params.id;

  try {
    // Parse the request body to get the new status
    const { todo } = await req.json();
    const updatedTodo = await TodoRepository.updateTodo(parseInt(todoId), todo);

    return NextResponse.json({ todo: updatedTodo }, { status: 200 });
  } catch (error : unknown ) {
    console.log('error',error);
    return NextResponse.json({ message: 'Error updating todo' }, { status: 500 });
  }
}

export async function GET(request: NextRequest,{ params }: { params: { id: string } }) {
  await initializeDb();

  const todoId = params.id;

  const filters = {
    id: todoId ? parseInt(todoId) : undefined, // Parse the id as an integer
  };

  const todo = (await TodoRepository.getAllTodos()).find(todo =>
    (!filters.id || todo.id === filters.id) 
    
  );

  return NextResponse.json({ data: todo });
}