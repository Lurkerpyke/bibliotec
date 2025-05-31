// app/api/test-email/route.ts
import { NextResponse } from 'next/server';
import emailjs from '@emailjs/nodejs';

export async function GET() {
    try {
        // 1. Verify environment variables
        const requiredVars = [
            'EMAILJS_PUBLIC_KEY',
            'EMAILJS_PRIVATE_KEY',
            'EMAILJS_SERVICE_ID',
            'EMAILJS_TEMPLATE_ID'
        ];

        const missingVars = requiredVars.filter(v => !process.env[v]);
        if (missingVars.length > 0) {
            return NextResponse.json(
                { error: `Missing: ${missingVars.join(', ')}` },
                { status: 500 }
            );
        }

        // 2. Initialize EmailJS
        emailjs.init({
            publicKey: process.env.EMAILJS_PUBLIC_KEY!,
            privateKey: process.env.EMAILJS_PRIVATE_KEY!,
        });

        // 3. Test send
        const response = await emailjs.send(
            process.env.EMAILJS_SERVICE_ID!,
            process.env.EMAILJS_TEMPLATE_ID!,
            {
                to_email: 'test@example.com',
                user_name: 'Test User',
                subject: 'Test Email'
            }
        );

        return NextResponse.json(response);
    } catch (error) {
        console.error('Email test failed:', error);
        return NextResponse.json(
            { error: 'Email test failed', details: error },
            { status: 500 }
        );
    }
}