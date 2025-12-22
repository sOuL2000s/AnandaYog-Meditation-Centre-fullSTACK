// src/context/AuthContext.js (Cleanest and most robust version)
"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, db } from '../lib/firebase'; 
import { onAuthStateChanged, signOut, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { doc, onSnapshot, setDoc } from 'firebase/firestore'; 

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

// FIX: Modified to enforce 'light' as the strict default if no preference is saved locally.
const getInitialTheme = () => {
    if (typeof window !== 'undefined') {
        const localTheme = localStorage.getItem('theme');
        if (localTheme) return localTheme;
        
        // New logic: If no local theme is found, we do NOT check system preference 
        // to strictly enforce the 'light' default until the user toggles it.
    }
    return 'light'; // Strict Default (Light Mode)
};


export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userData, setUserData] = useState(null); 
  const [loading, setLoading] = useState(true);
  
  // Initialize theme using the function for unauthenticated state
  const [theme, setTheme] = useState(getInitialTheme); 

  const googleProvider = new GoogleAuthProvider();
  const login = () => signInWithPopup(auth, googleProvider);
  const logout = () => signOut(auth);

  // Function to toggle and persist the theme
  const toggleTheme = async () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme); // Apply instantly to local state

    if (currentUser) {
      // 1. Logged in: Save to Firestore (creates doc if it doesn't exist)
      try {
        const userRef = doc(db, "users", currentUser.uid);
        await setDoc(userRef, { theme: newTheme }, { merge: true });
        console.log("Theme saved to Firestore.");
        localStorage.removeItem('theme'); // Clear local pref once Firestore owns it
      } catch (e) {
        console.error("Error saving theme to Firestore:", e);
      }
    } else {
      // 2. Not logged in: Save to Local Storage
      localStorage.setItem('theme', newTheme);
      console.log("Theme saved to Local Storage.");
    }
  };

  useEffect(() => {
    let unsubscribeAuth;
    let unsubscribeFirestore;

    unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      setLoading(false);

      if (user) {
        // --- LOGGED IN ---
        const userRef = doc(db, "users", user.uid);
        
        unsubscribeFirestore = onSnapshot(userRef, (docSnap) => {
            if (docSnap.exists()) {
                const data = docSnap.data();
                setUserData(data);
                
                // Priority 1: Use theme from Firestore
                if (data.theme) {
                    setTheme(data.theme);
                } else {
                    // Priority 2: Use theme from local storage if existing user document lacks theme
                    const localTheme = localStorage.getItem('theme');
                    if (localTheme) {
                        setTheme(localTheme);
                        // Persist local preference to Firestore
                        setDoc(userRef, { theme: localTheme }, { merge: true });
                    } else {
                         // Fallback to light mode if neither Firestore nor local storage has a preference
                         setTheme('light'); 
                    }
                }
            } else {
                // --- NEW USER / FIRST LOGIN ---
                setUserData({ isSubscribed: false });
                const initialTheme = getInitialTheme(); // Will be 'light' or saved local pref
                setTheme(initialTheme);
                
                // Create document and set initial theme preference
                setDoc(userRef, { theme: initialTheme, isSubscribed: false }, { merge: true });
            }
        }, (error) => {
            console.error("Error listening to Firestore:", error);
            setUserData({ isSubscribed: false });
        });
      } else {
          // --- LOGGED OUT ---
          setUserData(null);
          // Set theme based on local storage / system preference (now simplified to only check local storage)
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
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children} 
    </AuthContext.Provider>
  );
};