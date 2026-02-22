'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Lock } from 'lucide-react';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import styles from './Login.module.css';

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Check if user is admin
            const userDoc = await getDoc(doc(db, 'users', user.uid));
            const userData = userDoc.data();

            if (userData?.role === 'admin') {
                localStorage.setItem('isAdmin', 'true');
                localStorage.setItem('userEmail', email);
                // Redirect directly to upload page as requested
                router.push('/admin/test-series/new');
            } else {
                await signOut(auth);
                if (email === 'preepcuet@gmail.com') {
                    setError('Account exists but needs admin privileges. Go to /admin/setup to promote this account.');
                } else {
                    setError('Access denied. You do not have admin privileges.');
                }
            }
        } catch (err: any) {
            console.error('Login error:', err);
            setError('Invalid email or password.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <div className={styles.iconWrapper}>
                    <Lock size={24} />
                </div>
                <h1 className={styles.title}>
                    Admin Login
                </h1>

                {error && (
                    <div className={styles.error}>
                        {error.includes('/admin/setup') ? (
                            <span>
                                Account exists but needs admin privileges. <Link href="/admin/setup" style={{ textDecoration: 'underline', fontWeight: 'bold' }}>Click here to promote this account</Link>.
                            </span>
                        ) : (
                            error
                        )}
                    </div>
                )}

                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.formGroup}>
                        <label className={styles.label}>Email Address</label>
                        <input
                            type="email"
                            placeholder="admin@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className={styles.input}
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label className={styles.label}>Password</label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className={styles.input}
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className={styles.button}
                    >
                        {loading ? 'Signing In...' : 'Sign In'}
                    </button>
                </form>
                <div className={styles.footer}>
                    <Link href="/" className={styles.backLink}>Back to Home</Link>
                </div>
            </div>
        </div>
    );
}
