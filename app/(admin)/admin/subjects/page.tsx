'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, Timestamp, query, orderBy } from 'firebase/firestore';
import { SubjectDoc } from '@/lib/firestore-schema';
import styles from '../../Admin.module.css';
import * as Icons from 'lucide-react';
import {
    Plus,
    Trash2,
    Edit2,
    X,
    Check,
    ChevronDown,
    ChevronRight,
    Tag,
    BookOpen
} from 'lucide-react';

// Dynamic Icon Component
const DynamicIcon = ({ name, size = 24 }: { name?: string, size?: number }) => {
    if (!name) return <BookOpen size={size} />;
    // @ts-ignore
    const IconComponent = Icons[name];
    return IconComponent ? <IconComponent size={size} /> : <Icons.BookOpen size={size} />;
};

export default function SubjectsPage() {
    const [subjects, setSubjects] = useState<SubjectDoc[]>([]);
    const [loading, setLoading] = useState(true);
    const [newSubjectName, setNewSubjectName] = useState('');

    // Topic Management States
    const [expandedSubjectId, setExpandedSubjectId] = useState<string | null>(null);
    const [newTopicName, setNewTopicName] = useState('');

    // Full Edit Modal States
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editSubjectData, setEditSubjectData] = useState<SubjectDoc | null>(null);

    useEffect(() => {
        fetchSubjects();
    }, []);

    const fetchSubjects = async () => {
        try {
            const q = query(collection(db, 'subjects'), orderBy('createdAt', 'desc'));
            const querySnapshot = await getDocs(q);
            const data = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as SubjectDoc[];
            setSubjects(data);
        } catch (error) {
            console.error("Error fetching subjects:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddSubject = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newSubjectName.trim()) return;

        try {
            const newSubject: Omit<SubjectDoc, 'id'> = {
                name: newSubjectName.trim(),
                topics: [],
                isPublished: true, // Default to true for now
                createdAt: Timestamp.now(),
                icon: 'BookOpen',
                articleCount: 0,
                newArticleCount: 0,
                latestArticles: []
            };

            await addDoc(collection(db, 'subjects'), newSubject);
            setNewSubjectName('');
            fetchSubjects();
        } catch (error) {
            console.error("Error adding subject:", error);
            alert("Failed to add subject");
        }
    };

    const handleDeleteSubject = async (id: string, name: string) => {
        if (!window.confirm(`Are you sure you want to delete "${name}"? This cannot be undone.`)) return;

        try {
            await deleteDoc(doc(db, 'subjects', id));
            setSubjects(prev => prev.filter(s => s.id !== id));
        } catch (error) {
            console.error("Error deleting subject:", error);
            alert("Failed to delete subject");
        }
    };

    // Topic Functions
    const toggleExpand = (subjectId: string) => {
        setExpandedSubjectId(prev => prev === subjectId ? null : subjectId);
    };

    const handleAddTopic = async (subjectId: string) => {
        if (!newTopicName.trim()) return;

        const subject = subjects.find(s => s.id === subjectId);
        if (!subject) return;

        const updatedTopics = [...(subject.topics || []), newTopicName.trim()];

        try {
            const subjectRef = doc(db, 'subjects', subjectId);
            await updateDoc(subjectRef, { topics: updatedTopics });

            setSubjects(prev => prev.map(s =>
                s.id === subjectId ? { ...s, topics: updatedTopics } : s
            ));
            setNewTopicName('');
        } catch (error) {
            console.error("Error adding topic:", error);
            alert("Failed to add topic");
        }
    };

    const handleDeleteTopic = async (subjectId: string, topicIndex: number) => {
        const subject = subjects.find(s => s.id === subjectId);
        if (!subject) return;

        const updatedTopics = subject.topics.filter((_, index) => index !== topicIndex);

        try {
            const subjectRef = doc(db, 'subjects', subjectId);
            await updateDoc(subjectRef, { topics: updatedTopics });

            setSubjects(prev => prev.map(s =>
                s.id === subjectId ? { ...s, topics: updatedTopics } : s
            ));
        } catch (error) {
            console.error("Error deleting topic:", error);
            alert("Failed to delete topic");
        }
    };

    // Edit Modal Functions
    const openEditModal = (subject: SubjectDoc) => {
        // Ensure arrays exist for editing
        setEditSubjectData({
            ...subject,
            latestArticles: subject.latestArticles || ['', '', '']
        });
        setIsEditModalOpen(true);
    };

    const closeEditModal = () => {
        setIsEditModalOpen(false);
        setEditSubjectData(null);
    };

    const handleSaveEditSubject = async () => {
        if (!editSubjectData) return;

        try {
            // Clean up empty articles
            const cleanedData = {
                ...editSubjectData,
                latestArticles: editSubjectData.latestArticles?.filter(a => a.trim() !== '') || []
            };

            const subjectRef = doc(db, 'subjects', editSubjectData.id);
            // Don't save the id inside the document itself
            const { id, ...dataToSave } = cleanedData;
            await updateDoc(subjectRef, dataToSave as any);

            setSubjects(prev => prev.map(s =>
                s.id === editSubjectData.id ? cleanedData : s
            ));
            closeEditModal();
        } catch (error) {
            console.error("Error saving subject:", error);
            alert("Failed to save subject details.");
        }
    };

    const handleArticleChange = (index: number, value: string) => {
        if (!editSubjectData) return;
        const newArticles = [...(editSubjectData.latestArticles || [])];
        newArticles[index] = value;
        setEditSubjectData({ ...editSubjectData, latestArticles: newArticles });
    };

    return (
        <div className={styles.container}>
            <div className={styles.pageHeader}>
                <div>
                    <h1 className={styles.pageTitle}>Manage Subjects</h1>
                    <p className={styles.pageSubtitle}>Configure subjects, topics, and layout for the frontend</p>
                </div>
            </div>

            {/* Add New Subject */}
            <div className={styles.card} style={{ marginBottom: '2rem' }}>
                <h3 className={styles.cardTitle}>Add New Subject</h3>
                <form onSubmit={handleAddSubject} style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                    <input
                        type="text"
                        placeholder="Subject Name (e.g., Mathematics)"
                        value={newSubjectName}
                        onChange={(e) => setNewSubjectName(e.target.value)}
                        className={styles.formInput}
                        style={{ flex: 1 }}
                    />
                    <button type="submit" className={styles.primaryBtn} disabled={!newSubjectName.trim()}>
                        <Plus size={18} /> Add Subject
                    </button>
                </form>
            </div>

            {/* Subjects Grid */}
            <div className={styles.card}>
                <h3 className={styles.cardTitle} style={{ marginBottom: '1.5rem' }}>
                    Existing Subjects ({subjects.length})
                </h3>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>Loading subjects...</div>
                ) : subjects.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '2rem', color: '#64748b', background: '#f8fafc', borderRadius: '8px' }}>
                        No subjects found. Add one above!
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                        {subjects.map((subject) => (
                            <div key={subject.id} style={{
                                border: '1px solid #e2e8f0',
                                borderRadius: '12px',
                                overflow: 'hidden',
                                background: '#fff',
                                display: 'flex',
                                flexDirection: 'column'
                            }}>
                                {/* Card Header / Frontend Preview */}
                                <div style={{
                                    padding: '1.5rem',
                                    borderBottom: '1px solid #e2e8f0',
                                    position: 'relative'
                                }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                        <div style={{
                                            width: '48px',
                                            height: '48px',
                                            borderRadius: '12px',
                                            background: '#f1f5f9',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: '#3b82f6',
                                            marginBottom: '1rem'
                                        }}>
                                            <DynamicIcon name={subject.icon} size={24} />
                                        </div>
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            <button onClick={() => openEditModal(subject)} className={styles.iconBtn} style={{ color: '#3b82f6' }} title="Edit Details">
                                                <Edit2 size={16} />
                                            </button>
                                            <button onClick={() => handleDeleteSubject(subject.id, subject.name)} className={styles.iconBtn} style={{ color: '#ef4444' }} title="Delete Subject">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>

                                    <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1.2rem', color: '#1e293b' }}>{subject.name}</h4>
                                    <div style={{ display: 'flex', gap: '1rem', fontSize: '0.85rem', color: '#64748b' }}>
                                        <span>{subject.articleCount || 0} Articles</span>
                                        {subject.newArticleCount ? <span style={{ color: '#ef4444' }}>{subject.newArticleCount} New</span> : null}
                                    </div>
                                </div>

                                {/* Topic Management Section (Accordion style) */}
                                <div style={{ background: '#f8fafc', flex: 1 }}>
                                    <button
                                        onClick={() => toggleExpand(subject.id)}
                                        style={{
                                            width: '100%',
                                            padding: '1rem 1.5rem',
                                            background: 'none',
                                            border: 'none',
                                            borderBottom: expandedSubjectId === subject.id ? '1px solid #e2e8f0' : 'none',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            color: '#475569',
                                            fontWeight: 500,
                                            fontSize: '0.9rem'
                                        }}
                                    >
                                        <span>Manage Topics ({subject.topics?.length || 0})</span>
                                        {expandedSubjectId === subject.id ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                                    </button>

                                    {expandedSubjectId === subject.id && (
                                        <div style={{ padding: '1rem 1.5rem' }}>
                                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
                                                {subject.topics?.map((topic, index) => (
                                                    <div key={index} style={{
                                                        background: 'white',
                                                        border: '1px solid #e2e8f0',
                                                        borderRadius: '6px',
                                                        padding: '0.3rem 0.6rem',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '0.4rem',
                                                        fontSize: '0.8rem',
                                                        color: '#334155'
                                                    }}>
                                                        {topic}
                                                        <button
                                                            onClick={() => handleDeleteTopic(subject.id, index)}
                                                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: 0, display: 'flex' }}
                                                        >
                                                            <X size={12} />
                                                        </button>
                                                    </div>
                                                ))}
                                                {(!subject.topics || subject.topics.length === 0) && (
                                                    <span style={{ color: '#94a3b8', fontSize: '0.8rem', fontStyle: 'italic' }}>No topics added.</span>
                                                )}
                                            </div>

                                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                <input
                                                    type="text"
                                                    placeholder="Add topic..."
                                                    value={newTopicName}
                                                    onChange={(e) => setNewTopicName(e.target.value)}
                                                    className={styles.formInput}
                                                    style={{ flex: 1, padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter') {
                                                            e.preventDefault();
                                                            handleAddTopic(subject.id);
                                                        }
                                                    }}
                                                />
                                                <button
                                                    onClick={() => handleAddTopic(subject.id)}
                                                    className={styles.secondaryBtn}
                                                    style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}
                                                    disabled={!newTopicName.trim()}
                                                >
                                                    <Plus size={14} /> Add
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Edit Subject Modal */}
            {isEditModalOpen && editSubjectData && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modal} style={{ maxWidth: '600px' }}>
                        <div className={styles.modalHeader}>
                            <h2 className={styles.modalTitle}>Edit Subject Details</h2>
                            <button onClick={closeEditModal} className={styles.closeBtn}>
                                <X size={24} />
                            </button>
                        </div>
                        <div className={styles.modalBody}>
                            <div className={styles.formGroup}>
                                <label className={styles.formLabel}>Subject Name</label>
                                <input
                                    type="text"
                                    value={editSubjectData.name}
                                    onChange={(e) => setEditSubjectData({ ...editSubjectData, name: e.target.value })}
                                    className={styles.formInput}
                                />
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                                <div className={styles.formGroup}>
                                    <label className={styles.formLabel}>Lucide Icon Name</label>
                                    <input
                                        type="text"
                                        value={editSubjectData.icon || ''}
                                        onChange={(e) => setEditSubjectData({ ...editSubjectData, icon: e.target.value })}
                                        className={styles.formInput}
                                        placeholder="e.g., BookOpen, Globe"
                                    />
                                    <small style={{ color: '#64748b', fontSize: '0.75rem', marginTop: '0.25rem', display: 'block' }}>
                                        Find names at <a href="https://lucide.dev/icons" target="_blank" rel="noreferrer" style={{ color: '#3b82f6' }}>lucide.dev</a>
                                    </small>
                                </div>

                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', paddingTop: '1.5rem' }}>
                                    <div style={{ padding: '0.5rem', background: '#f1f5f9', borderRadius: '8px', color: '#3b82f6' }}>
                                        <DynamicIcon name={editSubjectData.icon} />
                                    </div>
                                    <span style={{ fontSize: '0.85rem', color: '#64748b' }}>Preview</span>
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                                <div className={styles.formGroup}>
                                    <label className={styles.formLabel}>Total Articles Count</label>
                                    <input
                                        type="number"
                                        value={editSubjectData.articleCount || 0}
                                        onChange={(e) => setEditSubjectData({ ...editSubjectData, articleCount: parseInt(e.target.value) || 0 })}
                                        className={styles.formInput}
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label className={styles.formLabel}>New Articles Indicator</label>
                                    <input
                                        type="number"
                                        value={editSubjectData.newArticleCount || 0}
                                        onChange={(e) => setEditSubjectData({ ...editSubjectData, newArticleCount: parseInt(e.target.value) || 0 })}
                                        className={styles.formInput}
                                    />
                                </div>
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.formLabel}>Latest Articles (Frontend Preview)</label>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                    {[0, 1, 2].map((i) => (
                                        <input
                                            key={i}
                                            type="text"
                                            value={editSubjectData.latestArticles?.[i] || ''}
                                            onChange={(e) => handleArticleChange(i, e.target.value)}
                                            className={styles.formInput}
                                            placeholder={`Article ${i + 1} Title`}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className={styles.modalFooter}>
                            <button onClick={closeEditModal} className={styles.secondaryBtn}>
                                Cancel
                            </button>
                            <button
                                onClick={handleSaveEditSubject}
                                className={styles.primaryBtn}
                                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                            >
                                <Check size={18} /> Save Details
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
