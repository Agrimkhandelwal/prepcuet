'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Calendar, Tag, ArrowRight } from 'lucide-react';
import { LATEST_POSTS } from '@/lib/data';
import styles from './ContentFeed.module.css';

const TABS = ['All Updates', 'Current Affairs', 'Editorials', 'Strategy'];

export default function ContentFeed() {
    const [activeTab, setActiveTab] = useState('All Updates');

    const filteredPosts = activeTab === 'All Updates'
        ? LATEST_POSTS
        : LATEST_POSTS.filter(post => post.category === activeTab);

    return (
        <div className={styles.feed}>
            <div className={styles.header}>
                <h2 className={styles.heading}>Latest Updates</h2>
                <div className={styles.tabs}>
                    {TABS.map(tab => (
                        <button
                            key={tab}
                            className={`${styles.tab} ${activeTab === tab ? styles.activeTab : ''}`}
                            onClick={() => setActiveTab(tab)}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </div>

            <div className={styles.grid}>
                {filteredPosts.map((post) => (
                    <article key={post.id} className={styles.card}>
                        <div className={styles.cardHeader}>
                            <span className={styles.category}>{post.category}</span>
                            {post.isNew && <span className={styles.newBadge}>NEW</span>}
                        </div>
                        <h3 className={styles.postTitle}>
                            <Link href={`/articles/${post.id}`}>{post.title}</Link>
                        </h3>
                        <p className={styles.summary}>{post.summary}</p>
                        <div className={styles.meta}>
                            <div className={styles.metaItem}>
                                <Calendar size={14} /> {post.date}
                            </div>
                            <div className={styles.tags}>
                                {post.tags.map(tag => (
                                    <span key={tag} className={styles.tag}>#{tag}</span>
                                ))}
                            </div>
                        </div>
                    </article>
                ))}
            </div>

            <div className={styles.footer}>
                <Link href="/archives" className={styles.viewMore}>
                    View All Updates <ArrowRight size={16} />
                </Link>
            </div>
        </div>
    );
}
