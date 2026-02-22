'use client';

import { useState, useEffect } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { UserProfile } from '@/lib/firestore-schema';

interface AuthState {
    user: User | null;
    userProfile: UserProfile | null;
    loading: boolean;
    isAdmin: boolean;
}

export function useAuth() {
    const [authState, setAuthState] = useState<AuthState>({
        user: null,
        userProfile: null,
        loading: true,
        isAdmin: false,
    });

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                try {
                    // Fetch user profile from Firestore
                    const userDocRef = doc(db, 'users', user.uid);
                    const userDoc = await getDoc(userDocRef);

                    if (userDoc.exists()) {
                        const userProfile = userDoc.data() as UserProfile;
                        setAuthState({
                            user,
                            userProfile,
                            loading: false,
                            isAdmin: userProfile.role === 'admin',
                        });
                    } else {
                        // User document doesn't exist yet
                        setAuthState({
                            user,
                            userProfile: null,
                            loading: false,
                            isAdmin: false,
                        });
                    }
                } catch (error) {
                    console.error('Error fetching user profile:', error);
                    setAuthState({
                        user,
                        userProfile: null,
                        loading: false,
                        isAdmin: false,
                    });
                }
            } else {
                setAuthState({
                    user: null,
                    userProfile: null,
                    loading: false,
                    isAdmin: false,
                });
            }
        });

        return () => unsubscribe();
    }, []);

    return authState;
}

/**
 * Check if user has access to a test
 * - Login Required: ALWAYS (for both Free and Paid)
 * - Purchase Required: Only for Paid tests
 */
// Check if user has access to a test
export function useTestAccess(testId: string, isFree: boolean, testSubject?: string) {
    const { user, userProfile, loading } = useAuth();
    const [hasAccess, setHasAccess] = useState(false);
    const [checking, setChecking] = useState(true);
    const [requiresLogin, setRequiresLogin] = useState(false);
    const [requiresPurchase, setRequiresPurchase] = useState(false);

    useEffect(() => {
        async function checkAccess() {
            if (loading) return;

            setChecking(true);
            setRequiresLogin(false);
            setRequiresPurchase(false);

            // 1. Check Authentication (Required for ALL tests)
            if (!user) {
                setHasAccess(false);
                setRequiresLogin(true);
                setChecking(false);
                return;
            }

            // 2. Check Test Type
            if (isFree) {
                // Free tests: Access granted if logged in
                setHasAccess(true);
                setChecking(false);
                return;
            }

            // 3. Paid Tests: Check Subscription/Purchase
            if (!userProfile) {
                // Profile loading or error, deny access temporarily
                setHasAccess(false);
                setChecking(false);
                return;
            }

            let accessGranted = false;

            // Check A: Individual Purchase
            if (userProfile.purchasedTests?.includes(testId)) {
                accessGranted = true;
            }

            // Check B: Subscription (Premium Bundle)
            if (!accessGranted && userProfile.subscription && userProfile.subscription.status === 'active') {
                const now = new Date();
                const validUntil = userProfile.subscription.validUntil.toDate();

                if (validUntil > now) {
                    // Check if test subject is covered
                    // If testSubject is NOT provided (e.g. initial load), we might be lenient or block
                    // ideally we should pass testSubject to this hook.
                    if (testSubject) {
                        // General Test is always included if 'General Test' is in subjects
                        if (userProfile.subscription.subjects.includes(testSubject)) {
                            accessGranted = true;
                        }
                    } else {
                        // Fallback/Legacy: If subject not passed, maybe assume access if they have ANY subscription?
                        // Better to be strict: No subject known yet -> No access optimization yet.
                        // But wait, the hook is called before we fetch test data in `start/page.tsx`.
                        // `start/page.tsx` fetches test data.
                    }
                }
            }

            if (accessGranted) {
                setHasAccess(true);
            } else {
                setHasAccess(false);
                setRequiresPurchase(true);
            }
            setChecking(false);
        }

        checkAccess();
    }, [testId, isFree, testSubject, user, userProfile, loading]);

    return { hasAccess, checking, requiresLogin, requiresPurchase };
}
