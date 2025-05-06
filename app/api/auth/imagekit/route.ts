import { NextResponse } from 'next/server';
import ImageKit from 'imagekit';

export async function GET() {
    const imagekit = new ImageKit({
        privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
        publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY!,
        urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT!
    });

    try {
        // Correct authentication parameters generation
        const timestamp = Math.floor(Date.now() / 1000).toString();
        const authenticationParams = imagekit.getAuthenticationParameters(timestamp);

        return NextResponse.json(authenticationParams);
    } catch (error) {
        console.error('ImageKit Auth Error:', error);
        return NextResponse.json(
            { error: 'Failed to generate authentication parameters' },
            { status: 500 }
        );
    }
}