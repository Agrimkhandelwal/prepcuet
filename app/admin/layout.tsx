'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import NextImage from 'next/image';
import {
    LayoutDashboard,
    FileText,
    Settings,
    LogOut,
    PlusCircle,
    Image,
    Megaphone,
    BookOpen,
    HelpCircle,
    ChevronRight
} from 'lucide-react';
import styles from './Admin.module.css';

const NAV_ITEMS = [
    { href: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
    { href: '/admin/banners', icon: Image, label: 'Banner/Slider' },
    { href: '/admin/announcements', icon: Megaphone, label: 'Announcements' },
    { href: '/admin/posts', icon: FileText, label: 'Articles/Posts' },
    { href: '/admin/subjects', icon: BookOpen, label: 'Subjects' },
    { href: '/admin/quizzes', icon: HelpCircle, label: 'Quizzes' },
    { href: '/admin/settings', icon: Settings, label: 'Site Settings' },
];

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const router = useRouter();
    const pathname = usePathname();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Check if user is admin
        const isAdmin = localStorage.getItem('isAdmin');
        if (isAdmin !== 'true') {
            router.push('/login');
        } else {
            setIsAuthenticated(true);
        }
        setIsLoading(false);
    }, [router]);

    const handleLogout = () => {
        localStorage.removeItem('isAdmin');
        localStorage.removeItem('userEmail');
        router.push('/login');
    };

    const isActive = (href: string) => {
        if (href === '/admin') {
            return pathname === '/admin';
        }
        return pathname.startsWith(href);
    };

    if (isLoading) {
        return (
            <div className={styles.loadingContainer}>
                <div className={styles.loadingSpinner}></div>
                <p>Loading...</p>
            </div>
        );
    }

    if (!isAuthenticated) {
        return null;
    }

    return (
        <div className={styles.adminContainer}>
            {/* Sidebar */}
            <aside className={styles.sidebar}>
                <div className={styles.logoArea}>
                    <NextImage src="/logo.png?v=2" alt="PrepCUET" width={40} height={40} className={styles.logoIcon} unoptimized />
                    <div>
                        <h2>PrepCUET</h2>
                        <span className={styles.logoSubtext}>Admin Panel</span>
                    </div>
                </div>

                <nav className={styles.nav}>
                    {NAV_ITEMS.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`${styles.navItem} ${isActive(item.href) ? styles.activeNavItem : ''}`}
                        >
                            <item.icon size={20} />
                            <span>{item.label}</span>
                            {isActive(item.href) && <ChevronRight size={16} className={styles.activeIndicator} />}
                        </Link>
                    ))}
                </nav>

                <div className={styles.logoutWrapper}>
                    <button className={styles.logoutBtn} onClick={handleLogout}>
                        <LogOut size={18} />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className={styles.main}>
                <header className={styles.header}>
                    <div className={styles.breadcrumb}>
                        <Link href="/admin">Admin</Link>
                        {pathname !== '/admin' && (
                            <>
                                <ChevronRight size={14} />
                                <span>{pathname.split('/').pop()?.replace(/-/g, ' ').replace(/^\w/, c => c.toUpperCase())}</span>
                            </>
                        )}
                    </div>
                    <div className={styles.userProfile}>
                        <span>Admin User</span>
                        <div className={styles.avatar}>A</div>
                    </div>
                </header>
                <div className={styles.content}>
                    {children}
                </div>
            </main>
        </div>
    );
}
