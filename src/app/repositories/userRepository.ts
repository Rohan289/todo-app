import { AppDataSource } from "@/typeorm/datasource";
import { User } from "../models/User";

const userRepository = AppDataSource.getRepository(User);

export const UserRepository = {
    async createUser(userData : Omit<User,'id'>): Promise<User> {
        const user = userRepository.create(userData);
        await userRepository.save(user);
        return user;
    }
}