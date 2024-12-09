import { EpicType } from "../epic/Epic.model";
import { TodoStatus, UserType } from "../todoCard/TodoCard.model";

export interface StoryType {
    id: number;
    title: string;
    formattedId : string;
    content : string;
    assignedTo : Partial<UserType>;
    epic : Partial<EpicType>;
    createdAt:string; 
    status : TodoStatus;
}