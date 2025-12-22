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
            <h1 className="text-4xl font-serif font-bold text-teal-800 mb-8">Our Course Catalog</h1>
            
            <p className="text-lg text-gray-600 mb-10">
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
        buttonClass = "bg-teal-600 hover:bg-teal-700";
    } else if (isPremium && !isSubscribed) {
        buttonText = "Upgrade to Unlock";
        buttonAction = () => window.location.href = '/pricing';
        buttonClass = "bg-amber-500 hover:bg-amber-600";
    } else if (isPremium && isSubscribed) {
        buttonText = "Access Course";
        buttonAction = () => alert(`Accessing ${title}!`); // Placeholder action
        buttonClass = "bg-green-600 hover:bg-green-700";
    } else { // Free course or Subscribed
        buttonText = "Start Course";
        buttonAction = () => alert(`Starting ${title}!`); // Placeholder action
        buttonClass = "bg-teal-600 hover:bg-teal-700";
    }
    
    // FIX: Update badge text color for better contrast
    const badgeColor = isPremium ? 'text-amber-600' : 'text-teal-600';

    return (
        <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-100 flex flex-col justify-between">
            <div>
                <h2 className="text-xl font-semibold text-teal-600 mb-2">{title}</h2>
                {/* FIX: Replaced low-contrast gray-400 with a brand color */}
                <p className={`text-sm font-medium mb-3 ${badgeColor}`}>{isPremium ? 'PREMIUM ACCESS' : 'FREE FOUNDATION'}</p>
                {/* FIX: Ensured description text is dark enough */}
                <p className="text-gray-700 mb-4">{description}</p>
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