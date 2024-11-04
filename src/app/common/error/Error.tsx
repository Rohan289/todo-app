
import React from 'react';
import styles from  './Error.module.css'; // Import the CSS file for styling

const ErrorComponent = ({ message } : {message : string}) => {
  return (
    <div className={styles.errorContainer}>
      <h2 className={styles.errorHeader}>Error Occurred</h2>
      <p className={styles.errorText}>{message || "Something went wrong. Please try again later."}</p>
    </div>
  );
};

export default ErrorComponent;