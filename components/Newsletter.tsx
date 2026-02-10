'use client';

import { useState } from 'react';
import { Mail, Send, Sparkles, CheckCircle } from 'lucide-react';
import styles from './Newsletter.module.css';

export default function Newsletter() {
    const [email, setEmail] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        setIsLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setIsLoading(false);
        setIsSubmitted(true);
        setEmail('');
    };

    return (
        <section className={styles.newsletterSection}>
            <div className={styles.background}>
                <div className={styles.grid}></div>
            </div>
            <div className="container">
                <div className={styles.content}>
                    <div className={styles.textSide}>
                        <div className={styles.iconBadge}>
                            <Sparkles size={24} />
                        </div>
                        <h2 className={styles.title}>Stay Ahead in Your Preparation</h2>
                        <p className={styles.description}>
                            Get exclusive study tips, current affairs updates, and exam notifications
                            delivered straight to your inbox. Join 50,000+ aspirants!
                        </p>
                        <ul className={styles.features}>
                            <li><CheckCircle size={16} /> Daily Current Affairs Digest</li>
                            <li><CheckCircle size={16} /> Weekly Mock Test Alerts</li>
                            <li><CheckCircle size={16} /> Exam Strategy Tips</li>
                            <li><CheckCircle size={16} /> 100% Free, No Spam</li>
                        </ul>
                    </div>

                    <div className={styles.formSide}>
                        {isSubmitted ? (
                            <div className={styles.successCard}>
                                <div className={styles.successIcon}>
                                    <CheckCircle size={40} />
                                </div>
                                <h3>You're Subscribed!</h3>
                                <p>Check your inbox for a welcome email with free study material.</p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className={styles.form}>
                                <h3>Subscribe to Newsletter</h3>
                                <div className={styles.inputGroup}>
                                    <Mail size={20} className={styles.inputIcon} />
                                    <input
                                        type="email"
                                        placeholder="Enter your email address"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        className={styles.input}
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className={styles.submitBtn}
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <span className={styles.spinner}></span>
                                    ) : (
                                        <>
                                            <Send size={18} /> Subscribe Now
                                        </>
                                    )}
                                </button>
                                <p className={styles.privacyNote}>
                                    We respect your privacy. Unsubscribe anytime.
                                </p>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
