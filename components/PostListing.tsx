'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Search, Filter, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { LATEST_POSTS } from '@/lib/data';
import styles from './PostListing.module.css';

const CATEGORIES = ['All', 'Polity', 'Economy', 'Environment', 'International Relations', 'Science & Tech'];

export default function PostListing({ title }: { title: string }) {
    const [filter, setFilter] = useState('All');
    const [search, setSearch] = useState('');

    // Mock filtering
    const filtered = LATEST_POSTS.filter(post => {
        const matchesCategory = filter === 'All' || post.tags.includes(filter) || post.category === filter; // loose matching for demo
        const matchesSearch = post.title.toLowerCase().includes(search.toLowerCase());
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
                        <select
                            className={styles.filterSelect}
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                        >
                            {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                        </select>
                    </div>
                </div>
            </header>

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
                                {post.tags.map(tag => (
                                    <span key={tag} className={styles.tag}>#{tag}</span>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
                {filtered.length === 0 && (
                    <div className={styles.emptyState}>No posts found matching criteria.</div>
                )}
            </div>

            {/* Pagination UI */}
            <div className={styles.pagination}>
                <button disabled className={styles.pageBtn}><ChevronLeft size={16} /></button>
                <button className={`${styles.pageBtn} ${styles.active}`}>1</button>
                <button className={styles.pageBtn}>2</button>
                <button className={styles.pageBtn}>3</button>
                <span className={styles.ellipsis}>...</span>
                <button className={styles.pageBtn}>10</button>
                <button className={styles.pageBtn}><ChevronRight size={16} /></button>
            </div>
        </div>
    );
}
