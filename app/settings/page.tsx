'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
    Bell, Shield, Monitor, Globe, Mail,
    Lock, Smartphone, Trash2, Check, AlertCircle
} from 'lucide-react';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import styles from './settings.module.css';

export default function SettingsPage() {
    const router = useRouter();
    const [user, setUser] = useState<FirebaseUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [notifications, setNotifications] = useState({
        email: true,
        push: true,
        offers: false,
        reminders: true
    });

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
                setIsLoading(false);
            } else {
                router.push('/login');
            }
        });

        return () => unsubscribe();
    }, [router]);

    const handleToggle = (key: keyof typeof notifications) => {
        setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
    };

    if (isLoading) {
        return (
            <div className={styles.container}>
                <div className="container" style={{ textAlign: 'center', padding: '100px 0' }}>
                    <div className="spinner"></div>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className="container">
                <div className={styles.settingsWrapper}>
                    <h1 style={{ marginBottom: '2.5rem', fontSize: '2.5rem', fontWeight: 900 }}>Settings</h1>

                    {/* Notifications Section */}
                    <section className={styles.settingsSection}>
                        <div className={styles.sectionHeader}>
                            <Bell size={24} />
                            <h2>Notifications</h2>
                        </div>
                        <div className={styles.settingItem}>
                            <div className={styles.settingInfo}>
                                <h4>Email Notifications</h4>
                                <p>Receive updates about your courses and exam schedules via email.</p>
                            </div>
                            <label className={styles.switch}>
                                <input
                                    type="checkbox"
                                    checked={notifications.email}
                                    onChange={() => handleToggle('email')}
                                />
                                <span className={styles.slider}></span>
                            </label>
                        </div>
                        <div className={styles.settingItem}>
                            <div className={styles.settingInfo}>
                                <h4>Push Notifications</h4>
                                <p>Get real-time alerts on your browser for new tests and materials.</p>
                            </div>
                            <label className={styles.switch}>
                                <input
                                    type="checkbox"
                                    checked={notifications.push}
                                    onChange={() => handleToggle('push')}
                                />
                                <span className={styles.slider}></span>
                            </label>
                        </div>
                        <div className={styles.settingItem}>
                            <div className={styles.settingInfo}>
                                <h4>Promotional Offers</h4>
                                <p>Stay updated with discounts and new course launches.</p>
                            </div>
                            <label className={styles.switch}>
                                <input
                                    type="checkbox"
                                    checked={notifications.offers}
                                    onChange={() => handleToggle('offers')}
                                />
                                <span className={styles.slider}></span>
                            </label>
                        </div>
                    </section>

                    {/* Security Section */}
                    <section className={styles.settingsSection}>
                        <div className={styles.sectionHeader}>
                            <Shield size={24} />
                            <h2>Security & Privacy</h2>
                        </div>
                        <div className={styles.settingItem}>
                            <div className={styles.settingInfo}>
                                <h4>Two-Factor Authentication</h4>
                                <p>Add an extra layer of security to your account.</p>
                            </div>
                            <button className={styles.miniBtn} style={{
                                padding: '0.5rem 1rem',
                                borderRadius: '8px',
                                background: 'var(--surface)',
                                border: '1px solid var(--border)',
                                fontWeight: 600,
                                cursor: 'pointer'
                            }}>
                                Setup 2FA
                            </button>
                        </div>
                        <div className={styles.settingItem}>
                            <div className={styles.settingInfo}>
                                <h4>Password Management</h4>
                                <p>Last changed 3 months ago.</p>
                            </div>
                            <button
                                onClick={() => router.push('/forgot-password')}
                                style={{
                                    padding: '0.5rem 1rem',
                                    borderRadius: '8px',
                                    background: 'var(--surface)',
                                    border: '1px solid var(--border)',
                                    fontWeight: 600,
                                    cursor: 'pointer'
                                }}
                            >
                                Change Password
                            </button>
                        </div>
                    </section>

                    {/* Danger Zone */}
                    <section className={styles.settingsSection} style={{ borderColor: '#fecaca' }}>
                        <div className={styles.sectionHeader}>
                            <AlertCircle size={24} style={{ color: '#ef4444' }} />
                            <h2 style={{ color: '#ef4444' }}>Danger Zone</h2>
                        </div>
                        <div className={styles.settingItem}>
                            <div className={styles.settingInfo}>
                                <h4>Delete Account</h4>
                                <p>Permanently delete your account and all associated data. This action is irreversible.</p>
                            </div>
                            <button className={styles.dangerBtn}>
                                Delete Account
                            </button>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}
