'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import {
    Check,
    Zap,
    BookOpen,
    Video,
    FileText,
    Shield,
    Star
} from 'lucide-react';
import styles from './Pricing.module.css'; // We'll create this next
import SubscriptionModal from '@/components/subscription/SubscriptionModal'; // We'll create this too

export default function PricingPage() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handlePurchaseClick = (planType: 'premium_bundle' | 'individual_subject') => {
        if (!user) {
            router.push('/login?redirect=/pricing');
            return;
        }
        setSelectedPlan(planType);
        setIsModalOpen(true);
    };

    const [selectedPlan, setSelectedPlan] = useState<'premium_bundle' | 'individual_subject'>('premium_bundle');

    return (
        <div className={styles.container}>
            <div className={styles.heroSection}>
                <h1 className={styles.title}>Unlock Your CUET Potential</h1>
                <p className={styles.subtitle}>
                    Choose the plan that fits your needs. Start small or go all-in.
                </p>
            </div>

            <div className={styles.pricingGrid}>
                {/* Individual Plan */}
                <div className={styles.pricingCard}>
                    <h2 className={styles.planName}>Single Subject</h2>
                    <div className={styles.priceContainer}>
                        <span className={styles.originalPrice}>₹499</span>
                        <span className={styles.currentPrice}>₹299</span>
                        <span className={styles.duration}>/ year</span>
                    </div>

                    <p className={styles.planDescription}>
                        Focus on a specific subject. Ideal for weak areas or targeted practice.
                    </p>

                    <div className={styles.featuresList}>
                        <div className={styles.featureItem}>
                            <div className={styles.featureIcon}><BookOpen size={18} /></div>
                            <div>
                                <strong>1 Subject of Choice</strong>
                                <p>Choose any Domain or Language subject.</p>
                            </div>
                        </div>
                        <div className={styles.featureItem}>
                            <div className={styles.featureIcon}><Zap size={18} /></div>
                            <div>
                                <strong>Topic-wise Tests</strong>
                                <p>Deep dive into every chapter.</p>
                            </div>
                        </div>
                        <div className={styles.featureItem}>
                            <div className={styles.featureIcon}><Shield size={18} /></div>
                            <div>
                                <strong>Unlimited Attempts</strong>
                                <p>Practice until you master it.</p>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={() => handlePurchaseClick('individual_subject')}
                        className={styles.secondaryCtaButton}
                    >
                        Select Plan
                    </button>
                    <p className={styles.guarantee}><Shield size={14} /> 100% Secure Payment</p>
                </div>

                {/* Premium Bundle */}
                <div className={styles.pricingCard} style={{ borderColor: '#3b82f6', borderWidth: '2px', transform: 'scale(1.02)' }}>
                    <div className={styles.popularBadge}>
                        <Star size={14} fill="white" /> MOST POPULAR
                    </div>

                    <h2 className={styles.planName}>Premium Bundle</h2>
                    <div className={styles.priceContainer}>
                        <span className={styles.originalPrice}>₹1499</span>
                        <span className={styles.currentPrice}>₹999</span>
                        <span className={styles.duration}>/ year</span>
                    </div>

                    <p className={styles.planDescription}>
                        The perfect package for serious aspirants. Comprehensive preparation.
                    </p>

                    <div className={styles.featuresList}>
                        <div className={styles.featureItem}>
                            <div className={styles.featureIcon}><BookOpen size={18} /></div>
                            <div>
                                <strong>3 Domain Subjects</strong>
                                <p>Choose any 3 from your stream.</p>
                            </div>
                        </div>
                        <div className={styles.featureItem}>
                            <div className={styles.featureIcon}><FileText size={18} /></div>
                            <div>
                                <strong>1 Language Subject</strong>
                                <p>English or Hindi options available.</p>
                            </div>
                        </div>
                        <div className={styles.featureItem}>
                            <div className={styles.featureIcon}><Zap size={18} /></div>
                            <div>
                                <strong>General Test Included</strong>
                                <p>Full access to General Test series.</p>
                            </div>
                        </div>
                        <div className={styles.featureItem}>
                            <div className={styles.featureIcon}><Shield size={18} /></div>
                            <div>
                                <strong>Unlimited Attempts</strong>
                                <p>Practice as many times as you need.</p>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={() => handlePurchaseClick('premium_bundle')}
                        className={styles.ctaButton}
                    >
                        Get Premium Access
                    </button>

                    <p className={styles.guarantee}>
                        <Shield size={14} /> 100% Secure Payment
                    </p>
                </div>
            </div>

            {/* Testimonials or Trust Markers could go here */}

            {isModalOpen && user && (
                <SubscriptionModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    user={user}
                    planType={selectedPlan}
                />
            )}
        </div>
    );
}
