'use client';

import React from 'react';
import Link from 'next/link';
import {
    BookOpen,
    Target,
    Award,
    GraduationCap,
    ArrowRight,
    CheckCircle2,
    Building2,
    Users
} from 'lucide-react';
import styles from './AboutCuet.module.css';

export default function AboutCuetPage() {
    return (
        <div className={styles.page}>
            {/* Hero Section */}
            <section className={styles.hero}>
                <div className={styles.heroContent}>
                    <span className={styles.tagline}>Start Your Journey</span>
                    <h1 className={styles.title}>All About CUET (UG) 2026</h1>
                    <p className={styles.subtitle}>
                        Common University Entrance Test (CUET) is your single gateway to seeking admission
                        into all Central Universities and other participating institutions across India.
                    </p>
                </div>
            </section>

            {/* Main Content */}
            <section className={styles.contentSection}>
                <div className={styles.sectionGrid}>

                    {/* What is CUET */}
                    <div className={styles.infoBlock}>
                        <div className={styles.blockTitle}>
                            <div className={styles.iconWrapper}>
                                <GraduationCap size={32} />
                            </div>
                            What is CUET?
                        </div>
                        <p className={styles.blockText}>
                            The Common University Entrance Test (CUET) is being introduced for admission into all
                            UG Programmes in all Central Universities for academic session 2026-27 under the Ministry
                            of Education (MoE).
                        </p>
                        <p className={styles.blockText}>
                            It provides a common platform and equal opportunities to candidates across the country,
                            especially those from rural and other remote areas, helping to establish better connect
                            with the Universities.
                        </p>
                    </div>

                    {/* Why CUET matters */}
                    <div className={styles.infoBlock}>
                        <div className={styles.blockTitle}>
                            <div className={styles.iconWrapper}>
                                <Target size={32} />
                            </div>
                            Why is it Important?
                        </div>
                        <ul className={styles.list}>
                            <li className={styles.listItem}>
                                <CheckCircle2 size={20} className={styles.checkIcon} />
                                Single window opportunity
                            </li>
                            <li className={styles.listItem}>
                                <CheckCircle2 size={20} className={styles.checkIcon} />
                                Levels playing field for all boards
                            </li>
                            <li className={styles.listItem}>
                                <CheckCircle2 size={20} className={styles.checkIcon} />
                                End of high cut-off madness
                            </li>
                            <li className={styles.listItem}>
                                <CheckCircle2 size={20} className={styles.checkIcon} />
                                Focus on conceptual understanding
                            </li>
                        </ul>
                    </div>

                    {/* Exam Structure */}
                    <div className={styles.infoBlock}>
                        <div className={styles.blockTitle}>
                            <div className={styles.iconWrapper}>
                                <BookOpen size={32} />
                            </div>
                            Exam Structure
                        </div>
                        <p className={styles.blockText}>
                            The CUET (UG) will consist of the following four Sections:
                        </p>
                        <ul className={styles.list} style={{ gridTemplateColumns: '1fr' }}>
                            <li className={styles.listItem}>
                                <strong>Section IA (13 Languages):</strong> Assess reading comprehension, vocabulary, and literary aptitude.
                            </li>
                            <li className={styles.listItem}>
                                <strong>Section IB (20 Optional Languages):</strong> For those looking to pursue degree in specific languages.
                            </li>
                            <li className={styles.listItem}>
                                <strong>Section II (27 Domain Subjects):</strong> Test core competency in subjects chosen for degree.
                            </li>
                            <li className={styles.listItem}>
                                <strong>Section III (General Test):</strong> General Knowledge, Current Affairs, numerical and logical ability.
                            </li>
                        </ul>
                    </div>

                </div>

                {/* Call to Action for Test Series */}
                <div className={styles.ctaSection}>
                    <div className={styles.ctaBlob}></div>
                    <div className={styles.ctaContent}>
                        <h2 className={styles.ctaTitle}>Master CUET with PrepCUET</h2>
                        <p className={styles.ctaDesc}>
                            Don't leave your dream university admission to chance. Practice with our expert-crafted,
                            NTA-pattern test series and get detailed analytics on your performance.
                        </p>
                        <div className={styles.ctaButtons}>
                            <Link href="/test-series" className={styles.primaryBtn}>
                                Explore Test Series
                                <ArrowRight size={20} />
                            </Link>
                            <Link href="/subjects" className={styles.secondaryBtn}>
                                View Syllabus
                            </Link>
                        </div>
                    </div>
                </div>

            </section>
        </div>
    );
}
