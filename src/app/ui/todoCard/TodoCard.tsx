import { TodoType } from "./TodoCard.model";
import styles from "./TodoCard.module.css";

export default function TodoCard({id,title,completed,createdBy} : TodoType) {
    return (
        <div className={styles.todoCard} key={id}>
            <div className={styles.todoHeader}>
            <h1 className={styles.todoHeaderh1}>{title}</h1>
            </div>
            
            <h2>{completed ? "Completed" : "Not Completed"}</h2>
            <h3>{createdBy.name}</h3>
        </div>
    )
}