import { NextResponse } from 'next/server';
import cloudinary from 'cloudinary';
import formidable from 'formidable';

// Configure Cloudinary
cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Disable Next.js's default body parsing
export const config = {
    api: {
        bodyParser: false,
    },
};

export async function POST(req: Request) {
    const form = new formidable.IncomingForm();

    // Return a promise to handle the asynchronous parsing
    return new Promise((resolve, reject) => {
        form.parse(req as any, async (err, fields, files) => { // Cast req to 'any'
            if (err) {
                return reject(NextResponse.json({ message: 'Error parsing file' }, { status: 500 }));
            }

            const file = files?.file?.[0]; // Access the uploaded file

            try {
                // Upload the image to Cloudinary
                const result = await cloudinary.v2.uploader.upload(file?.filepath || '', {
                    folder: 'uploads', // Optional: specify a folder in Cloudinary
                });

                // Return the URL of the uploaded image
                return resolve(NextResponse.json({ imageUrl: result.secure_url }, { status: 200 }));
            } catch (uploadError) {
                return reject(NextResponse.json({ message: 'Error uploading to Cloudinary' }, { status: 500 }));
            }
        });
    });
}