'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
    Search, Menu, X, ChevronDown, Phone, User, LogOut, Settings,
    LayoutDashboard, UserPlus, Key, Crown, Share2, CreditCard,
    Moon, Sun, Headset, HelpCircle, ChevronRight, Sparkles, UserPlus2,
    Command, BookOpen, MessageSquare, Users
} from 'lucide-react';
import ThemeToggle from './ThemeToggle';

import { useLanguage } from '@/app/context/LanguageContext';
import styles from './Navbar.module.css';
import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged, signOut, User as FirebaseUser } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [user, setUser] = useState<FirebaseUser | null>(null);
    const [userData, setUserData] = useState<any>(null);
    const [theme, setTheme] = useState('light');
    const [isAccountExpanded, setIsAccountExpanded] = useState(true);
    const { t } = useLanguage();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 40);
        };
        window.addEventListener('scroll', handleScroll);

        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            setUser(currentUser);
            if (currentUser) {
                const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
                if (userDoc.exists()) {
                    setUserData(userDoc.data());
                }
            } else {
                setUserData(null);
            }
        });

        const storedTheme = document.documentElement.getAttribute('data-theme') || localStorage.getItem('theme') || 'light';
        setTheme(storedTheme);

        return () => {
            window.removeEventListener('scroll', handleScroll);
            unsubscribe();
        };
    }, []);

    const toggleTheme = (e?: React.MouseEvent) => {
        if (e) e.stopPropagation();
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    };

    const handleLogout = async () => {
        try {
            await signOut(auth);
            localStorage.removeItem('isAdmin');
            localStorage.removeItem('userEmail');
            setIsMobileMenuOpen(false);
            window.location.href = '/';
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    const getAvatarUrl = (seed: string) => {
        return `https://api.dicebear.com/7.x/lorelei/svg?seed=${seed}&backgroundColor=b6e3f4,c0aede,d1d4f9`;
    };

    return (
        <header className={`${styles.header} ${isScrolled ? styles.scrolled : ''}`}>
            <div className="container">
                <div className={styles.inner}>
                    {/* Logo */}
                    <Link href="/" className={styles.logo}>
                        <Image src="/logo.png" alt="PrepCUET" width={44} height={44} className={styles.logoIcon} priority unoptimized />
                        <span className={styles.brand}>
                            <span className={styles.brandPrep}>Prep</span>
                            <span className={styles.brandCUET}>CUET</span>
                        </span>
                    </Link>

                    {/* Desktop Nav */}
                    <nav className={styles.desktopNav}>
                        <div className={`${styles.navItem} ${styles.hasDropdown}`}>
                            <span>{t.navbar.courses} <ChevronDown size={14} /></span>
                            <div className={styles.dropdown}>
                                <Link href="/courses/online">{t.navbar.onlineBatches}</Link>
                            </div>
                        </div>
                        <Link href="/test-series" className={`${styles.navItem} ${styles.highlightLink}`}>
                            {t.navbar.testSeries}
                            <span className={styles.newBadge}>NEW</span>
                        </Link>
                        <Link href="/resources" className={styles.navItem}>{t.navbar.resources}</Link>
                        <Link href="/pricing" className={styles.navItem}>Pricing</Link>
                        <Link href="/toppers" className={styles.navItem}>{t.navbar.toppers}</Link>
                    </nav>

                    {/* Actions */}
                    <div className={styles.actions}>
                        <div className={`${styles.searchWrapper} ${isSearchOpen ? styles.searchOpen : ''}`}>
                            <button
                                className={styles.iconBtn}
                                onClick={() => setIsSearchOpen(!isSearchOpen)}
                                title="Search"
                            >
                                <Search size={20} />
                            </button>
                        </div>



                        {user ? (
                            <div className={styles.userProfile}>
                                <div className={styles.profileAvatar}>
                                    <img
                                        src={getAvatarUrl(user.email || user.uid)}
                                        alt="Avatar"
                                        className={styles.avatarImage}
                                    />
                                </div>
                                <span className={styles.userName}>{userData?.name || user.displayName || 'User'}</span>
                                <ChevronDown size={14} className={styles.chevron} />

                                <div className={styles.profileDropdown}>
                                    {/* Top Management Card */}
                                    <div className={styles.topCard}>
                                        <div className={styles.topCardInner}>
                                            <div
                                                className={styles.dropdownHeader}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setIsAccountExpanded(!isAccountExpanded);
                                                }}
                                                style={{ cursor: 'pointer' }}
                                            >
                                                <div className={styles.headerLeft}>
                                                    <div className={styles.profileAvatar} style={{ width: '28px', height: '28px' }}>
                                                        <img
                                                            src={getAvatarUrl(user.email || user.uid)}
                                                            alt="Avatar"
                                                            className={styles.avatarImage}
                                                        />
                                                    </div>
                                                    <span className={styles.displayName}>{userData?.name || user.displayName || 'User'}</span>
                                                </div>
                                                <ChevronDown
                                                    size={16}
                                                    className={`${styles.expandIcon} ${isAccountExpanded ? styles.expanded : ''}`}
                                                />
                                            </div>

                                            {isAccountExpanded && (
                                                <div className={styles.expandableContent}>
                                                    <Link href="/profile/edit" className={styles.profileDropdownItem}>
                                                        <div className={styles.itemContent}>
                                                            <UserPlus2 size={18} className={styles.itemIcon} />
                                                            <span>Add Personal Account</span>
                                                        </div>
                                                    </Link>
                                                    <Link href="/profile" className={styles.profileDropdownItem}>
                                                        <div className={styles.itemContent}>
                                                            <User size={18} className={styles.itemIcon} />
                                                            <span>View profile</span>
                                                        </div>
                                                    </Link>
                                                    <Link href="/settings" className={styles.profileDropdownItem}>
                                                        <div className={styles.itemContent}>
                                                            <Settings size={18} className={styles.itemIcon} />
                                                            <span>Personal Settings</span>
                                                        </div>
                                                    </Link>
                                                    <button onClick={handleLogout} className={`${styles.profileDropdownItem} ${styles.logoutItem}`}>
                                                        <div className={styles.itemContent}>
                                                            <LogOut size={18} className={styles.itemIcon} />
                                                            <span>Log Out</span>
                                                        </div>
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Secondary List */}
                                    <div className={styles.secondaryList}>
                                        <Link href="/subscription" className={styles.secondaryItem} style={{ color: 'var(--primary)' }}>
                                            <Crown size={18} /> Upgrade Plan
                                        </Link>
                                        <Link href="/refer" className={styles.secondaryItem}>
                                            <Share2 size={18} /> Refer and Earn
                                        </Link>
                                        <Link href="/purchases" className={styles.secondaryItem}>
                                            <CreditCard size={18} /> My Purchases
                                        </Link>
                                        <div className={styles.secondaryItem} style={{ cursor: 'pointer' }} onClick={() => toggleTheme()}>
                                            <div className={styles.itemWithToggle}>
                                                <div className={styles.itemContentMain}>
                                                    {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
                                                    <span>Dark Mode</span>
                                                </div>
                                                <div className={`${styles.miniSwitch} ${theme === 'dark' ? styles.miniSwitchActive : ''}`}>
                                                    <div className={`${styles.miniToggleCircle} ${theme === 'dark' ? styles.miniCircleActive : ''}`}></div>
                                                </div>
                                            </div>
                                        </div>
                                        <Link href="/support/live" className={styles.secondaryItem}>
                                            <Headset size={18} /> Live Support
                                        </Link>
                                        <Link href="/support" className={styles.secondaryItem}>
                                            <HelpCircle size={18} /> Help Center
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <>
                                <ThemeToggle />
                                <Link href="/login" className={styles.loginBtn}>
                                    {t.navbar.login}
                                </Link>
                            </>
                        )}

                        <button
                            className={styles.mobileToggle}
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        >
                            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            <div className={`${styles.mobileMenu} ${isMobileMenuOpen ? styles.mobileMenuOpen : ''}`}>
                {user && (
                    <div className={styles.mobileProfileSummary}>
                        <div className={styles.profileAvatar} style={{ width: '48px', height: '48px' }}>
                            <img src={getAvatarUrl(user.email || user.uid)} alt="Avatar" className={styles.avatarImage} />
                        </div>
                        <div className={styles.profileInfo}>
                            <span className={styles.displayName} style={{ fontWeight: 800, fontSize: '1.1rem' }}>
                                {userData?.name || user.displayName || 'User'}
                            </span>
                            <span style={{ fontSize: '0.8rem', opacity: 0.6 }}>{user.email}</span>
                        </div>
                    </div>
                )}

                <nav className={styles.mobileNav}>
                    <Link href="/courses/online" className={styles.mobileNavItem} onClick={() => setIsMobileMenuOpen(false)}>
                        {t.navbar.onlineBatches} <ChevronRight size={18} />
                    </Link>
                    <Link href="/test-series" className={`${styles.mobileNavItem} ${styles.mobileHighlight}`} onClick={() => setIsMobileMenuOpen(false)}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            {t.navbar.testSeries}
                            <span className={styles.newBadge}>NEW</span>
                        </span>
                        <ChevronRight size={18} />
                    </Link>
                    <Link href="/resources" className={styles.mobileNavItem} onClick={() => setIsMobileMenuOpen(false)}>
                        {t.navbar.resources} <ChevronRight size={18} />
                    </Link>
                </nav>

                <div className={styles.mobileActionGrid}>
                    <button className={styles.mobileActionBtn} onClick={() => toggleTheme()}>
                        {theme === 'light' ? <Moon size={24} /> : <Sun size={24} />}
                        <span>{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
                    </button>

                    {user ? (
                        <button className={`${styles.mobileActionBtn} ${styles.mobileLogoutBtn}`} style={{ color: '#ef4444' }} onClick={handleLogout}>
                            <LogOut size={24} />
                            <span>Logout</span>
                        </button>
                    ) : (
                        <>
                            <Link href="/login" className={styles.mobileActionBtn} onClick={() => setIsMobileMenuOpen(false)}>
                                <User size={24} />
                                <span>Login</span>
                            </Link>
                            <Link href="/signup" className={styles.mobileActionBtn} onClick={() => setIsMobileMenuOpen(false)} style={{ gridColumn: '1 / -1' }}>
                                <UserPlus size={24} />
                                <span>Sign Up</span>
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}
