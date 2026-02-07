import { createContext, useContext, useEffect, useState } from 'react';
import { authAPI, Profile, UserRole } from '../lib/api';

interface AuthContextType {
  user: Profile | null;
  profile: Profile | null;
  loading: boolean;
  token: string | null;
  profileUpdatedAt: number | null;
  signUp: (email: string, password: string, fullName: string, role: UserRole, companyName?: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => void;
  updateProfile: (updatedProfile: Partial<Profile>) => void;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Profile | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [profileUpdatedAt, setProfileUpdatedAt] = useState<number | null>(null);

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
      console.log('Fetching profile from server...');
      const profileData = await authAPI.getProfile(authToken);
      console.log('Profile fetched successfully:', profileData.full_name);
      setUser(profileData);
      setProfile(profileData);
      setProfileUpdatedAt(Date.now());
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
      
      // Immediately set user data
      setUser(userData);
      setProfile(userData);
      
      // Then fetch the full profile to ensure role is set
      console.log('Fetching complete profile after sign in...');
      try {
        const fullProfile = await authAPI.getProfile(newToken);
        console.log('Complete profile fetched, role:', fullProfile.role);
        setUser(fullProfile);
        setProfile(fullProfile);
        setProfileUpdatedAt(Date.now());
      } catch (profileError) {
        console.error('Error fetching full profile after sign in:', profileError);
        // Continue with the data from sign in if profile fetch fails
      }
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

  const updateProfile = (updatedProfile: Partial<Profile>) => {
    setUser(prev => prev ? { ...prev, ...updatedProfile } : null);
    setProfile(prev => prev ? { ...prev, ...updatedProfile } : null);
    setProfileUpdatedAt(Date.now());
  };

  const refreshProfile = async () => {
    if (token) {
      console.log('Refreshing profile from MongoDB...');
      await fetchProfile(token);
    }
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, token, profileUpdatedAt, signUp, signIn, signOut, updateProfile, refreshProfile }}>
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
