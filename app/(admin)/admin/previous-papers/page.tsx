'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, addDoc, deleteDoc, doc, Timestamp, query, orderBy } from 'firebase/firestore';
import { PastPaper } from '@/lib/firestore-schema';
import { SUBJECTS } from '@/lib/constants/subjects';
import styles from '../../Admin.module.css';
import { Plus, Trash2, FileText, Calendar, Clock, BookOpen, Link as LinkIcon, Download } from 'lucide-react';

export default function PreviousPapersAdminPage() {
    const [papers, setPapers] = useState<PastPaper[]>([]);
    const [loading, setLoading] = useState(true);

    // Form state
    const [title, setTitle] = useState('');
    const [year, setYear] = useState<number>(new Date().getFullYear());
    const [subject, setSubject] = useState<string>(SUBJECTS[0]);
    const [duration, setDuration] = useState('60 Mins');
    const [questions, setQuestions] = useState<number>(50);
    const [pdfUrl, setPdfUrl] = useState('');

    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        fetchPapers();
    }, []);

    const fetchPapers = async () => {
        try {
            const q = query(collection(db, 'previousYearPapers'), orderBy('year', 'desc'));
            const querySnapshot = await getDocs(q);
            const data = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as PastPaper[];
            setPapers(data);
        } catch (error) {
            console.error("Error fetching papers:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddPaper = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim() || !pdfUrl.trim()) return;
        setIsSubmitting(true);

        try {
            const newPaper: Omit<PastPaper, 'id'> = {
                title: title.trim(),
                year: Number(year),
                subject,
                duration: duration.trim(),
                questions: Number(questions),
                pdfUrl: pdfUrl.trim(),
                createdAt: Timestamp.now(),
                updatedAt: Timestamp.now()
            };

            await addDoc(collection(db, 'previousYearPapers'), newPaper);

            // Reset form
            setTitle('');
            setPdfUrl('');
            setQuestions(50);
            setDuration('60 Mins');

            fetchPapers();
        } catch (error) {
            console.error("Error adding paper:", error);
            alert("Failed to add paper");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeletePaper = async (id: string, paperTitle: string) => {
        if (!window.confirm(`Are you sure you want to delete "${paperTitle}"? This cannot be undone.`)) return;

        try {
            await deleteDoc(doc(db, 'previousYearPapers', id));
            setPapers(prev => prev.filter(p => p.id !== id));
        } catch (error) {
            console.error("Error deleting paper:", error);
            alert("Failed to delete paper");
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.pageHeader}>
                <div>
                    <h1 className={styles.pageTitle}>Manage Previous Year Papers</h1>
                    <p className={styles.pageSubtitle}>Add PDF links and categorize official past exam papers.</p>
                </div>
            </div>

            {/* Add New Paper Form */}
            <div className={styles.card} style={{ marginBottom: '2rem' }}>
                <h3 className={styles.cardTitle}>Add New Paper</h3>
                <form onSubmit={handleAddPaper} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginTop: '1.5rem' }}>

                    <div className={styles.formGroup}>
                        <label className={styles.formLabel}>Paper Title</label>
                        <input
                            type="text"
                            placeholder="e.g., CUET UG 2024 - General Test"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className={styles.formInput}
                            required
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.formLabel}>Subject</label>
                        <select
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            className={styles.formInput}
                            required
                        >
                            {SUBJECTS.map(sub => (
                                <option key={sub} value={sub}>{sub}</option>
                            ))}
                        </select>
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.formLabel}>Exam Year</label>
                        <input
                            type="number"
                            value={year}
                            onChange={(e) => setYear(Number(e.target.value))}
                            className={styles.formInput}
                            min="2010"
                            max="2030"
                            required
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.formLabel}>PDF URL</label>
                        <input
                            type="url"
                            placeholder="https://your-storage.com/paper.pdf"
                            value={pdfUrl}
                            onChange={(e) => setPdfUrl(e.target.value)}
                            className={styles.formInput}
                            required
                        />
                        <small style={{ color: '#64748b', fontSize: '0.75rem', marginTop: '0.25rem', display: 'block' }}>
                            Upload PDF to Google Drive or Firebase Storage and paste public link here.
                        </small>
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.formLabel}>Duration (e.g., 60 Mins)</label>
                        <input
                            type="text"
                            value={duration}
                            onChange={(e) => setDuration(e.target.value)}
                            className={styles.formInput}
                            required
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.formLabel}>Total Questions</label>
                        <input
                            type="number"
                            value={questions}
                            onChange={(e) => setQuestions(Number(e.target.value))}
                            className={styles.formInput}
                            min="10"
                            max="200"
                            required
                        />
                    </div>

                    <div style={{ gridColumn: '1 / -1', marginTop: '0.5rem' }}>
                        <button type="submit" className={styles.primaryBtn} disabled={isSubmitting || !title.trim() || !pdfUrl.trim()}>
                            <Plus size={18} /> {isSubmitting ? 'Adding...' : 'Add Paper'}
                        </button>
                    </div>
                </form>
            </div>

            {/* Existing Papers List */}
            <div className={styles.card}>
                <h3 className={styles.cardTitle} style={{ marginBottom: '1.5rem' }}>
                    Uploaded Papers ({papers.length})
                </h3>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>Loading papers...</div>
                ) : papers.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '2rem', color: '#64748b', background: '#f8fafc', borderRadius: '8px' }}>
                        No papers uploaded yet. Use the form above to add one.
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
                        {papers.map((paper) => (
                            <div key={paper.id} style={{
                                border: '1px solid #e2e8f0',
                                borderRadius: '12px',
                                background: '#fff',
                                padding: '1.5rem',
                                position: 'relative'
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                        <div style={{
                                            width: '40px',
                                            height: '40px',
                                            borderRadius: '10px',
                                            background: '#f1f5f9',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: '#3b82f6'
                                        }}>
                                            <FileText size={20} />
                                        </div>
                                        <div>
                                            <h4 style={{ margin: '0 0 0.25rem 0', fontSize: '1rem', color: '#1e293b' }}>{paper.title}</h4>
                                            <span style={{ fontSize: '0.8rem', color: '#64748b', background: '#e2e8f0', padding: '2px 8px', borderRadius: '4px' }}>
                                                {paper.subject}
                                            </span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleDeletePaper(paper.id, paper.title)}
                                        className={styles.iconBtn}
                                        style={{ color: '#ef4444', padding: '0.25rem' }}
                                        title="Delete Paper"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>

                                <div style={{ display: 'flex', gap: '1rem', fontSize: '0.85rem', color: '#64748b', marginBottom: '1rem' }}>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Calendar size={14} /> {paper.year}</span>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Clock size={14} /> {paper.duration}</span>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><BookOpen size={14} /> {paper.questions} Qs</span>
                                </div>

                                <a
                                    href={paper.pdfUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '0.5rem',
                                        width: '100%',
                                        padding: '0.75rem',
                                        background: '#f8fafc',
                                        border: '1px solid #e2e8f0',
                                        borderRadius: '8px',
                                        color: '#3b82f6',
                                        textDecoration: 'none',
                                        fontSize: '0.9rem',
                                        fontWeight: 500,
                                        transition: 'background 0.2s'
                                    }}
                                    onMouseOver={(e) => e.currentTarget.style.background = '#f1f5f9'}
                                    onMouseOut={(e) => e.currentTarget.style.background = '#f8fafc'}
                                >
                                    <Download size={16} /> View PDF Link
                                </a>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
