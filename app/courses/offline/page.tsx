'use client';

import { MapPin, Users, Coffee, BookOpen, Clock, CheckCircle } from 'lucide-react';
import styles from '../courses.module.css';

export default function OfflineClassroomPage() {
    const benefits = [
        { title: 'Personal Mentorship', desc: 'Face-to-face interaction with teachers for a more engaged learning experience.' },
        { title: 'Structured Environment', desc: 'Distraction-free physical classrooms designed to maximize focus and discipline.' },
        { title: 'Peer Learning', desc: 'Study alongside dedicated aspirants and participate in group discussions.' },
        { title: 'Library Access', desc: '24/7 access to our extensive physical library and study materials.' }
    ];

    return (
        <div className={styles.container}>
            <div className="container">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center', marginBottom: '6rem' }}>
                    <div style={{ order: 2 }}>
                        <h1 style={{ fontSize: '3.5rem', fontWeight: 900, marginBottom: '1.5rem', color: 'var(--text-main)' }}>Offline Classrooms</h1>
                        <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)', marginBottom: '2.5rem' }}>Experience the power of traditional learning with our state-of-the-art classroom facilities in the heart of the city.</p>
                        <ul style={{ listStyle: 'none', padding: 0, marginBottom: '3rem' }}>
                            <li style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem', fontWeight: 600 }}>
                                <MapPin size={24} color="var(--primary)" /> Chandra Layout, Bangalore (Main Center)
                            </li>
                            <li style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem', fontWeight: 600 }}>
                                <MapPin size={24} color="var(--primary)" /> Rajajinagar, Bangalore (Branch)
                            </li>
                        </ul>
                        <button style={{ background: 'var(--primary)', color: 'white', padding: '1.25rem 3rem', borderRadius: '16px', fontWeight: 700, border: 'none', cursor: 'pointer' }}>
                            Visit Center for Counseling
                        </button>
                    </div>
                    <div style={{ order: 1 }}>
                        <img
                            src="https://images.unsplash.com/photo-1577891729319-f4874c73988e?q=80&w=2070&auto=format&fit=crop"
                            alt="Offline Classroom"
                            style={{ width: '100%', borderRadius: '32px', boxShadow: '0 20px 60px rgba(0,0,0,0.1)' }}
                        />
                    </div>
                </div>

                <div style={{ marginBottom: '6rem' }}>
                    <h2 style={{ fontSize: '2.5rem', fontWeight: 800, textAlign: 'center', marginBottom: '4rem', color: 'var(--text-main)' }}>The Offline Advantage</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
                        {benefits.map((b, i) => (
                            <div key={i} style={{ padding: '2.5rem', background: 'white', border: '1px solid var(--border)', borderRadius: '24px', textAlign: 'center' }}>
                                <div style={{ width: '64px', height: '64px', background: 'var(--primary-light)', color: 'var(--primary)', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem' }}>
                                    <CheckCircle size={32} />
                                </div>
                                <h4 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '1rem', color: 'var(--text-main)' }}>{b.title}</h4>
                                <p style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>{b.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div style={{ padding: '4rem', background: 'var(--text-main)', borderRadius: '32px', color: 'white', textAlign: 'center' }}>
                    <h3 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '1.5rem' }}>Limited Seats Available</h3>
                    <p style={{ fontSize: '1.2rem', opacity: 0.8, marginBottom: '2.5rem', maxWidth: '600px', margin: '0 auto 2.5rem' }}>Our offline batches have limited intake to ensure personalized attention for every student. Reserve your seat today!</p>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem' }}>
                        <div style={{ padding: '1.5rem 2.5rem', background: 'rgba(255,255,255,0.1)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.2)' }}>
                            <div style={{ fontSize: '2rem', fontWeight: 800 }}>12</div>
                            <div style={{ fontSize: '0.8rem', opacity: 0.6 }}>Seats Left (Morning)</div>
                        </div>
                        <div style={{ padding: '1.5rem 2.5rem', background: 'rgba(255,255,255,0.1)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.2)' }}>
                            <div style={{ fontSize: '2rem', fontWeight: 800 }}>08</div>
                            <div style={{ fontSize: '0.8rem', opacity: 0.6 }}>Seats Left (Evening)</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
