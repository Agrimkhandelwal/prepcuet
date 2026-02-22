// Available subjects for test series and content
export const SUBJECTS = [
    'English',
    'Hindi',
    'General Test',
    'Mathematics',
    'Physics',
    'Chemistry',
    'Biology',
    'History',
    'Geography',
    'Political Science',
    'Economics',
    'Sociology',
    'Psychology',
    'Computer Science',
    'Accountancy',
    'Business Studies',
] as const;

export type Subject = typeof SUBJECTS[number];

// Subject categories for better organization
export const SUBJECT_CATEGORIES = {
    languages: ['English', 'Hindi'],
    sciences: ['Physics', 'Chemistry', 'Biology', 'Computer Science'],
    mathematics: ['Mathematics'],
    socialSciences: ['History', 'Geography', 'Political Science', 'Economics', 'Sociology', 'Psychology'],
    commerce: ['Accountancy', 'Business Studies'],
    general: ['General Test'],
} as const;
