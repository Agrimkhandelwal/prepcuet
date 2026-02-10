'use client';

import Link from 'next/link';
import { Calendar, Monitor, ChevronRight, Bell } from 'lucide-react';
import { SIDEBAR_WIDGETS } from '@/lib/data';
import { useLanguage } from '@/app/context/LanguageContext';
import styles from './Sidebar.module.css';

export default function Sidebar() {
    const { t } = useLanguage();

    return (
        <aside className={styles.sidebar}>
            {/* New Batches Widget */}
            <div className={styles.widget}>
                <h3 className={styles.widgetTitle}>{t.sidebar.newBatches}</h3>
                <div className={styles.list}>
                    {SIDEBAR_WIDGETS.courses.map((course, idx) => (
                        <div key={idx} className={styles.courseItem}>
                            <div className={styles.courseHeader}>
                                <h4 className={styles.courseName}>{course.title}</h4>
                                <span className={styles.modeBadge}>{course.mode}</span>
                            </div>
                            <div className={styles.courseMeta}>
                                <Calendar size={14} /> <span>{t.sidebar.starts}: {course.date}</span>
                            </div>
                            <Link href="/courses" className={styles.courseLink}>
                                {t.sidebar.details} <ChevronRight size={14} />
                            </Link>
                        </div>
                    ))}
                </div>
            </div>

            {/* Notifications Widget */}
            <div className={styles.widget}>
                <h3 className={styles.widgetTitle}>
                    <Bell size={18} /> {t.sidebar.notifications}
                </h3>
                <ul className={styles.notifyList}>
                    {SIDEBAR_WIDGETS.notifications.map((note, idx) => (
                        <li key={idx} className={styles.notifyItem}>
                            <Link href="/notifications">{note}</Link>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Ad / Banner Widget */}
            <div className={`${styles.widget} ${styles.adWidget}`}>
                <h4>Join Test Series 2025</h4>
                <p>Improve your accuracy specifically for the pattern changes.</p>
                <button className={styles.adBtn}>Register Now</button>
            </div>
        </aside>
    );
}
