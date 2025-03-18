import React, { createContext, useContext, useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { toast } from 'react-hot-toast';

const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_ANON_KEY);

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Add loading state to handle async session fetch

  useEffect(() => {
    // Fetch the initial session
    const fetchSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        console.log('Initial session:', session); // Debug log
        setUser(session?.user ?? null);
      } catch (error) {
        console.error('Error fetching initial session:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSession();

    // Listen for auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth event:', event, 'Session:', session); // Debug log
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      console.error('Sign-in error:', error.message);
      throw error;
    }
    console.log('Sign-in successful, user:', data.user);
    setUser(data.user);
    toast.success('Successfully signed in!');
    return data;
  };

  const signUp = async (email, password) => {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
    toast.success('Sign up successful! Please check your email to verify.');
    return data;
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    setUser(null);
    toast.success('Successfully signed out!');
  };

  return (
    <AuthContext.Provider value={{ user, supabase, signIn, signUp, signOut, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);