import { StoryType } from "../story/Story.model";
import { TodoPriority, TodoStatus, UserType } from "../todoCard/TodoCard.model";

export interface BugType {
    id: number;
    title: string;
    content : string;
    assignedTo : Partial<UserType>;
    story : Partial<StoryType>;
    createdAt:string; 
    priority : TodoPriority;
    status : TodoStatus;
}