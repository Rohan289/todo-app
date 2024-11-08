import { UserRepository } from "@/repositories/userRepository";
import { initializeDb } from "@/typeorm/datasource";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req : NextRequest) {
    await initializeDb();
    const body = await req.json();
    const user = await UserRepository.createUser(body);
    return NextResponse.json({
        data : user
    })
}       

export async function GET() {
    await initializeDb();
    const user = await UserRepository.getUser();
    return NextResponse.json({
        data : user
    })
}       