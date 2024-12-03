
export interface UserType {
    id : number;
    name : string;
    email : string;    
}

export enum TodoStatus {
    OPEN = 'OPEN',
    IN_PROGRESS = 'IN_PROGRESS',
    DONE = 'DONE'
}

export enum TodoTaskType {
    TASK = 'TASK',
    EPIC = 'EPIC',
    STORY = 'STORY'
}

export enum TodoSubTaskType {
    FEATURE = 'FEATURE',
    BUG = 'BUG',
}

export enum TodoPriority {
    LOW = 'LOW',
    MEDIUM = 'MEDIUM',
    HIGH = 'HIGH'
}

export interface TodoComment {
    userEmail : string;
    commentText : string;
}

export interface TodoType {
    id: number;
    title: string;
    content : string;
    completed: boolean;  
    assignedTo : Partial<UserType>;
    status : TodoStatus | string;
    priority : TodoPriority | string;
    comments?:TodoComment[];
    createdAt:string; 
}

export interface CreateTodoType {
    title: string;
    assignedTo : {
        id : number;
    };
    content : string;
    priority : TodoPriority;
    type : TodoTaskType;
    subType?:TodoSubTaskType;
}

export interface CreateUser {
    name: string;
    email : string;
    password : string;
    action : 'signup' | 'login';
}

export interface LoginUser {
    email : string;
    password : string;
    action : 'signup' | 'login';
}