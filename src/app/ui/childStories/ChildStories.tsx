'use client';
import React from 'react';
import { FaStore } from 'react-icons/fa'; // Icons for bugs and features
import styles from '../childTasks/ChildTasks.module.css'; // Import your CSS module
import Avatar from '../Avatar/Avatar';
import { ChildStoriesType } from './ChildStories.model';

const ChildStories: React.FC<ChildStoriesType> = ({ stories }) => {
    return (
        <div className={styles.childTasksContainer}>
            <div className={styles.taskSection}>
                {stories && stories.length > 0 && (
                    <div className={styles.bugsSection}>
                        <h4 className={styles.subHeader}>Child Stories</h4>
                        <ul className={styles.taskList}>
                            {stories.map((story) => (
                                <li key={story.id} className={styles.taskItem}>
                                    <FaStore className={styles.taskIcon} />
                                    <a href={`/todo/${story.formattedId}`} className={styles.taskLink}>{story.title}</a>
                                    {story.assignedTo && (
                                        <div className={styles.assignedToContainer}>
                                            <Avatar username={story.assignedTo.name} />&nbsp;&nbsp;&nbsp;
                                            <span className={styles.assignedTo}>{story.assignedTo.name}</span>
                                        </div>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

            </div>
            {(!stories || stories.length === 0)  && <p>No child stories found.</p>}
        </div>
    );
}

export default ChildStories;