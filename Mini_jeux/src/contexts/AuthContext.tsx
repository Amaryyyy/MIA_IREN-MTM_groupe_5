import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { User } from "@supabase/supabase-js";
import {
  getCurrentSession,
  signInWithEmail,
  signOutUser,
  signUpWithEmail,
} from "@/lib/supabase/auth";
import { fetchUserProgress, saveUserProgress } from "@/lib/supabase/progress";
import { createProfile, fetchProfile, updateProfile } from "@/lib/supabase/profile";
import { submitLevelScore } from "@/lib/supabase/scores";
import { isSupabaseConfigured, supabase } from "@/lib/supabase/client";
import type { Profile } from "@/types/database";
import type { LevelStats } from "@/types/database";

interface AuthContextValue {
  configured: boolean;
  loading: boolean;
  user: User | null;
  profile: Profile | null;
  progressLevel: number;
  needsProfileSetup: boolean;
  authError: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  completeProfile: (username: string, avatarUrl: string) => Promise<void>;
  recordLevelCompletion: (stats: LevelStats) => Promise<number | null>;
  clearAuthError: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

async function loadUserData(userId: string) {
  const [profile, progressLevel] = await Promise.all([
    fetchProfile(userId),
    fetchUserProgress(userId),
  ]);
  return { profile, progressLevel };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [progressLevel, setProgressLevel] = useState(0);
  const [authError, setAuthError] = useState<string | null>(null);

  const configured = isSupabaseConfigured();

  const refreshUserData = useCallback(async (nextUser: User | null) => {
    if (!nextUser) {
      setProfile(null);
      setProgressLevel(0);
      return;
    }

    const data = await loadUserData(nextUser.id);
    setProfile(data.profile);
    setProgressLevel(data.progressLevel);
  }, []);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return undefined;
    }

    let mounted = true;

    const init = async () => {
      try {
        const session = await getCurrentSession();
        if (!mounted) return;
        setUser(session?.user ?? null);
        if (session?.user) {
          await refreshUserData(session.user);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    void init();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      void refreshUserData(session?.user ?? null);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [refreshUserData]);

  const signIn = useCallback(async (email: string, password: string) => {
    setAuthError(null);
    try {
      const { user: signedInUser } = await signInWithEmail(email, password);
      if (signedInUser) {
        await refreshUserData(signedInUser);
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Connexion impossible";
      setAuthError(message);
      throw error;
    }
  }, [refreshUserData]);

  const signUp = useCallback(async (email: string, password: string) => {
    setAuthError(null);
    try {
      await signUpWithEmail(email, password);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Inscription impossible";
      setAuthError(message);
      throw error;
    }
  }, []);

  const signOut = useCallback(async () => {
    setAuthError(null);
    await signOutUser();
    setUser(null);
    setProfile(null);
    setProgressLevel(0);
  }, []);

  const completeProfile = useCallback(
    async (username: string, avatarUrl: string) => {
      if (!user) throw new Error("Utilisateur non connecté");

      const trimmed = username.trim();
      if (trimmed.length < 3) {
        throw new Error("Le pseudo doit contenir au moins 3 caractères");
      }

      const nextProfile = profile
        ? await updateProfile(user.id, { username: trimmed, avatar_url: avatarUrl })
        : await createProfile(user.id, trimmed, avatarUrl);

      setProfile(nextProfile);

      if (!profile) {
        await saveUserProgress(user.id, 0);
        setProgressLevel(0);
      }
    },
    [profile, user]
  );

  const recordLevelCompletion = useCallback(
    async (stats: LevelStats): Promise<number | null> => {
      if (!user || !profile) return null;

      const nextLevel = stats.levelIndex + 1;
      const score = await submitLevelScore(
        user.id,
        stats.levelIndex,
        stats.timeSeconds,
        stats.attempts
      );
      await saveUserProgress(user.id, nextLevel);
      setProgressLevel(nextLevel);
      return score;
    },
    [profile, user]
  );

  const value = useMemo<AuthContextValue>(
    () => ({
      configured,
      loading,
      user,
      profile,
      progressLevel,
      needsProfileSetup: Boolean(user && !profile),
      authError,
      signIn,
      signUp,
      signOut,
      completeProfile,
      recordLevelCompletion,
      clearAuthError: () => setAuthError(null),
    }),
    [
      configured,
      loading,
      user,
      profile,
      progressLevel,
      authError,
      signIn,
      signUp,
      signOut,
      completeProfile,
      recordLevelCompletion,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth doit être utilisé dans AuthProvider");
  }
  return context;
}
