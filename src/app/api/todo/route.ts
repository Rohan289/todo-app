import { transformData } from "@/app/ui/filter/Filter.util";
import { TodoRepository } from "@/repositories/todoRepository";
import { initializeDb } from "@/typeorm/typeorm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  await initializeDb();
  const { searchParams } = new URL(request.url);
  const filters = {
    status: searchParams.get('status')?.toLowerCase(),
    priority: searchParams.get('priority')?.toLowerCase(),
    assignedTo: searchParams.get('assignedTo') ? decodeURIComponent(decodeURIComponent(searchParams.get('assignedTo') as string))?.toLowerCase() : undefined
  };

  const todoList = await  TodoRepository.fetchAllItems();
  const todos = transformData(todoList).filter(todo => 
    (!filters.status || (todo.status && todo.status.toLowerCase() === filters.status)) &&
    (!filters.priority || (todo.priority && todo.priority.toLowerCase() === filters.priority)) &&
    (!filters.assignedTo || todo.assignedTo.id.toString() === filters.assignedTo)
  );
  return NextResponse.json({ data: todos });
}

   export async function POST(req : NextRequest) {
    await initializeDb(); // Ensure the database is initialized
    const body = await req.json();
    const todo = await TodoRepository.createTodo(body);
     return NextResponse.json({
       data : todo
     })
   }