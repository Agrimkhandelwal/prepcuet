import { NextRequest, NextResponse } from 'next/server';
import { collection, addDoc, Timestamp, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { TestResult } from '@/lib/firestore-schema';
import { sendSubmissionConfirmationEmail } from '@/lib/email-service';

// Max attempts allowed per test
const MAX_ATTEMPTS = 3;

export async function POST(request: NextRequest) {
    try {
        const resultData = await request.json();
        const { userId, testId, userEmail, userName, testTitle } = resultData;

        if (!userId || !testId) {
            return NextResponse.json(
                { error: 'Missing userId or testId' },
                { status: 400 }
            );
        }

        // 1. Check for existing attempts
        // Note: In detailed implementation, should verify this server-side with secure rules
        // For now, we query the collection to count attempts
        const attemptsQuery = query(
            collection(db, 'testResults'),
            where('userId', '==', userId),
            where('testId', '==', testId)
        );

        const attemptsSnapshot = await getDocs(attemptsQuery);
        const currentAttempts = attemptsSnapshot.size;

        if (currentAttempts >= MAX_ATTEMPTS) {
            return NextResponse.json(
                { error: `Maximum attempts (${MAX_ATTEMPTS}) reached for this test.` },
                { status: 403 }
            );
        }

        // 2. Calculate result available time (10 minutes from submission)
        const submittedAt = Timestamp.now();
        const resultAvailableAt = Timestamp.fromMillis(
            submittedAt.toMillis() + (10 * 60 * 1000)
        );

        const testResult: Omit<TestResult, 'id'> = {
            ...resultData,
            submittedAt,
            resultAvailableAt,
            emailSentAt: null,
            status: 'pending',
            attemptNumber: currentAttempts + 1
        };

        // 3. Save to Firestore
        const docRef = await addDoc(collection(db, 'testResults'), testResult);

        // 4. Send Confirmation Email (Awaited to ensure serverless func doesn't terminate early)
        if (userEmail) {
            try {
                await sendSubmissionConfirmationEmail(userName, userEmail, testTitle, testId);
            } catch (err) {
                console.error('Failed to send submission email:', err);
            }
        }

        return NextResponse.json({
            success: true,
            resultId: docRef.id,
            resultAvailableAt: resultAvailableAt.toMillis(),
            attempts: currentAttempts + 1
        });
    } catch (error) {
        console.error('Error saving test result:', error);
        return NextResponse.json(
            { error: 'Failed to save test result' },
            { status: 500 }
        );
    }
}
