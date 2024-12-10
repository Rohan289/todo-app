import { TodoSubTaskType, TodoTaskType } from '@/app/ui/todoCard/TodoCard.model';
import { BugRepository } from '@/repositories/bugRepository';
import { EpicRepository } from '@/repositories/epicRepository';
import { FeatureRepository } from '@/repositories/featureRepository';
import { StoryRepository } from '@/repositories/storyRepository';
import { TodoRepository } from '@/repositories/todoRepository';
import { initializeDb } from '@/typeorm/typeorm';
import { NextRequest, NextResponse } from 'next/server';



export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    await initializeDb();
  const todoId = params.id;

  try {
    // Parse the request body to get the new status
    const { todo } = await req.json();
    const updatedTodo = await TodoRepository.updateTodo(parseInt(todoId), todo);

    return NextResponse.json({ todo: updatedTodo }, { status: 200 });
  } catch (error : unknown ) {
    console.log('error',error);
    return NextResponse.json({ message: 'Error updating todo' }, { status: 500 });
  }
}

export async function GET(request: NextRequest,{ params }: { params: { id: string } }) {
  await initializeDb();
  const todoId = params.id;
  const { searchParams } = new URL(request.url);




  if (searchParams && searchParams.get('findBy') === 'true') {
    const type = await TodoRepository.findIdType(todoId);
    let todo;
    switch (type) {
      case TodoTaskType.EPIC:
        todo = await EpicRepository.getAllEpics().then(epics => epics.find(epic => epic.formattedId === todoId));
        break;
      case TodoSubTaskType.FEATURE:
        todo = await FeatureRepository.getAllFeatures().then(features => features.find(feature => feature.formattedId === todoId));
        break;
      case TodoTaskType.STORY:
        todo = await StoryRepository.getAllStory().then(stories => stories.find(story => story.formattedId === todoId));
        break;
      case TodoSubTaskType.BUG:
        todo = await BugRepository.getAllBugs().then(bugs => bugs.find(bug => bug.formattedId === todoId));
        break;
      default:
        return NextResponse.json({ error: 'Todo not found' }, { status: 404 });
    }
    
    return NextResponse.json({ data: {...todo , type : type} });
  } else {
    const filters = {
      id: todoId ? parseInt(todoId) : undefined, // Parse the id as an integer
    };
    const todo = (await TodoRepository.getAllTodos()).find(todo =>
      (!filters.id || todo.id === filters.id)
    );
    return NextResponse.json({ data: todo });
  }
}