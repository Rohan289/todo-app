import { EpicType } from "../epic/Epic.model";
import { UserType } from "../todoCard/TodoCard.model";

export interface StoryType {
    id: number;
    title: string;
    content : string;
    assignedTo : Partial<UserType>;
    epic : Partial<EpicType>;
    createdAt:string; 
}