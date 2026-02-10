'use client';

import { Laptop, GraduationCap, FileSearch, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import styles from './courses.module.css';

export default function CoursesPage() {
    const categories = [
        {
            title: 'Online Coaching',
            desc: 'Interactive live sessions, recorded modules, and digital study materials accessible from anywhere.',
            icon: <Laptop size={40} />,
            link: '/courses/online',
            image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070&auto=format&fit=crop'
        },
        {
            title: 'Offline Classroom',
            desc: 'Traditional physical classroom programs with personal mentorship and structured study environment.',
            icon: <GraduationCap size={40} />,
            link: '/courses/offline',
            image: 'https://images.unsplash.com/photo-1523050335392-9bef867a0578?q=80&w=2020&auto=format&fit=crop'
        },
        {
            title: 'Test Series',
            desc: 'Rigorous mock tests based on the latest CUET pattern with detailed analysis and rank tracking.',
            icon: <FileSearch size={40} />,
            link: '/test-series',
            image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=2070&auto=format&fit=crop'
        }
    ];

    return (
        <div className={styles.container}>
            <div className="container">
                <header className={styles.hero}>
                    <h1>Master Your Future</h1>
                    <p>Comprehensive preparation programs tailored for CUET success. Choose the mode of learning that fits your schedule and style.</p>
                </header>

                <div className={styles.categoryGrid}>
                    {categories.map((cat, index) => (
                        <Link key={index} href={cat.link} className={styles.categoryCard}>
                            <img src={cat.image} alt={cat.title} className={styles.image} />
                            <div className={styles.iconWrapper}>
                                {cat.icon}
                            </div>
                            <h2>{cat.title}</h2>
                            <p>{cat.desc}</p>
                            <span className={styles.viewBtn}>
                                Explore Programs <ArrowRight size={20} />
                            </span>
                        </Link>
                    ))}
                </div>

                <div style={{ marginTop: '5rem', padding: '4rem', background: 'var(--primary-light)', borderRadius: '32px', textAlign: 'center' }}>
                    <h3 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary)', marginBottom: '1rem' }}>Confused about what to choose?</h3>
                    <p style={{ fontSize: '1.2rem', color: 'var(--text-main)', marginBottom: '2rem', maxWidth: '600px', margin: '0 auto 2rem' }}>Book a free counseling session with our academic experts to find the right path for your target university.</p>
                    <Link href="/contact" style={{ display: 'inline-block', background: 'var(--primary)', color: 'white', padding: '1rem 2.5rem', borderRadius: '16px', fontWeight: 700, textDecoration: 'none' }}>
                        Book Free Counseling
                    </Link>
                </div>
            </div>
        </div>
    );
}
