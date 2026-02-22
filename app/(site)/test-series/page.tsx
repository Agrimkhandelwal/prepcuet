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
import { db } from '@/lib/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { TestSeries } from '@/lib/firestore-schema';
import styles from './TestSeries.module.css';

interface Test {
    id: string; // Changed from number to string for Firestore ID
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
        id: '1',
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
        id: '2',
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
        id: '3',
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
        id: '4',
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
        id: '5',
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
        id: '6',
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
        id: '7',
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
    const [tests, setTests] = useState<Test[]>([]);
    const [loading, setLoading] = useState(true);
    const [countdown, setCountdown] = useState<{ [key: string]: { days: number; hours: number; mins: number } }>({});

    // Fetch tests from Firestore
    useEffect(() => {
        const fetchTests = async () => {
            try {
                // Query only published tests
                const q = query(
                    collection(db, 'testSeries'),
                    where('status', '==', 'published')
                );

                const querySnapshot = await getDocs(q);
                const fetchedTests: Test[] = [];

                querySnapshot.forEach((doc) => {
                    const data = doc.data() as TestSeries;
                    // Format date and time from createdAt or a specific startDate if you add one later
                    // For now using createdAt
                    const dateObj = data.createdAt.toDate();
                    const dateStr = dateObj.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
                    const timeStr = dateObj.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

                    fetchedTests.push({
                        id: doc.id, // Using string ID from Firestore
                        title: data.title,
                        description: data.description,
                        subjects: data.subjects,
                        totalQuestions: data.questions.length,
                        duration: data.duration,
                        totalMarks: data.totalMarks,
                        negativeMarking: data.negativeMarking,
                        status: 'live', // Defaulting to live for now as 'published' usually means available
                        date: dateStr,
                        time: timeStr,
                        participants: 0, // Placeholder, would need a separate subcollection or counter
                        isFree: data.isFree
                    });
                });

                setTests(fetchedTests);
            } catch (error) {
                console.error("Error fetching tests:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchTests();
    }, []);

    const filteredTests = activeTab === 'all'
        ? tests
        : tests.filter(test => test.status === activeTab);

    const liveCount = tests.filter(t => t.status === 'live').length;
    const upcomingCount = tests.filter(t => t.status === 'upcoming').length;
    const completedCount = tests.filter(t => t.status === 'completed').length;

    if (loading) {
        return (
            <div className={styles.testSeriesPage}>
                <section className={styles.hero}>
                    <div className="container">
                        <div className={styles.heroContent}>
                            {/* Keep Hero Content Rendering during loading or skeleton */}
                            <div className={styles.heroText}>
                                <h1>CUET <span>Test Series</span> 2026</h1>
                                <p>Loading available tests...</p>
                            </div>
                        </div>
                    </div>
                </section>
                <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
                    <div className="loader"></div>
                </div>
            </div>
        );
    }

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
                                    <span className={styles.statNumber}>{tests.length}+</span>
                                    <span className={styles.statLabel}>Mock Tests</span>
                                </div>
                                <div className={styles.statItem}>
                                    <span className={styles.statNumber}>
                                        {tests.reduce((acc, t) => acc + t.totalQuestions, 0)}+
                                    </span>
                                    <span className={styles.statLabel}>Questions</span>
                                </div>
                                <div className={styles.statItem}>
                                    <span className={styles.statNumber}>100+</span>
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
                    {/* Tabs Centered Wrapper */}
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <div className={styles.tabsContainer}>
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
                                                <Clock size={14} /> {test.duration} m
                                            </span>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'flex-end' }}>
                                        <span className={`${styles.testBadge} ${test.status === 'live' ? styles.badgeLive :
                                            test.status === 'upcoming' ? styles.badgeUpcoming :
                                                styles.badgeCompleted
                                            }`}>
                                            {test.status === 'live' ? 'LIVE' :
                                                test.status === 'upcoming' ? 'SOON' : 'DONE'}
                                        </span>
                                        {test.isFree && (
                                            <span className={`${styles.testBadge} ${styles.badgeFree}`}>
                                                FREE
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className={styles.testCardBody}>
                                    <div className={styles.testSubjects}>
                                        {test.subjects.map((subject) => (
                                            <span key={subject} className={styles.subjectTag}>{subject}</span>
                                        ))}
                                    </div>

                                    <div className={styles.testDetails}>
                                        <div className={styles.detailItem}>
                                            <span className={styles.detailValue}>{test.totalMarks}</span>
                                            <span className={styles.detailLabel}>Marks</span>
                                        </div>
                                        <div className={styles.detailItem}>
                                            <span className={styles.detailValue}>{test.negativeMarking ? '-1' : '0'}</span>
                                            <span className={styles.detailLabel}>Minus</span>
                                        </div>
                                        <div className={styles.detailItem}>
                                            <span className={styles.detailValue}>{test.duration}</span>
                                            <span className={styles.detailLabel}>Mins</span>
                                        </div>
                                    </div>
                                </div>

                                <div className={styles.testCardFooter}>
                                    <div className={styles.testDate}>
                                        <Calendar size={16} />
                                        <span>{test.date}</span>
                                    </div>

                                    {test.status === 'live' ? (
                                        <Link href={`/test-series/${test.id}/start`} className={styles.startBtn}>
                                            <Play size={18} fill="currentColor" /> Start Now
                                        </Link>
                                    ) : (
                                        <button className={`${styles.startBtn} ${styles.disabledBtn}`} disabled>
                                            <Timer size={18} /> Notify Me
                                        </button>
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
