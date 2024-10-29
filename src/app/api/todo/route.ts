    import { TodoRepository } from "@/app/repositories/todoRepository";
import { initializeDb } from "@/typeorm/datasource";
import { NextRequest, NextResponse } from "next/server";

   export async function GET() {
    await initializeDb(); // Ensure the database is initialized
    console.log("%%%%%%%%%%%%%%%%%%%");
    const todos = await TodoRepository.getAllTodos();
    console.log('todos',todos);
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