'use client';

import { Users, BookOpen, Clock, Award, Target, Headphones } from 'lucide-react';
import styles from './WhyChooseUs.module.css';

const features = [
    {
        icon: <Users size={28} />,
        title: 'Expert Faculty',
        description: 'Learn from CUET toppers and subject matter experts with 15+ years of teaching experience.',
        highlight: '50+ Faculty'
    },
    {
        icon: <BookOpen size={28} />,
        title: 'Comprehensive Study Material',
        description: 'Well-researched notes, detailed explanations, and exam-focused content updated regularly.',
        highlight: '1000+ Resources'
    },
    {
        icon: <Target size={28} />,
        title: 'Personalized Mentorship',
        description: 'One-on-one guidance to create customized study plans based on your strengths and weaknesses.',
        highlight: '1:15 Ratio'
    },
    {
        icon: <Clock size={28} />,
        title: 'Flexible Learning',
        description: 'Access recorded lectures, live classes, and study materials anytime, anywhere.',
        highlight: '24/7 Access'
    },
    {
        icon: <Award size={28} />,
        title: 'Proven Track Record',
        description: 'Consistent results with 500+ university admissions including DU, JNU, BHU and more.',
        highlight: '500+ Selections'
    },
    {
        icon: <Headphones size={28} />,
        title: 'Doubt Resolution',
        description: 'Get your doubts resolved within 24 hours through our dedicated support system.',
        highlight: '<24h Response'
    }
];

export default function WhyChooseUs() {
    return (
        <section className={styles.whySection}>
            <div className="container">
                <div className={styles.header}>
                    <span className={styles.badge}>Why PrepCUET</span>
                    <h2 className={styles.title}>The PrepCUET Advantage</h2>
                    <p className={styles.subtitle}>
                        Discover what makes us the preferred choice for serious CUET aspirants
                    </p>
                </div>

                <div className={styles.featuresGrid}>
                    {features.map((feature, index) => (
                        <div key={index} className={styles.featureCard}>
                            <div className={styles.cardTop}>
                                <div className={styles.iconBox}>
                                    {feature.icon}
                                </div>
                                <span className={styles.highlight}>{feature.highlight}</span>
                            </div>
                            <h3 className={styles.featureTitle}>{feature.title}</h3>
                            <p className={styles.featureDesc}>{feature.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
