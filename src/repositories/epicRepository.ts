import { User } from "@/models/User";
import { AppDataSource } from "@/typeorm/typeorm";
import { Epic } from "@/models/Epic";
import { EpicType } from "@/app/ui/epic/Epic.model";

const epicRepository = AppDataSource.getRepository(Epic);
const userRepository = AppDataSource.getRepository(User);

export const EpicRepository = {
    async getAllEpics() : Promise<Epic[]> {
        return await epicRepository.createQueryBuilder('epic')
        .leftJoinAndSelect('epic.assignedTo','assignedTo').getMany();
    },
        async getEpicById(epicId: string): Promise<Epic | null> {
            return await epicRepository.findOneBy({id : parseInt(epicId)});       
        },
    async createEpic(epicData : Omit<Epic,'id'>): Promise<Epic> {
        const user = await userRepository.findOneBy({id : epicData.assignedTo.id});
        if(!user) {
            throw new Error("User not found");
        }
        const epic = epicRepository.create({
            ...epicData,
            assignedTo : user
        }); 
        await epicRepository.save(epic);
        epic.formattedId = `EPIC-${epic.id}`;
        await epicRepository.save(epic); // Save again to update the formattedId
        return epic;
        },
    async updateEpic(id: number, epic: Partial<EpicType>): Promise<Epic> {
        const updatedEpic = await epicRepository.findOneBy({id : id});
        if (!updatedEpic) {
            throw new Error("Wrong epic id");
        }
        await epicRepository.save({...updatedEpic, ...epic});
        return updatedEpic;
    }
}