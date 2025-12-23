// src/app/courses/[id]/page.js
// NO "use client" directive here! This is a Server Component.

import { notFound } from 'next/navigation';
import CourseContent from '@/components/CourseContent';

// Simplified hardcoded course data (Used here only for existence check)
const ALL_COURSES = {
    'beginners_mind': {},
    'vipassana_deep_dive': {},
    'hatha_flow': {},
    'pranayama_masterclass': {},
    'ashtanga_ultimatum': {},
    'raja_yoga_supreme': {},
};


// Made the component async to handle asynchronous parameters
export default async function CourseDetailPage({ params }) {
    
    // --- CRITICAL FIX: Explicitly await the params object ---
    // This is necessary because the framework is proxying 'params' as a Promise
    // even in an async function context in your specific version/setup (Next 16.1.0/Turbopack).
    const resolvedParams = await params;
    const courseId = resolvedParams.id;
    // --------------------------------------------------------
    
    const courseExists = ALL_COURSES.hasOwnProperty(courseId);

    if (!courseExists) {
        notFound();
    }
    
    // Pass the safely retrieved ID to the client component
    return (
        <CourseContent courseId={courseId} />
    );
}