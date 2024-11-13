
import { TodoStatus, TodoType } from "../todoCard/TodoCard.model";

// types.ts
export interface TodoColumnProps {
    todos: TodoType[];
    status: TodoStatus;
    refetchTodo : () => void;
    isAuthenticated: boolean;
}

export interface TodoCardComponentProps {
    todo: TodoType;
    isAuthenticated: boolean;
    index: number;
}