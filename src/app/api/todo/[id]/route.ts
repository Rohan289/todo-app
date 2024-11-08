// import { NextRequest } from "next/server";

//     export async function PATCH(req : NextRequest,)


import { TodoRepository } from '@/repositories/todoRepository';
import { initializeDb } from '@/typeorm/datasource';
import { NextRequest, NextResponse } from 'next/server';



export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    await initializeDb();
  const todoId = params.id;

  try {
    // Parse the request body to get the new status
    const { status } = await req.json();

    // if (typeof status !== 'boolean') {
    //   return NextResponse.json({ message: 'Invalid status' }, { status: 400 });
    // }

    // Call the function to update the todo in the database
    const updatedTodo = await TodoRepository.updateTodo(parseInt(todoId), status);

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