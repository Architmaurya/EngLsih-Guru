import React, { createContext, useContext, useState, useCallback } from 'react';

const defaultUser = {
  userName: '',
  phoneNumber: '',
  age: '',
  class: null, // student class 1-9 (English Guru)
  parentAge: null, // 18-80 (English Guru)
  profileImageUri: null,
  id: null,
  email: '',
  token: null,
  isOnboardingComplete: false,
  isSubscribed: false,
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

  const clearUser = useCallback(() => {
    setUserState({ ...defaultUser });
  }, []);

  const value = { user, updateUser, setUser, clearUser };

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
