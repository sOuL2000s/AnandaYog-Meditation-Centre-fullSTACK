// src/app/dashboard/page.js
"use client"; // CRITICAL: Mark this component as client-side

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link'; // <--- FIX: Import Link
import PaymentInitiator from '@/components/PaymentInitiator'; 
import { useAuth } from '@/context/AuthContext'; 

export default function DashboardPage() {
  const { currentUser, userData, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !currentUser) {
      router.replace('/'); 
    }
  }, [currentUser, loading, router]);
  
  if (loading || !currentUser) {
    return (
      <div className="flex justify-center items-center h-96">
        <p className="text-xl text-gray-500">Accessing secure content...</p>
      </div>
    );
  }

  // Determine access level
  const isSubscribed = userData?.isSubscribed;
  const accessColor = isSubscribed ? 'text-emerald-600' : 'text-red-500';

  return (
    <div className="container mx-auto p-8 max-w-5xl">
      <h1 className="text-4xl font-serif font-bold text-indigo-800 mb-2">
        Welcome Back, {currentUser?.displayName?.split(' ')[0] || 'Yogi'}!
      </h1>
      <p className="text-lg text-gray-600 mb-8">
        Manage your subscription and access your private course library.
      </p>

      {/* Subscription Status Card */}
      <div className="bg-white p-6 rounded-lg shadow-2xl border-l-4 border-indigo-500 mb-10">
        <h2 className="text-2xl font-semibold mb-3">Membership Status</h2>
        <p className="text-lg">
          Current Plan: 
          <span className={`font-bold ml-2 ${accessColor}`}>
            {isSubscribed ? 'Yogi Monthly (Active)' : 'Explorer (Free Tier)'}
          </span>
        </p>
      </div>

      <PaymentInitiator />
      
      {/* Protected Content Section */}
      <div className="mt-12 p-8 bg-gray-50 rounded-lg shadow-inner">
        <h2 className="text-2xl font-serif font-bold mb-5 text-indigo-700">Your Course Library</h2>
        
        {isSubscribed ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <CourseLink title="Mastering Vipassana: 30 Day Series" href="/courses/vipassana" />
                <CourseLink title="Hatha Flow for Flexibility" href="/courses/hatha-flow" />
                <CourseLink title="Pranayama Fundamentals" href="/courses/pranayama" />
                <CourseLink title="Guided Sleep Audio Archive" href="/courses/sleep-audio" />
            </div>
        ) : (
            <div className="text-center p-8 bg-white border-2 border-dashed border-red-200 rounded-lg">
                <p className="text-xl text-red-600 font-medium mb-4">
                    Access Denied: Please subscribe to unlock all premium courses.
                </p>
                <p className="text-gray-500">
                    You currently have access only to the 5 free introductory videos.
                </p>
            </div>
        )}
      </div>
    </div>
  );
}

const CourseLink = ({ title, href }) => (
    <Link 
        href={href} 
        className="block p-4 bg-white rounded-lg shadow-md hover:bg-indigo-500/5 transition duration-200 border-l-4 border-emerald-500"
    >
        <p className="font-semibold text-gray-800">{title}</p>
        <p className="text-sm text-gray-500">Start Lesson 1 →</p>
    </Link>
);