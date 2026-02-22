'use client';

import { Check, Sparkles, Crown, Zap, ShieldCheck } from 'lucide-react';
import styles from './subscription.module.css';

export default function SubscriptionPage() {
    const plans = [
        {
            name: 'Basic Aspirant',
            price: '0',
            period: '/month',
            features: [
                'Access to Free Mock Tests',
                'Daily Quiz Participation',
                'Chapter-wise Practice (Limited)',
                'Community Support',
                'Basic Performance Analytics'
            ],
            btnText: 'Current Plan',
            popular: false,
            btnClass: 'secondaryBtn'
        },
        {
            name: 'Pro Scholar',
            price: '999',
            period: '/6 months',
            features: [
                'All Basic Features',
                'Unlimited Full-Length Mock Tests',
                'Detailed Solutions & Video Hub',
                'Live Doubt Clearing Sessions',
                'Advanced AI Performance Insight',
                'PDF Study Materials'
            ],
            btnText: 'Upgrade to Pro',
            popular: true,
            btnClass: 'primaryBtn'
        },
        {
            name: 'Elite Achiever',
            price: '1499',
            period: '/year',
            features: [
                'All Pro Features',
                '1-on-1 Mentorship Session',
                'Personalized Study Planner',
                'Hardcopy Study Material',
                'University Admission Counseling',
                'Priority Support'
            ],
            btnText: 'Join Elite',
            popular: false,
            btnClass: 'secondaryBtn'
        }
    ];

    return (
        <div className={styles.container}>
            <div className="container">
                <div className={styles.subWrapper}>
                    <header className={styles.header}>
                        <Zap size={48} style={{ color: 'var(--primary)', marginBottom: '1.5rem' }} />
                        <h1>Choose Your Path to Success</h1>
                        <p>Unlock premium features and give your CUET preparation the edge it deserves with our expert-curated plans.</p>
                    </header>

                    <div className={styles.plansGrid}>
                        {plans.map((plan, index) => (
                            <div key={index} className={`${styles.planCard} ${plan.popular ? styles.popular : ''}`}>
                                {plan.popular && <div className={styles.badge}>Most Popular</div>}
                                <h3 className={styles.planName}>{plan.name}</h3>
                                <div className={styles.price}>
                                    <span className={styles.amount}>₹{plan.price}</span>
                                    <span className={styles.period}>{plan.period}</span>
                                </div>
                                <div className={styles.featuresList}>
                                    {plan.features.map((feature, fIndex) => (
                                        <div key={fIndex} className={styles.featureItem}>
                                            <Check className={styles.featureIcon} size={18} />
                                            <span>{feature}</span>
                                        </div>
                                    ))}
                                </div>
                                <button className={`${styles.planBtn} ${styles[plan.btnClass]}`}>
                                    {plan.btnText}
                                </button>
                            </div>
                        ))}
                    </div>

                    <div style={{ marginTop: '5rem', padding: '3rem', background: 'var(--surface)', borderRadius: '24px', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '2rem' }}>
                        <div style={{ width: '80px', height: '80px', borderRadius: '20px', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', flexShrink: 0 }}>
                            <ShieldCheck size={40} />
                        </div>
                        <div>
                            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.5rem' }}>100% Satisfaction Guarantee</h3>
                            <p style={{ color: 'var(--text-muted)' }}>Not satisfied? Get a full refund within 7 days of purchase. No questions asked. Your success is our top priority, and we stand by the quality of our content.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
