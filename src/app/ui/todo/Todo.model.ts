import { TodoStatus } from "../todoCard/TodoCard.model";

export interface UserType {
    id : number;
    name : string;
    email : string;    
}

export interface TodoType {
    id: number;
    title: string;
    completed: boolean;  
    assignedTo : UserType;
    status : TodoStatus; 
}