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
    Copy
} from 'lucide-react';
import { QUIZ_QUESTIONS } from '@/lib/quiz-data';
import Image from 'next/image';
import styles from './Exam.module.css';

interface Answer {
    questionId: number;
    selectedOption: number | null;
    isMarked: boolean;
    isVisited: boolean;
}

interface Violation {
    type: string;
    time: Date;
    description: string;
}

export default function ExamPage() {
    const router = useRouter();
    const params = useParams();
    const testId = params.id;
    const videoRef = useRef<HTMLVideoElement>(null);

    // Exam states
    const [examPhase, setExamPhase] = useState<'instructions' | 'exam'>('instructions');
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState<Answer[]>(() =>
        QUIZ_QUESTIONS.map(q => ({
            questionId: q.id,
            selectedOption: null,
            isMarked: false,
            isVisited: false
        }))
    );
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
        camera: false,
        fullscreen: false,
        terms: false
    });

    // Add violation
    const addViolation = useCallback((type: string, description: string) => {
        const newViolation = { type, time: new Date(), description };
        setViolations(prev => [...prev, newViolation]);
        setCurrentViolation(description);
        setShowViolationWarning(true);
        setTimeout(() => setShowViolationWarning(false), 3000);
    }, []);

    // Request camera access
    const requestCameraAccess = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'user', width: 200, height: 150 }
            });
            setCameraStream(stream);
            setCameraEnabled(true);
            setChecklist(prev => ({ ...prev, camera: true }));
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
        } catch (err) {
            alert('Camera access is required to take this test. Please allow camera access and try again.');
        }
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

            if (!isNowFullscreen && examPhase === 'exam') {
                addViolation('fullscreen_exit', '⚠️ Fullscreen mode exited! Please return to fullscreen.');
                // Re-enter fullscreen
                setTimeout(() => {
                    document.documentElement.requestFullscreen().catch(() => { });
                }, 500);
            }
        };

        document.addEventListener('fullscreenchange', handleFullscreenChange);
        return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
    }, [examPhase, addViolation]);

    // Monitor tab/window visibility
    useEffect(() => {
        if (examPhase !== 'exam') return;

        const handleVisibilityChange = () => {
            if (document.hidden) {
                setTabSwitchCount(prev => prev + 1);
                addViolation('tab_switch', '🚨 Tab switch detected! This has been recorded.');
            }
        };

        const handleBlur = () => {
            addViolation('window_blur', '⚠️ Window focus lost! Stay on the exam window.');
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        window.addEventListener('blur', handleBlur);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            window.removeEventListener('blur', handleBlur);
        };
    }, [examPhase, addViolation]);

    // Prevent right-click and keyboard shortcuts
    useEffect(() => {
        if (examPhase !== 'exam') return;

        const handleContextMenu = (e: MouseEvent) => {
            e.preventDefault();
            addViolation('right_click', '❌ Right-click is disabled during the exam.');
        };

        const handleKeyDown = (e: KeyboardEvent) => {
            // Prevent common shortcuts
            if (
                (e.ctrlKey && (e.key === 'c' || e.key === 'v' || e.key === 'p' || e.key === 'u')) ||
                (e.ctrlKey && e.shiftKey && e.key === 'i') ||
                e.key === 'F12' ||
                (e.altKey && e.key === 'Tab') ||
                (e.ctrlKey && e.key === 'Tab')
            ) {
                e.preventDefault();
                addViolation('keyboard_shortcut', '❌ Keyboard shortcuts are disabled during the exam.');
            }
        };

        const handleCopy = (e: ClipboardEvent) => {
            e.preventDefault();
            addViolation('copy_attempt', '❌ Copy is not allowed during the exam.');
        };

        document.addEventListener('contextmenu', handleContextMenu);
        document.addEventListener('keydown', handleKeyDown);
        document.addEventListener('copy', handleCopy);

        return () => {
            document.removeEventListener('contextmenu', handleContextMenu);
            document.removeEventListener('keydown', handleKeyDown);
            document.removeEventListener('copy', handleCopy);
        };
    }, [examPhase, addViolation]);

    // Timer
    useEffect(() => {
        if (examPhase !== 'exam' || isSubmitted) return;

        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(timer);
                    handleSubmit();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [examPhase, isSubmitted]);

    // Mark current question as visited
    useEffect(() => {
        if (examPhase !== 'exam') return;
        setAnswers(prev => prev.map((a, idx) =>
            idx === currentQuestion ? { ...a, isVisited: true } : a
        ));
    }, [currentQuestion, examPhase]);

    // Connect camera to video element
    useEffect(() => {
        if (cameraStream && videoRef.current) {
            videoRef.current.srcObject = cameraStream;
        }
    }, [cameraStream, examPhase]);

    // Cleanup camera on unmount
    useEffect(() => {
        return () => {
            if (cameraStream) {
                cameraStream.getTracks().forEach(track => track.stop());
            }
        };
    }, [cameraStream]);

    const formatTime = (seconds: number) => {
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const handleSelectOption = (optionIndex: number) => {
        setAnswers(prev => prev.map((a, idx) =>
            idx === currentQuestion ? { ...a, selectedOption: optionIndex } : a
        ));
    };

    const handleMarkForReview = () => {
        setAnswers(prev => prev.map((a, idx) =>
            idx === currentQuestion ? { ...a, isMarked: !a.isMarked } : a
        ));
    };

    const handleStartExam = () => {
        if (!checklist.camera || !checklist.fullscreen || !agreedToTerms) {
            alert('Please complete all requirements before starting the exam.');
            return;
        }
        setExamPhase('exam');
    };

    const handleSubmit = useCallback(() => {
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

        answers.forEach((answer, idx) => {
            if (answer.selectedOption === null) {
                skipped++;
            } else if (answer.selectedOption === QUIZ_QUESTIONS[idx].answer) {
                correct++;
            } else {
                wrong++;
            }
        });

        const score = correct * 4 - wrong * 1;

        const results = {
            testId,
            score,
            totalMarks: QUIZ_QUESTIONS.length * 4,
            correct,
            wrong,
            skipped,
            timeSpent: 60 * 60 - timeLeft,
            violations: violations.length,
            tabSwitches: tabSwitchCount,
            answers: answers.map((a, idx) => ({
                questionId: a.questionId,
                selected: a.selectedOption,
                correct: QUIZ_QUESTIONS[idx].answer
            }))
        };

        localStorage.setItem('lastTestResult', JSON.stringify(results));
        router.push(`/test-series/${testId}/result`);
    }, [answers, testId, timeLeft, router, violations, tabSwitchCount, cameraStream]);

    const question = QUIZ_QUESTIONS[currentQuestion];
    const currentAnswer = answers[currentQuestion];

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
    if (examPhase === 'instructions') {
        return (
            <div className={styles.instructionsPage}>
                <div className={styles.instructionsContainer}>
                    <div className={styles.instructionsHeader}>
                        <div className={styles.shieldIcon}>
                            <Shield size={40} color="white" />
                        </div>
                        <h1>Exam Instructions</h1>
                        <p>CUET Mock Test - Full Syllabus</p>
                    </div>

                    <div className={styles.instructionsContent}>
                        {/* Test Info */}
                        <div className={styles.testInfoCard}>
                            <h3>📝 Test Details</h3>
                            <div className={styles.testInfoGrid}>
                                <div>
                                    <span className={styles.infoLabel}>Total Questions</span>
                                    <span className={styles.infoValue}>{QUIZ_QUESTIONS.length}</span>
                                </div>
                                <div>
                                    <span className={styles.infoLabel}>Duration</span>
                                    <span className={styles.infoValue}>60 Minutes</span>
                                </div>
                                <div>
                                    <span className={styles.infoLabel}>Marks per Question</span>
                                    <span className={styles.infoValue}>+4</span>
                                </div>
                                <div>
                                    <span className={styles.infoLabel}>Negative Marking</span>
                                    <span className={styles.infoValue}>-1</span>
                                </div>
                            </div>
                        </div>

                        {/* Instructions */}
                        <div className={styles.rulesCard}>
                            <h3>📋 Important Instructions</h3>
                            <ul>
                                <li>The test will automatically submit when the timer reaches zero.</li>
                                <li>Each correct answer carries +4 marks and each wrong answer carries -1 mark.</li>
                                <li>You can mark questions for review and come back to them later.</li>
                                <li>Use the question panel on the right to navigate between questions.</li>
                                <li>Ensure stable internet connection throughout the exam.</li>
                            </ul>
                        </div>

                        {/* Anti-Cheat Requirements */}
                        <div className={styles.antiCheatCard}>
                            <h3>🔒 Proctoring Requirements</h3>
                            <p className={styles.antiCheatNote}>
                                This is a proctored exam. Please complete the following requirements:
                            </p>

                            <div className={styles.requirementsList}>
                                {/* Camera Requirement */}
                                <div className={`${styles.requirement} ${checklist.camera ? styles.completed : ''}`}>
                                    <div className={styles.requirementInfo}>
                                        <Camera size={24} />
                                        <div>
                                            <h4>Enable Camera</h4>
                                            <p>Your camera will be used to monitor the exam session</p>
                                        </div>
                                    </div>
                                    {checklist.camera ? (
                                        <span className={styles.checkMark}>
                                            <CheckCircle size={24} color="#10b981" />
                                        </span>
                                    ) : (
                                        <button className={styles.enableBtn} onClick={requestCameraAccess}>
                                            Enable
                                        </button>
                                    )}
                                </div>

                                {/* Fullscreen Requirement */}
                                <div className={`${styles.requirement} ${checklist.fullscreen ? styles.completed : ''}`}>
                                    <div className={styles.requirementInfo}>
                                        <Maximize size={24} />
                                        <div>
                                            <h4>Fullscreen Mode</h4>
                                            <p>The exam will run in fullscreen to prevent distractions</p>
                                        </div>
                                    </div>
                                    {checklist.fullscreen ? (
                                        <span className={styles.checkMark}>
                                            <CheckCircle size={24} color="#10b981" />
                                        </span>
                                    ) : (
                                        <button className={styles.enableBtn} onClick={enterFullscreen}>
                                            Enable
                                        </button>
                                    )}
                                </div>

                                {/* Camera Preview */}
                                {cameraEnabled && (
                                    <div className={styles.cameraPreview}>
                                        <video
                                            ref={videoRef}
                                            autoPlay
                                            muted
                                            playsInline
                                            className={styles.previewVideo}
                                        />
                                        <span className={styles.previewLabel}>
                                            <Eye size={14} /> Camera Preview
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Violations Warning */}
                        <div className={styles.warningsCard}>
                            <h3>⚠️ Anti-Cheating Measures</h3>
                            <div className={styles.warningsList}>
                                <div className={styles.warningItem}>
                                    <Monitor size={18} />
                                    <span>Tab switching will be detected and recorded</span>
                                </div>
                                <div className={styles.warningItem}>
                                    <Copy size={18} />
                                    <span>Copy-paste is disabled during the exam</span>
                                </div>
                                <div className={styles.warningItem}>
                                    <Eye size={18} />
                                    <span>Your camera feed will be monitored</span>
                                </div>
                                <div className={styles.warningItem}>
                                    <Maximize size={18} />
                                    <span>Exiting fullscreen will trigger a warning</span>
                                </div>
                                <div className={styles.warningItem}>
                                    <AlertTriangle size={18} />
                                    <span>Multiple violations may lead to test termination</span>
                                </div>
                            </div>
                        </div>

                        {/* Terms Agreement */}
                        <div className={styles.termsCard}>
                            <label className={styles.termsCheckbox}>
                                <input
                                    type="checkbox"
                                    checked={agreedToTerms}
                                    onChange={(e) => {
                                        setAgreedToTerms(e.target.checked);
                                        setChecklist(prev => ({ ...prev, terms: e.target.checked }));
                                    }}
                                />
                                <span>
                                    I have read and agree to all the instructions and anti-cheating policies.
                                    I understand that any violation will be recorded and may affect my test results.
                                </span>
                            </label>
                        </div>

                        {/* Start Button */}
                        <button
                            className={`${styles.startExamBtn} ${(!checklist.camera || !checklist.fullscreen || !agreedToTerms) ? styles.disabled : ''}`}
                            onClick={handleStartExam}
                            disabled={!checklist.camera || !checklist.fullscreen || !agreedToTerms}
                        >
                            <Shield size={20} /> Start Secure Exam
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // EXAM PHASE
    return (
        <div className={styles.examContainer}>
            {/* Violation Warning Toast */}
            {showViolationWarning && (
                <div className={styles.violationToast}>
                    <AlertTriangle size={20} />
                    <span>{currentViolation}</span>
                    <span className={styles.violationCount}>Violations: {violations.length}</span>
                </div>
            )}

            {/* Header */}
            <header className={styles.examHeader}>
                <div className={styles.headerLeft}>
                    <div className={styles.logo}>
                        <Image src="/logo.png?v=2" alt="PrepCUET" width={32} height={32} className={styles.logoIcon} unoptimized />
                        <span>PrepCUET</span>
                    </div>
                    <span className={styles.testTitle}>CUET Mock Test - Full Syllabus</span>
                </div>

                <div className={styles.headerCenter}>
                    <div className={styles.timer}>
                        <Clock size={20} className={styles.timerIcon} />
                        <span className={`${styles.timerText} ${getTimerClass()}`}>
                            {formatTime(timeLeft)}
                        </span>
                    </div>

                    {/* Proctoring Status */}
                    <div className={styles.proctoringStatus}>
                        <Camera size={16} color="#10b981" />
                        <span>Proctored</span>
                    </div>

                    {violations.length > 0 && (
                        <div className={styles.violationsIndicator}>
                            <AlertTriangle size={16} />
                            <span>{violations.length} violations</span>
                        </div>
                    )}
                </div>

                <div className={styles.headerRight}>
                    {/* Camera Feed */}
                    <div className={styles.cameraFeed}>
                        <video
                            ref={videoRef}
                            autoPlay
                            muted
                            playsInline
                            className={styles.cameraVideo}
                        />
                        <span className={styles.cameraLabel}>
                            <Eye size={10} /> LIVE
                        </span>
                    </div>

                    <button
                        className={styles.submitBtn}
                        onClick={() => setShowConfirmModal(true)}
                    >
                        <Send size={18} /> Submit Test
                    </button>
                </div>
            </header>

            <div className={styles.examContent}>
                {/* Question Panel */}
                <main className={styles.questionPanel}>
                    <div className={styles.questionCard}>
                        <div className={styles.questionHeader}>
                            <div className={styles.questionNumber}>
                                <span className={styles.qNum}>Q{currentQuestion + 1}</span>
                                <span className={styles.qLabel}>of {QUIZ_QUESTIONS.length} Questions</span>
                            </div>
                            <div className={styles.questionMeta}>
                                <span className={styles.metaItem}>
                                    <Award size={14} /> +4 Marks
                                </span>
                                <span className={styles.metaItem}>
                                    <AlertCircle size={14} /> -1 Negative
                                </span>
                            </div>
                        </div>

                        <p className={styles.questionText}>{question.question}</p>

                        <div className={styles.optionsList}>
                            {question.options.map((option, idx) => (
                                <div
                                    key={idx}
                                    className={`${styles.option} ${currentAnswer.selectedOption === idx ? styles.optionSelected : ''}`}
                                    onClick={() => handleSelectOption(idx)}
                                >
                                    <span className={styles.optionLetter}>
                                        {String.fromCharCode(65 + idx)}
                                    </span>
                                    <span className={styles.optionText}>{option}</span>
                                </div>
                            ))}
                        </div>

                        <div className={styles.questionNav}>
                            <button
                                className={styles.navBtn}
                                onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
                                disabled={currentQuestion === 0}
                            >
                                <ChevronLeft size={18} /> Previous
                            </button>

                            <button
                                className={`${styles.markBtn} ${currentAnswer.isMarked ? styles.markBtnActive : ''}`}
                                onClick={handleMarkForReview}
                            >
                                <Flag size={16} />
                                {currentAnswer.isMarked ? 'Marked' : 'Mark for Review'}
                            </button>

                            <button
                                className={styles.navBtn}
                                onClick={() => setCurrentQuestion(prev => Math.min(QUIZ_QUESTIONS.length - 1, prev + 1))}
                                disabled={currentQuestion === QUIZ_QUESTIONS.length - 1}
                            >
                                Next <ChevronRight size={18} />
                            </button>
                        </div>
                    </div>
                </main>

                {/* Sidebar */}
                <aside className={styles.sidebar}>
                    {/* Legend */}
                    <div className={styles.sidebarSection}>
                        <h4 className={styles.sidebarTitle}>Legend</h4>
                        <div className={styles.legend}>
                            <div className={styles.legendItem}>
                                <span className={`${styles.legendDot} ${styles.dotAnswered}`}></span>
                                Answered
                            </div>
                            <div className={styles.legendItem}>
                                <span className={`${styles.legendDot} ${styles.dotNotAnswered}`}></span>
                                Not Answered
                            </div>
                            <div className={styles.legendItem}>
                                <span className={`${styles.legendDot} ${styles.dotNotVisited}`}></span>
                                Not Visited
                            </div>
                            <div className={styles.legendItem}>
                                <span className={`${styles.legendDot} ${styles.dotMarked}`}></span>
                                Marked
                            </div>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className={styles.sidebarSection}>
                        <h4 className={styles.sidebarTitle}>Progress</h4>
                        <div className={styles.stats}>
                            <div className={styles.statCard}>
                                <span className={styles.statValue} style={{ color: '#10b981' }}>{answeredCount}</span>
                                <span className={styles.statLabel}>Answered</span>
                            </div>
                            <div className={styles.statCard}>
                                <span className={styles.statValue} style={{ color: '#ef4444' }}>{notAnsweredCount}</span>
                                <span className={styles.statLabel}>Not Answered</span>
                            </div>
                            <div className={styles.statCard}>
                                <span className={styles.statValue} style={{ color: '#64748b' }}>{notVisitedCount}</span>
                                <span className={styles.statLabel}>Not Visited</span>
                            </div>
                            <div className={styles.statCard}>
                                <span className={styles.statValue} style={{ color: '#f59e0b' }}>{markedCount}</span>
                                <span className={styles.statLabel}>Marked</span>
                            </div>
                        </div>
                    </div>

                    {/* Question Grid */}
                    <div className={styles.sidebarSection}>
                        <h4 className={styles.sidebarTitle}>Questions</h4>
                        <div className={styles.questionGrid}>
                            {answers.map((answer, idx) => {
                                let className = styles.gridItem;
                                if (idx === currentQuestion) className += ` ${styles.gridCurrent}`;
                                if (answer.isMarked) className += ` ${styles.gridMarked}`;
                                else if (answer.selectedOption !== null) className += ` ${styles.gridAnswered}`;
                                else if (answer.isVisited) className += ` ${styles.gridNotAnswered}`;

                                return (
                                    <button
                                        key={idx}
                                        className={className}
                                        onClick={() => setCurrentQuestion(idx)}
                                    >
                                        {idx + 1}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </aside>
            </div>

            {/* Confirmation Modal */}
            {showConfirmModal && (
                <div style={{
                    position: 'fixed',
                    inset: 0,
                    background: 'rgba(0,0,0,0.7)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000
                }}>
                    <div style={{
                        background: 'white',
                        borderRadius: '16px',
                        padding: '2rem',
                        maxWidth: '450px',
                        textAlign: 'center'
                    }}>
                        <div style={{
                            width: '60px',
                            height: '60px',
                            background: '#fef3c7',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 1rem'
                        }}>
                            <AlertCircle size={30} color="#f59e0b" />
                        </div>
                        <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: '#1e293b' }}>
                            Submit Test?
                        </h3>
                        <p style={{ color: '#64748b', marginBottom: '1rem' }}>
                            You have answered <strong>{answeredCount}</strong> out of <strong>{QUIZ_QUESTIONS.length}</strong> questions.
                            {notAnsweredCount > 0 && ` ${notAnsweredCount} questions are unanswered.`}
                        </p>
                        {violations.length > 0 && (
                            <p style={{ color: '#ef4444', fontSize: '0.85rem', marginBottom: '1rem' }}>
                                ⚠️ {violations.length} violation(s) recorded during this session
                            </p>
                        )}
                        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                            <button
                                onClick={() => setShowConfirmModal(false)}
                                style={{
                                    padding: '0.75rem 1.5rem',
                                    background: '#f1f5f9',
                                    border: 'none',
                                    borderRadius: '8px',
                                    fontWeight: 600,
                                    color: '#475569',
                                    cursor: 'pointer'
                                }}
                            >
                                Continue Test
                            </button>
                            <button
                                onClick={handleSubmit}
                                style={{
                                    padding: '0.75rem 1.5rem',
                                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                    border: 'none',
                                    borderRadius: '8px',
                                    fontWeight: 600,
                                    color: 'white',
                                    cursor: 'pointer'
                                }}
                            >
                                Submit Now
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
