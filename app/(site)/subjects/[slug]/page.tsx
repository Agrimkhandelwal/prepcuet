'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { ArrowLeft, BookOpen, Clock, Calendar, FileText, ChevronRight, LayoutDashboard, Bookmark, TrendingUp } from 'lucide-react';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { SubjectDoc, Content } from '@/lib/firestore-schema';
import styles from './SubjectPage.module.css';

const generateSlug = (name: string) => name.toLowerCase().replace(/\s+/g, '-');

export default function SubjectPage() {
    const params = useParams();
    const { slug } = params;

    const [subject, setSubject] = useState<SubjectDoc | null>(null);
    const [contents, setContents] = useState<Content[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'subjects'));
                const subjects = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                })) as SubjectDoc[];

                const foundSubject = subjects.find(s => generateSlug(s.name) === slug);
                setSubject(foundSubject || null);

                if (foundSubject) {
                    const q = query(
                        collection(db, 'content'),
                        where('subjectId', '==', foundSubject.id),
                        where('isPublished', '==', true)
                    );
                    const contentSnapshot = await getDocs(q);
                    const contentsData = contentSnapshot.docs.map(doc => ({
                        id: doc.id,
                        ...doc.data()
                    })) as Content[];

                    contentsData.sort((a, b) => {
                        const timeA = a.createdAt ? a.createdAt.toMillis() : 0;
                        const timeB = b.createdAt ? b.createdAt.toMillis() : 0;
                        return timeB - timeA;
                    });

                    setContents(contentsData);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        if (slug) {
            fetchData();
        }
    }, [slug]);

    if (loading) {
        return (
            <div className={`container ${styles.notFound}`} style={{ minHeight: '50vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{
                    width: '40px',
                    height: '40px',
                    border: '3px solid #e2e8f0',
                    borderTopColor: '#ef4444',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                }} />
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
        );
    }

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
                        <h1 className={styles.title}>{subject.name}</h1>
                        <p className={styles.subtitle}>
                            Explore our comprehensive collection of articles, notes, and resources for {subject.name}.
                        </p>
                        <div className={styles.stats}>
                            <span className={styles.statItem}>
                                <BookOpen size={16} /> {subject.articleCount || 0} Articles
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
                        <h2 className={styles.sectionTitle}>
                            <LayoutDashboard size={24} color="var(--primary)" />
                            Latest Content in {subject.name}
                        </h2>
                        <div className={styles.articleList}>
                            {/* Rendering articles from Firestore content collection */}
                            {contents.length > 0 ? (
                                contents.map((item) => (
                                    <div key={item.id} className={styles.articleCard}>
                                        <h3 className={styles.articleTitle}>{item.title}</h3>
                                        <p className={styles.articleExcerpt}>
                                            {item.description || `Explore our latest ${item.contentType} regarding ${item.title}. Essential for upcoming exams.`}
                                        </p>
                                        <div className={styles.articleMeta}>
                                            <span className={styles.date}>
                                                <Calendar size={14} /> {item.createdAt ? new Date(item.createdAt.toMillis()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recently Added'}
                                            </span>
                                            <Link href={`/content/${item.id}`} className={styles.readMore} style={{ textTransform: 'capitalize' }}>
                                                {item.contentType === 'article' || item.contentType === 'notes' ? 'Read' : 'View'} {item.contentType} &rarr;
                                            </Link>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div style={{ padding: '2rem', textAlign: 'center', background: '#f8fafc', borderRadius: '12px', border: '1px dashed #cbd5e1' }}>
                                    <p style={{ color: '#64748b', margin: 0 }}>No content published yet for this subject.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className={styles.sidebar}>
                        <div className={styles.sidebarWidget}>
                            <h3>Quick Links</h3>
                            <ul className={styles.widgetList}>
                                <li>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <BookOpen size={16} /> Syllabus & Curriculum
                                    </span>
                                    <ChevronRight size={16} />
                                </li>
                                <li>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <TrendingUp size={16} /> Previous Year Questions
                                    </span>
                                    <ChevronRight size={16} />
                                </li>
                                <li>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <FileText size={16} /> Toppers' Notes
                                    </span>
                                    <ChevronRight size={16} />
                                </li>
                                <li>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <Bookmark size={16} /> Recommended Books
                                    </span>
                                    <ChevronRight size={16} />
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
