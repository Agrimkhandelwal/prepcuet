'use client';
import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Save } from 'lucide-react';
import styles from '../../Admin.module.css';

export default function CreatePost() {
    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        category: 'Current Affairs',
        content: '',
        status: 'Draft',
        scheduledDate: '',
        seoTitle: '',
        seoDesc: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div>
            <div style={{ marginBottom: '2rem' }}>
                <Link href="/admin/posts" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                    <ArrowLeft size={16} /> Back to Posts
                </Link>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h1 style={{ fontSize: '1.75rem' }}>Create New Post</h1>
                    <button className={styles.navItem} style={{ background: 'var(--primary)', color: 'white', fontWeight: 600 }}>
                        <Save size={18} /> Save Post
                    </button>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
                {/* Main Content Info */}
                <div className={styles.recentSection}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div>
                            <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem' }}>Title</label>
                            <input type="text" name="title" className={styles.searchInput} placeholder="Enter post title" value={formData.title} onChange={handleChange} />
                        </div>
                        <div>
                            <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem' }}>Slug</label>
                            <input type="text" name="slug" className={styles.searchInput} placeholder="post-url-slug" value={formData.slug} onChange={handleChange} />
                        </div>
                        <div>
                            <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem' }}>Content</label>
                            <textarea name="content" className={styles.searchInput} rows={15} placeholder="Write your content here..." style={{ resize: 'vertical' }} value={formData.content} onChange={handleChange}></textarea>
                        </div>
                    </div>
                </div>

                {/* Sidebar / Meta-data */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div className={styles.recentSection}>
                        <h3 style={{ marginBottom: '1rem' }}>Publishing</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.25rem' }}>Status</label>
                                <select name="status" className={styles.searchInput} value={formData.status} onChange={handleChange}>
                                    <option value="Draft">Draft</option>
                                    <option value="Published">Published</option>
                                    <option value="Scheduled">Scheduled</option>
                                </select>
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.25rem' }}>Category</label>
                                <select name="category" className={styles.searchInput} value={formData.category} onChange={handleChange}>
                                    <option>Current Affairs</option>
                                    <option>Editorials</option>
                                    <option>Strategy</option>
                                </select>
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.25rem' }}>Schedule Date</label>
                                <input type="date" name="scheduledDate" className={styles.searchInput} value={formData.scheduledDate} onChange={handleChange} />
                            </div>
                        </div>
                    </div>

                    <div className={styles.recentSection}>
                        <h3 style={{ marginBottom: '1rem' }}>SEO Settings</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.25rem' }}>SEO Title</label>
                                <input type="text" name="seoTitle" className={styles.searchInput} value={formData.seoTitle} onChange={handleChange} />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.25rem' }}>Meta Description</label>
                                <textarea name="seoDesc" className={styles.searchInput} rows={4} value={formData.seoDesc} onChange={handleChange}></textarea>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
