'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { ArrowLeft, Clock, Calendar, Eye, Share2 } from 'lucide-react';
import { db } from '@/lib/firebase';
import { doc, getDoc, updateDoc, increment } from 'firebase/firestore';
import { Content } from '@/lib/firestore-schema';
import styles from './ContentPage.module.css';

export default function ContentReadPage() {
    const params = useParams();
    const id = params.id as string;

    const [contentData, setContentData] = useState<Content | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchContent = async () => {
            if (!id) return;
            try {
                const docRef = doc(db, 'content', id);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    setContentData({ id: docSnap.id, ...docSnap.data() } as Content);

                    // Increment view count
                    await updateDoc(docRef, {
                        views: increment(1)
                    });
                }
            } catch (error) {
                console.error("Error fetching content:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchContent();
    }, [id]);

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

    if (!contentData) {
        return (
            <div className={`container ${styles.notFound}`}>
                <div style={{ padding: '4rem 2rem', textAlign: 'center' }}>
                    <h2>Content Not Found</h2>
                    <p style={{ color: '#64748b', marginBottom: '2rem' }}>The article or resource you are looking for does not exist.</p>
                    <Link href="/" className={styles.backButton}>
                        <ArrowLeft size={16} /> Back to Home
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.pageContainer}>
            <div className={styles.hero}>
                <div className="container">
                    <button onClick={() => window.history.back()} className={styles.backLink}>
                        <ArrowLeft size={16} /> Back
                    </button>

                    <div className={styles.headerContent}>
                        <div className={styles.badges}>
                            <span className={styles.subjectBadge}>{contentData.subjectName}</span>
                            {contentData.topicName && (
                                <span className={styles.topicBadge}>{contentData.topicName}</span>
                            )}
                            <span className={styles.typeBadge} style={{ textTransform: 'capitalize' }}>
                                {contentData.contentType}
                            </span>
                        </div>

                        <h1 className={styles.title}>{contentData.title}</h1>

                        {contentData.description && (
                            <p className={styles.subtitle}>{contentData.description}</p>
                        )}

                        <div className={styles.meta}>
                            <div className={styles.metaItem}>
                                <Calendar size={16} />
                                <span>{contentData.createdAt ? new Date(contentData.createdAt.toMillis()).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'Recently Added'}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container">
                <div className={styles.contentLayout}>
                    <div className={styles.mainContent}>
                        {contentData.contentType === 'article' || contentData.contentType === 'notes' ? (
                            <div
                                className={styles.richTextContainer}
                                dangerouslySetInnerHTML={{ __html: contentData.content || '<p>No content provided.</p>' }}
                            />
                        ) : (
                            <div className={styles.fileContainer}>
                                <div className={styles.fileIcon}>📄</div>
                                <h3>{contentData.title}</h3>
                                <p>This is a {contentData.contentType} file.</p>
                                {contentData.fileUrl ? (
                                    <a href={contentData.fileUrl} target="_blank" rel="noopener noreferrer" className={styles.primaryButton}>
                                        Open {contentData.contentType}
                                    </a>
                                ) : (
                                    <p style={{ color: '#ef4444' }}>File URL is missing.</p>
                                )}
                            </div>
                        )}
                    </div>

                    <div className={styles.sidebar}>
                        <div className={styles.sidebarWidget}>
                            <h3>Share this {contentData.contentType}</h3>
                            <button
                                className={styles.shareButton}
                                onClick={() => {
                                    navigator.clipboard.writeText(window.location.href);
                                    alert('Link copied to clipboard!');
                                }}
                            >
                                <Share2 size={16} /> Copy Link
                            </button>
                        </div>

                        <div className={styles.sidebarWidget}>
                            <h3>About this Content</h3>
                            <ul className={styles.infoList}>
                                <li>
                                    <span className={styles.infoLabel}>Subject:</span>
                                    <span className={styles.infoValue}>{contentData.subjectName}</span>
                                </li>
                                {contentData.topicName && (
                                    <li>
                                        <span className={styles.infoLabel}>Topic:</span>
                                        <span className={styles.infoValue}>{contentData.topicName}</span>
                                    </li>
                                )}
                                <li>
                                    <span className={styles.infoLabel}>Access:</span>
                                    <span className={styles.infoValue}>{contentData.isFree ? 'Free for all' : 'Premium'}</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
