
import { TodoStatus, TodoType } from "../todoCard/TodoCard.model";

// types.ts
export interface TodoColumnProps {
    todos: TodoType[];
    status: TodoStatus;
}

export interface TodoCardComponentProps {
    todo: TodoType;
    index: number;
    key : number;
}