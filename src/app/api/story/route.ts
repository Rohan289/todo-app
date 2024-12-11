import { StoryRepository } from "@/repositories/storyRepository";
import { initializeDb } from "@/typeorm/typeorm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request : NextRequest) {
    await initializeDb();
  
    // Get the query parameters from the request
    const { searchParams } = new URL(request.url);
    const epicId = searchParams.get('epicId'); // Get the epicId from query params
  
    let stories;
  
    if (epicId) {
      // If epicId is provided, fetch stories by epicId
      stories = await StoryRepository.getStoriesByEpicId(epicId);
    } else {
      // Otherwise, fetch all stories
      stories = await StoryRepository.getAllStory();
    }
  
    return NextResponse.json({ data: stories });
  }

   export async function POST(req : NextRequest) {
    await initializeDb(); // Ensure the database is initialized
    const body = await req.json();
    const story = await StoryRepository.createStory(body);
     return NextResponse.json({
       data : story
     })
   }