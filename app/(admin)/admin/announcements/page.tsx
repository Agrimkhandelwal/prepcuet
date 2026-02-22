'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, ToggleLeft, ToggleRight } from 'lucide-react';
import styles from '../../Admin.module.css';

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

export default function AnnouncementsPage() {
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);
    const [formData, setFormData] = useState({ text: '', type: 'info' as 'new' | 'info' | 'urgent' });

    // Load from localStorage on mount
    useEffect(() => {
        const stored = localStorage.getItem('announcements');
        if (stored) {
            try {
                setAnnouncements(JSON.parse(stored));
            } catch {
                setAnnouncements(DEFAULT_ANNOUNCEMENTS);
                localStorage.setItem('announcements', JSON.stringify(DEFAULT_ANNOUNCEMENTS));
            }
        } else {
            setAnnouncements(DEFAULT_ANNOUNCEMENTS);
            localStorage.setItem('announcements', JSON.stringify(DEFAULT_ANNOUNCEMENTS));
        }
    }, []);

    // Save to localStorage whenever announcements change
    const saveAnnouncements = (newAnnouncements: Announcement[]) => {
        setAnnouncements(newAnnouncements);
        localStorage.setItem('announcements', JSON.stringify(newAnnouncements));
        // Dispatch custom event for same-tab updates
        window.dispatchEvent(new Event('announcementsUpdated'));
    };

    const openModal = (announcement?: Announcement) => {
        if (announcement) {
            setEditingAnnouncement(announcement);
            setFormData({ text: announcement.text, type: announcement.type });
        } else {
            setEditingAnnouncement(null);
            setFormData({ text: '', type: 'info' });
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingAnnouncement(null);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingAnnouncement) {
            const updated = announcements.map(a =>
                a.id === editingAnnouncement.id ? { ...a, ...formData } : a
            );
            saveAnnouncements(updated);
        } else {
            const newAnnouncement: Announcement = {
                id: Date.now(),
                ...formData,
                active: true,
                order: announcements.length + 1
            };
            saveAnnouncements([...announcements, newAnnouncement]);
        }
        closeModal();
    };

    const deleteAnnouncement = (id: number) => {
        if (confirm('Are you sure you want to delete this announcement?')) {
            saveAnnouncements(announcements.filter(a => a.id !== id));
        }
    };

    const toggleActive = (id: number) => {
        const updated = announcements.map(a =>
            a.id === id ? { ...a, active: !a.active } : a
        );
        saveAnnouncements(updated);
    };

    const getTypeBadge = (type: string) => {
        switch (type) {
            case 'new': return styles.badgeSuccess;
            case 'urgent': return styles.badgeDanger;
            default: return styles.badgeInfo;
        }
    };

    return (
        <div>
            <div className={styles.pageHeader}>
                <div>
                    <h1 className={styles.pageTitle}>Announcement Bar</h1>
                    <p className={styles.pageSubtitle}>Manage the top announcement bar messages - changes apply instantly!</p>
                </div>
                <button className={styles.primaryBtn} onClick={() => openModal()}>
                    <Plus size={18} /> Add Announcement
                </button>
            </div>

            {/* Preview */}
            <div style={{
                background: 'linear-gradient(90deg, #b91c1c 0%, #991b1b 100%)',
                padding: '0.75rem',
                borderRadius: '8px',
                marginBottom: '2rem',
                color: 'white',
                fontSize: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '1.5rem',
                flexWrap: 'wrap'
            }}>
                <span style={{ fontWeight: 500 }}>Live Preview:</span>
                {announcements.filter(a => a.active).map((a, idx) => (
                    <span key={a.id}>
                        {a.type === 'new' && <span style={{ background: 'rgba(255,255,255,0.2)', padding: '0.125rem 0.5rem', borderRadius: '4px', marginRight: '0.5rem', fontSize: '0.7rem' }}>NEW</span>}
                        {a.type === 'urgent' && <span style={{ background: '#fef2f2', color: '#991b1b', padding: '0.125rem 0.5rem', borderRadius: '4px', marginRight: '0.5rem', fontSize: '0.7rem' }}>URGENT</span>}
                        {a.text}
                        {idx < announcements.filter(a => a.active).length - 1 && <span style={{ margin: '0 1rem', opacity: 0.5 }}>|</span>}
                    </span>
                ))}
                {announcements.filter(a => a.active).length === 0 && (
                    <span style={{ opacity: 0.7, fontStyle: 'italic' }}>No active announcements</span>
                )}
            </div>

            {/* Announcements List */}
            <div className={styles.recentSection}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Announcement Text</th>
                            <th>Type</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {announcements.map((announcement) => (
                            <tr key={announcement.id}>
                                <td style={{ fontWeight: 500, maxWidth: '400px' }}>{announcement.text}</td>
                                <td>
                                    <span className={`${styles.badge} ${getTypeBadge(announcement.type)}`}>
                                        {announcement.type.toUpperCase()}
                                    </span>
                                </td>
                                <td>
                                    <button
                                        onClick={() => toggleActive(announcement.id)}
                                        style={{
                                            background: 'none',
                                            border: 'none',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.5rem',
                                            color: announcement.active ? '#10b981' : '#64748b'
                                        }}
                                    >
                                        {announcement.active ? <ToggleRight size={24} /> : <ToggleLeft size={24} />}
                                        {announcement.active ? 'Active' : 'Inactive'}
                                    </button>
                                </td>
                                <td>
                                    <div className={styles.actionBtns}>
                                        <button className={styles.editBtn} onClick={() => openModal(announcement)}>
                                            <Edit2 size={14} /> Edit
                                        </button>
                                        <button className={styles.deleteBtn} onClick={() => deleteAnnouncement(announcement.id)}>
                                            <Trash2 size={14} /> Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div style={{
                    position: 'fixed',
                    inset: 0,
                    background: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000,
                    padding: '2rem'
                }}>
                    <div style={{
                        background: 'white',
                        borderRadius: '16px',
                        width: '100%',
                        maxWidth: '500px'
                    }}>
                        <div style={{ padding: '1.5rem', borderBottom: '1px solid #e2e8f0' }}>
                            <h2 style={{ margin: 0, color: '#1e293b' }}>
                                {editingAnnouncement ? 'Edit Announcement' : 'Add New Announcement'}
                            </h2>
                        </div>
                        <form onSubmit={handleSubmit} style={{ padding: '1.5rem' }}>
                            <div className={styles.formGroup}>
                                <label className={styles.formLabel}>Announcement Text *</label>
                                <textarea
                                    className={styles.formTextarea}
                                    value={formData.text}
                                    onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                                    placeholder="Enter announcement text..."
                                    required
                                    style={{ minHeight: '80px' }}
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label className={styles.formLabel}>Type *</label>
                                <select
                                    className={styles.formSelect}
                                    value={formData.type}
                                    onChange={(e) => setFormData({ ...formData, type: e.target.value as 'new' | 'info' | 'urgent' })}
                                >
                                    <option value="new">New (with badge)</option>
                                    <option value="info">Info</option>
                                    <option value="urgent">Urgent</option>
                                </select>
                            </div>
                            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                                <button type="button" className={styles.secondaryBtn} onClick={closeModal}>
                                    Cancel
                                </button>
                                <button type="submit" className={styles.primaryBtn}>
                                    {editingAnnouncement ? 'Update' : 'Create'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
