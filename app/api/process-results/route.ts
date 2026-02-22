import { NextRequest, NextResponse } from 'next/server';
import {
    collection,
    query,
    where,
    getDocs,
    doc,
    updateDoc,
    Timestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { sendResultNotificationEmail } from '@/lib/email-service';

// Called by Vercel Cron every minute OR by the pending page client when countdown ends.
// Scans pending results whose time has passed, marks them available, sends email.

export async function GET(request: NextRequest) {
    // Security: only enforce if CRON_SECRET is set in environment
    const cronSecret = process.env.CRON_SECRET;
    if (cronSecret) {
        const authHeader = request.headers.get('authorization');
        if (authHeader !== `Bearer ${cronSecret}`) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
    }

    try {
        const nowMs = Date.now();

        // Query only by status (no composite index needed)
        const pendingQuery = query(
            collection(db, 'testResults'),
            where('status', '==', 'pending')
        );

        const snapshot = await getDocs(pendingQuery);

        if (snapshot.empty) {
            return NextResponse.json({ processed: 0, message: 'No pending results' });
        }

        // Filter in memory: only process those whose time has actually passed
        const dueDocs = snapshot.docs.filter((docSnap) => {
            const data = docSnap.data();
            if (!data.resultAvailableAt) return false;
            const availableMs: number =
                typeof data.resultAvailableAt.toMillis === 'function'
                    ? data.resultAvailableAt.toMillis()
                    : data.resultAvailableAt;
            return availableMs <= nowMs;
        });

        if (dueDocs.length === 0) {
            return NextResponse.json({ processed: 0, message: 'No results due yet' });
        }

        let processed = 0;
        let emails = 0;
        const errors: string[] = [];

        await Promise.all(
            dueDocs.map(async (docSnap) => {
                const data = docSnap.data();
                try {
                    // Mark result as available
                    await updateDoc(doc(db, 'testResults', docSnap.id), {
                        status: 'available',
                        emailSentAt: Timestamp.now(),
                    });
                    processed++;

                    // Send results-ready email
                    if (data.userEmail) {
                        const sent = await sendResultNotificationEmail(
                            data.userName || 'Student',
                            data.userEmail,
                            data.testTitle || 'Your Test',
                            data.testId,
                            docSnap.id
                        );
                        if (sent) emails++;
                    }
                } catch (err) {
                    console.error(`[process-results] Error for ${docSnap.id}:`, err);
                    errors.push(`${docSnap.id}: ${err}`);
                }
            })
        );

        console.log(`[process-results] ✅ Processed ${processed}, emails sent: ${emails}`);

        return NextResponse.json({
            processed,
            emailsSent: emails,
            errors: errors.length > 0 ? errors : undefined,
        });
    } catch (error) {
        console.error('[process-results] Fatal error:', error);
        return NextResponse.json(
            { error: 'Internal server error', detail: String(error) },
            { status: 500 }
        );
    }
}

// Allow POST too (for manual trigger)
export { GET as POST };
