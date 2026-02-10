'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
    Clock,
    FileText,
    Users,
    Calendar,
    Play,
    CheckCircle,
    XCircle,
    MinusCircle,
    Award,
    BookOpen,
    Timer,
    ArrowRight,
    Target
} from 'lucide-react';
import styles from './TestSeries.module.css';

interface Test {
    id: number;
    title: string;
    description: string;
    subjects: string[];
    totalQuestions: number;
    duration: number; // in minutes
    totalMarks: number;
    negativeMarking: boolean;
    status: 'live' | 'upcoming' | 'completed';
    date: string;
    time: string;
    participants?: number;
    // For completed tests
    score?: number;
    correct?: number;
    wrong?: number;
    skipped?: number;
    rank?: number;
    isFree?: boolean;
}

const TESTS: Test[] = [
    // Live Tests
    {
        id: 1,
        title: 'CUET Mock Test - Full Syllabus',
        description: 'Complete mock test covering all subjects for CUET 2026',
        subjects: ['English', 'General Test', 'Mathematics'],
        totalQuestions: 50,
        duration: 60,
        totalMarks: 200,
        negativeMarking: true,
        status: 'live',
        date: 'Jan 30, 2026',
        time: '10:00 AM - 11:00 AM',
        participants: 1247,
        isFree: true
    },
    {
        id: 2,
        title: 'English Language Practice Test',
        description: 'Focus on reading comprehension and vocabulary',
        subjects: ['English'],
        totalQuestions: 40,
        duration: 45,
        totalMarks: 160,
        negativeMarking: false,
        status: 'live',
        date: 'Jan 30, 2026',
        time: '2:00 PM - 2:45 PM',
        participants: 856
    },
    // Upcoming Tests
    {
        id: 3,
        title: 'General Test Series - Part 1',
        description: 'Quantitative reasoning and logical aptitude',
        subjects: ['General Test', 'Logical Reasoning'],
        totalQuestions: 50,
        duration: 60,
        totalMarks: 200,
        negativeMarking: true,
        status: 'upcoming',
        date: 'Feb 01, 2026',
        time: '10:00 AM',
        isFree: true
    },
    {
        id: 4,
        title: 'Mathematics Domain Test',
        description: 'Algebra, Calculus, and Statistics',
        subjects: ['Mathematics'],
        totalQuestions: 40,
        duration: 45,
        totalMarks: 160,
        negativeMarking: true,
        status: 'upcoming',
        date: 'Feb 03, 2026',
        time: '3:00 PM'
    },
    {
        id: 5,
        title: 'Physics & Chemistry Combined',
        description: 'Science domain combined test',
        subjects: ['Physics', 'Chemistry'],
        totalQuestions: 60,
        duration: 75,
        totalMarks: 240,
        negativeMarking: true,
        status: 'upcoming',
        date: 'Feb 05, 2026',
        time: '11:00 AM',
        isFree: true
    },
    // Completed Tests
    {
        id: 6,
        title: 'CUET Weekly Test - Week 4',
        description: 'Weekly comprehensive test',
        subjects: ['English', 'General Test', 'Mathematics'],
        totalQuestions: 50,
        duration: 60,
        totalMarks: 200,
        negativeMarking: true,
        status: 'completed',
        date: 'Jan 27, 2026',
        time: 'Completed',
        score: 156,
        correct: 39,
        wrong: 5,
        skipped: 6,
        rank: 45,
        participants: 2341
    },
    {
        id: 7,
        title: 'English Sectional Test',
        description: 'Reading and grammar test',
        subjects: ['English'],
        totalQuestions: 40,
        duration: 45,
        totalMarks: 160,
        negativeMarking: false,
        status: 'completed',
        date: 'Jan 25, 2026',
        time: 'Completed',
        score: 132,
        correct: 33,
        wrong: 7,
        skipped: 0,
        rank: 23,
        participants: 1876
    }
];

type TabType = 'all' | 'live' | 'upcoming' | 'completed';

export default function TestSeriesPage() {
    const [activeTab, setActiveTab] = useState<TabType>('all');
    const [countdown, setCountdown] = useState<{ [key: number]: { days: number; hours: number; mins: number } }>({});

    // Calculate countdown for upcoming tests
    useEffect(() => {
        const upcomingTests = TESTS.filter(t => t.status === 'upcoming');

        const updateCountdown = () => {
            const newCountdown: { [key: number]: { days: number; hours: number; mins: number } } = {};

            upcomingTests.forEach(test => {
                // Simulated countdown (in production, would use actual date parsing)
                const days = Math.floor(Math.random() * 5) + 1;
                const hours = Math.floor(Math.random() * 24);
                const mins = Math.floor(Math.random() * 60);
                newCountdown[test.id] = { days, hours, mins };
            });

            setCountdown(newCountdown);
        };

        updateCountdown();
        const interval = setInterval(updateCountdown, 60000); // Update every minute

        return () => clearInterval(interval);
    }, []);

    const filteredTests = activeTab === 'all'
        ? TESTS
        : TESTS.filter(test => test.status === activeTab);

    const liveCount = TESTS.filter(t => t.status === 'live').length;
    const upcomingCount = TESTS.filter(t => t.status === 'upcoming').length;
    const completedCount = TESTS.filter(t => t.status === 'completed').length;

    return (
        <div className={styles.testSeriesPage}>
            {/* Hero Section */}
            <section className={styles.hero}>
                <div className="container">
                    <div className={styles.heroContent}>
                        <div className={styles.heroText}>
                            <h1>
                                CUET <span>Test Series</span> 2026
                            </h1>
                            <p>
                                Prepare for CUET with our comprehensive test series. Practice with
                                real exam-pattern questions, get instant results, and track your
                                progress with detailed analytics.
                            </p>
                            <div className={styles.heroStats}>
                                <div className={styles.statItem}>
                                    <span className={styles.statNumber}>50+</span>
                                    <span className={styles.statLabel}>Mock Tests</span>
                                </div>
                                <div className={styles.statItem}>
                                    <span className={styles.statNumber}>5000+</span>
                                    <span className={styles.statLabel}>Questions</span>
                                </div>
                                <div className={styles.statItem}>
                                    <span className={styles.statNumber}>10K+</span>
                                    <span className={styles.statLabel}>Students</span>
                                </div>
                            </div>
                        </div>
                        <div className={styles.heroImage}>
                            <div className={styles.heroCard}>
                                <div className={styles.heroCardIcon}>
                                    <Target size={40} color="white" />
                                </div>
                                <h3 className={styles.heroCardTitle}>Start Practicing</h3>
                                <p className={styles.heroCardDesc}>
                                    Join thousands of students preparing for CUET 2026
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Tests Section */}
            <section className={styles.tabsSection}>
                <div className="container">
                    {/* Tabs */}
                    <div className={styles.tabs}>
                        <button
                            className={`${styles.tab} ${activeTab === 'all' ? styles.tabActive : ''}`}
                            onClick={() => setActiveTab('all')}
                        >
                            All Tests
                        </button>
                        <button
                            className={`${styles.tab} ${activeTab === 'live' ? styles.tabActive : ''}`}
                            onClick={() => setActiveTab('live')}
                        >
                            🔴 Live Now
                            <span className={styles.tabBadge}>{liveCount}</span>
                        </button>
                        <button
                            className={`${styles.tab} ${activeTab === 'upcoming' ? styles.tabActive : ''}`}
                            onClick={() => setActiveTab('upcoming')}
                        >
                            Upcoming
                            <span className={styles.tabBadge}>{upcomingCount}</span>
                        </button>
                        <button
                            className={`${styles.tab} ${activeTab === 'completed' ? styles.tabActive : ''}`}
                            onClick={() => setActiveTab('completed')}
                        >
                            Completed
                            <span className={styles.tabBadge}>{completedCount}</span>
                        </button>
                    </div>

                    {/* Test Cards Grid */}
                    <div className={styles.testGrid}>
                        {filteredTests.map((test) => (
                            <div key={test.id} className={styles.testCard}>
                                <div className={styles.testCardHeader}>
                                    <div className={styles.testInfo}>
                                        <h3>{test.title}</h3>
                                        <div className={styles.testMeta}>
                                            <span className={styles.testMetaItem}>
                                                <FileText size={14} /> {test.totalQuestions} Qs
                                            </span>
                                            <span className={styles.testMetaItem}>
                                                <Clock size={14} /> {test.duration} mins
                                            </span>
                                            {test.participants && (
                                                <span className={styles.testMetaItem}>
                                                    <Users size={14} /> {test.participants.toLocaleString()}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', alignItems: 'flex-end' }}>
                                        <span className={`${styles.testBadge} ${test.status === 'live' ? styles.badgeLive :
                                                test.status === 'upcoming' ? styles.badgeUpcoming :
                                                    styles.badgeCompleted
                                            }`}>
                                            {test.status === 'live' ? '🔴 LIVE' :
                                                test.status === 'upcoming' ? 'UPCOMING' : 'COMPLETED'}
                                        </span>
                                        {test.isFree && (
                                            <span className={`${styles.testBadge} ${styles.badgeFree}`}>
                                                FREE
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className={styles.testCardBody}>
                                    {/* Subjects */}
                                    <div className={styles.testSubjects}>
                                        {test.subjects.map((subject) => (
                                            <span key={subject} className={styles.subjectTag}>{subject}</span>
                                        ))}
                                    </div>

                                    {/* For completed tests - show result */}
                                    {test.status === 'completed' && test.score !== undefined ? (
                                        <div className={styles.resultSummary}>
                                            <div className={styles.scoreCircle}>
                                                <span className={styles.scoreValue}>{test.score}</span>
                                                <span className={styles.scoreLabel}>/{test.totalMarks}</span>
                                            </div>
                                            <div className={styles.resultDetails}>
                                                <div className={styles.resultRow}>
                                                    <span className={`${styles.resultItem} ${styles.correct}`}>
                                                        <CheckCircle size={14} /> {test.correct} Correct
                                                    </span>
                                                    <span className={`${styles.resultItem} ${styles.wrong}`}>
                                                        <XCircle size={14} /> {test.wrong} Wrong
                                                    </span>
                                                    <span className={`${styles.resultItem} ${styles.skipped}`}>
                                                        <MinusCircle size={14} /> {test.skipped} Skipped
                                                    </span>
                                                </div>
                                                <div style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                                    <Award size={14} color="#f59e0b" />
                                                    <span style={{ fontWeight: 600, color: '#1e293b' }}>Rank: #{test.rank}</span>
                                                    <span style={{ color: '#64748b', fontSize: '0.8rem' }}>/ {test.participants?.toLocaleString()}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ) : test.status === 'upcoming' && countdown[test.id] ? (
                                        /* Countdown for upcoming tests */
                                        <div className={styles.countdown}>
                                            <span style={{ color: '#64748b', fontSize: '0.85rem', marginRight: '0.5rem' }}>Starts in:</span>
                                            <div className={styles.countdownItem}>
                                                <span className={styles.countdownValue}>{countdown[test.id].days}</span>
                                                <span className={styles.countdownLabel}>Days</span>
                                            </div>
                                            <span style={{ color: '#64748b' }}>:</span>
                                            <div className={styles.countdownItem}>
                                                <span className={styles.countdownValue}>{countdown[test.id].hours}</span>
                                                <span className={styles.countdownLabel}>Hours</span>
                                            </div>
                                            <span style={{ color: '#64748b' }}>:</span>
                                            <div className={styles.countdownItem}>
                                                <span className={styles.countdownValue}>{countdown[test.id].mins}</span>
                                                <span className={styles.countdownLabel}>Mins</span>
                                            </div>
                                        </div>
                                    ) : (
                                        /* Test details for live tests */
                                        <div className={styles.testDetails}>
                                            <div className={styles.detailItem}>
                                                <span className={styles.detailValue}>{test.totalMarks}</span>
                                                <span className={styles.detailLabel}>Total Marks</span>
                                            </div>
                                            <div className={styles.detailItem}>
                                                <span className={styles.detailValue}>{test.negativeMarking ? '-1' : '0'}</span>
                                                <span className={styles.detailLabel}>Negative</span>
                                            </div>
                                            <div className={styles.detailItem}>
                                                <span className={styles.detailValue}>{test.duration}</span>
                                                <span className={styles.detailLabel}>Minutes</span>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className={styles.testCardFooter}>
                                    <div className={styles.testDate}>
                                        <Calendar size={14} />
                                        {test.date} {test.status !== 'completed' && `• ${test.time}`}
                                    </div>

                                    {test.status === 'live' ? (
                                        <Link href={`/test-series/${test.id}/start`} className={styles.startBtn}>
                                            <Play size={16} /> Start Test
                                        </Link>
                                    ) : test.status === 'upcoming' ? (
                                        <button className={`${styles.startBtn} ${styles.disabledBtn}`} disabled>
                                            <Timer size={16} /> Notify Me
                                        </button>
                                    ) : (
                                        <Link href={`/test-series/${test.id}/review`} className={styles.viewBtn}>
                                            View Solutions <ArrowRight size={14} />
                                        </Link>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    {filteredTests.length === 0 && (
                        <div className={styles.emptyState}>
                            <BookOpen size={48} />
                            <h3>No tests found</h3>
                            <p>Check back later for more tests</p>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}
