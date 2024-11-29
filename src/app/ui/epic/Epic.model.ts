import { UserType } from "../todoCard/TodoCard.model";

export interface EpicType {
    id: number;
    title: string;
    content : string;
    assignedTo : Partial<UserType>;
    createdAt:string; 
}