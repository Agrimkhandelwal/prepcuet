'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, BookOpen, Clock, Calendar } from 'lucide-react';
import { SUBJECTS_DATA } from '@/lib/data';
import styles from './SubjectPage.module.css';

export default function SubjectPage() {
    const params = useParams();
    const { slug } = params;

    const subject = SUBJECTS_DATA.find((s) => s.slug === slug);

    if (!subject) {
        return (
            <div className={`container ${styles.notFound}`}>
                <h2>Subject Not Found</h2>
                <Link href="/" className={styles.backLink}>
                    <ArrowLeft size={16} /> Back to Home
                </Link>
            </div>
        );
    }

    return (
        <div className={styles.pageContainer}>
            <div className={styles.hero}>
                <div className="container">
                    <Link href="/" className={styles.backLink}>
                        <ArrowLeft size={16} /> Back to Home
                    </Link>
                    <div className={styles.headerContent}>
                        <h1 className={styles.title}>{subject.title}</h1>
                        <p className={styles.subtitle}>
                            Explore our comprehensive collection of articles, notes, and resources for {subject.title}.
                        </p>
                        <div className={styles.stats}>
                            <span className={styles.statItem}>
                                <BookOpen size={16} /> {subject.count} Articles
                            </span>
                            <span className={styles.statItem}>
                                <Clock size={16} /> Updated Today
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container">
                <div className={styles.contentGrid}>
                    <div className={styles.mainColumn}>
                        <h2 className={styles.sectionTitle}>Latest Articles in {subject.title}</h2>
                        <div className={styles.articleList}>
                            {/* Mocking full article list based on the snippet data for now */}
                            {subject.articles.map((article, idx) => (
                                <div key={idx} className={styles.articleCard}>
                                    <h3 className={styles.articleTitle}>{article}</h3>
                                    <p className={styles.articleExcerpt}>
                                        Detailed analysis and study notes on {article}. Essential for upcoming exams.
                                    </p>
                                    <div className={styles.articleMeta}>
                                        <span className={styles.date}>
                                            <Calendar size={14} /> Jan {25 - idx}, 2026
                                        </span>
                                        <span className={styles.readMore}>Read Article &rarr;</span>
                                    </div>
                                </div>
                            ))}
                            {/* Filler content to make the page look populated */}
                            {[1, 2, 3].map((i) => (
                                <div key={`fill-${i}`} className={styles.articleCard}>
                                    <h3 className={styles.articleTitle}>Topic {i}: Advanced Concepts</h3>
                                    <p className={styles.articleExcerpt}>
                                        In-depth exploration of advanced {subject.title} concepts suitable for CUET exam preparation.
                                    </p>
                                    <div className={styles.articleMeta}>
                                        <span className={styles.date}>
                                            <Calendar size={14} /> Jan {20 - i}, 2026
                                        </span>
                                        <span className={styles.readMore}>Read Article &rarr;</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className={styles.sidebar}>
                        <div className={styles.sidebarWidget}>
                            <h3>Quick Links</h3>
                            <ul className={styles.widgetList}>
                                <li>Syllabus & Curriculum</li>
                                <li>Previous Year Questions</li>
                                <li>Toppers' Notes</li>
                                <li>Recommended Books</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
