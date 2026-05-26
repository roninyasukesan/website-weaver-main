import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isAdmin: boolean;
  isApproved: boolean;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: any }>;
  signInWithGoogle: () => Promise<{ error: any }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isApproved, setIsApproved] = useState(false);
  const [loading, setLoading] = useState(true);

  const resolveAccess = async (currentUser: User) => {
    let roleData: { role: string } | null = null;
    let profileData: { approval_status: string } | null = null;

    for (let attempt = 0; attempt < 3; attempt++) {
      const [{ data: role }, { data: profile }] = await Promise.all([
        supabase.from('user_roles').select('role').eq('user_id', currentUser.id).eq('role', 'admin').maybeSingle(),
        supabase.from('profiles').select('approval_status').eq('id', currentUser.id).maybeSingle(),
      ]);

      roleData = role;
      profileData = profile;

      if (roleData || profileData) break;
      await new Promise((resolve) => setTimeout(resolve, 150));
    }

    const adminByRole = !!roleData;
    const adminByEmail = currentUser.email?.toLowerCase() === 'admin@keliane.adv.br';
    setIsAdmin(adminByRole || adminByEmail);
    setIsApproved(profileData?.approval_status === 'approved' || adminByRole || adminByEmail);
  };

  useEffect(() => {
    let cancelled = false;

    const initAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (cancelled) return;

      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user) {
        await resolveAccess(session.user);
        if (cancelled) return;
      } else {
        setIsAdmin(false);
        setIsApproved(false);
      }

      if (!cancelled) setLoading(false);
    };

    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (cancelled) return;
        setLoading(true);
        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          await resolveAccess(session.user);
          if (cancelled) return;
        } else {
          setIsAdmin(false);
          setIsApproved(false);
        }
        if (!cancelled) setLoading(false);
      }
    );

    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error };
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    const redirectUrl = `${window.location.origin}/`;
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: { full_name: fullName }
      }
    });
    return { error };
  };

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/dashboard`
      }
    });
    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{
      user,
      session,
      isAdmin,
      isApproved,
      loading,
      signIn,
      signUp,
      signInWithGoogle,
      signOut
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
