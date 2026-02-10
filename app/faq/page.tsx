'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle, Search, MessageSquare } from 'lucide-react';
import styles from '../support/support.module.css';

export default function FAQPage() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    const faqs = [
        {
            q: 'What is CUET and why is it important?',
            a: 'Common University Entrance Test (CUET) is a national-level entrance exam conducted by NTA for admission to undergraduate programs in central, state, and private universities across India. It provides a single-window opportunity for students to seek admission in any of the participating universities.'
        },
        {
            q: 'How does PrepCUET help in my preparation?',
            a: 'PrepCUET offers structured online and offline coaching, a comprehensive test series modeled on the latest NTA pattern, high-quality study materials, and personalized mentorship to help you score the 99th percentile.'
        },
        {
            q: 'Can I change my batch after enrollment?',
            a: 'Yes, you can request a batch change within the first 7 days of enrollment. Please contact our support team or visit the center for the same.'
        },
        {
            q: 'Are your mock tests based on the latest NTA pattern?',
            a: 'Absolutely. Our academic team constantly updates the test series to reflect the exact pattern, difficulty level, and question types introduced by NTA in the previous years.'
        },
        {
            q: 'Do you provide preparation for Domain subjects?',
            a: 'Yes, we cover more than 15+ Domain subjects including Commerce, Humanities, and Science streams, along with the General Test and Language sections.'
        },
        {
            q: 'Is there a refund policy?',
            a: 'We offer a 7-day satisfaction guarantee for our online courses. For offline classes, please refer to the admission brochure or visit our center for specific details.'
        }
    ];

    return (
        <div className={styles.container}>
            <div className="container" style={{ maxWidth: '800px' }}>
                <header style={{ textAlign: 'center', marginBottom: '4rem' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'var(--primary-light)', color: 'var(--primary)', padding: '0.5rem 1rem', borderRadius: '30px', fontWeight: 700, marginBottom: '2rem' }}>
                        <HelpCircle size={18} /> Got Questions?
                    </div>
                    <h1 style={{ fontSize: '3.5rem', fontWeight: 900, marginBottom: '1.5rem', color: 'var(--text-main)' }}>Frequently Asked Questions</h1>
                    <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)' }}>Find answers to common queries about our courses, admission process, and preparation strategies.</p>
                </header>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {faqs.map((faq, index) => (
                        <div key={index} style={{ background: 'white', border: '1px solid var(--border)', borderRadius: '20px', overflow: 'hidden' }}>
                            <div
                                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                                style={{ padding: '1.5rem 2rem', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 700, fontSize: '1.1rem', color: 'var(--text-main)' }}
                            >
                                {faq.q}
                                {openIndex === index ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                            </div>
                            {openIndex === index && (
                                <div style={{ padding: '0 2rem 2rem', color: 'var(--text-muted)', lineHeight: '1.6', fontSize: '1rem' }}>
                                    <div style={{ height: '1px', background: 'var(--border)', marginBottom: '1.5rem' }}></div>
                                    {faq.a}
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                <div style={{ marginTop: '5rem', padding: '3rem', background: 'var(--surface)', borderRadius: '32px', textAlign: 'center' }}>
                    <MessageSquare size={48} color="var(--primary)" style={{ marginBottom: '1.5rem' }} />
                    <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '1rem' }}>Still have questions?</h3>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>If you couldn't find the answer you were looking for, feel free to contact our support team.</p>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem' }}>
                        <a href="/contact" style={{ background: 'var(--primary)', color: 'white', padding: '1rem 2.5rem', borderRadius: '14px', fontWeight: 700, textDecoration: 'none' }}>Contact Support</a>
                        <a href="/support/live" style={{ background: 'white', border: '1px solid var(--border)', color: 'var(--text-main)', padding: '1rem 2.5rem', borderRadius: '14px', fontWeight: 700, textDecoration: 'none' }}>Live Chat</a>
                    </div>
                </div>
            </div>
        </div>
    );
}
