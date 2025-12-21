// src/app/account/page.js
"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
// Note: This file is kept only for completeness in the file list, 
// but functionally it is now unused/redundant as /dashboard handles the logic.

export default function AccountPage() {
    const { currentUser, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        // Always redirect to dashboard, which now contains the login/logout logic.
        if (!loading) {
            router.replace('/dashboard');
        }
    }, [loading, router]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-96">
                <p className="text-xl text-gray-500">Checking user status...</p>
            </div>
        );
    }
    
    // Fallback if redirection is slow
    return (
        <div className="flex justify-center items-center h-96">
            <p className="text-xl text-teal-600">Redirecting to Dashboard...</p>
        </div>
    );
}