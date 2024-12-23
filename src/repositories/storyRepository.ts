import { User } from "@/models/User";
import { AppDataSource } from "@/typeorm/typeorm";
import { Epic } from "@/models/Epic";
import { Story } from "@/models/Story";
import { StoryType } from "@/app/ui/story/Story.model";

const storyRepository = AppDataSource.getRepository(Story);
const userRepository = AppDataSource.getRepository(User);
const epicRepository = AppDataSource.getRepository(Epic);

export const StoryRepository = {
    async getAllStory() : Promise<Story[]> {
        return await storyRepository.createQueryBuilder('story')
        .leftJoinAndSelect('story.assignedTo','assignedTo').leftJoinAndSelect
        ('story.epic','stories').getMany();
    },
    async getStoryById(storyId: string): Promise<Story | null> {
        return await storyRepository.findOne({where : {id : parseInt(storyId)},relations : ['epic']});       
    },
    async getStoriesByEpicId(epicId: string): Promise<Story[] | null> {
        return await storyRepository.find({where : {epic : {
            formattedId : epicId
        }}, relations : ['assignedTo']});       
    },
    getStoryIdFromFormattedId(formattedId: string): Promise<Story | null> {
        return storyRepository.findOne({ where: { formattedId } });
    },
    async createStory(storyData : Omit<Story,'id'>): Promise<Story> {
        const user = await userRepository.findOneBy({id : storyData.assignedTo.id});
        const epic = await epicRepository.findOneBy({id : storyData.epic.id});
        if(!user) {
            throw new Error("User not found");
        }
        if(!epic) {
            throw new Error("Epic not found");
        }
        const story = storyRepository.create({
            ...storyData,
            assignedTo : user,
            epic : epic
        }); 
        await storyRepository.save(story);
        story.formattedId = `STORY-${story.id}`;
        await storyRepository.save(story); // Save again to update the formattedId
        return story;
    },
    async updateStory(id: number, story: Partial<StoryType>): Promise<Story> {
        const updatedStory = await storyRepository.findOneBy({id : id});
        if (!updatedStory) {
            throw new Error("Wrong story id");
        }
        await storyRepository.save({...updatedStory, ...story});
        return updatedStory;
    }
}