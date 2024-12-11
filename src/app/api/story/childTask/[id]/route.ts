import { BugRepository } from "@/repositories/bugRepository";
import { FeatureRepository } from "@/repositories/featureRepository";
import { initializeDb } from "@/typeorm/typeorm";
import {  NextResponse } from "next/server";

export async function GET(_request: Request, { params }: { params: { id: string } }) {
    await initializeDb();
    const storyId = params.id;

    if (!storyId) {
        return NextResponse.json({ error: 'Story ID is required' }, { status: 400 });
    }

    const bugs = await BugRepository.getBugByStoryId(storyId);
    const features = await FeatureRepository.getFeatureByStoryId(storyId);

    return NextResponse.json({ data: { bugs, features } });
}

