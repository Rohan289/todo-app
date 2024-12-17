import { STATUS_PRIORITY } from "@/app/ui/filter/Filter.util";
import { TodoStatus } from "@/app/ui/todoCard/TodoCard.model";
import { broadcastEvent } from "@/lib/sseHelper";
import { Epic } from "@/models/Epic";
import { Story } from "@/models/Story";
import { EpicRepository } from "@/repositories/epicRepository";
import { FeatureRepository } from "@/repositories/featureRepository";
import { StoryRepository } from "@/repositories/storyRepository";
import { initializeDb } from "@/typeorm/typeorm";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    await initializeDb();
  const todoId = params.id;

  try {
    // Parse the request body to get the new status
    const { todo } = await req.json();
    const fetchedTodo = await FeatureRepository.getFeatureById(todoId);
    const newStatusPriority = STATUS_PRIORITY[todo?.status as TodoStatus];
    const updatedTodo = await FeatureRepository.updateFeature(parseInt(todoId), todo);
    if (newStatusPriority < STATUS_PRIORITY[fetchedTodo?.status as TodoStatus]) {
        const story = await StoryRepository.getStoryById(fetchedTodo?.storyId?.toString()  || '');
        const epic = await EpicRepository.getEpicById(story?.epic?.id.toString() || '0');
        broadcastEvent({type : 'TASK_UPDATE',payload : {newStatus :  todo.status as TodoStatus,story : story as Story , epic : epic as Epic}});
      }
    return NextResponse.json({ todo: updatedTodo }, { status: 200 });
  } catch (error : unknown ) {
    console.log('error',error);
    return NextResponse.json({ message: 'Error updating todo' }, { status: 500 });
  }
}