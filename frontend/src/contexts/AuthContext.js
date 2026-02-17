import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for saved user in localStorage
    const savedUser = localStorage.getItem('monopoly-user');
    const savedToken = localStorage.getItem('monopoly-token');
    
    if (savedUser && savedToken) {
      setUser(JSON.parse(savedUser));
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const login = (userData, token) => {
    setUser(userData);
    setIsAuthenticated(true);
    localStorage.setItem('monopoly-user', JSON.stringify(userData));
    localStorage.setItem('monopoly-token', token);
  };

  const signup = (userData, token) => {
    setUser(userData);
    setIsAuthenticated(true);
    localStorage.setItem('monopoly-user', JSON.stringify(userData));
    localStorage.setItem('monopoly-token', token);
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('monopoly-user');
    localStorage.removeItem('monopoly-token');
  };

  const updateUser = (userData) => {
    setUser(userData);
    localStorage.setItem('monopoly-user', JSON.stringify(userData));
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated, 
      loading,
      login, 
      signup, 
      logout,
      updateUser 
    }}>
      {children}
    </AuthContext.Provider>
  );
};