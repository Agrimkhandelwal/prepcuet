import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function GET() {
    const SMTP_CONFIG = {
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    };

    try {
        const transporter = nodemailer.createTransport(SMTP_CONFIG);
        await transporter.verify();

        return NextResponse.json({
            success: true,
            message: 'SMTP is correctly configured in the Next.js environment.',
            user: SMTP_CONFIG.auth.user ? 'Set' : 'Missing',
            pass: SMTP_CONFIG.auth.pass ? 'Set' : 'Missing',
        });
    } catch (error: any) {
        return NextResponse.json({
            success: false,
            error: error.message,
            user: SMTP_CONFIG.auth.user ? 'Set' : 'Missing',
            pass: SMTP_CONFIG.auth.pass ? 'Set' : 'Missing',
        }, { status: 500 });
    }
}
