'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Quote, Star } from 'lucide-react';
import styles from './Testimonials.module.css';

interface Testimonial {
    id: number;
    name: string;
    role: string;
    image: string;
    rating: number;
    text: string;
    selection?: string;
}

const testimonials: Testimonial[] = [
    {
        id: 1,
        name: 'Priya Sharma',
        role: 'DU 2024',
        image: '👩‍💼',
        rating: 5,
        text: 'PrepCUET transformed my CUET preparation journey. The structured approach and exceptional faculty guidance helped me clear the exam in my first attempt.',
        selection: 'Delhi University'
    },
    {
        id: 2,
        name: 'Rahul Verma',
        role: 'JNU 2024',
        image: '👨‍💼',
        rating: 5,
        text: 'The test series here mirrors the actual CUET pattern perfectly. The detailed analysis after each test helped me identify and work on my weak areas effectively.',
        selection: 'JNU Admission'
    },
    {
        id: 3,
        name: 'Anjali Patel',
        role: 'BHU 2023',
        image: '👩‍🎓',
        rating: 5,
        text: 'Current affairs compilation and daily quizzes kept me updated and exam-ready throughout my preparation. Highly recommended for serious aspirants!',
        selection: 'Banaras Hindu University'
    },
    {
        id: 4,
        name: 'Vikram Singh',
        role: 'Jamia 2023',
        image: '👨‍🎓',
        rating: 5,
        text: 'The personal mentorship program made all the difference. My mentor understood my strengths and helped me craft an optimal preparation strategy.',
        selection: 'Jamia Millia Islamia'
    }
];

export default function Testimonials() {
    const [current, setCurrent] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);

    const next = () => {
        if (isAnimating) return;
        setIsAnimating(true);
        setCurrent((prev) => (prev + 1) % testimonials.length);
    };

    const prev = () => {
        if (isAnimating) return;
        setIsAnimating(true);
        setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    };

    useEffect(() => {
        const timer = setTimeout(() => setIsAnimating(false), 500);
        return () => clearTimeout(timer);
    }, [current]);

    useEffect(() => {
        const autoSlide = setInterval(next, 5000);
        return () => clearInterval(autoSlide);
    }, []);

    const testimonial = testimonials[current];

    return (
        <section className={styles.testimonialSection}>
            <div className="container">
                <div className={styles.header}>
                    <span className={styles.badge}>Testimonials</span>
                    <h2 className={styles.title}>What Our Toppers Say</h2>
                    <p className={styles.subtitle}>
                        Hear from students who achieved their dreams with PrepCUET
                    </p>
                </div>

                <div className={styles.carousel}>
                    <button className={styles.navBtn} onClick={prev} aria-label="Previous">
                        <ChevronLeft size={24} />
                    </button>

                    <div className={styles.testimonialCard}>
                        <div className={styles.quoteIcon}>
                            <Quote size={40} />
                        </div>

                        <p className={styles.testimonialText}>{testimonial.text}</p>

                        <div className={styles.rating}>
                            {Array.from({ length: testimonial.rating }).map((_, i) => (
                                <Star key={i} size={18} fill="#f59e0b" color="#f59e0b" />
                            ))}
                        </div>

                        <div className={styles.authorInfo}>
                            <div className={styles.avatar}>{testimonial.image}</div>
                            <div className={styles.authorDetails}>
                                <h4>{testimonial.name}</h4>
                                <p>{testimonial.role}</p>
                            </div>
                            {testimonial.selection && (
                                <div className={styles.selectionBadge}>
                                    {testimonial.selection}
                                </div>
                            )}
                        </div>
                    </div>

                    <button className={styles.navBtn} onClick={next} aria-label="Next">
                        <ChevronRight size={24} />
                    </button>
                </div>

                <div className={styles.dots}>
                    {testimonials.map((_, index) => (
                        <button
                            key={index}
                            className={`${styles.dot} ${index === current ? styles.dotActive : ''}`}
                            onClick={() => setCurrent(index)}
                            aria-label={`Go to testimonial ${index + 1}`}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
