import { Metadata } from 'next';
import ContentFeed from '@/components/ContentFeed';
import Sidebar from '@/components/Sidebar';
import styles from './Updates.module.css';

export const metadata: Metadata = {
    title: 'Latest Updates & Announcements | PrepCUET',
    description: 'Stay up to date with the latest CUET news, admit card releases, exam patterns, and PrepCUET new batch announcements.',
    alternates: {
        canonical: 'https://prepcuet.com/updates',
    },
};

export default function UpdatesPage() {
    return (
        <div className={styles.pageContainer}>
            <div className={styles.bgGlow} />

            <div className="container">
                <header className={styles.pageHeader}>
                    <h1 className={styles.title}>Latest Updates</h1>
                    <p className={styles.subtitle}>
                        Stay ahead of your preparation with the most recent news, examination announcements, strategy guides, and platform updates.
                    </p>
                </header>

                <div className={styles.mainGrid}>
                    <main>
                        <ContentFeed />
                    </main>

                    <aside className={styles.sidebarWrapper}>
                        <Sidebar />
                    </aside>
                </div>
            </div>
        </div>
    );
}
