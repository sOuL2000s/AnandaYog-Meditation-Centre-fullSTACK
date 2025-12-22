// src/components/AuthStatus.js (React Component in JavaScript)
"use client"; // Required for client-side components in Next.js App Router

import React, { useState, useEffect } from 'react';
import { auth } from '../lib/firebase';
import { onAuthStateChanged, signOut, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
// FIX: CRITICAL: Import useAuth hook from the context file
import { useAuth } from '@/context/AuthContext';


// SVG Icon for Google
const GoogleIcon = () => (
    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-6 h-6 mr-3">
        <path fill="#EA4335" d="M24 9.5c3.2 0 5.7 1.1 7.4 2.8l4.4-4.4C33.4 5.9 28.9 4 24 4 14.5 4 6.6 9.8 4 18.5l7.9 6.1C12.5 17.6 17.6 12 24 12c3.2 0 5.7 1.1 7.4 2.8l4.4-4.4C33.4 5.9 28.9 4 24 4z"/>
        <path fill="#4285F4" d="M46.7 24c0-1.6-.2-3.3-.5-4.8H24v9.5h12.9c-.6 3.4-2.7 6.2-5.7 8.3l7.9 6.1C44.7 39.2 48 31.9 48 24z"/>
        <path fill="#FBBC05" d="M11.9 24.1c0-.9.2-1.8.4-2.6l-7.9-6.1c-1.3 2.6-2.1 5.6-2.1 8.7s.8 6.1 2.1 8.7l7.9-6.1c-.2-.8-.4-1.7-.4-2.6z"/>
        <path fill="#34A853" d="M24 44c6.3 0 11.6-2.1 15.5-5.8l-7.9-6.1c-2.4 1.7-5.5 2.7-8.6 2.7-7.4 0-13.6-4.9-15.8-11.6l-7.9 6.1C6.6 38.2 14.5 44 24 44z"/>
    </svg>
);


const provider = new GoogleAuthProvider();

export default function AuthStatus() {
  // Destructure login and loading from the imported useAuth hook
  const { currentUser, login, loading } = useAuth(); 
  const [localLoading, setLocalLoading] = useState(false); // Local state for button loading

  const handleLogin = async () => {
    setLocalLoading(true);
    try {
      await login(); // Calls the context login
    } catch (error) {
      console.error("Login failed:", error.message);
      setLocalLoading(false);
    }
    // Auth context handles setting global loading/user status
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout failed:", error.message);
    }
  };

  if (loading) {
    // If the global auth context is still loading, show a simple message
    return <div className="p-4 text-gray-500">Checking session...</div>;
  }

  return (
    <div className="p-0">
      {currentUser ? (
        <div className="space-y-4">
          <p className="text-sm text-green-600 dark:text-green-400">
            Logged in as: <span className="font-semibold">{currentUser.email}</span>
          </p>
          <button 
            onClick={handleLogout}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-lg transition duration-200 shadow-md"
          >
            Sign Out
          </button>
        </div>
      ) : (
        // Redesigned Login Button
        <button 
          onClick={handleLogin}
          className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 rounded-lg transition duration-200 shadow-xl flex items-center justify-center disabled:opacity-70"
          disabled={localLoading}
        >
            {localLoading ? (
                <span>Logging In...</span>
            ) : (
                <>
                    <GoogleIcon />
                    <span>Login with Google</span>
                </>
            )}
        </button>
      )}
    </div>
  );
}