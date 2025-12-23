// src/components/CourseContent.js
"use client";

import { trackLessonCompletion, getLessonStatus } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { useState, useMemo } from 'react'; 

// NOTE: Duplicated course data required for client-side rendering logic
const ALL_COURSES = {
    'beginners_mind': { 
        name: "Beginner's Mind (7 Days)", 
        isPremium: false,
        lessons: [
            { id: 'day1', title: 'Day 1: Anchor the Breath' }, { id: 'day2', title: 'Day 2: Body Scan Foundation' }, { id: 'day3', title: 'Day 3: Handling Distractions' },
            { id: 'day4', title: 'Day 4: Loving Kindness' }, { id: 'day5', title: 'Day 5: Short Daily Practice' }, { id: 'day6', title: 'Day 6: Posture and Alignment' },
            { id: 'day7', title: 'Day 7: The Path Forward' },
        ]
    },
    'vipassana_deep_dive': { 
        name: "Vipassana Deep Dive", 
        isPremium: true,
        lessons: [
            { id: 'intro', title: 'Introduction to Impermanence' }, { id: 'lesson1', title: 'The Sensation Map' }, { id: 'lesson2', title: 'Mindful Walking' },
            { id: 'lesson3', title: 'The 3 Jewels' }, { id: 'lesson4', title: 'Advanced Sitting' }, { id: 'lesson5', title: 'The Noble Silence' },
            { id: 'l6', title: 'Lecture 6: Equanimity' }, { id: 'l7', title: 'Lecture 7: The Eightfold Path' }, { id: 'l8', title: 'Lecture 8: Ethical Living' }, 
            { id: 'l9', title: 'Lecture 9: Deepening Concentration' }, { id: 'l10', title: 'Lecture 10: Subtle Sensations' }, { id: 'l11', title: 'Lecture 11: Dissolution' }, 
            { id: 'l12', title: 'Lecture 12: Continuous Practice' }, { id: 'l13', title: 'Lecture 13: Handling Pain' }, { id: 'l14', title: 'Lecture 14: Integrating Insight' },
            { id: 'l15', title: 'Lecture 15: Concluding Remarks' },
        ]
    },
    'hatha_flow': { 
        name: "Hatha Flow for Flexibility", 
        isPremium: true,
        lessons: [
            { id: 'week1', title: 'Sun Salutations Deep Dive' }, { id: 'week2', title: 'Hip Openers' }, { id: 'week3', title: 'Spinal Twists' },
            { id: 'week4', title: 'Inversions Prep' }, { id: 'week5', title: 'Restorative Poses' },
            { id: 'h6', title: 'Flow 6: Core Stability' }, { id: 'h7', title: 'Flow 7: Standing Poses' }, { id: 'h8', title: 'Flow 8: Backbends' }, 
            { id: 'h9', title: 'Flow 9: Balancing Act' }, { id: 'h10', title: 'Flow 10: Full Body Release' }, 
        ]
    },
    'pranayama_masterclass': {
        name: "Pranayama Masterclass", isPremium: true, lessons: Array.from({ length: 12 }, (_, i) => ({ id: `p${i+1}`, title: `Lesson ${i+1}: Technique ${i+1}`}))
    },
    'ashtanga_ultimatum': {
        name: "Ashtanga Yoga Ultimatum", isPremium: true, lessons: Array.from({ length: 20 }, (_, i) => ({ id: `a${i+1}`, title: `Week ${i+1} Flow Focus`}))
    },
    'raja_yoga_supreme': {
        name: "Raja Yoga Supreme", isPremium: true, lessons: Array.from({ length: 8 }, (_, i) => ({ id: `r${i+1}`, title: `Sutra ${i+1}: Practice Focus`}))
    },
};


export default function CourseContent({ courseId }) {
    
    // --- 1. CALL ALL HOOKS UNCONDITIONALLY AT THE TOP ---
    const { currentUser, userData, loading } = useAuth();
    const [forceRerenderKey, setForceRerenderKey] = useState(0); 

    // Fetch the course data immediately
    const course = ALL_COURSES[courseId]; 
    
    // Calculate progress (This must be done here, but simplify dependencies)
    // The forceRerenderKey is now the mechanism to trigger a recalculation when the user saves progress.
    const { completionPercentage, lessonsCompleted } = useMemo(() => {
        if (!course || !userData) {
            return { completionPercentage: 0, lessonsCompleted: 0 };
        }
        
        const completed = course.lessons.filter(lesson => getLessonStatus(userData, courseId, lesson.id)).length;
        const percentage = Math.round((completed / course.lessons.length) * 100);
        return { completionPercentage: percentage, lessonsCompleted: completed };
    }, [userData, courseId, course]); // Simplified dependencies: userData (from context), courseId (prop), course (local data)
    // ----------------------------------------------------------------------


    const hasAccess = !course.isPremium || userData?.isSubscribed;

    // --- 2. CONDITIONAL EARLY RETURNS FOLLOW ---

    if (loading) {
        return <div className="text-center py-20 text-text-muted">Loading Course Details...</div>;
    }

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
    
    // --- 3. INTERACTION LOGIC (Now correctly defined) ---
    const handleCompleteLesson = async (lessonId) => { 
        if (currentUser) {
             console.log(`[Client] Initiating completion track for: ${courseId}/${lessonId}`);
             
             // Await the completion of the Firebase write
             await trackLessonCompletion(currentUser.uid, courseId, lessonId);

             // **CRITICAL FIX:** Force a local state update immediately after the successful write.
             // This ensures the component re-renders quickly, pulling the updated userData 
             // from the AuthContext (which received the onSnapshot event).
             setForceRerenderKey(prev => prev + 1); 
             
             console.log("[Client] Rerender forced.");
        }
    };
    

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