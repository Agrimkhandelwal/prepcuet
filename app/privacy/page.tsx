'use client';

import styles from '../legal.module.css';

export default function PrivacyPage() {
    return (
        <div className={styles.legalContainer}>
            <div className={styles.legalContent}>
                <h1>Privacy Policy</h1>
                <span className={styles.lastUpdated}>Last Updated: February 05, 2026</span>

                <div className={styles.legalSection}>
                    <h2>1. Information We Collect</h2>
                    <p>We collect information you provide directly to us when you create an account, enroll in a course, or contact us for support. This may include:</p>
                    <ul>
                        <li>Personal identification information (Name, email address, phone number).</li>
                        <li>Educational background and target exam details.</li>
                        <li>Payment information (processed securely via third-party providers).</li>
                    </ul>
                </div>

                <div className={styles.legalSection}>
                    <h2>2. How We Use Your Information</h2>
                    <p>We use the information we collect to:</p>
                    <ul>
                        <li>Provide, maintain, and improve our educational services.</li>
                        <li>Process your enrollments and send you related information.</li>
                        <li>Send you technical notices, updates, and support messages.</li>
                        <li>Communicate with you about products, services, and events.</li>
                    </ul>
                </div>

                <div className={styles.legalSection}>
                    <h2>3. Data Protection</h2>
                    <p>We implement a variety of security measures to maintain the safety of your personal information. Your personal data is contained behind secured networks and is only accessible by a limited number of persons who have special access rights to such systems.</p>
                </div>

                <div className={styles.legalSection}>
                    <h2>4. Cookies</h2>
                    <p>We use cookies to enhance your experience, gather general visitor information, and track visits to our website. You can choose to turn off all cookies via your browser settings.</p>
                </div>

                <div className={styles.legalSection}>
                    <h2>5. Your Rights</h2>
                    <p>You have the right to access, correct, or delete your personal data. You can manage most of your profile information directly from your account settings. For other requests, please contact us.</p>
                </div>

                <div className={styles.legalSection}>
                    <h2>6. Contact Privacy Team</h2>
                    <p>If there are any questions regarding this privacy policy, you may contact us at privacy@prepcuet.com.</p>
                </div>
            </div>
        </div>
    );
}
