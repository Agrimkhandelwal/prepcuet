'use client';

import { useState } from 'react';
import { Plus, Trash2, GripVertical } from 'lucide-react';
import { Question } from '@/lib/firestore-schema';
import { Subject, SUBJECTS } from '@/lib/constants/subjects';
import styles from './QuestionBuilder.module.css';

interface QuestionBuilderProps {
    questions: (Omit<Question, 'id'> & { id?: string })[];
    onChange: (questions: (Omit<Question, 'id'> & { id?: string })[]) => void;
}

export default function QuestionBuilder({ questions, onChange }: QuestionBuilderProps) {
    const addQuestion = () => {
        const newQuestion: Omit<Question, 'id'> & { id?: string } = {
            question: '',
            options: ['', '', '', ''],
            answer: 0,
            marks: 4,
            negativeMarks: -1,
            subject: 'General Test',
            explanation: '',
        };
        onChange([...questions, newQuestion]);
    };

    const removeQuestion = (index: number) => {
        onChange(questions.filter((_, i) => i !== index));
    };

    const updateQuestion = (index: number, field: keyof (Omit<Question, 'id'> & { id?: string }), value: any) => {
        const updated = questions.map((q, i) => {
            if (i === index) {
                return { ...q, [field]: value };
            }
            return q;
        });
        onChange(updated);
    };

    const updateOption = (questionIndex: number, optionIndex: number, value: string) => {
        const updated = questions.map((q, i) => {
            if (i === questionIndex) {
                const newOptions = [...q.options];
                newOptions[optionIndex] = value;
                return { ...q, options: newOptions };
            }
            return q;
        });
        onChange(updated);
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const json = JSON.parse(event.target?.result as string);
                if (!Array.isArray(json)) {
                    alert('Invalid format: Expected an array of questions');
                    return;
                }

                // Basic validation
                const validQuestions = json.filter(q =>
                    q.question &&
                    Array.isArray(q.options) &&
                    q.options.length === 4 &&
                    typeof q.answer === 'number'
                ).map(q => ({
                    ...q,
                    marks: q.marks || 4,
                    negativeMarks: q.negativeMarks || -1,
                    subject: q.subject || 'General Test',
                }));

                if (validQuestions.length === 0) {
                    alert('No valid questions found in the file');
                    return;
                }

                if (confirm(`Found ${validQuestions.length} valid questions. Add them to existing questions?`)) {
                    onChange([...questions, ...validQuestions]);
                }
            } catch (err) {
                console.error('Import error:', err);
                alert('Failed to parse JSON file');
            }
            // Reset input
            e.target.value = '';
        };
        reader.readAsText(file);
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h3>Questions ({questions.length})</h3>
                <div className={styles.headerActions}>
                    <label className={styles.importBtn}>
                        <input
                            type="file"
                            accept=".json"
                            onChange={handleFileUpload}
                            style={{ display: 'none' }}
                        />
                        Import JSON
                    </label>
                    <button
                        type="button"
                        onClick={addQuestion}
                        className={styles.addBtn}
                    >
                        <Plus size={18} /> Add Question
                    </button>
                </div>
            </div>

            {questions.length === 0 ? (
                <div className={styles.emptyState}>
                    <p>No questions added yet. Click "Add Question" to get started.</p>
                </div>
            ) : (
                <div className={styles.questionsList}>
                    {questions.map((question, qIdx) => (
                        <div key={qIdx} className={styles.questionCard}>
                            <div className={styles.questionHeader}>
                                <div className={styles.dragHandle}>
                                    <GripVertical size={20} />
                                    <span className={styles.questionNumber}>Q{qIdx + 1}</span>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => removeQuestion(qIdx)}
                                    className={styles.deleteBtn}
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>

                            <div className={styles.formGrid}>
                                {/* Question Text */}
                                <div className={styles.fullWidth}>
                                    <label>Question *</label>
                                    <textarea
                                        value={question.question}
                                        onChange={(e) => updateQuestion(qIdx, 'question', e.target.value)}
                                        placeholder="Enter your question here..."
                                        rows={3}
                                        required
                                    />
                                </div>

                                {/* Options */}
                                <div className={styles.fullWidth}>
                                    <label>Options *</label>
                                    <div className={styles.optionsGrid}>
                                        {question.options.map((option, oIdx) => (
                                            <div key={oIdx} className={styles.optionRow}>
                                                <input
                                                    type="radio"
                                                    name={`correct-${qIdx}`}
                                                    checked={question.answer === oIdx}
                                                    onChange={() => updateQuestion(qIdx, 'answer', oIdx)}
                                                    title="Mark as correct answer"
                                                />
                                                <span className={styles.optionLabel}>{String.fromCharCode(65 + oIdx)}.</span>
                                                <input
                                                    type="text"
                                                    value={option}
                                                    onChange={(e) => updateOption(qIdx, oIdx, e.target.value)}
                                                    placeholder={`Option ${String.fromCharCode(65 + oIdx)}`}
                                                    required
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Subject */}
                                <div>
                                    <label>Subject *</label>
                                    <select
                                        value={question.subject}
                                        onChange={(e) => updateQuestion(qIdx, 'subject', e.target.value as Subject)}
                                        required
                                    >
                                        {SUBJECTS.map(subject => (
                                            <option key={subject} value={subject}>{subject}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Marks */}
                                <div>
                                    <label>Marks *</label>
                                    <input
                                        type="number"
                                        value={question.marks}
                                        onChange={(e) => updateQuestion(qIdx, 'marks', Number(e.target.value))}
                                        min="1"
                                        required
                                    />
                                </div>

                                {/* Negative Marks */}
                                <div>
                                    <label>Negative Marks</label>
                                    <input
                                        type="number"
                                        value={question.negativeMarks}
                                        onChange={(e) => updateQuestion(qIdx, 'negativeMarks', Number(e.target.value))}
                                        max="0"
                                    />
                                </div>

                                {/* Explanation (Optional) */}
                                <div className={styles.fullWidth}>
                                    <label>Explanation (Optional)</label>
                                    <textarea
                                        value={question.explanation || ''}
                                        onChange={(e) => updateQuestion(qIdx, 'explanation', e.target.value)}
                                        placeholder="Provide an explanation for the correct answer..."
                                        rows={2}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
