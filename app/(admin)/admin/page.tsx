'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
    TrendingUp,
    TrendingDown,
    FileText,
    Image,
    BookOpen,
    HelpCircle,
    ArrowRight,
    Clock,
    Eye,
    Users,
    CheckCircle
} from 'lucide-react';
import { ActivityChart, SubjectDistributionChart } from '@/components/admin/DashboardCharts';
import styles from '../Admin.module.css';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, where, QuerySnapshot, DocumentData } from 'firebase/firestore';
import { SUBJECTS } from '@/lib/constants/subjects';

const QUICK_ACTIONS = [
    { icon: FileText, title: 'New Test Series', desc: 'Create a new test', href: '/admin/test-series/new', color: '#3b82f6', bg: '#dbeafe' },
    { icon: Image, title: 'Add Banner', desc: 'Create new slider', href: '/admin/banners', color: '#10b981', bg: '#dcfce7' },
    { icon: BookOpen, title: 'Add Subject', desc: 'Manage subjects', href: '/admin/subjects', color: '#8b5cf6', bg: '#ede9fe' },
    { icon: Users, title: 'Manage Users', desc: 'View user list', href: '/admin/users', color: '#f59e0b', bg: '#fef3c7' },
];

export default function AdminDashboard() {
    const [stats, setStats] = useState([
        { label: 'Total Test Series', value: '...', change: '0', trend: 'neutral', color: '#3b82f6', icon: FileText },
        { label: 'Published Tests', value: '...', change: '0', trend: 'neutral', color: '#10b981', icon: CheckCircle },
        { label: 'Total Questions', value: '...', change: '0', trend: 'neutral', color: '#f59e0b', icon: HelpCircle },
        { label: 'Registered Users', value: '...', change: '0', trend: 'neutral', color: '#8b5cf6', icon: Users },
    ]);
    const [recentTests, setRecentTests] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [subjectData, setSubjectData] = useState<any[]>([]);
    const [activityData, setActivityData] = useState<any[]>([]);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                // Fetch Test Series
                const testsSnapshot = await getDocs(collection(db, 'testSeries'));
                const tests = testsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

                const totalTests = tests.length;
                const publishedTests = tests.filter((t: any) => t.status === 'published').length;
                const totalQuestions = tests.reduce((acc: number, t: any) => acc + (t.questions?.length || 0), 0);

                // Calculate Subject Distribution
                const subjectCounts: { [key: string]: number } = {};
                tests.forEach((test: any) => {
                    if (test.questions && Array.isArray(test.questions)) {
                        test.questions.forEach((q: any) => {
                            if (q.subject) {
                                subjectCounts[q.subject] = (subjectCounts[q.subject] || 0) + 1;
                            }
                        });
                    }
                });

                const fetchedSubjectData = Object.entries(subjectCounts).map(([name, value]) => ({
                    name: name.charAt(0).toUpperCase() + name.slice(1),
                    value
                }));
                if (fetchedSubjectData.length > 0) {
                    setSubjectData(fetchedSubjectData);
                }

                // Fetch Users & Calculate Activity
                let totalUsers = 0;
                let usersSnapshot: QuerySnapshot<DocumentData> | undefined;
                try {
                    usersSnapshot = await getDocs(collection(db, 'users'));
                    totalUsers = usersSnapshot.size;
                } catch (e) {
                    console.warn("Could not fetch users count", e);
                }

                // Fetch Test Results for Activity
                let testResultsSnapshot: QuerySnapshot<DocumentData> | undefined;
                try {
                    testResultsSnapshot = await getDocs(collection(db, 'testResults'));
                } catch (e) {
                    console.warn("Could not fetch test results", e);
                }

                // Process Activity Data (Last 7 Days)
                const today = new Date();
                const oneWeekAgo = new Date();
                oneWeekAgo.setDate(today.getDate() - 7);

                const last7Days = Array.from({ length: 7 }, (_, i) => {
                    const d = new Date();
                    d.setDate(today.getDate() - (6 - i));
                    return d;
                });

                const activityStats = last7Days.map(date => {
                    const dateString = date.toLocaleDateString();
                    const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });

                    // Count New Users for this day
                    const newUsersCount = usersSnapshot?.docs.filter(doc => {
                        const userData = doc.data();
                        if (!userData.createdAt) return false;
                        const createdDate = userData.createdAt.seconds
                            ? new Date(userData.createdAt.seconds * 1000)
                            : new Date(userData.createdAt);
                        return createdDate.toLocaleDateString() === dateString;
                    }).length || 0;

                    // Count Test Attempts for this day
                    const attemptsCount = testResultsSnapshot?.docs.filter(doc => {
                        const resultData = doc.data();
                        if (!resultData.submittedAt) return false;
                        const submittedDate = resultData.submittedAt.seconds
                            ? new Date(resultData.submittedAt.seconds * 1000)
                            : new Date(resultData.submittedAt);
                        return submittedDate.toLocaleDateString() === dateString;
                    }).length || 0;

                    return {
                        name: dayName,
                        attempts: attemptsCount,
                        newUsers: newUsersCount
                    };
                });
                setActivityData(activityStats);

                // Calculate Weekly Growth
                const newTestsThisWeek = tests.filter((t: any) => {
                    const d = t.createdAt?.seconds ? new Date(t.createdAt.seconds * 1000) : new Date();
                    return d >= oneWeekAgo;
                }).length;

                const newPublishedThisWeek = tests.filter((t: any) => {
                    const d = t.updatedAt?.seconds ? new Date(t.updatedAt.seconds * 1000) : new Date();
                    return t.status === 'published' && d >= oneWeekAgo;
                }).length;

                const newQuestionsThisWeek = tests
                    .filter((t: any) => {
                        const d = t.updatedAt?.seconds ? new Date(t.updatedAt.seconds * 1000) : new Date();
                        return d >= oneWeekAgo;
                    })
                    .reduce((acc: number, t: any) => acc + (t.questions?.length || 0), 0);

                const newUsersThisWeek = usersSnapshot?.docs.filter(doc => {
                    const userData = doc.data();
                    if (!userData.createdAt) return false;
                    const createdDate = userData.createdAt.seconds
                        ? new Date(userData.createdAt.seconds * 1000)
                        : new Date(userData.createdAt);
                    return createdDate >= oneWeekAgo;
                }).length || 0;

                setStats([
                    { label: 'Total Test Series', value: totalTests.toString(), change: `+${newTestsThisWeek}`, trend: newTestsThisWeek > 0 ? 'up' : 'neutral', color: '#3b82f6', icon: FileText },
                    { label: 'Published Tests', value: publishedTests.toString(), change: `+${newPublishedThisWeek}`, trend: newPublishedThisWeek > 0 ? 'up' : 'neutral', color: '#10b981', icon: CheckCircle },
                    { label: 'Total Questions', value: totalQuestions.toString(), change: `+${newQuestionsThisWeek}`, trend: newQuestionsThisWeek > 0 ? 'up' : 'neutral', color: '#f59e0b', icon: HelpCircle },
                    { label: 'Registered Users', value: totalUsers.toString(), change: `+${newUsersThisWeek}`, trend: newUsersThisWeek > 0 ? 'up' : 'neutral', color: '#8b5cf6', icon: Users },
                ]);

                // Calculate attempts per test series
                const attemptsByTest: { [key: string]: number } = {};
                if (testResultsSnapshot) {
                    testResultsSnapshot.docs.forEach(doc => {
                        const data = doc.data();
                        if (data.testId) {
                            attemptsByTest[data.testId] = (attemptsByTest[data.testId] || 0) + 1;
                        }
                    });
                }

                // ... rest of code
                const recent = tests
                    .sort((a: any, b: any) => (b.updatedAt?.seconds || 0) - (a.updatedAt?.seconds || 0))
                    .slice(0, 5)
                    .map((t: any) => ({
                        id: t.id,
                        title: t.title,
                        category: t.isFree ? 'Free Test' : 'Premium',
                        status: t.status,
                        date: t.updatedAt ? new Date(t.updatedAt.seconds * 1000).toLocaleDateString() : 'N/A',
                        views: t.questions?.length || 0,
                        attempts: attemptsByTest[t.id] || 0
                    }));
                setRecentTests(recent);

            } catch (error) {
                console.error("Error fetching dashboard data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    return (
        <div>
            <div className={styles.pageHeader}>
                <div>
                    <h1 className={styles.pageTitle}>Dashboard</h1>
                    <p className={styles.pageSubtitle}>Welcome back! Here&apos;s an overview of your platform.</p>
                </div>
            </div>

            {/* Stats Grid */}
            <div className={styles.statsGrid}>
                {stats.map((stat) => (
                    <div key={stat.label} className={styles.statCard}>
                        <div className={styles.statLabel}>{stat.label}</div>
                        <div className={styles.statValue}>{loading ? '...' : stat.value}</div>
                        <div style={{
                            color: stat.trend === 'up' ? '#10b981' : stat.trend === 'down' ? '#ef4444' : '#64748b',
                            fontSize: '0.85rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.25rem'
                        }}>
                            {stat.trend === 'up' && <TrendingUp size={14} />}
                            {stat.trend === 'down' && <TrendingDown size={14} />}
                            {stat.change} this week
                        </div>
                    </div>
                ))}
            </div>

            {/* Charts Grid */}
            <div className={styles.chartsGrid}>
                <div className={styles.chartCard}>
                    <div className={styles.chartHeader}>
                        <h3 className={styles.chartTitle}>User Activity & Growth</h3>
                        <select className={styles.formSelect} style={{ width: 'auto', padding: '0.25rem 0.5rem', fontSize: '0.85rem' }}>
                            <option>Last 7 Days</option>
                            <option>Last 30 Days</option>
                        </select>
                    </div>
                    {/* Placeholder data for activity until we have a real tracking collection */}
                    <ActivityChart data={activityData.length > 0 ? activityData : undefined} />
                </div>
                <div className={styles.chartCard}>
                    <div className={styles.chartHeader}>
                        <h3 className={styles.chartTitle}>Subject Distribution</h3>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <SubjectDistributionChart data={subjectData.length > 0 ? subjectData : undefined} />
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <h3 style={{ marginBottom: '1rem', color: '#1e293b' }}>Quick Actions</h3>
            <div className={styles.quickActions}>
                {QUICK_ACTIONS.map((action) => (
                    <Link key={action.title} href={action.href} className={styles.quickActionCard}>
                        <div className={styles.quickActionIcon} style={{ background: action.bg, color: action.color }}>
                            <action.icon size={24} />
                        </div>
                        <div>
                            <div className={styles.quickActionTitle}>{action.title}</div>
                            <div className={styles.quickActionDesc}>{action.desc}</div>
                        </div>
                    </Link>
                ))}
            </div>

            {/* Recent Tests Table (Replacing Recent Articles) */}
            <div className={styles.recentSection}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h3 style={{ margin: 0, color: '#1e293b' }}>Recent Test Series</h3>
                    <Link href="/admin/test-series" className={styles.secondaryBtn}>
                        View All <ArrowRight size={14} />
                    </Link>
                </div>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Type</th>
                            <th>Status</th>
                            <th>Date</th>
                            <th>Questions</th>
                            <th>Attempts</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan={7} style={{ textAlign: 'center', padding: '2rem' }}>Loading recent tests...</td></tr>
                        ) : recentTests.map((test) => (
                            <tr key={test.id}>
                                <td style={{ fontWeight: 500 }}>{test.title}</td>
                                <td>
                                    <span className={`${styles.badge} ${test.category === 'Free Test' ? styles.badgeInfo : styles.badgeWarning}`}>
                                        {test.category}
                                    </span>
                                </td>
                                <td>
                                    <span className={`${styles.badge} ${test.status === 'published' ? styles.badgeSuccess : styles.badgeWarning}`}>
                                        {test.status}
                                    </span>
                                </td>
                                <td style={{ color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                    <Clock size={14} /> {test.date}
                                </td>
                                <td style={{ color: '#64748b' }}>
                                    {test.views} Qs
                                </td>
                                <td style={{ color: '#64748b', fontWeight: 500 }}>
                                    {test.attempts}
                                </td>
                                <td>
                                    <div className={styles.actionBtns}>
                                        <Link href={`/admin/test-series/${test.id}/edit`} className={styles.editBtn}>Edit</Link>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

