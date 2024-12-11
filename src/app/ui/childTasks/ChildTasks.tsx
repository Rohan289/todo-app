'use client';
import React from 'react';
import { ChildTasksType } from "./ChildTasks.model";
import { FaBug, FaLightbulb } from 'react-icons/fa'; // Icons for bugs and features
import styles from './ChildTasks.module.css'; // Import your CSS module
import Avatar from '../Avatar/Avatar';

const ChildTasks: React.FC<ChildTasksType> = ({ bugs, features }) => {
    return (
        <div className={styles.childTasksContainer}>
            <h3 className={styles.header}>Child Tasks</h3>
            <div className={styles.taskSection}>
                {bugs && bugs.length > 0 && (
                    <div className={styles.bugsSection}>
                        <h4 className={styles.subHeader}>Bugs</h4>
                        <ul className={styles.taskList}>
                            {bugs.map((bug) => (
                                <li key={bug.id} className={styles.taskItem}>
                                    <FaBug className={styles.taskIcon} />
                                    <a href={`/todo/${bug.formattedId}`} className={styles.taskLink}>{bug.title}</a>
                                    {bug.assignedTo && (
                                        <div className={styles.assignedToContainer}>
                                            <Avatar username={bug.assignedTo.name} />&nbsp;&nbsp;&nbsp;
                                            <span className={styles.assignedTo}>{bug.assignedTo.name}</span>
                                        </div>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
                {features && features.length > 0 && (
                    <div className={styles.featuresSection}>
                        <h4 className={styles.subHeader}>Features</h4>
                        <ul className={styles.taskList}>
                            {features.map((feature) => (
                                <li key={feature.id} className={styles.taskItem}>
                                    <FaLightbulb className={styles.taskIcon} />
                                    <a href={`/todo/${feature.formattedId}`} className={styles.taskLink}>{feature.title}</a>
                                    {feature.assignedTo && (
                                        <div className={styles.assignedToContainer}>
                                            <Avatar username={feature.assignedTo.name} />&nbsp;&nbsp;&nbsp;
                                            <span className={styles.assignedTo}>{feature.assignedTo.name}</span>
                                        </div>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
            {(!bugs || bugs.length === 0) && (!features || features.length === 0) && <p>No child tasks found.</p>}
        </div>
    );
}

export default ChildTasks;