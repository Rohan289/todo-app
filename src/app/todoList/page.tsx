import { TodoType } from "../ui/todo/Todo.model";
import TodoCard from "../ui/todoCard/TodoCard";
import { TodoStatus } from "../ui/todoCard/TodoCard.model";
import styles from './todoList.module.css';

export default async function TodoListPage() {
    const baseUrl = process.env.BASE_URL;
    const res = await fetch(`${baseUrl}/api/todo`, {
        cache: 'no-store',
    });
    if (!res.ok) {
        throw new Error('Failed to fetch data');
    }
    const data = await res.json();
    const todos: TodoType[] = data.data;

    // Separate todos by status
    const openTodos = todos.filter(todo => todo.status === TodoStatus.OPEN);
    const inProgressTodos = todos.filter(todo => todo.status === TodoStatus.IN_PROGRESS);
    const completedTodos = todos.filter(todo => todo.status === TodoStatus.DONE);

    return (
        <div className={styles.todoListContainer}>
            <h1 className={styles.todoListContainerh1}>Your Todo List:</h1>
            <div className={styles.todoTable}>
                <div className={styles.column}>
                    <h2 className={styles.columnH2}>Open</h2>
                    <ul className={styles.columnH2Ul}>
                        {openTodos.map(todo => (
                            <TodoCard key={todo.id} {...todo} />
                        ))}
                    </ul>
                </div>
                <div className={styles.column}>
                    <h2 className={styles.columnH2}>In Progress</h2>
                    <ul className={styles.columnH2Ul}>
                        {inProgressTodos.map(todo => (
                            <TodoCard key={todo.id} {...todo} />
                        ))}
                    </ul>
                </div>
                <div className={styles.column}>
                    <h2 className={styles.columnH2}>Completed</h2>
                    <ul className={styles.columnH2Ul}>
                        {completedTodos.map(todo => (
                            <TodoCard key={todo.id} {...todo} />
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}