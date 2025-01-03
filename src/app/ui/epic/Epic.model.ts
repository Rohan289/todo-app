import { Comment } from "@/models/Comment";
import { TodoStatus, UserType } from "../todoCard/TodoCard.model";

export interface EpicType {
    id: number;
    formattedId : string;
    title: string;
    content : string;
    assignedTo : Partial<UserType>;
    createdAt:string; 
    status : TodoStatus;
    comments?:Partial<Comment>[];
}