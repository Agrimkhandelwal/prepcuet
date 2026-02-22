'use client';

import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { UserProfile } from '@/lib/firestore-schema';
import styles from './AdminSetup.module.css';

export default function AdminSetupPage() {
    const [email, setEmail] = useState('preepcuet@gmail.com');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handlePromoteAdmin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        setError('');

        try {
            // 1. Sign in the user
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            if (user.email !== 'preepcuet@gmail.com') {
                throw new Error('This setup page is only for preepcuet@gmail.com');
            }

            // 2. Check if user profile exists
            const userDocRef = doc(db, 'users', user.uid);
            const userDoc = await getDoc(userDocRef);

            let userProfile: UserProfile;

            if (userDoc.exists()) {
                userProfile = userDoc.data() as UserProfile;
                // Update role
                userProfile.role = 'admin';
            } else {
                // Create new profile if not exists (should minimal exist from signup)
                userProfile = {
                    uid: user.uid,
                    email: user.email!,
                    displayName: user.displayName || 'Admin User',
                    role: 'admin',
                    createdAt: new Date(), // Using JS Date for now, ideally Firebase Timestamp
                    lastLoginAt: new Date(),
                    purchasedTests: [],
                    completedTests: []
                } as any; // Cast to avoid strict type checks on Timestamps for this quick fix
            }

            // 3. Save updated profile
            await setDoc(userDocRef, userProfile, { merge: true });

            // 4. Set local admin flag
            localStorage.setItem('isAdmin', 'true');
            localStorage.setItem('userEmail', email);

            setMessage('Success! User promoted to Admin. You can now access the admin panel.');
        } catch (err: any) {
            console.error('Error promoting user:', err);
            setError(err.message || 'Failed to promote user.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <h1>Admin Account Setup</h1>
                <p>Use this page to promote <strong>preepcuet@gmail.com</strong> to Admin.</p>

                {message && <div className={styles.success}>{message}</div>}
                {error && <div className={styles.error}>{error}</div>}

                <form onSubmit={handlePromoteAdmin} className={styles.form}>
                    <div className={styles.formGroup}>
                        <label>Email</label>
                        <input
                            type="email"
                            value={email}
                            disabled
                            className={styles.input}
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label>Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Current Password"
                            required
                            className={styles.input}
                        />
                    </div>
                    <button type="submit" disabled={loading} className={styles.button}>
                        {loading ? 'Processing...' : 'Promote to Admin'}
                    </button>
                </form>

                <div className={styles.links}>
                    <a href="/admin/login">Go to Admin Login</a>
                </div>
            </div>
        </div>
    );
}
