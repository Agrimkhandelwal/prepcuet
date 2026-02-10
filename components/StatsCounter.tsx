'use client';

import { useEffect, useState, useRef } from 'react';
import { Users, Award, BookOpen, Trophy } from 'lucide-react';
import styles from './StatsCounter.module.css';

interface Stat {
    icon: React.ReactNode;
    value: number;
    suffix: string;
    label: string;
}

const stats: Stat[] = [
    { icon: <Users size={32} />, value: 10000, suffix: '+', label: 'Students Enrolled' },
    { icon: <Trophy size={32} />, value: 500, suffix: '+', label: 'Selections' },
    { icon: <BookOpen size={32} />, value: 50, suffix: '+', label: 'Courses Available' },
    { icon: <Award size={32} />, value: 15, suffix: '', label: 'Years Experience' }
];

export default function StatsCounter() {
    const [isVisible, setIsVisible] = useState(false);
    const [counts, setCounts] = useState(stats.map(() => 0));
    const sectionRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                }
            },
            { threshold: 0.3 }
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        if (!isVisible) return;

        const duration = 2000;
        const steps = 60;
        const interval = duration / steps;

        let currentStep = 0;
        const timer = setInterval(() => {
            currentStep++;
            const progress = currentStep / steps;
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);

            setCounts(stats.map(stat => Math.floor(stat.value * easeOutQuart)));

            if (currentStep >= steps) {
                clearInterval(timer);
                setCounts(stats.map(stat => stat.value));
            }
        }, interval);

        return () => clearInterval(timer);
    }, [isVisible]);

    return (
        <section className={styles.statsSection} ref={sectionRef}>
            <div className={styles.background}>
                <div className={styles.pattern}></div>
            </div>
            <div className="container">
                <div className={styles.statsGrid}>
                    {stats.map((stat, index) => (
                        <div key={index} className={styles.statCard}>
                            <div className={styles.iconWrapper}>
                                {stat.icon}
                            </div>
                            <div className={styles.statValue}>
                                {counts[index].toLocaleString()}{stat.suffix}
                            </div>
                            <div className={styles.statLabel}>{stat.label}</div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
