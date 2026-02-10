'use client';

import {
    CreditCard, Download, ExternalLink, BookOpen,
    Calendar, Receipt, ShoppingBag
} from 'lucide-react';
import Link from 'next/link';
import styles from './purchases.module.css';

export default function PurchasesPage() {
    const orders = [
        {
            id: 'ORD-2026-8841',
            name: 'CUET UG 2026: Complete Domain Mastery',
            date: 'Feb 01, 2026',
            amount: '₹4,999',
            type: 'Course',
            status: 'Active'
        },
        {
            id: 'ORD-2026-7723',
            name: 'General Test: Mock Series Premium',
            date: 'Jan 15, 2026',
            amount: '₹999',
            type: 'Test Series',
            status: 'Active'
        },
        {
            id: 'ORD-2025-9912',
            name: 'Logical Reasoning: Quick Revision Kit',
            date: 'Dec 20, 2025',
            amount: '₹499',
            type: 'E-Book',
            status: 'Active'
        }
    ];

    if (orders.length === 0) {
        return (
            <div className={styles.container}>
                <div className="container">
                    <div className={styles.emptyState}>
                        <ShoppingBag size={80} style={{ color: 'var(--border)', marginBottom: '1.5rem' }} />
                        <h2>No Purchases Found</h2>
                        <p>You haven't purchased any courses or test series yet. Start your journey today!</p>
                        <Link href="/courses" className="btn btn-primary">Browse Courses</Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className="container">
                <div className={styles.purchaseWrapper}>
                    <div style={{ marginBottom: '3rem' }}>
                        <h1 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '0.5rem' }}>My Purchases</h1>
                        <p style={{ color: 'var(--text-muted)' }}>Manage your enrolled content and download invoices.</p>
                    </div>

                    <div className={styles.purchaseList}>
                        {orders.map((order, index) => (
                            <div key={index} className={styles.purchaseCard}>
                                <div className={styles.itemImage}>
                                    <BookOpen size={32} />
                                </div>
                                <div className={styles.itemInfo}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                                        <h3>{order.name}</h3>
                                        <span className={`${styles.statusBadge} ${styles.statusActive}`}>
                                            {order.status}
                                        </span>
                                    </div>
                                    <div className={styles.itemMeta}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                            <Calendar size={14} /> {order.date}
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                            <CreditCard size={14} /> {order.amount}
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                            <ShoppingBag size={14} /> {order.type}
                                        </div>
                                        <span style={{ fontFamily: 'monospace', opacity: 0.6 }}>ID: {order.id}</span>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                    <button className={styles.actionBtn} style={{ background: 'var(--primary)', color: 'white', border: 'none' }}>
                                        <ExternalLink size={16} /> Access Now
                                    </button>
                                    <button className={styles.actionBtn}>
                                        <Download size={16} /> Invoice
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div style={{ marginTop: '4rem', padding: '2rem', border: '1px dashed var(--border)', borderRadius: '24px', textAlign: 'center' }}>
                        <p style={{ color: 'var(--text-muted)' }}>
                            Facing issues with your purchase? <Link href="/support" style={{ color: 'var(--primary)', fontWeight: 700 }}>Contact Support</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
