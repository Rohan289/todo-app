import { StoryRepository } from '@/repositories/storyRepository';
import { initializeDb } from '@/typeorm/typeorm';
import { NextRequest, NextResponse } from 'next/server';



export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    await initializeDb();
  const storyId = params.id;

  try {
    // Parse the request body to get the new status
    const { todo } = await req.json();
    const updatedStory = await StoryRepository.updateStory(parseInt(storyId), todo);

    return NextResponse.json({ story: updatedStory }, { status: 200 });
  } catch (error : unknown ) {
    console.log('error',error);
    return NextResponse.json({ message: 'Error updating story' }, { status: 500 });
  }
}

export async function GET(request: NextRequest,{ params }: { params: { id: string } }) {
  await initializeDb();

  const storyId = params.id;

  const filters = {
    id: storyId ? parseInt(storyId) : undefined, // Parse the id as an integer
  };

  const todo = (await StoryRepository.getAllStory()).find(story =>
    (!filters.id || story.id === filters.id) 
    
  );

  return NextResponse.json({ data: todo });
}