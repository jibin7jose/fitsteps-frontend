import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('access_token'));
  const [isAuthenticated, setIsAuthenticated] = useState(!!token);
  const [user, setUser] = useState(null);

  useEffect(() => {
    setIsAuthenticated(!!token);
    if (token) {
      localStorage.setItem('access_token', token);
      fetchUser();
    } else {
      localStorage.removeItem('access_token');
      setUser(null);
    }
  }, [token]);

  const fetchUser = async () => {
    try {
      const response = await api.get('/leaderboard/');
      const currentUser = response.data.find(u => u.is_current_user);
      if (currentUser) {
        setUser({ name: currentUser.name.replace(' (You)', '') });
      }
    } catch (error) {
      console.error('Failed to fetch user:', error);
      if (error.response?.status === 401) {
        logout();
      }
    }
  };

  const login = async (username, password) => {
    const formData = new URLSearchParams();
    formData.append('username', username);
    formData.append('password', password);
    
    const response = await api.post('/auth/login', formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    setToken(response.data.access_token);
  };

  const register = async (email, name, password) => {
    await api.post('/auth/register', { email, name, password });
    await login(email, password);
  };

  const logout = () => {
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ token, isAuthenticated, user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
