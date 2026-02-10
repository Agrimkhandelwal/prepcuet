import { Newspaper, BookOpen, User, Calendar } from 'lucide-react';

export const LATEST_POSTS = [
    {
        id: 1,
        title: "Daily Current Affairs – 25th January 2026",
        summary: "Analysis of The Hindu, Indian Express, and PIB for CUET entrance examination.",
        category: "Current Affairs",
        date: "Jan 25, 2026",
        tags: ["GS-2", "Polity"],
        isNew: true
    },
    {
        id: 2,
        title: "Editorial Analysis: The Future of India's Green Energy",
        summary: "Critical analysis of the recent policy shift towards renewable energy targets for 2030.",
        category: "Editorials",
        date: "Jan 25, 2026",
        tags: ["GS-3", "Environment"],
        isNew: true
    },
    {
        id: 3,
        title: "CUET Answer Writing Challenge: Day 45",
        summary: "Question on General Aptitude and Reasoning. Submit your answers for peer review.",
        category: "CUET Practice",
        date: "Jan 24, 2026",
        tags: ["GS-4", "Aptitude"],
        isNew: false
    },
    {
        id: 4,
        title: "Weekly Current Affairs Quiz (Jan 15-21)",
        summary: "Test your preparation with our weekly quiz based on the latest news.",
        category: "Quiz",
        date: "Jan 24, 2026",
        tags: ["CUET"],
        isNew: false
    },
    {
        id: 5,
        title: "Strategy: How to Approach Art & Culture",
        summary: "Detailed strategy by CUET Topper to master Art & Culture for CUET exam.",
        category: "Strategy",
        date: "Jan 23, 2026",
        tags: ["Strategy"],
        isNew: false
    }
];

export const SIDEBAR_WIDGETS = {
    courses: [
        { title: "OGP 2026 - Integrated Batch", date: "Feb 15, 2026", mode: "Offline/Online" },
        { title: "CUET Crash Course 2026", date: "Mar 01, 2026", mode: "Online" },
        { title: "General Aptitude Module by Expert", date: "Feb 20, 2026", mode: "Offline" }
    ],
    notifications: [
        "CUET Notification 2026 Released",
        "Admit Cards for CUET 2026 Out",
        "Open Session on Essay Writing Tomorrow"
    ]
};

export const SUBJECTS_DATA = [
    { title: "History", slug: "history", icon: "BookOpen", count: 120, new: 5, articles: ["Indus Valley Civilization", "Mughal Empire Administration", "Freedom Struggle 1857"] },
    { title: "Geography", slug: "geography", icon: "Globe", count: 85, new: 3, articles: ["Climatology Basics", "Indian River Systems", "Ocean Currents"] },
    { title: "Political Science", slug: "political-science", icon: "Scale", count: 150, new: 8, articles: ["Constitution Preamble", "Fundamental Rights", "Parliamentary System"] },
    { title: "Economics", slug: "economics", icon: "TrendingUp", count: 96, new: 5, articles: ["Microeconomics: Complete Guide", "Inflation Trends", "RBI Monetary Policy"] },
    { title: "Microeconomics", slug: "microeconomics", icon: "PieChart", count: 1, new: 1, articles: ["Intro to Micro", "Central Problems", "PPF & Opportunity Cost"] },
    { title: "Computer Science", slug: "computer-science", icon: "Cpu", count: 60, new: 2, articles: ["Artificial Intelligence", "Cyber Security Basics", "Data Structures"] },
    { title: "General Aptitude", slug: "general-aptitude", icon: "Brain", count: 200, new: 10, articles: ["Percentage Tricks", "Logical Reasoning", "Data Interpretation"] },
    { title: "Physics", slug: "physics", icon: "Atom", count: 75, new: 1, articles: ["Laws of Motion", "Thermodynamics", "Optics and Light"] },
    { title: "Chemistry", slug: "chemistry", icon: "FlaskConical", count: 70, new: 2, articles: ["Periodic Table", "Chemical Bonding", "Organic Chemistry Basics"] },
    { title: "Mathematics", slug: "mathematics", icon: "Calculator", count: 110, new: 6, articles: ["Calculus Fundamentals", "Algebra Tricks", "Probability Theory"] },
    { title: "Biology", slug: "biology", icon: "Dna", count: 90, new: 4, articles: ["Human Circulatory System", "Cell Structure", "Genetics Basics"] },
    { title: "Hindi", slug: "hindi", icon: "Languages", count: 50, new: 0, articles: ["Hindi Grammar", "Famous Poets", "Literature Summary"] },
    { title: "English", slug: "english", icon: "BookA", count: 130, new: 7, articles: ["Grammar Rules", "Comprehension Skills", "Vocabulary Building"] }
];
