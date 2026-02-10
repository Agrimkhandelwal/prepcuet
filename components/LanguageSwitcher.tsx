'use client';
import { useLanguage } from '@/app/context/LanguageContext';
import styles from './LanguageSwitcher.module.css';

export default function LanguageSwitcher() {
    const { language, setLanguage } = useLanguage();

    return (
        <div className={styles.switcher}>
            <button
                className={`${styles.btn} ${language === 'en' ? styles.active : ''}`}
                onClick={() => setLanguage('en')}
            >
                EN
            </button>
            <span className={styles.separator}>|</span>
            <button
                className={`${styles.btn} ${language === 'hi' ? styles.active : ''}`}
                onClick={() => setLanguage('hi')}
            >
                हिंदी
            </button>
        </div>
    );
}
