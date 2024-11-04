'use client';
import { useState } from 'react';
import styles from './Filter.module.css';

// Sample data for filtering
const todos = [
  { id: 1, title: 'Set up project environment', status: 'DONE', priority: 'HIGH', assignedTo: 'Rohan' },
  { id: 2, title: 'Design app layout', status: 'IN_PROGRESS', priority: 'MEDIUM', assignedTo: 'Alex' },
  { id: 3, title: 'Implement authentication', status: 'OPEN', priority: 'HIGH', assignedTo: 'Rohan' },
  { id: 4, title: 'Integrate Jira API', status: 'OPEN', priority: 'HIGH', assignedTo: 'Sarah' },
  { id: 5, title: 'Test user flow', status: 'OPEN', priority: 'MEDIUM', assignedTo: 'Alex' },
  { id: 6, title: 'Write documentation', status: 'OPEN', priority: 'LOW', assignedTo: 'Rohan' },
  { id: 7, title: 'Fix responsive design issues', status: 'IN_PROGRESS', priority: 'HIGH', assignedTo: 'Sarah' },
  { id: 8, title: 'Optimize app performance', status: 'OPEN', priority: 'MEDIUM', assignedTo: 'Alex' },
];

const Filter = () => {
  // State to hold filter values
  const [status, setStatus] = useState('');
  const [priority, setPriority] = useState('');
  const [assignedTo, setAssignedTo] = useState('');

  // Filtered list of todos
  const filteredTodos = todos.filter(todo => {
    return (
      (status ? todo.status === status : true) &&
      (priority ? todo.priority === priority : true) &&
      (assignedTo ? todo.assignedTo === assignedTo : true)
    );
  });

  const handleFilterApply = () => {}

  const handleResetFilters = () => {}

  return (
    <div className={styles.filterContainer}>
      <div className={styles.filterOptions}>
        <div className={styles.filterOptionsDiv}>
          <label className={styles.filterOptionsLabel}>Status:</label>
          <select className={styles.filterOptionsSelect} value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="">All</option>
            <option value="OPEN">Open</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="DONE">Done</option>
          </select>
        </div>
        
        <div className={styles.filterOptionsDiv}>
          <label className={styles.filterOptionsLabel}>Priority:</label>
          <select className={styles.filterOptionsSelect} value={priority} onChange={(e) => setPriority(e.target.value)}>
            <option value="">All</option>
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
          </select>
        </div>
        
        <div className={styles.filterOptionsDiv}>
          <label className={styles.filterOptionsLabel}>Assigned To:</label>
          <select className={styles.filterOptionsSelect} value={assignedTo} onChange={(e) => setAssignedTo(e.target.value)}>
            <option value="">All</option>
            <option value="Rohan">Rohan</option>
            <option value="Alex">Alex</option>
            <option value="Sarah">Sarah</option>
          </select>
        </div>
      </div>
      <div className={styles.buttonContainer}>
          <button className={styles.filterButton} onClick={handleFilterApply}>Filter</button>
          <button className={styles.resetButton} onClick={handleResetFilters}>Reset</button>
        </div>
    </div>
  );
};

export default Filter;
