// src/app/account/page.js
"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import AuthStatus from '@/components/AuthStatus'; 

export default function AccountPage() {
    const { currentUser, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        // If the user is logged in, immediately redirect them to their dashboard
        if (!loading && currentUser) {
            router.replace('/dashboard');
        }
    }, [currentUser, loading, router]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-96">
                <p className="text-xl text-gray-500">Checking user status...</p>
            </div>
        );
    }
    
    if (currentUser) {
        // This is only shown for a split second before the redirect in useEffect fires
        return (
            <div className="flex justify-center items-center h-96">
                <p className="text-xl text-indigo-600">Redirecting to Dashboard...</p>
            </div>
        );
    }

    // If not logged in, show the login interface
    return (
        <div className="container mx-auto p-8 sm:p-12 flex justify-center">
            <div className="w-full max-w-md">
                <h1 className="text-3xl font-serif font-bold text-center text-indigo-800 mb-6">
                    Log In or Create Account
                </h1>
                <p className="text-center text-gray-600 mb-8">
                    Access your courses, payment history, and profile settings.
                </p>
                {/* AuthStatus already contains the Google Login button logic */}
                <AuthStatus />
            </div>
        </div>
    );
}
