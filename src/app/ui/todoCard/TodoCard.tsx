// TodoCard.tsx
import { TransformedType } from "../todo/Todo.model";
import { TodoTaskType,TodoSubTaskType } from "./TodoCard.model";
import styles from "./TodoCard.module.css";
import { getPriorityClass, getStatusClass, getStatusIcon } from "./TodoCard.util";

// Define an object to map todo types to their corresponding icons
const typeIcons : {[key : string] : string}  = {
    [TodoTaskType.EPIC]: '📚', // Example icon for epic
    [TodoSubTaskType.BUG]: '🐞',   // Example icon for bug
    [TodoSubTaskType.FEATURE]: '✨', // Example icon for feature
    [TodoTaskType.STORY]: '📖',   // Example icon for story

};

export default function TodoCard({ id, title, assignedTo, priority, status, type }: TransformedType) {
    return (
        <div className={styles.todoCard} key={id}>
            <div className={styles.todoHeader}>
                <h1 className={styles.todoHeaderh1}>{title}</h1>
              {priority &&  <span className={`${styles.priorityIndicator} ${getPriorityClass(priority,styles)}`} data-priority={priority}></span> }
            </div>
            <div className={styles.todoDetails}>
            <div className={`${styles.statusBadge} ${getStatusClass(status,styles)}`}>
                {getStatusIcon(status,styles)}
                    <span className={styles.statusText}>{status}</span>
                </div>
                <div className={styles.assignedRow}>
                <h3 className={styles.createdBy}>Assigned To: {assignedTo.name}</h3>
               {priority && <span className={`${styles.priorityLabel} ${getPriorityClass(priority,styles)}`} data-priority={priority}>
                    {priority}
                </span>
                }
                </div>
                <div className={styles.todoType}>
                    <span className={styles.typeIcon}>{typeIcons[type] || '🔍'}</span> {/* Default icon if type is unknown */}
                    <span className={styles.typeLabel}>{type.charAt(0).toUpperCase() + type.slice(1)}</span>
                </div>
            </div>
        </div>
    );
}