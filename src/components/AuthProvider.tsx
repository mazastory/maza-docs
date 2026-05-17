import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Session, User } from '@supabase/supabase-js';

type AuthContextType = {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isAdmin: boolean;
  proStatus: string;
  isPro: boolean;
  credits: number;
  uxMode: 'autopilot' | 'expert';
  toggleUxMode: () => void;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  isAdmin: false,
  proStatus: 'FREE',
  isPro: false,
  credits: 0,
  uxMode: 'autopilot',
  toggleUxMode: () => {},
  signInWithGoogle: async () => {},
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [proStatus, setProStatus] = useState<string>('FREE');
  const [isPro, setIsPro] = useState(false);
  const [credits, setCredits] = useState(0);
  const [uxMode, setUxMode] = useState<'autopilot' | 'expert'>(() => {
    return (localStorage.getItem('ux_mode') as 'autopilot' | 'expert') || 'autopilot';
  });

  const toggleUxMode = () => {
    setUxMode((prev) => {
      const next = prev === 'autopilot' ? 'expert' : 'autopilot';
      localStorage.setItem('ux_mode', next);
      return next;
    });
  };

  useEffect(() => {
    // 🚀 SSO Token Handler
    const params = new URLSearchParams(window.location.search);
    const accessToken = params.get('access_token');
    const refreshToken = params.get('refresh_token');

    if (accessToken && refreshToken) {
      supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken
      }).then(() => {
        // Remove tokens from URL for security
        window.history.replaceState({}, document.title, window.location.pathname);
      });
    }

    supabase.auth.getSession().then(({ data }: { data: any }) => {
      const session = data?.session;
      setSession(session);
      setUser(session?.user ?? null);
      checkAdmin(session?.user);
      if (session?.user) fetchProfile(session.user.id);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: string, session: Session | null) => {
      setSession(session);
      setUser(session?.user ?? null);
      checkAdmin(session?.user);
      if (session?.user) fetchProfile(session.user.id);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId: string) => {
    const { data } = await supabase
      .from('profiles')
      .select('plan')
      .eq('id', userId)
      .maybeSingle();
    
    if (data) {
      const status = (data.plan || 'free').toUpperCase();
      setProStatus(status);
      setIsPro(status === 'PRO');
    }
  };

  // Sync auth with extension
  useEffect(() => {
    if (session) {
      window.postMessage({
        type: 'MAZA_SYNC_AUTH',
        token: session.access_token,
        userId: session.user.id,
        email: session.user.email,
        isPro: isPro // 익스텐션에도 프로 상태 전달
      }, '*');
    }
  }, [session, isPro]);

  const checkAdmin = (user: User | null | undefined) => {
    const adminEmails = ['73asdzzz@gmail.com', 'admin@mazastudio.kr'];
    if (user?.email && (user.email.includes('admin') || adminEmails.includes(user.email))) {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
    }
  };

  const signInWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin }
    });
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setProStatus('FREE');
    setIsPro(false);
    setCredits(0);
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, isAdmin, proStatus, isPro, credits, uxMode, toggleUxMode, signInWithGoogle, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
