import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Calendar, Tag, Download, ChevronLeft, Share2 } from 'lucide-react';
import { LATEST_POSTS } from '@/lib/data';
import Sidebar from '@/components/Sidebar';
import styles from './Article.module.css';

export default function ArticlePage({ params }: { params: { slug: string } }) {
    // In a real app, fetch by slug. Here we mock finding by ID (assuming slug is id)
    const post = LATEST_POSTS.find(p => p.id.toString() === params.slug);

    if (!post) {
        return notFound();
    }

    return (
        <div className="container" style={{ padding: '2rem 1rem' }}>
            <div className={styles.layout}>
                <article className={styles.mainContent}>
                    <div className={styles.breadcrumb}>
                        <Link href="/">Home</Link> / <span>{post.category}</span>
                    </div>

                    <header className={styles.header}>
                        <div className={styles.meta}>
                            <span className={styles.category}>{post.category}</span>
                            <span className={styles.date}><Calendar size={14} /> {post.date}</span>
                        </div>
                        <h1 className={styles.title}>{post.title}</h1>
                        <p className={styles.summary}>{post.summary}</p>

                        <div className={styles.actions}>
                            <button className={styles.actionBtn}>
                                <Download size={16} /> Download PDF
                            </button>
                            <button className={styles.actionBtn}>
                                <Share2 size={16} /> Share
                            </button>
                        </div>
                    </header>

                    <div className={styles.contentBody}>
                        <p>
                            <strong>Context:</strong> This is a detailed analysis of the topic. In a real application, this would be the full HTML content of the article fetched from a CMS.
                        </p>
                        <h3>Key Highlights</h3>
                        <p>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                        </p>
                        <ul>
                            <li>Point one about the topic.</li>
                            <li>Point two about the impact on policy.</li>
                            <li>Point three regarding future outlook.</li>
                        </ul>
                        <h3>Analysis</h3>
                        <p>
                            Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                        </p>
                        <div className={styles.note}>
                            <strong>Note:</strong> This topic is relevant for GS Paper 2 (Governance) and GS Paper 3 (Environment).
                        </div>
                    </div>

                    <div className={styles.tagsSection}>
                        {post.tags.map(tag => (
                            <span key={tag} className={styles.tag}>#{tag}</span>
                        ))}
                    </div>
                </article>

                <div className={styles.sidebarWrapper}>
                    <Sidebar />
                </div>
            </div>
        </div>
    );
}

// Generate static params for mock data
export async function generateStaticParams() {
    return LATEST_POSTS.map((post) => ({
        slug: post.id.toString(),
    }));
}
