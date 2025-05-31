// app/api/imagekit/route.ts
import { NextResponse } from 'next/server';
import ImageKit from 'imagekit';

export async function GET() {
    // Validate environment variables
    if (!process.env.IMAGEKIT_PRIVATE_KEY ||
        !process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY ||
        !process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT) {
        return NextResponse.json(
            { error: 'ImageKit configuration missing' },
            { status: 500 }
        );
    }

    const imagekit = new ImageKit({
        privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
        publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY,
        urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT
    });

    try {
        const authParams = imagekit.getAuthenticationParameters();
        return NextResponse.json(authParams);
    } catch (error) {
        console.error('ImageKit Auth Error:', error);
        return NextResponse.json(
            { error: 'Authentication failed' },
            { status: 500 }
        );
    }
}