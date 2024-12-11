import { User } from "@/models/User";
import { AppDataSource } from "@/typeorm/typeorm";
import { Bug } from "@/models/Bug";
import { BugType } from "@/app/ui/bug/Bug.model";

const bugRepository = AppDataSource.getRepository(Bug);
const userRepository = AppDataSource.getRepository(User);

export const BugRepository = {
    async getAllBugs() : Promise<Bug[]> {
        return await bugRepository.createQueryBuilder('bug')
        .leftJoinAndSelect('bug.assignedTo','assignedTo').leftJoinAndSelect('bug.story','story').getMany();
    },
    async getBugByStoryId(storyId: string): Promise<Bug | null> {
        return await bugRepository.findOneBy({story : {
            formattedId : storyId
        }});       
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
        bug.formattedId = `BUG-${bug.id}`;
        await bugRepository.save(bug); // Save again to update the formattedId
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