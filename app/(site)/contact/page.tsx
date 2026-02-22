'use client';

import { Mail, Phone, MapPin, Send, Instagram, Twitter, Youtube } from 'lucide-react';
import styles from './contact.module.css';

export default function ContactPage() {
    return (
        <div className={styles.container}>
            <div className="container">
                <div className={styles.contactWrapper}>
                    {/* Info Card */}
                    <div className={styles.infoCard}>
                        <div style={{ marginBottom: '1rem' }}>
                            <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '1rem' }}>Contact Information</h2>
                            <p style={{ opacity: 0.7 }}>Fill out the form and our team will get back to you within 24 hours.</p>
                        </div>

                        <div className={styles.infoItem}>
                            <div className={styles.iconBox}>
                                <Phone size={24} />
                            </div>
                            <div>
                                <h4 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Phone</h4>
                                <p style={{ opacity: 0.8 }}>+91 8209728958</p>
                            </div>
                        </div>

                        <div className={styles.infoItem}>
                            <div className={styles.iconBox}>
                                <Mail size={24} />
                            </div>
                            <div>
                                <h4 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Email</h4>
                                <p style={{ opacity: 0.8 }}>preepcuet@gmail.com</p>
                            </div>
                        </div>

                        <div className={styles.infoItem}>
                            <div className={styles.iconBox}>
                                <MapPin size={24} />
                            </div>
                            <div>
                                <h4 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Office</h4>
                                <p style={{ opacity: 0.8 }}>Jaipur, Rajasthan</p>
                            </div>
                        </div>
                        <div className={styles.infoItem}>
                            <div className={styles.iconBox}>
                                <MapPin size={24} />
                            </div>
                            <div>
                                <h6 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Founder</h6>
                                <p style={{ opacity: 0.8 }}>Rajit khandelwal</p>
                            </div>
                        </div>

                        <div style={{ marginTop: 'auto', display: 'flex', gap: '1.5rem' }}>
                            <a href="#" style={{ color: 'white', opacity: 0.7 }}><Instagram size={24} /></a>
                            <a href="#" style={{ color: 'white', opacity: 0.7 }}><Twitter size={24} /></a>
                            <a href="#" style={{ color: 'white', opacity: 0.7 }}><Youtube size={24} /></a>
                        </div>
                    </div>

                    {/* Form Section */}
                    <div className={styles.formSection}>
                        <h1>Get in touch</h1>
                        <p>Have any questions about our batches, test series, or specific subjects? We're here to help.</p>

                        <form className={styles.contactForm}>
                            <div className={styles.inputGroup}>
                                <input type="text" placeholder="First Name" className={styles.inputField} />
                            </div>
                            <div className={styles.inputGroup}>
                                <input type="text" placeholder="Last Name" className={styles.inputField} />
                            </div>
                            <div className={styles.inputGroup}>
                                <input type="email" placeholder="Email Address" className={styles.inputField} />
                            </div>
                            <div className={styles.inputGroup}>
                                <input type="tel" placeholder="Phone Number" className={styles.inputField} />
                            </div>
                            <div className={styles.fullWidth}>
                                <select className={styles.inputField}>
                                    <option>Select Subject of Interest</option>
                                    <option>Online Batch Inquiry</option>
                                    <option>Offline Classes</option>
                                    <option>Test Series Issues</option>
                                    <option>Others</option>
                                </select>
                            </div>
                            <div className={styles.fullWidth}>
                                <textarea placeholder="How can we help you?" className={`${styles.inputField} ${styles.textArea}`}></textarea>
                            </div>
                            <div className={styles.fullWidth}>
                                <button type="submit" className={styles.submitBtn}>
                                    Send Message <Send size={20} style={{ marginLeft: '10px', verticalAlign: 'middle' }} />
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
