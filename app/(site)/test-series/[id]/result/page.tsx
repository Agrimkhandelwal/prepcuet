'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useParams, useSearchParams } from 'next/navigation';
import {
    ArrowLeft, CheckCircle, XCircle, MinusCircle, Clock,
    RotateCcw, Download, Share2, Target, TrendingUp, ChevronDown, ChevronUp
} from 'lucide-react';
import {
    collection, query, where, orderBy, getDocs, doc, getDoc
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/hooks/useAuth';
import styles from './Result.module.css';

interface StoredQuestion {
    id: string | number;
    question: string;
    options: string[];
    answer: number;
    explanation?: string | null;
    subject?: string | null;
}

interface StoredAnswer {
    questionId: string | number;
    selectedOption: number | null;
    isCorrect: boolean;
    marksAwarded: number;
}

interface StoredResult {
    resultId: string;
    testId: string;
    testTitle: string;
    score: number;
    totalMarks: number;
    correct: number;
    wrong: number;
    skipped: number;
    timeSpent: number;
    answeredCount: number;
    answers: StoredAnswer[];
    questions: StoredQuestion[];
}

type FilterType = 'all' | 'correct' | 'wrong' | 'skipped';

export default function ResultPage() {
    const params = useParams();
    const searchParams = useSearchParams();
    const testId = params.id as string;
    const { user } = useAuth();

    const [result, setResult] = useState<StoredResult | null>(null);
    const [filter, setFilter] = useState<FilterType>('all');
    const [expandedExplanations, setExpandedExplanations] = useState<Set<number>>(new Set());
    const [rank, setRank] = useState<number | null>(null);
    const [totalAttempts, setTotalAttempts] = useState<number>(0);
    const [loading, setLoading] = useState(true);

    // Load result from localStorage (saved by exam page on submit)
    useEffect(() => {
        const stored = localStorage.getItem('lastTestResult');
        if (stored) {
            const parsed = JSON.parse(stored);
            // Verify it's for this test
            if (!parsed.testId || parsed.testId === testId) {
                setResult(parsed);
            }
        }
        setLoading(false);
    }, [testId]);

    // Fetch leaderboard rank from Firestore
    useEffect(() => {
        if (!result || !user) return;
        const fetchRank = async () => {
            try {
                const q = query(
                    collection(db, 'testResults'),
                    where('testId', '==', testId),
                    where('status', '==', 'available')
                );
                const snap = await getDocs(q);
                const scores = snap.docs.map(d => d.data().score as number).sort((a, b) => b - a);
                setTotalAttempts(scores.length);
                const pos = scores.findIndex(s => s <= result.score);
                setRank(pos === -1 ? scores.length + 1 : pos + 1);
            } catch (err) {
                console.error('Error fetching rank:', err);
            }
        };
        fetchRank();
    }, [result, user, testId]);

    const toggleExplanation = (idx: number) => {
        setExpandedExplanations(prev => {
            const next = new Set(prev);
            if (next.has(idx)) next.delete(idx); else next.add(idx);
            return next;
        });
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}m ${secs}s`;
    };

    // Download Report as HTML → print to PDF
    const handleDownload = useCallback(() => {
        if (!result) return;
        const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${result.testTitle} - Result Report</title>
  <style>
    body { font-family: Arial, sans-serif; max-width: 900px; margin: 0 auto; padding: 24px; color: #1e293b; }
    h1 { color: #1a237e; margin-bottom: 4px; }
    .subtitle { color: #64748b; margin-bottom: 24px; }
    .stats { display: flex; gap: 16px; flex-wrap: wrap; margin-bottom: 24px; }
    .stat { background: #f1f5f9; border-radius: 8px; padding: 12px 20px; min-width: 100px; text-align: center; }
    .stat .val { font-size: 24px; font-weight: 700; color: #1a237e; }
    .stat .lbl { font-size: 12px; color: #64748b; text-transform: uppercase; }
    .question { border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin-bottom: 16px; page-break-inside: avoid; }
    .q-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
    .badge { padding: 2px 8px; border-radius: 4px; font-size: 12px; font-weight: 600; }
    .correct-badge { background: #d1fae5; color: #065f46; }
    .wrong-badge { background: #fee2e2; color: #991b1b; }
    .skipped-badge { background: #f1f5f9; color: #475569; }
    .q-text { font-size: 15px; margin-bottom: 12px; }
    .option { padding: 8px 12px; border-radius: 6px; margin-bottom: 6px; font-size: 14px; }
    .opt-correct { background: #d1fae5; border-left: 3px solid #10b981; }
    .opt-wrong { background: #fee2e2; border-left: 3px solid #ef4444; }
    .opt-neutral { background: #f8fafc; }
    .explanation { background: #fffbeb; border-left: 3px solid #f59e0b; padding: 10px 14px; border-radius: 6px; margin-top: 10px; font-size: 13px; color: #92400e; }
    @media print { .question { page-break-inside: avoid; } }
  </style>
</head>
<body>
  <h1>${result.testTitle}</h1>
  <div class="subtitle">PrepCUET Result Report — ${new Date().toLocaleDateString('en-IN', { dateStyle: 'long' })}</div>
  <div class="stats">
    <div class="stat"><div class="val">${result.score}</div><div class="lbl">Score</div></div>
    <div class="stat"><div class="val">${result.correct}</div><div class="lbl">Correct</div></div>
    <div class="stat"><div class="val">${result.wrong}</div><div class="lbl">Wrong</div></div>
    <div class="stat"><div class="val">${result.skipped}</div><div class="lbl">Skipped</div></div>
    <div class="stat"><div class="val">${formatTime(result.timeSpent)}</div><div class="lbl">Time</div></div>
    <div class="stat"><div class="val">${Math.round(result.correct / result.questions.length * 100)}%</div><div class="lbl">Accuracy</div></div>
  </div>
  ${result.questions.map((q, i) => {
            const ans = result.answers[i];
            const selected = ans?.selectedOption;
            const correct = q.answer;
            const status = selected === null || selected === undefined ? 'skipped' : selected === correct ? 'correct' : 'wrong';
            return `
  <div class="question">
    <div class="q-header">
      <strong>Q${i + 1}${q.subject ? ` · ${q.subject}` : ''}</strong>
      <span class="badge ${status}-badge">${status === 'correct' ? '✓ Correct' : status === 'wrong' ? '✗ Wrong' : '− Skipped'}</span>
    </div>
    <div class="q-text">${q.question}</div>
    ${q.options.map((opt, oi) => {
                const cls = oi === correct ? 'opt-correct' : (oi === selected && selected !== correct) ? 'opt-wrong' : 'opt-neutral';
                return `<div class="option ${cls}">${String.fromCharCode(65 + oi)}. ${opt}${oi === correct ? ' ✓' : ''}${oi === selected && selected !== correct ? ' ✗' : ''}</div>`;
            }).join('')}
    ${q.explanation ? `<div class="explanation">💡 ${q.explanation}</div>` : ''}
  </div>`;
        }).join('')}
</body></html>`;

        const blob = new Blob([html], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${result.testTitle.replace(/\s+/g, '_')}_Result.html`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }, [result]);

    if (loading) {
        return (
            <div className={styles.resultPage}>
                <div style={{ textAlign: 'center', padding: '4rem' }}>
                    <div style={{ width: 40, height: 40, border: '4px solid #e0e7ff', borderTopColor: '#1a237e', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto' }} />
                    <p style={{ marginTop: '1rem', color: '#64748b' }}>Loading results...</p>
                    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                </div>
            </div>
        );
    }

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

    const percentage = result.totalMarks > 0 ? Math.round((result.correct / result.questions.length) * 100) : 0;
    const attemptRate = result.questions.length > 0 ? Math.round(((result.correct + result.wrong) / result.questions.length) * 100) : 0;

    const filteredPairs = result.questions.map((q, i) => ({ q, ans: result.answers[i], idx: i })).filter(({ ans }) => {
        const selected = ans?.selectedOption;
        const status = selected === null || selected === undefined ? 'skipped' : ans?.isCorrect ? 'correct' : 'wrong';
        if (filter === 'all') return true;
        return filter === status;
    });

    // Re-derive status cleanly
    const getPairStatus = (q: StoredQuestion, ans: StoredAnswer) => {
        const selected = ans?.selectedOption;
        if (selected === null || selected === undefined) return 'skipped';
        return selected === q.answer ? 'correct' : 'wrong';
    };

    const allPairs = result.questions.map((q, i) => ({ q, ans: result.answers[i], idx: i }));
    const displayed = filter === 'all' ? allPairs
        : allPairs.filter(({ q, ans }) => getPairStatus(q, ans) === filter);

    return (
        <div className={styles.resultPage}>
            <div className="container">
                {/* Header */}
                <div className={styles.header}>
                    <Link href="/test-series" className={styles.backLink}>
                        <ArrowLeft size={16} /> Back to Test Series
                    </Link>
                    <h1 className={styles.title}>Test Results</h1>
                    <p className={styles.subtitle}>{result.testTitle}</p>
                </div>

                {/* Score Card */}
                <div className={styles.scoreCard} style={{ '--percentage': Math.round((result.score / result.totalMarks) * 100) } as React.CSSProperties}>
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
                                <div className={styles.detailIcon} style={{ background: 'rgba(16,185,129,0.2)' }}><CheckCircle size={24} color="#10b981" /></div>
                                <span className={styles.detailValue} style={{ color: '#10b981' }}>{result.correct}</span>
                                <span className={styles.detailLabel}>Correct</span>
                            </div>
                            <div className={styles.detailCard}>
                                <div className={styles.detailIcon} style={{ background: 'rgba(239,68,68,0.2)' }}><XCircle size={24} color="#ef4444" /></div>
                                <span className={styles.detailValue} style={{ color: '#ef4444' }}>{result.wrong}</span>
                                <span className={styles.detailLabel}>Wrong</span>
                            </div>
                            <div className={styles.detailCard}>
                                <div className={styles.detailIcon} style={{ background: 'rgba(148,163,184,0.2)' }}><MinusCircle size={24} color="#94a3b8" /></div>
                                <span className={styles.detailValue} style={{ color: '#94a3b8' }}>{result.skipped}</span>
                                <span className={styles.detailLabel}>Skipped</span>
                            </div>
                            <div className={styles.detailCard}>
                                <div className={styles.detailIcon} style={{ background: 'rgba(245,158,11,0.2)' }}><Clock size={24} color="#f59e0b" /></div>
                                <span className={styles.detailValue} style={{ color: '#f59e0b' }}>{formatTime(result.timeSpent)}</span>
                                <span className={styles.detailLabel}>Time Taken</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Summary Cards */}
                <div className={styles.summaryGrid}>
                    <div className={styles.summaryCard}>
                        <div className={styles.summaryIconWrapper} style={{ background: '#dbeafe' }}><Target size={28} color="#2563eb" /></div>
                        <span className={styles.summaryValue}>{percentage}%</span>
                        <span className={styles.summaryLabel}>Accuracy</span>
                    </div>
                    <div className={styles.summaryCard}>
                        <div className={styles.summaryIconWrapper} style={{ background: '#fef3c7' }}><TrendingUp size={28} color="#f59e0b" /></div>
                        <span className={styles.summaryValue}>
                            {rank !== null ? `#${rank}` : '—'}
                        </span>
                        <span className={styles.summaryLabel}>Your Rank {totalAttempts > 0 ? `(of ${totalAttempts})` : ''}</span>
                    </div>
                    <div className={styles.summaryCard}>
                        <div className={styles.summaryIconWrapper} style={{ background: '#dcfce7' }}><CheckCircle size={28} color="#10b981" /></div>
                        <span className={styles.summaryValue}>{attemptRate}%</span>
                        <span className={styles.summaryLabel}>Attempt Rate</span>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className={styles.actions}>
                    <Link href="/test-series" className={`${styles.actionBtn} ${styles.primaryBtn}`}>
                        <RotateCcw size={18} /> Take Another Test
                    </Link>
                    <button className={`${styles.actionBtn} ${styles.secondaryBtn}`} onClick={handleDownload}>
                        <Download size={18} /> Download Report
                    </button>
                    <button className={`${styles.actionBtn} ${styles.secondaryBtn}`} onClick={() => {
                        const text = `I scored ${result.score}/${result.totalMarks} on "${result.testTitle}" on PrepCUET! 🎯`;
                        navigator.clipboard?.writeText(text).then(() => alert('Result copied to clipboard!'));
                    }}>
                        <Share2 size={18} /> Share Result
                    </button>
                </div>

                {/* Answer Review */}
                <div className={styles.reviewSection}>
                    <div className={styles.reviewHeader}>
                        <h2 className={styles.reviewTitle}>Answer Review</h2>
                        <div className={styles.filterBtns}>
                            {(['all', 'correct', 'wrong', 'skipped'] as FilterType[]).map(f => (
                                <button
                                    key={f}
                                    className={`${styles.filterBtn} ${filter === f ? styles.filterBtnActive : ''}`}
                                    onClick={() => setFilter(f)}
                                >
                                    {f === 'all' && `All (${result.questions.length})`}
                                    {f === 'correct' && `✓ Correct (${result.correct})`}
                                    {f === 'wrong' && `✗ Wrong (${result.wrong})`}
                                    {f === 'skipped' && `− Skipped (${result.skipped})`}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className={styles.questionReviewList}>
                        {displayed.map(({ q, ans, idx }) => {
                            const selected = ans?.selectedOption;
                            const status = getPairStatus(q, ans);
                            const isExpanded = expandedExplanations.has(idx);

                            return (
                                <div key={idx} className={styles.questionReview}>
                                    <div className={styles.reviewCardHeader}>
                                        <div className={styles.qNumber}>
                                            <span className={`${styles.qBadge} ${status === 'correct' ? styles.qBadgeCorrect : status === 'wrong' ? styles.qBadgeWrong : styles.qBadgeSkipped}`}>
                                                {idx + 1}
                                            </span>
                                            <span style={{ color: '#64748b', fontSize: '0.85rem' }}>
                                                {q.subject || 'Question'}
                                            </span>
                                        </div>
                                        <span className={`${styles.statusBadge} ${status === 'correct' ? styles.statusCorrect : status === 'wrong' ? styles.statusWrong : styles.statusSkipped}`}>
                                            {status === 'correct' ? '✓ Correct' : status === 'wrong' ? '✗ Incorrect' : '− Skipped'}
                                        </span>
                                    </div>
                                    <div className={styles.reviewCardBody}>
                                        <p className={styles.reviewQuestion}>{q.question}</p>
                                        <div className={styles.reviewOptions}>
                                            {q.options.map((opt, oi) => {
                                                const isCorrectOpt = oi === q.answer;
                                                const isWrongSelected = selected === oi && oi !== q.answer;
                                                const isUserSelected = selected === oi;
                                                return (
                                                    <div
                                                        key={oi}
                                                        className={`${styles.reviewOption} ${isCorrectOpt ? styles.correct : ''} ${isWrongSelected ? styles.wrong : ''}`}
                                                    >
                                                        <span className={styles.optionIndicator}>
                                                            {isCorrectOpt ? <CheckCircle size={14} /> : isWrongSelected ? <XCircle size={14} /> : String.fromCharCode(65 + oi)}
                                                        </span>
                                                        <span className={styles.optionText}>{opt}</span>
                                                        {isCorrectOpt && <span style={{ marginLeft: 'auto', fontSize: '0.75rem', color: '#10b981', fontWeight: 600 }}>Correct Answer</span>}
                                                        {isWrongSelected && <span style={{ marginLeft: 'auto', fontSize: '0.75rem', color: '#ef4444', fontWeight: 600 }}>Your Answer</span>}
                                                    </div>
                                                );
                                            })}
                                        </div>

                                        {/* Explanation */}
                                        {q.explanation && (
                                            <div style={{ marginTop: '0.75rem' }}>
                                                <button
                                                    onClick={() => toggleExplanation(idx)}
                                                    style={{
                                                        display: 'flex', alignItems: 'center', gap: '0.4rem',
                                                        background: 'none', border: 'none', color: '#f59e0b',
                                                        fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer', padding: 0
                                                    }}
                                                >
                                                    💡 Explanation {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                                                </button>
                                                {isExpanded && (
                                                    <div style={{
                                                        background: '#fffbeb', border: '1px solid #fde68a',
                                                        borderRadius: '8px', padding: '0.75rem 1rem',
                                                        marginTop: '0.5rem', fontSize: '0.875rem', color: '#92400e', lineHeight: 1.6
                                                    }}>
                                                        {q.explanation}
                                                    </div>
                                                )}
                                            </div>
                                        )}
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
