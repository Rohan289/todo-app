import { TodoPriority, TodoStatus } from "../todoCard/TodoCard.model";

export const TODO_STATUS_FILTER = [
    {
        value : TodoStatus.DONE,
        label : 'Done'
    },
    {
        value : TodoStatus.IN_PROGRESS,
        label : 'In Progress'
    },
    {
        value : TodoStatus.OPEN,
        label : 'Open'
    }
]

export const TODO_PRIORITY_FILTER = [
    {
        value : TodoPriority.HIGH,
        label : 'High'
    },
    {
        value : TodoPriority.MEDIUM,
        label : 'Medium'
    },
    {
        value : TodoPriority.LOW,
        label : 'Low'
    }
]