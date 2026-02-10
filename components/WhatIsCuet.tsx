'use client';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import styles from './WhatIsCuet.module.css';
import { useLanguage } from '@/app/context/LanguageContext';

export default function WhatIsCuet() {
    // Access language context
    const { t } = useLanguage();

    return (
        <section className={styles.section}>
            {/* Animated Background Elements */}
            <div className={styles.blob1}></div>
            <div className={styles.blob2}></div>

            <div className={styles.container}>
                <div className={styles.splitLayout}>
                    {/* Left Panel: Visual Impact */}
                    <div className={styles.visualPanel}>
                        <div className={styles.bigText}>CUET</div>
                        <h2 className={styles.headline} dangerouslySetInnerHTML={{
                            // Split translation by newlines if needed, or just display as is. 
                            // Since our translation keys are single strings, we can just use them.
                            // For the "break" effect in English, we might want to handle it visually or via simple CSS max-width.
                            // Let's keep it simple for now. 
                            __html: t.cuetSection.headline.replace('Universities', 'Universities<br/>').replace('विश्वविद्यालयों', 'विश्वविद्यालयों<br/>')
                        }} />
                        <p className={styles.subheadline}>
                            {t.cuetSection.subheadline}
                        </p>
                    </div>

                    {/* Right Panel: Content Card */}
                    <div className={styles.contentCard}>
                        <p className={styles.textBlock}>
                            {t.cuetSection.content1}
                        </p>

                        <p className={styles.textBlock}>
                            {t.cuetSection.content2}
                        </p>

                        <div className={styles.ctaWrapper}>
                            <Link href="/about-cuet" className={styles.ctaButton}>
                                <span>{t.cuetSection.cta}</span>
                                <ArrowRight size={18} className={styles.icon} />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
