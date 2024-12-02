import { StoryRpository } from "@/repositories/storyRepository";
import { initializeDb } from "@/typeorm/typeorm";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  await initializeDb();
  const stories = await StoryRpository.getAllStory();
  return NextResponse.json({ data: stories });
}

   export async function POST(req : NextRequest) {
    await initializeDb(); // Ensure the database is initialized
    const body = await req.json();
    const story = await StoryRpository.createStory(body);
     return NextResponse.json({
       data : story
     })
   }