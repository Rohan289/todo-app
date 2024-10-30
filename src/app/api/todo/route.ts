    import { TodoRepository } from "@/app/repositories/todoRepository";
import { initializeDb } from "@/typeorm/datasource";
import { NextRequest, NextResponse } from "next/server";

   export async function GET() {
    await initializeDb(); // Ensure the database is initialized
    const todos = await TodoRepository.getAllTodos();
     return NextResponse.json({
        data : todos
     })
   }

   export async function POST(req : NextRequest) {
    await initializeDb(); // Ensure the database is initialized
    const body = await req.json();
    const todo = await TodoRepository.createTodo(body);
     return NextResponse.json({
       data : todo
     })
   }