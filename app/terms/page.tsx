'use client';

import styles from '../legal.module.css';

export default function TermsPage() {
    return (
        <div className={styles.legalContainer}>
            <div className={styles.legalContent}>
                <h1>Terms of Service</h1>
                <span className={styles.lastUpdated}>Last Updated: February 05, 2026</span>

                <div className={styles.legalSection}>
                    <h2>1. Acceptance of Terms</h2>
                    <p>By accessing or using the PrepCUET platform, website, or services, you agree to be bound by these Terms of Service. If you do not agree to all of these terms, do not use our services.</p>
                </div>

                <div className={styles.legalSection}>
                    <h2>2. Description of Service</h2>
                    <p>PrepCUET provides educational resources, online coaching, offline classroom programs, and test series specifically designed for CUET preparation. We reserve the right to modify or discontinue any part of the service with or without notice.</p>
                </div>

                <div className={styles.legalSection}>
                    <h2>3. User Responsibilities</h2>
                    <p>When you create an account with us, you must provide information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account.</p>
                    <ul>
                        <li>You are responsible for safeguarding your password.</li>
                        <li>You agree not to share your account credentials with anyone else.</li>
                        <li>You agree not to use the service for any illegal or unauthorized purpose.</li>
                    </ul>
                </div>

                <div className={styles.legalSection}>
                    <h2>4. Intellectual Property</h2>
                    <p>The Service and its original content (excluding Content provided by users), features, and functionality are and will remain the exclusive property of PrepCUET and its licensors. Our study materials and test series are protected by copyright and other laws.</p>
                </div>

                <div className={styles.legalSection}>
                    <h2>5. Termination</h2>
                    <p>We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.</p>
                </div>

                <div className={styles.legalSection}>
                    <h2>6. Contact Us</h2>
                    <p>If you have any questions about these Terms, please contact us at legal@prepcuet.com.</p>
                </div>
            </div>
        </div>
    );
}
