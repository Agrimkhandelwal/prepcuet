'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, orderBy, getDocs, deleteDoc, doc, where } from 'firebase/firestore';
import { Content, SubjectDoc } from '@/lib/firestore-schema';
import Link from 'next/link';
import {
    Plus,
    Search,
    FileText,
    File,
    Video,
    Trash2,
    Edit2,
    Eye,
    Filter
} from 'lucide-react';
import styles from '../../Admin.module.css';

export default function ContentPage() {
    const [content, setContent] = useState<Content[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterSubject, setFilterSubject] = useState('');
    const [filterType, setFilterType] = useState('');

    // For subject filter dropdown
    const [subjects, setSubjects] = useState<SubjectDoc[]>([]);

    useEffect(() => {
        fetchContent();
        fetchSubjects();
    }, []);

    const fetchContent = async () => {
        try {
            const q = query(collection(db, 'content'), orderBy('createdAt', 'desc'));
            const querySnapshot = await getDocs(q);
            const data = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Content[];
            setContent(data);
        } catch (error) {
            console.error("Error fetching content:", error);
        } finally {
            setLoading(false);
        }
    };

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

    const handleDelete = async (id: string, title: string) => {
        if (!window.confirm(`Are you sure you want to delete "${title}"?`)) return;

        try {
            await deleteDoc(doc(db, 'content', id));
            setContent(prev => prev.filter(c => c.id !== id));
        } catch (error) {
            console.error("Error deleting content:", error);
            alert("Failed to delete content");
        }
    };

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'video': return <Video size={18} color="#8b5cf6" />;
            case 'pdf': return <File size={18} color="#ef4444" />;
            case 'article':
            case 'notes': return <FileText size={18} color="#3b82f6" />;
            default: return <FileText size={18} />;
        }
    };

    const filteredContent = content.filter(item => {
        const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesSubject = filterSubject ? item.subjectId === filterSubject : true;
        const matchesType = filterType ? item.contentType === filterType : true;
        return matchesSearch && matchesSubject && matchesType;
    });

    return (
        <div className={styles.container}>
            <div className={styles.pageHeader}>
                <div>
                    <h1 className={styles.pageTitle}>Content Management</h1>
                    <p className={styles.pageSubtitle}>Manage study materials, notes, and articles</p>
                </div>
                <Link href="/admin/content/new" className={styles.primaryBtn}>
                    <Plus size={18} /> Add New Content
                </Link>
            </div>

            {/* Filters */}
            <div className={styles.card} style={{ marginBottom: '1.5rem', padding: '1rem' }}>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                    <div style={{ flex: 1, minWidth: '200px', display: 'flex', alignItems: 'center', gap: '0.5rem', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '0.5rem' }}>
                        <Search size={18} color="#94a3b8" />
                        <input
                            type="text"
                            placeholder="Search by title..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ border: 'none', outline: 'none', width: '100%' }}
                        />
                    </div>

                    <select
                        value={filterSubject}
                        onChange={(e) => setFilterSubject(e.target.value)}
                        className={styles.formSelect}
                        style={{ width: '200px' }}
                    >
                        <option value="">All Subjects</option>
                        {subjects.map(s => (
                            <option key={s.id} value={s.id}>{s.name}</option>
                        ))}
                    </select>

                    <select
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                        className={styles.formSelect}
                        style={{ width: '150px' }}
                    >
                        <option value="">All Types</option>
                        <option value="article">Article</option>
                        <option value="notes">Notes</option>
                        <option value="pdf">PDF</option>
                        <option value="video">Video</option>
                    </select>

                    <button
                        onClick={() => { setSearchTerm(''); setFilterSubject(''); setFilterType(''); }}
                        className={styles.secondaryBtn}
                        style={{ padding: '0.5rem 1rem' }}
                    >
                        Reset
                    </button>
                </div>
            </div>

            {/* Content List */}
            <div className={styles.card}>
                {loading ? (
                    <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>Loading content...</div>
                ) : filteredContent.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
                        <div style={{ background: '#f1f5f9', width: '60px', height: '60px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                            <FileText size={30} color="#94a3b8" />
                        </div>
                        <h3>No content found</h3>
                        <p>Try adjusting filters or add new content.</p>
                    </div>
                ) : (
                    <div className={styles.tableResponsive}>
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>Title</th>
                                    <th>Subject / Topic</th>
                                    <th>Type</th>
                                    <th>Status</th>
                                    <th>Access</th>
                                    <th>Views</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredContent.map((item) => (
                                    <tr key={item.id}>
                                        <td>
                                            <div style={{ fontWeight: 600, color: '#1e293b' }}>{item.title}</div>
                                            <div style={{ fontSize: '0.75rem', color: '#64748b', maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                {item.description}
                                            </div>
                                        </td>
                                        <td>
                                            <div style={{ color: '#0f172a', fontWeight: 500 }}>{item.subjectName}</div>
                                            {item.topicName && <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{item.topicName}</div>}
                                        </td>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                {getTypeIcon(item.contentType)}
                                                <span style={{ textTransform: 'capitalize' }}>{item.contentType}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <span className={`${styles.badge} ${item.isPublished ? styles.badgeSuccess : styles.badgeWarning}`}>
                                                {item.isPublished ? 'Published' : 'Draft'}
                                            </span>
                                        </td>
                                        <td>
                                            <span className={`${styles.badge} ${item.isFree ? styles.badgeInfo : styles.badgeError}`}>
                                                {item.isFree ? 'Free' : 'Premium'}
                                            </span>
                                        </td>
                                        <td>{item.views || 0}</td>
                                        <td>
                                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                <button
                                                    onClick={() => handleDelete(item.id, item.title)}
                                                    className={styles.iconBtn}
                                                    style={{ color: '#ef4444' }}
                                                    title="Delete"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
