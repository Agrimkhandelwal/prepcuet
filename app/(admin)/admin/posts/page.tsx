'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search, Eye, Clock, Loader2 } from 'lucide-react';
import {
    collection, addDoc, getDocs, updateDoc, deleteDoc,
    doc, query, orderBy, serverTimestamp, Timestamp
} from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { db, storage } from '@/lib/firebase';
import dynamic from 'next/dynamic';
import 'react-quill-new/dist/quill.snow.css';
import styles from '../../Admin.module.css';

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });

interface Article {
    id: string;
    title: string;
    summary: string;
    content: string;
    category: string;
    tags: string[];
    status: 'Published' | 'Draft';
    date: string;
    views: number;
    createdAt?: Timestamp;
    imageUrl?: string;
}

const CATEGORIES = ['Current Affairs', 'Editorials', 'Strategy', 'Quiz', 'CUET Practice'];

export default function PostsPage() {
    const [articles, setArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingArticle, setEditingArticle] = useState<Article | null>(null);
    const [formData, setFormData] = useState({
        title: '',
        summary: '',
        content: '',
        category: 'Current Affairs',
        tags: '',
        status: 'Draft' as 'Published' | 'Draft',
        imageUrl: '',
    });

    // Image Upload State
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);

    // Load articles from Firestore
    const fetchArticles = async () => {
        try {
            setLoading(true);
            const q = query(collection(db, 'articles'), orderBy('createdAt', 'desc'));
            const snap = await getDocs(q);
            const data = snap.docs.map(d => ({
                id: d.id,
                ...d.data(),
                date: d.data().createdAt
                    ? new Date(d.data().createdAt.toDate()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                    : new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            })) as Article[];
            setArticles(data);
        } catch (err) {
            console.error('Error fetching articles:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchArticles(); }, []);

    const filteredArticles = articles.filter(a =>
        a.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const openModal = (article?: Article) => {
        if (article) {
            setEditingArticle(article);
            setFormData({
                title: article.title,
                summary: article.summary,
                content: article.content || '',
                category: article.category,
                tags: article.tags.join(', '),
                status: article.status,
                imageUrl: article.imageUrl || '',
            });
        } else {
            setEditingArticle(null);
            setFormData({ title: '', summary: '', content: '', category: 'Current Affairs', tags: '', status: 'Draft', imageUrl: '' });
        }
        setFile(null);
        setIsModalOpen(true);
    };

    const closeModal = () => { setIsModalOpen(false); setEditingArticle(null); setFile(null); };

    const uploadThumbnail = async (): Promise<string | null> => {
        if (!file) return null;

        return new Promise((resolve) => {
            setUploading(true);
            const storageRef = ref(storage, `thumbnails/${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.\-_]/g, '_')}`);
            const uploadTask = uploadBytesResumable(storageRef, file);

            uploadTask.on(
                'state_changed',
                () => { },
                (err) => {
                    console.error("Cover image upload failed:", err);
                    setUploading(false);
                    resolve(null);
                },
                async () => {
                    try {
                        const url = await getDownloadURL(uploadTask.snapshot.ref);
                        setUploading(false);
                        resolve(url);
                    } catch (err) {
                        setUploading(false);
                        resolve(null);
                    }
                }
            );
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        const tagsArray = formData.tags.split(',').map(t => t.trim()).filter(Boolean);

        try {
            let finalImageUrl = formData.imageUrl;

            if (file) {
                const uploadedUrl = await uploadThumbnail();
                if (uploadedUrl) {
                    finalImageUrl = uploadedUrl;
                }
            }

            if (editingArticle) {
                await updateDoc(doc(db, 'articles', editingArticle.id), {
                    title: formData.title,
                    summary: formData.summary,
                    content: formData.content,
                    category: formData.category,
                    tags: tagsArray,
                    status: formData.status,
                    imageUrl: finalImageUrl,
                });
            } else {
                await addDoc(collection(db, 'articles'), {
                    title: formData.title,
                    summary: formData.summary,
                    content: formData.content,
                    category: formData.category,
                    tags: tagsArray,
                    status: formData.status,
                    views: 0,
                    imageUrl: finalImageUrl,
                    createdAt: serverTimestamp(),
                });
            }
            await fetchArticles();
            closeModal();
        } catch (err) {
            console.error('Error saving article:', err);
            alert('Failed to save article. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    const deleteArticle = async (id: string) => {
        if (!confirm('Are you sure you want to delete this article?')) return;
        try {
            await deleteDoc(doc(db, 'articles', id));
            setArticles(prev => prev.filter(a => a.id !== id));
        } catch (err) {
            console.error('Error deleting:', err);
        }
    };

    const toggleStatus = async (article: Article) => {
        const newStatus = article.status === 'Published' ? 'Draft' : 'Published';
        try {
            await updateDoc(doc(db, 'articles', article.id), { status: newStatus });
            setArticles(prev => prev.map(a => a.id === article.id ? { ...a, status: newStatus } : a));
        } catch (err) {
            console.error('Error toggling status:', err);
        }
    };

    return (
        <div>
            <div className={styles.pageHeader}>
                <div>
                    <h1 className={styles.pageTitle}>Articles & Posts</h1>
                    <p className={styles.pageSubtitle}>Manage current affairs, editorials, and study content</p>
                </div>
                <button className={styles.primaryBtn} onClick={() => openModal()}>
                    <Plus size={18} /> New Article
                </button>
            </div>

            {/* Search */}
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', background: 'white', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '0.5rem 1rem', flex: '1', maxWidth: '400px' }}>
                    <Search size={18} style={{ color: '#64748b', marginRight: '0.5rem' }} />
                    <input
                        type="text"
                        placeholder="Search articles..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{ border: 'none', outline: 'none', width: '100%', fontSize: '0.9rem' }}
                    />
                </div>
                <span style={{ color: '#64748b', fontSize: '0.875rem' }}>{filteredArticles.length} articles</span>
            </div>

            {/* Table */}
            <div className={styles.recentSection}>
                {loading ? (
                    <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
                        <Loader2 size={32} style={{ animation: 'spin 1s linear infinite', margin: '0 auto 1rem' }} />
                        <p>Loading articles...</p>
                    </div>
                ) : (
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
                                            {article.tags.map(tag => <span key={tag} style={{ marginRight: '0.5rem' }}>#{tag}</span>)}
                                        </div>
                                    </td>
                                    <td><span className={`${styles.badge} ${styles.badgeInfo}`}>{article.category}</span></td>
                                    <td>
                                        <button onClick={() => toggleStatus(article)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                                            <span className={`${styles.badge} ${article.status === 'Published' ? styles.badgeSuccess : styles.badgeWarning}`}>
                                                {article.status}
                                            </span>
                                        </button>
                                    </td>
                                    <td style={{ color: '#64748b', fontSize: '0.85rem' }}>
                                        <Clock size={14} style={{ marginRight: '0.25rem' }} />{article.date}
                                    </td>
                                    <td style={{ color: '#64748b', fontSize: '0.85rem' }}>
                                        <Eye size={14} style={{ marginRight: '0.25rem' }} />{article.views}
                                    </td>
                                    <td>
                                        <div className={styles.actionBtns}>
                                            <button className={styles.editBtn} onClick={() => openModal(article)}><Edit2 size={14} /> Edit</button>
                                            <button className={styles.deleteBtn} onClick={() => deleteArticle(article.id)}><Trash2 size={14} /> Delete</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
                {!loading && filteredArticles.length === 0 && (
                    <div className={styles.emptyState}>
                        <Plus size={48} />
                        <h3>No articles yet</h3>
                        <p>Click "New Article" to create your first current affairs article</p>
                    </div>
                )}
            </div>

            {/* Create/Edit Modal */}
            {isModalOpen && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '2rem' }}>
                    <div style={{ background: 'white', borderRadius: '16px', width: '100%', maxWidth: '680px', maxHeight: '90vh', overflow: 'auto' }}>
                        <div style={{ padding: '1.5rem', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h2 style={{ margin: 0, color: '#1e293b' }}>{editingArticle ? 'Edit Article' : 'Create New Article'}</h2>
                            <button onClick={closeModal} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#64748b' }}>×</button>
                        </div>
                        <form onSubmit={handleSubmit} style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div className={styles.formGroup}>
                                <label className={styles.formLabel}>Title *</label>
                                <input type="text" className={styles.formInput} value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    placeholder="e.g. Daily Current Affairs – 22nd February 2026" required />
                            </div>
                            <div className={styles.formGroup}>
                                <label className={styles.formLabel}>Summary * <span style={{ fontWeight: 400, color: '#94a3b8' }}>(shown on listing page)</span></label>
                                <textarea className={styles.formTextarea} value={formData.summary}
                                    onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                                    placeholder="Brief 1-2 line description of this article" required />
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.formLabel}>Cover Image (Optional)</label>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', background: '#f8fafc', padding: '1rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                                    <input
                                        type="file"
                                        onChange={(e) => {
                                            if (e.target.files && e.target.files[0]) {
                                                setFile(e.target.files[0]);
                                            }
                                        }}
                                        className={styles.formInput}
                                        accept="image/*"
                                        style={{ background: 'white' }}
                                    />
                                    <div style={{ textAlign: 'center', color: '#64748b', fontSize: '0.8rem' }}>- OR -</div>
                                    <input
                                        type="url"
                                        value={formData.imageUrl}
                                        onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                                        className={styles.formInput}
                                        placeholder="Enter external image URL"
                                    />
                                </div>
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.formLabel}>Full Article Content (Rich Text)</label>
                                <div style={{ background: 'white' }}>
                                    <ReactQuill
                                        theme="snow"
                                        value={formData.content}
                                        onChange={(value) => setFormData({ ...formData, content: value })}
                                        style={{ minHeight: '200px' }}
                                        modules={{
                                            toolbar: [
                                                [{ 'header': [1, 2, 3, false] }],
                                                ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                                                [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                                                ['link', 'image'],
                                                ['clean']
                                            ],
                                        }}
                                    />
                                </div>
                            </div>
                            <div className={styles.formRow}>
                                <div className={styles.formGroup}>
                                    <label className={styles.formLabel}>Category *</label>
                                    <select className={styles.formSelect} value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}>
                                        {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                                    </select>
                                </div>
                                <div className={styles.formGroup}>
                                    <label className={styles.formLabel}>Status *</label>
                                    <select className={styles.formSelect} value={formData.status}
                                        onChange={(e) => setFormData({ ...formData, status: e.target.value as 'Published' | 'Draft' })}>
                                        <option value="Draft">Draft (not visible)</option>
                                        <option value="Published">Published (visible to users)</option>
                                    </select>
                                </div>
                            </div>
                            <div className={styles.formGroup}>
                                <label className={styles.formLabel}>Tags <span style={{ fontWeight: 400, color: '#94a3b8' }}>(comma separated)</span></label>
                                <input type="text" className={styles.formInput} value={formData.tags}
                                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                                    placeholder="e.g. GS-2, Polity, Environment" />
                            </div>
                            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                                <button type="button" className={styles.secondaryBtn} onClick={closeModal} disabled={saving || uploading}>Cancel</button>
                                <button type="submit" className={styles.primaryBtn} disabled={saving || uploading}>
                                    {saving || uploading ? <><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> Saving...</> : editingArticle ? 'Update Article' : 'Publish Article'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    );
}
