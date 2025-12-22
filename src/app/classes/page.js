// src/app/classes/page.js
"use client";

import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

export default function ClassesPage() {
    // Extracted 'loading' correctly from useAuth()
    const { currentUser, userData, loading, login } = useAuth(); 
    const isSubscribed = userData?.isSubscribed;

    return (
        <div className="container mx-auto p-8">
            <h1 className="text-4xl font-serif font-bold text-brand-primary mb-8">Our Course Catalog</h1>
            
            <p className="text-lg text-text-muted mb-10">
                {isSubscribed 
                    ? "Welcome! You have full access to all courses listed below."
                    : "Access limited foundational content. Subscribe now for the full catalog."
                }
            </p>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Example Course 1 */}
                <CourseCard 
                    title="Beginner's Mind (7 Days)" 
                    description="An introductory course covering breathwork and foundational sitting techniques."
                    isPremium={false}
                    isSubscribed={isSubscribed}
                    currentUser={currentUser}
                    login={login}
                    loading={loading} // <-- FIX 1: Pass loading state
                />
                
                {/* Example Course 2 (Premium) */}
                <CourseCard 
                    title="Vipassana Deep Dive" 
                    description="Advanced silent meditation techniques for experienced practitioners."
                    isPremium={true}
                    isSubscribed={isSubscribed}
                    currentUser={currentUser}
                    login={login}
                    loading={loading} // <-- FIX 1: Pass loading state
                />
                
                {/* Example Course 3 (Premium) */}
                <CourseCard 
                    title="Hatha Flow for Flexibility" 
                    description="Weekly guided sessions focusing on core strength and deep relaxation."
                    isPremium={true}
                    isSubscribed={isSubscribed}
                    currentUser={currentUser}
                    login={login}
                    loading={loading} // <-- FIX 1: Pass loading state
                />
            </div>
        </div>
    );
}

// FIX 2: Accept 'loading' as a prop
const CourseCard = ({ title, description, isPremium, isSubscribed, currentUser, login, loading }) => {
    let buttonText, buttonAction, buttonClass;

    if (loading) {
        buttonText = "Checking Access...";
        buttonClass = "bg-gray-400";
        buttonAction = () => {};
    }
    else if (!currentUser) {
        buttonText = "Login to Enroll";
        buttonAction = login;
        buttonClass = "bg-brand-primary hover:bg-brand-primary-darker";
    } else if (isPremium && !isSubscribed) {
        buttonText = "Upgrade to Unlock";
        buttonAction = () => window.location.href = '/pricing';
        buttonClass = "bg-brand-accent hover:bg-brand-accent-darker";
    } else if (isPremium && isSubscribed) {
        buttonText = "Access Course";
        buttonAction = () => alert(`Accessing ${title}!`); // Placeholder action
        buttonClass = "bg-status-success hover:bg-green-700";
    } else { // Free course or Subscribed
        buttonText = "Start Course";
        buttonAction = () => alert(`Starting ${title}!`); // Placeholder action
        buttonClass = "bg-brand-primary hover:bg-brand-primary-darker";
    }
    
    // FIX: Update badge text color for better contrast
    const badgeColor = isPremium ? 'text-brand-accent' : 'text-brand-primary';

    return (
        // Refactored background to Surface 1
        <div className="bg-surface-1 p-6 rounded-lg shadow-lg border border-gray-100 flex flex-col justify-between">
            <div>
                <h2 className="text-xl font-semibold text-brand-primary mb-2">{title}</h2>
                <p className={`text-sm font-medium mb-3 ${badgeColor}`}>{isPremium ? 'PREMIUM ACCESS' : 'FREE FOUNDATION'}</p>
                <p className="text-text-base mb-4">{description}</p>
            </div>
            <button 
                onClick={buttonAction}
                className={`w-full text-white py-2 rounded-lg transition ${buttonClass}`}
                disabled={loading} // `loading` is now available
            >
                {buttonText}
            </button>
        </div>
    );
};