'use client';

import React from 'react';
import Link from 'next/link';
import { BookOpen, Calculator, FlaskConical, Globe, LineChart, MessageSquare, ChevronRight, FileText } from 'lucide-react';
import { SUBJECT_CATEGORIES } from '@/lib/constants/subjects';
import styles from './SubjectsPage.module.css';

// Type helper to get the keys of SUBJECT_CATEGORIES
type CategoryKey = keyof typeof SUBJECT_CATEGORIES;

// Map categories to icons and display names
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

export default function SubjectsPage() {
    return (
        <div className={styles.page}>
            {/* Hero Section */}
            <section className={styles.hero}>
                <span className={styles.tagline}>CUET UG Syllabus</span>
                <h1 className={styles.title}>Explore Subjects & Syllabus</h1>
                <p className={styles.subtitle}>
                    Browse comprehensive, NTA-aligned syllabi for 2026. Select a subject below
                    to view its detailed topics, exam pattern, and preparation resources.
                </p>
            </section>

            {/* Content Section */}
            <section className={styles.content}>
                {(Object.keys(SUBJECT_CATEGORIES) as CategoryKey[]).map((categoryKey) => {
                    const category = categoryDetails[categoryKey];
                    const subjects = SUBJECT_CATEGORIES[categoryKey];
                    if (!subjects) return null;
                    return (
                        <div key={categoryKey} className={styles.categorySection}>
                            <h2 className={styles.categoryTitle}>
                                {category.icon}
                                {category.title}
                            </h2>

                            <div className={styles.subjectGrid}>
                                {subjects.map((subject) => {
                                    // create URL-friendly slug, e.g., "Political Science" -> "political-science"
                                    const slug = subject.toLowerCase().replace(/\s+/g, '-');

                                    return (
                                        <Link
                                            href={`/subjects/${slug}`}
                                            key={subject}
                                            className={styles.subjectCard}
                                        >
                                            <div className={styles.cardHeader}>
                                                <div className={styles.iconWrapper}>
                                                    <FileText size={24} />
                                                </div>
                                                <ChevronRight size={24} className={styles.arrowIcon} />
                                            </div>

                                            <div className={styles.cardContent}>
                                                <h3 className={styles.subjectName}>{subject}</h3>

                                                <div className={styles.badge}>
                                                    View Complete Syllabus
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
