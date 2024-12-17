import { STATUS_PRIORITY } from "@/app/ui/filter/Filter.util";
import { TodoStatus } from "@/app/ui/todoCard/TodoCard.model";
import { BugRepository } from "@/repositories/bugRepository";
import { initializeDb } from "@/typeorm/typeorm";
import { NextRequest, NextResponse } from "next/server";
import { StoryRepository } from "@/repositories/storyRepository";
import { broadcastEvent } from "@/lib/sseHelper";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    await initializeDb();
  const todoId = params.id;

  try {
    // Parse the request body to get the new status
    const { todo } = await req.json();
    const fetchedTodo = await BugRepository.getBugById(todoId);
    const updatedTodo = await BugRepository.updateBug(parseInt(todoId), todo);
    const newStatusPriority = STATUS_PRIORITY[todo?.status as TodoStatus];
    if (newStatusPriority < STATUS_PRIORITY[fetchedTodo?.status as TodoStatus]) {
       const story = await StoryRepository.getStoryById(fetchedTodo?.storyId?.toString()  || '');
      broadcastEvent({type : 'TASK_UPDATE',payload : {newStatus :  updatedTodo.status as TodoStatus,storyId : parseInt(story?.id.toString() || '0') , epicId : parseInt(story?.epic?.id.toString() || '0')}});
    }
    return NextResponse.json({ todo: updatedTodo }, { status: 200 });
  } catch (error : unknown ) {
    console.log('error',error);
    return NextResponse.json({ message: 'Error updating todo' }, { status: 500 });
  }
}