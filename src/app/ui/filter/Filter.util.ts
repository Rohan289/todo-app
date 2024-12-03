import { TodoPriority, TodoStatus, TodoSubTaskType, TodoTaskType } from "../todoCard/TodoCard.model";

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


export const TODO_TASK_FILTER = [
    {
        value : TodoTaskType.EPIC,
        label : 'Epic'
    },
    {
        value : TodoTaskType.STORY,
        label : 'Story'
    },
    {
        value : TodoTaskType.TASK,
        label : 'Task'
    },
]

export const TODO_SUB_TASK_FILTER = [
    {
        value : TodoSubTaskType.BUG,
        label : 'Bug'
    },
    {
        value : TodoSubTaskType.FEATURE,
        label : 'Feature'
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