'use client';

import { useState, useEffect } from 'react';
import { SUBJECTS } from '@/lib/constants/subjects';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { SubjectDoc } from '@/lib/firestore-schema';
import { X, Check, Search } from 'lucide-react';
import styles from './SubjectMultiSelect.module.css';

interface SubjectMultiSelectProps {
    selectedSubjects: string[];
    onChange: (subjects: string[]) => void;
    label?: string;
}

export default function SubjectMultiSelect({
    selectedSubjects,
    onChange,
    label = 'Select Subjects',
}: SubjectMultiSelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [availableSubjects, setAvailableSubjects] = useState<string[]>([...SUBJECTS]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSubjects = async () => {
            try {
                const q = query(collection(db, 'subjects'), orderBy('name'));
                const querySnapshot = await getDocs(q);

                if (!querySnapshot.empty) {
                    const dbSubjects = querySnapshot.docs.map(doc => (doc.data() as SubjectDoc).name);
                    // Merge with constants to ensure defaults are always available if needed, 
                    // or replace entirely. Here we deduplicate.
                    const uniqueSubjects = Array.from(new Set([...SUBJECTS, ...dbSubjects])).sort();
                    setAvailableSubjects(uniqueSubjects);
                }
            } catch (error) {
                console.error("Error fetching subjects for selector:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchSubjects();
    }, []);

    const filteredSubjects = availableSubjects.filter(subject =>
        subject.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const toggleSubject = (subject: string) => {
        if (selectedSubjects.includes(subject)) {
            onChange(selectedSubjects.filter(s => s !== subject));
        } else {
            onChange([...selectedSubjects, subject]);
        }
    };

    const selectAll = () => {
        onChange([...availableSubjects]);
    };

    const clearAll = () => {
        onChange([]);
    };

    return (
        <div className={styles.container}>
            <label className={styles.label}>{label}</label>

            <div className={styles.selectedTags}>
                {selectedSubjects.length === 0 ? (
                    <span className={styles.placeholder}>No subjects selected</span>
                ) : (
                    selectedSubjects.map(subject => (
                        <div key={subject} className={styles.tag}>
                            <span>{subject}</span>
                            <button
                                type="button"
                                onClick={() => toggleSubject(subject)}
                                className={styles.removeBtn}
                                aria-label={`Remove ${subject}`}
                            >
                                <X size={14} />
                            </button>
                        </div>
                    ))
                )}
            </div>

            <div className={styles.dropdownWrapper}>
                <button
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    className={styles.dropdownBtn}
                >
                    {isOpen ? 'Close' : 'Add Subjects'}
                </button>

                {isOpen && (
                    <div className={styles.dropdown}>
                        <div className={styles.searchContainer}>
                            <Search size={16} color="#94a3b8" />
                            <input
                                type="text"
                                placeholder="Search subjects..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className={styles.searchInput}
                            />
                        </div>

                        <div className={styles.actions}>
                            <button
                                type="button"
                                onClick={selectAll}
                                className={styles.actionBtn}
                            >
                                Select All
                            </button>
                            <button
                                type="button"
                                onClick={clearAll}
                                className={styles.actionBtn}
                            >
                                Clear All
                            </button>
                        </div>

                        <div className={styles.subjectList}>
                            {loading ? (
                                <div style={{ padding: '10px', textAlign: 'center', color: '#64748b', fontSize: '0.9rem' }}>Loading...</div>
                            ) : filteredSubjects.length === 0 ? (
                                <div style={{ padding: '10px', textAlign: 'center', color: '#64748b', fontSize: '0.9rem' }}>No subjects found</div>
                            ) : (
                                filteredSubjects.map(subject => (
                                    <label key={subject} className={styles.checkboxLabel}>
                                        <input
                                            type="checkbox"
                                            checked={selectedSubjects.includes(subject)}
                                            onChange={() => toggleSubject(subject)}
                                        />
                                        <span>{subject}</span>
                                        {selectedSubjects.includes(subject) && <Check size={14} color="#10b981" style={{ marginLeft: 'auto' }} />}
                                    </label>
                                ))
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
