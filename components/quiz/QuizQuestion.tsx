'use client';
import { Question } from '@/lib/quiz-data';
import styles from './Quiz.module.css';

interface QuizQuestionProps {
    question: Question;
    currentQuestionIndex: number;
    totalQuestions: number;
    selectedOption: number | null;
    onSelectOption: (optionIndex: number) => void;
    onNext: () => void;
}

export default function QuizQuestion({
    question,
    currentQuestionIndex,
    totalQuestions,
    selectedOption,
    onSelectOption,
    onNext
}: QuizQuestionProps) {
    return (
        <div className={styles.questionWrapper}>
            <div className={styles.header}>
                <span className={styles.progress}>
                    Question {currentQuestionIndex + 1} of {totalQuestions}
                </span>
                <span className={styles.timer}>Time: --:--</span>
            </div>

            <h2 className={styles.questionText}>
                {question.id}. {question.question}
            </h2>

            <div className={styles.optionsGrid}>
                {question.options.map((option, index) => (
                    <button
                        key={index}
                        className={`${styles.optionBtn} ${selectedOption === index ? styles.selected : ''}`}
                        onClick={() => onSelectOption(index)}
                    >
                        {String.fromCharCode(65 + index)}. {option}
                    </button>
                ))}
            </div>

            <div className={styles.navigation}>
                <button
                    className={styles.primaryBtn}
                    onClick={onNext}
                    disabled={selectedOption === null}
                >
                    {currentQuestionIndex === totalQuestions - 1 ? 'Finish Quiz' : 'Next Question'}
                </button>
            </div>
        </div>
    );
}
