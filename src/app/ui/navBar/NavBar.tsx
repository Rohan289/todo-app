import React from 'react';
import Link from 'next/link';
import styles from './navBar.module.css';

export default function Navbar() {
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
                </ul>
            </div>
        </nav>
    );
}