
import { TodoStatus, TodoType } from "../ui/todoCard/TodoCard.model";

// types.ts
export interface TodoColumnProps {
    todos: TodoType[];
    status: TodoStatus;
    moveTodo: (sourceIndex: number, destIndex: number) => void;
}

export interface TodoCardComponentProps {
    todo: TodoType;
    index: number;
    moveTodo?: (sourceIndex: number, destIndex: number) => void;
}