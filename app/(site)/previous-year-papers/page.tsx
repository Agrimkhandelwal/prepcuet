'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { FileText, Download, Calendar, Clock, BookOpen, Calculator, FlaskConical, Globe, LineChart, MessageSquare } from 'lucide-react';
import styles from './Papers.module.css';
import { SUBJECTS, SUBJECT_CATEGORIES } from '@/lib/constants/subjects';
import { PastPaper } from '@/lib/firestore-schema';

type CategoryKey = keyof typeof SUBJECT_CATEGORIES;

const categoryDetails: Record<CategoryKey, { title: string, icon: React.ReactNode }> = {
    languages: { title: 'Languages', icon: <MessageSquare size={24} /> },
    sciences: { title: 'Sciences', icon: <FlaskConical size={24} /> },
    mathematics: { title: 'Mathematics', icon: <Calculator size={24} /> },
    socialSciences: { title: 'Social Sciences', icon: <Globe size={24} /> },
    commerce: { title: 'Commerce', icon: <LineChart size={24} /> },
    general: { title: 'General Test', icon: <BookOpen size={24} /> }
};

export default function PreviousYearPapersPage() {
    const [activeYear, setActiveYear] = useState<number>(new Date().getFullYear());
    const [papers, setPapers] = useState<PastPaper[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPapers = async () => {
            try {
                const q = query(collection(db, 'previousYearPapers'), orderBy('year', 'desc'));
                const querySnapshot = await getDocs(q);
                const dbData = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                })) as PastPaper[];

                setPapers(dbData);

                // Switch to the latest year available if any exist
                if (dbData.length > 0) {
                    const uniqueYears = Array.from(new Set(dbData.map(p => p.year)));
                    setActiveYear(Math.max(...uniqueYears));
                }
            } catch (error) {
                console.error("Error fetching past papers:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPapers();
    }, []);

    // Group papers by year
    const papersByYear = papers.reduce((acc, paper) => {
        if (!acc[paper.year]) {
            acc[paper.year] = [];
        }
        acc[paper.year].push(paper);
        return acc;
    }, {} as Record<number, PastPaper[]>);

    // Sort years descending
    const years = Object.keys(papersByYear).map(Number).sort((a, b) => b - a);

    const activePapers = papersByYear[activeYear] || [];

    // Group active year papers by category
    const papersByCategory = (Object.keys(SUBJECT_CATEGORIES) as CategoryKey[]).reduce((acc, categoryKey) => {
        const subjectsInCategory = SUBJECT_CATEGORIES[categoryKey];
        acc[categoryKey] = activePapers.filter(p => (subjectsInCategory as readonly string[]).includes(p.subject));
        return acc;
    }, {} as Record<CategoryKey, PastPaper[]>);

    return (
        <div className={styles.page}>
            {/* Hero Section */}
            <section className={styles.hero}>
                <span className={styles.tagline}>Official Papers</span>
                <h1 className={styles.title}>Previous Year Papers</h1>
                <p className={styles.subtitle}>
                    Download actual CUET (UG) question papers from past years to understand the NTA exam pattern and difficulty level.
                </p>

                {/* Year Tabs */}
                {!loading && years.length > 0 && (
                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '3rem', flexWrap: 'wrap' }}>
                        {years.map(year => (
                            <button
                                key={year}
                                onClick={() => setActiveYear(year)}
                                style={{
                                    padding: '0.75rem 2rem',
                                    borderRadius: '50px',
                                    fontSize: '1.125rem',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    transition: 'all 0.3s',
                                    border: activeYear === year ? '1px solid rgba(16, 185, 129, 0.5)' : '1px solid rgba(255, 255, 255, 0.1)',
                                    background: activeYear === year ? 'rgba(16, 185, 129, 0.15)' : 'rgba(30, 41, 59, 0.5)',
                                    color: activeYear === year ? '#34d399' : '#94a3b8',
                                }}
                            >
                                {year} Papers
                            </button>
                        ))}
                    </div>
                )}
            </section>

            {/* Content Section */}
            <section className={styles.content}>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '4rem', color: '#94a3b8', fontSize: '1.25rem' }}>
                        Loading securely from database...
                    </div>
                ) : years.length === 0 ? (
                    <div style={{
                        textAlign: 'center',
                        padding: '6rem 2rem',
                        color: '#94a3b8',
                        fontSize: '1.15rem',
                        background: 'rgba(30, 41, 59, 0.3)',
                        border: '1px dashed rgba(255, 255, 255, 0.1)',
                        borderRadius: '16px',
                        maxWidth: '800px',
                        margin: '0 auto'
                    }}>
                        <div style={{
                            width: '64px',
                            height: '64px',
                            background: 'rgba(52, 211, 153, 0.1)',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 1.5rem',
                            color: '#34d399'
                        }}>
                            <FileText size={32} />
                        </div>
                        <h3 style={{ color: '#fff', fontSize: '1.5rem', marginBottom: '1rem', fontWeight: 600 }}>Curating the Best Resources</h3>
                        <p style={{ maxWidth: '500px', margin: '0 auto', lineHeight: 1.6 }}>
                            Our expert team is currently verifying and formatting the latest official NTA Past Papers. High-quality, original PDFs will be available here shortly.
                        </p>
                    </div>
                ) : (
                    (Object.keys(SUBJECT_CATEGORIES) as CategoryKey[]).map((categoryKey) => {
                        const category = categoryDetails[categoryKey];
                        const categoryPapers = papersByCategory[categoryKey];

                        if (!categoryPapers || categoryPapers.length === 0) return null;

                        return (
                            <div key={categoryKey} className={styles.yearSection}>
                                <h2 className={styles.yearTitle} style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '1.75rem' }}>
                                    <div style={{ color: '#34d399' }}>
                                        {category.icon}
                                    </div>
                                    {category.title}
                                </h2>

                                <div className={styles.papersGrid}>
                                    {categoryPapers.map((paper) => (
                                        <a
                                            href={paper.pdfUrl}
                                            key={paper.id}
                                            className={styles.paperCard}
                                            target="_blank"
                                            rel="noreferrer"
                                        >
                                            <div className={styles.cardHeader}>
                                                <div className={styles.iconWrapper}>
                                                    <FileText size={24} />
                                                </div>
                                                <Download size={24} className={styles.downloadIcon} />
                                            </div>

                                            <div className={styles.paperDetails}>
                                                <h3 className={styles.paperTitle}>{paper.subject}</h3>
                                                <div className={styles.paperMeta}>
                                                    <span className={styles.metaItem}>
                                                        <Calendar size={14} /> {paper.year}
                                                    </span>
                                                    <span className={styles.metaItem}>
                                                        <Clock size={14} /> {paper.duration}
                                                    </span>
                                                    <span className={styles.metaItem}>
                                                        <BookOpen size={14} /> {paper.questions} Qs
                                                    </span>
                                                </div>
                                            </div>

                                            <div className={styles.badge}>
                                                Download PDF
                                            </div>
                                        </a>
                                    ))}
                                </div>
                            </div>
                        );
                    })
                )}

            </section>
        </div>
    );
}
