// src/app/dashboard/page.js
"use client"; 

import Link from 'next/link';
import PaymentInitiator from '@/components/PaymentInitiator'; 
import AuthStatus from '@/components/AuthStatus'; 
import { useAuth } from '@/context/AuthContext'; 

export default function DashboardPage() {
  const { currentUser, userData, loading, logout } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-pulse text-xl text-teal-600">
             Checking user status...
        </div>
      </div>
    );
  }

  // Handle NOT LOGGED IN state: Show the beautiful login UI directly
  if (!currentUser) {
    return (
        // FIX (Gap & Background): Ensures the background is fully covered and the content is centered.
        // Removed explicit bg-gray-50/dark:bg-gray-900 to rely on global theme background CSS variable.
        <div className="flex items-center justify-center h-full min-h-[calc(100vh-5rem)] p-4 transition-colors duration-300">
            <div className="w-full max-w-md p-8 sm:p-10 text-center bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border-t-4 border-teal-500 transform transition duration-500 hover:shadow-3xl">
                <h1 className="text-4xl font-serif font-bold text-teal-800 dark:text-teal-300 mb-4">
                    Access Your Sanctuary
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-400 mb-10">
                    Sign in with Google to manage your account and begin your practice.
                </p>
                {/* Use AuthStatus here to present the login UI */}
                <AuthStatus />
            </div>
        </div>
    );
  }

  // Determine access level
  const isSubscribed = userData?.isSubscribed;
  const currentPlan = userData?.subscriptionPlan || 'Explorer (Free Tier)';
  const expirationDate = userData?.subscriptionExpires ? 
    new Date(userData.subscriptionExpires).toLocaleDateString() : 'N/A';

  const accessColor = isSubscribed ? 'text-green-600' : 'text-amber-600'; 
  const accessBorderColor = isSubscribed ? 'border-green-500' : 'border-amber-500';

  return (
    <div className="container mx-auto p-8 max-w-6xl">
      <h1 className="text-4xl font-serif font-bold text-teal-800 mb-2">
        Welcome Back, {currentUser?.displayName?.split(' ')[0] || 'Yogi'}!
      </h1>
      <p className="text-lg text-gray-600 mb-8">
        Manage your path to Ananda (Bliss).
      </p>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Column 1: Status & Logout */}
        <div className="lg:col-span-1 space-y-8">
            {/* Subscription Status Card - VISIBILITY FIXED */}
            <div className={`bg-white p-6 rounded-lg shadow-2xl border-l-4 ${accessBorderColor} `}>
                <h2 className="text-2xl font-semibold mb-3 text-gray-800">Membership Status</h2>
                <p className="text-md text-gray-700">
                  Plan: 
                  <span className={`font-bold ml-2 ${accessColor}`}>
                    {currentPlan}
                  </span>
                </p>
                {isSubscribed && (
                    <p className="text-sm text-gray-500 mt-2">
                        Expires: {expirationDate}
                    </p>
                )}
                {!isSubscribed && (
                    <p className="text-sm text-amber-600 font-medium mt-3">
                        Upgrade now to unlock all premium courses.
                    </p>
                )}
            </div>
            
            {/* Usage/Progress Placeholder */}
            <div className="p-6 bg-gray-100 rounded-lg shadow-inner">
                <h3 className="text-xl font-serif font-bold text-teal-700 mb-4">Your Progress</h3>
                <ul className="space-y-2 text-gray-600">
                    <li className="flex justify-between items-center text-sm">
                        <span>Beginner&apos;s Mind</span> 
                        <span className="text-teal-600 font-medium">75% Complete</span>
                    </li>
                    <li className="flex justify-between items-center text-sm">
                        <span>Hatha Flow</span> 
                        <span className="text-teal-600 font-medium">Recently Visited</span>
                    </li>
                    {/* FIX: Changed text-gray-400 to text-gray-500 for slight improvement */}
                    <li className="text-xs text-gray-500 pt-2">
                        *Note: Full usage tracking implementation requires backend persistence (database updates on lesson completion).
                    </li>
                </ul>
            </div>

            {/* Logout Section */}
            <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
                <button
                    onClick={logout}
                    className="w-full bg-red-600 text-white font-bold py-2 rounded-lg hover:bg-red-700 transition"
                >
                    Logout
                </button>
            </div>
        </div>

        {/* Column 2 & 3: Payment & Protected Content */}
        <div className="lg:col-span-2 space-y-8">
            
            {/* Payment Options (Show only if NOT subscribed) */}
            {!isSubscribed && (
                <div className="space-y-6">
                    <h2 className="text-3xl font-serif font-bold text-teal-800 mb-4">Select Your Subscription</h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        <PaymentInitiator 
                            planName="Yogi Monthly" 
                            amount={500} 
                            description="Unlimited access, billed monthly." 
                        />
                        <PaymentInitiator 
                            planName="Yogi Annual" 
                            amount={4800} 
                            description="Unlimited access, billed yearly (2 months free)." 
                            isAnnual={true}
                        />
                    </div>
                </div>
            )}


            {/* Protected Content Section */}
            <div className="p-8 bg-white rounded-lg shadow-xl border-t-4 border-teal-500">
                <h2 className="text-2xl font-serif font-bold mb-5 text-teal-700">Your Course Library</h2>
                
                {isSubscribed ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <CourseLink title="Mastering Vipassana: 30 Day Series" href="/courses/vipassana" />
                        <CourseLink title="Hatha Flow for Flexibility" href="/courses/hatha-flow" />
                        <CourseLink title="Pranayama Fundamentals" href="/courses/pranayama" />
                        <CourseLink title="Guided Sleep Audio Archive" href="/courses/sleep-audio" />
                    </div>
                ) : (
                    <div className="text-center p-8 bg-gray-50 border-2 border-dashed border-amber-300 rounded-lg">
                        <p className="text-xl text-amber-600 font-medium mb-4">
                            Upgrade Required: Full library access is currently locked.
                        </p>
                        <p className="text-gray-500">
                            View the 5 free introductory videos in the Classes section.
                        </p>
                        <Link href="/pricing" className="mt-4 inline-block text-teal-600 hover:underline">
                            View Subscription Plans →
                        </Link>
                    </div>
                )}
            </div>
        </div>
      </div> {/* End Grid */}
    </div>
  );
}

const CourseLink = ({ title, href }) => (
    <Link 
        href={href} 
        className="block p-4 bg-gray-50 rounded-lg shadow-sm hover:bg-teal-50 transition duration-200 border-l-4 border-teal-500"
    >
        <p className="font-semibold text-gray-800">{title}</p>
        {/* FIX: Changed low-contrast text-gray-500 to text-gray-600 */}
        <p className="text-sm text-gray-600">Start Lesson 1 →</p>
    </Link>
);