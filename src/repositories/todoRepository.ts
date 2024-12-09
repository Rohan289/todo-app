import { Todo } from "@/models/Todo";
import { User } from "@/models/User";
import { TodoSubTaskType, TodoTaskType, TodoType, TodoTypes } from "@/app/ui/todoCard/TodoCard.model";
import { AppDataSource } from "@/typeorm/typeorm";
import { EpicRepository } from "./epicRepository";
import { FeatureRepository } from "./featureRepository";
import { StoryRepository } from "./storyRepository";
import { BugRepository } from "./bugRepository";
import { Bug } from "@/models/Bug";
import { Epic } from "@/models/Epic";
import { Feature } from "@/models/Feature";
import { Story } from "@/models/Story";

const todoRepository = AppDataSource.getRepository(Todo);
const userRepository = AppDataSource.getRepository(User);

export const TodoRepository = {
    async getAllTodos() : Promise<Todo[]> {
        return await todoRepository.createQueryBuilder('todo')
        .leftJoinAndSelect('todo.assignedTo','assignedTo').getMany();
    },
    async createTodo(todoData : Omit<Todo,'id'>): Promise<Todo> {
        const user = await userRepository.findOneBy({id : todoData.assignedTo.id});
        if(!user) {
            throw new Error("User not found");
        }
        const todo = todoRepository.create({
            ...todoData,
            assignedTo : user
        }); 
        await todoRepository.save(todo);
        return todo;
    },
     async fetchAllItems() : Promise<TodoTypes> {
        const epics = await EpicRepository.getAllEpics();
        const features = await FeatureRepository.getAllFeatures();
        const stories = await StoryRepository.getAllStory();
        const bugs = await BugRepository.getAllBugs();
    
        return {
            epics,
            features,
            stories,
            bugs,
        };
    },
    async findIdType(id: string): Promise<TodoTaskType | TodoSubTaskType | null> {
        // Determine the type based on the prefix of the id
        if (id.startsWith('EPIC-')) {
            const epicRepo = AppDataSource.getRepository(Epic);
            const isEpic = await epicRepo.findOne({ where: { formattedId: id } });
            if (isEpic) return TodoTaskType.EPIC;
        } else if (id.startsWith('FEATURE-')) {
            const featureRepo = AppDataSource.getRepository(Feature);
            const isFeature = await featureRepo.findOne({ where: { formattedId: id } });
            if (isFeature) return TodoSubTaskType.FEATURE;
        } else if (id.startsWith('STORY-')) {
            const storyRepo = AppDataSource.getRepository(Story);
            const isStory = await storyRepo.findOne({ where: { formattedId: id } });
            if (isStory) return TodoTaskType.STORY;
        } else if (id.startsWith('BUG-')) {
            const bugRepo = AppDataSource.getRepository(Bug);
            const isBug = await bugRepo.findOne({ where: { formattedId: id } });
            if (isBug) return TodoSubTaskType.BUG;
        }
    
        return null; // ID not found in any table
    },
        async updateTodo(id: number, todo: Partial<TodoType>): Promise<Todo> {
        const updatedTodo = await todoRepository.findOneBy({id : id});
        if (!updatedTodo) {
            throw new Error("Wrong todo id");
        }
        await todoRepository.save({...updatedTodo, ...todo});
        return updatedTodo;
    }
}