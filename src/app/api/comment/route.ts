import { CommentRepository } from "@/repositories/commentRepository";
import { initializeDb } from "@/typeorm/typeorm";
import { NextRequest } from "next/dist/server/web/spec-extension/request";
import { NextResponse } from "next/server";

 export async function POST(req: NextRequest) {
  await initializeDb(); // Ensure the database is initialized
  const body = await req.json();
  const { comment } = body;
  

  const commentData = await CommentRepository.createComment(comment);
   return NextResponse.json({
     data : commentData
   })
}