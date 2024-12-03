import { User } from "@/models/User";
import { AppDataSource } from "@/typeorm/typeorm";
import { Epic } from "@/models/Epic";
import { Bug } from "@/models/Bug";
import { BugType } from "@/app/ui/bug/Bug.model";

const bugRepository = AppDataSource.getRepository(Bug);
const userRepository = AppDataSource.getRepository(User);

export const BugRepository = {
    async getAllBugs() : Promise<Epic[]> {
        return await bugRepository.createQueryBuilder('bug')
        .leftJoinAndSelect('bug.assignedTo','assignedTo').leftJoinAndSelect('bug.story','story').getMany();
    },
    async createBug(bugData : Omit<Bug,'id'>): Promise<Bug> {
        const user = await userRepository.findOneBy({id : bugData.assignedTo.id});
        if(!user) {
            throw new Error("User not found");
        }
        const bug = bugRepository.create({
            ...bugData,
            assignedTo : user
        }); 
        await bugRepository.save(bug);
        return bug;
    },
    async updateBug(id: number, bug: Partial<BugType>): Promise<Bug> {
        const updatedBug= await bugRepository.findOneBy({id : id});
        if (!updatedBug) {
            throw new Error("Wrong epic id");
        }
        await bugRepository.save({...updatedBug, ...bug});
        return updatedBug;
    }
}