'use client';

import {
    Search, Headset, Book, MessageSquare,
    FileText, HelpCircle, ChevronDown, Phone,
    Mail, Globe
} from 'lucide-react';
import Link from 'next/link';
import styles from './support.module.css';

export default function SupportHub() {
    const faqs = [
        {
            q: 'How do I reset my password?',
            a: 'You can reset your password by clicking the "Forgot Password" link on the login page. We will send a secure link to your registered email address.'
        },
        {
            q: 'Is there a mobile app available?',
            a: 'Currently, PrepCUET is a fully responsive web application. You can access it on any mobile browser with a native-like experience. We are working on dedicated apps for Android and iOS.'
        },
        {
            q: 'How can I request a refund?',
            a: 'If you are not satisfied with your purchase, you can request a refund within 7 days. Please contact our support team via live chat or email to initiate the process.'
        },
        {
            q: 'When will the new mock tests be uploaded?',
            a: 'New mock tests are uploaded every Sunday. Premium users get instant access, while free users can access them after a 48-hour delay.'
        }
    ];

    return (
        <div className={styles.container}>
            <div className="container">
                <div className={styles.supportWrapper}>
                    <header className={styles.hero}>
                        <h1>How can we help?</h1>
                        <div className={styles.searchBox}>
                            <Search className={styles.searchIcon} size={20} />
                            <input
                                type="text"
                                className={styles.searchInput}
                                placeholder="Search for articles, guides, or questions..."
                            />
                        </div>
                    </header>

                    <div className={styles.grid}>
                        <Link href="/support/live" className={styles.card}>
                            <div className={styles.iconWrapper}>
                                <Headset size={32} />
                            </div>
                            <h3>Live Support</h3>
                            <p>Chat with our academic experts in real-time for immediate help.</p>
                        </Link>
                        <Link href="/resources" className={styles.card}>
                            <div className={styles.iconWrapper} style={{ background: '#ecfdf5', color: '#10b981' }}>
                                <Book size={32} />
                            </div>
                            <h3>Knowledge Base</h3>
                            <p>Explore detailed guides and documentation for all features.</p>
                        </Link>
                        <div className={styles.card}>
                            <div className={styles.iconWrapper} style={{ background: '#f5f3ff', color: '#8b5cf6' }}>
                                <MessageSquare size={32} />
                            </div>
                            <h3>Community Forum</h3>
                            <p>Join thousands of students in discussions and peer learning.</p>
                        </div>
                    </div>

                    <section className={styles.faqSection}>
                        <h2>Frequently Asked Questions</h2>
                        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
                            {faqs.map((faq, index) => (
                                <div key={index} className={styles.faqItem}>
                                    <h4>
                                        {faq.q}
                                        <ChevronDown size={18} />
                                    </h4>
                                    <p style={{ marginTop: '0.75rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
                                        {faq.a}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </section>

                    <div style={{ marginTop: '5rem', display: 'flex', flexWrap: 'wrap', gap: '2rem', justifyContent: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-muted)' }}>
                            <Mail size={18} /> support@prepcuet.com
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-muted)' }}>
                            <Phone size={18} /> +91 98765 43210
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-muted)' }}>
                            <Globe size={18} /> help.prepcuet.com
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
