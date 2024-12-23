import { Epic } from "@/models/Epic";
import {  TodoPriority, TodoStatus, TodoSubTaskType, TodoTaskType } from "../todoCard/TodoCard.model";
import { Story } from "@/models/Story";
import { Feature } from "@/models/Feature";
import { Bug } from "@/models/Bug";
import { Comment } from "@/models/Comment";

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
    status: TodoStatus;
    createdAt: string;
    comments?:Comment[];
    updatedAt: string;
    assignedTo: UserType;
    priority?:TodoPriority;
    storyId?: number; // Optional for features
    epic?: Epic;   // Optional for stories
}