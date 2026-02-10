'use client';

import Link from 'next/link';
import {
    TrendingUp,
    TrendingDown,
    FileText,
    Image,
    BookOpen,
    HelpCircle,
    Plus,
    ArrowRight,
    Clock,
    Eye
} from 'lucide-react';
import styles from './Admin.module.css';

// Mock data - in production, this would come from an API/database
const STATS = [
    { label: 'Total Articles', value: '156', change: '+12', trend: 'up', color: '#3b82f6' },
    { label: 'Active Banners', value: '3', change: '0', trend: 'neutral', color: '#10b981' },
    { label: 'Subjects', value: '12', change: '+2', trend: 'up', color: '#8b5cf6' },
    { label: 'Quiz Questions', value: '450', change: '+28', trend: 'up', color: '#f59e0b' },
];

const QUICK_ACTIONS = [
    { icon: FileText, title: 'New Article', desc: 'Create a new article', href: '/admin/posts/new', color: '#3b82f6', bg: '#dbeafe' },
    { icon: Image, title: 'Add Banner', desc: 'Create new slider', href: '/admin/banners', color: '#10b981', bg: '#dcfce7' },
    { icon: BookOpen, title: 'Add Subject', desc: 'Create new subject', href: '/admin/subjects', color: '#8b5cf6', bg: '#ede9fe' },
    { icon: HelpCircle, title: 'Add Quiz', desc: 'Create new quiz', href: '/admin/quizzes', color: '#f59e0b', bg: '#fef3c7' },
];

const RECENT_ARTICLES = [
    { id: 1, title: 'Daily Current Affairs – 30th January 2026', category: 'Current Affairs', status: 'Published', date: 'Today', views: 245 },
    { id: 2, title: 'Editorial Analysis: Budget 2026 Highlights', category: 'Editorials', status: 'Published', date: 'Today', views: 189 },
    { id: 3, title: 'CUET Mock Test: English Section', category: 'Quiz', status: 'Draft', date: 'Yesterday', views: 0 },
    { id: 4, title: 'Mathematics: Algebra Tricks for CUET', category: 'Strategy', status: 'Published', date: '2 days ago', views: 312 },
    { id: 5, title: 'General Aptitude Practice Questions', category: 'CUET Practice', status: 'Published', date: '3 days ago', views: 156 },
];

export default function AdminDashboard() {
    return (
        <div>
            <div className={styles.pageHeader}>
                <div>
                    <h1 className={styles.pageTitle}>Dashboard</h1>
                    <p className={styles.pageSubtitle}>Welcome back! Here&apos;s what&apos;s happening with your content.</p>
                </div>
            </div>

            {/* Stats Grid */}
            <div className={styles.statsGrid}>
                {STATS.map((stat) => (
                    <div key={stat.label} className={styles.statCard}>
                        <div className={styles.statLabel}>{stat.label}</div>
                        <div className={styles.statValue}>{stat.value}</div>
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

            {/* Recent Articles */}
            <div className={styles.recentSection}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h3 style={{ margin: 0, color: '#1e293b' }}>Recent Articles</h3>
                    <Link href="/admin/posts" className={styles.secondaryBtn}>
                        View All <ArrowRight size={14} />
                    </Link>
                </div>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Category</th>
                            <th>Status</th>
                            <th>Date</th>
                            <th>Views</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {RECENT_ARTICLES.map((article) => (
                            <tr key={article.id}>
                                <td style={{ fontWeight: 500 }}>{article.title}</td>
                                <td>
                                    <span className={`${styles.badge} ${styles.badgeInfo}`}>
                                        {article.category}
                                    </span>
                                </td>
                                <td>
                                    <span className={`${styles.badge} ${article.status === 'Published' ? styles.badgeSuccess : styles.badgeWarning}`}>
                                        {article.status}
                                    </span>
                                </td>
                                <td style={{ color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                    <Clock size={14} /> {article.date}
                                </td>
                                <td style={{ color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                    <Eye size={14} /> {article.views}
                                </td>
                                <td>
                                    <div className={styles.actionBtns}>
                                        <button className={styles.editBtn}>Edit</button>
                                        <button className={styles.deleteBtn}>Delete</button>
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
