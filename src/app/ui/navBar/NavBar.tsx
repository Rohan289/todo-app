'use client';
import React from 'react';
import Link from 'next/link';
import styles from './navBar.module.css';
import { useUserDetails } from '@/app/common/context/UserDetailsContext';
import useUserStorage from '@/hooks/useUserStorage';

export default function Navbar() {
    const { state: { isAuthenticated }, dispatch } = useUserDetails();

    useUserStorage();


    const handleLogout = () => {
        localStorage.removeItem('user');
        dispatch({ type: 'LOGOUT' });
    };


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