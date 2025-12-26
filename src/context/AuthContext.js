// src/context/AuthContext.js (Cleanest and most robust version)
"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, db } from '../lib/firebase'; 
import { onAuthStateChanged, signOut, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { doc, onSnapshot, setDoc } from 'firebase/firestore'; 

// ... (getInitialTheme and ADMIN_UID functions/constants remain the same)
const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

const getInitialTheme = () => {
    if (typeof window !== 'undefined') {
        const localTheme = localStorage.getItem('theme');
        if (localTheme) return localTheme;
    }
    return 'light'; // Strict Default (Light Mode)
};

const ADMIN_UID = process.env.NEXT_PUBLIC_ADMIN_FIREBASE_UID;


export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userData, setUserData] = useState(null); 
  const [loading, setLoading] = useState(true);
  
  const [theme, setTheme] = useState(getInitialTheme); 
  const [isAdmin, setIsAdmin] = useState(false);

  const googleProvider = new GoogleAuthProvider();
  const login = () => signInWithPopup(auth, googleProvider);
  const logout = () => signOut(auth);

  const toggleTheme = async () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme); 

    if (currentUser) {
      try {
        const userRef = doc(db, "users", currentUser.uid);
        await setDoc(userRef, { theme: newTheme }, { merge: true });
        localStorage.removeItem('theme'); 
      } catch (e) {
        console.error("Error saving theme to Firestore:", e);
      }
    } else {
      localStorage.setItem('theme', newTheme);
    }
  };

  useEffect(() => {
    let unsubscribeAuth;
    let unsubscribeFirestore;

    unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      setLoading(false);
      
      setIsAdmin(!!user && user.uid === ADMIN_UID);

      if (user) {
        const userRef = doc(db, "users", user.uid);
        
        unsubscribeFirestore = onSnapshot(userRef, (docSnap) => {
            if (docSnap.exists()) {
                const rawData = docSnap.data();
                
                // --- CRITICAL FIX: Calculate Dynamic Subscription Status ---
                let isSubscribed = rawData.isSubscribed || false;
                if (rawData.subscriptionExpires) {
                    const expiryDate = new Date(rawData.subscriptionExpires);
                    const now = new Date();
                    if (isSubscribed && expiryDate <= now) {
                        isSubscribed = false; 
                    }
                }
                
                const data = { ...rawData, isSubscribed }; 
                setUserData(data);
                // -----------------------------------------------------------

                
                // Theme Logic (omitted for brevity, remains functional)
                if (data.theme) {
                    setTheme(data.theme);
                } else {
                    const localTheme = localStorage.getItem('theme');
                    if (localTheme) {
                        setTheme(localTheme);
                        setDoc(userRef, { theme: localTheme }, { merge: true });
                    } else {
                         setTheme('light'); 
                    }
                }
            } else {
                // --- NEW USER / FIRST LOGIN FIX ---
                const initialTheme = getInitialTheme();
                setTheme(initialTheme);
                
                // CRITICAL ADDITION: Ensure gita_progress is initialized as an empty object
                const initialUserData = { 
                    theme: initialTheme, 
                    isSubscribed: false, 
                    progress: {},
                    gita_progress: {} // <-- ADDED THIS LINE
                };
                
                setUserData(initialUserData);
                setDoc(userRef, initialUserData, { merge: true });
            }
        }, (error) => {
            console.error("Error listening to Firestore:", error);
            setUserData({ isSubscribed: false });
        });
      } else {
          // --- LOGGED OUT ---
          setUserData(null);
          setTheme(getInitialTheme());
      }
    });

    // Cleanup function
    return () => {
        if (unsubscribeAuth) unsubscribeAuth();
        if (unsubscribeFirestore) unsubscribeFirestore();
    };
  }, []); 


  const value = {
    currentUser,
    userData, 
    loading,
    login,
    logout,
    theme,           
    toggleTheme,     
    isAdmin, 
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children} 
    </AuthContext.Provider>
  );
};
