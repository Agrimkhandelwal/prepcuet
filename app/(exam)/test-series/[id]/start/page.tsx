'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
    Clock,
    ChevronLeft,
    ChevronRight,
    Flag,
    Send,
    BookOpen,
    Award,
    AlertCircle,
    Camera,
    Shield,
    Eye,
    AlertTriangle,
    Maximize,
    CheckCircle,
    XCircle,
    Monitor,
    Copy,
    ArrowRight
} from 'lucide-react';
// import { QUIZ_QUESTIONS } from '@/lib/quiz-data';
import Image from 'next/image';
import styles from './Exam.module.css';
import { useAuth, useTestAccess } from '@/hooks/useAuth';
import { db } from '@/lib/firebase';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { TestSeries } from '@/lib/firestore-schema';

interface Answer {
    questionId: string;
    selectedOption: number | null;
    isMarked: boolean;
    isVisited: boolean;
}

interface Violation {
    type: string;
    time: Date;
    description: string;
}

const formatQuestionText = (text: string) => {
    if (!text) return "";
    let formattedText = text;
    // Format numbered list items safely by matching a space before the number, not \n
    formattedText = formattedText.replace(/ +(\d+)\. +/g, '\n\n$1. ');
    // Format question statements
    formattedText = formattedText.replace(/ +(Which of the statements|Which of the following|Select the correct|Choose the correct|What is the|Consider the following)/gi, '\n\n$1');
    // Remove extra trailing spaces at start of lines if any
    return formattedText.trim();
};

export default function ExamPage() {
    const router = useRouter();
    const params = useParams();
    const testId = params.id;
    const videoRef = useRef<HTMLVideoElement>(null);
    const { user, loading } = useAuth();

    const [questions, setQuestions] = useState<any[]>([]);
    const [loadingQuestions, setLoadingQuestions] = useState(true);
    const [testTitle, setTestTitle] = useState('CUET Mock Test');

    // Exam states
    const [examPhase, setExamPhase] = useState<'instructions' | 'exam'>('instructions');
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState<Answer[]>([]);
    const [timeLeft, setTimeLeft] = useState(60 * 60);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);

    // Anti-cheat states
    const [cameraEnabled, setCameraEnabled] = useState(false);
    const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [violations, setViolations] = useState<Violation[]>([]);
    const [showViolationWarning, setShowViolationWarning] = useState(false);
    const [currentViolation, setCurrentViolation] = useState('');
    const [tabSwitchCount, setTabSwitchCount] = useState(0);
    const [agreedToTerms, setAgreedToTerms] = useState(false);

    // Instructions checklist
    const [checklist, setChecklist] = useState({
        fullscreen: false,
        terms: false
    });

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    // Add violation
    const addViolation = useCallback((type: string, description: string) => {
        const newViolation = { type, time: new Date(), description };
        setViolations(prev => [...prev, newViolation]);
        setCurrentViolation(description);
        setShowViolationWarning(true);
        setTimeout(() => setShowViolationWarning(false), 3000);
    }, []);

    const [testSubject, setTestSubject] = useState<string>('');
    const [isFreeTest, setIsFreeTest] = useState(false);

    // Access control hook
    const accessControl = useTestAccess(params.id as string, isFreeTest, testSubject);

    const [streamError, setStreamError] = useState<string>('');
    const [attemptsCount, setAttemptsCount] = useState(0);
    const [checkingAttempts, setCheckingAttempts] = useState(true);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [showPurchaseModal, setShowPurchaseModal] = useState(false); // New modal for purchase

    // Effect to show modals based on access control
    useEffect(() => {
        if (!accessControl.checking) {
            if (accessControl.requiresLogin) {
                setShowLoginModal(true);
            } else if (accessControl.requiresPurchase) {
                setShowPurchaseModal(true);
            }
        }
    }, [accessControl.checking, accessControl.requiresLogin, accessControl.requiresPurchase]);

    // Initial data fetch
    useEffect(() => {
        const fetchData = async () => {
            if (!params.id) return;

            try {
                // Fetch test details
                const docRef = doc(db, 'testSeries', params.id as string);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const data = docSnap.data() as TestSeries;
                    setTestTitle(data.title);
                    setQuestions(data.questions);
                    setTimeLeft(data.duration * 60);
                    setIsFreeTest(data.isFree);
                    if (data.subjects && data.subjects.length > 0) {
                        setTestSubject(data.subjects[0]);
                    }

                    // Initialize answers with null
                    const initialAnswers = data.questions.map((q) => ({
                        questionId: q.id,
                        selectedOption: null,
                        isMarked: false,
                        isVisited: false
                    }));
                    setAnswers(initialAnswers);
                } else {
                    alert('Test not found');
                    router.push('/test-series');
                }
                setLoadingQuestions(false);
            } catch (error) {
                console.error('Error fetching test:', error);
                alert('Error loading test data');
                setLoadingQuestions(false);
            }
        };

        const checkAttempts = async () => {
            if (!user || !params.id) {
                setCheckingAttempts(false);
                return;
            }

            try {
                const attemptsQuery = query(
                    collection(db, 'testResults'),
                    where('userId', '==', user.uid),
                    where('testId', '==', params.id)
                );
                const snapshot = await getDocs(attemptsQuery);
                setAttemptsCount(snapshot.size);
            } catch (error) {
                console.error("Error checking attempts:", error);
            } finally {
                setCheckingAttempts(false);
            }
        };

        fetchData();
        checkAttempts();
    }, [params.id, router, user]);

    // Authentication check - show login modal if not authenticated
    useEffect(() => {
        if (!loading && !user) {
            setShowLoginModal(true);
        }
    }, [user, loading]);

    const handleLoginRedirect = () => {
        const currentPath = `/test-series/${testId}/start`;
        router.push(`/login?redirect=${encodeURIComponent(currentPath)}`);
    };



    // Enter fullscreen
    const enterFullscreen = async () => {
        try {
            await document.documentElement.requestFullscreen();
            setIsFullscreen(true);
            setChecklist(prev => ({ ...prev, fullscreen: true }));
        } catch (err) {
            alert('Fullscreen mode is required. Please allow fullscreen and try again.');
        }
    };

    // Monitor fullscreen changes
    useEffect(() => {
        const handleFullscreenChange = () => {
            const isNowFullscreen = !!document.fullscreenElement;
            setIsFullscreen(isNowFullscreen);
            // Sync checklist state with actual fullscreen status
            setChecklist(prev => ({ ...prev, fullscreen: isNowFullscreen }));

            if (!isNowFullscreen && examPhase === 'exam') {
                addViolation('fullscreen_exit', '⚠️ Fullscreen mode exited! Please return to fullscreen.');
                // Re-enter fullscreen attempt
                setTimeout(() => {
                    document.documentElement.requestFullscreen().catch(() => { });
                }, 500);
            }
        };

        document.addEventListener('fullscreenchange', handleFullscreenChange);
        return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
    }, [examPhase, addViolation]);

    // ... (rest of code)



    const handleStartExam = async () => {
        // Double check actual fullscreen state
        if (!document.fullscreenElement) {
            try {
                await document.documentElement.requestFullscreen();
            } catch (err) {
                alert('Please enable fullscreen mode to start the test.');
                return;
            }
        }

        if (!agreedToTerms) {
            alert('Please complete all requirements before starting the exam.');
            return;
        }
        setExamPhase('exam');
    };

    const handleSelectOption = (optionIndex: number) => {
        setAnswers(prev => {
            const newAnswers = [...prev];
            // Answers are initialized 1:1 with questions, so we can access by index
            if (newAnswers[currentQuestion]) {
                newAnswers[currentQuestion] = {
                    ...newAnswers[currentQuestion],
                    selectedOption: optionIndex,
                    isVisited: true
                };
            }
            return newAnswers;
        });
    };

    const handleMarkForReview = () => {
        setAnswers(prev => {
            const newAnswers = [...prev];
            if (newAnswers[currentQuestion]) {
                newAnswers[currentQuestion] = {
                    ...newAnswers[currentQuestion],
                    isMarked: !newAnswers[currentQuestion].isMarked,
                    isVisited: true
                };
            }
            return newAnswers;
        });
    };

    const handleClearResponse = () => {
        setAnswers(prev => {
            const newAnswers = [...prev];
            if (newAnswers[currentQuestion]) {
                newAnswers[currentQuestion] = {
                    ...newAnswers[currentQuestion],
                    selectedOption: null
                };
            }
            return newAnswers;
        });
    };

    // Mark a question as visited (called on any navigation away from it)
    const markCurrentAsVisited = (idx: number) => {
        setAnswers(prev => {
            const newAnswers = [...prev];
            if (newAnswers[idx] && !newAnswers[idx].isVisited) {
                newAnswers[idx] = { ...newAnswers[idx], isVisited: true };
            }
            return newAnswers;
        });
    };

    // Whenever the current question changes, mark the previous question as visited
    const prevQuestionRef = useRef<number>(0);
    useEffect(() => {
        if (examPhase !== 'exam') return;
        // Mark the question we just left as visited
        markCurrentAsVisited(prevQuestionRef.current);
        prevQuestionRef.current = currentQuestion;
    }, [currentQuestion, examPhase]);

    const handleSaveNext = () => {
        markCurrentAsVisited(currentQuestion);
        if (currentQuestion < questions.length - 1) {
            setCurrentQuestion(prev => prev + 1);
        }
    };

    const handleSubmit = useCallback(async () => {
        setIsSubmitted(true);

        // Exit fullscreen
        if (document.fullscreenElement) {
            document.exitFullscreen();
        }

        // Stop camera
        if (cameraStream) {
            cameraStream.getTracks().forEach(track => track.stop());
        }

        // Calculate results
        let correct = 0;
        let wrong = 0;
        let skipped = 0;

        const processedAnswers = answers.map((answer, idx) => {
            const isCorrect = answer.selectedOption === questions[idx].answer;
            const marksAwarded = answer.selectedOption === null ? 0 : isCorrect ? 4 : -1;

            if (answer.selectedOption === null) {
                skipped++;
            } else if (isCorrect) {
                correct++;
            } else {
                wrong++;
            }

            return {
                questionId: answer.questionId.toString(),
                selectedOption: answer.selectedOption,
                isMarked: answer.isMarked,
                isCorrect,
                marksAwarded,
            };
        });

        const score = correct * 4 - wrong * 1;

        const resultData = {
            userId: user?.uid || 'anonymous',
            userEmail: user?.email || 'anonymous',
            userName: user?.displayName || 'Anonymous',
            testId: testId as string,
            testTitle: testTitle,
            answers: processedAnswers,
            score,
            totalMarks: questions.length * 4,
            correct,
            wrong,
            skipped,
            timeSpent: (60 * 60) - timeLeft, // Adjust based on dynamic duration if possible
            violations: violations.length,
            tabSwitches: tabSwitchCount,
        };

        try {
            // Submit to API
            const response = await fetch('/api/submit-test', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(resultData),
            });

            const data = await response.json();

            if (data.success) {
                // Store full result for result page
                localStorage.setItem('lastTestResult', JSON.stringify({
                    resultId: data.resultId,
                    testId: testId as string,
                    testTitle,
                    score,
                    totalMarks: questions.length * 4,
                    correct,
                    wrong,
                    skipped,
                    timeSpent: (60 * 60) - timeLeft,
                    answeredCount: correct + wrong,
                    answers: processedAnswers,
                    // Save question text + options + explanation for review
                    questions: questions.map(q => ({
                        id: q.id,
                        question: q.question,
                        options: q.options,
                        answer: q.answer,
                        explanation: q.explanation ?? null,
                        subject: q.subject ?? null,
                    })),
                }));

                // Store submission info for pending page
                localStorage.setItem('lastTestSubmission', JSON.stringify({
                    testId,
                    testTitle: testTitle,
                    resultId: data.resultId,
                    resultAvailableAt: data.resultAvailableAt,
                }));

                // Redirect to pending page
                router.push(`/test-series/${testId}/pending`);
            } else {
                alert('Failed to submit test. Please try again.');
            }
        } catch (error) {
            console.error('Error submitting test:', error);
            alert('Error submitting test. Please try again.');
        }
    }, [answers, testId, timeLeft, router, violations, tabSwitchCount, cameraStream, user]);

    const question = questions[currentQuestion];
    const currentAnswer = answers[currentQuestion];

    // Timer Effect
    useEffect(() => {
        if (examPhase !== 'exam' || isSubmitted) return;

        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    handleSubmit();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [examPhase, isSubmitted, handleSubmit]);

    // Stats
    const answeredCount = answers.filter(a => a.selectedOption !== null).length;
    const notAnsweredCount = answers.filter(a => a.isVisited && a.selectedOption === null).length;
    const notVisitedCount = answers.filter(a => !a.isVisited).length;
    const markedCount = answers.filter(a => a.isMarked).length;

    const getTimerClass = () => {
        if (timeLeft <= 60) return styles.timerDanger;
        if (timeLeft <= 300) return styles.timerWarning;
        return '';
    };

    // INSTRUCTIONS PHASE
    // if (examPhase === 'instructions') {
    //     return (
    //         <div className={styles.instructionsPage}>
    //             <div className={styles.instructionsContainer}>
    //                 <div className={styles.instructionsHeader}>
    //                     <div className={styles.shieldIcon}>
    //                         <Shield size={40} color="white" />
    //                     </div>
    //                     <h1>Exam Instructions</h1>
    //                     <p>CUET Mock Test - Full Syllabus</p>
    //                 </div>

    //                 <div className={styles.instructionsContent}>
    //                     {/* Test Info */}
    //                     <div className={styles.testInfoCard}>
    //                         <h3>📝 Test Details</h3>
    //                         <div className={styles.testInfoGrid}>
    //                             <div>
    //                                 <span className={styles.infoLabel}>Total Questions</span>
    //                                 <span className={styles.infoValue}>{QUIZ_QUESTIONS.length}</span>
    //                             </div>
    //                             <div>
    //                                 <span className={styles.infoLabel}>Duration</span>
    //                                 <span className={styles.infoValue}>60 Minutes</span>
    //                             </div>
    //                             <div>
    //                                 <span className={styles.infoLabel}>Marks per Question</span>
    //                                 <span className={styles.infoValue}>+4</span>
    //                             </div>
    //                             <div>
    //                                 <span className={styles.infoLabel}>Negative Marking</span>
    //                                 <span className={styles.infoValue}>-1</span>
    //                             </div>
    //                         </div>
    //                     </div>

    //                     {/* Instructions */}
    //                     <div className={styles.rulesCard}>
    //                         <h3>📋 Important Instructions</h3>
    //                         <ul>
    //                             <li>The test will automatically submit when the timer reaches zero.</li>
    //                             <li>Each correct answer carries +4 marks and each wrong answer carries -1 mark.</li>
    //                             <li>You can mark questions for review and come back to them later.</li>
    //                             <li>Use the question panel on the right to navigate between questions.</li>
    //                             <li>Ensure stable internet connection throughout the exam.</li>
    //                         </ul>
    //                     </div>

    //                     {/* Anti-Cheat Requirements */}
    //                     <div className={styles.antiCheatCard}>
    //                         <h3>🔒 Proctoring Requirements</h3>
    //                         <p className={styles.antiCheatNote}>
    //                             This is a proctored exam. Please complete the following requirements:
    //                         </p>

    //                         <div className={styles.requirementsList}>
    //                             {/* Camera Requirement */}
    //                             <div className={`${styles.requirement} ${checklist.camera ? styles.completed : ''}`}>
    //                                 <div className={styles.requirementInfo}>
    //                                     <Camera size={24} />
    //                                     <div>
    //                                         <h4>Enable Camera</h4>
    //                                         <p>Your camera will be used to monitor the exam session</p>
    //                                     </div>
    //                                 </div>
    //                                 {checklist.camera ? (
    //                                     <span className={styles.checkMark}>
    //                                         <CheckCircle size={24} color="#10b981" />
    //                                     </span>
    //                                 ) : (
    //                                     <button className={styles.enableBtn} onClick={requestCameraAccess}>
    //                                         Enable
    //                                     </button>
    //                                 )}
    //                             </div>

    //                             {/* Fullscreen Requirement */}
    //                             <div className={`${styles.requirement} ${checklist.fullscreen ? styles.completed : ''}`}>
    //                                 <div className={styles.requirementInfo}>
    //                                     <Maximize size={24} />
    //                                     <div>
    //                                         <h4>Fullscreen Mode</h4>
    //                                         <p>The exam will run in fullscreen to prevent distractions</p>
    //                                     </div>
    //                                 </div>
    //                                 {checklist.fullscreen ? (
    //                                     <span className={styles.checkMark}>
    //                                         <CheckCircle size={24} color="#10b981" />
    //                                     </span>
    //                                 ) : (
    //                                     <button className={styles.enableBtn} onClick={enterFullscreen}>
    //                                         Enable
    //                                     </button>
    //                                 )}
    //                             </div>

    //                             {/* Camera Preview */}
    //                             {cameraEnabled && (
    //                                 <div className={styles.cameraPreview}>
    //                                     <video
    //                                         ref={videoRef}
    //                                         autoPlay
    //                                         muted
    //                                         playsInline
    //                                         className={styles.previewVideo}
    //                                     />
    //                                     <span className={styles.previewLabel}>
    //                                         <Eye size={14} /> Camera Preview
    //                                     </span>
    //                                 </div>
    //                             )}
    //                         </div>
    //                     </div>

    //                     {/* Violations Warning */}
    //                     <div className={styles.warningsCard}>
    //                         <h3>⚠️ Anti-Cheating Measures</h3>
    //                         <div className={styles.warningsList}>
    //                             <div className={styles.warningItem}>
    //                                 <Monitor size={18} />
    //                                 <span>Tab switching will be detected and recorded</span>
    //                             </div>
    //                             <div className={styles.warningItem}>
    //                                 <Copy size={18} />
    //                                 <span>Copy-paste is disabled during the exam</span>
    //                             </div>
    //                             <div className={styles.warningItem}>
    //                                 <Eye size={18} />
    //                                 <span>Your camera feed will be monitored</span>
    //                             </div>
    //                             <div className={styles.warningItem}>
    //                                 <Maximize size={18} />
    //                                 <span>Exiting fullscreen will trigger a warning</span>
    //                             </div>
    //                             <div className={styles.warningItem}>
    //                                 <AlertTriangle size={18} />
    //                                 <span>Multiple violations may lead to test termination</span>
    //                             </div>
    //                         </div>
    //                     </div>

    //                     {/* Terms Agreement */}
    //                     <div className={styles.termsCard}>
    //                         <label className={styles.termsCheckbox}>
    //                             <input
    //                                 type="checkbox"
    //                                 checked={agreedToTerms}
    //                                 onChange={(e) => {
    //                                     setAgreedToTerms(e.target.checked);
    //                                     setChecklist(prev => ({ ...prev, terms: e.target.checked }));
    //                                 }}
    //                             />
    //                             <span>
    //                                 I have read and agree to all the instructions and anti-cheating policies.
    //                                 I understand that any violation will be recorded and may affect my test results.
    //                             </span>
    //                         </label>
    //                     </div>

    //                     {/* Start Button */}
    //                     <button
    //                         className={`${styles.startExamBtn} ${(!checklist.camera || !checklist.fullscreen || !agreedToTerms) ? styles.disabled : ''}`}
    //                         onClick={handleStartExam}
    //                         disabled={!checklist.camera || !checklist.fullscreen || !agreedToTerms}
    //                     >
    //                         <Shield size={20} /> Start Secure Exam
    //                     </button>
    //                 </div>
    //             </div>
    //         </div>
    //     );
    // }

    // Loading state
    if (loadingQuestions || loading) {
        return (
            <div className={styles.loadingScreen}>
                <div className={styles.loadingSpinner} />
                <h2>Loading Test Environment...</h2>
            </div>
        );
    }

    const getPaletteClass = (idx: number) => {
        const ans = answers[idx];
        const isCurrent = idx === currentQuestion;
        let stateClass = '';

        if (!ans || (!ans.isVisited && ans.selectedOption === null)) {
            // Never visited — gray
            stateClass = styles.paletteBtnNotVisited;
        } else if (ans.selectedOption !== null && ans.isMarked) {
            // Answered + Marked
            stateClass = styles.paletteBtnAnsweredMarked;
        } else if (ans.isMarked) {
            // Marked but no answer — purple
            stateClass = styles.paletteBtnMarked;
        } else if (ans.selectedOption !== null) {
            // Answered — green
            stateClass = styles.paletteBtnAnswered;
        } else {
            // Visited but no answer — red
            stateClass = styles.paletteBtnNotAnswered;
        }

        return `${styles.paletteBtn} ${stateClass}${isCurrent ? ' ' + styles.paletteBtnCurrent : ''}`;
    };

    // ===================== RENDER =====================
    return (
        <div className={styles.examWrapper}>

            {/* ── Violation Toast ── */}
            {showViolationWarning && (
                <div className={styles.violationToast}>
                    <AlertTriangle size={18} />
                    <span>{currentViolation}</span>
                </div>
            )}

            {/* ═══════════════ INSTRUCTIONS PHASE ═══════════════ */}
            {examPhase === 'instructions' && (
                <div className={styles.instructionsWrapper}>
                    {/* Header */}
                    <div className={styles.instructionsHeader}>
                        <div className={styles.instrHeaderLeft}>
                            <img src="/logo.png" alt="PrepCUET" style={{ width: 32, height: 32, objectFit: 'contain', borderRadius: 6 }} />
                            <span className={styles.instrLogoText}>PrepCUET</span>
                            <span className={styles.instrTestName}>{testTitle}</span>
                        </div>
                        <div className={styles.instrHeaderRight}>
                            <Shield size={14} />
                            <span>Secure Test Environment</span>
                        </div>
                    </div>

                    {/* Body (scrollable) */}
                    <div className={styles.instrBody}>
                        <div className={styles.instrCard}>
                            {/* Card Header */}
                            <div className={styles.instrCardHeader}>
                                <div className={styles.instrCardIcon}>
                                    <BookOpen size={28} color="white" />
                                </div>
                                <h1>General Instructions</h1>
                                <p>Read carefully before starting the test</p>
                            </div>

                            {/* Card Body */}
                            <div className={styles.instrCardBody}>
                                {/* Test Info Grid */}
                                <div className={styles.instrInfoGrid}>
                                    <div className={styles.instrInfoCell}>
                                        <div className={styles.instrInfoVal}>{Math.floor(timeLeft / 60)}m</div>
                                        <div className={styles.instrInfoKey}>Duration</div>
                                    </div>
                                    <div className={styles.instrInfoCell}>
                                        <div className={styles.instrInfoVal}>{questions.length}</div>
                                        <div className={styles.instrInfoKey}>Questions</div>
                                    </div>
                                    <div className={styles.instrInfoCell}>
                                        <div className={styles.instrInfoVal}>+4</div>
                                        <div className={styles.instrInfoKey}>Per Correct</div>
                                    </div>
                                    <div className={styles.instrInfoCell}>
                                        <div className={styles.instrInfoVal}>-1</div>
                                        <div className={styles.instrInfoKey}>Negative</div>
                                    </div>
                                </div>

                                {/* Rules */}
                                <div className={styles.instrSection}>
                                    <div className={styles.instrSectionTitle}>
                                        <CheckCircle size={14} color="#2e7d32" />
                                        Exam Rules
                                    </div>
                                    <ul className={styles.instrRuleList}>
                                        <li><CheckCircle size={13} color="#43a047" />You must complete the exam in one sitting without interruptions.</li>
                                        <li><CheckCircle size={13} color="#43a047" />The timer will not pause if you leave or switch tabs.</li>
                                        <li><CheckCircle size={13} color="#43a047" />Each correct answer carries +4 marks; incorrect answers carry -1.</li>
                                        <li><CheckCircle size={13} color="#43a047" />You can mark questions for review and return to them later.</li>
                                        <li><CheckCircle size={13} color="#43a047" />Click &quot;Save &amp; Next&quot; to save your answer and proceed.</li>
                                        <li><CheckCircle size={13} color="#43a047" />Your results will be available after 24 hours of submission.</li>
                                    </ul>
                                </div>

                                {/* Anti-cheat warnings */}
                                <div className={styles.instrSection}>
                                    <div className={styles.instrSectionTitle}>
                                        <AlertTriangle size={14} color="#e65100" />
                                        Anti-Cheating Measures
                                    </div>
                                    <ul className={styles.instrWarnList}>
                                        <li><AlertCircle size={13} />Tab switching will be detected and recorded.</li>
                                        <li><AlertCircle size={13} />Copy-paste actions are disabled during the test.</li>
                                        <li><AlertCircle size={13} />Exiting fullscreen will trigger a warning.</li>
                                        <li><AlertCircle size={13} />Multiple violations may lead to automatic test termination.</li>
                                    </ul>
                                </div>

                                {/* Terms */}
                                <label className={styles.instrTerms}>
                                    <input
                                        type="checkbox"
                                        checked={agreedToTerms}
                                        onChange={e => {
                                            setAgreedToTerms(e.target.checked);
                                            setChecklist(prev => ({ ...prev, terms: e.target.checked }));
                                        }}
                                    />
                                    <span className={styles.instrTermsText}>
                                        I have read all the instructions and I agree to abide by the anti-cheating policies. I understand that any violation will affect my results.
                                    </span>
                                </label>

                                {/* Start Button */}
                                <button
                                    className={styles.instrStartBtn}
                                    onClick={handleStartExam}
                                    disabled={!agreedToTerms || attemptsCount >= 3}
                                >
                                    <Shield size={18} />
                                    {attemptsCount >= 3 ? 'Attempt Limit Reached' : 'Start Secure Exam'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ═══════════════ EXAM PHASE ═══════════════ */}
            {examPhase === 'exam' && (
                <>
                    {/* ── Fixed Exam Header ── */}
                    <header className={styles.examHeader}>
                        <div className={styles.headerLeft}>
                            <div className={styles.logoMark}>
                                <img src="/logo.png" alt="PrepCUET" style={{ width: 28, height: 28, objectFit: 'contain', borderRadius: 4 }} />
                                PrepCUET
                            </div>
                            <div className={styles.headerDivider} />
                            <span className={styles.testName}>{testTitle}</span>
                        </div>

                        <div className={styles.headerCenter}>
                            <div className={`${styles.timerBox} ${getTimerClass()}`}>
                                <Clock size={16} className={styles.timerIcon} />
                                <span className={styles.timerText}>{formatTime(timeLeft)}</span>
                            </div>
                        </div>

                        <div className={styles.headerRight}>
                            <span className={styles.qProgress}>Q {currentQuestion + 1} / {questions.length}</span>
                            {violations.length > 0 && (
                                <span style={{ fontSize: '0.8rem', background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', color: '#fca5a5', padding: '0.3rem 0.7rem', borderRadius: '20px' }}>
                                    ⚠ {violations.length} violation{violations.length > 1 ? 's' : ''}
                                </span>
                            )}
                            <button className={styles.submitBtn} onClick={() => setShowConfirmModal(true)}>
                                <Send size={14} /> Submit Test
                            </button>
                        </div>
                    </header>

                    {/* ── Progress Bar ── */}
                    <div className={styles.progressBar}>
                        <div className={styles.progressFill} style={{ width: `${(answeredCount / questions.length) * 100}%` }} />
                    </div>

                    {/* ── Main Body ── */}
                    <div className={styles.examBody}>

                        {/* ── Left: Question Panel ── */}
                        <div className={styles.questionPanel}>
                            <div className={styles.questionCard}>
                                {/* Question card header */}
                                <div className={styles.questionCardHeader}>
                                    <span className={styles.qBadge}>Question {currentQuestion + 1} of {questions.length}</span>
                                    <div className={styles.qMeta}>
                                        <span className={`${styles.metaChip} ${styles.metaChipGreen}`}>
                                            <Award size={12} /> +4 Marks
                                        </span>
                                        <span className={`${styles.metaChip} ${styles.metaChipRed}`}>
                                            <AlertCircle size={12} /> -1 Negative
                                        </span>
                                    </div>
                                </div>

                                {/* Question body (scrollable) */}
                                <div className={styles.questionBody}>
                                    <p className={styles.questionText}>{formatQuestionText(question.question)}</p>

                                    <div className={styles.optionsList}>
                                        {question.options.map((option: string, index: number) => (
                                            <div
                                                key={index}
                                                className={`${styles.option} ${currentAnswer?.selectedOption === index ? styles.optionSelected : ''}`}
                                                onClick={() => handleSelectOption(index)}
                                            >
                                                <div className={styles.optionLabel}>
                                                    {String.fromCharCode(65 + index)}
                                                </div>
                                                <span className={styles.optionText}>{formatQuestionText(option)}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Action bar (pinned bottom) */}
                                <div className={styles.actionBar}>
                                    <div className={styles.actionLeft}>
                                        <button
                                            className={`${styles.btnMark} ${currentAnswer?.isMarked ? styles.btnMarkActive : ''}`}
                                            onClick={handleMarkForReview}
                                        >
                                            <Flag size={14} fill={currentAnswer?.isMarked ? '#7b1fa2' : 'none'} />
                                            {currentAnswer?.isMarked ? 'Unmark' : 'Mark for Review'}
                                        </button>
                                        <button className={styles.btnOutline} onClick={handleClearResponse}>
                                            <XCircle size={14} /> Clear
                                        </button>
                                    </div>
                                    <div className={styles.actionRight}>
                                        <button
                                            className={styles.btnOutline}
                                            onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
                                            disabled={currentQuestion === 0}
                                        >
                                            <ChevronLeft size={16} /> Previous
                                        </button>
                                        <button className={styles.btnPrimary} onClick={handleSaveNext}>
                                            {currentQuestion === questions.length - 1 ? 'Finish Section' : 'Save & Next'}
                                            {currentQuestion < questions.length - 1 && <ChevronRight size={16} />}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* ── Right: Sidebar ── */}
                        <aside className={styles.sidebar}>
                            {/* Candidate box */}
                            <div className={styles.candidateBox}>
                                <div className={styles.avatar}>
                                    {user?.displayName?.[0]?.toUpperCase() || 'U'}
                                </div>
                                <div>
                                    <div className={styles.candidateName}>{user?.displayName || 'Candidate'}</div>
                                    <div className={styles.candidateId}>ID: {user?.uid?.substring(0, 8) || '—'}</div>
                                </div>
                            </div>

                            {/* Stats */}
                            <div className={styles.statsGrid}>
                                <div className={styles.statCell}>
                                    <div className={`${styles.statNum} ${styles.statGreen}`}>{answeredCount}</div>
                                    <div className={styles.statLabel}>Answered</div>
                                </div>
                                <div className={styles.statCell}>
                                    <div className={`${styles.statNum} ${styles.statRed}`}>{notAnsweredCount}</div>
                                    <div className={styles.statLabel}>Not Answered</div>
                                </div>
                                <div className={styles.statCell}>
                                    <div className={`${styles.statNum} ${styles.statGray}`}>{notVisitedCount}</div>
                                    <div className={styles.statLabel}>Not Visited</div>
                                </div>
                                <div className={styles.statCell}>
                                    <div className={`${styles.statNum} ${styles.statPurple}`}>{markedCount}</div>
                                    <div className={styles.statLabel}>Marked</div>
                                </div>
                            </div>

                            {/* Question Palette */}
                            <div className={styles.paletteSection}>
                                <div className={styles.paletteTitle}>
                                    <BookOpen size={13} /> Question Palette
                                </div>
                                <div className={styles.paletteGrid}>
                                    {questions.map((_: any, idx: number) => (
                                        <button
                                            key={idx}
                                            className={getPaletteClass(idx)}
                                            onClick={() => setCurrentQuestion(idx)}
                                        >
                                            {idx + 1}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Legend */}
                            <div className={styles.paletteLegend}>
                                <div className={styles.legendRow}>
                                    <div className={styles.legendDot} style={{ background: '#43a047', border: '1px solid #2e7d32' }} />
                                    Answered
                                </div>
                                <div className={styles.legendRow}>
                                    <div className={styles.legendDot} style={{ background: '#ef5350', border: '1px solid #c62828' }} />
                                    Not Answered (visited)
                                </div>
                                <div className={styles.legendRow}>
                                    <div className={styles.legendDot} style={{ background: '#e0e0e0', border: '1px solid #bdbdbd' }} />
                                    Not Visited
                                </div>
                                <div className={styles.legendRow}>
                                    <div className={styles.legendDot} style={{ background: '#8e24aa', border: '1px solid #6a1b9a' }} />
                                    Marked for Review
                                </div>
                            </div>
                        </aside>
                    </div>

                    {/* ── Submit Confirm Modal ── */}
                    {showConfirmModal && (
                        <div className={styles.modalOverlay}>
                            <div className={styles.modal}>
                                <div className={styles.modalIcon}>
                                    <AlertTriangle size={28} color="#f59e0b" />
                                </div>
                                <h2>Submit Test?</h2>
                                <p>Are you sure you want to submit? You cannot change your answers after submission.</p>
                                <div className={styles.modalSummary}>
                                    <div className={styles.modalStatCard}>
                                        <div className={`${styles.modalStatNum} ${styles.statGreen}`}>{answeredCount}</div>
                                        <div className={styles.modalStatLabel}>Answered</div>
                                    </div>
                                    <div className={styles.modalStatCard}>
                                        <div className={`${styles.modalStatNum} ${styles.statRed}`}>{notAnsweredCount}</div>
                                        <div className={styles.modalStatLabel}>Unanswered</div>
                                    </div>
                                    <div className={styles.modalStatCard}>
                                        <div className={`${styles.modalStatNum} ${styles.statGray}`}>{notVisitedCount}</div>
                                        <div className={styles.modalStatLabel}>Not Visited</div>
                                    </div>
                                </div>
                                <div className={styles.modalActions}>
                                    <button className={styles.modalCancelBtn} onClick={() => setShowConfirmModal(false)}>Go Back</button>
                                    <button className={styles.modalSubmitBtn} onClick={handleSubmit}>Submit Now</button>
                                </div>
                            </div>
                        </div>
                    )}
                </>
            )}

            {showLoginModal && (
                <div className={styles.loginModal}>
                    <div className={styles.loginModalCard}>
                        <div className={styles.modalIcon}>
                            <Shield size={32} color="#1a237e" />
                        </div>
                        <h2>Login Required</h2>
                        <p>You need to be logged in to attempt this test. Sign in to track your progress.</p>
                        <button className={styles.loginBtn} onClick={handleLoginRedirect}>
                            Log In / Sign Up <ArrowRight size={18} />
                        </button>
                    </div>
                </div>
            )}

            {/* Purchase Required Modal */}
            {showPurchaseModal && (
                <div className={styles.loginModal}>
                    <div className={styles.loginModalCard}>
                        <div className={styles.modalIcon} style={{ background: '#fef2f2' }}>
                            <Award size={32} color="#e53935" />
                        </div>
                        <h2>Premium Test</h2>
                        <p>This test is only available to subscribed users. Upgrade your plan to unlock all test series.</p>
                        <button className={styles.loginBtn} onClick={() => router.push('/pricing')}>
                            View Plans <ArrowRight size={18} />
                        </button>
                    </div>
                </div>
            )}

        </div>
    );
}
