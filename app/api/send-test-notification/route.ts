import { NextRequest, NextResponse } from 'next/server';
import { sendTestNotificationEmail } from '@/lib/email-service';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export async function POST(request: NextRequest) {
    try {
        const { testId, testTitle, testDescription } = await request.json();

        if (!testId || !testTitle) {
            return NextResponse.json(
                { error: 'Missing required fields: testId or testTitle' },
                { status: 400 }
            );
        }

        // Fetch all users using client SDK
        const usersSnapshot = await getDocs(collection(db, 'users'));
        const users = usersSnapshot.docs.map((d) => ({
            id: d.id,
            email: d.data().email as string | undefined,
            name: d.data().name as string | undefined,
        }));

        if (users.length === 0) {
            return NextResponse.json(
                { message: 'No users found to send notifications to' },
                { status: 200 }
            );
        }

        let successCount = 0;
        let failCount = 0;

        const emailPromises = users.map(async (user) => {
            if (!user.email) return false;
            try {
                const success = await sendTestNotificationEmail(
                    user.name || 'Student',
                    user.email,
                    testTitle,
                    testId,
                    testDescription
                );
                return success;
            } catch (error) {
                console.error(`Failed to send email to ${user.email}:`, error);
                return false;
            }
        });

        const results = await Promise.all(emailPromises);

        results.forEach((success) => {
            if (success) successCount++;
            else failCount++;
        });

        return NextResponse.json({
            success: true,
            message: `Emails sent successfully to ${successCount} users. ${failCount} failed.`,
            details: { successCount, failCount, total: users.length }
        });
    } catch (error) {
        console.error('Error in test notification email API:', error);
        return NextResponse.json(
            { error: 'Internal server error while sending notifications' },
            { status: 500 }
        );
    }
}
