'use client';
import { useState, useEffect } from 'react';
import { Moon, Sun } from 'lucide-react';
import styles from './ThemeToggle.module.css';

export default function ThemeToggle() {
    const [theme, setTheme] = useState('light');

    useEffect(() => {
        // Check local storage or system preference
        const stored = localStorage.getItem('theme');
        if (stored) {
            setTheme(stored);
            document.documentElement.setAttribute('data-theme', stored);
        } else {
            // Default to light
            setTheme('light');
        }
    }, []);

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    };

    return (
        <button
            className={styles.toggleBtn}
            onClick={toggleTheme}
            aria-label="Toggle Dark Mode"
        >
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
        </button>
    );
}
