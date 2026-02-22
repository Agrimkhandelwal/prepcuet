'use client';

import { useState } from 'react';
import { Save, Globe, Phone, Mail, MapPin, Facebook, Twitter, Instagram, Youtube, Linkedin, CheckCircle } from 'lucide-react';
import styles from '../../Admin.module.css';

interface SiteSettings {
    siteName: string;
    tagline: string;
    description: string;
    contactEmail: string;
    contactPhone: string;
    address: string;
    facebook: string;
    twitter: string;
    instagram: string;
    youtube: string;
    linkedin: string;
}

const INITIAL_SETTINGS: SiteSettings = {
    siteName: 'PrepCUET',
    tagline: 'Your Success Partner',
    description: 'Comprehensive CUET preparation portal with study materials, mock tests, and expert guidance for university admissions.',
    contactEmail: 'contact@prepcuet.com',
    contactPhone: '+91 9876543210',
    address: 'New Delhi, India',
    facebook: 'https://facebook.com/prepcuet',
    twitter: 'https://twitter.com/prepcuet',
    instagram: 'https://instagram.com/prepcuet',
    youtube: 'https://youtube.com/prepcuet',
    linkedin: 'https://linkedin.com/company/prepcuet'
};

export default function SettingsPage() {
    const [settings, setSettings] = useState<SiteSettings>(INITIAL_SETTINGS);
    const [isSaving, setIsSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    const handleSave = async () => {
        setIsSaving(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setIsSaving(false);
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    };

    return (
        <div>
            <div className={styles.pageHeader}>
                <div>
                    <h1 className={styles.pageTitle}>Site Settings</h1>
                    <p className={styles.pageSubtitle}>Manage your website configuration</p>
                </div>
                <button
                    className={styles.primaryBtn}
                    onClick={handleSave}
                    disabled={isSaving}
                >
                    {saved ? (
                        <>
                            <CheckCircle size={18} /> Saved!
                        </>
                    ) : isSaving ? (
                        'Saving...'
                    ) : (
                        <>
                            <Save size={18} /> Save Changes
                        </>
                    )}
                </button>
            </div>

            <div style={{ display: 'grid', gap: '1.5rem' }}>
                {/* General Settings */}
                <div className={styles.card}>
                    <div className={styles.cardHeader}>
                        <h4 className={styles.cardTitle}>
                            <Globe size={18} style={{ marginRight: '0.5rem' }} />
                            General Information
                        </h4>
                    </div>
                    <div className={styles.cardBody}>
                        <div className={styles.formGroup}>
                            <label className={styles.formLabel}>Site Name</label>
                            <input
                                type="text"
                                className={styles.formInput}
                                value={settings.siteName}
                                onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label className={styles.formLabel}>Tagline</label>
                            <input
                                type="text"
                                className={styles.formInput}
                                value={settings.tagline}
                                onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label className={styles.formLabel}>Site Description</label>
                            <textarea
                                className={styles.formTextarea}
                                value={settings.description}
                                onChange={(e) => setSettings({ ...settings, description: e.target.value })}
                                rows={3}
                            />
                            <small style={{ color: '#64748b' }}>This appears in search engine results</small>
                        </div>
                    </div>
                </div>

                {/* Contact Information */}
                <div className={styles.card}>
                    <div className={styles.cardHeader}>
                        <h4 className={styles.cardTitle}>
                            <Phone size={18} style={{ marginRight: '0.5rem' }} />
                            Contact Information
                        </h4>
                    </div>
                    <div className={styles.cardBody}>
                        <div className={styles.formRow}>
                            <div className={styles.formGroup}>
                                <label className={styles.formLabel}>
                                    <Mail size={14} style={{ marginRight: '0.25rem' }} /> Email
                                </label>
                                <input
                                    type="email"
                                    className={styles.formInput}
                                    value={settings.contactEmail}
                                    onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label className={styles.formLabel}>
                                    <Phone size={14} style={{ marginRight: '0.25rem' }} /> Phone
                                </label>
                                <input
                                    type="tel"
                                    className={styles.formInput}
                                    value={settings.contactPhone}
                                    onChange={(e) => setSettings({ ...settings, contactPhone: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className={styles.formGroup}>
                            <label className={styles.formLabel}>
                                <MapPin size={14} style={{ marginRight: '0.25rem' }} /> Address
                            </label>
                            <input
                                type="text"
                                className={styles.formInput}
                                value={settings.address}
                                onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                            />
                        </div>
                    </div>
                </div>

                {/* Social Media Links */}
                <div className={styles.card}>
                    <div className={styles.cardHeader}>
                        <h4 className={styles.cardTitle}>Social Media Links</h4>
                    </div>
                    <div className={styles.cardBody}>
                        <div className={styles.formRow}>
                            <div className={styles.formGroup}>
                                <label className={styles.formLabel}>
                                    <Facebook size={14} style={{ marginRight: '0.25rem', color: '#1877f2' }} /> Facebook
                                </label>
                                <input
                                    type="url"
                                    className={styles.formInput}
                                    value={settings.facebook}
                                    onChange={(e) => setSettings({ ...settings, facebook: e.target.value })}
                                    placeholder="https://facebook.com/..."
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label className={styles.formLabel}>
                                    <Twitter size={14} style={{ marginRight: '0.25rem', color: '#1da1f2' }} /> Twitter / X
                                </label>
                                <input
                                    type="url"
                                    className={styles.formInput}
                                    value={settings.twitter}
                                    onChange={(e) => setSettings({ ...settings, twitter: e.target.value })}
                                    placeholder="https://twitter.com/..."
                                />
                            </div>
                        </div>
                        <div className={styles.formRow}>
                            <div className={styles.formGroup}>
                                <label className={styles.formLabel}>
                                    <Instagram size={14} style={{ marginRight: '0.25rem', color: '#e4405f' }} /> Instagram
                                </label>
                                <input
                                    type="url"
                                    className={styles.formInput}
                                    value={settings.instagram}
                                    onChange={(e) => setSettings({ ...settings, instagram: e.target.value })}
                                    placeholder="https://instagram.com/..."
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label className={styles.formLabel}>
                                    <Youtube size={14} style={{ marginRight: '0.25rem', color: '#ff0000' }} /> YouTube
                                </label>
                                <input
                                    type="url"
                                    className={styles.formInput}
                                    value={settings.youtube}
                                    onChange={(e) => setSettings({ ...settings, youtube: e.target.value })}
                                    placeholder="https://youtube.com/..."
                                />
                            </div>
                        </div>
                        <div className={styles.formGroup}>
                            <label className={styles.formLabel}>
                                <Linkedin size={14} style={{ marginRight: '0.25rem', color: '#0a66c2' }} /> LinkedIn
                            </label>
                            <input
                                type="url"
                                className={styles.formInput}
                                value={settings.linkedin}
                                onChange={(e) => setSettings({ ...settings, linkedin: e.target.value })}
                                placeholder="https://linkedin.com/company/..."
                            />
                        </div>
                    </div>
                </div>

                {/* Quick Links Configuration */}
                <div className={styles.card}>
                    <div className={styles.cardHeader}>
                        <h4 className={styles.cardTitle}>Quick Links</h4>
                    </div>
                    <div className={styles.cardBody}>
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
                            gap: '0.75rem'
                        }}>
                            {[
                                { name: 'Current Affairs', enabled: true },
                                { name: 'Previous Year Papers', enabled: true },
                                { name: 'Daily Quiz', enabled: true },
                                { name: 'Video Lectures', enabled: true },
                                { name: 'Updates', enabled: true },
                            ].map((link) => (
                                <div key={link.name} style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    padding: '0.75rem',
                                    background: '#f8fafc',
                                    borderRadius: '8px'
                                }}>
                                    <span style={{ fontSize: '0.9rem' }}>{link.name}</span>
                                    <label style={{ display: 'flex', alignItems: 'center' }}>
                                        <input
                                            type="checkbox"
                                            defaultChecked={link.enabled}
                                            style={{ width: '18px', height: '18px', accentColor: '#b91c1c' }}
                                        />
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
