import React, { createContext, useContext, useState, useEffect } from 'react';
import { xano } from '../xano';

interface User {
  id: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  userId: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const checkUser = async () => {
      const token = localStorage.getItem('xano_token');
      if (token) {
        try {
          const userData = await xano.auth.getUser();
          setUser(userData);
          setUserId(userData.id);
        } catch (error) {
          console.error('Error fetching user:', error);
          localStorage.removeItem('xano_token');
        }
      }
      setIsLoading(false);
    };

    checkUser();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const userData = await xano.auth.signIn(email, password);
      setUser(userData);
      setUserId(userData.id);
    } catch (error) {
      console.error('Error logging in:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await xano.auth.signOut();
      setUser(null);
      setUserId(null);
      localStorage.removeItem('xano_token');
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading, userId }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};