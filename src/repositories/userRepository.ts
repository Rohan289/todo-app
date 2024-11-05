import { User } from "@/models/User";
import { AppDataSource } from "@/typeorm/datasource";

const userRepository = AppDataSource.getRepository(User);

export const UserRepository = {
    async createUser(userData : Omit<User,'id'>): Promise<User> {
        const user = userRepository.create(userData);
        await userRepository.save(user);
        return user;
    },
    async getUser() : Promise<User[]> {
        return await userRepository.find();
    }
}