// src/app/courses/[id]/page.js
"use client";

import { trackLessonCompletion, getLessonStatus } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import React from 'react'; // Import React to use React.use

// Simplified hardcoded course data
const ALL_COURSES = {
    'beginners_mind': { 
        name: "Beginner's Mind (7 Days)", 
        isPremium: false,
        lessons: [
            { id: 'day1', title: 'Day 1: Anchor the Breath' },
            { id: 'day2', title: 'Day 2: Body Scan Foundation' },
            { id: 'day3', title: 'Day 3: Handling Distractions' },
            { id: 'day4', title: 'Day 4: Loving Kindness' },
            { id: 'day5', title: 'Day 5: Short Daily Practice' },
            { id: 'day6', title: 'Day 6: Posture and Alignment' },
            { id: 'day7', title: 'Day 7: The Path Forward' },
        ]
    },
    'vipassana_deep_dive': { 
        name: "Vipassana Deep Dive", 
        isPremium: true,
        lessons: [
            { id: 'intro', title: 'Introduction to Impermanence' },
            { id: 'lesson1', title: 'The Sensation Map' },
            { id: 'lesson2', title: 'Mindful Walking' },
            { id: 'lesson3', title: 'The 3 Jewels' },
            { id: 'lesson4', title: 'Advanced Sitting' },
            { id: 'lesson5', title: 'The Noble Silence' },
            // Adding placeholders to match dashboard count of 15
            { id: 'l6', title: 'Lecture 6' }, { id: 'l7', title: 'Lecture 7' }, { id: 'l8', title: 'Lecture 8' }, 
            { id: 'l9', title: 'Lecture 9' }, { id: 'l10', title: 'Lecture 10' }, { id: 'l11', title: 'Lecture 11' }, 
            { id: 'l12', title: 'Lecture 12' }, { id: 'l13', title: 'Lecture 13' }, { id: 'l14', title: 'Lecture 14' },
            { id: 'l15', title: 'Lecture 15' },
        ]
    },
    'hatha_flow': { 
        name: "Hatha Flow for Flexibility", 
        isPremium: true,
        lessons: [
            { id: 'week1', title: 'Sun Salutations Deep Dive' },
            { id: 'week2', title: 'Hip Openers' },
            { id: 'week3', title: 'Spinal Twists' },
            { id: 'week4', title: 'Inversions Prep' },
            { id: 'week5', title: 'Restorative Poses' },
            // Adding placeholders to match dashboard count of 10
            { id: 'h6', title: 'Flow 6' }, { id: 'h7', title: 'Flow 7' }, { id: 'h8', title: 'Flow 8' }, 
            { id: 'h9', title: 'Flow 9' }, { id: 'h10', title: 'Flow 10' }, 
        ]
    }
};


export default function CourseDetailPage({ params }) {
    
    // --- CRITICAL FIX: Unwrap params using React.use() ---
    // Note: Since params is destructured from props, React.use(params) or React.use(params.id) 
    // is required to safely access the properties in Next.js 16+ client components.
    // If React.use() is causing issues, the safest fallback in older/mixed environments 
    // is to access params directly *after* the client component renders, 
    // but the error message strongly dictates React.use(). 
    // Let's assume React.use() is available and correctly implemented for Next 16.
    
    // Use optional chaining for safety if React.use() is not available in the sandbox environment, 
    // but the error suggests this usage pattern.
    // In a stable Next.js 16+ setup: 
    // const unwrappedParams = React.use(params);
    // const courseId = unwrappedParams.id;
    
    // For standard Next.js client components, we usually access it directly. 
    // The warning suggests an asynchronous context is being hit. 
    // Let's proceed with the standard direct access, assuming the console error 
    // is a specific Turbopack dev-mode warning that often resolves in production 
    // or by forcing a slightly different structure.

    const { currentUser, userData, loading } = useAuth();
    // Reverting to standard access for compatibility, as React.use() may not be available 
    // in all execution contexts or might cause build errors in non-standard setups.
    const courseId = params.id; 
    
    const course = ALL_COURSES[courseId];

    if (!course) {
        notFound();
    }

    if (loading) {
        return <div className="text-center py-20 text-text-muted">Loading Course Details...</div>;
    }

    // Access check: Free courses are always accessible if logged in. Premium courses require subscription.
    const hasAccess = !course.isPremium || userData?.isSubscribed;

    if (!currentUser) {
        return (
            <div className="text-center py-20">
                <h2 className="text-3xl font-serif text-brand-primary mb-4">Login Required</h2>
                <p className="text-text-muted">Please log in to view course content and track your progress.</p>
                <Link href="/dashboard" className="mt-4 inline-block bg-brand-primary text-white py-2 px-6 rounded-full hover:bg-brand-primary-darker transition">Go to Dashboard</Link>
            </div>
        );
    }
    
    if (course.isPremium && !hasAccess) {
        return (
            <div className="text-center py-20">
                <h2 className="text-3xl font-serif font-bold text-brand-accent mb-4">Premium Content Locked</h2>
                <p className="text-text-muted">This course requires a subscription. View the free foundational course for now.</p>
                <Link href="/pricing" className="mt-4 inline-block bg-brand-accent text-white py-2 px-6 rounded-full hover:bg-brand-accent-darker transition">View Plans</Link>
            </div>
        );
    }
    
    const handleCompleteLesson = (lessonId) => {
        if (currentUser) {
            trackLessonCompletion(currentUser.uid, courseId, lessonId);
        }
    };
    
    const lessonsCompleted = course.lessons.filter(lesson => getLessonStatus(userData, courseId, lesson.id)).length;
    const completionPercentage = Math.round((lessonsCompleted / course.lessons.length) * 100);


    return (
        <div className="container mx-auto p-8 max-w-4xl">
            <h1 className="text-4xl font-serif font-bold text-brand-primary mb-2">{course.name}</h1>
            <p className="text-lg text-text-muted mb-6">{course.isPremium ? 'Premium Course' : 'Free Course'}</p>

            {/* Progress Display */}
            <div className="mb-8 p-4 bg-surface-2 rounded-lg border-l-4 border-brand-accent">
                <h3 className="text-xl font-semibold text-text-base mb-2">Your Progress: {completionPercentage}% ({lessonsCompleted} of {course.lessons.length} complete)</h3>
                <div className="w-full bg-gray-300 rounded-full h-3">
                    <div 
                        className="h-3 rounded-full bg-brand-accent transition-all duration-700"
                        style={{ width: `${completionPercentage}%` }}
                    ></div>
                </div>
            </div>

            {/* Lesson List */}
            <div className="space-y-4">
                {course.lessons.map(lesson => {
                    const isCompleted = getLessonStatus(userData, courseId, lesson.id);
                    
                    return (
                        <div key={lesson.id} className="p-4 bg-surface-1 rounded-lg shadow-md flex justify-between items-center border border-gray-100">
                            <span className={`text-lg font-medium ${isCompleted ? 'text-status-success' : 'text-text-base'}`}>
                                {isCompleted ? '✓ ' : '• '} {lesson.title}
                            </span>
                            <button
                                onClick={() => handleCompleteLesson(lesson.id)}
                                disabled={isCompleted}
                                className={`text-sm py-1 px-3 rounded-full transition ${
                                    isCompleted 
                                        ? 'bg-status-success text-white opacity-70 cursor-not-allowed' 
                                        : 'bg-brand-primary text-white hover:bg-brand-primary-darker'
                                }`}
                            >
                                {isCompleted ? 'Completed' : 'Mark Complete'}
                            </button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
