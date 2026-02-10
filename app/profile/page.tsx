'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
    User, BookOpen, Clock, Target, Award,
    ArrowRight, Edit3, CheckCircle2, TrendingUp
} from 'lucide-react';
import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import Link from 'next/link';
import styles from './profile.module.css';

export default function ProfilePage() {
    const router = useRouter();
    const [user, setUser] = useState<FirebaseUser | null>(null);
    const [userData, setUserData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
                const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
                if (userDoc.exists()) {
                    setUserData(userDoc.data());
                }
                setIsLoading(false);
            } else {
                router.push('/login');
            }
        });

        return () => unsubscribe();
    }, [router]);

    const getAvatarUrl = (seed: string) => {
        return `https://api.dicebear.com/7.x/lorelei/svg?seed=${seed}&backgroundColor=b6e3f4,c0aede,d1d4f9`;
    };

    if (isLoading) {
        return (
            <div className={styles.container}>
                <div className="container" style={{ textAlign: 'center', padding: '100px 0' }}>
                    <div className="spinner"></div>
                    <p style={{ marginTop: '20px', color: 'var(--text-muted)' }}>Loading your profile...</p>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className="container">
                {/* Profile Header */}
                <header className={styles.profileHeader}>
                    <div className={styles.avatarWrapper}>
                        <img
                            src={getAvatarUrl(user?.email || user?.uid || 'default')}
                            alt="Profile"
                            className={styles.avatarImage}
                        />
                    </div>
                    <div className={styles.profileInfo}>
                        <span className={styles.userRole}>{userData?.role || 'Aspirant'}</span>
                        <h1>{userData?.name || user?.displayName || 'Student'}</h1>
                        <p style={{ color: 'var(--text-muted)' }}>{user?.email}</p>
                    </div>
                    <Link href="/profile/edit" className={styles.editBtn}>
                        <Edit3 size={18} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                        Edit Profile
                    </Link>
                </header>

                {/* Stats Grid */}
                <div className={styles.statsGrid}>
                    <div className={styles.statCard}>
                        <div className={styles.statIcon}>
                            <BookOpen size={24} />
                        </div>
                        <div className={styles.statInfo}>
                            <span className={styles.statValue}>12</span>
                            <span className={styles.statLabel}>Courses Enrolled</span>
                        </div>
                    </div>
                    <div className={styles.statCard}>
                        <div className={styles.statIcon} style={{ background: '#ecfdf5', color: '#10b981' }}>
                            <Target size={24} />
                        </div>
                        <div className={styles.statInfo}>
                            <span className={styles.statValue}>84%</span>
                            <span className={styles.statLabel}>Average Score</span>
                        </div>
                    </div>
                    <div className={styles.statCard}>
                        <div className={styles.statIcon} style={{ background: '#fff7ed', color: '#f97316' }}>
                            <Award size={24} />
                        </div>
                        <div className={styles.statInfo}>
                            <span className={styles.statValue}>4</span>
                            <span className={styles.statLabel}>Badges Earned</span>
                        </div>
                    </div>
                    <div className={styles.statCard}>
                        <div className={styles.statIcon} style={{ background: '#f5f3ff', color: '#8b5cf6' }}>
                            <Clock size={24} />
                        </div>
                        <div className={styles.statInfo}>
                            <span className={styles.statValue}>128h</span>
                            <span className={styles.statLabel}>Study Hours</span>
                        </div>
                    </div>
                </div>

                {/* Main Content Row */}
                <div className={styles.contentRow}>
                    {/* Recent Activity */}
                    <div className={styles.activityCard}>
                        <h2 className={styles.sectionTitle}>Recent Activity</h2>
                        <div className={styles.activityList}>
                            <div className={styles.activityItem}>
                                <div className={styles.activityDot}></div>
                                <div className={styles.activityContent}>
                                    <h4>Completed Mock Test: General Awareness Section</h4>
                                    <span className={styles.activityTime}>2 hours ago</span>
                                </div>
                            </div>
                            <div className={styles.activityItem}>
                                <div className={styles.activityDot}></div>
                                <div className={styles.activityContent}>
                                    <h4>Enrolled in "Logical Reasoning Mastery"</h4>
                                    <span className={styles.activityTime}>Yesterday</span>
                                </div>
                            </div>
                            <div className={styles.activityItem}>
                                <div className={styles.activityDot}></div>
                                <div className={styles.activityContent}>
                                    <h4>Attempted Chapter Quiz: Indian History</h4>
                                    <span className={styles.activityTime}>2 days ago</span>
                                </div>
                            </div>
                            <div className={styles.activityItem}>
                                <div className={styles.activityDot}></div>
                                <div className={styles.activityContent}>
                                    <h4>Profile Information updated</h4>
                                    <span className={styles.activityTime}>3 days ago</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Progress */}
                    <div className={styles.progressCard}>
                        <h2 className={styles.sectionTitle}>Learning Progress</h2>
                        <div style={{ padding: '1rem 0' }}>
                            <div style={{ marginBottom: '1.5rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                    <span style={{ fontWeight: 600 }}>Quantitive Aptitude</span>
                                    <span style={{ color: 'var(--primary)' }}>75%</span>
                                </div>
                                <div style={{ height: '8px', background: 'var(--border)', borderRadius: '4px' }}>
                                    <div style={{ width: '75%', height: '100%', background: 'var(--primary)', borderRadius: '4px' }}></div>
                                </div>
                            </div>
                            <div style={{ marginBottom: '1.5rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                    <span style={{ fontWeight: 600 }}>English Language</span>
                                    <span style={{ color: '#10b981' }}>90%</span>
                                </div>
                                <div style={{ height: '8px', background: 'var(--border)', borderRadius: '4px' }}>
                                    <div style={{ width: '90%', height: '100%', background: '#10b981', borderRadius: '4px' }}></div>
                                </div>
                            </div>
                            <div style={{ marginBottom: '1.5rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                    <span style={{ fontWeight: 600 }}>General Test</span>
                                    <span style={{ color: '#f97316' }}>45%</span>
                                </div>
                                <div style={{ height: '8px', background: 'var(--border)', borderRadius: '4px' }}>
                                    <div style={{ width: '45%', height: '100%', background: '#f97316', borderRadius: '4px' }}></div>
                                </div>
                            </div>
                        </div>
                        <Link href="/courses" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)', fontWeight: 700, textDecoration: 'none', marginTop: '1rem' }}>
                            Continue Learning <ArrowRight size={18} />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
