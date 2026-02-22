'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import * as Icons from 'lucide-react';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, orderBy, where } from 'firebase/firestore';
import { SubjectDoc } from '@/lib/firestore-schema';
import styles from './SubjectExplorer.module.css';

// Dynamic Icon Component
const DynamicIcon = ({ name }: { name?: string }) => {
    if (!name) return <Icons.BookOpen size={24} />;
    // @ts-ignore
    const IconComponent = Icons[name];
    return IconComponent ? <IconComponent size={24} /> : <Icons.BookOpen size={24} />;
};

export default function SubjectExplorer() {
    const [subjects, setSubjects] = useState<SubjectDoc[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSubjects = async () => {
            try {
                // Fetch published subjects, order by creation or could add a sort order field later
                const q = query(
                    collection(db, 'subjects'),
                    where('isPublished', '==', true)
                );

                const querySnapshot = await getDocs(q);
                let data = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                })) as SubjectDoc[];

                // Fetch all published content to derive accurate article counts and latest preview articles
                const contentSnapshot = await getDocs(query(collection(db, 'content'), where('isPublished', '==', true)));
                const allContent = contentSnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...(doc.data() as any)
                }));

                data = data.map(subject => {
                    const subjectContent = allContent.filter(c => c.subjectId === subject.id);
                    subjectContent.sort((a: any, b: any) => {
                        const timeA = a.createdAt ? a.createdAt.toMillis() : 0;
                        const timeB = b.createdAt ? b.createdAt.toMillis() : 0;
                        return timeB - timeA;
                    });

                    return {
                        ...subject,
                        articleCount: subjectContent.length,
                        latestArticles: subjectContent.slice(0, 3).map(c => c.title)
                    };
                });

                // Sort by article count or simply alphabetically for now
                data.sort((a, b) => (b.articleCount || 0) - (a.articleCount || 0));

                setSubjects(data);
            } catch (error) {
                console.error("Error fetching subjects for explorer:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchSubjects();
    }, []);

    const generateSlug = (name: string) => name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    if (loading) {
        return (
            <section className={styles.subjectExplorer}>
                <div className="container">
                    <div className={styles.header}>
                        <h2 className={styles.heading}>Explore Subject Wise Articles</h2>
                        <p className={styles.subheading}>Deep dive into specific subjects with our curated content.</p>
                    </div>
                    <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
                        Loading subjects...
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className={styles.subjectExplorer}>
            <div className="container">
                <div className={styles.header}>
                    <h2 className={styles.heading}>Explore Subject Wise Articles</h2>
                    <p className={styles.subheading}>Deep dive into specific subjects with our curated content.</p>
                </div>

                <div className={styles.grid}>
                    {subjects.map((subject) => (
                        <Link href={`/subjects/${generateSlug(subject.name)}`} key={subject.id} className={styles.card}>
                            <div className={styles.cardHeader}>
                                <div className={styles.iconWrapper}>
                                    <DynamicIcon name={subject.icon} />
                                </div>
                                {subject.newArticleCount ? (
                                    <span className={styles.badge}>{subject.newArticleCount} New Articles</span>
                                ) : null}
                            </div>

                            <h3 className={styles.subjectTitle}>{subject.name}</h3>
                            <p className={styles.articleCount}>{subject.articleCount || 0} Articles</p>

                            <div className={styles.articlesList}>
                                <span className={styles.articleLabel}>Latest Articles</span>
                                {subject.latestArticles && subject.latestArticles.length > 0 ? (
                                    subject.latestArticles.map((article, index) => (
                                        <div key={index} className={styles.articleItem}>
                                            <div className={styles.bullet}></div>
                                            <span>{article}</span>
                                        </div>
                                    ))
                                ) : (
                                    <>
                                        {/* Mocking articles for subjects without any to keep UI consistent */}
                                        <div className={styles.articleItem}>
                                            <div className={styles.bullet}></div>
                                            <span>Introduction to {subject.name}</span>
                                        </div>
                                        <div className={styles.articleItem}>
                                            <div className={styles.bullet}></div>
                                            <span>Important Concepts & Strategy</span>
                                        </div>
                                        <div className={styles.articleItem}>
                                            <div className={styles.bullet}></div>
                                            <span>Previous Year Question Analysis</span>
                                        </div>
                                    </>
                                )}
                            </div>

                            <div className={styles.viewBtn}>
                                View All Articles &rarr;
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
