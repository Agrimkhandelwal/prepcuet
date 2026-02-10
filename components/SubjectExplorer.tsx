'use client';

import Link from 'next/link';
import * as Icons from 'lucide-react';
import { SUBJECTS_DATA } from '@/lib/data';
import styles from './SubjectExplorer.module.css';

// Dynamic Icon Component
const DynamicIcon = ({ name }: { name: string }) => {
    // @ts-ignore
    const IconComponent = Icons[name];
    return IconComponent ? <IconComponent size={24} /> : <Icons.BookOpen size={24} />;
};

export default function SubjectExplorer() {
    return (
        <section className={styles.subjectExplorer}>
            <div className="container">
                <div className={styles.header}>
                    <h2 className={styles.heading}>Explore Subject Wise Articles</h2>
                    <p className={styles.subheading}>Deep dive into specific subjects with our curated content.</p>
                </div>

                <div className={styles.grid}>
                    {SUBJECTS_DATA.map((subject) => (
                        <Link href={`/subjects/${subject.slug}`} key={subject.slug} className={styles.card}>
                            <div className={styles.cardHeader}>
                                <div className={styles.iconWrapper}>
                                    <DynamicIcon name={subject.icon} />
                                </div>
                                {subject.new > 0 && (
                                    <span className={styles.badge}>{subject.new} New Articles</span>
                                )}
                            </div>

                            <h3 className={styles.subjectTitle}>{subject.title}</h3>
                            <p className={styles.articleCount}>{subject.count} Articles</p>

                            <div className={styles.articlesList}>
                                <span className={styles.articleLabel}>Latest Articles</span>
                                {subject.articles.map((article, index) => (
                                    <div key={index} className={styles.articleItem}>
                                        <div className={styles.bullet}></div>
                                        <span>{article}</span>
                                    </div>
                                ))}
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
