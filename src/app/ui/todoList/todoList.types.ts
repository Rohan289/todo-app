
import { TransformedType } from "../todo/Todo.model";
import { TodoStatus } from "../todoCard/TodoCard.model";

export interface TodoListType {
    [TodoStatus.OPEN]: TransformedType[];
    [TodoStatus.IN_PROGRESS]: TransformedType[];
    [TodoStatus.DONE]: TransformedType[];
}

// types.ts
export interface TodoColumnProps {
    todos: TransformedType[];
    status: TodoStatus;
    refetchTodo : () => void;
    isAuthenticated: boolean;
    todoList : TodoListType
}

export interface TodoCardComponentProps {
    todo: TransformedType;
    isAuthenticated: boolean;
    index: number;
}

