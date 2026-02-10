'use client';
import { useState } from 'react';
import styles from './Quiz.module.css';

interface QuizLoginProps {
    onStart: (name: string) => void;
}

export default function QuizLogin({ onStart }: QuizLoginProps) {
    const [name, setName] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (name.trim()) {
            onStart(name);
        }
    };

    return (
        <div className={styles.loginWrapper}>
            <h1 className={styles.title}>Daily Quiz Mock Test</h1>
            <p className={styles.subtitle}>
                Test your knowledge with 20 questions based on CUET syllabus and General Awareness.
                Please enter your name to begin.
            </p>

            <form onSubmit={handleSubmit}>
                <div className={styles.inputGroup}>
                    <input
                        type="text"
                        placeholder="Enter your full name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className={styles.input}
                        required
                    />
                </div>
                <button
                    type="submit"
                    className={styles.primaryBtn}
                    disabled={!name.trim()}
                >
                    Start Quiz
                </button>
            </form>
        </div>
    );
}
