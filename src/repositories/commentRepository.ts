import { AppDataSource } from "@/typeorm/typeorm";
import { Comment } from "@/models/Comment";
import { Feature } from "@/models/Feature";
import { Epic } from "@/models/Epic";
import { Bug } from "@/models/Bug";
import { Story } from "@/models/Story";

const commentRepository = AppDataSource.getRepository(Comment);

export const CommentRepository = {
    async getCommentById(commentId: string): Promise<Comment | null> {
        return await commentRepository.findOneBy({id : parseInt(commentId)});       
    },
    async createComment(commentData: Omit<Comment, 'id'>,todo : Bug | Story | Feature | Epic): Promise<Comment> {
        console.log("Creating comment:", commentData);
        const comment = commentRepository.create(commentData);
        
        // Set the 'task' attribute
        comment.task = todo;

        // Save the comment to the database
        return await commentRepository.save(comment);
    }
}