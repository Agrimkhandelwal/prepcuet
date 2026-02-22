'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Mail, ArrowRight, ArrowLeft, KeyRound, CheckCircle } from 'lucide-react';
import styles from './forgot-password.module.css';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Simulate password reset email - replace with actual logic
        setTimeout(() => {
            setIsLoading(false);
            setIsSubmitted(true);
        }, 1500);
    };

    return (
        <div className={styles.container}>
            {/* Background decorations */}
            <div className={styles.bgDecoration}>
                <div className={styles.gradientOrb1}></div>
                <div className={styles.gradientOrb2}></div>
                <div className={styles.gridPattern}></div>
            </div>

            <div className={styles.card}>
                {!isSubmitted ? (
                    <>
                        <div className={styles.header}>
                            <div className={styles.iconWrapper}>
                                <KeyRound size={32} />
                            </div>
                            <h1 className={styles.title}>Forgot Password?</h1>
                            <p className={styles.subtitle}>
                                No worries! Enter your email address and we&apos;ll send you
                                instructions to reset your password.
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className={styles.form}>
                            <div className={styles.inputGroup}>
                                <label htmlFor="email" className={styles.label}>
                                    Email Address
                                </label>
                                <div className={styles.inputWrapper}>
                                    <Mail className={styles.inputIcon} size={20} />
                                    <input
                                        id="email"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="you@example.com"
                                        className={styles.input}
                                        required
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                className={styles.submitBtn}
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <div className={styles.spinner}></div>
                                ) : (
                                    <>
                                        Send Reset Link
                                        <ArrowRight size={20} />
                                    </>
                                )}
                            </button>
                        </form>
                    </>
                ) : (
                    <div className={styles.successState}>
                        <div className={styles.successIconWrapper}>
                            <CheckCircle size={48} />
                        </div>
                        <h2 className={styles.successTitle}>Check Your Email</h2>
                        <p className={styles.successText}>
                            We&apos;ve sent a password reset link to:
                        </p>
                        <p className={styles.emailHighlight}>{email}</p>
                        <p className={styles.helperText}>
                            Didn&apos;t receive the email? Check your spam folder or
                            <button
                                onClick={() => setIsSubmitted(false)}
                                className={styles.resendBtn}
                            >
                                try again
                            </button>
                        </p>
                    </div>
                )}

                <Link href="/login" className={styles.backLink}>
                    <ArrowLeft size={16} />
                    Back to Login
                </Link>
            </div>
        </div>
    );
}
