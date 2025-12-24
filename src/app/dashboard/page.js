// src/app/dashboard/page.js
"use client"; 

import Link from 'next/link';
import PaymentInitiator from '@/components/PaymentInitiator'; 
import AuthStatus from '@/components/AuthStatus'; 
import { useAuth } from '@/context/AuthContext'; 
import AdminPanel from '@/components/AdminPanel'; // Import Admin Panel

// Define hardcoded course list for dashboard progress display (must match IDs in src/app/courses/[id]/page.js)
const TRACKED_COURSES = [
    { id: 'beginners_mind', name: "Beginner's Mind (7 Days)", totalLessons: 7, isPremium: false },
    { id: 'vipassana_deep_dive', name: "Vipassana Deep Dive", totalLessons: 15, isPremium: true },
    { id: 'hatha_flow', name: "Hatha Flow for Flexibility", totalLessons: 10, isPremium: true },
    { id: 'pranayama_masterclass', name: "Pranayama Masterclass", totalLessons: 12, isPremium: true },
    { id: 'ashtanga_ultimatum', name: "Ashtanga Yoga Ultimatum", totalLessons: 20, isPremium: true },
    { id: 'raja_yoga_supreme', name: "Raja Yoga Supreme", totalLessons: 8, isPremium: true },
];


export default function DashboardPage() {
  const { currentUser, userData, loading, logout, isAdmin } = useAuth(); // Added isAdmin

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-pulse text-xl text-brand-primary">
             Checking user status...
        </div>
      </div>
    );
  }

  // Handle NOT LOGGED IN state: Show the beautiful login UI directly
  if (!currentUser) {
    return (
        // FIX (Gap & Background): Ensures the background is fully covered and the content is centered.
        // Refactored background to Surface 1 and border to Primary
        <div className="flex items-center justify-center h-full min-h-[calc(100vh-5rem)] p-4 transition-colors duration-300">
            <div className="w-full max-w-md p-8 sm:p-10 text-center bg-surface-1 rounded-2xl shadow-2xl border-t-4 border-brand-primary transform transition duration-500 hover:shadow-3xl">
                {/* Refactored text color */}
                <h1 className="text-4xl font-serif font-bold text-brand-primary mb-4">
                    Access Your Sanctuary
                </h1>
                <p className="text-lg text-text-muted mb-10">
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
  
  // FIX: Added logic to calculate remaining days
  let daysRemaining = 'N/A';
  if (isSubscribed && userData?.subscriptionExpires) {
      const expiryDate = new Date(userData.subscriptionExpires);
      const now = new Date();
      const diffTime = expiryDate - now; // Time difference in milliseconds
      
      if (diffTime > 0) {
          daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      } else {
          daysRemaining = 0; // Subscription is technically expired but we still show the date
      }
  }
  
  const expirationDate = userData?.subscriptionExpires ? 
    new Date(userData.subscriptionExpires).toLocaleDateString() : 'N/A';

  // Use standard Tailwind colors for status indicators for clear differentiation
  const accessColor = isSubscribed ? 'text-green-600' : 'text-amber-600'; 
  const accessBorderColor = isSubscribed ? 'border-green-500' : 'border-amber-500';

  // Calculate progress for display
  const getUserProgress = (courseId) => {
    const courseData = TRACKED_COURSES.find(c => c.id === courseId);
    if (!userData?.progress || !courseData) return '0%';

    const lessonProgress = userData.progress[courseId];
    if (!lessonProgress) return '0%';

    // Calculate completed lessons by counting entries that have 'completed: true'
    const completedLessons = Object.values(lessonProgress).filter(
        (lesson) => lesson.completed === true
    ).length;

    const percentage = Math.round((completedLessons / courseData.totalLessons) * 100);
    return isNaN(percentage) ? '0%' : `${percentage}%`;
  };
  
  // Determine accessible courses based on subscription status
  const accessibleCourses = TRACKED_COURSES.filter(course => !course.isPremium || isSubscribed);
  const freeCourses = TRACKED_COURSES.filter(course => !course.isPremium);

  return (
    <div className="container mx-auto p-8 max-w-6xl">
      <h1 className="text-4xl font-serif font-bold text-brand-primary mb-2">
        Welcome Back, {currentUser?.displayName?.split(' ')[0] || 'Yogi'}!
      </h1>
      <p className="text-lg text-text-muted mb-8">
        Manage your path to Ananda (Bliss).
      </p>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Column 1: Status & Logout */}
        <div className="lg:col-span-1 space-y-8">
            {/* Subscription Status Card - Refactored background to Surface 1 */}
            <div className={`bg-surface-1 p-6 rounded-lg shadow-2xl border-l-4 ${accessBorderColor} `}>
                <h2 className="text-2xl font-semibold mb-3 text-text-base">Membership Status</h2>
                <p className="text-md text-text-base">
                  Plan: 
                  <span className={`font-bold ml-2 ${accessColor}`}>
                    {currentPlan}
                  </span>
                </p>
                {isSubscribed && (
                    <>
                        <p className="text-sm text-text-muted mt-2">
                            Expires: {expirationDate}
                        </p>
                        <p className={`text-sm font-medium mt-1 ${daysRemaining > 7 ? 'text-status-success' : 'text-status-warning'}`}>
                            Days Remaining: {daysRemaining}
                        </p>
                    </>
                )}
                {!isSubscribed && (
                    <p className="text-sm text-status-warning font-medium mt-3">
                        Subscription Expired or Inactive. Renew now to unlock all premium courses.
                    </p>
                )}
            </div>
            
            {/* Usage/Progress Placeholder - NOW DYNAMICALLY TRACKED */}
            <div className="p-6 bg-surface-2 rounded-lg shadow-inner">
                <h3 className="text-xl font-serif font-bold text-brand-primary mb-4">Your Course Progress</h3>
                <ul className="space-y-3 text-text-base">
                    {TRACKED_COURSES.map(course => {
                        const isAccessible = !course.isPremium || isSubscribed;
                        const progress = getUserProgress(course.id);
                        const progressValue = parseInt(progress.replace('%', ''), 10);

                        return (
                            <li key={course.id}>
                                <div className="flex justify-between items-center text-sm mb-1">
                                    <span>{course.name}</span> 
                                    <span className={`font-medium ${isAccessible ? 'text-brand-primary' : 'text-text-muted'}`}>
                                        {isAccessible ? progress : 'LOCKED'}
                                    </span>
                                </div>
                                {/* Progress Bar */}
                                <div className="w-full bg-gray-300 rounded-full h-2">
                                    <div 
                                        className={`h-2 rounded-full transition-all duration-700 ${isAccessible ? 'bg-brand-accent' : 'bg-gray-400'}`}
                                        style={{ width: `${progressValue}%` }}
                                    ></div>
                                </div>
                            </li>
                        );
                    })}
                </ul>
                <li className="text-xs text-text-muted pt-4">
                    Progress tracked in real-time upon lesson completion.
                </li>
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
            
            {/* Admin Link */}
            {isAdmin && (
                <Link href="/wisdom" className="block text-center p-4 bg-brand-accent text-white font-bold rounded-lg shadow-lg hover:bg-brand-accent-darker transition">
                    ★ Go to Admin Wisdom Portal
                </Link>
            )}
        </div>

        {/* Column 2 & 3: Payment & Protected Content */}
        <div className="lg:col-span-2 space-y-8">
            
            {/* Payment Options (Show only if NOT subscribed) */}
            {!isSubscribed && (
                <div className="space-y-6">
                    <h2 className="text-3xl font-serif font-bold text-brand-primary mb-4">Select Your Subscription</h2>
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


            {/* Protected Content Section - Refactored background and border */}
            <div className="p-8 bg-surface-1 rounded-lg shadow-xl border-t-4 border-brand-primary">
                <h2 className="text-2xl font-serif font-bold mb-5 text-brand-primary">Your Course Library</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Free Content (Always Available) */}
                    {freeCourses.map(course => (
                        <CourseLink 
                            key={course.id} 
                            title={course.name} 
                            href={`/courses/${course.id}`} 
                            isPremium={false} 
                        />
                    ))}
                    
                    {/* Premium Content (Conditional Access) */}
                    {TRACKED_COURSES.filter(c => c.isPremium).map(course => (
                        <CourseLink 
                            key={course.id} 
                            title={course.name} 
                            href={`/courses/${course.id}`} 
                            isPremium={true}
                            isLocked={!isSubscribed}
                        />
                    ))}
                    
                    {/* Universal Content */}
                    <CourseLink title="Bhagavad Gita Reader" href="/gita" isPremium={false} />
                    <CourseLink title="The Yogi's Wisdom" href="/wisdom" isPremium={false} />
                </div>
                
                {!isSubscribed && (
                    <div className="text-center p-4 mt-6 bg-surface-2 border-2 border-dashed border-brand-accent rounded-lg">
                        <p className="text-lg text-brand-accent font-medium">
                            Upgrade to unlock premium content!
                        </p>
                    </div>
                )}
            </div>
        </div>
      </div> {/* End Grid */}
    </div>
  );
}

const CourseLink = ({ title, href, isPremium, isLocked = false }) => {
    const borderColor = isPremium ? 'border-brand-accent' : 'border-brand-primary';
    const linkClass = isLocked ? 'opacity-60 cursor-default' : 'hover:bg-brand-primary-light';
    const textClass = isLocked ? 'text-text-muted' : 'text-text-base';
    
    const content = (
        <div className={`p-4 bg-surface-2 rounded-lg shadow-sm transition duration-200 border-l-4 ${borderColor} ${linkClass}`}>
            <p className={`font-semibold ${textClass}`}>{title}</p>
            <p className="text-sm text-text-muted">
                {isLocked ? '🔒 Subscription Required' : 'Start Lesson 1 →'}
            </p>
        </div>
    );
    
    return isLocked ? <div className='block'>{content}</div> : <Link href={href}>{content}</Link>;
};