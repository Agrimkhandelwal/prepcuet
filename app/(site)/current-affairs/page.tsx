import PostListing from '@/components/PostListing';
import Sidebar from '@/components/Sidebar';
import styles from './CurrentAffairs.module.css';

export default function CurrentAffairsPage() {
    return (
        <div className="container" style={{ padding: '2rem 1rem' }}>
            <div className={styles.layoutrid}>
                <main>
                    <PostListing title="Daily Current Affairs" />
                </main>
                <aside className={styles.sidebarWrapper}>
                    <Sidebar />
                </aside>
            </div>
        </div>
    );
}
