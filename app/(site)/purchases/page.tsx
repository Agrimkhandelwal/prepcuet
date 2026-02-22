'use client';

import {
    CreditCard, Download, ExternalLink, BookOpen,
    Calendar, Receipt, ShoppingBag, Loader2
} from 'lucide-react';
import Link from 'next/link';
import styles from './purchases.module.css';
import { useAuth } from '@/hooks/useAuth';
import { UserSubscription } from '@/lib/firestore-schema';

export default function PurchasesPage() {
    const { userProfile, loading } = useAuth();

    if (loading) {
        return (
            <div className={styles.container} style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Loader2 className="animate-spin" size={40} color="var(--primary)" />
            </div>
        );
    }

    const subscription = userProfile?.subscription;
    const hasActivePlan = subscription && subscription.status === 'active';

    // Helper to format Timestamp
    const formatDate = (timestamp: any) => {
        if (!timestamp) return '';
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    return (
        <div className={styles.container}>
            <div className="container">
                <div className={styles.purchaseWrapper}>
                    <div style={{ marginBottom: '3rem' }}>
                        <h1 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '0.5rem' }}>My Purchases</h1>
                        <p style={{ color: 'var(--text-muted)' }}>Manage your enrolled plans and subscriptions.</p>
                    </div>

                    {!hasActivePlan ? (
                        <div className={styles.emptyState}>
                            <ShoppingBag size={80} style={{ color: 'var(--border)', marginBottom: '1.5rem' }} />
                            <h2>No Active Subscription</h2>
                            <p>You don't have an active plan yet. Upgrade to access premium content!</p>
                            <Link href="/pricing" className="btn btn-primary" style={{ marginTop: '1rem', display: 'inline-flex', padding: '0.75rem 1.5rem', borderRadius: '8px', background: 'var(--primary)', color: 'white', fontWeight: 600 }}>
                                View Plans
                            </Link>
                        </div>
                    ) : (
                        <div className={styles.purchaseList}>
                            {/* Active Subscription Card */}
                            <div className={styles.purchaseCard} style={{ border: '1px solid var(--primary)', background: 'linear-gradient(to right, var(--card-bg), rgba(var(--primary-rgb), 0.05))' }}>
                                <div className={styles.itemImage}>
                                    <BookOpen size={32} color="var(--primary)" />
                                </div>
                                <div className={styles.itemInfo}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                                        <h3>
                                            {subscription.planId === 'premium_bundle' ? 'Premium Bundle: All Subjects' : 'Individual Subject Plan'}
                                        </h3>
                                        <span className={`${styles.statusBadge} ${styles.statusActive}`}>
                                            ACTIVE
                                        </span>
                                    </div>
                                    <div className={styles.itemMeta}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                            <Calendar size={14} /> Valid until: {formatDate(subscription.validUntil)}
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                            <CreditCard size={14} /> ₹{subscription.amount}
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                            <ShoppingBag size={14} /> Subscription
                                        </div>
                                    </div>
                                    {/* Subject List for Individual Plan */}
                                    {subscription.subjects && subscription.subjects.length > 0 && (
                                        <div style={{ marginTop: '0.75rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                            {subscription.subjects.map(sub => (
                                                <span key={sub} style={{ fontSize: '0.75rem', background: 'var(--surface)', padding: '0.2rem 0.6rem', borderRadius: '4px', border: '1px solid var(--border)' }}>
                                                    {sub}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                    <Link href="/test-series" className={styles.actionBtn} style={{ background: 'var(--primary)', color: 'white', border: 'none', textDecoration: 'none', textAlign: 'center' }}>
                                        <ExternalLink size={16} /> Start Learning
                                    </Link>
                                    <button className={styles.actionBtn}>
                                        <Download size={16} /> Invoice
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    <div style={{ marginTop: '4rem', padding: '2rem', border: '1px dashed var(--border)', borderRadius: '24px', textAlign: 'center' }}>
                        <p style={{ color: 'var(--text-muted)' }}>
                            Facing issues with your plan? <Link href="/support" style={{ color: 'var(--primary)', fontWeight: 700 }}>Contact Support</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
