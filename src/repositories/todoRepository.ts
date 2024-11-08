import { AppDataSource } from "@/typeorm/datasource";
import { Todo } from "@/models/Todo";
import { User } from "@/models/User";

const todoRepository = AppDataSource.getRepository(Todo);
const userRepository = AppDataSource.getRepository(User);

export const TodoRepository = {
    async getAllTodos() : Promise<Todo[]> {
        return await todoRepository.createQueryBuilder('todo')
        .leftJoinAndSelect('todo.createdBy','createdBy').getMany();
    },
    async createTodo(todoData : Omit<Todo,'id'>): Promise<Todo> {
        const user = await userRepository.findOneBy({id : todoData.createdBy.id});
        if(!user) {
            throw new Error("User not found");
        }
        const todo = todoRepository.create({
            ...todoData,
            createdBy : user
        }); 
        await todoRepository.save(todo);
        return todo;
    },
    async updateTodo(id: number, status: string): Promise<Todo> {
        const updatedTodo = await todoRepository.findOneBy({id : id});
        if (!updatedTodo) {
            throw new Error("Wrong todo id");
        }
        updatedTodo.status = status;
        await todoRepository.save(updatedTodo);
        return updatedTodo;
    }
}