'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Clock, CheckCircle, Mail, ArrowRight, Calendar, Loader2 } from 'lucide-react';
import { collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/hooks/useAuth';
import styles from './pending.module.css';

export default function PendingResultPage() {
    const router = useRouter();
    const params = useParams();
    const testId = params.id as string;
    const { user, loading } = useAuth();
    const [testTitle, setTestTitle] = useState('');
    const [availableAt, setAvailableAt] = useState<Date | null>(null);
    const [secondsLeft, setSecondsLeft] = useState<number | null>(null);
    const [resultId, setResultId] = useState<string | null>(null);
    const [isReady, setIsReady] = useState(false);
    const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
            return;
        }

        const lastResult = localStorage.getItem('lastTestSubmission');
        if (lastResult) {
            const data = JSON.parse(lastResult);
            setTestTitle(data.testTitle || 'Your Test');
            if (data.resultAvailableAt) {
                setAvailableAt(new Date(data.resultAvailableAt));
            }
            if (data.resultId) {
                setResultId(data.resultId);
            }
        }
    }, [user, loading, router]);

    // Live countdown
    useEffect(() => {
        if (!availableAt) return;
        const tick = () => {
            const diff = Math.max(0, Math.ceil((availableAt.getTime() - Date.now()) / 1000));
            setSecondsLeft(diff);
        };
        tick();
        const id = setInterval(tick, 1000);
        return () => clearInterval(id);
    }, [availableAt]);

    // When countdown hits 0 → call process-results API to trigger release + email
    const hasTriggeredRef = useRef(false);
    useEffect(() => {
        if (secondsLeft === null || secondsLeft > 0) return;
        if (hasTriggeredRef.current) return;
        hasTriggeredRef.current = true;

        const triggerProcessing = async () => {
            try {
                // Call the API with a small delay to let server-side Firestore settle
                await new Promise(r => setTimeout(r, 3000));
                await fetch('/api/process-results', { method: 'GET' });
                console.log('[pending] process-results triggered');
            } catch (err) {
                console.error('[pending] Failed to trigger process-results:', err);
            }
        };

        triggerProcessing();
    }, [secondsLeft]);

    // Poll Firestore every 30s to check if result is released
    useEffect(() => {
        if (!user || !testId) return;

        const checkResult = async () => {
            try {
                const q = query(
                    collection(db, 'testResults'),
                    where('userId', '==', user.uid),
                    where('testId', '==', testId),
                    where('status', '==', 'available'),
                    orderBy('submittedAt', 'desc'),
                    limit(1)
                );
                const snap = await getDocs(q);
                if (!snap.empty) {
                    setIsReady(true);
                    const docId = snap.docs[0].id;
                    // Auto-redirect after 2s
                    setTimeout(() => {
                        router.push(`/test-series/${testId}/result?ref=${docId}`);
                    }, 2000);
                }
            } catch (err) {
                console.error('Error checking result status:', err);
            }
        };

        checkResult(); // Check immediately
        pollRef.current = setInterval(checkResult, 30_000); // Then every 30s
        return () => {
            if (pollRef.current) clearInterval(pollRef.current);
        };
    }, [user, testId, router]);

    function formatTime(seconds: number): string {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s.toString().padStart(2, '0')}`;
    }

    function formatDateTime(date: Date | null) {
        if (!date) return 'Soon';
        return new Intl.DateTimeFormat('en-IN', {
            dateStyle: 'medium',
            timeStyle: 'short',
        }).format(date);
    }

    if (loading) {
        return (
            <div style={{ padding: '4rem', textAlign: 'center' }}>
                <div className={styles.spinner}></div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                {/* Success Icon */}
                <div className={styles.iconWrapper}>
                    {isReady
                        ? <CheckCircle size={64} className={styles.successIcon} color="#10b981" />
                        : <CheckCircle size={64} className={styles.successIcon} />
                    }
                </div>

                {/* Title */}
                <h1 className={styles.title}>
                    {isReady ? 'Results Are Ready! 🎉' : 'Test Submitted Successfully! 🎉'}
                </h1>
                <p className={styles.subtitle}>{testTitle}</p>

                {/* Status Box */}
                {isReady ? (
                    <div className={styles.infoBox} style={{ background: '#f0fdf4', borderLeft: '4px solid #10b981' }}>
                        <div className={styles.infoIcon} style={{ color: '#10b981' }}>
                            <CheckCircle size={32} />
                        </div>
                        <div className={styles.infoContent}>
                            <h3 className={styles.infoTitle}>Your results are live!</h3>
                            <p className={styles.infoText}>Redirecting you to your results page...</p>
                        </div>
                    </div>
                ) : (
                    <div className={styles.infoBox}>
                        <div className={styles.infoIcon}>
                            <Clock size={32} />
                        </div>
                        <div className={styles.infoContent}>
                            <h3 className={styles.infoTitle}>Results Being Evaluated</h3>
                            <p className={styles.infoText}>
                                Results will be available in{' '}
                                {secondsLeft !== null && secondsLeft > 0 ? (
                                    <strong style={{ fontFamily: 'monospace', fontSize: '1.1em', color: '#1a237e' }}>
                                        {formatTime(secondsLeft)}
                                    </strong>
                                ) : (
                                    <strong>a moment</strong>
                                )}
                                {' '}— we'll email you and this page will refresh automatically.
                            </p>
                        </div>
                    </div>
                )}

                {/* Countdown Ring (only if waiting) */}
                {!isReady && secondsLeft !== null && secondsLeft > 0 && (
                    <div className={styles.countdown}>
                        <div className={styles.countdownRing}>
                            <svg viewBox="0 0 100 100" className={styles.countdownSvg}>
                                <circle cx="50" cy="50" r="42" fill="none" stroke="#e0e7ff" strokeWidth="8" />
                                <circle
                                    cx="50" cy="50" r="42"
                                    fill="none"
                                    stroke="#1a237e"
                                    strokeWidth="8"
                                    strokeLinecap="round"
                                    strokeDasharray={`${2 * Math.PI * 42}`}
                                    strokeDashoffset={`${2 * Math.PI * 42 * (secondsLeft / (10 * 60))}`}
                                    transform="rotate(-90 50 50)"
                                    style={{ transition: 'stroke-dashoffset 1s linear' }}
                                />
                            </svg>
                            <div className={styles.countdownInner}>
                                <span className={styles.countdownTime}>{formatTime(secondsLeft)}</span>
                                <span className={styles.countdownLabel}>remaining</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Waiting spinner if countdown done but result not yet marked */}
                {!isReady && secondsLeft === 0 && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center', color: '#1a237e', margin: '1rem 0' }}>
                        <Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} />
                        <span>Processing your results...</span>
                    </div>
                )}

                {/* Timeline */}
                <div className={styles.timeline}>
                    <div className={styles.timelineItem}>
                        <div className={`${styles.timelineDot} ${styles.completed}`}>
                            <CheckCircle size={20} />
                        </div>
                        <div className={styles.timelineContent}>
                            <h4>Test Submitted</h4>
                            <p>Just now</p>
                        </div>
                    </div>

                    <div className={styles.timelineLine}></div>

                    <div className={styles.timelineItem}>
                        <div className={`${styles.timelineDot} ${isReady ? styles.completed : ''}`}>
                            <Mail size={20} />
                        </div>
                        <div className={styles.timelineContent}>
                            <h4>Email Notification</h4>
                            <p>{isReady ? 'Email sent ✓' : "You'll receive an email when results are ready"}</p>
                        </div>
                    </div>

                    <div className={styles.timelineLine}></div>

                    <div className={styles.timelineItem}>
                        <div className={`${styles.timelineDot} ${isReady ? styles.completed : ''}`}>
                            <Calendar size={20} />
                        </div>
                        <div className={styles.timelineContent}>
                            <h4>Results Available</h4>
                            <p>
                                {isReady ? 'Available now! 🎉' : availableAt
                                    ? `By ${formatDateTime(availableAt)}`
                                    : 'In ~10 minutes'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Info Cards */}
                <div className={styles.infoCards}>
                    <div className={styles.infoCard}>
                        <Mail className={styles.cardIcon} size={24} />
                        <h4>Email Notification</h4>
                        <p>We'll send you an email with a direct link to view your results</p>
                    </div>
                    <div className={styles.infoCard}>
                        <CheckCircle className={styles.cardIcon} size={24} />
                        <h4>Detailed Analysis</h4>
                        <p>Get question-wise breakdown, solutions, and performance insights</p>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className={styles.actions}>
                    {isReady ? (
                        <button
                            onClick={() => router.push(`/test-series/${testId}/result`)}
                            className={styles.primaryBtn}
                            style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}
                        >
                            View Results <ArrowRight size={18} />
                        </button>
                    ) : (
                        <button
                            onClick={() => router.push('/test-series')}
                            className={styles.primaryBtn}
                        >
                            Back to Test Series <ArrowRight size={18} />
                        </button>
                    )}
                    <button
                        onClick={() => router.push('/')}
                        className={styles.secondaryBtn}
                    >
                        Go to Dashboard
                    </button>
                </div>

                <div className={styles.note}>
                    <p>
                        💡 <strong>Pro Tip:</strong> While you wait, explore other test series or review your notes to keep the momentum going!
                    </p>
                </div>
            </div>

            <style>{`
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
}
