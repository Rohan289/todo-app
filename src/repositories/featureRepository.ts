import { User } from "@/models/User";
import { AppDataSource } from "@/typeorm/typeorm";
import { Feature } from "@/models/Feature";
import { FeatureType } from "@/app/ui/feature/Feature.model";

const featureRepository = AppDataSource.getRepository(Feature);
const userRepository = AppDataSource.getRepository(User);

export const FeatureRepository = {
    async getFeatureById(featureId: string): Promise<Feature | null> {
        return await featureRepository.findOneBy({id : parseInt(featureId)});       
    },
    async getAllFeatures() : Promise<Feature[]> {
        return await featureRepository.createQueryBuilder('feature')
        .leftJoinAndSelect('feature.assignedTo','assignedTo').getMany();
    },
    async getFeaturesByStoryId(storyId: string): Promise<Feature[] | null> {
        return await featureRepository.find({where : {storyId : parseInt(storyId)}, relations : ['assignedTo']});            
    },
    async createFeature(featureData : Omit<Feature,'id'>): Promise<Feature> {
        const user = await userRepository.findOneBy({id : featureData.assignedTo.id});
        if(!user) {
            throw new Error("User not found");
        }
        const feature = featureRepository.create({
            ...featureData,
            assignedTo : user
        }); 
        await featureRepository.save(feature);
        feature.formattedId = `FEATURE-${feature.id}`;
        await featureRepository.save(feature); // Save again to update the formattedId
        return feature;
    },
    async updateFeature(id: number, feature: Partial<FeatureType>): Promise<Feature> {
        const updatedFeature= await featureRepository.findOneBy({id : id});
        if (!updatedFeature) {
            throw new Error("Wrong feature id");
        }
        await featureRepository.save({...updatedFeature, ...feature});
        return updatedFeature;
    }
}