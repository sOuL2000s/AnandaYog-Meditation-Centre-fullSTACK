// src/components/ProtectedRoute.js
"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';

// Wraps the content of a page that requires authentication
export default function ProtectedRoute({ children }) {
  const { currentUser, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !currentUser) {
      // If not loading and no user is found, redirect to the home page
      router.push('/');
    }
  }, [currentUser, loading, router]);

  if (loading || !currentUser) {
    // Show a loading screen while checking status
    return (
      <div className="flex justify-center items-center h-96">
        <p className="text-xl text-gray-500">Accessing secure content...</p>
      </div>
    );
  }

  // If authenticated, render the children (the actual page content)
  return children;
}