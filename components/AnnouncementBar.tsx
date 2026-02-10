'use client';

import { useState, useEffect } from 'react';
import styles from './AnnouncementBar.module.css';

interface Announcement {
    id: number;
    text: string;
    type: 'new' | 'info' | 'urgent';
    active: boolean;
    order: number;
}

const DEFAULT_ANNOUNCEMENTS: Announcement[] = [
    { id: 1, text: 'Admissions Open for Integrated Foundation Batch 2026 — Starts Feb 15th!', type: 'new', active: true, order: 1 },
    { id: 2, text: 'Free Scholarship Test on Sunday', type: 'info', active: true, order: 2 },
    { id: 3, text: 'Download Monthly Current Affairs PDF', type: 'info', active: true, order: 3 },
];

export default function AnnouncementBar() {
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);

    useEffect(() => {
        // Load announcements from localStorage
        const stored = localStorage.getItem('announcements');
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                setAnnouncements(parsed.filter((a: Announcement) => a.active));
            } catch {
                setAnnouncements(DEFAULT_ANNOUNCEMENTS.filter(a => a.active));
            }
        } else {
            // Initialize with default announcements
            localStorage.setItem('announcements', JSON.stringify(DEFAULT_ANNOUNCEMENTS));
            setAnnouncements(DEFAULT_ANNOUNCEMENTS.filter(a => a.active));
        }

        // Listen for storage changes (for real-time updates)
        const handleStorage = () => {
            const updated = localStorage.getItem('announcements');
            if (updated) {
                try {
                    const parsed = JSON.parse(updated);
                    setAnnouncements(parsed.filter((a: Announcement) => a.active));
                } catch {
                    // Ignore parse errors
                }
            }
        };

        window.addEventListener('storage', handleStorage);

        // Custom event for same-tab updates
        window.addEventListener('announcementsUpdated', handleStorage);

        return () => {
            window.removeEventListener('storage', handleStorage);
            window.removeEventListener('announcementsUpdated', handleStorage);
        };
    }, []);

    if (announcements.length === 0) {
        return null;
    }

    return (
        <div className={styles.bar}>
            <div className={styles.content}>
                {announcements.map((announcement, idx) => (
                    <span key={announcement.id}>
                        {announcement.type === 'new' && <span className={styles.tag}>NEW</span>}
                        {announcement.type === 'urgent' && <span className={`${styles.tag} ${styles.urgent}`}>URGENT</span>}
                        <span className={styles.text}>{announcement.text}</span>
                        {idx < announcements.length - 1 && <span className={styles.separator}>|</span>}
                    </span>
                ))}
            </div>
        </div>
    );
}
