'use client';

import { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import styles from './FAQ.module.css';

interface FAQItem {
    question: string;
    answer: string;
}

const faqs: FAQItem[] = [
    {
        question: 'What courses do you offer for CUET preparation?',
        answer: 'We offer comprehensive courses including Online Batches, Offline Classroom Programs, Test Series, and Subject-specific courses. Each program is designed by expert faculty with proven track records.'
    },
    {
        question: 'How can I enroll in your courses?',
        answer: 'You can enroll through our website by clicking on the desired course, or visit our office. We also offer demo classes before enrollment so you can experience our teaching methodology firsthand.'
    },
    {
        question: 'Do you provide study materials?',
        answer: 'Yes! All enrolled students receive comprehensive study materials including printed notes, digital resources, current affairs compilations, and previous year question papers with detailed solutions.'
    },
    {
        question: 'What is your refund policy?',
        answer: 'We offer a 7-day money-back guarantee if you are not satisfied with the course. No questions asked. After 7 days, refunds are processed on a pro-rata basis based on content accessed.'
    },
    {
        question: 'How do the mock tests work?',
        answer: 'Our mock tests are conducted in a proctored environment with AI-based anti-cheating measures. Tests follow the actual exam pattern and include detailed analysis, rank comparison, and expert feedback.'
    },
    {
        question: 'Can I access recorded lectures?',
        answer: 'Absolutely! All live sessions are recorded and made available within 24 hours. You get lifetime access to recorded content for the duration you enrolled in, accessible on any device.'
    }
];

export default function FAQ() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    return (
        <section className={styles.faqSection}>
            <div className="container">
                <div className={styles.header}>
                    <span className={styles.badge}>
                        <HelpCircle size={16} /> FAQ
                    </span>
                    <h2 className={styles.title}>Frequently Asked Questions</h2>
                    <p className={styles.subtitle}>
                        Find answers to common questions about our courses and programs
                    </p>
                </div>

                <div className={styles.faqList}>
                    {faqs.map((faq, index) => (
                        <div
                            key={index}
                            className={`${styles.faqItem} ${openIndex === index ? styles.open : ''}`}
                        >
                            <button
                                className={styles.faqQuestion}
                                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                                aria-expanded={openIndex === index}
                            >
                                <span className={styles.questionNumber}>{String(index + 1).padStart(2, '0')}</span>
                                <span className={styles.questionText}>{faq.question}</span>
                                <ChevronDown size={20} className={styles.chevron} />
                            </button>
                            <div className={styles.faqAnswer}>
                                <p>{faq.answer}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className={styles.moreQuestions}>
                    <p>Still have questions?</p>
                    <a href="/contact" className={styles.contactLink}>Contact our support team →</a>
                </div>
            </div>
        </section>
    );
}
