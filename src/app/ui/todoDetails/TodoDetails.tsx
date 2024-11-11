'use client';
import { useState,useEffect } from 'react';
import { useTodos } from '@/hooks/rest-api.query';
import { FaUser, FaCalendarAlt, FaCommentDots } from 'react-icons/fa';
import styles from './TodoDetails.module.css';
import { TodoType } from '../todoCard/TodoCard.model';

const TodoDetails: React.FC<{ id: string }> = ({ id }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [status, setStatus] = useState('');
  const [priority, setPriority] = useState('');
  const [comments, setComments] = useState<string[]>([]);
  const [newComment, setNewComment] = useState('');

  const { isFetching: isTodoFetching, data: todoData } = useTodos<TodoType>({ pathParam: id });


  useEffect(() => {
    if (todoData) {
      setTitle(todoData.title);
      setContent(todoData.content);
      setStatus(todoData.status);
      setPriority(todoData.priority);
    }
  }, [todoData]);

  if (isTodoFetching) return <div>Loading...</div>;

  const handleCommentAdd = () => {
    if (newComment.trim()) {
      setComments([...comments, newComment]);
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
        />
      </div>
      <div className={styles.details}>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className={styles.contentTextarea}
        />
        <p><FaCalendarAlt /> Created At: {todoData && new Date(todoData?.createdAt).toLocaleString()}</p>
        <p><FaUser /> Created By: {todoData && todoData.createdBy.name}</p>

        <div className={styles.editableFields}>
          <label>
            Status:
            <select value={status} onChange={(e) => setStatus(e.target.value)} className={styles.select}>
              <option value="OPEN">OPEN</option>
              <option value="IN_PROGRESS">IN_PROGRESS</option>
              <option value="CLOSED">CLOSED</option>
            </select>
          </label>
          <label>
            Priority:
            <select value={priority} onChange={(e) => setPriority(e.target.value)} className={styles.select}>
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