'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Plus, Edit2, Trash2, Search, Filter, Eye, Clock, ToggleLeft, ToggleRight } from 'lucide-react';
import styles from '../Admin.module.css';

interface Article {
    id: number;
    title: string;
    summary: string;
    category: string;
    tags: string[];
    status: 'Published' | 'Draft';
    date: string;
    views: number;
}

const CATEGORIES = ['All', 'Current Affairs', 'Editorials', 'Strategy', 'Quiz', 'CUET Practice'];

const INITIAL_ARTICLES: Article[] = [
    { id: 1, title: 'Daily Current Affairs – 30th January 2026', summary: 'Analysis of important news for CUET preparation.', category: 'Current Affairs', tags: ['GS', 'Polity'], status: 'Published', date: 'Jan 30, 2026', views: 245 },
    { id: 2, title: 'Editorial Analysis: Budget 2026 Highlights', summary: 'Key takeaways from Union Budget 2026.', category: 'Editorials', tags: ['Economics'], status: 'Published', date: 'Jan 30, 2026', views: 189 },
    { id: 3, title: 'CUET Mock Test: English Section', summary: 'Practice test for English language section.', category: 'Quiz', tags: ['English', 'Practice'], status: 'Draft', date: 'Jan 29, 2026', views: 0 },
    { id: 4, title: 'Mathematics: Algebra Tricks for CUET', summary: 'Quick tips and shortcuts for algebra.', category: 'Strategy', tags: ['Maths', 'Tips'], status: 'Published', date: 'Jan 28, 2026', views: 312 },
    { id: 5, title: 'General Aptitude Practice Questions', summary: 'Daily practice questions for aptitude.', category: 'CUET Practice', tags: ['Aptitude'], status: 'Published', date: 'Jan 27, 2026', views: 156 },
];

export default function PostsPage() {
    const [articles, setArticles] = useState<Article[]>(INITIAL_ARTICLES);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingArticle, setEditingArticle] = useState<Article | null>(null);
    const [formData, setFormData] = useState({
        title: '',
        summary: '',
        category: 'Current Affairs',
        tags: '',
        status: 'Draft' as 'Published' | 'Draft'
    });

    const filteredArticles = articles.filter(article => {
        const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || article.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const openModal = (article?: Article) => {
        if (article) {
            setEditingArticle(article);
            setFormData({
                title: article.title,
                summary: article.summary,
                category: article.category,
                tags: article.tags.join(', '),
                status: article.status
            });
        } else {
            setEditingArticle(null);
            setFormData({
                title: '',
                summary: '',
                category: 'Current Affairs',
                tags: '',
                status: 'Draft'
            });
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingArticle(null);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const tagsArray = formData.tags.split(',').map(t => t.trim()).filter(t => t);

        if (editingArticle) {
            setArticles(articles.map(a =>
                a.id === editingArticle.id
                    ? { ...a, ...formData, tags: tagsArray }
                    : a
            ));
        } else {
            const newArticle: Article = {
                id: Date.now(),
                title: formData.title,
                summary: formData.summary,
                category: formData.category,
                tags: tagsArray,
                status: formData.status,
                date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                views: 0
            };
            setArticles([newArticle, ...articles]);
        }
        closeModal();
    };

    const deleteArticle = (id: number) => {
        if (confirm('Are you sure you want to delete this article?')) {
            setArticles(articles.filter(a => a.id !== id));
        }
    };

    const toggleStatus = (id: number) => {
        setArticles(articles.map(a =>
            a.id === id ? { ...a, status: a.status === 'Published' ? 'Draft' : 'Published' } : a
        ));
    };

    return (
        <div>
            <div className={styles.pageHeader}>
                <div>
                    <h1 className={styles.pageTitle}>Articles & Posts</h1>
                    <p className={styles.pageSubtitle}>Manage all your content in one place</p>
                </div>
                <button className={styles.primaryBtn} onClick={() => openModal()}>
                    <Plus size={18} /> New Article
                </button>
            </div>

            {/* Filters */}
            <div style={{
                display: 'flex',
                gap: '1rem',
                marginBottom: '1.5rem',
                flexWrap: 'wrap',
                alignItems: 'center'
            }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    background: 'white',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    padding: '0.5rem 1rem',
                    flex: '1',
                    maxWidth: '400px'
                }}>
                    <Search size={18} style={{ color: '#64748b', marginRight: '0.5rem' }} />
                    <input
                        type="text"
                        placeholder="Search articles..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{
                            border: 'none',
                            outline: 'none',
                            width: '100%',
                            fontSize: '0.9rem'
                        }}
                    />
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {CATEGORIES.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            style={{
                                padding: '0.5rem 1rem',
                                borderRadius: '6px',
                                border: '1px solid',
                                borderColor: selectedCategory === cat ? '#b91c1c' : '#e2e8f0',
                                background: selectedCategory === cat ? '#fef2f2' : 'white',
                                color: selectedCategory === cat ? '#b91c1c' : '#64748b',
                                cursor: 'pointer',
                                fontSize: '0.85rem',
                                fontWeight: 500
                            }}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* Articles Table */}
            <div className={styles.recentSection}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Category</th>
                            <th>Status</th>
                            <th>Date</th>
                            <th>Views</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredArticles.map((article) => (
                            <tr key={article.id}>
                                <td>
                                    <div style={{ fontWeight: 500 }}>{article.title}</div>
                                    <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.25rem' }}>
                                        {article.tags.map(tag => (
                                            <span key={tag} style={{ marginRight: '0.5rem' }}>#{tag}</span>
                                        ))}
                                    </div>
                                </td>
                                <td>
                                    <span className={`${styles.badge} ${styles.badgeInfo}`}>{article.category}</span>
                                </td>
                                <td>
                                    <button
                                        onClick={() => toggleStatus(article.id)}
                                        style={{
                                            background: 'none',
                                            border: 'none',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.25rem'
                                        }}
                                    >
                                        <span className={`${styles.badge} ${article.status === 'Published' ? styles.badgeSuccess : styles.badgeWarning}`}>
                                            {article.status}
                                        </span>
                                    </button>
                                </td>
                                <td style={{ color: '#64748b', fontSize: '0.85rem' }}>
                                    <Clock size={14} style={{ marginRight: '0.25rem' }} />
                                    {article.date}
                                </td>
                                <td style={{ color: '#64748b', fontSize: '0.85rem' }}>
                                    <Eye size={14} style={{ marginRight: '0.25rem' }} />
                                    {article.views}
                                </td>
                                <td>
                                    <div className={styles.actionBtns}>
                                        <button className={styles.editBtn} onClick={() => openModal(article)}>
                                            <Edit2 size={14} /> Edit
                                        </button>
                                        <button className={styles.deleteBtn} onClick={() => deleteArticle(article.id)}>
                                            <Trash2 size={14} /> Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filteredArticles.length === 0 && (
                    <div className={styles.emptyState}>
                        <Search size={48} />
                        <h3>No articles found</h3>
                        <p>Try adjusting your search or filter</p>
                    </div>
                )}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div style={{
                    position: 'fixed',
                    inset: 0,
                    background: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000,
                    padding: '2rem'
                }}>
                    <div style={{
                        background: 'white',
                        borderRadius: '16px',
                        width: '100%',
                        maxWidth: '600px',
                        maxHeight: '90vh',
                        overflow: 'auto'
                    }}>
                        <div style={{ padding: '1.5rem', borderBottom: '1px solid #e2e8f0' }}>
                            <h2 style={{ margin: 0, color: '#1e293b' }}>
                                {editingArticle ? 'Edit Article' : 'Create New Article'}
                            </h2>
                        </div>
                        <form onSubmit={handleSubmit} style={{ padding: '1.5rem' }}>
                            <div className={styles.formGroup}>
                                <label className={styles.formLabel}>Title *</label>
                                <input
                                    type="text"
                                    className={styles.formInput}
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    placeholder="Article title"
                                    required
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label className={styles.formLabel}>Summary *</label>
                                <textarea
                                    className={styles.formTextarea}
                                    value={formData.summary}
                                    onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                                    placeholder="Brief summary of the article"
                                    required
                                />
                            </div>
                            <div className={styles.formRow}>
                                <div className={styles.formGroup}>
                                    <label className={styles.formLabel}>Category *</label>
                                    <select
                                        className={styles.formSelect}
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    >
                                        {CATEGORIES.slice(1).map(cat => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className={styles.formGroup}>
                                    <label className={styles.formLabel}>Status *</label>
                                    <select
                                        className={styles.formSelect}
                                        value={formData.status}
                                        onChange={(e) => setFormData({ ...formData, status: e.target.value as 'Published' | 'Draft' })}
                                    >
                                        <option value="Draft">Draft</option>
                                        <option value="Published">Published</option>
                                    </select>
                                </div>
                            </div>
                            <div className={styles.formGroup}>
                                <label className={styles.formLabel}>Tags (comma separated)</label>
                                <input
                                    type="text"
                                    className={styles.formInput}
                                    value={formData.tags}
                                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                                    placeholder="e.g., Polity, GS-2, Current Affairs"
                                />
                            </div>
                            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                                <button type="button" className={styles.secondaryBtn} onClick={closeModal}>
                                    Cancel
                                </button>
                                <button type="submit" className={styles.primaryBtn}>
                                    {editingArticle ? 'Update Article' : 'Create Article'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
