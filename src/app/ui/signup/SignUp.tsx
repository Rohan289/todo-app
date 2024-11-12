'use client';
import { useState } from 'react';
import styles from './Signup.module.css'; // Create a CSS module for styling
import { useCreateUser } from '@/hooks/rest-api.mutation';

const Signup: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [successMessage, setSuccessMessage] = useState(''); // State for success message

  const handleCreateUserSuccess = () => {
    setSuccessMessage('User created successfully!'); // Set success message
    // Reset the form fields
    setName('');
    setEmail('');
    setPassword('');

    // Clear the success message after 5 seconds
    setTimeout(() => {
      setSuccessMessage('');
    }, 5000);
  };

  const { mutate: createUser } = useCreateUser(handleCreateUserSuccess);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createUser({ name, email, password, action: 'signup' });
  };

  return (
    <div className={styles.signupContainer}>
      <h1>Sign Up</h1>
      {successMessage && (
        <div className={styles.successBanner}>
          {successMessage}
        </div>
      )}
      <form onSubmit={handleSubmit} className={styles.signupForm}>
        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="name">Name</label>
          <input
            className={styles.input}
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}  htmlFor="email">Email</label>
          <input
            className={styles.input}
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}  htmlFor="password">Password</label>
          <input
            className={styles.input}
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className={styles.submitButton}>Sign Up</button>
      </form>
    </div>
   
  );
};

export default Signup;