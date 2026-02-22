'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { db } from '@/lib/firebase';
import { doc, updateDoc, Timestamp } from 'firebase/firestore';
import { UserProfile } from '@/lib/firestore-schema';
import { SUBJECT_CATEGORIES } from '@/lib/constants/subjects';
import { X, Check, Shield, AlertCircle, ChevronRight, Loader2 } from 'lucide-react';
import styles from './SubscriptionModal.module.css';
import { User } from 'firebase/auth';

interface SubscriptionModalProps {
    isOpen: boolean;
    onClose: () => void;
    user: User | UserProfile;
    planType: 'premium_bundle' | 'individual_subject';
}

type Step = 'language' | 'domains' | 'subject_selection' | 'payment' | 'success';

export default function SubscriptionModal({ isOpen, onClose, user, planType }: SubscriptionModalProps) {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState<Step>(planType === 'individual_subject' ? 'subject_selection' : 'language');
    const [selectedLanguage, setSelectedLanguage] = useState<string>('');
    const [selectedDomains, setSelectedDomains] = useState<string[]>([]);
    const [selectedIndividualSubject, setSelectedIndividualSubject] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    if (!isOpen) return null;

    // Combine all subjects for individual selection
    const allSubjects = [
        ...SUBJECT_CATEGORIES.languages,
        ...SUBJECT_CATEGORIES.sciences,
        ...SUBJECT_CATEGORIES.mathematics,
        ...SUBJECT_CATEGORIES.socialSciences,
        ...SUBJECT_CATEGORIES.commerce,
        ...SUBJECT_CATEGORIES.general
    ].sort();

    // Domain subjects for Premium Bundle
    const allDomainSubjects = [
        ...SUBJECT_CATEGORIES.sciences,
        ...SUBJECT_CATEGORIES.mathematics,
        ...SUBJECT_CATEGORIES.socialSciences,
        ...SUBJECT_CATEGORIES.commerce
    ].sort();

    const handleLanguageSelect = (lang: string) => {
        setSelectedLanguage(lang);
        setCurrentStep('domains');
    };

    const handleDomainToggle = (subject: string) => {
        if (selectedDomains.includes(subject)) {
            setSelectedDomains(selectedDomains.filter(s => s !== subject));
        } else {
            if (selectedDomains.length < 3) {
                setSelectedDomains([...selectedDomains, subject]);
            }
        }
    };

    const handleIndividualSubjectSelect = (subject: string) => {
        setSelectedIndividualSubject(subject);
        setCurrentStep('payment');
    };

    const handlePayment = async () => {
        setLoading(true);
        setError('');

        try {
            // Mock Payment Delay
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Construct subscription object
            const validUntilDate = new Date();
            validUntilDate.setFullYear(validUntilDate.getFullYear() + 1); // 1 Year validity

            let subscriptionData;

            if (planType === 'individual_subject') {
                subscriptionData = {
                    planId: 'individual_subject',
                    status: 'active',
                    subjects: [selectedIndividualSubject],
                    validUntil: Timestamp.fromDate(validUntilDate),
                    purchasedAt: Timestamp.now(),
                    amount: 299
                };
            } else {
                // Premium Bundle
                subscriptionData = {
                    planId: 'premium_bundle',
                    status: 'active',
                    subjects: [selectedLanguage, ...selectedDomains, 'General Test'],
                    validUntil: Timestamp.fromDate(validUntilDate),
                    purchasedAt: Timestamp.now(),
                    amount: 999
                };
            }

            // Update User Profile
            const userRef = doc(db, 'users', user.uid);
            // @ts-ignore
            await updateDoc(userRef, {
                subscription: subscriptionData
            });

            setCurrentStep('success');
        } catch (err) {
            console.error('Payment failed:', err);
            setError('Payment processing failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        if (currentStep === 'success') {
            window.location.href = '/';
        } else {
            onClose();
        }
    };

    const handleBack = () => {
        if (planType === 'individual_subject') {
            if (currentStep === 'payment') setCurrentStep('subject_selection');
        } else {
            if (currentStep === 'payment') setCurrentStep('domains');
            else if (currentStep === 'domains') setCurrentStep('language');
        }
    };

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <button onClick={handleClose} className={styles.closeButton}>
                    <X size={24} />
                </button>

                {currentStep !== 'success' && (
                    <div className={styles.header}>
                        <h2>{planType === 'individual_subject' ? 'Select Subject' : 'Setup Your Subscription'}</h2>
                        <div className={styles.progressBar}>
                            {planType === 'individual_subject' ? (
                                <>
                                    <div className={`${styles.step} ${currentStep === 'subject_selection' ? styles.active : styles.completed}`}>1</div>
                                    <div className={styles.line}></div>
                                    <div className={`${styles.step} ${currentStep === 'payment' ? styles.active : ''}`}>2</div>
                                </>
                            ) : (
                                <>
                                    <div className={`${styles.step} ${currentStep === 'language' ? styles.active : styles.completed}`}>1</div>
                                    <div className={styles.line}></div>
                                    <div className={`${styles.step} ${currentStep === 'domains' ? styles.active : (currentStep === 'payment' ? styles.completed : '')}`}>2</div>
                                    <div className={styles.line}></div>
                                    <div className={`${styles.step} ${currentStep === 'payment' ? styles.active : ''}`}>3</div>
                                </>
                            )}
                        </div>
                    </div>
                )}

                <div className={styles.content}>
                    {currentStep === 'subject_selection' && (
                        <>
                            <h2 className={styles.title}>Select Your Subject</h2>
                            <p className={styles.subtitle}>Choose the single subject you want access to.</p>
                            <div className={styles.optionsGrid} style={{ maxHeight: '350px', overflowY: 'auto' }}>
                                {allSubjects.map(sub => (
                                    <button
                                        key={sub}
                                        className={`${styles.optionButton} ${selectedIndividualSubject === sub ? styles.selected : ''}`}
                                        onClick={() => handleIndividualSubjectSelect(sub)}
                                    >
                                        {sub}
                                        {selectedIndividualSubject === sub && <Check size={18} />}
                                    </button>
                                ))}
                            </div>
                        </>
                    )}

                    {currentStep === 'language' && (
                        <>
                            <h2 className={styles.title}>Choose Your Language</h2>
                            <p className={styles.subtitle}>Select 1 language subject for your preparation.</p>
                            <div className={styles.optionsGrid}>
                                {SUBJECT_CATEGORIES.languages.map(lang => (
                                    <button
                                        key={lang}
                                        className={`${styles.optionButton} ${selectedLanguage === lang ? styles.selected : ''}`}
                                        onClick={() => handleLanguageSelect(lang)}
                                    >
                                        {lang}
                                        {selectedLanguage === lang && <Check size={18} />}
                                    </button>
                                ))}
                            </div>
                        </>
                    )}

                    {currentStep === 'domains' && (
                        <>
                            <h2 className={styles.title}>Select 3 Domain Subjects</h2>
                            <p className={styles.subtitle}>
                                Choose exactly 3 subjects from your stream. ({selectedDomains.length}/3 selected)
                            </p>
                            <div className={styles.optionsGrid}>
                                {allDomainSubjects.map(sub => (
                                    <button
                                        key={sub}
                                        className={`${styles.optionButton} ${selectedDomains.includes(sub) ? styles.selected : ''}`}
                                        onClick={() => handleDomainToggle(sub)}
                                        disabled={!selectedDomains.includes(sub) && selectedDomains.length >= 3}
                                    >
                                        {sub}
                                        {selectedDomains.includes(sub) && <Check size={18} />}
                                    </button>
                                ))}
                            </div>
                            <button
                                className={styles.nextButton}
                                disabled={selectedDomains.length !== 3}
                                onClick={() => setCurrentStep('payment')}
                            >
                                Continue to Payment
                            </button>
                        </>
                    )}

                    {currentStep === 'payment' && (
                        <>
                            <h2 className={styles.title}>Order Summary</h2>
                            <div className={styles.summaryCard}>
                                <div className={styles.summaryRow}>
                                    <span>Plan</span>
                                    <strong>{planType === 'individual_subject' ? 'Single Subject Plan' : 'Premium Bundle (1 Year)'}</strong>
                                </div>
                                <div className={styles.summaryRow}>
                                    <span>Subjects</span>
                                    <div style={{ textAlign: 'right' }}>
                                        {planType === 'individual_subject' ? (
                                            <div>{selectedIndividualSubject}</div>
                                        ) : (
                                            <>
                                                <div>{selectedLanguage}</div>
                                                {selectedDomains.map(d => <div key={d}>{d}</div>)}
                                                <div>General Test</div>
                                            </>
                                        )}
                                    </div>
                                </div>
                                <div className={styles.divider}></div>
                                <div className={styles.summaryRow} style={{ fontSize: '1.2rem' }}>
                                    <span>Total Amount</span>
                                    <strong>₹{planType === 'individual_subject' ? '299' : '999'}</strong>
                                </div>
                            </div>
                        </>
                    )}

                    {currentStep === 'success' && (
                        <div className={styles.successContainer}>
                            <div className={styles.successIcon}>
                                <Check size={48} />
                            </div>
                            <h3>Payment Successful!</h3>
                            <p>Your subscription is now active.</p>
                            <button className={styles.nextButton} onClick={handleClose}>
                                Go to Dashboard
                            </button>
                        </div>
                    )}

                    {error && (
                        <div className={styles.errorAlert}>
                            <AlertCircle size={18} />
                            <span>{error}</span>
                        </div>
                    )}

                    {currentStep !== 'success' && (
                        <div className={styles.actions}>
                            {(currentStep === 'language' || currentStep === 'subject_selection') ? (
                                <button className={styles.secondaryBtn} onClick={onClose}>Cancel</button>
                            ) : (
                                <button
                                    className={styles.secondaryBtn}
                                    onClick={handleBack}
                                    disabled={loading}
                                >
                                    Back
                                </button>
                            )}

                            {currentStep === 'payment' && (
                                <button
                                    className={styles.payButton}
                                    onClick={handlePayment}
                                    disabled={loading}
                                >
                                    {loading ? <><Loader2 size={18} className={styles.spin} /> Processing...</> : `Pay ₹${planType === 'individual_subject' ? '299' : '999'}`}
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
