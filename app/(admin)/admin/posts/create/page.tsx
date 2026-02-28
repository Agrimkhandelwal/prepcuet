'use client';
import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Save } from 'lucide-react';
import { db, storage } from '@/lib/firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import 'react-quill-new/dist/quill.snow.css';
import styles from '../../../Admin.module.css';

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });

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

    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');

    // Image Upload State
    const [file, setFile] = useState<File | null>(null);
    const [imageUrl, setImageUrl] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

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

    const handleSave = async () => {
        setLoading(true);
        setError('');

        if (!formData.title || !formData.content) {
            setError('Title and Content are required.');
            setLoading(false);
            return;
        }

        try {
            let finalImageUrl = imageUrl;

            if (file) {
                const uploadedUrl = await uploadThumbnail();
                if (uploadedUrl) {
                    finalImageUrl = uploadedUrl;
                }
            }

            const postData = {
                ...formData,
                imageUrl: finalImageUrl,
                createdAt: Timestamp.now(),
                updatedAt: Timestamp.now()
            };

            await addDoc(collection(db, 'articles'), postData);

            alert('Post created successfully!');
            router.push('/admin/posts');
        } catch (err: any) {
            console.error('Error saving post:', err);
            setError('Failed to save post.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div style={{ marginBottom: '2rem' }}>
                <Link href="/admin/posts" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                    <ArrowLeft size={16} /> Back to Posts
                </Link>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h1 style={{ fontSize: '1.75rem' }}>Create New Post</h1>
                    <button
                        onClick={handleSave}
                        disabled={loading || uploading}
                        className={styles.navItem}
                        style={{ background: 'var(--primary)', color: 'white', fontWeight: 600, border: 'none', cursor: 'pointer' }}
                    >
                        {loading || uploading ? 'Saving...' : <><Save size={18} /> Save Post</>}
                    </button>
                </div>
            </div>

            {error && (
                <div style={{ background: '#fee2e2', color: '#b91c1c', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>
                    {error}
                </div>
            )}

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
                            <div style={{ minHeight: '400px', marginBottom: '3rem' }}>
                                <ReactQuill
                                    theme="snow"
                                    value={formData.content}
                                    onChange={(value) => setFormData({ ...formData, content: value })}
                                    style={{ height: '350px' }}
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
                    </div>
                </div>


                {/* Sidebar / Meta-data */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {/* Cover Image Section */}
                    <div className={styles.recentSection}>
                        <h3 style={{ marginBottom: '1rem' }}>Cover Image</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Upload an image or provide a URL.</p>
                            <input
                                type="file"
                                onChange={(e) => {
                                    if (e.target.files && e.target.files[0]) {
                                        setFile(e.target.files[0]);
                                    }
                                }}
                                className={styles.searchInput}
                                accept="image/*"
                            />
                            <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>- OR -</div>
                            <input
                                type="url"
                                value={imageUrl}
                                onChange={(e) => setImageUrl(e.target.value)}
                                className={styles.searchInput}
                                placeholder="Enter image URL"
                            />
                        </div>
                    </div>

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
        </div >
    );
}
