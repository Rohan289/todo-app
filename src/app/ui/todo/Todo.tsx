import { TodoType } from "./Todo.model";
import styles from "./Todo.module.css";

export default function Todo({id,title,completed,assignedTo} : TodoType) {
    return (
        <div className={styles.todo} key={id}>
            <div className="todo--header">
            <h1>{title}</h1>
            </div>
            
            <h2>{completed ? "Completed" : "Not Completed"}</h2>
            <h3>{assignedTo.name}</h3>
        </div>
    )
}