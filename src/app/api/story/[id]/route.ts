import { STATUS_PRIORITY } from '@/app/ui/filter/Filter.util';
import { TodoStatus } from '@/app/ui/todoCard/TodoCard.model';
import { broadcastEvent } from '@/lib/sseHelper';
import { Epic } from '@/models/Epic';
import { EpicRepository } from '@/repositories/epicRepository';
import { StoryRepository } from '@/repositories/storyRepository';
import { initializeDb } from '@/typeorm/typeorm';
import { NextRequest, NextResponse } from 'next/server';



export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    await initializeDb();
  const storyId = params.id;

  try {
    // Parse the request body to get the new status
    const { todo } = await req.json();
    const fetchedTodo = await StoryRepository.getStoryById(storyId);
    const updatedStory = await StoryRepository.updateStory(parseInt(storyId), todo);
    const newStatusPriority = STATUS_PRIORITY[todo?.status as TodoStatus];
    if (newStatusPriority < STATUS_PRIORITY[fetchedTodo?.status as TodoStatus]) {
       const epic = await EpicRepository.getEpicById(fetchedTodo?.epic?.id.toString() || '0');
      broadcastEvent({type : 'STORY_UPDATE',payload : {newStatus :  todo.status as TodoStatus, epic : epic as Epic}});
    }
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