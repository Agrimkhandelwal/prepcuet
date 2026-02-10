'use client';

import { useState } from 'react';
import { Plus, Image, Edit2, Trash2, GripVertical, Eye } from 'lucide-react';
import styles from '../Admin.module.css';

interface Banner {
    id: number;
    title: string;
    subtitle: string;
    description: string;
    cta: string;
    link: string;
    badge: string | null;
    color: string;
    active: boolean;
}

const INITIAL_BANNERS: Banner[] = [
    {
        id: 1,
        title: "Integrated Foundation Batch 2026",
        subtitle: "Admissions Open | Starts Feb 15th",
        description: "Comprehensive coverage of all subjects with personal mentorship.",
        cta: "Enroll Now",
        link: "/courses/foundation-2026",
        badge: "New Batch",
        color: "linear-gradient(135deg, #1e293b 0%, #334155 100%)",
        active: true
    },
    {
        id: 2,
        title: "CUET Mock Test Series 2026",
        subtitle: "Boost your score with 30+ Tests",
        description: "Scientifically designed test series to improve accuracy and speed.",
        cta: "View Schedule",
        link: "/courses/test-series",
        badge: "Early Bird Offer",
        color: "linear-gradient(135deg, #b91c1c 0%, #991b1b 100%)",
        active: true
    },
    {
        id: 3,
        title: "Subject-wise Preparation",
        subtitle: "Master Each Subject",
        description: "Expert faculty for all CUET subjects with comprehensive study material.",
        cta: "Learn More",
        link: "/courses/subjects",
        badge: null,
        color: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
        active: true
    }
];

export default function BannersPage() {
    const [banners, setBanners] = useState<Banner[]>(INITIAL_BANNERS);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
    const [formData, setFormData] = useState({
        title: '',
        subtitle: '',
        description: '',
        cta: '',
        link: '',
        badge: '',
        color: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)'
    });

    const colorOptions = [
        { name: 'Dark Blue', value: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)' },
        { name: 'Red', value: 'linear-gradient(135deg, #b91c1c 0%, #991b1b 100%)' },
        { name: 'Dark Navy', value: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)' },
        { name: 'Purple', value: 'linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%)' },
        { name: 'Green', value: 'linear-gradient(135deg, #059669 0%, #047857 100%)' },
    ];

    const openModal = (banner?: Banner) => {
        if (banner) {
            setEditingBanner(banner);
            setFormData({
                title: banner.title,
                subtitle: banner.subtitle,
                description: banner.description,
                cta: banner.cta,
                link: banner.link,
                badge: banner.badge || '',
                color: banner.color
            });
        } else {
            setEditingBanner(null);
            setFormData({
                title: '',
                subtitle: '',
                description: '',
                cta: '',
                link: '',
                badge: '',
                color: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)'
            });
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingBanner(null);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingBanner) {
            setBanners(banners.map(b =>
                b.id === editingBanner.id
                    ? { ...b, ...formData, badge: formData.badge || null }
                    : b
            ));
        } else {
            const newBanner: Banner = {
                id: Date.now(),
                ...formData,
                badge: formData.badge || null,
                active: true
            };
            setBanners([...banners, newBanner]);
        }
        closeModal();
    };

    const deleteBanner = (id: number) => {
        if (confirm('Are you sure you want to delete this banner?')) {
            setBanners(banners.filter(b => b.id !== id));
        }
    };

    const toggleActive = (id: number) => {
        setBanners(banners.map(b =>
            b.id === id ? { ...b, active: !b.active } : b
        ));
    };

    return (
        <div>
            <div className={styles.pageHeader}>
                <div>
                    <h1 className={styles.pageTitle}>Banner/Slider Management</h1>
                    <p className={styles.pageSubtitle}>Manage the hero slider banners on your homepage</p>
                </div>
                <button className={styles.primaryBtn} onClick={() => openModal()}>
                    <Plus size={18} /> Add New Banner
                </button>
            </div>

            {/* Banners List */}
            <div className={styles.cardsGrid}>
                {banners.map((banner) => (
                    <div key={banner.id} className={styles.card}>
                        <div
                            style={{
                                height: '120px',
                                background: banner.color,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'white',
                                padding: '1rem'
                            }}
                        >
                            <div style={{ textAlign: 'center' }}>
                                {banner.badge && (
                                    <span style={{
                                        background: 'rgba(255,255,255,0.2)',
                                        padding: '0.25rem 0.5rem',
                                        borderRadius: '4px',
                                        fontSize: '0.7rem',
                                        marginBottom: '0.5rem',
                                        display: 'inline-block'
                                    }}>
                                        {banner.badge}
                                    </span>
                                )}
                                <h4 style={{ margin: '0.25rem 0', fontSize: '1rem', fontWeight: 600 }}>{banner.title}</h4>
                                <p style={{ margin: 0, fontSize: '0.75rem', opacity: 0.8 }}>{banner.subtitle}</p>
                            </div>
                        </div>
                        <div className={styles.cardBody}>
                            <p style={{ color: '#64748b', fontSize: '0.85rem', marginBottom: '0.75rem' }}>
                                {banner.description}
                            </p>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span className={`${styles.badge} ${banner.active ? styles.badgeSuccess : styles.badgeWarning}`}>
                                    {banner.active ? 'Active' : 'Inactive'}
                                </span>
                                <button
                                    className={styles.secondaryBtn}
                                    onClick={() => toggleActive(banner.id)}
                                    style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
                                >
                                    {banner.active ? 'Deactivate' : 'Activate'}
                                </button>
                            </div>
                        </div>
                        <div className={styles.cardFooter}>
                            <button className={styles.editBtn} onClick={() => openModal(banner)}>
                                <Edit2 size={14} /> Edit
                            </button>
                            <button className={styles.deleteBtn} onClick={() => deleteBanner(banner.id)}>
                                <Trash2 size={14} /> Delete
                            </button>
                        </div>
                    </div>
                ))}
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
                        maxWidth: '600px',
                        maxHeight: '90vh',
                        overflow: 'auto'
                    }}>
                        <div style={{ padding: '1.5rem', borderBottom: '1px solid #e2e8f0' }}>
                            <h2 style={{ margin: 0, color: '#1e293b' }}>
                                {editingBanner ? 'Edit Banner' : 'Add New Banner'}
                            </h2>
                        </div>
                        <form onSubmit={handleSubmit} style={{ padding: '1.5rem' }}>
                            <div className={styles.formGroup}>
                                <label className={styles.formLabel}>Title *</label>
                                <input
                                    type="text"
                                    className={styles.formInput}
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    placeholder="e.g., Foundation Batch 2026"
                                    required
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label className={styles.formLabel}>Subtitle *</label>
                                <input
                                    type="text"
                                    className={styles.formInput}
                                    value={formData.subtitle}
                                    onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                                    placeholder="e.g., Admissions Open | Starts Feb 15th"
                                    required
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label className={styles.formLabel}>Description *</label>
                                <textarea
                                    className={styles.formTextarea}
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Brief description of the banner"
                                    required
                                    style={{ minHeight: '80px' }}
                                />
                            </div>
                            <div className={styles.formRow}>
                                <div className={styles.formGroup}>
                                    <label className={styles.formLabel}>CTA Button Text *</label>
                                    <input
                                        type="text"
                                        className={styles.formInput}
                                        value={formData.cta}
                                        onChange={(e) => setFormData({ ...formData, cta: e.target.value })}
                                        placeholder="e.g., Enroll Now"
                                        required
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label className={styles.formLabel}>CTA Link *</label>
                                    <input
                                        type="text"
                                        className={styles.formInput}
                                        value={formData.link}
                                        onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                                        placeholder="/courses/foundation"
                                        required
                                    />
                                </div>
                            </div>
                            <div className={styles.formRow}>
                                <div className={styles.formGroup}>
                                    <label className={styles.formLabel}>Badge (Optional)</label>
                                    <input
                                        type="text"
                                        className={styles.formInput}
                                        value={formData.badge}
                                        onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                                        placeholder="e.g., New Batch"
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label className={styles.formLabel}>Background Color *</label>
                                    <select
                                        className={styles.formSelect}
                                        value={formData.color}
                                        onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                                    >
                                        {colorOptions.map((opt) => (
                                            <option key={opt.value} value={opt.value}>{opt.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                                <button type="button" className={styles.secondaryBtn} onClick={closeModal}>
                                    Cancel
                                </button>
                                <button type="submit" className={styles.primaryBtn}>
                                    {editingBanner ? 'Update Banner' : 'Create Banner'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
