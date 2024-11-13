
'use client';
import React from 'react'
import styles from './HomePage.module.css';
import { useRouter } from 'next/navigation';
const HomePage = () => {
    const router = useRouter();

  return (
    <div>
        <div className={styles.hero}>
        <div className={styles.content}>
            <h1 className={styles.contentH1}>Streamline Your IT Ticket System</h1>
            <p className={styles.contentP}>Manage and resolve IT tickets efficiently with our advanced ticketing system, designed for seamless workflow and optimal performance.</p>
            <a href="#" onClick={() => router.push(`/todoList`)} className={styles.btn}>Get Started</a>
        </div>
    </div>
    </div>
  )
}

export default HomePage;
