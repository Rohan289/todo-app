// TodoCard.tsx
import { TodoType } from "./TodoCard.model";
import styles from "./TodoCard.module.css";
import { getPriorityClass, getStatusClass, getStatusIcon } from "./TodoCard.util";

export default function TodoCard({ id, title, createdBy, priority, status }: TodoType) {

    return (
        <div className={styles.todoCard} key={id}>
            <div className={styles.todoHeader}>
                <h1 className={styles.todoHeaderh1}>{title}</h1>
                <span className={`${styles.priorityIndicator} ${getPriorityClass(priority,styles)}`} data-priority={priority}></span>
            </div>
            <div className={styles.todoDetails}>
            <div className={`${styles.statusBadge} ${getStatusClass(status,styles)}`}>
                {getStatusIcon(status,styles)}
                    <span className={styles.statusText}>{status}</span>
                </div>
                <h3 className={styles.createdBy}>Created by: {createdBy.name}</h3>
                <span className={`${styles.priorityLabel} ${getPriorityClass(priority,styles)}`} data-priority={priority}>
                    {priority}
                </span>
            </div>
        </div>
    );
}