import React, { createContext, useContext, useState, useEffect } from 'react';

type Role = 'admin' | 'sales' | 'supervisor' | 'distributor';

interface User {
  email: string;
  role: Role;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, role: Role) => void;
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

  const login = (email: string, role: Role) => {
    const newUser = { email, role };
    setUser(newUser);
    localStorage.setItem('iwpaint_user', JSON.stringify(newUser));
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
