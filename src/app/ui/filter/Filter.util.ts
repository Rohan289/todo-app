import { Bug } from "@/models/Bug";
import { Epic } from "@/models/Epic";
import { Story } from "@/models/Story";
import { Feature } from "typeorm";
import { InputData, TransformedType } from "../todo/Todo.model";
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

export function transformData(input: InputData): TransformedType[] {
    const result: TransformedType[] = [];

    for (const [key, items] of Object.entries(input)) {
        const typeKey = key.endsWith('s') ? key.slice(0, -1).toUpperCase() : key.toUpperCase();

        // Determine the type based on the enums
        let type: string | undefined;
        if (typeKey in TodoTaskType) {
            type = TodoTaskType[typeKey as keyof typeof TodoTaskType];
        } else if (typeKey in TodoSubTaskType) {
            type = TodoSubTaskType[typeKey as keyof typeof TodoSubTaskType];
        }
        const transformedItems = items.map((item : (Epic | Feature | Story | Bug)) => ({
            ...item,
            type: type
        }));
        result.push(...transformedItems);
    }

    return result;
}