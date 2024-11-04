import { TodoStatus } from "./TodoCard.model";
import { FaCheckCircle, FaSpinner, FaExclamationCircle } from 'react-icons/fa'; // Importing icons

export const getPriorityClass = (priority: string, styles: {
    readonly [key: string]: string;
}) => {
    switch (priority) {
        case 'HIGH':
            return styles.highPriority;
        case 'MEDIUM':
            return styles.mediumPriority;
        case 'LOW':
            return styles.lowPriority;
        default:
            return '';
    }
};

export const getStatusClass = (status: string, styles: {
    readonly [key: string]: string;
}) => {
    switch (status.toUpperCase()) {
        case TodoStatus.DONE:
            return styles.done; // Assuming you have a CSS class for completed status
        case TodoStatus.IN_PROGRESS:
            return styles.inProgress; // Assuming you have a CSS class for in-progress status
        case TodoStatus.OPEN:
            return styles.open; // Assuming you have a CSS class for pending status
        default:
            return '';
    }
};

export const getStatusIcon = (status: string, styles: {
    readonly [key: string]: string;
}) => {
    let statusIcon;

    // Determine the icon based on status
    switch (status.toUpperCase()) {
        case TodoStatus.DONE:
            statusIcon = <FaCheckCircle className={styles.statusIcon} />;
            break;
        case TodoStatus.IN_PROGRESS:
            statusIcon = <FaSpinner className={styles.statusIcon} />;
            break;
        case TodoStatus.OPEN:
            statusIcon = <FaExclamationCircle className={styles.statusIcon} />;
            break;
        default:
            statusIcon = null;
    }
    return statusIcon; // Return the statusIcon outside the switch block
};