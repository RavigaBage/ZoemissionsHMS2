import React, { createContext, useContext, useState, useEffect } from 'react';
import { Role } from '../types';
import { api } from '../api/client';

interface AuthUser {
  id: number;
  name: string;
  role: Role;
}

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  isLoading: boolean;
  login: (name: string, pin: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('missions_clinic_token'));
  const [user, setUser] = useState<AuthUser | null>(() => {
    const saved = localStorage.getItem('missions_clinic_user');
    console.log('Saved user from localStorage:', saved);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (!parsed.role || !parsed.id) return null;
      return parsed;
    }
    return null;
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('missions_clinic_token');
    localStorage.removeItem('missions_clinic_user');
  };

  useEffect(() => {
    api.setUnauthorizedHandler(() => {
      logout();
    });
  }, []);

  const login = async (name: string, pin: string) => {
    setIsLoading(true);
    try {
      const res = await api.post<{id:number, token: string; user: AuthUser,staff_name: string,role: Role }>('/api/auth/login', { name, pin });
      const composed_user = {
        id: res.user.id,
        name: res.user.name,
        role: res.user.role,
      }
      setToken(res.token);
      setUser(composed_user);
      localStorage.setItem('missions_clinic_token', res.token);
      localStorage.setItem('missions_clinic_user', JSON.stringify(composed_user));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        login,
        logout,
        isAuthenticated: Boolean(token && user),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
