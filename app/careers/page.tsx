'use client';

import { MapPin, Briefcase, Clock, ArrowRight, Star, Users, Heart } from 'lucide-react';
import Link from 'next/link';
import styles from '../legal.module.css';

export default function CareersPage() {
    const jobs = [
        {
            title: 'Academic Counselor',
            location: 'Bangalore (On-site)',
            type: 'Full Time',
            department: 'Sales & Counseling'
        },
        {
            title: 'Subject Matter Expert (History)',
            location: 'Remote / Hybrid',
            type: 'Part Time / Full Time',
            department: 'Content'
        },
        {
            title: 'Video Editor & Graphic Designer',
            location: 'Bangalore (On-site)',
            type: 'Full Time',
            department: 'Marketing'
        },
        {
            title: 'Frontend Developer (Next.js)',
            location: 'Remote',
            type: 'Full Time',
            department: 'Technology'
        }
    ];

    return (
        <div className={styles.legalContainer} style={{ maxWidth: '1000px' }}>
            <div className={styles.careersHero}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'var(--primary-light)', color: 'var(--primary)', padding: '0.5rem 1rem', borderRadius: '30px', fontWeight: 700, marginBottom: '2rem' }}>
                    <Heart size={18} fill="currentColor" /> We're Hiring!
                </div>
                <h1>Shape the Future of Education</h1>
                <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)', maxWidth: '700px', margin: '0 auto' }}>Join a passionate team dedicated to making high-quality CUET preparation accessible to every student in India.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem', marginBottom: '6rem' }}>
                <div style={{ textAlign: 'center', padding: '2rem' }}>
                    <div style={{ color: 'var(--primary)', marginBottom: '1rem' }}><Users size={40} /></div>
                    <h4 style={{ fontWeight: 800, marginBottom: '0.5rem' }}>Great Culture</h4>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Work with mission-driven people in a collaborative environment.</p>
                </div>
                <div style={{ textAlign: 'center', padding: '2rem' }}>
                    <div style={{ color: 'var(--primary)', marginBottom: '1rem' }}><Star size={40} /></div>
                    <h4 style={{ fontWeight: 800, marginBottom: '0.5rem' }}>Growth Focused</h4>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Accelerate your career with challenging roles and ownership.</p>
                </div>
                <div style={{ textAlign: 'center', padding: '2rem' }}>
                    <div style={{ color: 'var(--primary)', marginBottom: '1rem' }}><Clock size={40} /></div>
                    <h4 style={{ fontWeight: 800, marginBottom: '0.5rem' }}>Flexibility</h4>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>We value results over hours. Enjoy a healthy work-life balance.</p>
                </div>
            </div>

            <div style={{ marginBottom: '4rem' }}>
                <h2 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '2rem' }}>Open Positions</h2>
                <div className={styles.jobGrid}>
                    {jobs.map((job, i) => (
                        <a key={i} href="#" className={styles.jobCard}>
                            <div>
                                <h3 className={styles.jobTitle}>{job.title}</h3>
                                <div className={styles.jobMeta}>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><Briefcase size={14} /> {job.department}</span>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><MapPin size={14} /> {job.location}</span>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><Clock size={14} /> {job.type}</span>
                                </div>
                            </div>
                            <span className={styles.applyBtn}>Apply Now</span>
                        </a>
                    ))}
                </div>
            </div>

            <div style={{ padding: '4rem', background: 'var(--surface)', borderRadius: '32px', textAlign: 'center', border: '1px solid var(--border)' }}>
                <h3 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '1rem' }}>Don't see a fit?</h3>
                <p style={{ color: 'var(--text-muted)', marginBottom: '2.5rem' }}>We are always looking for talented individuals. Send your resume to careers@prepcuet.com and we'll keep you in mind for future openings.</p>
                <a href="mailto:careers@prepcuet.com" style={{ background: 'var(--text-main)', color: 'white', padding: '1rem 2.5rem', borderRadius: '16px', fontWeight: 700, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                    Send Open Application <ArrowRight size={20} />
                </a>
            </div>
        </div>
    );
}
