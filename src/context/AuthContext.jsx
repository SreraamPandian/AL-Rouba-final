import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    // Check for stored user data on initialization
    const storedUser = localStorage.getItem('user');
    const rememberMe = localStorage.getItem('rememberMe') === 'true';
    return storedUser && rememberMe ? JSON.parse(storedUser) : null;
  });

  const login = (email, role, rememberMe) => {
    const userData = {
      id: 1,
      email,
      role,
      name: role === 'Sales Executive' ? 'John Smith' :
        role === 'Sales Manager' ? 'Sarah Johnson' :
          role === 'Manager' ? 'Mike Wilson' : 'Admin User',
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(role)}&background=3b82f6&color=fff`
    };
    setUser(userData);

    if (rememberMe) {
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('rememberMe', 'true');
    } else {
      localStorage.removeItem('rememberMe');
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('rememberMe');
  };

  const value = {
    user,
    login,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
