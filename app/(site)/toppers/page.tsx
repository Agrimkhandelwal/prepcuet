'use client';

import { Trophy, Star, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import styles from './page.module.css';

export default function ToppersPage() {
    const toppers = [
        {
            name: 'Anjali Sharma',
            university: 'University of Delhi (Hindu College)',
            score: '796/800',
            rank: 'AIR 04',
            img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1974&auto=format&fit=crop',
            text: 'PrepCUET\'s mock tests were a game changer. The detailed analysis helped me identify my weak spots in the Domain subjects.'
        },
        {
            name: 'Rahul Verma',
            university: 'Banaras Hindu University (BHU)',
            score: '788/800',
            rank: 'AIR 12',
            img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974&auto=format&fit=crop',
            text: 'The 1-on-1 mentorship sessions provided me with the clarity I needed for the General Test section. Truly grateful!'
        },
        {
            name: 'Priya Iyer',
            university: 'Jawaharlal Nehru University (JNU)',
            score: '782/800',
            rank: 'AIR 28',
            img: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=2070&auto=format&fit=crop',
            text: 'The study material is so well-structured. It covers everything from basic concepts to advanced problem-solving.'
        },
        {
            name: 'Siddharth Malviya',
            university: 'Jamia Millia Islamia',
            score: '775/800',
            rank: 'AIR 45',
            img: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=2070&auto=format&fit=crop',
            text: 'The live classes felt just like offline ones. The teachers are very approachable and dedicated.'
        }
    ];

    return (
        <div className={styles.container}>
            <div className="container">
                <header className={styles.hero}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'var(--primary-light)', color: 'var(--primary)', padding: '0.5rem 1rem', borderRadius: '30px', fontWeight: 700, marginBottom: '2rem' }}>
                        <Star size={18} fill="currentColor" /> Our Wall of Fame
                    </div>
                    <h1>Celebrating Our Toppers</h1>
                    <p>Meet the brilliant minds who turned their dreams into reality with dedicated preparation and our expert guidance.</p>
                </header>

                <div className={styles.toppersGrid}>
                    {toppers.map((t, i) => (
                        <div key={i} className={styles.topperCard}>
                            <div className={styles.rankBadge}>{t.rank}</div>
                            <img src={t.img} alt={t.name} className={styles.topperImage} />
                            <h3 className={styles.topperName}>{t.name}</h3>
                            <span className={styles.university}>{t.university}</span>
                            <div style={{ background: 'var(--background)', padding: '0.75rem', borderRadius: '12px', display: 'inline-block', marginBottom: '1.5rem', fontWeight: 800 }}>
                                CUET Score: <span style={{ color: 'var(--primary)' }}>{t.score}</span>
                            </div>
                            <p className={styles.testimonial}>{t.text}</p>
                            <button style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem', margin: '0 auto', cursor: 'pointer', fontSize: '0.9rem' }}>
                                View Full Interview <ExternalLink size={14} />
                            </button>
                        </div>
                    ))}
                </div>

                <div style={{ textAlign: 'center', padding: '5rem', background: 'var(--text-main)', borderRadius: '40px', color: 'white' }}>
                    <Trophy size={60} style={{ marginBottom: '2rem', color: 'gold' }} />
                    <h2 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '1rem' }}>Ready to be on this wall?</h2>
                    <p style={{ fontSize: '1.2rem', opacity: 0.7, marginBottom: '3rem', maxWidth: '500px', margin: '0 auto 3rem' }}>Join the most comprehensive CUET preparation platform and secure your seat in your dream university.</p>
                    <Link href="/signup" style={{ background: 'var(--primary)', color: 'white', padding: '1.25rem 3.5rem', borderRadius: '18px', fontWeight: 800, textDecoration: 'none', display: 'inline-block' }}>
                        Start Your Journey Now
                    </Link>
                </div>
            </div>
        </div>
    );
}
