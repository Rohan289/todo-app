import { Todo } from "@/models/Todo";
import { User } from "@/models/User";
import { TodoType } from "@/app/ui/todoCard/TodoCard.model";
import { AppDataSource } from "@/typeorm/typeorm";

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
    async updateTodo(id: number, todo: Partial<TodoType>): Promise<Todo> {
        const updatedTodo = await todoRepository.findOneBy({id : id});
        if (!updatedTodo) {
            throw new Error("Wrong todo id");
        }
        await todoRepository.save({...updatedTodo, ...todo});
        return updatedTodo;
    }
}