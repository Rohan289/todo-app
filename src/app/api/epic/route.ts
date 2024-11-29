import { EpicRepository } from "@/repositories/epicRepository";
import { initializeDb } from "@/typeorm/typeorm";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  await initializeDb();
  const epics = await EpicRepository.getAllEpics();
  return NextResponse.json({ data: epics });
}

   export async function POST(req : NextRequest) {
    await initializeDb(); // Ensure the database is initialized
    const body = await req.json();
    const epic = await EpicRepository.createEpic(body);
     return NextResponse.json({
       data : epic
     })
   }