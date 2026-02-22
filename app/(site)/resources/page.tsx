'use client';

import { FileText, Download, Youtube, Mail, ArrowRight, Sparkles } from 'lucide-react';
import styles from '../toppers/page.module.css';

export default function ResourcesPage() {
    const resources = [
        { title: 'CUET 2026 Exam Pattern', description: 'Complete breakdown of sections, marking scheme, and timing.', size: '1.2 MB', type: 'PDF' },
        { title: 'General Awareness Notes', description: 'Curated monthly current affairs and general knowledge facts.', size: '4.5 MB', type: 'PDF' },
        { title: 'Logical Reasoning Workbook', description: 'Practice set with 500+ solved problems for logical reasoning.', size: '8.1 MB', type: 'PDF' },
        { title: 'Previous Year Question Papers', description: 'All shifts of CUET 2024 and 2025 solved papers.', size: '12.4 MB', type: 'ZIP' },
        { title: 'Subject-wise Syllabus', description: 'Official NTA syllabus for all major domain subjects.', size: '0.8 MB', type: 'PDF' },
        { title: 'Time Management Guide', description: 'Expert tips on how to manage time during the actual exam.', size: '2.3 MB', type: 'PDF' }
    ];

    return (
        <div className={styles.container}>
            <div className="container">
                <header className={styles.hero}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: '#f5f3ff', color: '#8b5cf6', padding: '0.5rem 1rem', borderRadius: '30px', fontWeight: 700, marginBottom: '2rem' }}>
                        <Sparkles size={18} fill="currentColor" /> Free Study Materials
                    </div>
                    <h1>Knowledge at Your Fingertips</h1>
                    <p>Download our expert-curated resources for free to give your CUET preparation a solid foundation.</p>
                </header>

                <div className={styles.resourceGrid}>
                    {resources.map((res, i) => (
                        <div key={i} className={styles.resourceCard}>
                            <div className={styles.fileIcon}>
                                <FileText size={28} />
                            </div>
                            <div className={styles.fileInfo}>
                                <h4>{res.title}</h4>
                                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>{res.description}</p>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <span>{res.type} | {res.size}</span>
                                    <button style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 700, cursor: 'pointer', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                        Download <Download size={14} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div style={{ marginTop: '6rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2.5rem' }}>
                    <div style={{ padding: '3rem', background: '#fff7ed', borderRadius: '32px', border: '1px solid #ffedd5' }}>
                        <Youtube size={48} color="#f97316" style={{ marginBottom: '1.5rem' }} />
                        <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '1rem' }}>Video Lectures</h3>
                        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Subscribe to our YouTube channel for weekly conceptual videos and toppers' strategy sessions.</p>
                        <a href="#" style={{ color: '#f97316', fontWeight: 800, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>Watch Now <ArrowRight size={18} /></a>
                    </div>
                    <div style={{ padding: '3rem', background: '#f0f9ff', borderRadius: '32px', border: '1px solid #e0f2fe' }}>
                        <Mail size={48} color="#0ea5e9" style={{ marginBottom: '1.5rem' }} />
                        <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '1rem' }}>Study Planner</h3>
                        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Get a personalized study planner delivered to your inbox every Monday to stay on track.</p>
                        <a href="#" style={{ color: '#0ea5e9', fontWeight: 800, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>Subscribe <ArrowRight size={18} /></a>
                    </div>
                </div>
            </div>
        </div>
    );
}
