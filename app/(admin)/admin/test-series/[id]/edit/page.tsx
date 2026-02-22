'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { doc, getDoc, updateDoc, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Subject } from '@/lib/constants/subjects';
import { Question, TestSeries } from '@/lib/firestore-schema';
import SubjectMultiSelect from '@/components/admin/SubjectMultiSelect';
import QuestionBuilder from '@/components/admin/QuestionBuilder';
import { ArrowLeft, Save, FileText, Loader2 } from 'lucide-react';
import Link from 'next/link';
import styles from '../../../../Admin.module.css';

export default function EditTestSeriesPage() {
    const router = useRouter();
    const params = useParams();
    const id = params?.id as string;

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    // Form state
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [duration, setDuration] = useState(60);
    const [negativeMarking, setNegativeMarking] = useState(true);
    const [isFree, setIsFree] = useState(false);
    const [status, setStatus] = useState<'draft' | 'published'>('draft');
    const [questions, setQuestions] = useState<(Omit<Question, 'id'> & { id?: string })[]>([]);

    useEffect(() => {
        const fetchTestSeries = async () => {
            if (!id) return;

            try {
                const docRef = doc(db, 'testSeries', id);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const data = docSnap.data() as TestSeries;
                    setTitle(data.title);
                    setDescription(data.description);
                    setSubjects(data.subjects as Subject[]);
                    setDuration(data.duration);
                    setNegativeMarking(data.negativeMarking);
                    setIsFree(data.isFree);
                    setStatus(data.status as 'draft' | 'published');
                    setQuestions(data.questions);
                } else {
                    setError('Test series not found');
                }
            } catch (err) {
                console.error('Error fetching test series:', err);
                setError('Failed to load test series');
            } finally {
                setLoading(false);
            }
        };

        fetchTestSeries();
    }, [id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (subjects.length === 0) {
            setError('Please select at least one subject');
            return;
        }

        if (questions.length === 0) {
            setError('Please add at least one question');
            return;
        }

        // Validate all questions
        for (let i = 0; i < questions.length; i++) {
            const q = questions[i];
            if (!q.question.trim()) {
                setError(`Question ${i + 1}: Question text is required`);
                return;
            }
            if (q.options.some(opt => !opt.trim())) {
                setError(`Question ${i + 1}: All options must be filled`);
                return;
            }
        }

        setSaving(true);

        try {
            // Calculate total marks
            const totalMarks = questions.reduce((sum, q) => sum + q.marks, 0);

            // Add IDs to new questions, preserve existing IDs
            const questionsWithIds = questions.map((q, idx) => ({
                ...q,
                id: q.id || `q_${Date.now()}_${idx}`,
            }));

            const testSeriesData = {
                title,
                description,
                subjects,
                questions: questionsWithIds,
                duration,
                totalMarks,
                negativeMarking,
                isFree,
                status,
                updatedAt: Timestamp.now(),
            };

            await updateDoc(doc(db, 'testSeries', id), testSeriesData);

            alert('Test series updated successfully!');
            router.push('/admin/test-series');
        } catch (err: any) {
            console.error('Error updating test series:', err);
            setError('Failed to update test series. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className={styles.loadingContainer}>
                <Loader2 className={styles.spinner} size={48} />
                <p>Loading test series...</p>
            </div>
        );
    }

    if (error && !title) {
        return (
            <div className={styles.container}>
                <div className={styles.errorAlert}>{error}</div>
                <Link href="/admin/test-series" className={styles.backLink}>
                    <ArrowLeft size={18} /> Back to Test Series
                </Link>
            </div>
        );
    }

    return (
        <div>
            <div className={styles.pageHeader}>
                <div>
                    <Link href="/admin/test-series" className={styles.backLink}>
                        <ArrowLeft size={18} /> Back to Test Series
                    </Link>
                    <h1 className={styles.pageTitle}>Edit Test Series</h1>
                    <p className={styles.pageSubtitle}>Update test details and questions</p>
                </div>
            </div>

            {error && (
                <div className={styles.errorAlert}>
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div className={styles.formCard}>
                    <h3 className={styles.sectionTitle}>
                        <FileText size={20} /> Test Details
                    </h3>

                    <div className={styles.formGrid}>
                        <div className={styles.fullWidth}>
                            <label className={styles.label}>Title *</label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="e.g., CUET Mock Test - Full Syllabus"
                                required
                                className={styles.input}
                            />
                        </div>

                        <div className={styles.fullWidth}>
                            <label className={styles.label}>Description *</label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Enter test description..."
                                rows={3}
                                required
                                className={styles.textarea}
                            />
                        </div>

                        <div className={styles.fullWidth}>
                            <SubjectMultiSelect
                                selectedSubjects={subjects}
                                onChange={(s: string[]) => setSubjects(s as Subject[])}
                                label="Subjects *"
                            />
                        </div>

                        <div>
                            <label className={styles.label}>Duration (minutes) *</label>
                            <input
                                type="number"
                                value={duration}
                                onChange={(e) => setDuration(Number(e.target.value))}
                                min="1"
                                required
                                className={styles.input}
                            />
                        </div>

                        <div className={styles.checkboxGroup}>
                            <label className={styles.checkboxLabel}>
                                <input
                                    type="checkbox"
                                    checked={negativeMarking}
                                    onChange={(e) => setNegativeMarking(e.target.checked)}
                                />
                                <span>Enable Negative Marking</span>
                            </label>
                        </div>

                        <div className={styles.checkboxGroup}>
                            <label className={styles.checkboxLabel}>
                                <input
                                    type="checkbox"
                                    checked={isFree}
                                    onChange={(e) => setIsFree(e.target.checked)}
                                />
                                <span>Mark as Free Test</span>
                            </label>
                        </div>

                        <div className={styles.fullWidth}>
                            <label className={styles.label}>Status</label>
                            <select
                                value={status}
                                onChange={(e) => setStatus(e.target.value as 'draft' | 'published')}
                                className={styles.select}
                            >
                                <option value="draft">Draft</option>
                                <option value="published">Published</option>
                            </select>
                        </div>
                    </div>
                </div>

                <QuestionBuilder questions={questions} onChange={setQuestions} />

                <div className={styles.formActions}>
                    <button
                        type="button"
                        onClick={() => router.push('/admin/test-series')}
                        className={styles.cancelBtn}
                        disabled={saving}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className={styles.submitBtn}
                        disabled={saving}
                    >
                        {saving ? (
                            'Saving...'
                        ) : (
                            <>
                                <Save size={18} /> Update Test Series
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}
