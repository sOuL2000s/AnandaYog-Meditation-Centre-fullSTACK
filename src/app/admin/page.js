// src/app/admin/page.js
"use client";

import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, query, where, getDocs, doc, deleteDoc } from 'firebase/firestore';
import { useState, useEffect, useCallback } from 'react';
import { updateUserDataAdmin, updateUserLessonStatusAdmin } from '@/lib/utils';
import Link from 'next/link';

// Dummy list to map user progress keys
const TRACKED_COURSES = [
    { id: 'beginners_mind', name: "Beginner's Mind (7 Days)", totalLessons: 7 },
    { id: 'vipassana_deep_dive', name: "Vipassana Deep Dive", totalLessons: 15 },
    { id: 'hatha_flow', name: "Hatha Flow for Flexibility", totalLessons: 10 },
    { id: 'pranayama_masterclass', name: "Pranayama Masterclass", totalLessons: 12 },
    { id: 'ashtanga_ultimatum', name: "Ashtanga Yoga Ultimatum", totalLessons: 20 },
    { id: 'raja_yoga_supreme', name: "Raja Yoga Supreme", totalLessons: 8 },
];

// Component to handle individual user management
const UserManagementCard = ({ user }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [notes, setNotes] = useState(user.adminNotes || '');
    const [subscriptionExpires, setSubscriptionExpires] = useState(user.subscriptionExpires || '');
    const [isSaving, setIsSaving] = useState(false);

    const isSubscribed = user.isSubscribed;
    const accessColor = isSubscribed ? 'bg-status-success' : 'bg-status-warning';

    const handleSaveDetails = async () => {
        setIsSaving(true);
        const updateData = {
            adminNotes: notes,
            subscriptionExpires: subscriptionExpires || null,
            isSubscribed: !!subscriptionExpires && new Date(subscriptionExpires) > new Date(),
            subscriptionPlan: !!subscriptionExpires && new Date(subscriptionExpires) > new Date() ? (user.subscriptionPlan || 'Admin Granted') : null
        };

        try {
            await updateUserDataAdmin(user.uid, updateData);
            alert("User details updated successfully!");
        } catch (error) {
            console.error("Error saving user details:", error);
            alert("Failed to save user details.");
        } finally {
            setIsSaving(false);
        }
    };
    
    // Admin function to toggle lesson status
    const toggleLessonStatus = async (courseId, lessonId, isCompleted) => {
        try {
            await updateUserLessonStatusAdmin(user.uid, courseId, lessonId, !isCompleted);
        } catch (error) {
            alert(`Failed to update lesson status: ${error.message}`);
        }
    };


    const calculateProgress = (courseId) => {
        const courseData = TRACKED_COURSES.find(c => c.id === courseId);
        if (!user.progress || !courseData) return '0%';

        const lessonProgress = user.progress[courseId];
        if (!lessonProgress) return '0%';

        const completedLessons = Object.values(lessonProgress).filter(
            (lesson) => lesson.completed === true
        ).length;

        const percentage = Math.round((completedLessons / courseData.totalLessons) * 100);
        return isNaN(percentage) ? '0%' : `${percentage}%`;
    };


    return (
        <div className="bg-surface-1 p-5 rounded-xl shadow-lg border-l-4 border-brand-primary">
            <div className="flex justify-between items-center cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
                <div>
                    <h3 className="text-lg font-semibold text-text-base">{user.displayName || user.email}</h3>
                    <p className="text-sm text-text-muted">{user.uid}</p>
                </div>
                <div className="flex items-center space-x-3">
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full text-white ${accessColor}`}>
                        {isSubscribed ? `Subscribed (${user.subscriptionPlan})` : 'Free Member'}
                    </span>
                    <button className="text-brand-primary">
                        {isExpanded ? 'Collapse ▲' : 'Expand ▼'}
                    </button>
                </div>
            </div>

            {isExpanded && (
                <div className="mt-4 border-t border-gray-200 pt-4 space-y-6">
                    
                    {/* Subscription Management */}
                    <div className="p-4 bg-surface-2 rounded-lg">
                        <h4 className="font-bold text-brand-primary mb-2">Subscription Control</h4>
                        <label className="block text-sm text-text-base mb-1">
                            Set Expiration Date (ISO Format or blank to revoke)
                        </label>
                        <input
                            type="date"
                            value={subscriptionExpires ? subscriptionExpires.split('T')[0] : ''}
                            onChange={(e) => {
                                const date = e.target.value;
                                setSubscriptionExpires(date ? new Date(date).toISOString() : '');
                            }}
                            className="w-full px-3 py-2 border rounded-md"
                        />
                        <p className={`text-xs mt-1 ${isSubscribed ? 'text-status-success' : 'text-status-warning'}`}>
                            Current Status: {isSubscribed ? `Expires ${new Date(user.subscriptionExpires).toLocaleDateString()}` : 'Inactive'}
                        </p>
                    </div>

                    {/* Admin Notes/Remarks */}
                    <div>
                        <h4 className="font-bold text-brand-primary mb-2">Admin Notes (Visible on User Dashboard)</h4>
                        <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            rows="3"
                            className="w-full px-3 py-2 border rounded-md"
                            placeholder="Enter remarks for the user here..."
                        />
                    </div>
                    
                    <button
                        onClick={handleSaveDetails}
                        className="w-full bg-brand-accent text-white py-2 rounded-lg hover:bg-brand-accent-darker disabled:opacity-50 transition"
                        disabled={isSaving}
                    >
                        {isSaving ? 'Saving...' : 'Save User Details & Subscription'}
                    </button>
                    
                    {/* Progress Control */}
                    <div className="mt-6">
                        <h4 className="font-bold text-brand-primary mb-2">Course Progress Management</h4>
                        <div className="space-y-3 max-h-60 overflow-y-auto p-2 bg-surface-2 rounded-lg">
                            {TRACKED_COURSES.map(course => (
                                <CourseProgressAdmin 
                                    key={course.id} 
                                    course={course}
                                    userProgress={user.progress?.[course.id] || {}}
                                    toggleLessonStatus={toggleLessonStatus}
                                    currentProgress={calculateProgress(course.id)}
                                />
                            ))}
                        </div>
                    </div>

                </div>
            )}
        </div>
    );
};

const CourseProgressAdmin = ({ course, userProgress, toggleLessonStatus, currentProgress }) => {
    const [lessonsExpanded, setLessonsExpanded] = useState(false);
    
    return (
        <div className="border border-gray-300 rounded-md p-3">
            <div className='flex justify-between items-center'>
                <p className="text-sm font-semibold text-text-base">{course.name} <span className='text-xs text-brand-accent'>({currentProgress})</span></p>
                <button 
                    onClick={() => setLessonsExpanded(!lessonsExpanded)}
                    className="text-xs text-brand-primary hover:underline"
                >
                    {lessonsExpanded ? 'Hide Lessons' : 'Manage Lessons'}
                </button>
            </div>
            
            {lessonsExpanded && (
                <ul className='mt-2 space-y-1 text-xs bg-surface-1 p-2 rounded'>
                    {course.lessons.map(lesson => {
                        const isCompleted = userProgress[lesson.id]?.completed || false;
                        return (
                            <li key={lesson.id} className='flex justify-between items-center'>
                                <span className={isCompleted ? 'text-status-success line-through' : 'text-text-base'}>
                                    {lesson.title}
                                </span>
                                <button 
                                    onClick={() => toggleLessonStatus(course.id, lesson.id, isCompleted)}
                                    className={`ml-2 px-2 py-0.5 rounded transition ${isCompleted ? 'bg-red-200 text-red-700 hover:bg-red-300' : 'bg-green-200 text-green-700 hover:bg-green-300'}`}
                                >
                                    {isCompleted ? 'Mark Incomplete' : 'Mark Complete'}
                                </button>
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
}


export default function AdminPage() {
    const { currentUser, loading, isAdmin, theme } = useAuth();
    const [allUsers, setAllUsers] = useState([]);
    const [simulatedAccess, setSimulatedAccess] = useState('admin'); // admin, premium, free

    // 1. Fetch ALL users (requires proper Firestore security rules for production!)
    useEffect(() => {
        if (!isAdmin) return;

        const usersCol = collection(db, "users");
        
        // NOTE: Firestore doesn't provide a simple 'get all' snapshot across the entire collection 
        // without performance implications. We'll simulate fetching all user documents.
        // In a real application, pagination or cloud functions are used here.
        
        const q = query(usersCol); 

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const fetchedUsers = snapshot.docs.map(doc => {
                const data = doc.data();
                // Re-calculate isSubscribed flag for dashboard consistency
                let isSubscribed = data.isSubscribed || false;
                if (data.subscriptionExpires) {
                    const expiryDate = new Date(data.subscriptionExpires);
                    const now = new Date();
                    if (isSubscribed && expiryDate <= now) {
                        isSubscribed = false; 
                    }
                }
                
                return { 
                    uid: doc.id,
                    ...data,
                    // Note: UID is not stored in the document, but is derived from doc.id
                    email: data.email || 'N/A', // Placeholder for email (usually only available via Auth API)
                    displayName: data.displayName || 'Unnamed User',
                    isSubscribed,
                };
            });
            setAllUsers(fetchedUsers.filter(u => u.uid !== currentUser.uid)); // Exclude admin from the list
        }, (error) => {
            console.error("Error fetching all users:", error);
        });

        return () => unsubscribe();
    }, [isAdmin, currentUser]);


    if (loading) {
        return <div className="text-center py-20 text-text-muted">Loading Admin Panel...</div>;
    }

    if (!isAdmin) {
        return (
            <div className="text-center py-20">
                <h1 className="text-4xl font-serif font-bold text-red-600 mb-4">Access Denied</h1>
                <p className="text-text-muted">You must be the site administrator to access this page.</p>
                <Link href="/dashboard" className="mt-4 inline-block bg-brand-primary text-white py-2 px-6 rounded-full">Go to Dashboard</Link>
            </div>
        );
    }
    
    // --- View As Mode Logic ---
    const usersToDisplay = allUsers.length;
    const premiumCount = allUsers.filter(u => u.isSubscribed).length;
    const freeCount = usersToDisplay - premiumCount;

    return (
        <div className="container mx-auto p-8 max-w-7xl">
            <h1 className="text-4xl font-serif font-bold text-brand-primary mb-2">
                Specialized Admin Control Panel
            </h1>
            <p className="text-lg text-text-muted mb-8">
                {usersToDisplay} Total Users ({premiumCount} Premium, {freeCount} Free)
            </p>

            <div className='grid lg:grid-cols-3 gap-8'>
                
                {/* Column 1: Control & Quick Links */}
                <div className='lg:col-span-1 space-y-6'>
                    {/* View As Simulator */}
                    <div className="p-6 bg-surface-1 rounded-xl shadow-lg border-t-4 border-brand-accent">
                        <h2 className="text-xl font-bold text-brand-primary mb-3">View As Simulator</h2>
                        <div className="flex space-x-2">
                            <button 
                                onClick={() => setSimulatedAccess('admin')} 
                                className={`flex-1 py-2 rounded-lg font-semibold transition ${simulatedAccess === 'admin' ? 'bg-brand-primary text-white' : 'bg-surface-2 text-text-base hover:bg-gray-300'}`}
                            >
                                Admin View
                            </button>
                            <button 
                                onClick={() => setSimulatedAccess('premium')} 
                                className={`flex-1 py-2 rounded-lg font-semibold transition ${simulatedAccess === 'premium' ? 'bg-brand-accent text-white' : 'bg-surface-2 text-text-base hover:bg-gray-300'}`}
                            >
                                Premium User
                            </button>
                            <button 
                                onClick={() => setSimulatedAccess('free')} 
                                className={`flex-1 py-2 rounded-lg font-semibold transition ${simulatedAccess === 'free' ? 'bg-status-success text-white' : 'bg-surface-2 text-text-base hover:bg-gray-300'}`}
                            >
                                Free User
                            </button>
                        </div>
                        <p className='text-xs text-text-muted mt-3'>
                            Simulates access level for content pages (e.g., /wisdom). Current mode: <span className='font-bold uppercase'>{simulatedAccess}</span>
                        </p>
                        {simulatedAccess !== 'admin' && (
                            <Link 
                                href="/wisdom" 
                                target="_blank"
                                className="mt-3 block text-center bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600 transition"
                            >
                                Open Wisdom in New Tab ({simulatedAccess})
                            </Link>
                        )}
                    </div>
                    
                    {/* Content Management Link */}
                    <Link href="/wisdom" className="block text-center p-4 bg-brand-primary text-white font-bold rounded-lg shadow-lg hover:bg-brand-primary-darker transition">
                        Manage Wisdom Posts
                    </Link>
                    
                </div>
                
                {/* Column 2 & 3: User List */}
                <div className='lg:col-span-2 space-y-4'>
                    <h2 className="text-2xl font-serif font-bold text-brand-primary mb-4">User List & Management</h2>
                    
                    {allUsers.length === 0 ? (
                        <div className="p-8 bg-surface-2 rounded-lg text-center text-text-muted">
                            No users registered yet.
                        </div>
                    ) : (
                        allUsers.map(user => (
                            <UserManagementCard key={user.uid} user={user} />
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}

// NOTE: We need to temporarily override the access check for content viewing
// when in simulation mode. This is best done by having the content components
// check a temporary state if it existed (e.g., query params or session storage).
// Since we are limited to file output, the AdminPanel.js won't be able to easily
// update a global simulation state, so the link above is the simplest form of simulation.
