'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import styles from './HeroSlider.module.css';

const SLIDES = [
    {
        id: 1,
        title: "Integrated Foundation Batch 2026",
        subtitle: "Admissions Open | Starts Feb 15th",
        description: "Comprehensive coverage of all CUET subjects with personal mentorship.",
        cta: "Enroll Now",
        link: "/courses/foundation-2026",
        badge: "New Batch",
        color: "linear-gradient(135deg, #1e293b 0%, #334155 100%)"
    },
    {
        id: 2,
        title: "CUET Test Series 2026",
        subtitle: "Boost your score with 30+ Tests",
        description: "Scientifically designed test series to improve accuracy and speed.",
        cta: "View Schedule",
        link: "/courses/test-series",
        badge: "Early Bird Offer",
        color: "linear-gradient(135deg, #b91c1c 0%, #991b1b 100%)"
    },
    {
        id: 3,
        title: "Domain Subjects - Complete Course",
        subtitle: "By Expert Faculty",
        description: "Master your domain subjects with our intensive classroom program.",
        cta: "Learn More",
        link: "/courses/optional",
        badge: null,
        color: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)"
    }
];

export default function HeroSlider() {
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrent((prev) => (prev + 1) % SLIDES.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    const next = () => setCurrent((c) => (c + 1) % SLIDES.length);
    const prev = () => setCurrent((c) => (c === 0 ? SLIDES.length - 1 : c - 1));

    return (
        <div className={styles.sliderContainer}>
            <div className={styles.slider} style={{ transform: `translateX(-${current * 100}%)` }}>
                {SLIDES.map((slide) => (
                    <div key={slide.id} className={styles.slide} style={{ background: slide.color }}>
                        <div className={`container ${styles.slideContent}`}>
                            <div className={styles.textContent}>
                                {slide.badge && <span className={styles.badge}>{slide.badge}</span>}
                                <div className={styles.subtitle}>{slide.subtitle}</div>
                                <h2 className={styles.title}>{slide.title}</h2>
                                <p className={styles.description}>{slide.description}</p>
                                <Link href={slide.link} className={styles.ctaButton}>
                                    {slide.cta} <ChevronRight size={16} />
                                </Link>
                            </div>
                            <div className={styles.imagePlaceholder}>
                                {/* Placeholder for image/illustration */}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <button className={`${styles.navBtn} ${styles.prev}`} onClick={prev}>
                <ChevronLeft size={24} />
            </button>
            <button className={`${styles.navBtn} ${styles.next}`} onClick={next}>
                <ChevronRight size={24} />
            </button>

            <div className={styles.indicators}>
                {SLIDES.map((_, idx) => (
                    <button
                        key={idx}
                        className={`${styles.dot} ${idx === current ? styles.active : ''}`}
                        onClick={() => setCurrent(idx)}
                    />
                ))}
            </div>
        </div>
    );
}
