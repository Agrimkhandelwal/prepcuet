'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { doc, getDoc, updateDoc, increment } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Link from 'next/link';
import { Calendar, Tag, ChevronLeft, Share2, Eye, Loader2 } from 'lucide-react';
import Sidebar from '@/components/Sidebar';
import styles from './Article.module.css';

interface Article {
    id: string;
    title: string;
    summary: string;
    content: string;
    category: string;
    tags: string[];
    status: string;
    date: string;
    views: number;
}

export default function ArticlePage() {
    const { slug } = useParams<{ slug: string }>();
    const [article, setArticle] = useState<Article | null>(null);
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);

    useEffect(() => {
        if (!slug) return;
        const fetchArticle = async () => {
            try {
                const ref = doc(db, 'articles', slug as string);
                const snap = await getDoc(ref);

                if (!snap.exists() || snap.data()?.status !== 'Published') {
                    setNotFound(true);
                    return;
                }

                const data = snap.data();
                setArticle({
                    id: snap.id,
                    ...data,
                    date: data.createdAt
                        ? new Date(data.createdAt.toDate()).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
                        : '',
                } as Article);

                // Increment view count
                updateDoc(ref, { views: increment(1) }).catch(() => { });
            } catch (err) {
                console.error('Error fetching article:', err);
                setNotFound(true);
            } finally {
                setLoading(false);
            }
        };
        fetchArticle();
    }, [slug]);

    if (loading) {
        return (
            <div className="container" style={{ padding: '4rem 1rem', textAlign: 'center', color: '#64748b' }}>
                <Loader2 size={36} style={{ animation: 'spin 1s linear infinite', margin: '0 auto 1rem', display: 'block' }} />
                <p>Loading article...</p>
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
        );
    }

    if (notFound || !article) {
        return (
            <div className="container" style={{ padding: '4rem 1rem', textAlign: 'center' }}>
                <h2 style={{ color: '#1e293b' }}>Article not found</h2>
                <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>This article may not be published yet or doesn't exist.</p>
                <Link href="/current-affairs" style={{ color: '#b91c1c', fontWeight: 600 }}>← Back to Current Affairs</Link>
            </div>
        );
    }

    return (
        <div className="container" style={{ padding: '2rem 1rem' }}>
            <div className={styles.layout}>
                <article className={styles.mainContent}>
                    {/* Breadcrumb */}
                    <div className={styles.breadcrumb}>
                        <Link href="/">Home</Link> / <Link href="/current-affairs">Current Affairs</Link> / <span>{article.category}</span>
                    </div>

                    {/* Header */}
                    <header className={styles.header}>
                        <div className={styles.meta}>
                            <span className={styles.category}>{article.category}</span>
                            <span className={styles.date}><Calendar size={14} /> {article.date}</span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#94a3b8', fontSize: '0.875rem' }}>
                                <Eye size={14} /> {article.views} views
                            </span>
                        </div>
                        <h1 className={styles.title}>{article.title}</h1>
                        <p className={styles.summary}>{article.summary}</p>

                        <div className={styles.actions}>
                            <button className={styles.actionBtn} onClick={() => navigator.share?.({ title: article.title, url: window.location.href })}>
                                <Share2 size={16} /> Share
                            </button>
                        </div>
                    </header>

                    {/* Content Body */}
                    <div className={styles.contentBody}>
                        {article.content ? (
                            <div dangerouslySetInnerHTML={{ __html: article.content }} />
                        ) : (
                            <p style={{ color: '#94a3b8', fontStyle: 'italic' }}>Full article content not available.</p>
                        )}
                    </div>

                    {/* Tags */}
                    {article.tags?.length > 0 && (
                        <div className={styles.tagsSection}>
                            {article.tags.map(tag => (
                                <span key={tag} className={styles.tag}>#{tag}</span>
                            ))}
                        </div>
                    )}

                    <div style={{ marginTop: '2rem' }}>
                        <Link href="/current-affairs" style={{ color: '#b91c1c', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                            <ChevronLeft size={16} /> More Current Affairs
                        </Link>
                    </div>
                </article>

                <div className={styles.sidebarWrapper}>
                    <Sidebar />
                </div>
            </div>
        </div>
    );
}
