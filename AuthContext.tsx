
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  loadingAuth: boolean;
  login: (provider: 'google' | 'apple' | 'mock') => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);

  useEffect(() => {
    // Simulate checking for an existing session
    const storedUser = localStorage.getItem('authUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoadingAuth(false);
  }, []);

  const login = (provider: 'google' | 'apple' | 'mock') => {
    setLoadingAuth(true);
    // Simulate API call
    setTimeout(() => {
      const mockUser: User = {
        id: 'mock-user-id-' + provider,
        email: `mockuser@${provider}.com`,
        displayName: `Mock ${provider.charAt(0).toUpperCase() + provider.slice(1)} User`,
        provider: provider,
      };
      setUser(mockUser);
      localStorage.setItem('authUser', JSON.stringify(mockUser));
      setLoadingAuth(false);
    }, 1000);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('authUser');
    localStorage.removeItem('userPreferences'); // Also clear preferences on logout
    localStorage.removeItem('isOnboardingComplete');
    // In a real app, you'd also redirect or handle post-logout logic
  };

  return (
    <AuthContext.Provider value={{ user, loadingAuth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
    