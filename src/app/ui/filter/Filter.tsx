'use client';
import { useEffect, useState } from 'react';
import styles from './Filter.module.css';
import { useUsers } from '@/hooks/rest-api.query';
import { TODO_PRIORITY_FILTER, TODO_STATUS_FILTER } from './Filter.util';
import { User } from '@/models/User';
import { useSearchParams } from 'next/navigation';


const Filter = () => {
  // State to hold filter values
  const querySearchParams = useSearchParams(); // Access search parameters directly

  const [status, setStatus] = useState(querySearchParams.get('status') || '');
  const [priority, setPriority] = useState(querySearchParams.get('priority') || '');
  const [assignedUsers, setAssignedUsers] = useState<User[]>([]);
  const [assignedTo, setAssignedTo] = useState(querySearchParams.get('assignedTo') ? decodeURIComponent(decodeURIComponent(querySearchParams.get('assignedTo') as string)) : '');
  const [searchParams,setSearchParams]  = useState<string>('');

  const { data: users } = useUsers();

  const resetQueryString = () => {
    // Create a new URL object based on the current URL
    const url = new URL(window.location.href);

    // Clear the query parameters by setting search to an empty string
    url.search = '';

    // Update the URL without reloading the page
    window.history.pushState({}, '', url); // Use replaceState if you don't want to add to history
};


  const handleFilterApply = (queryString : string) => {
    // Create a new URL object based on the current URL
    const url = new URL(window.location.href);

    // Create URLSearchParams object from the current URL's query parameters
    const params = new URLSearchParams(url.search);
    // Add or update the query parameters based on the queryString
    queryString.split('&').forEach(param => {
        const [key, value] = param.split('=');
        if (value) {
            params.set(key, value); // Use set to add or update the parameter
        } else {
            params.delete(key); // If no value is provided, remove the parameter
        }
    });
    if(!queryString.length) {
        params.delete('status');
        params.delete('priority');
        params.delete('assignedTo');
    }
    // Update the URL without reloading the page
    url.search = params.toString();
    window.history.pushState({}, '', url); // Use replaceState if you don't want to add to history
};

  const handleResetFilters = () => {
    setStatus('');
    setPriority('');
    setAssignedTo('');
    resetQueryString();
  }

  useEffect(() => {
    if(users) {
    setAssignedUsers(users as unknown as User[]);
    }
  },[users])

  useEffect(() => {
    // Build the searchParams string based on the current state
    const params = [];
    if (status) params.push(`status=${encodeURIComponent(status)}`);
    if (priority) params.push(`priority=${encodeURIComponent(priority)}`);
    if (assignedTo) params.push(`assignedTo=${encodeURIComponent(assignedTo)}`);
    // Join the parameters with '&' and update the searchParams state
    setSearchParams(params.length ? params.join('&') : '');
}, [status, priority, assignedTo]);

  return (
    <div className={styles.filterContainer}>
      <div className={styles.filterOptions}>
        <div className={styles.filterOptionsDiv}>
          <label className={styles.filterOptionsLabel}>Status:</label>
          <select className={styles.filterOptionsSelect} value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">All</option>
            {TODO_STATUS_FILTER.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))} 
          </select>
        </div>
        
        <div className={styles.filterOptionsDiv}>
          <label className={styles.filterOptionsLabel}>Priority:</label>
          <select className={styles.filterOptionsSelect} value={priority} onChange={(e) => setPriority(e.target.value)}>
            <option value="">All</option>
            {TODO_PRIORITY_FILTER.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))} 
          </select>
        </div>
        
        <div className={styles.filterOptionsDiv}>
          <label className={styles.filterOptionsLabel}>Assigned To:</label>
          <select className={styles.filterOptionsSelect} value={assignedTo} onChange={(e) => setAssignedTo(e.target.value)}>
            <option value="">All</option>

            {(assignedUsers as User[])?.map(({name}) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))} 
          </select>
        </div>
      </div>
      <div className={styles.buttonContainer}>
          <button className={styles.filterButton} onClick={() => handleFilterApply(searchParams)}>Filter</button>
          <button className={styles.resetButton} onClick={handleResetFilters}>Reset</button>
        </div>
    </div>
  );
};

export default Filter;
