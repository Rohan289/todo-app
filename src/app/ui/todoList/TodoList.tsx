'use client';
import React, { useEffect, useState } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import styles from './todoList.module.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TodoCardComponentProps, TodoColumnProps } from '@/app/ui/todoList/todoList.types';
import TodoCard from '../todoCard/TodoCard';
import { TodoStatus, TodoType } from '../todoCard/TodoCard.model';
import { useTodos, useUsers } from '@/hooks/rest-api.query';
import { useCreateTodo, useUpdateTodo } from '@/hooks/rest-api.mutation';
import Loader from '@/app/common/loader/Loader';
import Filter from '../filter/Filter';
import { useSearchParams } from 'next/navigation';
import CreateTodo from '../createTodo/CreateTodo';
import { User } from '@/models/User';
import { useRouter } from 'next/navigation';
import { useUserDetails } from '@/app/common/context/UserDetailsContext';
import { TODO_STATUS_FILTER } from '../filter/Filter.util';

const ItemType = {
    TODO: 'TODO',
};

const TodoCardComponent: React.FC<TodoCardComponentProps> = ({ todo,isAuthenticated}) => {
    const [{ isDragging }, drag] = useDrag({
        type: ItemType.TODO,
        item: { todo : todo },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
        canDrag : isAuthenticated
    });

    return (
        <div ref={drag as unknown as React.RefObject<HTMLDivElement>} style={{ margin: '10px', opacity: isDragging ? 0.5 : 1 }}>
            <TodoCard {...todo} />
        </div>
    );
};

const TodoColumn: React.FC<TodoColumnProps> = ({ todos, status, refetchTodo,isAuthenticated }) => {
    const router = useRouter();

    const handleTodoClick = (todoId : number) => {
        // Navigate to the Todo details page using the todoId
        if (isAuthenticated) {
            router.push(`/todo/${todoId}`);
        }
    };

    const [, drop] = useDrop({
        accept: ItemType.TODO,
        drop(item: { todo: TodoType }) {
            if (!isAuthenticated) return; // Prevent drop if not authenticated
            const {status : todoStatus} = item.todo as TodoType;
            if(todoStatus !== status) {
                moveTodo(item.todo, status);
            }
        },
    });

    const { mutate: updateTodo } = useUpdateTodo();

    const handleUpdateTodo = (todoId: number, newStatus: TodoStatus) => {
        updateTodo({ id: todoId, todo: {status : newStatus} }, {
            onSuccess: () => {
                // Handle success (e.g., show a success message)
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
                    <li key={index} onClick={() => handleTodoClick(todo.id)} style={{ cursor: 'pointer' }}>
                    <TodoCardComponent isAuthenticated={isAuthenticated} key={index} index={index} todo={todo} />
                    </li>
                ))}
            </ul>
        </div>
    );
};
const TodoList: React.FC = () => {
    const { state: {  isAuthenticated } } = useUserDetails();
    const [todos, setTodos] = useState<{
        [TodoStatus.OPEN]: TodoType[];
        [TodoStatus.IN_PROGRESS]: TodoType[];
        [TodoStatus.DONE]: TodoType[];
    }>({
        [TodoStatus.OPEN]: [],
        [TodoStatus.IN_PROGRESS]: [],
        [TodoStatus.DONE]: [],
    });

    const [queryString, setQueryString] = useState('');
    const [assignedUsers, setAssignedUsers] = useState<User[]>([]);
    const [showCreateTodoModal, setShowCreateTodoModal] = useState(false);
    const queryClient = new QueryClient();
    const { isFetching: isTodoFetching, data: todoData, refetch: refetchTodo } = useTodos<TodoType[]>({queryString});
    const searchParams = useSearchParams(); // Access search parameters directly

    const { data: users } = useUsers();
    const handleCreateTodoSuccess = () => {
        refetchTodo();
    }
    const { mutate: createTodo } = useCreateTodo(handleCreateTodoSuccess);


    useEffect(() => {
        if(users) {
        setAssignedUsers(users as unknown as User[]);
        }
      },[users])


    useEffect(() => {
        const query = searchParams.toString(); // Get the full query string
        if (query) {
            setQueryString(query);
        }
        else {
            setQueryString('');
        }
    }, [searchParams]); 

    useEffect(() => {
        async function fetchData() {
            if (todoData) {
                const resultTodo = (todoData as []).reduce((acc: {
                    [TodoStatus.OPEN]: TodoType[];
                    [TodoStatus.IN_PROGRESS]: TodoType[];
                    [TodoStatus.DONE]: TodoType[];
                }, todo: TodoType) => {
                    acc[todo.status as TodoStatus] = acc[todo.status as TodoStatus] || [];
                    acc[todo.status as TodoStatus].push(todo);
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

    if(isTodoFetching) return <Loader />



    return (
        <DndProvider backend={HTML5Backend}>
            <QueryClientProvider client={queryClient}>
            <Filter users={assignedUsers}/>
                    <div className={styles.todoTable}>
                        {Object.keys(todos).map((status) => {
                            return (
                                <TodoColumn
                                    isAuthenticated={isAuthenticated}
                                    refetchTodo={handleRefetchTodo}
                                    key={status}
                                    todos={todos[status as keyof typeof todos]}
                                    status={TODO_STATUS_FILTER.find((statusFilter) => statusFilter.value === status)?.label || ''}
                                />
                            );
                        })}
                    </div>
                    {isAuthenticated ? (
                    <>
                        <button onClick={() => setShowCreateTodoModal(true)} className={styles.floatingButton}>+</button>
                        {showCreateTodoModal && <CreateTodo createTodo={(todo) => createTodo(todo)} users={assignedUsers} onClose={() => setShowCreateTodoModal(false)} />}
                    </>
                ) : (
                    <div className={styles.loginNote}>
                        <p>Please log in to create a ticket.</p>
                    </div>
                )}
            </QueryClientProvider>
        </DndProvider>
    );
};

export default TodoList;