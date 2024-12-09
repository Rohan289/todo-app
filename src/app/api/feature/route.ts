import { FeatureRepository } from "@/repositories/featureRepository";
import { initializeDb } from "@/typeorm/typeorm";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  await initializeDb();
  const bugs = await FeatureRepository.getAllFeatures();
  return NextResponse.json({ data: bugs });
}

   export async function POST(req : NextRequest) {
    await initializeDb(); // Ensure the database is initialized
    const body = await req.json();
    const feature = await FeatureRepository.createFeature(body);
     return NextResponse.json({
       data : feature
     })
   }