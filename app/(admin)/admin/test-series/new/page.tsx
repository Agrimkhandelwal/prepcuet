'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Subject } from '@/lib/constants/subjects';
import { Question } from '@/lib/firestore-schema';
import SubjectMultiSelect from '@/components/admin/SubjectMultiSelect';
import QuestionBuilder from '@/components/admin/QuestionBuilder';
import { ArrowLeft, Save, FileText } from 'lucide-react';
import Link from 'next/link';
import styles from '../../../Admin.module.css';

export default function NewTestSeriesPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Form state
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [subjects, setSubjects] = useState<string[]>([]);
    const [duration, setDuration] = useState(60);
    const [negativeMarking, setNegativeMarking] = useState(true);
    const [isFree, setIsFree] = useState(false);
    const [status, setStatus] = useState<'draft' | 'published'>('draft');
    const [questions, setQuestions] = useState<(Omit<Question, 'id'> & { id?: string })[]>([]);

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

        setLoading(true);

        try {
            // Calculate total marks
            const totalMarks = questions.reduce((sum, q) => sum + q.marks, 0);

            // Add IDs to questions
            const questionsWithIds = questions.map((q, idx) => ({
                ...q,
                id: `q_${Date.now()}_${idx}`,
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
                createdAt: Timestamp.now(),
                updatedAt: Timestamp.now(),
                createdBy: 'admin', // TODO: Get from auth context
            };

            await addDoc(collection(db, 'testSeries'), testSeriesData);

            alert('Test series created successfully!');
            router.push('/admin/test-series');
        } catch (err: any) {
            console.error('Error creating test series:', err);
            setError('Failed to create test series. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div className={styles.pageHeader}>
                <div>
                    <Link href="/admin/test-series" className={styles.backLink}>
                        <ArrowLeft size={18} /> Back to Test Series
                    </Link>
                    <h1 className={styles.pageTitle}>Create New Test Series</h1>
                    <p className={styles.pageSubtitle}>Add a new test with questions for your students</p>
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
                                <option value="draft">Save as Draft</option>
                                <option value="published">Publish Now</option>
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
                        disabled={loading}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className={styles.submitBtn}
                        disabled={loading}
                    >
                        {loading ? (
                            'Saving...'
                        ) : (
                            <>
                                <Save size={18} /> {status === 'published' ? 'Publish Test' : 'Save Draft'}
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}
