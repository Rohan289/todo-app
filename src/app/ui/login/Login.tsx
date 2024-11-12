'use client';
import { useState } from 'react';
import styles from './Login.module.css'; // Create a CSS module for styling
import { useLoginUser } from '@/hooks/rest-api.mutation';
import { User } from '@/models/User';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [successMessage, setSuccessMessage] = useState(''); // State for success message

  const handleLoginUserSuccess = (data : User) => {
    setSuccessMessage('User logged in successfully!'); // Set success message
    localStorage.setItem('user',JSON.stringify(data));
    // Reset the form fields
    setEmail('');
    setPassword('');

    // Clear the success message after 5 seconds
    setTimeout(() => {
      setSuccessMessage('');
    }, 5000);
  };

  const { mutate: loginUser } = useLoginUser(handleLoginUserSuccess);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginUser({  email, password, action: 'login' });
  };

  return (
    <div className={styles.loginContainer}>
      <h1>Login</h1>
      {successMessage && (
        <div className={styles.successBanner}>
          {successMessage}
        </div>
      )}
      <form onSubmit={handleSubmit} className={styles.loginForm}>
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
        <button type="submit" className={styles.submitButton}>Login</button>
      </form>
    </div>
   
  );
};

export default Login;