'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // Import useRouter
import { useChildStories, useChildTasks, useComments, useTodos, useUsers } from '@/hooks/rest-api.query';
import { FaPen,FaUser, FaCalendarAlt, FaCommentDots } from 'react-icons/fa';
import styles from './TodoDetails.module.css';
import {  CreateCommentType, TodoPriority, TodoStatus, TodoTaskType } from '../todoCard/TodoCard.model';
import { useTodoComment, useUpdateTodo } from '@/hooks/rest-api.mutation';
import { TODO_PRIORITY_FILTER, TODO_STATUS_FILTER } from '../filter/Filter.util';
import { User } from '@/models/User';
import { useUserDetails } from '@/app/common/context/UserDetailsContext';
import { TransformedType } from '../todo/Todo.model';
import { Bug } from '@/models/Bug';
import ChildTasks from '../childTasks/ChildTasks';
import { Story } from '@/models/Story';
import ChildStories from '../childStories/ChildStories';
import { Feature } from '@/models/Feature';
import CommentEditor from '../commentEditor/CommentEditor';
import DOMPurify from 'dompurify';
import { Comment } from '@/models/Comment';

const TodoDetails: React.FC<{ id: string }> = ({ id }) => {
  const { state: {  isAuthenticated,user } } = useUserDetails();
  const router = useRouter(); // Initialize useRouter
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [callChildTask, setCallChildTask] = useState(false);
  const [callChildStory, setCallChildStory] = useState(false);
  const [status, setStatus] = useState<TodoStatus | ''>('');
  const [priority, setPriority] = useState<TodoPriority | ''>('');
  const [commentImages, setCommentImages] = useState<string[]>([]);
  const [newComment, setNewComment] = useState<string>('');
  const [isEditing, setIsEditing] = useState(false); // State to track edit mode
  const [assignedTo, setAssignedTo] = useState<string>(''); // State for assigned user ID

  const { data: users } = useUsers(); // Fetch users
  const { isFetching: isTodoFetching, data: todoData, refetch: refetchTodo } = useTodos<TransformedType>({ pathParam: id, queryString : `findBy=true` });
  const { data : comments } = useComments({ pathParam: id });

    console.log("xcoccc",comments);
  const { mutate: updateTodo } = useUpdateTodo(() => {
    refetchTodo();
  });

  const { mutate: updateTodoComment } = useTodoComment(() => {
    refetchTodo();
  });

  const {isFetching: isChildTasksFetching, data: childTasksData} = useChildTasks<{bugs : Bug[], features : Feature[]}>(callChildTask,id,() => {
    setCallChildTask(false);
  },() => setCallChildTask(false))


  const {isFetching: isChildStoryFetching, data: childStoryData} = useChildStories<{stories : Story[]}>(callChildStory,id,() => {
    setCallChildStory(false);
  },() => setCallChildStory(false))

  useEffect(() => {
    if (todoData) {
      setTitle(todoData.title);
      setContent(todoData.content);
      setStatus(todoData.status as TodoStatus);
      if (todoData.priority) {
        setPriority(todoData.priority as TodoPriority);
      }
      // setComments(todoData.comments || []);
      setAssignedTo((todoData?.assignedTo?.id?.toString() as string) || ''); // Set the assigned user ID
    }
    if(todoData?.type === TodoTaskType.STORY) {
      setCallChildTask(true);
    }
    if(todoData?.type === TodoTaskType.EPIC) {
      setCallChildStory(true);
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
        },
      });
    }
    setIsEditing(!isEditing); // Toggle edit mode
  };

  const handleCommentAdd = (todoData: TransformedType) => {

      // Create a new comment object conditionally
      const newCommentValue: CreateCommentType = {
        assignedTo : {id : user?.id  || 0},
        taskId : todoData?.id || 0,
        type : todoData.type,
        formattedTaskId : todoData.formattedId,
          ...(newComment.trim().length > 0 && { content: newComment }), // Include content if it exists
          ...(commentImages.length > 0 && { imageUrl: commentImages }), // Include imageUrl if it exists, joining array into a string
      };

      // Check if there's any valid content or image to add
      if (newCommentValue.content?.length || newCommentValue.imageUrl?.length) {
          updateTodoComment({ 
              todoData, 
              comment : newCommentValue 
          });
        
          // Clear the states after adding the comment
          setNewComment('');
          setCommentImages([]);
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
        {!isChildTasksFetching && todoData?.type === TodoTaskType.STORY && (
                <ChildTasks bugs={childTasksData?.bugs} features={childTasksData?.features} />
            )}
         {!isChildStoryFetching && todoData?.type === TodoTaskType.EPIC && (
                <ChildStories stories={childStoryData?.stories}  />
            )}    
        <div className={styles.commentsSection}>
          <h3><FaCommentDots /> Comments</h3>
          <ul className={styles.commentsList}>
            {comments?.length > 0 ? (
              comments?.map((comment : Comment, index : number) => (
                <li key={index} className={styles.commentItem}>
                  <FaUser className={styles.avatarIcon} />
                  <div className={styles.commentContent}>
                    <strong className={styles.commentContentStrong}>{comment.assignedTo?.email}</strong>
                    <p dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(comment?.content) }}  className={styles.commentContentP} />
                  </div>
                </li>
              ))
            ) : (
              <p>No comments yet.</p>
            )}
          </ul>
          <CommentEditor
          onImageUpload={(image) => setCommentImages((prevImages) => [...prevImages, image])}
          onContentChange={(value) => setNewComment(value)}
          />
          <button onClick={() => todoData && handleCommentAdd(todoData)} className={styles.addButton}>Add Comment</button>
        </div>
      </div>
    </div>
  );
};

export default TodoDetails;