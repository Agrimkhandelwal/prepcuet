'use client';

import { useState } from 'react';
import { Plus, Edit2, Trash2, HelpCircle, CheckCircle, XCircle, ChevronDown, ChevronUp } from 'lucide-react';
import styles from '../../Admin.module.css';

interface Question {
    id: number;
    question: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
}

interface Quiz {
    id: number;
    title: string;
    category: string;
    questions: Question[];
    status: 'Active' | 'Draft';
    date: string;
    attempts: number;
}

const INITIAL_QUIZZES: Quiz[] = [
    {
        id: 1,
        title: 'Daily Current Affairs Quiz - January 30',
        category: 'Current Affairs',
        questions: [
            { id: 1, question: 'Which country hosted the G20 summit in 2024?', options: ['India', 'Brazil', 'Indonesia', 'Japan'], correctAnswer: 1, explanation: 'Brazil hosted the G20 summit in 2024.' },
            { id: 2, question: 'What is the capital of Australia?', options: ['Sydney', 'Melbourne', 'Canberra', 'Perth'], correctAnswer: 2, explanation: 'Canberra is the capital of Australia.' },
        ],
        status: 'Active',
        date: 'Jan 30, 2026',
        attempts: 156
    },
    {
        id: 2,
        title: 'English Grammar Practice',
        category: 'English',
        questions: [
            { id: 1, question: 'Choose the correct form: He ___ to school every day.', options: ['go', 'goes', 'going', 'gone'], correctAnswer: 1, explanation: 'Third person singular uses "goes".' },
        ],
        status: 'Active',
        date: 'Jan 29, 2026',
        attempts: 243
    },
    {
        id: 3,
        title: 'Mathematics Quick Test',
        category: 'Mathematics',
        questions: [],
        status: 'Draft',
        date: 'Jan 28, 2026',
        attempts: 0
    }
];

const CATEGORIES = ['Current Affairs', 'English', 'Mathematics', 'General Aptitude', 'Physics', 'Chemistry', 'Biology'];

export default function QuizzesPage() {
    const [quizzes, setQuizzes] = useState<Quiz[]>(INITIAL_QUIZZES);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingQuiz, setEditingQuiz] = useState<Quiz | null>(null);
    const [expandedQuiz, setExpandedQuiz] = useState<number | null>(null);
    const [formData, setFormData] = useState({
        title: '',
        category: 'Current Affairs',
        status: 'Draft' as 'Active' | 'Draft'
    });
    const [questionForm, setQuestionForm] = useState({
        question: '',
        options: ['', '', '', ''],
        correctAnswer: 0,
        explanation: ''
    });
    const [showQuestionForm, setShowQuestionForm] = useState(false);
    const [editingQuestionId, setEditingQuestionId] = useState<number | null>(null);

    const openModal = (quiz?: Quiz) => {
        if (quiz) {
            setEditingQuiz(quiz);
            setFormData({
                title: quiz.title,
                category: quiz.category,
                status: quiz.status
            });
        } else {
            setEditingQuiz(null);
            setFormData({
                title: '',
                category: 'Current Affairs',
                status: 'Draft'
            });
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingQuiz(null);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingQuiz) {
            setQuizzes(quizzes.map(q =>
                q.id === editingQuiz.id
                    ? { ...q, ...formData }
                    : q
            ));
        } else {
            const newQuiz: Quiz = {
                id: Date.now(),
                ...formData,
                questions: [],
                date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                attempts: 0
            };
            setQuizzes([newQuiz, ...quizzes]);
        }
        closeModal();
    };

    const deleteQuiz = (id: number) => {
        if (confirm('Are you sure you want to delete this quiz?')) {
            setQuizzes(quizzes.filter(q => q.id !== id));
        }
    };

    const addQuestion = (quizId: number) => {
        if (!questionForm.question || questionForm.options.some(o => !o)) return;

        const newQuestion: Question = {
            id: Date.now(),
            ...questionForm
        };

        setQuizzes(quizzes.map(q =>
            q.id === quizId
                ? { ...q, questions: [...q.questions, newQuestion] }
                : q
        ));
        setQuestionForm({ question: '', options: ['', '', '', ''], correctAnswer: 0, explanation: '' });
        setShowQuestionForm(false);
    };

    const deleteQuestion = (quizId: number, questionId: number) => {
        setQuizzes(quizzes.map(q =>
            q.id === quizId
                ? { ...q, questions: q.questions.filter(ques => ques.id !== questionId) }
                : q
        ));
    };

    return (
        <div>
            <div className={styles.pageHeader}>
                <div>
                    <h1 className={styles.pageTitle}>Quiz Management</h1>
                    <p className={styles.pageSubtitle}>Create and manage quizzes for your students</p>
                </div>
                <button className={styles.primaryBtn} onClick={() => openModal()}>
                    <Plus size={18} /> Create Quiz
                </button>
            </div>

            {/* Quizzes List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {quizzes.map((quiz) => (
                    <div key={quiz.id} className={styles.card}>
                        <div
                            className={styles.cardHeader}
                            style={{ cursor: 'pointer' }}
                            onClick={() => setExpandedQuiz(expandedQuiz === quiz.id ? null : quiz.id)}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <HelpCircle size={20} style={{ color: '#8b5cf6' }} />
                                <div>
                                    <h4 className={styles.cardTitle}>{quiz.title}</h4>
                                    <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.25rem' }}>
                                        <span className={`${styles.badge} ${styles.badgeInfo}`}>{quiz.category}</span>
                                        <span className={`${styles.badge} ${quiz.status === 'Active' ? styles.badgeSuccess : styles.badgeWarning}`}>
                                            {quiz.status}
                                        </span>
                                        <span style={{ color: '#64748b', fontSize: '0.8rem' }}>{quiz.questions.length} questions</span>
                                        <span style={{ color: '#64748b', fontSize: '0.8rem' }}>{quiz.attempts} attempts</span>
                                    </div>
                                </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <button className={styles.editBtn} onClick={(e) => { e.stopPropagation(); openModal(quiz); }}>
                                    <Edit2 size={14} /> Edit
                                </button>
                                <button className={styles.deleteBtn} onClick={(e) => { e.stopPropagation(); deleteQuiz(quiz.id); }}>
                                    <Trash2 size={14} />
                                </button>
                                {expandedQuiz === quiz.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                            </div>
                        </div>

                        {expandedQuiz === quiz.id && (
                            <div className={styles.cardBody}>
                                {/* Questions List */}
                                {quiz.questions.length > 0 ? (
                                    <div style={{ marginBottom: '1rem' }}>
                                        {quiz.questions.map((q, idx) => (
                                            <div key={q.id} style={{
                                                padding: '1rem',
                                                background: '#f8fafc',
                                                borderRadius: '8px',
                                                marginBottom: '0.75rem'
                                            }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                                    <strong style={{ color: '#1e293b' }}>Q{idx + 1}: {q.question}</strong>
                                                    <button
                                                        onClick={() => deleteQuestion(quiz.id, q.id)}
                                                        style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem' }}>
                                                    {q.options.map((opt, optIdx) => (
                                                        <div key={optIdx} style={{
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: '0.5rem',
                                                            padding: '0.5rem',
                                                            background: optIdx === q.correctAnswer ? '#dcfce7' : 'white',
                                                            borderRadius: '4px',
                                                            border: `1px solid ${optIdx === q.correctAnswer ? '#10b981' : '#e2e8f0'}`
                                                        }}>
                                                            {optIdx === q.correctAnswer ?
                                                                <CheckCircle size={14} color="#10b981" /> :
                                                                <XCircle size={14} color="#94a3b8" />
                                                            }
                                                            <span style={{ fontSize: '0.85rem' }}>{opt}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                                {q.explanation && (
                                                    <div style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: '#64748b', fontStyle: 'italic' }}>
                                                        💡 {q.explanation}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
                                        No questions added yet
                                    </div>
                                )}

                                {/* Add Question Form */}
                                {showQuestionForm && expandedQuiz === quiz.id ? (
                                    <div style={{
                                        padding: '1rem',
                                        background: '#f8fafc',
                                        borderRadius: '8px',
                                        border: '1px dashed #cbd5e1'
                                    }}>
                                        <div className={styles.formGroup}>
                                            <label className={styles.formLabel}>Question *</label>
                                            <input
                                                type="text"
                                                className={styles.formInput}
                                                value={questionForm.question}
                                                onChange={(e) => setQuestionForm({ ...questionForm, question: e.target.value })}
                                                placeholder="Enter question"
                                            />
                                        </div>
                                        <div className={styles.formGroup}>
                                            <label className={styles.formLabel}>Options *</label>
                                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem' }}>
                                                {questionForm.options.map((opt, idx) => (
                                                    <div key={idx} style={{ display: 'flex', gap: '0.5rem' }}>
                                                        <input
                                                            type="radio"
                                                            name="correct"
                                                            checked={questionForm.correctAnswer === idx}
                                                            onChange={() => setQuestionForm({ ...questionForm, correctAnswer: idx })}
                                                        />
                                                        <input
                                                            type="text"
                                                            className={styles.formInput}
                                                            value={opt}
                                                            onChange={(e) => {
                                                                const newOptions = [...questionForm.options];
                                                                newOptions[idx] = e.target.value;
                                                                setQuestionForm({ ...questionForm, options: newOptions });
                                                            }}
                                                            placeholder={`Option ${idx + 1}`}
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                            <small style={{ color: '#64748b' }}>Select the correct answer using the radio button</small>
                                        </div>
                                        <div className={styles.formGroup}>
                                            <label className={styles.formLabel}>Explanation (Optional)</label>
                                            <input
                                                type="text"
                                                className={styles.formInput}
                                                value={questionForm.explanation}
                                                onChange={(e) => setQuestionForm({ ...questionForm, explanation: e.target.value })}
                                                placeholder="Why is this the correct answer?"
                                            />
                                        </div>
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            <button className={styles.primaryBtn} onClick={() => addQuestion(quiz.id)}>
                                                Add Question
                                            </button>
                                            <button className={styles.secondaryBtn} onClick={() => setShowQuestionForm(false)}>
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <button
                                        className={styles.secondaryBtn}
                                        onClick={() => { setShowQuestionForm(true); setExpandedQuiz(quiz.id); }}
                                        style={{ width: '100%' }}
                                    >
                                        <Plus size={16} /> Add Question
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Create/Edit Quiz Modal */}
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
                        maxWidth: '500px'
                    }}>
                        <div style={{ padding: '1.5rem', borderBottom: '1px solid #e2e8f0' }}>
                            <h2 style={{ margin: 0, color: '#1e293b' }}>
                                {editingQuiz ? 'Edit Quiz' : 'Create New Quiz'}
                            </h2>
                        </div>
                        <form onSubmit={handleSubmit} style={{ padding: '1.5rem' }}>
                            <div className={styles.formGroup}>
                                <label className={styles.formLabel}>Quiz Title *</label>
                                <input
                                    type="text"
                                    className={styles.formInput}
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    placeholder="e.g., Daily Current Affairs Quiz"
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
                                        {CATEGORIES.map(cat => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className={styles.formGroup}>
                                    <label className={styles.formLabel}>Status *</label>
                                    <select
                                        className={styles.formSelect}
                                        value={formData.status}
                                        onChange={(e) => setFormData({ ...formData, status: e.target.value as 'Active' | 'Draft' })}
                                    >
                                        <option value="Draft">Draft</option>
                                        <option value="Active">Active</option>
                                    </select>
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                                <button type="button" className={styles.secondaryBtn} onClick={closeModal}>
                                    Cancel
                                </button>
                                <button type="submit" className={styles.primaryBtn}>
                                    {editingQuiz ? 'Update Quiz' : 'Create Quiz'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
