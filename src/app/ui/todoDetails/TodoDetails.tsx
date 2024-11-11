'use client';
import { useState,useEffect } from 'react';
import { useTodos } from '@/hooks/rest-api.query';
import { FaUser,FaPen ,FaCalendarAlt, FaCommentDots } from 'react-icons/fa';
import styles from './TodoDetails.module.css';
import { TodoPriority, TodoStatus, TodoType } from '../todoCard/TodoCard.model';
import { useUpdateTodo } from '@/hooks/rest-api.mutation';

const TodoDetails: React.FC<{ id: string }> = ({ id }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [status, setStatus] = useState<TodoStatus>('');
  const [priority, setPriority] = useState<TodoPriority>('');
  const [comments, setComments] = useState<string[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isEditing, setIsEditing] = useState(false); // State to track edit mode


  const { isFetching: isTodoFetching, data: todoData , refetch : refetchTodo} = useTodos<TodoType>({ pathParam: id });
  const { mutate: updateTodo } = useUpdateTodo(() => {
    refetchTodo();
  });


  useEffect(() => {
    if (todoData) {
      setTitle(todoData.title);
      setContent(todoData.content);
      setStatus(todoData.status as TodoStatus);
      setPriority(todoData.priority as TodoPriority);
      setComments(todoData.comments || []);
    }
  }, [todoData]);

  if (isTodoFetching) return <div>Loading...</div>;

  const handleEditClick = () => {
    if (isEditing) {
      // If editing is true, update the todo with new data
      updateTodo({
        id: parseInt(id),
        todo: {
          title,
          content,
          status,
          priority,
          comments, // You may want to ensure that the comments are not modified in the edit operation if you want to keep them intact
        },
      });
    }
    setIsEditing(!isEditing); // Toggle edit mode
  };


  const handleCommentAdd = () => {
    if (newComment.trim()) {
      updateTodo({id : parseInt(id), todo : {comments : [...comments, newComment]}});
      setNewComment('');
    }
  };

  return (
    <div className={styles.todoContainer}>
      <div className={styles.header}>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={styles.titleInput}
          disabled={!isEditing}  // Disable input if not in edit mode
        />
         <button className={styles.editButton} onClick={handleEditClick}>
          <FaPen /> {isEditing ? 'Save' : 'Edit'}
        </button>
      </div>
      <div className={styles.details}>
        <textarea
          disabled={!isEditing}  // Disable input if not in edit mode
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className={styles.contentTextarea}
        />
        <p><FaCalendarAlt /> Created At: {todoData && new Date(todoData?.createdAt).toLocaleString()}</p>
        <p><FaUser /> Created By: {todoData && todoData.createdBy.name}</p>

        <div className={styles.editableFields}>
          <label>
            Status:
            <select  disabled={!isEditing}  value={status} onChange={(e) => setStatus(e.target.value)} className={styles.select}>
              <option value="OPEN">OPEN</option>
              <option value="IN_PROGRESS">IN_PROGRESS</option>
              <option value="CLOSED">CLOSED</option>
            </select>
          </label>
          <label>
            Priority:
            <select  disabled={!isEditing}  value={priority} onChange={(e) => setPriority(e.target.value)} className={styles.select}>
              <option value="LOW">LOW</option>
              <option value="MEDIUM">MEDIUM</option>
              <option value="HIGH">HIGH</option>
            </select>
          </label>
        </div>
        
        <div className={styles.commentsSection}>
          <h3><FaCommentDots /> Comments</h3>
          <ul className={styles.commentsList}>
            {comments.length > 0 ? (
              comments.map((comment, index) => <li key={index}>{comment}</li>)
            ) : (
              <p>No comments yet.</p>
            )}
          </ul>
          <textarea 
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment"
            className={styles.commentInput}
          />
          <button onClick={handleCommentAdd} className={styles.addButton}>Add Comment</button>
        </div>
      </div>
    </div>
  );
};

export default TodoDetails;