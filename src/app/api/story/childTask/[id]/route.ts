import { Story } from "@/models/Story";
import { BugRepository } from "@/repositories/bugRepository";
import { FeatureRepository } from "@/repositories/featureRepository";
import { StoryRepository } from "@/repositories/storyRepository";
import { initializeDb } from "@/typeorm/typeorm";
import {  NextResponse } from "next/server";

export async function GET(_request: Request, { params }: { params: { id: string } }) {
    await initializeDb();
    const storyId = params.id;

    if (!storyId) {
        return NextResponse.json({ error: 'Story ID is required' }, { status: 400 });
    }
    const story = await StoryRepository.getStoryIdFromFormattedId(storyId);
    if(!story) {
        return NextResponse.json({ error: 'Story not found' }, { status: 404 });
    }
    const {id} = story as Story;
    const bugs = await BugRepository.getBugsByStoryId(id.toString());
    const features = await FeatureRepository.getFeaturesByStoryId(id.toString());

    return NextResponse.json({ data: { bugs, features } });
}

