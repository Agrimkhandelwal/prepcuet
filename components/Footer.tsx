'use client';

import Link from 'next/link';
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from 'lucide-react';
import { useLanguage } from '@/app/context/LanguageContext';
import styles from './Footer.module.css';

export default function Footer() {
    const { t } = useLanguage();

    return (
        <footer className={styles.footer}>
            <div className="container">
                <div className={styles.grid}>
                    {/* About Column */}
                    <div className={styles.col}>
                        <h3 className={styles.heading}>PrepCUET</h3>
                        <p className={styles.text}>
                            {t.footer.aboutText}
                        </p>
                        <div className={styles.socials}>
                            <a href="#" className={styles.socialIcon}><Facebook size={20} /></a>
                            <a href="#" className={styles.socialIcon}><Twitter size={20} /></a>
                            <a href="#" className={styles.socialIcon}><Instagram size={20} /></a>
                            <a href="#" className={styles.socialIcon}><Youtube size={20} /></a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className={styles.col}>
                        <h4 className={styles.subHeading}>{t.footer.quickLinks}</h4>
                        <ul className={styles.links}>
                            <li><Link href="/about">{t.footer.aboutUs}</Link></li>
                            <li><Link href="/courses">{t.footer.allCourses}</Link></li>
                            <li><Link href="/current-affairs">{t.quickLinks.currentAffairs}</Link></li>
                            <li><Link href="/toppers">{t.footer.toppersTalk}</Link></li>
                            <li><Link href="/resources">{t.footer.freeResources}</Link></li>
                        </ul>
                    </div>

                    {/* Legal/Support */}
                    <div className={styles.col}>
                        <h4 className={styles.subHeading}>{t.footer.support}</h4>
                        <ul className={styles.links}>
                            <li><Link href="/contact">{t.footer.contactUs}</Link></li>
                            <li><Link href="/faq">{t.footer.faqs}</Link></li>
                            <li><Link href="/terms">{t.footer.terms}</Link></li>
                            <li><Link href="/privacy">{t.footer.privacy}</Link></li>
                            <li><Link href="/careers">{t.footer.careers}</Link></li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div className={styles.col}>
                        <h4 className={styles.subHeading}>{t.footer.getInTouch}</h4>
                        <ul className={styles.contactList}>
                            <li>
                                <MapPin size={18} className={styles.icon} />
                                <span>Jaipur , Rajasthan</span>
                            </li>
                            <li>
                                <Phone size={18} className={styles.icon} />
                                <span>+91 8209728958</span>
                            </li>
                            <li>
                                <Mail size={18} className={styles.icon} />
                                <span>preepcuet@gmail.com</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className={styles.bottomBar}>
                    <p>&copy; {new Date().getFullYear()} PrepCUET. {t.footer.rights}</p>
                </div>
            </div>
        </footer>
    );
}
