'use client';
import { useState } from 'react';
import { QUIZ_QUESTIONS } from '@/lib/quiz-data';
import QuizLogin from './QuizLogin';
import QuizQuestion from './QuizQuestion';
import QuizResult from './QuizResult';
import styles from './Quiz.module.css';

export default function QuizContainer() {
    const [step, setStep] = useState<'login' | 'quiz' | 'result'>('login');
    const [userName, setUserName] = useState('');
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});

    const handleLogin = (name: string) => {
        setUserName(name);
        setStep('quiz');
    };

    const handleSelectOption = (optionIndex: number) => {
        setUserAnswers(prev => ({
            ...prev,
            [QUIZ_QUESTIONS[currentQuestionIndex].id]: optionIndex
        }));
    };

    const handleNext = () => {
        if (currentQuestionIndex < QUIZ_QUESTIONS.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
        } else {
            setStep('result');
        }
    };

    const calculateScore = () => {
        let score = 0;
        QUIZ_QUESTIONS.forEach(q => {
            if (userAnswers[q.id] === q.answer) {
                score++;
            }
        });
        return score;
    };

    return (
        <div className={styles.quizContainer}>
            {step === 'login' && (
                <QuizLogin onStart={handleLogin} />
            )}

            {step === 'quiz' && (
                <QuizQuestion
                    question={QUIZ_QUESTIONS[currentQuestionIndex]}
                    currentQuestionIndex={currentQuestionIndex}
                    totalQuestions={QUIZ_QUESTIONS.length}
                    selectedOption={userAnswers[QUIZ_QUESTIONS[currentQuestionIndex].id] ?? null}
                    onSelectOption={handleSelectOption}
                    onNext={handleNext}
                />
            )}

            {step === 'result' && (
                <QuizResult
                    score={calculateScore()}
                    totalQuestions={QUIZ_QUESTIONS.length}
                    userName={userName}
                />
            )}
        </div>
    );
}
