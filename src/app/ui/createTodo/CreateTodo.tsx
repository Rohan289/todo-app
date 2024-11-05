'use client';
import { User } from '@/models/User';
import styles from './CreateTodo.module.css';

interface CreateTodoProps {
  onClose: () => void;
  users : User[] | [];
}

const CreateTodo = ({onClose,users} : CreateTodoProps) => {
  return (
    <div className={styles.modalOverlay}>
    <div className={styles.modal}>
        <div className={styles.modalHeader}>
            <h2 className={styles.modalTitle}>Create Task</h2>
            <button onClick={onClose} className={styles.closeButton}>&times;</button>
        </div>
        <div className={styles.modalContent}>
            <div className={styles.field}>
                <label className={styles.label} >Todo Title:</label>
                <input  className={styles.input} type="text" id="todoTitle" placeholder="Enter todo title..." />
            </div>
            <div className={styles.field}>
                <label className={styles.label}>Todo Content:</label>
                <textarea className={styles.textArea} id="todoContent" placeholder="Enter todo content..." rows={4}></textarea>
            </div>
        </div>
        <div className={styles.modalFooter}>
            <div className={styles.assignField}>
                <label  className={styles.label}>Assigned To:</label>
                <select className={styles.select} id="assignedTo">
                    {
                        users.map((user) => {
                            return (
                                <option key={user.name} value={user.name}>{user.name}</option>
                            )
                        })
                    }
                </select>
            </div>
            <div className={styles.priorityField}>
                <label className={styles.label}>Priority:</label>
                <select className={styles.select} id="priority">
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                </select>
            </div>
            <button className={styles.submitButton}>Submit</button>
        </div>
    </div>
</div>

  )
}

export default CreateTodo;
