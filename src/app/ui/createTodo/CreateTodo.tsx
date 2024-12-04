import { useEffect, useState } from 'react';
import { User } from '@/models/User';
import styles from './CreateTodo.module.css';
import { TODO_PRIORITY_FILTER, TODO_SUB_TASK_FILTER, TODO_TASK_FILTER } from '../filter/Filter.util';
import { CreateTodoType, TodoPriority, TodoSubTaskType, TodoTaskType } from '../todoCard/TodoCard.model';
import { useEpics, useStories } from '@/hooks/rest-api.query';
import { StoryType } from '../story/Story.model';
import { EpicType } from '../epic/Epic.model';

interface CreateTodoProps {
  onClose: () => void;
  users: User[] | [];
  createTodo: (todo: CreateTodoType) => void;
}

const CreateTodo = ({ onClose, users, createTodo }: CreateTodoProps) => {
  // Define state variables
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [assignedTo, setAssignedTo] = useState(users[0]?.id || '');
  const [priority, setPriority] = useState(TODO_PRIORITY_FILTER[0]?.value || '');
  const [errors, setErrors] = useState({ title: '', content: '', story: '' });
  const [taskType, setTaskType] = useState<TodoTaskType | null>(null);
  const [subTaskType, setSubTaskType] = useState<TodoSubTaskType | null>(null);
  const [callStoriesApi, setCallStoriesApi] = useState(false);
  const [storyId, setStoryId] = useState<number | null>(null);
  const [epicId, setEpicId] = useState<number | null>(null);
  const [callEpicApi, setCallEpicApi] = useState(false);

  
  const { data: storiesData } = useStories({ enableQuery: callStoriesApi }, () => {
    setCallStoriesApi(false);
  });

  const { data: epicsData } = useEpics({ enableQuery: callEpicApi }, () => {
    setCallEpicApi(false);
  });

  const validateFields = () => {
    const newErrors = { title: '', content: '', story: '', epic : '' };
    if (!title.length) {
      newErrors.title = 'Title is required';
    }
    if (!content.length) {
      newErrors.content = 'Content is required';
    }
    if (taskType === TodoTaskType.TASK) {
      if (!storyId) {
        newErrors.story = 'A story must be selected when task type is TASK';
      }
    }
    if (taskType === TodoTaskType.STORY) {
      if (!epicId) {
        newErrors.epic = 'A epic must be selected when task type is STORY';
      }
    }

    setErrors(newErrors);
    return Object.values(newErrors).every(error => !error); // Return true if no errors
  };

    // Set the default storyId to the first story when storiesData is available
    useEffect(() => {
      if (taskType === TodoTaskType.TASK && storiesData && (storiesData as StoryType[]).length > 0) {
        setStoryId((storiesData as StoryType[])[0]?.id); // Set to the first story's ID
      }
    }, [storiesData, taskType]);

    useEffect(() => {
      if (taskType === TodoTaskType.STORY && epicsData && (epicsData as EpicType[]).length > 0) {
        setEpicId((epicsData as EpicType[])[0]?.id); // Set to the first epic's ID
      }
    }, [epicsData, taskType]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate fields
    if (!validateFields()) {
      return; // Stop form submission if there are validation errors
    }

    const newTodo: CreateTodoType = {
      title,
      content,
      assignedTo: { id: assignedTo as number },
      priority,
      type: taskType as TodoTaskType,
      ...(taskType === TodoTaskType.TASK && { subTaskType })
    };

    createTodo(newTodo);
    onClose();
  };

  useEffect(() => {
    if (taskType === TodoTaskType.TASK && !storiesData) {
      setCallStoriesApi(true);
    }
  }, [storiesData, taskType]);

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>Create Task</h2>
          <button onClick={onClose} className={styles.closeButton}>×</button>
        </div>
        <form onSubmit={handleSubmit} className={styles.modalContent}>
          <div className={styles.field}>
            <label className={styles.label}>Task Type:</label>
            <select
              className={styles.select}
              value={taskType || ''}
              onChange={(e) => setTaskType(e.target.value as TodoTaskType)}
            >
              {TODO_TASK_FILTER.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          {taskType === TodoTaskType.TASK && (
            <div className={styles.field}>
              <label className={styles.label}>Sub task type:</label>
              <select
                className={styles.select}
                value={subTaskType || ''}
                onChange={(e) => setSubTaskType(e.target.value as TodoSubTaskType)}
              >
                {TODO_SUB_TASK_FILTER.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          )}
          <div className={styles.field}>
            <label className={styles.label}>Task Title:</label>
            <input
              className={styles.input}
              type="text"
              id="todoTitle"
              placeholder="Enter task title..."
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                setErrors({ ...errors, title: '' });
              }}
            />
            {errors.title && <span className={styles.error}>{errors.title}</span>}
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Task Content:</label>
            <textarea
              className={styles.textArea}
              id="todoContent"
              placeholder="Enter task content..."
              rows={4}
              value={content}
              onChange={(e) => {
                setContent(e.target.value);
                setErrors({ ...errors, content: '' });
              }}
            ></textarea>
            {errors.content && <span className={styles.error}>{errors.content}</span>}
          </div>
          {taskType === TodoTaskType.TASK && (
            <div className={styles.field}>
              <label className={styles.label}>Story</label>
              <select
                className={styles.select}
                value={storyId || ''}
                onChange={(e) => setStoryId(e.target.value ? parseInt(e.target.value, 10) : null)}
              >
                {(storiesData as StoryType[])?.map((option: StoryType) => (
                  <option key={option.id} value={option.id}>
                    {option.content}
                  </option>
                ))}
              </select>
              {errors.story && <span className={styles.error}>{errors.story}</span>}
            </div>
          )}

          {taskType === TodoTaskType.STORY && (
            <div className={styles.field}>
              <label className={styles.label}>Epic</label>
              <select
                className={styles.select}
                value={epicId || ''}
                onChange={(e) => setEpicId(e.target.value ? parseInt(e.target.value, 10) : null)}
              >
                {(epicsData as EpicType[])?.map((option: EpicType) => (
                  <option key={option.id} value={option.id}>
                    {option.content}
                  </option>
                ))}
              </select>
              {errors.epic && <span className={styles.error}>{errors.epic}</span>}
            </div>
          )}
          <div className={styles.modalFooter}>
            <div className={styles.assignField}>
              <label className={styles.label}>Assigned To:</label>
              <select
                className={styles.select}
                id="assignedTo"
                value={assignedTo}
                onChange={(e) => setAssignedTo(e.target.value)}
              >
                {users.map((user) => (
                  <option key={user.id} value={user.id}>{user.name}</option>
                ))}
              </select>
            </div>
            {taskType === TodoTaskType.TASK && (
              <div className={styles.priorityField}>
                <label className={styles.label}>Priority:</label>
                <select
                  className={styles.select}
                  id="priority"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as TodoPriority)}
                >
                  {TODO_PRIORITY_FILTER.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            )}
            <button type="submit" className={styles.submitButton}>Submit</button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default CreateTodo;