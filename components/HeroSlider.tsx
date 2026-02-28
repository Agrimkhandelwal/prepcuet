'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronRight, ChevronLeft, GraduationCap, Trophy, Target, Sparkles } from 'lucide-react';
import styles from './HeroSlider.module.css';
import { db } from '@/lib/firebase';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';

interface Banner {
    id: string;
    title: string;
    subtitle?: string;
    description: string;
    badge: string | null;
    cta: string;
    link: string;
    color: string;
    active: boolean;
    order: number;
}

export default function HeroSlider() {
    const [current, setCurrent] = useState(0);
    const [slides, setSlides] = useState<Banner[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBanners = async () => {
            try {
                // Fetch only active banners
                // We do client-side sorting to avoid requiring a composite index in Firestore
                const q = query(
                    collection(db, 'banners'),
                    where('active', '==', true)
                );

                const snapshot = await getDocs(q);
                const activeBanners = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                })) as Banner[];

                // Sort by order ascending
                activeBanners.sort((a, b) => (a.order || 0) - (b.order || 0));

                // If there are still no records because they haven't been saved yet,
                // fall back to the original mocks just so the page isn't totally empty during migration
                if (activeBanners.length === 0) {
                    setSlides([
                        {
                            id: 'mock-1',
                            title: "Integrated Foundation Batch 2026",
                            subtitle: "Admissions Open | Starts Feb 15th",
                            description: "Comprehensive coverage of all subjects with personal mentorship.",
                            cta: "Enroll Now",
                            link: "/courses/foundation-2026",
                            badge: "New Batch",
                            color: "linear-gradient(135deg, #1e293b 0%, #334155 100%)",
                            active: true,
                            order: 0
                        },
                        {
                            id: 'mock-2',
                            title: "CUET Mock Test Series 2026",
                            subtitle: "Boost your score with 30+ Tests",
                            description: "Scientifically designed test series to improve accuracy and speed.",
                            cta: "View Schedule",
                            link: "/courses/test-series",
                            badge: "Early Bird Offer",
                            color: "linear-gradient(135deg, #b91c1c 0%, #991b1b 100%)",
                            active: true,
                            order: 1
                        },
                        {
                            id: 'mock-3',
                            title: "Subject-wise Preparation",
                            subtitle: "Master Each Subject",
                            description: "Expert faculty for all CUET subjects with comprehensive study material.",
                            cta: "Learn More",
                            link: "/courses/subjects",
                            badge: null,
                            color: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
                            active: true,
                            order: 2
                        }
                    ]);
                } else {
                    setSlides(activeBanners);
                }
            } catch (error) {
                console.error("Error fetching banners:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchBanners();
    }, []);

    useEffect(() => {
        if (slides.length <= 1) return;

        const timer = setInterval(() => {
            setCurrent((prev) => (prev + 1) % slides.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [slides]);

    const next = () => setCurrent((c) => (c + 1) % slides.length);
    const prev = () => setCurrent((c) => (c === 0 ? slides.length - 1 : c - 1));

    if (loading) return <div style={{ height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--surface)', margin: '2rem 0', borderRadius: '24px' }}>Loading...</div>;

    // In rare case where admins turn off ALL banners
    if (slides.length === 0) return null;

    return (
        <div className={styles.sliderContainer}>
            <div className={styles.slider} style={{ transform: `translateX(-${current * (100 / slides.length)}%)`, width: `${slides.length * 100}%` }}>
                {slides.map((slide) => (
                    <div key={slide.id} className={styles.slide} style={{ background: slide.color, width: `${100 / slides.length}%` }}>
                        <div className={`container ${styles.slideContent}`}>
                            <div className={styles.textContent}>
                                {slide.badge && <span className={styles.badge}>{slide.badge}</span>}
                                {slide.subtitle && <div className={styles.subtitle}>{slide.subtitle}</div>}
                                <h2 className={styles.title}>{slide.title}</h2>
                                <p className={styles.description}>{slide.description}</p>
                                <Link href={slide.link} className={styles.ctaButton}>
                                    {slide.cta} <ChevronRight size={16} />
                                </Link>
                            </div>
                            <div className={styles.imagePlaceholder}>
                                {/* Animated Abstract Backgrounds */}
                                <div className={styles.abstractShape1} />
                                <div className={styles.abstractShape2} />

                                {/* Floating Premium Icons Composition */}
                                <div className={styles.floatingIconCenter}>
                                    <GraduationCap size={80} color="white" strokeWidth={1.5} />
                                </div>
                                <div className={styles.floatingIconTopRight}>
                                    <Trophy size={48} color="white" strokeWidth={1.5} />
                                </div>
                                <div className={styles.floatingIconBottomLeft}>
                                    <Target size={56} color="white" strokeWidth={1.5} />
                                </div>

                                <div className={styles.glassCard}>
                                    <div className={styles.glassIcon}>
                                        <Sparkles size={20} color="#fbbf24" fill="#fbbf24" />
                                    </div>
                                    <div className={styles.glassText}>Premium Preparation</div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {slides.length > 1 && (
                <>
                    <button className={`${styles.navBtn} ${styles.prev}`} onClick={prev}>
                        <ChevronLeft size={24} />
                    </button>
                    <button className={`${styles.navBtn} ${styles.next}`} onClick={next}>
                        <ChevronRight size={24} />
                    </button>

                    <div className={styles.indicators}>
                        {slides.map((_, idx) => (
                            <button
                                key={idx}
                                className={`${styles.dot} ${idx === current ? styles.active : ''}`}
                                onClick={() => setCurrent(idx)}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
