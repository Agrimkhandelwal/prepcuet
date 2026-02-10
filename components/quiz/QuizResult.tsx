'use client';
import styles from './Quiz.module.css';
import { useRouter } from 'next/navigation';

interface QuizResultProps {
    score: number;
    totalQuestions: number;
    userName: string;
}

export default function QuizResult({ score, totalQuestions, userName }: QuizResultProps) {
    const router = useRouter();
    const percentage = (score / totalQuestions) * 100;

    let message = '';
    if (percentage >= 80) message = 'Excellent work!';
    else if (percentage >= 60) message = 'Good job, keep improving!';
    else message = 'Need more practice. Keep learning!';

    return (
        <div className={styles.resultWrapper}>
            <h2 className={styles.title}>Quiz Results</h2>
            <p className={styles.subtitle}>Well done, {userName}!</p>

            <div className={styles.scoreCard}>
                <div className={styles.scoreTitle}>Your Score</div>
                <div className={styles.scoreValue}>
                    {score} <span className={styles.totalQuestions}>/ {totalQuestions}</span>
                </div>
            </div>

            <p className={styles.message}>{message}</p>

            <button
                className={styles.primaryBtn}
                onClick={() => router.push('/')}
            >
                Back to Home
            </button>
        </div>
    );
}
