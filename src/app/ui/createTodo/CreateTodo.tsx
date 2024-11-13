'use client';
import { useState } from 'react';
import { User } from '@/models/User';
import styles from './CreateTodo.module.css';
import { TODO_PRIORITY_FILTER } from '../filter/Filter.util';
import { CreateTodoType, TodoPriority } from '../todoCard/TodoCard.model';

interface CreateTodoProps {
  onClose: () => void;
  users: User[] | [];
  createTodo: (todo: CreateTodoType) => void;
}

const CreateTodo = ({ onClose, users, createTodo }: CreateTodoProps) => {
  // Define state variables
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [assignedTo, setAssignedTo] = useState(users[0]?.id || ''); // Default to the first user if available
  const [priority, setPriority] = useState(TODO_PRIORITY_FILTER[0]?.value || ''); // Default to the first priority if available
  const [errors, setErrors] = useState({ title: '', content: '' }); // State for validation errors

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate fields
    const newErrors = { title: '', content: '' };
    if (!title) {
      newErrors.title = 'Title is required';
    }
    if (!content) {
      newErrors.content = 'Content is required';
    }
    
    if (newErrors.title || newErrors.content) {
      setErrors(newErrors);
      return; // Stop form submission if there are errors
    }

    const newTodo: CreateTodoType = {
      title,
      content,
      assignedTo: { id: assignedTo as number }, // Assuming you have a UserType that includes a name
      priority,
    };
    createTodo(newTodo);
    onClose();
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>Create Task</h2>
          <button onClick={onClose} className={styles.closeButton}>&times;</button>
        </div>
        <form onSubmit={handleSubmit} className={styles.modalContent}>
          <div className={styles.field}>
            <label className={styles.label}>Task Title:</label>
            <input
              required
              className={styles.input}
              type="text"
              id="todoTitle"
              placeholder="Enter task title..."
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                setErrors({ ...errors, title: '' }); // Clear error on change
              }} 
            />
            {errors.title && <span className={styles.error}>{errors.title}</span>} {/* Display error message */}
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Task Content:</label>
            <textarea
              required={true}
              className={styles.textArea}
              id="todoContent"
              placeholder="Enter task content..."
              rows={4}
              value={content}
              onChange={(e) => {
                setContent(e.target.value);
                setErrors({ ...errors, content: '' }); // Clear error on change
              }} 
            ></textarea>
            {errors.content && <span className={styles.error}>{errors.content}</span>} {/* Display error message */}
          </div>
          <div className={styles.modalFooter}>
            <div className={styles.assignField}>
              <label className={styles.label}>Assigned To:</label>
              <select
                className={styles.select}
                id="assignedTo"
                value={assignedTo}
                onChange={(e) => setAssignedTo(e.target.value)} // Update state on selection change
              >
                {users.map((user) => (
                  <option key={user.id} value={user.id}>{user.name}</option>
                ))}
              </select>
            </div>
            <div className={styles.priorityField}>
              <label className={styles.label}>Priority:</label>
              <select
                className={styles.select}
                id="priority"
                value={priority}
                onChange={(e) => setPriority(e.target.value as TodoPriority)} // Update state on selection change
              >
                {TODO_PRIORITY_FILTER.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <button type="submit" className={styles.submitButton}>Submit</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTodo;