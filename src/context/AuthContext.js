// src/context/AuthContext.js (UPDATED to include Firestore subscription check)
"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, db } from '../lib/firebase'; // Import db
import { onAuthStateChanged, signOut, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { doc, getDoc, onSnapshot } from 'firebase/firestore'; // Import Firestore functions

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userData, setUserData] = useState(null); // New state for Firestore data
  const [loading, setLoading] = useState(true);

  const googleProvider = new GoogleAuthProvider();
  const login = () => signInWithPopup(auth, googleProvider);
  const logout = () => signOut(auth);

  useEffect(() => {
    let unsubscribeAuth;
    let unsubscribeFirestore;

    unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      setLoading(false);

      if (user) {
        // Start listening to the user's document in Firestore
        const userRef = doc(db, "users", user.uid);
        
        // Listen for real-time updates to the user's profile/subscription data
        unsubscribeFirestore = onSnapshot(userRef, (docSnap) => {
            if (docSnap.exists()) {
                setUserData(docSnap.data());
            } else {
                // User document doesn't exist yet, initialize minimum data
                setUserData({ isSubscribed: false });
            }
        }, (error) => {
            console.error("Error listening to Firestore:", error);
            setUserData({ isSubscribed: false });
        });
      } else {
          setUserData(null);
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
    userData, // Expose user data (including subscription status)
    loading,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {/* We wait for both auth check and initial user data load (or lack thereof) */}
      {!loading && children} 
    </AuthContext.Provider>
  );
};
