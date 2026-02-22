'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Filter, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import styles from './PostListing.module.css';

const CATEGORIES = ['All', 'Current Affairs', 'Editorials', 'Strategy', 'Quiz', 'CUET Practice'];

interface Post {
    id: string;
    title: string;
    summary: string;
    category: string;
    tags: string[];
    date: string;
    views: number;
}

export default function PostListing({ title }: { title: string }) {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('All');
    const [search, setSearch] = useState('');

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                setLoading(true);
                const q = query(
                    collection(db, 'articles'),
                    where('status', '==', 'Published'),
                    orderBy('createdAt', 'desc')
                );
                const snap = await getDocs(q);
                const data = snap.docs.map(d => ({
                    id: d.id,
                    ...d.data(),
                    date: d.data().createdAt
                        ? new Date(d.data().createdAt.toDate()).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
                        : '',
                })) as Post[];
                setPosts(data);
            } catch (err) {
                console.error('Error fetching articles:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchPosts();
    }, []);

    const filtered = posts.filter(post => {
        const matchesCategory = filter === 'All' || post.category === filter;
        const matchesSearch = post.title.toLowerCase().includes(search.toLowerCase())
            || post.summary.toLowerCase().includes(search.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1 className={styles.pageTitle}>{title}</h1>
                <div className={styles.controls}>
                    <div className={styles.searchBox}>
                        <Search size={18} className={styles.searchIcon} />
                        <input
                            type="text"
                            placeholder="Search topics..."
                            className={styles.searchInput}
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <div className={styles.filterBox}>
                        <Filter size={16} />
                        <select className={styles.filterSelect} value={filter} onChange={(e) => setFilter(e.target.value)}>
                            {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                        </select>
                    </div>
                </div>
            </header>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '4rem', color: '#64748b' }}>
                    <Loader2 size={32} style={{ animation: 'spin 1s linear infinite', margin: '0 auto 1rem', display: 'block' }} />
                    <p>Loading articles...</p>
                    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                </div>
            ) : (
                <div className={styles.grid}>
                    {filtered.map(post => (
                        <div key={post.id} className={styles.card}>
                            <div className={styles.cardContent}>
                                <div className={styles.meta}>
                                    <span className={styles.catBadge}>{post.category}</span>
                                    <span className={styles.date}>{post.date}</span>
                                </div>
                                <h2 className={styles.cardTitle}>
                                    <Link href={`/articles/${post.id}`}>{post.title}</Link>
                                </h2>
                                <p className={styles.excerpt}>{post.summary}</p>
                                <div className={styles.tags}>
                                    {post.tags?.map(tag => (
                                        <span key={tag} className={styles.tag}>#{tag}</span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                    {filtered.length === 0 && (
                        <div className={styles.emptyState}>
                            {search || filter !== 'All'
                                ? 'No articles found matching your criteria.'
                                : 'No articles published yet. Check back soon!'}
                        </div>
                    )}
                </div>
            )}

            {/* Pagination placeholder */}
            {filtered.length > 10 && (
                <div className={styles.pagination}>
                    <button disabled className={styles.pageBtn}><ChevronLeft size={16} /></button>
                    <button className={`${styles.pageBtn} ${styles.active}`}>1</button>
                    <button className={styles.pageBtn}><ChevronRight size={16} /></button>
                </div>
            )}
        </div>
    );
}
