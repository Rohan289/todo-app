
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

export enum TodoPriority {
    LOW = 'LOW',
    MEDIUM = 'MEDIUM',
    HIGH = 'HIGH'
}

export interface TodoType {
    id: number;
    title: string;
    content : string;
    completed: boolean;  
    createdBy : UserType;
    status : TodoStatus;
    priority : TodoPriority;
    comments?:string[];
    createdAt:string; 
}

export interface CreateTodoType {
    title: string;
    createdBy : {
        id : number;
    };
    content : string;
    priority : TodoPriority;
}