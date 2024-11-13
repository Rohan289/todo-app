'use client';
import React, { useEffect } from 'react';
import Link from 'next/link';
import styles from './navBar.module.css';
import { useUserDetails } from '@/app/common/context/UserDetailsContext';

export default function Navbar() {
    const { state: { user, isAuthenticated }, dispatch } = useUserDetails();

    useEffect(() => {
        // Example: Load user from local storage
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const user = JSON.parse(storedUser);
            dispatch({ type: 'SET_USER', payload: user });
        }
    }, [dispatch]);

    const handleLogout = () => {
        localStorage.removeItem('user');
        dispatch({ type: 'LOGOUT' });
    };

    console.log('Stateee : : : :', user,isAuthenticated);

    return (
        <nav className={styles.navbar}>
            <div className={styles.navbarContainer}>
                <h1 className={styles.navbarTitle}>My App</h1>
                <ul className={styles.navbarMenu}>
                    <li className={styles.navbarItem}>
                        <Link href="/" className={styles.navbarLink}>Home</Link>
                    </li>
                    <li className={styles.navbarItem}>
                        <Link href="/todoList" className={styles.navbarLink}>Todo List</Link>
                    </li>
                    <li className={styles.navbarItem}>
                        <Link href="/signup" className={styles.navbarLink}>Sign Up</Link>
                    </li>
                    <li className={styles.navbarItem}>
                        {isAuthenticated ? <Link className={styles.navbarLink} href='/' onClick={() => handleLogout()}>Logout</Link> :  <Link href="/login" className={styles.navbarLink}>Login</Link>}
                    </li>
                </ul>
            </div>
        </nav>
    );
}