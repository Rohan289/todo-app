import { BugRepository } from "@/repositories/bugRepository";
import { initializeDb } from "@/typeorm/typeorm";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  await initializeDb();
  const bugs = await BugRepository.getAllBugs();
  return NextResponse.json({ data: bugs });
}

   export async function POST(req : NextRequest) {
    await initializeDb(); // Ensure the database is initialized
    const body = await req.json();
    const bug = await BugRepository.createBug(body);
     return NextResponse.json({
       data : bug
     })
   }