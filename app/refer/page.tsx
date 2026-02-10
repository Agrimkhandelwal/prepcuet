'use client';

import { useState } from 'react';
import {
    Gift, Share2, Users, Wallet, Copy,
    Check, Twitter, Facebook, MessageCircle
} from 'lucide-react';
import styles from './refer.module.css';

export default function ReferPage() {
    const [copied, setCopied] = useState(false);
    const referCode = 'PREP100';

    const handleCopy = () => {
        navigator.clipboard.writeText(referCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className={styles.container}>
            <div className="container">
                <div className={styles.referWrapper}>
                    {/* Hero Section */}
                    <div className={styles.heroCard}>
                        <Gift size={64} style={{ marginBottom: '1.5rem', color: 'white' }} />
                        <h1>Spread the Knowledge, Reap the Rewards</h1>
                        <p>Invite your friends to PrepCUET. They get ₹100 off, and you get ₹200 in your wallet for every successful enrollment!</p>

                        <div className={styles.codeBox}>
                            <span className={styles.referCode}>{referCode}</span>
                            <button className={styles.copyBtn} onClick={handleCopy}>
                                {copied ? <Check size={18} /> : <Copy size={18} />}
                                <span style={{ marginLeft: '8px' }}>{copied ? 'Copied!' : 'Copy Code'}</span>
                            </button>
                        </div>
                    </div>

                    {/* Steps Section */}
                    <div className={styles.stepsGrid}>
                        <div className={styles.stepCard}>
                            <div className={styles.stepIcon}>
                                <Share2 size={32} />
                            </div>
                            <h3>1. Invite Friends</h3>
                            <p>Share your unique referral code with your friends via WhatsApp, Social Media or Email.</p>
                        </div>
                        <div className={styles.stepCard}>
                            <div className={styles.stepIcon}>
                                <Users size={32} />
                            </div>
                            <h3>2. They Enroll</h3>
                            <p>Your friends get a flat ₹100 discount when they use your code during their first purchase.</p>
                        </div>
                        <div className={styles.stepCard}>
                            <div className={styles.stepIcon}>
                                <Wallet size={32} />
                            </div>
                            <h3>3. Get Rewarded</h3>
                            <p>You receive ₹200 referral bonus in your wallet immediately after their enrollment is verified.</p>
                        </div>
                    </div>

                    {/* Earnings Overview */}
                    <div className={styles.earningsSection}>
                        <div className={styles.earningStat}>
                            <h4>Total Referrals</h4>
                            <span className={styles.value}>08</span>
                        </div>
                        <div style={{ width: '1px', height: '60px', background: 'var(--border)' }} className="hide-mobile"></div>
                        <div className={styles.earningStat}>
                            <h4>Total Earned</h4>
                            <span className={styles.value} style={{ color: '#10b981' }}>₹1,600</span>
                        </div>
                        <div style={{ width: '1px', height: '60px', background: 'var(--border)' }} className="hide-mobile"></div>
                        <div className={styles.earningStat}>
                            <h4>Wallet Balance</h4>
                            <span className={styles.value} style={{ color: 'var(--primary)' }}>₹400</span>
                        </div>
                        <button className={styles.copyBtn} style={{
                            background: 'var(--primary)',
                            color: 'white',
                            padding: '1rem 2rem',
                            fontSize: '1rem'
                        }}>
                            Withdraw Now
                        </button>
                    </div>

                    {/* Social Share */}
                    <div style={{ marginTop: '4rem', textAlign: 'center' }}>
                        <h3 style={{ marginBottom: '1.5rem', fontWeight: 800 }}>Quick Share Options</h3>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem' }}>
                            <button style={{ background: '#25D366', color: 'white', border: 'none', padding: '1rem', borderRadius: '50%', cursor: 'pointer' }}>
                                <MessageCircle size={24} />
                            </button>
                            <button style={{ background: '#1DA1F2', color: 'white', border: 'none', padding: '1rem', borderRadius: '50%', cursor: 'pointer' }}>
                                <Twitter size={24} />
                            </button>
                            <button style={{ background: '#4267B2', color: 'white', border: 'none', padding: '1rem', borderRadius: '50%', cursor: 'pointer' }}>
                                <Facebook size={24} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
