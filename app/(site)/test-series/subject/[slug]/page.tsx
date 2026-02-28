'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
    Clock,
    FileText,
    Calendar,
    Play,
    Timer,
    BookOpen,
    Target,
    ArrowLeft
} from 'lucide-react';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { TestSeries } from '@/lib/firestore-schema';
import { SUBJECTS, Subject } from '@/lib/constants/subjects';
import styles from '../../TestSeries.module.css'; // Reuse styles from parent

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

type TabType = 'all' | 'live' | 'upcoming' | 'completed';

export default function SubjectTestsPage() {
    const params = useParams();
    const slug = params.slug as string;

    // Find precise subject name matching the slug
    const subjectName = SUBJECTS.find(s => s.toLowerCase().replace(/\s+/g, '-') === slug) || slug;

    const [activeTab, setActiveTab] = useState<TabType>('all');
    const [tests, setTests] = useState<Test[]>([]);
    const [loading, setLoading] = useState(true);

    // Fetch tests from Firestore
    useEffect(() => {
        const fetchTests = async () => {
            try {
                const q = query(
                    collection(db, 'testSeries'),
                    where('status', '==', 'published')
                );

                const querySnapshot = await getDocs(q);
                const fetchedTests: Test[] = [];

                querySnapshot.forEach((doc) => {
                    const data = doc.data() as TestSeries;
                    // Only include tests that map to the requested subject
                    if (!data.subjects || !data.subjects.includes(subjectName)) return;

                    const dateObj = data.createdAt.toDate();
                    const dateStr = dateObj.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
                    const timeStr = dateObj.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

                    fetchedTests.push({
                        id: doc.id,
                        title: data.title,
                        description: data.description,
                        subjects: data.subjects,
                        totalQuestions: data.questions.length,
                        duration: data.duration,
                        totalMarks: data.totalMarks,
                        negativeMarking: data.negativeMarking,
                        status: 'live', // Defaulting to live
                        date: dateStr,
                        time: timeStr,
                        participants: 0,
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

        if (subjectName) {
            fetchTests();
        }
    }, [subjectName]);

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
                            <div className={styles.heroText}>
                                <div style={{ marginBottom: '1.5rem' }}>
                                    <Link href="/test-series" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: '#cbd5e1', textDecoration: 'none', borderBottom: '1px solid currentColor', paddingBottom: '0.2rem' }}>
                                        <ArrowLeft size={16} /> Back to Test Series
                                    </Link>
                                </div>
                                <h1>{subjectName} <span>Tests</span></h1>
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
                            <div style={{ marginBottom: '1.5rem', position: 'relative', zIndex: 10 }}>
                                <Link href="/test-series" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: '#cbd5e1', textDecoration: 'none', background: 'rgba(255,255,255,0.1)', padding: '0.5rem 1rem', borderRadius: '50px', backdropFilter: 'blur(5px)' }}>
                                    <ArrowLeft size={16} /> Back to Test Series
                                </Link>
                            </div>
                            <h1>
                                {subjectName} <span>Tests</span>
                            </h1>
                            <p>
                                Prepare for CUET with our comprehensive test series for {subjectName}. Practice with
                                real exam-pattern questions and track your progress.
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
                            </div>
                        </div>
                        <div className={styles.heroImage}>
                            <div className={styles.heroCard}>
                                <div className={styles.heroCardIcon}>
                                    <Target size={40} color="white" />
                                </div>
                                <h3 className={styles.heroCardTitle}>Start Practicing</h3>
                                <p className={styles.heroCardDesc}>
                                    Master {subjectName} for CUET 2026
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
                                        {test.subjects?.map((subject) => (
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
                            <h3>No tests found for {subjectName}</h3>
                            <p>Check back later for more tests</p>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}
