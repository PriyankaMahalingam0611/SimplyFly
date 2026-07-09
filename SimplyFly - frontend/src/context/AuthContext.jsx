import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('sf_user');
    return stored ? JSON.parse(stored) : null;
  });

  const loginUser = (authData) => {
    localStorage.setItem('sf_token', authData.token);
    localStorage.setItem('sf_user', JSON.stringify(authData));
    setUser(authData);
  };

  const logout = () => {
    localStorage.removeItem('sf_token');
    localStorage.removeItem('sf_user');
    setUser(null);
  };

  const updateUserInContext = (partialUpdate) => {
    const updated = { ...user, ...partialUpdate };
    localStorage.setItem('sf_user', JSON.stringify(updated));
    setUser(updated);
  };

  return (
    <AuthContext.Provider value={{ user, loginUser, logout, updateUserInContext }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);