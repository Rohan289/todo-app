'use client';
import React, { useEffect, useState } from 'react';
import styles from './ErrorBanner.module.css'; // Import your CSS module or use inline styles

const ErrorBanner = ({ message } : {message : string}) => {
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setVisible(false);
        }, 3000); // Hide the banner after 3 seconds

        return () => clearTimeout(timer); // Cleanup the timer on unmount
    }, []);

    if (!visible) return null; // Don't render the banner if it's not visible

    return (
        <div className={styles.banner}>
            {message}
        </div>
    );
};

export default ErrorBanner;