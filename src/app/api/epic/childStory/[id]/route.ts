import { StoryRepository } from "@/repositories/storyRepository";
import { initializeDb } from "@/typeorm/typeorm";
import {  NextResponse } from "next/server";

export async function GET(_request: Request, { params }: { params: { id: string } }) {
    await initializeDb();
    const epicId = params.id;

    if (!epicId) {
        return NextResponse.json({ error: 'Epic ID is required' }, { status: 400 });
    }

    const stories = await StoryRepository.getStoriesByEpicId(epicId);

    return NextResponse.json({ data: { stories } });
}

