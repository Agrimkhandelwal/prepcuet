'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { collection, query, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { TestSeries } from '@/lib/firestore-schema';
import { Plus, Edit, Trash2, Eye, FileText, Mail, Send } from 'lucide-react';
import styles from '../../Admin.module.css';

export default function TestSeriesListPage() {
    const [testSeries, setTestSeries] = useState<(TestSeries & { id: string })[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'published' | 'draft'>('all');
    const [sendingEmailId, setSendingEmailId] = useState<string | null>(null);

    useEffect(() => {
        fetchTestSeries();
    }, []);

    const fetchTestSeries = async () => {
        try {
            const q = query(collection(db, 'testSeries'));
            const querySnapshot = await getDocs(q);
            const tests = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            } as TestSeries & { id: string }));
            setTestSeries(tests);
        } catch (error) {
            console.error('Error fetching test series:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this test series?')) return;

        try {
            await deleteDoc(doc(db, 'testSeries', id));
            setTestSeries(prev => prev.filter(t => t.id !== id));
            alert('Test series deleted successfully!');
        } catch (error) {
            console.error('Error deleting test series:', error);
            alert('Failed to delete test series');
        }
    };

    const handleSendEmail = async (test: TestSeries & { id: string }) => {
        if (!confirm(`Are you sure you want to send a notification email for "${test.title}" to all users?`)) return;

        setSendingEmailId(test.id);
        try {
            const response = await fetch('/api/send-test-notification', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    testId: test.id,
                    testTitle: test.title,
                    testDescription: test.description
                }),
            });

            const data = await response.json();
            if (response.ok) {
                alert(data.message || 'Emails sent successfully!');
            } else {
                alert(data.error || 'Failed to send emails');
            }
        } catch (error) {
            console.error('Error sending emails:', error);
            alert('An error occurred while sending emails');
        } finally {
            setSendingEmailId(null);
        }
    };

    const filteredTests = testSeries.filter(t => {
        if (filter === 'all') return true;
        return t.status === filter;
    });

    if (loading) {
        return (
            <div style={{ padding: '4rem', textAlign: 'center' }}>
                <div className={styles.spinner}></div>
            </div>
        );
    }

    return (
        <div>
            <div className={styles.pageHeader}>
                <div>
                    <h1 className={styles.pageTitle}>Test Series Management</h1>
                    <p className={styles.pageSubtitle}>Create and manage test series</p>
                </div>
                <Link href="/admin/test-series/new" className={styles.primaryBtn}>
                    <Plus size={20} /> Create New Test
                </Link>
            </div>

            <div className={styles.filterTabs}>
                <button
                    className={`${styles.filterTab} ${filter === 'all' ? styles.active : ''}`}
                    onClick={() => setFilter('all')}
                >
                    All ({testSeries.length})
                </button>
                <button
                    className={`${styles.filterTab} ${filter === 'published' ? styles.active : ''}`}
                    onClick={() => setFilter('published')}
                >
                    Published ({testSeries.filter(t => t.status === 'published').length})
                </button>
                <button
                    className={`${styles.filterTab} ${filter === 'draft' ? styles.active : ''}`}
                    onClick={() => setFilter('draft')}
                >
                    Drafts ({testSeries.filter(t => t.status === 'draft').length})
                </button>
            </div>

            {filteredTests.length === 0 ? (
                <div className={styles.emptyState}>
                    <FileText size={48} />
                    <h3>No test series found</h3>
                    <p>Get started by creating your first test series</p>
                    <Link href="/admin/test-series/new" className={styles.primaryBtn}>
                        <Plus size={20} /> Create Test Series
                    </Link>
                </div>
            ) : (
                <div className={styles.tableContainer}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Subjects</th>
                                <th>Questions</th>
                                <th>Duration</th>
                                <th>Status</th>
                                <th>Type</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredTests.map((test) => (
                                <tr key={test.id}>
                                    <td>
                                        <div style={{ fontWeight: 600 }}>{test.title}</div>
                                        <div style={{ fontSize: '0.875rem', color: '#64748b' }}>
                                            {test.description.substring(0, 60)}...
                                        </div>
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
                                            {test.subjects.slice(0, 3).map(subject => (
                                                <span key={subject} className={styles.badge}>
                                                    {subject}
                                                </span>
                                            ))}
                                            {test.subjects.length > 3 && (
                                                <span className={styles.badge}>+{test.subjects.length - 3}</span>
                                            )}
                                        </div>
                                    </td>
                                    <td>{test.questions.length}</td>
                                    <td>{test.duration} min</td>
                                    <td>
                                        <span className={`${styles.badge} ${test.status === 'published' ? styles.badgeSuccess : styles.badgeWarning}`}>
                                            {test.status}
                                        </span>
                                    </td>
                                    <td>
                                        <span className={`${styles.badge} ${test.isFree ? styles.badgeInfo : ''}`}>
                                            {test.isFree ? 'Free' : 'Paid'}
                                        </span>
                                    </td>
                                    <td>
                                        <div className={styles.actionBtns}>
                                            <button className={styles.iconBtn} title="View" onClick={() => window.open(`/test-series/${test.id}`, '_blank')}>
                                                <Eye size={16} />
                                            </button>
                                            <Link href={`/admin/test-series/${test.id}/edit`} className={styles.iconBtn} title="Edit">
                                                <Edit size={16} />
                                            </Link>
                                            <button
                                                onClick={() => handleSendEmail(test)}
                                                className={styles.iconBtn}
                                                style={{ color: '#2563eb' }}
                                                title="Send Email Notification"
                                                disabled={sendingEmailId === test.id}
                                            >
                                                {sendingEmailId === test.id ? <div className={styles.spinner} style={{ width: '16px', height: '16px', borderTopColor: '#2563eb' }} /> : <Send size={16} />}
                                            </button>
                                            <button
                                                onClick={() => handleDelete(test.id)}
                                                className={`${styles.iconBtn} ${styles.danger}`}
                                                title="Delete"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
