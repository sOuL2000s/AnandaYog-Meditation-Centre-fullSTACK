// src/app/classes/page.js
"use client";

import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

// Define the courses with IDs and lesson counts for tracking
const COURSE_DEFINITIONS = [
    { 
        id: 'beginners_mind', 
        title: "Beginner's Mind (7 Days)", 
        description: "An introductory course covering breathwork and foundational sitting techniques.",
        isPremium: false,
        icon: '🧘'
    },
    { 
        id: 'vipassana_deep_dive', 
        title: "Vipassana Deep Dive", 
        description: "Advanced silent meditation techniques for experienced practitioners (15 lessons).",
        isPremium: true,
        icon: '👁️'
    },
    { 
        id: 'hatha_flow', 
        title: "Hatha Flow for Flexibility", 
        description: "Weekly guided sessions focusing on core strength and deep relaxation (10 weeks).",
        isPremium: true,
        icon: '🤸'
    },
    // --- NEW COURSES ADDED ---
    { 
        id: 'pranayama_masterclass', 
        title: "Pranayama Masterclass", 
        description: "12 detailed lessons on vital breath control techniques for energy management.",
        isPremium: true,
        icon: '🌬️'
    },
    { 
        id: 'ashtanga_ultimatum', 
        title: "Ashtanga Yoga Ultimatum", 
        description: "20-week intensive program mastering the Primary Series (Vinyasa and Drishti).",
        isPremium: true,
        icon: '🔥'
    },
    { 
        id: 'raja_yoga_supreme', 
        title: "Raja Yoga Supreme", 
        description: "8-part philosophical and practical study of Patanjali's Yoga Sutras.",
        isPremium: true,
        icon: '👑'
    },
];

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
                {COURSE_DEFINITIONS.map(course => (
                    <CourseCard 
                        key={course.id}
                        {...course}
                        isSubscribed={isSubscribed}
                        currentUser={currentUser}
                        login={login}
                        loading={loading}
                    />
                ))}
            </div>
            
            <div className="mt-16 text-center">
                <h2 className="text-3xl font-serif font-bold text-brand-primary mb-4">Beyond Courses</h2>
                <Link 
                    href="/gita"
                    className="inline-flex items-center bg-surface-2 text-brand-primary font-bold text-lg py-3 px-8 rounded-lg hover:bg-brand-primary-light transition duration-300 shadow-lg"
                >
                    📖 Read the Bhagavad Gita (Multi-Language) →
                </Link>
            </div>
        </div>
    );
}

const CourseCard = ({ id, title, description, isPremium, isSubscribed, currentUser, login, loading, icon }) => {
    let buttonContent, linkHref, isButtonAction = false;

    if (loading) {
        buttonContent = "Checking Access...";
        linkHref = "#";
    }
    else if (!currentUser) {
        buttonContent = "Login to Enroll";
        linkHref = "#"; // Use action button to trigger login
        isButtonAction = true;
    } else if (isPremium && !isSubscribed) {
        buttonContent = "Upgrade to Unlock";
        linkHref = '/pricing';
    } else { // Free course or Subscribed
        buttonContent = "Start Course";
        linkHref = `/courses/${id}`; // Actual course link
    }
    
    const badgeColor = isPremium ? 'text-brand-accent' : 'text-brand-primary';
    const buttonClass = (isPremium && !isSubscribed) 
        ? "bg-brand-accent hover:bg-brand-accent-darker"
        : "bg-brand-primary hover:bg-brand-primary-darker";

    const Content = (
        <button 
            className={`w-full text-white py-2 rounded-lg transition shadow-md ${buttonClass}`}
            disabled={loading}
            onClick={() => { if (isButtonAction) login(); }} // Trigger login if it's a non-link action
        >
            {buttonContent}
        </button>
    );
    
    return (
        <div className="bg-surface-1 p-6 rounded-lg shadow-lg border border-gray-100 flex flex-col justify-between">
            <div>
                <div className="text-3xl mb-2">{icon}</div>
                <h2 className="text-xl font-semibold text-brand-primary mb-2">{title}</h2>
                <p className={`text-sm font-medium mb-3 ${badgeColor}`}>{isPremium ? 'PREMIUM ACCESS' : 'FREE FOUNDATION'}</p>
                <p className="text-text-base mb-4">{description}</p>
            </div>
            
            {(linkHref !== "#" && !isButtonAction) ? (
                 <Link href={linkHref}>
                    {Content}
                 </Link>
            ) : (
                Content 
            )}
        </div>
    );
};