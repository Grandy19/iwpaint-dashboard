import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';

type Role = 'admin' | 'sales' | 'supervisor' | 'distributor';

interface User {
  id?: number;
  email: string;
  role: Role;
  name: string;
  username: string;
  area?: string;
  supervisor_name?: string;
  nomor_hp?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<User>;
  verifyOTP: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const storedUser = localStorage.getItem('iwpaint_user');
      return storedUser ? JSON.parse(storedUser) : null;
    } catch {
      return null;
    }
  });
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('iwpaint_isAuthenticated') === 'true';
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (user && user.id && isAuthenticated) {
      const pingActivity = async () => {
        try {
          await api.post('/attendance/ping', { userId: user.id });
        } catch (e) {
          console.error("Failed to ping activity", e);
        }
      };
      
      pingActivity();
      
      const interval = setInterval(pingActivity, 5 * 60 * 1000); // Ping every 5 minutes
      return () => clearInterval(interval);
    }
  }, [user?.id, isAuthenticated]);

  const login = async (email: string, password: string): Promise<User> => {
    const response = await api.post('/auth/login', { email, password });
    const newUser = response.data.user;
    setUser(newUser);
    localStorage.setItem('iwpaint_user', JSON.stringify(newUser));
    return newUser;
  };

  const verifyOTP = () => {
    setIsAuthenticated(true);
    localStorage.setItem('iwpaint_isAuthenticated', 'true');
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('iwpaint_user');
    localStorage.removeItem('iwpaint_isAuthenticated');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isLoading, login, verifyOTP, logout }}>
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
