'use client';
import React, { useEffect, useState } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import styles from './todoList.module.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TodoCardComponentProps, TodoColumnProps, TodoListType } from '@/app/ui/todoList/todoList.types';
import TodoCard from '../todoCard/TodoCard';
import { TodoStatus,  TodoSubTaskType,  TodoTaskType,  TodoTypes } from '../todoCard/TodoCard.model';
import { useTodos, useUsers } from '@/hooks/rest-api.query';
import { useCreateTodo, useUpdateTodo } from '@/hooks/rest-api.mutation';
import Loader from '@/app/common/loader/Loader';
import Filter from '../filter/Filter';
import { useSearchParams } from 'next/navigation';
import CreateTodo from '../createTodo/CreateTodo';
import { User } from '@/models/User';
import { useRouter } from 'next/navigation';
import { useUserDetails } from '@/app/common/context/UserDetailsContext';
import { TransformedType } from '../todo/Todo.model';
import { STATUS_PRIORITY } from '../filter/Filter.util';
import ErrorBanner from '@/app/common/errorBanner/ErrorBanner';

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

const TodoColumn: React.FC<TodoColumnProps> = ({todoList, todos, status, refetchTodo, isAuthenticated }) => {
    const router = useRouter();
    const { dispatch } = useUserDetails();
    const [showBanner, setShowBanner] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const { mutate: updateTodo } = useUpdateTodo();

    const handleUpdateTodo = (todo: TransformedType, todoId: number, newStatus: TodoStatus) => {
        updateTodo({ todoData: todo, id: todoId, todo: { status: newStatus } }, {
            onSuccess: () => {
                refetchTodo();
            },
            onError: (error) => {
                console.error('Error updating todo:', error);
            },
        });
    };
    

    const handleTodoClick = (todo: TransformedType) => {
        const { formattedId, type } = todo;
        dispatch({ type: 'SET_CURRENT_TODO_TYPE', payload: type });
        if (isAuthenticated) {
            router.push(`/todo/${formattedId}`);
        }
    };

       // Listen for SSE events
       useEffect(() => {
        const eventSource = new EventSource('/api/events');

        eventSource.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.type === 'TASK_UPDATE') {
                const {  newStatus, story, epic } = data.payload;
                const storyPriority = STATUS_PRIORITY[story?.status as TodoStatus];
                const epicPriority = STATUS_PRIORITY[epic?.status as TodoStatus];
                const taskPriority = STATUS_PRIORITY[newStatus as TodoStatus];
                if (storyPriority > taskPriority) {
                    handleUpdateTodo({...story,type : TodoTaskType.STORY},story.id,newStatus);
                }

                if (epicPriority > taskPriority) {
                    handleUpdateTodo({...epic,type : TodoTaskType.EPIC},epic.id,newStatus);
                }
            }
        };

        return () => {
            eventSource.close();
        };
    }, []);
    

    const triggerError = () => {
        setShowBanner(true);
        // You can also set a timeout to hide it after 3 seconds
        setTimeout(() => {
            setShowBanner(false);
        }, 3000);
    };


    const [, drop] = useDrop({
        accept: ItemType.TODO,
        drop(item: { todo: TransformedType }) {
            if (!isAuthenticated) return; // Prevent drop if not authenticated

            const { todo: droppedTodo } = item;
            const { status: todoStatus, type } = droppedTodo;

            if (type === TodoTaskType.STORY) {
                if (todoStatus !== status && canMoveStory(droppedTodo, status)) {
                    moveTodo(droppedTodo, status);
                }
                else {
                    setErrorMessage("You can't move this story to this status");
                    triggerError();
                }
            } else if (type === TodoTaskType.EPIC) {
                if (todoStatus !== status && canMoveEpic(droppedTodo, status)) {
                    moveTodo(droppedTodo, status);
                }
                else {
                    setErrorMessage("You can't move this epic to this status");
                    triggerError();

                }
            }
            else  {
                if (todoStatus !== status) {
                    moveTodo(droppedTodo, status);
                }
            }
        },
    });



    const moveTodo = (todo: TransformedType, updatedStatus: TodoStatus) => {
        const { id } = todo;
        handleUpdateTodo(todo, id, updatedStatus);
    };
    
    const getTasksByStoryId = (storyId: number) => {
        return Object.values(todoList).flat().filter(todo => todo.storyId === storyId &&  (todo.type === TodoSubTaskType.FEATURE || todo.type === TodoSubTaskType.BUG));
    };

    const getStoriesByEpicId = (epicId: number) => {
        return Object.values(todoList).flat().filter(todo => todo?.epic?.id === epicId &&  todo.type === TodoTaskType.STORY );
    };

    const canMoveStory = (story: TransformedType, newStatus: TodoStatus) => {
        const relatedTasks = getTasksByStoryId(story.id);
        const newStatusPriority = STATUS_PRIORITY[newStatus];
        // Check if all related tasks have a status that is greater than or equal to the new status
        return relatedTasks.every(task => STATUS_PRIORITY[task.status as TodoStatus] >= newStatusPriority);
    };

    const canMoveEpic = (epic: TransformedType, newStatus: TodoStatus) => {
        const relatedStories = getStoriesByEpicId(epic.id);
        const newStatusPriority = STATUS_PRIORITY[newStatus];
    
        // Check if all related stories have a status that is greater than or equal to the new status
        return relatedStories.every(story => STATUS_PRIORITY[story.status as TodoStatus] >= newStatusPriority);
    };




    return (
        <div ref={drop as unknown as React.RefObject<HTMLDivElement>} className={styles.column}>
                {showBanner && <ErrorBanner message={errorMessage} />}
            <h2>{status.charAt(0).toUpperCase() + status.slice(1)}</h2>
            <ul>
                {todos.map((todo, index) => (
                    <li key={index} onClick={() => handleTodoClick(todo)} style={{ cursor: 'pointer' }}>
                        <TodoCardComponent isAuthenticated={isAuthenticated} key={index} index={index} todo={todo} />
                    </li>
                ))}
            </ul>
        </div>
    );
};

const TodoList: React.FC = () => {
    const { state: { isAuthenticated } } = useUserDetails();
    const [todos, setTodos] = useState<TodoListType>({
        [TodoStatus.OPEN]: [],
        [TodoStatus.IN_PROGRESS]: [],
        [TodoStatus.DONE]: [],
    });
    const [queryString, setQueryString] = useState('');
    const [assignedUsers, setAssignedUsers] = useState<User[]>([]);
    const [showCreateTodoModal, setShowCreateTodoModal] = useState(false);
    const queryClient = new QueryClient();
    const { isFetching: isTodoFetching, data: todoData, refetch: refetchTodo } = useTodos<TodoTypes>({ queryString });
    const searchParams = useSearchParams();
    const { data: users } = useUsers();

    const handleCreateTodoSuccess = () => {
        refetchTodo();
    };

    const { mutate: createTodo } = useCreateTodo(handleCreateTodoSuccess);

    useEffect(() => {
        if (users) {
            setAssignedUsers(users as unknown as User[]);
        }
    }, [users]);

    useEffect(() => {
        const query = searchParams.toString();
        setQueryString(query || '');
    }, [searchParams]);

    useEffect(() => {
        async function fetchData() {
            if (todoData) {
                const resultTodo = (todoData as unknown as TransformedType[]).reduce((acc: {
                    [TodoStatus.OPEN]: TransformedType[];
                    [TodoStatus.IN_PROGRESS]: TransformedType[];
                    [TodoStatus.DONE]: TransformedType[];
                }, todo: TransformedType) => {
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
    };

    if (isTodoFetching) return <Loader />;
    return (
        <DndProvider backend={HTML5Backend}>
            <QueryClientProvider client={queryClient}>
                <Filter users={assignedUsers} />
                <div className={styles.todoTable}>
                    {Object.keys(todos).map((status) => {
                        return (
                            <TodoColumn
                                todoList={todos}
                                isAuthenticated={isAuthenticated}
                                refetchTodo={handleRefetchTodo}
                                key={status}
                                todos={todos[status as keyof typeof todos]}
                                status={status as TodoStatus}
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

