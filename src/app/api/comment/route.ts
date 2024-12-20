import { TodoTaskType, TodoSubTaskType } from "@/app/ui/todoCard/TodoCard.model";
import { BugRepository } from "@/repositories/bugRepository";
import { CommentRepository } from "@/repositories/commentRepository";
import { EpicRepository } from "@/repositories/epicRepository";
import { FeatureRepository } from "@/repositories/featureRepository";
import { StoryRepository } from "@/repositories/storyRepository";
import { TodoRepository } from "@/repositories/todoRepository";
import { initializeDb } from "@/typeorm/typeorm";
import { NextRequest } from "next/dist/server/web/spec-extension/request";
import { NextResponse } from "next/server";

 export async function POST(req: NextRequest) {
  await initializeDb(); // Ensure the database is initialized
  const body = await req.json();
  const { todoData, comment } = body;
  const todoId = todoData.formattedId;
  const type = await TodoRepository.findIdType(todoData.formattedId);
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

  if (!todo) {
      return NextResponse.json({ error: 'Todo not found' }, { status: 404 });
  }

  const commentData = await CommentRepository.createComment(comment, todo);
   return NextResponse.json({
     data : commentData
   })
}