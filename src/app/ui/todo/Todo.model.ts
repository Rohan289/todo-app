import { Epic } from "@/models/Epic";
import { TodoComment, TodoPriority, TodoStatus, TodoSubTaskType, TodoTaskType } from "../todoCard/TodoCard.model";
import { Story } from "@/models/Story";
import { Feature } from "@/models/Feature";
import { Bug } from "@/models/Bug";

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

export interface InputData {
    epics: Epic[];
    features: Feature[];
    stories: Story[];
    bugs: Bug[];
}

export interface TransformedType {
    id: number;
    type: TodoTaskType | TodoSubTaskType;
    formattedId: string;
    content: string;
    title: string;
    status: string;
    createdAt: string;
    comments?:TodoComment[];
    updatedAt: string;
    assignedTo: UserType;
    priority?:TodoPriority;
    story?: Story; // Optional for features
    epic?: Epic;   // Optional for stories
}