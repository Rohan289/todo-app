'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // Import useRouter
import { useChildTasks, useTodos, useUsers } from '@/hooks/rest-api.query';
import { FaPen,FaUser, FaCalendarAlt, FaCommentDots } from 'react-icons/fa';
import styles from './TodoDetails.module.css';
import { TodoComment, TodoPriority, TodoStatus, TodoTaskType } from '../todoCard/TodoCard.model';
import { useUpdateTodo } from '@/hooks/rest-api.mutation';
import { TODO_PRIORITY_FILTER, TODO_STATUS_FILTER } from '../filter/Filter.util';
import { User } from '@/models/User';
import { useUserDetails } from '@/app/common/context/UserDetailsContext';
import { TransformedType } from '../todo/Todo.model';
import { Bug } from '@/models/Bug';
import { Feature } from 'typeorm';

const TodoDetails: React.FC<{ id: string }> = ({ id }) => {
  const { state: {  isAuthenticated,user } } = useUserDetails();
  const router = useRouter(); // Initialize useRouter
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [callChildTask, setCallChildTask] = useState(false);
  const [status, setStatus] = useState<TodoStatus | ''>('');
  const [priority, setPriority] = useState<TodoPriority | ''>('');
  const [comments, setComments] = useState<TodoComment[]>([]);
  const [newComment, setNewComment] = useState<string>('');
  const [isEditing, setIsEditing] = useState(false); // State to track edit mode
  const [assignedTo, setAssignedTo] = useState<string>(''); // State for assigned user ID

  const { data: users } = useUsers(); // Fetch users
  const { isFetching: isTodoFetching, data: todoData, refetch: refetchTodo } = useTodos<TransformedType>({ pathParam: id, queryString : `findBy=true` });
  const { mutate: updateTodo } = useUpdateTodo(() => {
    refetchTodo();
  });

  const {isFetching: isChildTasksFetching, data: childTasksData} = useChildTasks<{bugs : Bug, features : Feature}>(callChildTask,id,() => {
    setCallChildTask(false);
  },() => setCallChildTask(false))

  useEffect(() => {
    if (todoData) {
      setTitle(todoData.title);
      setContent(todoData.content);
      setStatus(todoData.status as TodoStatus);
      if (todoData.priority) {
        setPriority(todoData.priority as TodoPriority);
      }
      setComments(todoData.comments || []);
      setAssignedTo((todoData?.assignedTo?.id?.toString() as string) || ''); // Set the assigned user ID
    }
    if(todoData?.type === TodoTaskType.STORY) {
      setCallChildTask(true);
    }
  }, [todoData]);

  if (isTodoFetching) return <div>Loading...</div>;

  const handleEditClick = (todoData : TransformedType) => {
    if (isEditing) {
      const {id : todoId}  = todoData;
      // If editing is true, update the todo with new data
      updateTodo({
        todoData , 
        id: todoId,
        todo: {
          title,
          content,
          ...(status.length > 0 && { status }), // Conditionally include status
          ...(priority.length > 0 && { priority }), // Conditionally include priority
          assignedTo : {
            id : parseInt(assignedTo),
          }, // Include assigned user ID
          comments, // You may want to ensure that the comments are not modified in the edit operation if you want to keep them intact
        },
      });
    }
    setIsEditing(!isEditing); // Toggle edit mode
  };

  const handleCommentAdd = (todoData : TransformedType) => {
    if (newComment.trim()) {
      const newCommentValue: TodoComment = { userEmail: user?.email || 'Unknown', commentText: newComment };
      updateTodo({todoData, id: parseInt(id), todo: { comments: [...comments, newCommentValue] } });
      setNewComment('');
    }
  };

  const handleBackClick = () => {
    router.push('/todoList'); // Navigate back to the Todo list page
  };

    // Check authentication
    if (!isAuthenticated) {
      return (
        <div className={styles.errorContainer}>
          <h1>404 Unauthorized</h1>
          <p>You do not have permission to view this page.</p>
          <button className={styles.backButton} onClick={() => router.push('/todoList')}>
            Go Back to Todo List
          </button>
        </div>
      );
    }

  return (
    <div className={styles.todoContainer}>
        <button className={styles.backButton} onClick={handleBackClick}>Back</button> {/* Back Button */}
        <div className={styles.header}>

        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={styles.titleInput}
          disabled={!isEditing}  // Disable input if not in edit mode
        />
        <button className={styles.editButton} onClick={() => todoData && handleEditClick(todoData)}>
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
        <div className={styles.editableFields}>
          <label>
            Assigned To:
            <select
              disabled={!isEditing}  // Disable input if not in edit mode
              value={assignedTo}
              onChange={(e) => setAssignedTo(e.target.value)} // Update assigned user
              className={styles.select}
            >
              <option value="" disabled>Select a user</option>
              {Array.isArray(users) && users.length > 0 && users.map((user: User) => (
                  <option key={user.id} value={user.id}>
                      {user.name}
                  </option>
              ))}

            </select>
          </label>
          <label>
            Status:
            <select disabled={!isEditing} value={status} onChange={(e) => setStatus(e.target.value as TodoStatus)} className={styles.select}>
              {
                TODO_STATUS_FILTER.map((filter) => (
                  <option value={filter.value} key={filter.value}>{filter.label}</option>
                ))
              }
            </select>
          </label>
          <label>
            Priority:
            <select disabled={!isEditing} value={priority} onChange={(e) => setPriority(e.target.value as TodoPriority)} className={styles.select}>
              {
                TODO_PRIORITY_FILTER.map((filter) => (
                  <option value={filter.value} key={filter.value}>{filter.label}</option>
                ))
              }
            </select>
          </label>
        </div>
        <div className={styles.commentsSection}>
          <h3><FaCommentDots /> Comments</h3>
          <ul className={styles.commentsList}>
            {comments.length > 0 ? (
              comments.map((comment, index) => (
                <li key={index} className={styles.commentItem}>
                  <FaUser className={styles.avatarIcon} />
                  <div className={styles.commentContent}>
                    <strong className={styles.commentContentStrong}>{comment.userEmail}</strong>
                    <p className={styles.commentContentP}>{comment.commentText}</p>
                  </div>
                </li>
              ))
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
          <button onClick={() => todoData && handleCommentAdd(todoData)} className={styles.addButton}>Add Comment</button>
        </div>
      </div>
    </div>
  );
};

export default TodoDetails;