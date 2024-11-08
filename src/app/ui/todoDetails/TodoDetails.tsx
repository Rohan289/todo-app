
'use client';
import React, { useState } from 'react';

interface TodoDetails {
  id: number;
  title: string;
  content: string;
  assignee: string;
  priority: string;
  createdDate: string;
  status: string;
  comments: string[];
}

const TodoDetails: React.FC<{ todo: TodoDetails }> = ({ todo }) => {
  const [status, setStatus] = useState(todo.status);
  const [priority, setPriority] = useState(todo.priority);
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState(todo.comments);

  const handleAddComment = () => {
    if (newComment.trim()) {
      setComments([...comments, newComment]);
      setNewComment('');
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '20px' }}>Todo Details</h1>
      <div style={{ marginBottom: '20px' }}>
        <strong>Ticket ID:</strong> {todo.id}
      </div>
      <div style={{ marginBottom: '20px' }}>
        <strong>Title:</strong> {todo.title}
      </div>
      <div style={{ marginBottom: '20px' }}>
        <strong>Content:</strong> {todo.content}
      </div>
      <div style={{ marginBottom: '20px' }}>
        <strong>Assignee:</strong> {todo.assignee}
      </div>
      <div style={{ marginBottom: '20px' }}>
        <strong>Priority:</strong>
        <select value={priority} onChange={(e) => setPriority(e.target.value)} style={{ marginLeft: '10px' }}>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
      </div>
      <div style={{ marginBottom: '20px' }}>
        <strong>Status:</strong>
        <select value={status} onChange={(e) => setStatus(e.target.value)} style={{ marginLeft: '10px' }}>
          <option value="Open">Open</option>
          <option value="In Progress">In Progress</option>
          <option value="Done">Done</option>
        </select>
      </div>
      <div style={{ marginBottom: '20px' }}>
        <strong>Created Date:</strong> {new Date(todo.createdDate).toLocaleDateString()}
      </div>
      <div style={{ marginBottom: '20px' }}>
        <h2>Comments</h2>
        <ul>
          {comments.map((comment, index) => (
            <li key={index}>{comment}</li>
          ))}
        </ul>
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
          style={{ width: '100%', height: '60px', marginBottom: '10px' }}
        />
        <button onClick={handleAddComment} style={{ padding: '10px 15px' }}>
          Add Comment
        </button>
      </div>
    </div>
  );
};

export default TodoDetails;