import { AppDataSource } from "@/typeorm/typeorm";
import { Comment } from "@/models/Comment";
import { Feature } from "@/models/Feature";
import { Epic } from "@/models/Epic";
import { Bug } from "@/models/Bug";
import { Story } from "@/models/Story";
import { User } from "@/models/User";
import { TodoTaskType, TodoSubTaskType, CreateCommentType } from "@/app/ui/todoCard/TodoCard.model";

const commentRepository = AppDataSource.getRepository(Comment);
const userRepository = AppDataSource.getRepository(User);
const epicRepository = AppDataSource.getRepository(Epic);
const bugRepository = AppDataSource.getRepository(Bug);
const featureRepository = AppDataSource.getRepository(Feature);
const storyRepository = AppDataSource.getRepository(Story);

export const CommentRepository = {
    async getCommentById(commentId: string): Promise<Comment | null> {
        return await commentRepository.findOneBy({id : parseInt(commentId)});       
    },
    async createComment(commentData: CreateCommentType): Promise<Comment> {
        const user = await userRepository.findOneBy({ id: commentData.assignedTo.id });
        if (!user) {
            throw new Error("User not found");
        }
        const { type } = commentData;
        let task;
        let comment: Comment;
        switch (type) {
            case TodoTaskType.EPIC:
                task = await epicRepository.findOneBy({ id: commentData?.taskId });
                comment = commentRepository.create({ ...commentData, assignedTo: user, epic: task as Epic });
                break;
            case TodoSubTaskType.FEATURE:
                task = await featureRepository.findOneBy({ id: commentData?.taskId });
                comment = commentRepository.create({ ...commentData, assignedTo: user, feature: task as Feature });
                break;
            case TodoTaskType.STORY:
                task = await storyRepository.findOneBy({ id: commentData?.taskId });
                comment = commentRepository.create({ ...commentData, assignedTo: user, story: task as Story });
                break;
            case TodoSubTaskType.BUG:
                task = await bugRepository.findOneBy({ id: commentData?.taskId });
                comment = commentRepository.create({ ...commentData, assignedTo: user, bug: task as Bug });
                break;
            default:
                throw new Error("Invalid task type");
        }

        if (!task) {
            throw new Error("Task not found");
        }

        return await commentRepository.save(comment);
    }}