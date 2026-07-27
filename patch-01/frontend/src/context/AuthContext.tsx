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
  login: (email: string, password: string) => Promise<User>;
  verifyOTP: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('iwpaint_user');
    const storedAuth = localStorage.getItem('iwpaint_isAuthenticated');
    
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    if (storedAuth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

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
    <AuthContext.Provider value={{ user, isAuthenticated, login, verifyOTP, logout }}>
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
