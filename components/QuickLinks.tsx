'use client';

import Link from 'next/link';
import { Newspaper, FileText, CheckCircle, Video, Bell } from 'lucide-react';
import { useLanguage } from '@/app/context/LanguageContext';
import styles from './QuickLinks.module.css';

export default function QuickLinks() {
    const { t } = useLanguage();

    const LINKS = [
        { id: 1, title: t.quickLinks.currentAffairs, icon: Newspaper, href: '/current-affairs', color: '#3b82f6' },
        { id: 2, title: t.quickLinks.previousYearPaper, icon: FileText, href: '/previous-year-papers', color: '#10b981' },
        { id: 3, title: t.quickLinks.dailyQuiz, icon: CheckCircle, href: '/daily-quiz', color: '#ef4444' },
        { id: 5, title: t.quickLinks.updates, icon: Bell, href: '/updates', color: '#f59e0b' },
    ];

    return (
        <section className={styles.section}>
            <div className="container">
                <div className={styles.grid}>
                    {LINKS.map((item) => (
                        <Link key={item.id} href={item.href} className={styles.card}>
                            <div className={styles.iconWrapper} style={{ backgroundColor: `${item.color}15`, color: item.color }}>
                                <item.icon size={28} />
                            </div>
                            <span className={styles.title}>{item.title}</span>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
