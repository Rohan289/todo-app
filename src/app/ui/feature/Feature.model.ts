import { StoryType } from "../story/Story.model";
import { TodoPriority, TodoStatus, UserType } from "../todoCard/TodoCard.model";

export interface FeatureType {
    id: number;
    title: string;
    formattedId : string;
    content : string;
    assignedTo : Partial<UserType>;
    story : Partial<StoryType>;
    createdAt:string; 
    priority : TodoPriority;
    status : TodoStatus;
}