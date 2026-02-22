'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, orderBy, getDocs, limit, startAfter, where } from 'firebase/firestore';
import { UserProfile } from '@/lib/firestore-schema';
import Link from 'next/link';
import {
    Search,
    User,
    Calendar,
    ChevronRight,
    Mail,
    Shield
} from 'lucide-react';
import styles from '../../Admin.module.css';

export default function UsersPage() {
    const [users, setUsers] = useState<UserProfile[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [lastDoc, setLastDoc] = useState<any>(null);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            // Initial fetch - order by createdAt desc
            const q = query(
                collection(db, 'users'),
                orderBy('createdAt', 'desc'),
                limit(20)
            );

            const querySnapshot = await getDocs(q);
            const data = querySnapshot.docs.map(doc => ({
                ...(doc.data() as UserProfile),
                uid: doc.id
            }));
            setUsers(data);
            setLastDoc(querySnapshot.docs[querySnapshot.docs.length - 1]);
        } catch (error) {
            console.error("Error fetching users:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!searchTerm.trim()) {
            fetchUsers();
            return;
        }

        setLoading(true);
        try {
            // Simple search by email (exact match for now as Firestore full-text search is limited)
            // Or we could do a client-side filter if list is small, but better to query
            // efficient searching usually requires Algolia/Typesense, but for simple admin:
            const q = query(
                collection(db, 'users'),
                where('email', '>=', searchTerm),
                where('email', '<=', searchTerm + '\uf8ff'),
                limit(20)
            );

            const querySnapshot = await getDocs(q);
            const data = querySnapshot.docs.map(doc => ({
                ...(doc.data() as UserProfile),
                uid: doc.id
            }));
            setUsers(data);
        } catch (error) {
            console.error("Error searching users:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.pageHeader}>
                <div>
                    <h1 className={styles.pageTitle}>User Management</h1>
                    <p className={styles.pageSubtitle}>View and manage registered users</p>
                </div>
            </div>

            {/* Search */}
            <div className={styles.card} style={{ marginBottom: '1.5rem', padding: '1rem' }}>
                <form onSubmit={handleSearch} style={{ display: 'flex', gap: '1rem' }}>
                    <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '0.5rem', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '0.5rem' }}>
                        <Search size={18} color="#94a3b8" />
                        <input
                            type="text"
                            placeholder="Search by email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ border: 'none', outline: 'none', width: '100%' }}
                        />
                    </div>
                    <button
                        type="submit"
                        className={styles.secondaryBtn}
                        style={{ padding: '0.5rem 1.5rem' }}
                    >
                        Search
                    </button>
                    {searchTerm && (
                        <button
                            type="button"
                            onClick={() => { setSearchTerm(''); fetchUsers(); }}
                            className={styles.iconBtn}
                            style={{ fontSize: '0.9rem', width: 'auto', padding: '0 1rem' }}
                        >
                            Clear
                        </button>
                    )}
                </form>
            </div>

            {/* Users List */}
            <div className={styles.card}>
                {loading ? (
                    <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>Loading users...</div>
                ) : users.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
                        <div style={{ background: '#f1f5f9', width: '60px', height: '60px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                            <User size={30} color="#94a3b8" />
                        </div>
                        <h3>No users found</h3>
                    </div>
                ) : (
                    <div className={styles.tableResponsive}>
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>User</th>
                                    <th>Role</th>
                                    <th>Joined</th>
                                    <th>Purchases</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((user) => (
                                    <tr key={user.uid}>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                                <div style={{
                                                    width: '32px',
                                                    height: '32px',
                                                    borderRadius: '50%',
                                                    background: '#e2e8f0',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    fontSize: '0.8rem',
                                                    fontWeight: 600,
                                                    color: '#64748b'
                                                }}>
                                                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                                                </div>
                                                <div>
                                                    <div style={{ fontWeight: 600, color: '#1e293b' }}>{user.name || 'No Name'}</div>
                                                    <div style={{ fontSize: '0.8rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                                        <Mail size={12} /> {user.email}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <span className={`${styles.badge} ${user.role === 'admin' ? styles.badgeSuccess : styles.badgeInfo}`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td>
                                            <div style={{ fontSize: '0.9rem', color: '#475569', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                                <Calendar size={14} />
                                                {user.createdAt ? new Date(user.createdAt.seconds * 1000).toLocaleDateString() : 'N/A'}
                                            </div>
                                        </td>
                                        <td>
                                            {user.purchasedTests?.length || 0} Tests
                                        </td>
                                        <td>
                                            <Link href={`/admin/users/${user.uid}`} className={styles.iconBtn} style={{ color: '#3b82f6', textDecoration: 'none' }}>
                                                <ChevronRight size={18} />
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
