
import { TransformedType } from "../todo/Todo.model";
import { TodoStatus } from "../todoCard/TodoCard.model";

// types.ts
export interface TodoColumnProps {
    todos: TransformedType[];
    status: TodoStatus;
    refetchTodo : () => void;
    isAuthenticated: boolean;
}

export interface TodoCardComponentProps {
    todo: TransformedType;
    isAuthenticated: boolean;
    index: number;
}