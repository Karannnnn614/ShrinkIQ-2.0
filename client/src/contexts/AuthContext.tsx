import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

interface User {
  email: string;
  id: string;
}

interface AuthContextType {
  token: string | null;
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => void;
  updateProfile: (data: Partial<User>) => Promise<void>;
  getProfile: () => Promise<User>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Load user profile when token exists
    if (token) {
      getProfile().catch(() => signOut());
    }
  }, [token]);

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
        email,
        password
      });

      localStorage.setItem('token', response.data.token);
      setToken(response.data.token);
      
      await getProfile();
    } catch (error) {
      throw new Error('Login failed');
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string) => {
    setLoading(true);
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/register`, {
        email,
        password
      });

      localStorage.setItem('token', response.data.token);
      setToken(response.data.token);
      
      await getProfile();
    } catch (error) {
      throw new Error('Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const signOut = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  const getProfile = async (): Promise<User> => {
    if (!token) throw new Error('No authentication token');
    
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/auth/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      setUser(response.data);
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch user profile');
    }
  };

  const updateProfile = async (data: Partial<User>) => {
    if (!token) throw new Error('No authentication token');
    
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/auth/profile`, 
        data,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      setUser(response.data);
    } catch (error) {
      throw new Error('Failed to update user profile');
    }
  };

  return (
    <AuthContext.Provider value={{ 
      token, 
      user, 
      loading, 
      signIn, 
      signUp, 
      signOut,
      getProfile,
      updateProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
};