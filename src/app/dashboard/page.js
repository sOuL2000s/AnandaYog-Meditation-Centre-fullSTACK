// src/app/dashboard/page.js
"use client"; // CRITICAL: Mark this component as client-side

import Link from 'next/link';
import PaymentInitiator from '@/components/PaymentInitiator'; 
import AuthStatus from '@/components/AuthStatus'; 
import { useAuth } from '@/context/AuthContext'; 

export default function DashboardPage() {
  const { currentUser, userData, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        {/* Simple loader placeholder */}
        <div className="animate-pulse text-xl text-gray-500">
             Checking user status...
        </div>
      </div>
    );
  }

  // Handle NOT LOGGED IN state: Show the login UI directly
  if (!currentUser) {
    return (
        <div className="container mx-auto p-8 sm:p-12 flex justify-center">
            <div className="w-full max-w-md">
                <h1 className="text-3xl font-serif font-bold text-center text-teal-800 mb-6">
                    Log In to Access Your Dashboard
                </h1>
                <p className="text-center text-gray-600 mb-8">
                    Please sign in using your Google account to manage your subscription.
                </p>
                <AuthStatus />
            </div>
        </div>
    );
  }

  // Determine access level
  const isSubscribed = userData?.isSubscribed;
  const accessColor = isSubscribed ? 'text-green-600' : 'text-amber-500'; // Amber for "attention/upgrade needed"

  return (
    <div className="container mx-auto p-8 max-w-5xl">
      {/* Changed header color */}
      <h1 className="text-4xl font-serif font-bold text-teal-800 mb-2">
        Welcome Back, {currentUser?.displayName?.split(' ')[0] || 'Yogi'}!
      </h1>
      <p className="text-lg text-gray-600 mb-8">
        Manage your subscription and access your private course library.
      </p>

      {/* Subscription Status Card - Changed border color */}
      <div className="bg-white p-6 rounded-lg shadow-2xl border-l-4 border-teal-500 mb-10">
        <h2 className="text-2xl font-semibold mb-3">Membership Status</h2>
        <p className="text-lg">
          Current Plan: 
          <span className={`font-bold ml-2 ${accessColor}`}>
            {isSubscribed ? 'Yogi Monthly (Active)' : 'Explorer (Free Tier) - UPGRADE NOW'}
          </span>
        </p>
      </div>

      <PaymentInitiator />
      
      {/* Protected Content Section */}
      <div className="mt-12 p-8 bg-gray-50 rounded-lg shadow-inner">
        {/* Changed header color */}
        <h2 className="text-2xl font-serif font-bold mb-5 text-teal-700">Your Course Library</h2>
        
        {isSubscribed ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <CourseLink title="Mastering Vipassana: 30 Day Series" href="/courses/vipassana" />
                <CourseLink title="Hatha Flow for Flexibility" href="/courses/hatha-flow" />
                <CourseLink title="Pranayama Fundamentals" href="/courses/pranayama" />
                <CourseLink title="Guided Sleep Audio Archive" href="/courses/sleep-audio" />
            </div>
        ) : (
            <div className="text-center p-8 bg-white border-2 border-dashed border-amber-300 rounded-lg">
                <p className="text-xl text-amber-600 font-medium mb-4">
                    Unlock Premium: Please subscribe to access all courses.
                </p>
                <p className="text-gray-500">
                    You currently have access only to the 5 free introductory videos.
                </p>
                {/* Link directly to the pricing page for clarity */}
                <Link href="/pricing" className="mt-4 inline-block text-teal-600 hover:underline">
                    View Subscription Plans →
                </Link>
            </div>
        )}
      </div>
    </div>
  );
}

const CourseLink = ({ title, href }) => (
    <Link 
        href={href} 
        className="block p-4 bg-white rounded-lg shadow-md hover:bg-teal-50/50 transition duration-200 border-l-4 border-amber-500"
    >
        <p className="font-semibold text-gray-800">{title}</p>
        <p className="text-sm text-gray-500">Start Lesson 1 →</p>
    </Link>
);