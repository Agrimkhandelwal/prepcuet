import { Building, Award, Users, Search } from 'lucide-react';
import styles from './About.module.css';

export default function AboutPage() {
    return (
        <div className="container" style={{ padding: '3rem 1rem' }}>
            <section className={styles.heroSection}>
                <h1 className={styles.mainTitle}>About PrepCUET</h1>
                <p className={styles.lead}>
                    Redefining CUET preparation with simplifying content, result-oriented guidance, and a student-centric approach.
                </p>
            </section>

            <section className={styles.missionGrid}>
                <div className={styles.featureCard}>
                    <Building size={48} className={styles.icon} />
                    <h3>Our Legacy</h3>
                    <p>Founded in 2014, we have helped over 5000+ aspirants realize their dream of becoming Civil Servants.</p>
                </div>
                <div className={styles.featureCard}>
                    <Award size={48} className={styles.icon} />
                    <h3>Excellence</h3>
                    <p>Our test series and current affairs initiatives are recognized as the industry standard for quality and relevance.</p>
                </div>
                <div className={styles.featureCard}>
                    <Users size={48} className={styles.icon} />
                    <h3>Community</h3>
                    <p>We foster a competitive yet collaborative environment where every student is mentored personally.</p>
                </div>
            </section>

            <div className={styles.divider}></div>

            <section className={styles.contactDetails}>
                <h2 className={styles.sectionTitle}>Contact Us</h2>
                <div className={styles.contactGrid}>
                    <div className={styles.detailsCol}>
                        <div className={styles.contactGroup}>
                            <h4>Head Office</h4>
                            <p>No. 74, 2nd Floor, Above Dominos Pizza,<br /> Chandra Layout Main Road,<br /> Bangalore - 560040</p>
                        </div>
                        <div className={styles.contactGroup}>
                            <h4>Contact Numbers</h4>
                            <p>Admissions: +91 9988776655</p>
                            <p>Support: +91 9988776644</p>
                        </div>
                        <div className={styles.contactGroup}>
                            <h4>Email</h4>
                            <p>enquiry@prepcuet.com</p>
                        </div>
                        <div className={styles.contactGroup}>
                            <h4>Working Hours</h4>
                            <p>Monday - Saturday: 10:00 AM - 7:00 PM</p>
                            <p>Sunday: 10:00 AM - 2:00 PM</p>
                        </div>
                    </div>

                    <div className={styles.formCol}>
                        <h4>Send us a Message</h4>
                        <form className={styles.form}>
                            <input type="text" placeholder="Your Name" className={styles.input} />
                            <input type="email" placeholder="Email Address" className={styles.input} />
                            <input type="tel" placeholder="Phone Number" className={styles.input} />
                            <textarea rows={5} placeholder="How can we help you?" className={styles.textarea}></textarea>
                            <button type="button" className={styles.submitBtn}>Send Message</button>
                        </form>
                    </div>
                </div>
            </section>
        </div>
    );
}
