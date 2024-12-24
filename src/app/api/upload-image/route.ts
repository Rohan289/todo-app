import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

interface CloudinaryResponse {
  public_id: string;
  secure_url: string;
}

interface ApiResponse {
  success: boolean;
  message: string;
  data?: CloudinaryResponse;
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export const POST = async (req: NextRequest): Promise<NextResponse> => {
  try {
    // Parse the incoming form data
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, message: 'No file provided' } as ApiResponse,
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    // Upload the file to Cloudinary
    const uploadResult = await new Promise<CloudinaryResponse>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: 'collaborative-todo-app' }, // Specify the folder where you want to store the image
        (error, result) => {
          if (error) return reject(error);
          if (result) resolve({ public_id: result.public_id, secure_url: result.secure_url });
        }
      );

      // Pass the buffer into the upload stream
      uploadStream.end(buffer);
    });

    return NextResponse.json({
      success: true,
      message: 'Image uploaded successfully',
      data: uploadResult,
    } as ApiResponse);
  } catch (error) {
    console.error('Error uploading image to Cloudinary:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to upload image' } as ApiResponse,
      { status: 500 }
    );
  }
};