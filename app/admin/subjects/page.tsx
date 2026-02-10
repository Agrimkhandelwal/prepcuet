'use client';

import { useState } from 'react';
import { Plus, Edit2, Trash2, BookOpen, Globe, Scale, TrendingUp, Cpu, Brain, Atom, FlaskConical, Calculator, Dna, Languages, BookA } from 'lucide-react';
import styles from '../Admin.module.css';

interface Subject {
    id: number;
    title: string;
    slug: string;
    icon: string;
    count: number;
    newArticles: number;
    color: string;
}

const ICON_OPTIONS = [
    { name: 'BookOpen', label: 'Book', component: BookOpen },
    { name: 'Globe', label: 'Globe', component: Globe },
    { name: 'Scale', label: 'Scale', component: Scale },
    { name: 'TrendingUp', label: 'Trending', component: TrendingUp },
    { name: 'Cpu', label: 'CPU', component: Cpu },
    { name: 'Brain', label: 'Brain', component: Brain },
    { name: 'Atom', label: 'Atom', component: Atom },
    { name: 'FlaskConical', label: 'Flask', component: FlaskConical },
    { name: 'Calculator', label: 'Calculator', component: Calculator },
    { name: 'Dna', label: 'DNA', component: Dna },
    { name: 'Languages', label: 'Languages', component: Languages },
    { name: 'BookA', label: 'English', component: BookA },
];

const COLOR_OPTIONS = [
    { name: 'Blue', value: '#3b82f6' },
    { name: 'Green', value: '#10b981' },
    { name: 'Purple', value: '#8b5cf6' },
    { name: 'Red', value: '#ef4444' },
    { name: 'Orange', value: '#f59e0b' },
    { name: 'Pink', value: '#ec4899' },
    { name: 'Cyan', value: '#06b6d4' },
    { name: 'Indigo', value: '#6366f1' },
];

const INITIAL_SUBJECTS: Subject[] = [
    { id: 1, title: 'History', slug: 'history', icon: 'BookOpen', count: 120, newArticles: 5, color: '#3b82f6' },
    { id: 2, title: 'Geography', slug: 'geography', icon: 'Globe', count: 85, newArticles: 3, color: '#10b981' },
    { id: 3, title: 'Political Science', slug: 'political-science', icon: 'Scale', count: 150, newArticles: 8, color: '#8b5cf6' },
    { id: 4, title: 'Economics', slug: 'economics', icon: 'TrendingUp', count: 95, newArticles: 4, color: '#f59e0b' },
    { id: 5, title: 'Computer Science', slug: 'computer-science', icon: 'Cpu', count: 60, newArticles: 2, color: '#06b6d4' },
    { id: 6, title: 'General Aptitude', slug: 'general-aptitude', icon: 'Brain', count: 200, newArticles: 10, color: '#ec4899' },
    { id: 7, title: 'Physics', slug: 'physics', icon: 'Atom', count: 75, newArticles: 1, color: '#6366f1' },
    { id: 8, title: 'Chemistry', slug: 'chemistry', icon: 'FlaskConical', count: 70, newArticles: 2, color: '#10b981' },
    { id: 9, title: 'Mathematics', slug: 'mathematics', icon: 'Calculator', count: 110, newArticles: 6, color: '#ef4444' },
    { id: 10, title: 'Biology', slug: 'biology', icon: 'Dna', count: 90, newArticles: 4, color: '#8b5cf6' },
    { id: 11, title: 'Hindi', slug: 'hindi', icon: 'Languages', count: 50, newArticles: 0, color: '#f59e0b' },
    { id: 12, title: 'English', slug: 'english', icon: 'BookA', count: 130, newArticles: 7, color: '#3b82f6' },
];

const getIconComponent = (iconName: string) => {
    const icon = ICON_OPTIONS.find(i => i.name === iconName);
    return icon ? icon.component : BookOpen;
};

export default function SubjectsPage() {
    const [subjects, setSubjects] = useState<Subject[]>(INITIAL_SUBJECTS);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        icon: 'BookOpen',
        color: '#3b82f6'
    });

    const openModal = (subject?: Subject) => {
        if (subject) {
            setEditingSubject(subject);
            setFormData({
                title: subject.title,
                slug: subject.slug,
                icon: subject.icon,
                color: subject.color
            });
        } else {
            setEditingSubject(null);
            setFormData({
                title: '',
                slug: '',
                icon: 'BookOpen',
                color: '#3b82f6'
            });
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingSubject(null);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingSubject) {
            setSubjects(subjects.map(s =>
                s.id === editingSubject.id
                    ? { ...s, ...formData }
                    : s
            ));
        } else {
            const newSubject: Subject = {
                id: Date.now(),
                ...formData,
                count: 0,
                newArticles: 0
            };
            setSubjects([...subjects, newSubject]);
        }
        closeModal();
    };

    const deleteSubject = (id: number) => {
        if (confirm('Are you sure you want to delete this subject? All linked articles will be unlinked.')) {
            setSubjects(subjects.filter(s => s.id !== id));
        }
    };

    const generateSlug = (title: string) => {
        return title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    };

    return (
        <div>
            <div className={styles.pageHeader}>
                <div>
                    <h1 className={styles.pageTitle}>Subject Management</h1>
                    <p className={styles.pageSubtitle}>Organize content by subject categories</p>
                </div>
                <button className={styles.primaryBtn} onClick={() => openModal()}>
                    <Plus size={18} /> Add Subject
                </button>
            </div>

            {/* Subjects Grid */}
            <div className={styles.cardsGrid}>
                {subjects.map((subject) => {
                    const IconComponent = getIconComponent(subject.icon);
                    return (
                        <div key={subject.id} className={styles.card}>
                            <div className={styles.cardHeader}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                    <div style={{
                                        width: '40px',
                                        height: '40px',
                                        borderRadius: '10px',
                                        background: `${subject.color}15`,
                                        color: subject.color,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        <IconComponent size={20} />
                                    </div>
                                    <div>
                                        <h4 className={styles.cardTitle}>{subject.title}</h4>
                                        <span style={{ fontSize: '0.75rem', color: '#64748b' }}>/{subject.slug}</span>
                                    </div>
                                </div>
                            </div>
                            <div className={styles.cardBody}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                    <span style={{ color: '#64748b', fontSize: '0.85rem' }}>Total Articles</span>
                                    <span style={{ fontWeight: 600, color: '#1e293b' }}>{subject.count}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span style={{ color: '#64748b', fontSize: '0.85rem' }}>New This Week</span>
                                    <span className={`${styles.badge} ${subject.newArticles > 0 ? styles.badgeSuccess : styles.badgeInfo}`}>
                                        {subject.newArticles > 0 ? `+${subject.newArticles}` : '0'}
                                    </span>
                                </div>
                            </div>
                            <div className={styles.cardFooter}>
                                <button className={styles.editBtn} onClick={() => openModal(subject)}>
                                    <Edit2 size={14} /> Edit
                                </button>
                                <button className={styles.deleteBtn} onClick={() => deleteSubject(subject.id)}>
                                    <Trash2 size={14} /> Delete
                                </button>
                            </div>
                        </div>
                    );
                })}
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
                                {editingSubject ? 'Edit Subject' : 'Add New Subject'}
                            </h2>
                        </div>
                        <form onSubmit={handleSubmit} style={{ padding: '1.5rem' }}>
                            <div className={styles.formGroup}>
                                <label className={styles.formLabel}>Subject Name *</label>
                                <input
                                    type="text"
                                    className={styles.formInput}
                                    value={formData.title}
                                    onChange={(e) => setFormData({
                                        ...formData,
                                        title: e.target.value,
                                        slug: generateSlug(e.target.value)
                                    })}
                                    placeholder="e.g., Mathematics"
                                    required
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label className={styles.formLabel}>URL Slug *</label>
                                <input
                                    type="text"
                                    className={styles.formInput}
                                    value={formData.slug}
                                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                    placeholder="e.g., mathematics"
                                    required
                                />
                            </div>
                            <div className={styles.formRow}>
                                <div className={styles.formGroup}>
                                    <label className={styles.formLabel}>Icon *</label>
                                    <select
                                        className={styles.formSelect}
                                        value={formData.icon}
                                        onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                                    >
                                        {ICON_OPTIONS.map(opt => (
                                            <option key={opt.name} value={opt.name}>{opt.label}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className={styles.formGroup}>
                                    <label className={styles.formLabel}>Color *</label>
                                    <select
                                        className={styles.formSelect}
                                        value={formData.color}
                                        onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                                    >
                                        {COLOR_OPTIONS.map(opt => (
                                            <option key={opt.value} value={opt.value}>{opt.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            {/* Preview */}
                            <div style={{
                                padding: '1rem',
                                background: '#f8fafc',
                                borderRadius: '8px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.75rem',
                                marginTop: '0.5rem'
                            }}>
                                <div style={{
                                    width: '40px',
                                    height: '40px',
                                    borderRadius: '10px',
                                    background: `${formData.color}15`,
                                    color: formData.color,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    {(() => {
                                        const Icon = getIconComponent(formData.icon);
                                        return <Icon size={20} />;
                                    })()}
                                </div>
                                <div>
                                    <div style={{ fontWeight: 600, color: '#1e293b' }}>{formData.title || 'Subject Name'}</div>
                                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Preview</div>
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                                <button type="button" className={styles.secondaryBtn} onClick={closeModal}>
                                    Cancel
                                </button>
                                <button type="submit" className={styles.primaryBtn}>
                                    {editingSubject ? 'Update Subject' : 'Create Subject'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
