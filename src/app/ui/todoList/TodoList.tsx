'use client';
import React, { useEffect, useState } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import styles from './todoList.module.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useTodos } from '@/hooks/rest-api';
import { TodoCardComponentProps, TodoColumnProps } from '@/app/ui/todoList/todoList.types';
import TodoCard from '../todoCard/TodoCard';
import { TodoStatus, TodoType } from '../todoCard/TodoCard.model';

const ItemType = {
    TODO: 'TODO',
};

const TodoCardComponent: React.FC<TodoCardComponentProps> = ({ todo, index }) => {
    const [{ isDragging }, drag] = useDrag({
        type: ItemType.TODO,
        item: { index },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });

    return (
        <div ref={drag as unknown as React.RefObject<HTMLDivElement>} style={{ margin : '10px', opacity: isDragging ? 0.5 : 1 }}>
            <TodoCard {...todo} />
        </div>
    );
};

const TodoColumn: React.FC<TodoColumnProps> = ({ todos, status, moveTodo }) => {
    const [, drop] = useDrop({
        accept: ItemType.TODO,
        hover(item: { index: number }) {
            const dropIndex = todos.length;
            if (item.index !== dropIndex) {
                moveTodo(item.index, dropIndex);
                item.index = dropIndex;
            }
        },    });

    return (
        <div ref={drop as unknown as React.RefObject<HTMLDivElement>} className={styles.column}>
            <h2>{status.charAt(0).toUpperCase() + status.slice(1)}</h2>
            <ul>
                {todos.map((todo) => (
                    <TodoCardComponent key={todo.id} index={todo.id} todo={todo} />
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
        [TodoStatus.OPEN]: [],[TodoStatus.IN_PROGRESS]: [],[TodoStatus.DONE]: [ ],
    });

    const queryClient = new QueryClient(); // Initialize QueryClient here

    const {isFetching : isTodoFetching, data : todoData , refetch : refetchTodo} = useTodos();

    useEffect(() => {
      async function fetchData() { 
        if(todoData) {
        const resultTodo = (todoData as []).reduce((acc: {
          [TodoStatus.OPEN]: TodoType[];
          [TodoStatus.IN_PROGRESS]: TodoType[];
          [TodoStatus.DONE]: TodoType[];
      }, todo: TodoType) => {
            acc[todo.status] = acc[todo.status] || [];
            acc[todo.status].push(todo);
            return acc;
        }, { [TodoStatus.OPEN]: [],[TodoStatus.IN_PROGRESS]: [],[TodoStatus.DONE]: [ ]});
        setTodos(resultTodo);
      }
    }
      fetchData();

    },[todoData])

    const moveTodo = (sourceIndex: number, destIndex: number, sourceColumn: keyof typeof todos, destColumn: keyof typeof todos) => {
        const sourceTodos = Array.from(todos[sourceColumn]);
        const destTodos = Array.from(todos[destColumn]);
    
        // If moving within the same column
        if (sourceColumn === destColumn) {
            const [movedTodo] = sourceTodos.splice(sourceIndex, 1);
            sourceTodos.splice(destIndex, 0, movedTodo);
        } else {
            // Moving between columns
            const [movedTodo] = sourceTodos.splice(sourceIndex, 1);
            destTodos.splice(destIndex, 0, movedTodo);
        }
    
        setTodos((prev) => ({
            ...prev,
            [sourceColumn]: sourceTodos,
            [destColumn]: destTodos,
        }));
    };

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
                        (
                          <TodoColumn
                              key={status}
                              todos={todos[status as keyof typeof todos]} // Type assertion
                              status={todos[status as keyof typeof todos][0].status as TodoStatus} // Type assertion
                              moveTodo={(sourceIndex, destIndex) => moveTodo(sourceIndex, destIndex, status as keyof typeof todos, status as keyof typeof todos)}
                          />
                      )
                      )
                    })}
                </div>
            </div>
            </QueryClientProvider>
        </DndProvider>
    );
};

export default TodoList;