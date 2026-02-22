'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
    User, Mail, Phone, MapPin, Save, X,
    RefreshCw, Check
} from 'lucide-react';
import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import styles from './edit.module.css';

export default function ProfileEditPage() {
    const router = useRouter();
    const [user, setUser] = useState<FirebaseUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    const [formData, setFormData] = useState({
        name: '',
        bio: '',
        phone: '',
        location: '',
        targetExam: 'CUET UG 2026',
        dreamUniversity: ''
    });

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
                const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
                if (userDoc.exists()) {
                    const data = userDoc.data();
                    setFormData({
                        name: data.name || currentUser.displayName || '',
                        bio: data.bio || '',
                        phone: data.phone || '',
                        location: data.location || '',
                        targetExam: data.targetExam || 'CUET UG 2026',
                        dreamUniversity: data.dreamUniversity || ''
                    });
                }
                setIsLoading(false);
            } else {
                router.push('/login');
            }
        });

        return () => unsubscribe();
    }, [router]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        setIsSaving(true);
        setMessage({ type: '', text: '' });

        try {
            await updateDoc(doc(db, 'users', user.uid), {
                ...formData,
                updatedAt: new Date().toISOString()
            });
            setMessage({ type: 'success', text: 'Profile updated successfully!' });
            setTimeout(() => {
                router.push('/profile');
            }, 1500);
        } catch (error) {
            console.error('Update error:', error);
            setMessage({ type: 'error', text: 'Failed to update profile. Please try again.' });
        } finally {
            setIsSaving(false);
        }
    };

    const getAvatarUrl = (seed: string) => {
        return `https://api.dicebear.com/7.x/lorelei/svg?seed=${seed}&backgroundColor=b6e3f4,c0aede,d1d4f9`;
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
                <div className={styles.editWrapper}>
                    <div className={styles.titleSection}>
                        <h1>Edit Profile</h1>
                        <p>Update your personal information and academic goals.</p>
                    </div>

                    {message.text && (
                        <div style={{
                            padding: '1rem',
                            borderRadius: '12px',
                            marginBottom: '2rem',
                            backgroundColor: message.type === 'success' ? '#ecfdf5' : '#fef2f2',
                            color: message.type === 'success' ? '#065f46' : '#991b1b',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            fontWeight: 600
                        }}>
                            {message.type === 'success' ? <Check size={20} /> : <X size={20} />}
                            {message.text}
                        </div>
                    )}

                    <div className={styles.avatarSection}>
                        <img
                            src={getAvatarUrl(user?.email || user?.uid || 'default')}
                            alt="Avatar Preview"
                            className={styles.avatarPreview}
                        />
                        <div className={styles.avatarControls}>
                            <button className={styles.avatarBtn} onClick={() => setMessage({ type: 'success', text: 'Avatar randomized! (UI only)' })}>
                                <RefreshCw size={16} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
                                Randomize Avatar
                            </button>
                        </div>
                    </div>

                    <form onSubmit={handleSave} className={styles.formGrid}>
                        <div className={styles.inputGroup}>
                            <label>Full Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                className={styles.input}
                                placeholder="Enter your full name"
                                required
                            />
                        </div>
                        <div className={styles.inputGroup}>
                            <label>Email Address</label>
                            <input
                                type="email"
                                value={user?.email || ''}
                                className={styles.input}
                                disabled
                                style={{ opacity: 0.7, cursor: 'not-allowed' }}
                            />
                        </div>
                        <div className={styles.inputGroup}>
                            <label>Phone Number</label>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleInputChange}
                                className={styles.input}
                                placeholder="Your mobile number"
                            />
                        </div>
                        <div className={styles.inputGroup}>
                            <label>Location</label>
                            <input
                                type="text"
                                name="location"
                                value={formData.location}
                                onChange={handleInputChange}
                                className={styles.input}
                                placeholder="City, Country"
                            />
                        </div>
                        <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
                            <label>Bio</label>
                            <textarea
                                name="bio"
                                value={formData.bio}
                                onChange={handleInputChange}
                                className={`${styles.input} ${styles.textarea}`}
                                placeholder="Tell us a bit about yourself..."
                            ></textarea>
                        </div>

                        <div className={styles.titleSection} style={{ gridColumn: '1/-1', marginTop: '2rem', marginBottom: '1.5rem' }}>
                            <h2 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Academic Goals</h2>
                        </div>

                        <div className={styles.inputGroup}>
                            <label>Target Exam</label>
                            <select
                                name="targetExam"
                                value={formData.targetExam}
                                onChange={handleInputChange}
                                className={styles.input}
                            >
                                <option>CUET UG 2026</option>
                                <option>CUET UG 2027</option>
                                <option>CUET PG 2026</option>
                            </select>
                        </div>
                        <div className={styles.inputGroup}>
                            <label>Dream University</label>
                            <input
                                type="text"
                                name="dreamUniversity"
                                value={formData.dreamUniversity}
                                onChange={handleInputChange}
                                className={styles.input}
                                placeholder="e.g. DU, BHU, JNU"
                            />
                        </div>

                        <div className={styles.actionSection}>
                            <button
                                type="button"
                                onClick={() => router.back()}
                                className={styles.cancelBtn}
                                disabled={isSaving}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className={styles.saveBtn}
                                disabled={isSaving}
                            >
                                {isSaving ? 'Saving Changes...' : 'Save Changes'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
