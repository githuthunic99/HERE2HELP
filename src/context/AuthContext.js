import React, { createContext, useContext, useState, useEffect } from 'react';
import auth from '@react-native-firebase/auth';
import { getUserRole } from '../services/firebase';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(async firebaseUser => {
      if (firebaseUser) {
        try {
          // ✅ Fetch role FIRST before setting loading to false
          // This prevents the flash of wrong screen
          const userRole = await getUserRole(firebaseUser.uid);
          setUser(firebaseUser);
          setRole(userRole);
        } catch (e) {
          // If role fetch fails, default to student
          setUser(firebaseUser);
          setRole('student');
        }
      } else {
        setUser(null);
        setRole(null);
      }
      // ✅ Only stop loading AFTER role is fetched
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider value={{ user, role, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
