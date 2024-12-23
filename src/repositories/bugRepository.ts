import { User } from "@/models/User";
import { AppDataSource } from "@/typeorm/typeorm";
import { Bug } from "@/models/Bug";
import { BugType } from "@/app/ui/bug/Bug.model";
import { Story } from "@/models/Story";

const bugRepository = AppDataSource.getRepository(Bug);
const userRepository = AppDataSource.getRepository(User);
const storyRepository = AppDataSource.getRepository(Story);

export const BugRepository = {
    async getBugById(bugId: string): Promise<Bug | null> {
        return await bugRepository.findOneBy({id : parseInt(bugId)});       
    },
    async getAllBugs() : Promise<Bug[]> {
        return await bugRepository.createQueryBuilder('bug')
        .leftJoinAndSelect('bug.assignedTo','assignedTo').getMany();
    },
    async getBugsByStoryId(storyId: string): Promise<Bug[] | null> {
        return await bugRepository.find({where : {storyId : parseInt(storyId)}, relations : ['assignedTo']});       
    },
    async createBug(bugData: Omit<Bug, 'id'>): Promise<Bug> {
        try {
            const user = await userRepository.findOneBy({ id: bugData.assignedTo.id });
            if (!user) {
                throw new Error("User not found");
            }

            const story = await storyRepository.findOneBy({ id: bugData.storyId });
            if (!story) {
                throw new Error("Story not found");
            }
    
            const bug = bugRepository.create({
                ...bugData,
                assignedTo: user,
            });
    
            await bugRepository.save(bug);
            bug.formattedId = `BUG-${bug.id}`;
    
            await bugRepository.save(bug); // Save again to update the formattedId
            return bug;
        } catch (error) {
            console.error("Error creating bug:", error);
            throw error; // Rethrow the error after logging
        }
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