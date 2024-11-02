'use client';
import React, { useEffect, useState } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import styles from './todoList.module.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TodoCardComponentProps, TodoColumnProps } from '@/app/ui/todoList/todoList.types';
import TodoCard from '../todoCard/TodoCard';
import { TodoStatus, TodoType } from '../todoCard/TodoCard.model';
import { useTodos } from '@/hooks/rest-api.query';
import { useUpdateTodo } from '@/hooks/rest-api.mutation';

const ItemType = {
    TODO: 'TODO',
};

const TodoCardComponent: React.FC<TodoCardComponentProps> = ({ todo, key,index }) => {
    const [{ isDragging }, drag] = useDrag({
        type: ItemType.TODO,
        item: { todo : todo },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });

    return (
        <div ref={drag as unknown as React.RefObject<HTMLDivElement>} style={{ margin: '10px', opacity: isDragging ? 0.5 : 1 }}>
            <TodoCard {...todo} />
        </div>
    );
};

const TodoColumn: React.FC<TodoColumnProps> = ({ todos, status, refetchTodo }) => {
    const [, drop] = useDrop({
        accept: ItemType.TODO,
        drop(item: { todo: TodoType }) {
            const {status : todoStatus} = item.todo as TodoType;
            if(todoStatus !== status) {
                moveTodo(item.todo, status);
            }
        },
    });

    const { mutate: updateTodo, isLoading, isError } = useUpdateTodo();

    const handleUpdateTodo = (todoId: number, newStatus: TodoStatus) => {
        updateTodo({ id: todoId, status: newStatus }, {
            onSuccess: () => {
                // Handle success (e.g., show a success message)
                console.log('Todo updated successfully');
                refetchTodo();
            },
            onError: (error) => {
                // Handle error
                console.error('Error updating todo:', error);
            },
        });
    };


    const moveTodo = (todo: TodoType, updatedStatus: TodoStatus) => {
        const {id}  =todo;
        handleUpdateTodo(id,updatedStatus);         
    };

    return (
        <div ref={drop as unknown as React.RefObject<HTMLDivElement>} className={styles.column}>
            <h2>{status.charAt(0).toUpperCase() + status.slice(1)}</h2>
            <ul>
                {todos.map((todo, index) => (
                    <TodoCardComponent key={todo.id} index={index} todo={todo} />
                ))}
            </ul>
        </div>
    );
};

const TodoList: React.FC = () => {
    const [todos, setTodos] = useState<{
        [TodoStatus.OPEN]: TodoType[];
        [TodoStatus.IN_PROGRESS]: TodoType[];
        [TodoStatus.DONE]: TodoType[];
    }>({
        [TodoStatus.OPEN]: [],
        [TodoStatus.IN_PROGRESS]: [],
        [TodoStatus.DONE]: [],
    });

    const queryClient = new QueryClient();
    const { isFetching: isTodoFetching, data: todoData, refetch: refetchTodo } = useTodos();

    useEffect(() => {
        async function fetchData() {
            if (todoData) {
                const resultTodo = (todoData as []).reduce((acc: {
                    [TodoStatus.OPEN]: TodoType[];
                    [TodoStatus.IN_PROGRESS]: TodoType[];
                    [TodoStatus.DONE]: TodoType[];
                }, todo: TodoType) => {
                    acc[todo.status] = acc[todo.status] || [];
                    acc[todo.status].push(todo);
                    return acc;
                }, { [TodoStatus.OPEN]: [], [TodoStatus.IN_PROGRESS]: [], [TodoStatus.DONE]: [] });

                setTodos(resultTodo);
            }
        }
        fetchData();
    }, [todoData]);

    const handleRefetchTodo = () => {
        refetchTodo();
    }



    return (
        <DndProvider backend={HTML5Backend}>
            <QueryClientProvider client={queryClient}>
                <div className={styles.todoListContainer}>
                    <h1>Your Todo List:</h1>
                    <div className={styles.todoTable}>
                        {Object.keys(todos).map((status) => {
                            if (!todos[status as keyof typeof todos].length) {
                                return null;
                            }
                            return (
                                <TodoColumn
                                    refetchTodo={handleRefetchTodo}
                                    key={status}
                                    todos={todos[status as keyof typeof todos]}
                                    status={status as TodoStatus}
                                />
                            );
                        })}
                    </div>
                </div>
            </QueryClientProvider>
        </DndProvider>
    );
};

export default TodoList;