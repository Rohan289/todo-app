// TodoListPage.tsx
'use client';
import React, { useEffect, useState } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import TodoCard from "../ui/todoCard/TodoCard"; // Assuming you have a TodoCard component
import styles from './todoList.module.css';
import { TodoCardComponentProps, TodoColumnProps } from './todoList.types';
import { TodoStatus, TodoType } from '../ui/todoCard/TodoCard.model';

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
        <div ref={drag as unknown as React.RefObject<HTMLDivElement>} style={{ opacity: isDragging ? 0.5 : 1 }}>
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
                {todos.map((todo, index) => (
                    <TodoCardComponent key={todo.id} index={index} todo={todo} />
                ))}
            </ul>
        </div>
    );
};
const TodoListPage: React.FC = () => {
    const [todos, setTodos] = useState<{
        [TodoStatus.OPEN]: TodoType[];
        [TodoStatus.IN_PROGRESS]: TodoType[];
        [TodoStatus.DONE]: TodoType[];
    }>({
        [TodoStatus.OPEN]: [],[TodoStatus.IN_PROGRESS]: [],[TodoStatus.DONE]: [ ],
    });

    useEffect(() => {
      async function fetchData() { 
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
        const res = await fetch(`${baseUrl}/api/todo`, {
            cache: 'no-store',
        });
        if (!res.ok) {
            throw new Error('Failed to fetch data');
        }
        const result = await res.json();
        const resultTodo = result.data.reduce((acc: {
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
      fetchData();

    },[])

    const moveTodo = (sourceIndex: number, destIndex: number, sourceColumn: keyof typeof todos, destColumn: keyof typeof todos) => {
        const sourceTodos = Array.from(todos[sourceColumn]);
        const destTodos = Array.from(todos[destColumn]);
        const [movedTodo] = sourceTodos.splice(sourceIndex, 1);
        destTodos.splice(destIndex, 0, movedTodo);
        setTodos((prev) => ({
            ...prev,
            [sourceColumn]: sourceTodos,
            [destColumn]: destTodos,
        }));
    };

    return (
        <DndProvider backend={HTML5Backend}>
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
        </DndProvider>
    );
};

export default TodoListPage;