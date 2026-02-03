import { createContext, useContext, useEffect, useState } from 'react';
import { authAPI, Profile, UserRole } from '../lib/api';

interface AuthContextType {
  user: Profile | null;
  profile: Profile | null;
  loading: boolean;
  token: string | null;
  signUp: (email: string, password: string, fullName: string, role: UserRole, companyName?: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Profile | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if token exists in localStorage on mount
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
      fetchProfile(storedToken);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchProfile = async (authToken: string) => {
    try {
      const profileData = await authAPI.getProfile(authToken);
      setUser(profileData);
      setProfile(profileData);
    } catch (error) {
      console.error('Error fetching profile:', error);
      localStorage.removeItem('token');
      setToken(null);
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, fullName: string, role: UserRole, companyName?: string) => {
    try {
      const { token: newToken, user: userData } = await authAPI.signUp(email, password, fullName, role, companyName);
      localStorage.setItem('token', newToken);
      setToken(newToken);
      setUser(userData);
      setProfile(userData);
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      console.log('Attempting sign in with:', email);
      const { token: newToken, user: userData } = await authAPI.signIn(email, password);
      console.log('Sign in successful, token:', newToken.substring(0, 20) + '...');
      localStorage.setItem('token', newToken);
      setToken(newToken);
      setUser(userData);
      setProfile(userData);
    } catch (error: any) {
      console.error('Sign in error:', error.message);
      throw error;
    }
  };

  const signOut = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setProfile(null);
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, token, signUp, signIn, signOut }}>
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
