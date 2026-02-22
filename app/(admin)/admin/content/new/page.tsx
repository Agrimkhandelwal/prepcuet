'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { db, storage } from '@/lib/firebase';
import { collection, addDoc, getDocs, query, orderBy, Timestamp } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { SubjectDoc, Content } from '@/lib/firestore-schema';
import Link from 'next/link';
import {
    ArrowLeft,
    Save,
    Upload,
    FileText,
    Video,
    File as FileIcon,
    CheckCircle
} from 'lucide-react';
import styles from '../../../Admin.module.css';

export default function NewContentPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');

    // Metadata State
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [contentType, setContentType] = useState<'article' | 'notes' | 'pdf' | 'video'>('article');
    const [isFree, setIsFree] = useState(false);
    const [isPublished, setIsPublished] = useState(true);
    const [uploadProgress, setUploadProgress] = useState(0);

    // Subject & Topic State
    const [subjects, setSubjects] = useState<SubjectDoc[]>([]);
    const [selectedSubjectId, setSelectedSubjectId] = useState('');
    const [selectedTopic, setSelectedTopic] = useState('');
    const [availableTopics, setAvailableTopics] = useState<string[]>([]);

    // Content State
    const [contentBody, setContentBody] = useState(''); // For Article/Notes text
    const [fileUrl, setFileUrl] = useState(''); // For PDF/Video/Image
    const [file, setFile] = useState<File | null>(null);

    useEffect(() => {
        fetchSubjects();
    }, []);

    // Update topics when subject changes
    useEffect(() => {
        if (selectedSubjectId) {
            const subject = subjects.find(s => s.id === selectedSubjectId);
            setAvailableTopics(subject?.topics || []);
            setSelectedTopic('');
        } else {
            setAvailableTopics([]);
        }
    }, [selectedSubjectId, subjects]);

    const fetchSubjects = async () => {
        try {
            const q = query(collection(db, 'subjects'), orderBy('name'));
            const querySnapshot = await getDocs(q);
            const data = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as SubjectDoc[];
            setSubjects(data);
        } catch (error) {
            console.error("Error fetching subjects:", error);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const uploadFile = async (): Promise<string | null> => {
        if (!file) return null;

        return new Promise((resolve) => {
            setUploading(true);
            setUploadProgress(0);
            const storageRef = ref(storage, `content/${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.\-_]/g, '_')}`);
            const uploadTask = uploadBytesResumable(storageRef, file);

            uploadTask.on(
                'state_changed',
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    setUploadProgress(Math.round(progress));
                },
                (err) => {
                    console.error("Upload failed:", err);
                    setError(`Upload failed: ${err.message}`);
                    setUploading(false);
                    resolve(null);
                },
                async () => {
                    try {
                        const url = await getDownloadURL(uploadTask.snapshot.ref);
                        setUploading(false);
                        resolve(url);
                    } catch (err: any) {
                        console.error("Failed to get URL:", err);
                        setError(`Failed to get URL: ${err.message}`);
                        setUploading(false);
                        resolve(null);
                    }
                }
            );
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!title || !selectedSubjectId) {
            setError('Please fill in all required fields');
            return;
        }

        setLoading(true);

        try {
            let finalFileUrl = fileUrl;

            // Handle file upload if a file is selected
            if (file) {
                const uploadedUrl = await uploadFile();
                if (!uploadedUrl) {
                    setLoading(false);
                    return; // Stop if upload failed
                }
                finalFileUrl = uploadedUrl;
            }

            const subject = subjects.find(s => s.id === selectedSubjectId);

            const contentData: any = {
                title,
                description,
                subjectId: selectedSubjectId,
                subjectName: subject?.name || 'Unknown',
                contentType,
                fileUrl: finalFileUrl,
                content: contentBody,
                isFree,
                isPublished,
                views: 0,
                createdAt: Timestamp.now(),
                updatedAt: Timestamp.now(),
                createdBy: 'admin', // TODO: Get from auth
            };

            if (selectedTopic && selectedTopic.trim() !== '') {
                contentData.topicName = selectedTopic;
            }

            await addDoc(collection(db, 'content'), contentData);

            alert('Content added successfully!');
            router.push('/admin/content');
        } catch (err: any) {
            console.error('Error saving content:', err);
            setError('Failed to save content. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.pageHeader}>
                <div>
                    <Link href="/admin/content" className={styles.backLink}>
                        <ArrowLeft size={18} /> Back to Content
                    </Link>
                    <h1 className={styles.pageTitle}>Add New Content</h1>
                </div>
            </div>

            {error && (
                <div className={styles.errorAlert}>{error}</div>
            )}

            <form onSubmit={handleSubmit} className={styles.formCard}>
                <div className={styles.formGrid}>
                    {/* Basic Info */}
                    <div className={styles.fullWidth}>
                        <label className={styles.label}>Title *</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className={styles.input}
                            placeholder="e.g., Introduction to Calculus"
                            required
                        />
                    </div>

                    <div className={styles.fullWidth}>
                        <label className={styles.label}>Description</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className={styles.textarea}
                            placeholder="Brief description..."
                            rows={2}
                        />
                    </div>

                    {/* Classification */}
                    <div>
                        <label className={styles.label}>Subject *</label>
                        <select
                            value={selectedSubjectId}
                            onChange={(e) => setSelectedSubjectId(e.target.value)}
                            className={styles.select}
                            required
                        >
                            <option value="">Select Subject</option>
                            {subjects.map(s => (
                                <option key={s.id} value={s.id}>{s.name}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className={styles.label}>Topic (Optional)</label>
                        <select
                            value={selectedTopic}
                            onChange={(e) => setSelectedTopic(e.target.value)}
                            className={styles.select}
                            disabled={!selectedSubjectId}
                        >
                            <option value="">Select Topic</option>
                            {availableTopics.map((topic, index) => (
                                <option key={index} value={topic}>{topic}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className={styles.label}>Content Type *</label>
                        <select
                            value={contentType}
                            onChange={(e) => setContentType(e.target.value as any)}
                            className={styles.select}
                        >
                            <option value="article">Article</option>
                            <option value="notes">Notes</option>
                            <option value="pdf">PDF Document</option>
                            <option value="video">Video</option>
                        </select>
                    </div>

                    {/* Type Sensitive Fields */}
                    <div className={styles.fullWidth} style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                        {(contentType === 'article' || contentType === 'notes') ? (
                            <>
                                <label className={styles.label}>Content Body (HTML/Text)</label>
                                <textarea
                                    value={contentBody}
                                    onChange={(e) => setContentBody(e.target.value)}
                                    className={styles.textarea}
                                    rows={10}
                                    placeholder="Write your content here..."
                                />
                                <p style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.5rem' }}>
                                    Tip: You can paste HTML directly here.
                                </p>
                            </>
                        ) : (
                            <>
                                <label className={styles.label}>File Upload / URL</label>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    <input
                                        type="file"
                                        onChange={handleFileChange}
                                        className={styles.input}
                                        accept={contentType === 'pdf' ? '.pdf' : 'video/*,application/pdf,image/*'}
                                    />
                                    <div style={{ textAlign: 'center', color: '#64748b', fontSize: '0.9rem' }}>- OR -</div>
                                    <input
                                        type="url"
                                        value={fileUrl}
                                        onChange={(e) => setFileUrl(e.target.value)}
                                        className={styles.input}
                                        placeholder="Enter external URL (e.g., Drive link, YouTube URL)"
                                    />
                                </div>
                            </>
                        )}
                    </div>

                    {/* Settings */}
                    <div className={styles.checkboxGroup}>
                        <label className={styles.checkboxLabel}>
                            <input
                                type="checkbox"
                                checked={isFree}
                                onChange={(e) => setIsFree(e.target.checked)}
                            />
                            <span>Make this content Free</span>
                        </label>
                    </div>

                    <div className={styles.checkboxGroup}>
                        <label className={styles.checkboxLabel}>
                            <input
                                type="checkbox"
                                checked={isPublished}
                                onChange={(e) => setIsPublished(e.target.checked)}
                            />
                            <span>Publish Immediately</span>
                        </label>
                    </div>
                </div>

                <div className={styles.formActions}>
                    <button
                        type="button"
                        onClick={() => router.push('/admin/content')}
                        className={styles.cancelBtn}
                        disabled={loading || uploading}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className={styles.submitBtn}
                        disabled={loading || uploading}
                    >
                        {uploading ? (
                            `Uploading ${uploadProgress}%...`
                        ) : loading ? (
                            'Saving Database...'
                        ) : (
                            <>
                                <Save size={18} /> Save Content
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}
