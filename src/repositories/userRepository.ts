import { User } from "@/models/User";
import { AppDataSource } from "@/typeorm/typeorm";
import bcrypt from 'bcrypt';

const userRepository = AppDataSource.getRepository(User);
const saltRounds = 10; // You can adjust the salt rounds for security vs. performance


export const UserRepository = {
    async validateUser(email: string, password: string) {
        const user = await userRepository.findOne({ where: { email } });
      
        if (!user) {
          throw new Error('User not found');
        }
      
        // Compare the provided password with the stored hashed password
        const isPasswordValid = await bcrypt.compare(password, user.password);
      
        if (!isPasswordValid) {
          throw new Error('Invalid password');
        }
      
        return user; // Return the user if the password is valid
      },
    async createUser(userData : Partial<User>): Promise<User> {
        const {password,name,email} = userData;
        const userFound = await userRepository.findOne({ where: { email } });
        if(userFound) {
            throw new Error('User already exists');
        };
        const hashedPassword = await bcrypt.hash(password as string, saltRounds);
        const user = userRepository.create({
            name,
            email,
            password: hashedPassword, // Store the hashed password
          });
        await userRepository.save(user);
        return user;
    },
    async getUser() : Promise<User[]> {
        return await userRepository.find();
    }
}