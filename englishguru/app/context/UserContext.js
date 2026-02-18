import React, { createContext, useContext, useState, useCallback } from 'react';

const defaultUser = {
  userName: 'Anjali Sharma',
  phoneNumber: '+91 98765 43210',
  age: '',
  profileImageUri: null,
};

const UserContext = createContext(null);

export function UserProvider({ children }) {
  const [user, setUserState] = useState(defaultUser);

  const updateUser = useCallback((updates) => {
    setUserState((prev) => ({ ...prev, ...updates }));
  }, []);

  const setUser = useCallback((newUser) => {
    setUserState((prev) => ({ ...defaultUser, ...prev, ...newUser }));
  }, []);

  const value = { user, updateUser, setUser };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error('useUser must be used within UserProvider');
  return ctx;
}
