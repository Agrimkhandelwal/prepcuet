'use client';

import React from 'react';
import Link from 'next/link';
import {
    Target,
    Calculator,
    FlaskConical,
    Globe,
    LineChart,
    MessageSquare,
    BookOpen,
    FileText,
    ChevronRight,
    Play
} from 'lucide-react';
import { SUBJECT_CATEGORIES } from '@/lib/constants/subjects';
import styles from './TestSeries.module.css';
import subjectStyles from '../subjects/SubjectsPage.module.css';

type CategoryKey = keyof typeof SUBJECT_CATEGORIES;

const categoryDetails: Record<CategoryKey, { title: string, icon: React.ReactNode }> = {
    languages: {
        title: 'Languages',
        icon: <MessageSquare size={24} />
    },
    sciences: {
        title: 'Sciences',
        icon: <FlaskConical size={24} />
    },
    mathematics: {
        title: 'Mathematics',
        icon: <Calculator size={24} />
    },
    socialSciences: {
        title: 'Social Sciences',
        icon: <Globe size={24} />
    },
    commerce: {
        title: 'Commerce',
        icon: <LineChart size={24} />
    },
    general: {
        title: 'General Test',
        icon: <BookOpen size={24} />
    }
};

export default function TestSeriesPage() {
    return (
        <div className={styles.testSeriesPage}>
            {/* Hero Section */}
            <section className={styles.hero}>
                <div className="container">
                    <div className={styles.heroContent}>
                        <div className={styles.heroText}>
                            <h1>
                                CUET <span>Test Series</span> 2026
                            </h1>
                            <p>
                                Prepare for CUET with our comprehensive test series. Practice with
                                real exam-pattern questions, get instant results, and track your
                                progress with detailed analytics. Select a subject below to begin.
                            </p>
                            <div className={styles.heroStats}>
                                <div className={styles.statItem}>
                                    <span className={styles.statNumber}>100+</span>
                                    <span className={styles.statLabel}>Mock Tests</span>
                                </div>
                                <div className={styles.statItem}>
                                    <span className={styles.statNumber}>5000+</span>
                                    <span className={styles.statLabel}>Questions</span>
                                </div>
                            </div>
                        </div>
                        <div className={styles.heroImage}>
                            <div className={styles.heroCard}>
                                <div className={styles.heroCardIcon}>
                                    <Target size={40} color="white" />
                                </div>
                                <h3 className={styles.heroCardTitle}>Select Subject</h3>
                                <p className={styles.heroCardDesc}>
                                    Choose your domain to start practicing mock tests
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Content Section imported from Subjects Page styles */}
            <section className={subjectStyles.content}>
                {(Object.keys(SUBJECT_CATEGORIES) as CategoryKey[]).map((categoryKey) => {
                    const category = categoryDetails[categoryKey];
                    const subjects = SUBJECT_CATEGORIES[categoryKey];
                    if (!subjects) return null;
                    return (
                        <div key={categoryKey} className={subjectStyles.categorySection}>
                            <h2 className={subjectStyles.categoryTitle}>
                                {category.icon}
                                {category.title}
                            </h2>

                            <div className={subjectStyles.subjectGrid}>
                                {subjects.map((subject) => {
                                    // create URL-friendly slug
                                    const slug = subject.toLowerCase().replace(/\s+/g, '-');

                                    return (
                                        <Link
                                            href={`/test-series/subject/${slug}`}
                                            key={subject}
                                            className={subjectStyles.subjectCard}
                                        >
                                            <div className={subjectStyles.cardHeader}>
                                                <div className={subjectStyles.iconWrapper}>
                                                    <FileText size={24} />
                                                </div>
                                                <ChevronRight size={24} className={subjectStyles.arrowIcon} />
                                            </div>

                                            <div className={subjectStyles.cardContent}>
                                                <h3 className={subjectStyles.subjectName}>{subject}</h3>

                                                <div className={subjectStyles.badge}>
                                                    <Play size={14} style={{ marginRight: '4px' }} />
                                                    View Tests
                                                </div>
                                            </div>
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </section>
        </div>
    );
}
