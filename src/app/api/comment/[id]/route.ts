import { CommentRepository } from "@/repositories/commentRepository";
import { initializeDb } from "@/typeorm/typeorm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(_request: NextRequest,{ params }: { params: { id: string } }) {
  await initializeDb();
  const todoId = params.id;
  const comments = await CommentRepository.getCommentsByFormattedId(todoId);
  return NextResponse.json({
    data : comments
  });

}