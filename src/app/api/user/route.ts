import { UserRepository } from "@/repositories/userRepository";
import { initializeDb } from "@/typeorm/typeorm";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    await initializeDb();
    const body = await req.json();

    // Check for the action (signup or login)
    if (body.action === 'signup') {
        const user = await UserRepository.createUser(body);
        return NextResponse.json({
            data: user,
            message: 'User signed up successfully',
        });
    } else if (body.action === 'login') {
        const user = await UserRepository.validateUser(body.email, body.password);
        return NextResponse.json({
            data: user,
            message: 'User logged in successfully',
        });
    } else {
        return NextResponse.json({
            message: 'Invalid action',
        }, { status: 400 });
    }
}

export async function GET() {
    await initializeDb();
    const user = await UserRepository.getUser();
    return NextResponse.json({
        data : user
    })
}       