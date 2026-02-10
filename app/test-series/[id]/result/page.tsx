'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
    ArrowLeft,
    CheckCircle,
    XCircle,
    MinusCircle,
    Clock,
    RotateCcw,
    Download,
    Share2,
    Target,
    TrendingUp
} from 'lucide-react';
import { QUIZ_QUESTIONS } from '@/lib/quiz-data';
import styles from './Result.module.css';

interface TestResult {
    testId: string;
    score: number;
    totalMarks: number;
    correct: number;
    wrong: number;
    skipped: number;
    timeSpent: number;
    answers: {
        questionId: number;
        selected: number | null;
        correct: number;
    }[];
}

type FilterType = 'all' | 'correct' | 'wrong' | 'skipped';

export default function ResultPage() {
    const params = useParams();
    const [result, setResult] = useState<TestResult | null>(null);
    const [filter, setFilter] = useState<FilterType>('all');

    useEffect(() => {
        const stored = localStorage.getItem('lastTestResult');
        if (stored) {
            setResult(JSON.parse(stored));
        }
    }, []);

    if (!result) {
        return (
            <div className={styles.resultPage}>
                <div className="container" style={{ textAlign: 'center', padding: '4rem' }}>
                    <h2>No result found</h2>
                    <p>Please take a test first</p>
                    <Link href="/test-series" className={`${styles.actionBtn} ${styles.primaryBtn}`} style={{ marginTop: '1rem' }}>
                        Go to Test Series
                    </Link>
                </div>
            </div>
        );
    }

    const percentage = Math.round((result.score / result.totalMarks) * 100);
    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}m ${secs}s`;
    };

    // Filter questions
    const filteredQuestions = result.answers.filter((answer) => {
        if (filter === 'all') return true;
        if (filter === 'correct') return answer.selected === answer.correct;
        if (filter === 'wrong') return answer.selected !== null && answer.selected !== answer.correct;
        if (filter === 'skipped') return answer.selected === null;
        return true;
    });

    // Get question status
    const getStatus = (answer: { selected: number | null; correct: number }) => {
        if (answer.selected === null) return 'skipped';
        if (answer.selected === answer.correct) return 'correct';
        return 'wrong';
    };

    return (
        <div className={styles.resultPage}>
            <div className="container">
                {/* Header */}
                <div className={styles.header}>
                    <Link href="/test-series" className={styles.backLink}>
                        <ArrowLeft size={16} /> Back to Test Series
                    </Link>
                    <h1 className={styles.title}>Test Results</h1>
                    <p className={styles.subtitle}>CUET Mock Test - Full Syllabus</p>
                </div>

                {/* Score Card */}
                <div className={styles.scoreCard} style={{ '--percentage': percentage } as React.CSSProperties}>
                    <div className={styles.scoreContent}>
                        <div className={styles.scoreCircleWrapper}>
                            <div className={styles.scoreCircle}>
                                <div className={styles.scoreInner}>
                                    <span className={styles.scoreValue}>{result.score}</span>
                                    <span className={styles.scoreTotal}>/ {result.totalMarks}</span>
                                </div>
                            </div>
                        </div>
                        <div className={styles.scoreDetails}>
                            <div className={styles.detailCard}>
                                <div className={styles.detailIcon} style={{ background: 'rgba(16, 185, 129, 0.2)' }}>
                                    <CheckCircle size={24} color="#10b981" />
                                </div>
                                <span className={styles.detailValue} style={{ color: '#10b981' }}>{result.correct}</span>
                                <span className={styles.detailLabel}>Correct</span>
                            </div>
                            <div className={styles.detailCard}>
                                <div className={styles.detailIcon} style={{ background: 'rgba(239, 68, 68, 0.2)' }}>
                                    <XCircle size={24} color="#ef4444" />
                                </div>
                                <span className={styles.detailValue} style={{ color: '#ef4444' }}>{result.wrong}</span>
                                <span className={styles.detailLabel}>Wrong</span>
                            </div>
                            <div className={styles.detailCard}>
                                <div className={styles.detailIcon} style={{ background: 'rgba(148, 163, 184, 0.2)' }}>
                                    <MinusCircle size={24} color="#94a3b8" />
                                </div>
                                <span className={styles.detailValue} style={{ color: '#94a3b8' }}>{result.skipped}</span>
                                <span className={styles.detailLabel}>Skipped</span>
                            </div>
                            <div className={styles.detailCard}>
                                <div className={styles.detailIcon} style={{ background: 'rgba(245, 158, 11, 0.2)' }}>
                                    <Clock size={24} color="#f59e0b" />
                                </div>
                                <span className={styles.detailValue} style={{ color: '#f59e0b' }}>{formatTime(result.timeSpent)}</span>
                                <span className={styles.detailLabel}>Time Taken</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Summary Cards */}
                <div className={styles.summaryGrid}>
                    <div className={styles.summaryCard}>
                        <div className={styles.summaryIconWrapper} style={{ background: '#dbeafe' }}>
                            <Target size={28} color="#2563eb" />
                        </div>
                        <span className={styles.summaryValue}>{percentage}%</span>
                        <span className={styles.summaryLabel}>Accuracy</span>
                    </div>
                    <div className={styles.summaryCard}>
                        <div className={styles.summaryIconWrapper} style={{ background: '#fef3c7' }}>
                            <TrendingUp size={28} color="#f59e0b" />
                        </div>
                        <span className={styles.summaryValue}>#{Math.floor(Math.random() * 100) + 1}</span>
                        <span className={styles.summaryLabel}>Your Rank</span>
                    </div>
                    <div className={styles.summaryCard}>
                        <div className={styles.summaryIconWrapper} style={{ background: '#dcfce7' }}>
                            <CheckCircle size={28} color="#10b981" />
                        </div>
                        <span className={styles.summaryValue}>
                            {Math.round((result.correct / QUIZ_QUESTIONS.length) * 100)}%
                        </span>
                        <span className={styles.summaryLabel}>Attempt Rate</span>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className={styles.actions}>
                    <Link href="/test-series" className={`${styles.actionBtn} ${styles.primaryBtn}`}>
                        <RotateCcw size={18} /> Take Another Test
                    </Link>
                    <button className={`${styles.actionBtn} ${styles.secondaryBtn}`}>
                        <Download size={18} /> Download Report
                    </button>
                    <button className={`${styles.actionBtn} ${styles.secondaryBtn}`}>
                        <Share2 size={18} /> Share Result
                    </button>
                </div>

                {/* Answer Review */}
                <div className={styles.reviewSection}>
                    <div className={styles.reviewHeader}>
                        <h2 className={styles.reviewTitle}>Answer Review</h2>
                        <div className={styles.filterBtns}>
                            <button
                                className={`${styles.filterBtn} ${filter === 'all' ? styles.filterBtnActive : ''}`}
                                onClick={() => setFilter('all')}
                            >
                                All ({result.answers.length})
                            </button>
                            <button
                                className={`${styles.filterBtn} ${filter === 'correct' ? styles.filterBtnActive : ''}`}
                                onClick={() => setFilter('correct')}
                            >
                                ✓ Correct ({result.correct})
                            </button>
                            <button
                                className={`${styles.filterBtn} ${filter === 'wrong' ? styles.filterBtnActive : ''}`}
                                onClick={() => setFilter('wrong')}
                            >
                                ✗ Wrong ({result.wrong})
                            </button>
                            <button
                                className={`${styles.filterBtn} ${filter === 'skipped' ? styles.filterBtnActive : ''}`}
                                onClick={() => setFilter('skipped')}
                            >
                                − Skipped ({result.skipped})
                            </button>
                        </div>
                    </div>

                    <div className={styles.questionReviewList}>
                        {filteredQuestions.map((answer, idx) => {
                            const question = QUIZ_QUESTIONS.find(q => q.id === answer.questionId) || QUIZ_QUESTIONS[idx];
                            const status = getStatus(answer);

                            return (
                                <div key={answer.questionId} className={styles.questionReview}>
                                    <div className={styles.reviewCardHeader}>
                                        <div className={styles.qNumber}>
                                            <span className={`${styles.qBadge} ${status === 'correct' ? styles.qBadgeCorrect :
                                                    status === 'wrong' ? styles.qBadgeWrong :
                                                        styles.qBadgeSkipped
                                                }`}>
                                                {idx + 1}
                                            </span>
                                            <span style={{ color: '#64748b', fontSize: '0.85rem' }}>Question</span>
                                        </div>
                                        <span className={`${styles.statusBadge} ${status === 'correct' ? styles.statusCorrect :
                                                status === 'wrong' ? styles.statusWrong :
                                                    styles.statusSkipped
                                            }`}>
                                            {status === 'correct' ? '✓ Correct' :
                                                status === 'wrong' ? '✗ Incorrect' :
                                                    '− Skipped'}
                                        </span>
                                    </div>
                                    <div className={styles.reviewCardBody}>
                                        <p className={styles.reviewQuestion}>{question.question}</p>
                                        <div className={styles.reviewOptions}>
                                            {question.options.map((opt, optIdx) => {
                                                const isCorrect = optIdx === answer.correct;
                                                const isWrongSelected = answer.selected === optIdx && optIdx !== answer.correct;

                                                return (
                                                    <div
                                                        key={optIdx}
                                                        className={`${styles.reviewOption} ${isCorrect ? styles.correct : ''} ${isWrongSelected ? styles.wrong : ''}`}
                                                    >
                                                        <span className={styles.optionIndicator}>
                                                            {isCorrect ? <CheckCircle size={14} /> :
                                                                isWrongSelected ? <XCircle size={14} /> :
                                                                    String.fromCharCode(65 + optIdx)}
                                                        </span>
                                                        <span className={styles.optionText}>{opt}</span>
                                                        {isCorrect && <span style={{ marginLeft: 'auto', fontSize: '0.75rem', color: '#10b981', fontWeight: 600 }}>Correct Answer</span>}
                                                        {isWrongSelected && <span style={{ marginLeft: 'auto', fontSize: '0.75rem', color: '#ef4444', fontWeight: 600 }}>Your Answer</span>}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
