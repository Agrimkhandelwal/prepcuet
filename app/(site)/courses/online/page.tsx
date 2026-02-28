'use client';

import { Play, Calendar, Users, Target, ShieldCheck, CheckCircle2, Clock } from 'lucide-react';
import styles from '../courses.module.css';

export default function OnlineBatchesPage() {
    const features = [
        { title: 'Live Interactive Classes', desc: 'Real-time sessions with top faculty where you can ask doubts instantly.' },
        { title: 'Recorded Backups', desc: 'Missed a class? Access high-quality recordings anytime for revision.' },
        { title: 'Digital Study Kits', desc: 'Comprehensive PDFs, chapter-wise notes, and e-books for all subjects.' },
        { title: 'Weekly Online Tests', desc: 'Regular assessments to track your progress and identify weak areas.' }
    ];

    return (
        <div className={styles.container}>
            <div className="container">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center', marginBottom: '6rem' }}>
                    <div>
                        <h1 style={{ fontSize: '3.5rem', fontWeight: 900, marginBottom: '1.5rem', color: 'var(--text-main)' }}>Online CUET Coaching</h1>
                        <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)', marginBottom: '2.5rem' }}>Learn from the comfort of your home with our flagship online programs designed specifically for CUET UG success.</p>
                        <div style={{ display: 'flex', gap: '2rem', marginBottom: '3rem' }}>
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ fontWeight: 800, fontSize: '1.5rem', color: 'var(--primary)' }}>200+</div>
                                <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Live Hours</div>
                            </div>
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ fontWeight: 800, fontSize: '1.5rem', color: 'var(--primary)' }}>500+</div>
                                <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Mock Tests</div>
                            </div>
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ fontWeight: 800, fontSize: '1.5rem', color: 'var(--primary)' }}>24/7</div>
                                <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Doubt Support</div>
                            </div>
                        </div>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem', background: 'rgba(30, 41, 59, 0.4)', backdropFilter: 'blur(10px)', color: '#fff', border: '1px solid rgba(52, 211, 153, 0.3)', padding: '1rem 2.5rem', borderRadius: '50px', fontWeight: 600, fontSize: '1.1rem', boxShadow: '0 0 20px rgba(52, 211, 153, 0.1), inset 0 0 10px rgba(52, 211, 153, 0.05)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '28px', height: '28px', background: 'rgba(52, 211, 153, 0.2)', borderRadius: '50%', color: '#34d399' }}>
                                <Calendar size={16} />
                            </div>
                            Enrollment Starting Soon
                        </div>
                    </div>
                    <div style={{ position: 'relative' }}>
                        <img
                            src="https://images.unsplash.com/photo-1571260899304-425eee4c7efc?q=80&w=2070&auto=format&fit=crop"
                            alt="Online Study"
                            style={{ width: '100%', borderRadius: '32px', boxShadow: '0 20px 60px rgba(0,0,0,0.1)' }}
                        />
                        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', background: 'white', padding: '1.5rem', borderRadius: '50%', color: 'var(--primary)', cursor: 'pointer', boxShadow: '0 10px 30px rgba(0,0,0,0.2)' }}>
                            <Play size={32} fill="currentColor" />
                        </div>
                    </div>
                </div>

                <div style={{ marginBottom: '6rem' }}>
                    <h2 style={{ fontSize: '2.5rem', fontWeight: 800, textAlign: 'center', marginBottom: '4rem', color: 'var(--text-main)' }}>Why choose our Online Batch?</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2.5rem' }}>
                        {features.map((f, i) => (
                            <div key={i} style={{ padding: '2.5rem', background: 'white', border: '1px solid var(--border)', borderRadius: '24px' }}>
                                <div style={{ color: 'var(--primary)', marginBottom: '1.5rem' }}>
                                    <CheckCircle2 size={32} />
                                </div>
                                <h4 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '1rem', color: 'var(--text-main)' }}>{f.title}</h4>
                                <p style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div style={{ padding: '4rem', background: 'var(--surface)', borderRadius: '32px', textAlign: 'center' }}>
                    <h3 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '3rem' }}>Available Batches</h3>
                    <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center', padding: '4rem 2rem', background: 'linear-gradient(145deg, rgba(30, 41, 59, 0.7) 0%, rgba(15, 23, 42, 0.8) 100%)', backdropFilter: 'blur(10px)', border: '1px dashed rgba(255, 255, 255, 0.1)', borderRadius: '32px', position: 'relative', overflow: 'hidden' }}>
                        {/* Glow effect */}
                        <div style={{ position: 'absolute', top: '-50%', left: '50%', transform: 'translateX(-50%)', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, transparent 70%)', filter: 'blur(40px)', zIndex: 0 }} />

                        <div style={{ position: 'relative', zIndex: 1 }}>
                            <div style={{ width: '80px', height: '80px', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', color: '#60a5fa', boxShadow: '0 0 30px rgba(59, 130, 246, 0.2)' }}>
                                <Clock size={40} />
                            </div>
                            <h4 style={{ fontSize: '2rem', fontWeight: 800, color: '#fff', marginBottom: '1rem', letterSpacing: '-0.02em' }}>Batches Announcing Soon</h4>
                            <p style={{ color: '#94a3b8', fontSize: '1.15rem', lineHeight: 1.6, maxWidth: '600px', margin: '0 auto' }}>We are meticulously designing the curriculum and finalizing schedules with India's top CUET educators. Complete batch details will be revealed here shortly.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
