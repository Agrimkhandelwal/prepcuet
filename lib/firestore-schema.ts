import { Timestamp } from 'firebase/firestore';
import { Subject } from './constants/subjects';

// Test Series Schema
export interface Question {
    id: string;
    question: string;
    options: string[];
    answer: number; // index of correct option
    marks: number;
    negativeMarks: number;
    subject: Subject;
    explanation?: string;
}

export interface SubjectDoc {
    id: string;
    name: string;
    topics: string[]; // e.g., ["Algebra", "Geometry"]
    isPublished: boolean;
    createdAt: Timestamp;
    // Frontend Presentation Fields
    icon?: string;
    articleCount?: number;
    newArticleCount?: number;
    latestArticles?: string[];
}

export interface TestSeries {
    id: string;
    title: string;
    description: string;
    subjects: Subject[];
    questions: Question[];
    duration: number; // in minutes
    totalMarks: number;
    negativeMarking: boolean;
    isFree: boolean;
    status: 'draft' | 'published' | 'archived';
    createdAt: Timestamp;
    updatedAt: Timestamp;
    createdBy: string; // admin user ID
}

// Test Result Schema
export interface Answer {
    questionId: string;
    selectedOption: number | null;
    isMarked: boolean;
    isCorrect?: boolean;
    marksAwarded?: number;
}

export interface TestResult {
    id: string;
    userId: string;
    userEmail: string;
    userName: string;
    testId: string;
    testTitle: string;
    answers: Answer[];
    score: number;
    totalMarks: number;
    correct: number;
    wrong: number;
    skipped: number;
    timeSpent: number; // in seconds
    violations: number;
    tabSwitches: number;
    submittedAt: Timestamp;
    resultAvailableAt: Timestamp; // submittedAt + 24 hours
    emailSentAt: Timestamp | null;
    status: 'pending' | 'available';
}

// User Purchases Schema
export interface UserPurchase {
    userId: string;
    userEmail: string;
    testIds: string[];
    purchaseDate: Timestamp;
    expiryDate: Timestamp;
    paymentStatus: 'pending' | 'completed' | 'failed';
    amount: number;
}

// Content Schema
export interface Content {
    id: string;
    title: string;
    description: string;
    subjectId: string;
    subjectName: string;
    topicName?: string;
    contentType: 'notes' | 'article' | 'pdf' | 'video';
    fileUrl?: string;
    thumbnailUrl?: string;
    content?: string; // for articles/notes (rich text HTML)
    isFree: boolean;
    isPublished: boolean;
    views: number;
    createdAt: Timestamp;
    updatedAt: Timestamp;
    createdBy: string;
}

// User Profile Extension
export interface UserProfile {
    uid: string;
    email: string;
    name: string;
    role: 'user' | 'admin';
    photoURL?: string;
    phone?: string;
    createdAt: Timestamp;
    lastLogin: Timestamp;
    purchasedTests: string[];
    completedTests: string[];
    isEmailVerified: boolean;
    subscription?: UserSubscription;
}

export interface UserSubscription {
    planId: 'premium_bundle' | 'individual_subject';
    status: 'active' | 'expired';
    subjects: string[]; // [Language, Dom1, Dom2, Dom3, 'General Test']
    validUntil: Timestamp;
    purchasedAt: Timestamp;
    amount: number;
}

// Email Queue Schema (for scheduled emails)
export interface EmailQueue {
    id: string;
    to: string;
    subject: string;
    htmlBody: string;
    type: 'welcome' | 'result_notification' | 'generic';
    scheduledFor: Timestamp;
    sentAt: Timestamp | null;
    status: 'pending' | 'sent' | 'failed';
    attempts: number;
    error?: string;
    metadata?: {
        userId?: string;
        testId?: string;
        resultId?: string;
    };
}

// Previous Year Papers Schema
export interface PastPaper {
    id: string;             // Firestore Document ID
    title: string;          // e.g. "CUET UG 2024 - Mathematics"
    year: number;           // e.g. 2024
    subject: string;        // Must match one of SUBJECTS from constants/subjects
    duration: string;       // e.g. "60 Mins"
    questions: number;      // e.g. 50
    pdfUrl: string;         // Cloudinary or Firebase Storage URL
    createdAt: Timestamp;
    updatedAt: Timestamp;
}
