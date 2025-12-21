// src/app/dashboard/page.js
"use client"; // CRITICAL: Mark this component as client-side

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import PaymentInitiator from '@/components/PaymentInitiator'; 
import { useAuth } from '@/context/AuthContext'; 

export default function DashboardPage() {
  const { currentUser, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // If we finished loading and there is no current user, redirect to home/login.
    if (!loading && !currentUser) {
      router.replace('/'); 
    }
  }, [currentUser, loading, router]);
  
  // 1. Show loading or redirection message while checking auth status
  if (loading || !currentUser) {
    return (
      <div className="flex justify-center items-center h-96">
        <p className="text-xl text-gray-500">Accessing secure content...</p>
      </div>
    );
  }

  // 2. Render the actual dashboard content if authenticated
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold text-indigo-800 mb-4">
        Welcome, {currentUser?.displayName || 'Yogi'}!
      </h1>
      <p className="text-lg text-gray-600 mb-8">
        This is your private dashboard. Access secured content and manage your subscription.
      </p>

      {/* Protected Content */}
      <div className="bg-white p-6 rounded-lg shadow-xl mb-8">
        <h2 className="text-2xl font-semibold mb-3">Your Active Courses</h2>
        <ul className="list-disc list-inside space-y-2 text-gray-700">
          <li>Daily Chakra Balancing (Video Access)</li>
          <li>Guided Sleep Meditation Audio</li>
        </ul>
      </div>

      <PaymentInitiator />
    </div>
  );
}
