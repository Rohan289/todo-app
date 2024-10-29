
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

export interface TodoType {
    id: number;
    title: string;
    completed: boolean;  
    createdBy : UserType;
    status : TodoStatus; 
}