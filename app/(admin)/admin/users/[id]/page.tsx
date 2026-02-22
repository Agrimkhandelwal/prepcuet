'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { db } from '@/lib/firebase';
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove, collection, getDocs } from 'firebase/firestore';
import { UserProfile, TestSeries } from '@/lib/firestore-schema';
import Link from 'next/link';
import {
    ArrowLeft,
    User,
    Mail,
    Shield,
    Calendar,
    Award,
    Plus,
    Trash2
} from 'lucide-react';
import styles from '../../../Admin.module.css';

export default function UserDetailPage() {
    const params = useParams();
    const router = useRouter();
    const userId = params.id as string;

    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [availableTests, setAvailableTests] = useState<{ id: string, title: string }[]>([]);
    const [selectedTestId, setSelectedTestId] = useState('');
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        if (userId) {
            fetchUserAndTests();
        }
    }, [userId]);

    const fetchUserAndTests = async () => {
        setLoading(true);
        try {
            // Fetch User
            const userDoc = await getDoc(doc(db, 'users', userId));
            if (userDoc.exists()) {
                setUserProfile(userDoc.data() as UserProfile);
            } else {
                alert('User not found');
                router.push('/admin/users');
                return;
            }

            // Fetch All Paid Tests for dropdown
            // Ideally should filter by "not already purchased" but for simplicity fetching all
            const testQuery = await getDocs(collection(db, 'testSeries'));
            const tests = testQuery.docs
                .map(d => ({ id: d.id, ...d.data() } as TestSeries))
                .filter(t => !t.isFree) // Only interested in paid tests for manual grant
                .map(t => ({ id: t.id, title: t.title }));

            setAvailableTests(tests);

        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    const grantAccess = async () => {
        if (!selectedTestId || !userProfile) return;

        if (window.confirm('Are you sure you want to grant access to this test?')) {
            setProcessing(true);
            try {
                const userRef = doc(db, 'users', userId);
                await updateDoc(userRef, {
                    purchasedTests: arrayUnion(selectedTestId)
                });

                // Update local state
                // Update local state
                setUserProfile(prev => {
                    if (!prev) return null;
                    return {
                        ...prev,
                        purchasedTests: [...(prev.purchasedTests || []), selectedTestId]
                    };
                });

                setSelectedTestId('');
                alert('Access granted successfully');
            } catch (error) {
                console.error("Error granting access:", error);
                alert('Failed to grant access');
            } finally {
                setProcessing(false);
            }
        }
    };

    const revokeAccess = async (testId: string) => {
        if (!userProfile) return;

        if (window.confirm('Are you sure you want to REVOKE access to this test?')) {
            setProcessing(true);
            try {
                const userRef = doc(db, 'users', userId);
                await updateDoc(userRef, {
                    purchasedTests: arrayRemove(testId)
                });

                // Update local state
                // Update local state
                setUserProfile(prev => {
                    if (!prev) return null;
                    return {
                        ...prev,
                        purchasedTests: prev.purchasedTests.filter(id => id !== testId)
                    };
                });

            } catch (error) {
                console.error("Error revoking access:", error);
                alert('Failed to revoke access');
            } finally {
                setProcessing(false);
            }
        }
    };

    if (loading) {
        return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading profile...</div>;
    }

    if (!userProfile) return null;

    // Helper to get test name (simple lookup)
    const getTestName = (id: string) => {
        const test = availableTests.find(t => t.id === id);
        return test ? test.title : `Test ID: ${id}`;
    };

    return (
        <div className={styles.container}>
            <div className={styles.pageHeader}>
                <div>
                    <Link href="/admin/users" className={styles.backLink}>
                        <ArrowLeft size={18} /> Back to Users
                    </Link>
                    <h1 className={styles.pageTitle}>{userProfile.name}'s Profile</h1>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1.5rem' }}>
                {/* Profile Info */}
                <div className={styles.card}>
                    <h3 className={styles.sectionTitle} style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '0.75rem', marginBottom: '1rem' }}>
                        User Details
                    </h3>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <div style={{ width: '40px', height: '40px', background: '#e2e8f0', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <User size={20} color="#64748b" />
                            </div>
                            <div>
                                <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Full Name</div>
                                <div style={{ fontWeight: 600, color: '#1e293b' }}>{userProfile.name}</div>
                            </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <div style={{ width: '40px', height: '40px', background: '#e2e8f0', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Mail size={18} color="#64748b" />
                            </div>
                            <div>
                                <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Email Address</div>
                                <div style={{ fontWeight: 500, color: '#1e293b' }}>{userProfile.email}</div>
                            </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <div style={{ width: '40px', height: '40px', background: '#e2e8f0', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Shield size={18} color="#64748b" />
                            </div>
                            <div>
                                <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Role</div>
                                <div style={{ fontWeight: 500, color: '#1e293b', textTransform: 'capitalize' }}>{userProfile.role}</div>
                            </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <div style={{ width: '40px', height: '40px', background: '#e2e8f0', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Calendar size={18} color="#64748b" />
                            </div>
                            <div>
                                <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Joined Date</div>
                                <div style={{ fontWeight: 500, color: '#1e293b' }}>
                                    {userProfile.createdAt ? new Date(userProfile.createdAt.seconds * 1000).toLocaleDateString() : 'N/A'}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Access Management */}
                <div className={styles.card}>
                    {/* Subscription Status Section */}
                    {userProfile.subscription && (
                        <div style={{
                            marginBottom: '2rem',
                            padding: '1.25rem',
                            background: 'linear-gradient(to right, #eff6ff, #f0f9ff)',
                            borderRadius: '12px',
                            border: '1px solid #bfdbfe'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                                <div>
                                    <h4 style={{ margin: 0, color: '#1e3a8a', fontSize: '1.1rem', fontWeight: 700 }}>
                                        {userProfile.subscription.planId === 'premium_bundle' ? 'Premium Bundle' : 'Active Plan'}
                                    </h4>
                                    <div style={{ color: '#3b82f6', fontSize: '0.85rem', fontWeight: 500, marginTop: '0.25rem' }}>
                                        Valid until: {new Date(userProfile.subscription.validUntil.seconds * 1000).toLocaleDateString()}
                                    </div>
                                </div>
                                <span className={styles.badge} style={{ background: '#dbeafe', color: '#1e40af', padding: '0.4rem 0.8rem' }}>
                                    {userProfile.subscription.status.toUpperCase()}
                                </span>
                            </div>

                            <div style={{ marginBottom: '0.5rem', fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>INCLUDED SUBJECTS:</div>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                {userProfile.subscription.subjects.map(sub => (
                                    <span key={sub} style={{ background: 'white', border: '1px solid #bfdbfe', borderRadius: '6px', padding: '0.25rem 0.6rem', fontSize: '0.8rem', color: '#3b82f6' }}>
                                        {sub}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    <h3 className={styles.sectionTitle} style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '0.75rem', marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span>Purchased Tests / Access</span>
                        <Award size={20} color="#f59e0b" />
                    </h3>

                    {/* Grant Form */}
                    <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', border: '1px solid #e2e8f0' }}>
                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#475569', marginBottom: '0.5rem' }}>
                            Grant Manual Access:
                        </label>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <select
                                value={selectedTestId}
                                onChange={(e) => setSelectedTestId(e.target.value)}
                                className={styles.select}
                                style={{ margin: 0 }}
                            >
                                <option value="">Select a Paid Test Series...</option>
                                {availableTests.map(test => (
                                    <option
                                        key={test.id}
                                        value={test.id}
                                        disabled={userProfile.purchasedTests?.includes(test.id)}
                                    >
                                        {test.title} {userProfile.purchasedTests?.includes(test.id) ? '(Already Owned)' : ''}
                                    </option>
                                ))}
                            </select>
                            <button
                                onClick={grantAccess}
                                disabled={!selectedTestId || processing}
                                className={styles.primaryBtn}
                                style={{ whiteSpace: 'nowrap' }}
                            >
                                <Plus size={16} /> Grant Access
                            </button>
                        </div>
                    </div>

                    {/* List */}
                    <div>
                        <h4 style={{ fontSize: '0.9rem', marginBottom: '0.75rem', color: '#64748b' }}>Active Access List:</h4>

                        {(!userProfile.purchasedTests || userProfile.purchasedTests.length === 0) ? (
                            <div style={{ padding: '1rem', textAlign: 'center', color: '#94a3b8', background: '#f1f5f9', borderRadius: '6px' }}>
                                No active purchases found.
                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                {userProfile.purchasedTests.map(testId => (
                                    <div key={testId} style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        padding: '0.75rem',
                                        background: 'white',
                                        border: '1px solid #e2e8f0',
                                        borderRadius: '6px'
                                    }}>
                                        <span style={{ fontWeight: 500, color: '#334155' }}>
                                            {getTestName(testId)}
                                        </span>
                                        <button
                                            onClick={() => revokeAccess(testId)}
                                            className={styles.iconBtn}
                                            style={{ color: '#ef4444' }}
                                            title="Revoke Access"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
