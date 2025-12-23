// src/lib/utils.js
import { db } from './firebase';
import { doc, setDoc } from 'firebase/firestore';

/**
 * Updates the user's course progress in Firestore.
 * @param {string} userId - The Firebase User ID.
 * @param {string} courseId - The ID of the course.
 * @param {string} lessonId - The ID of the lesson completed.
 */
export const trackLessonCompletion = async (userId, courseId, lessonId) => {
    if (!userId || !courseId || !lessonId) {
        console.error("Progress tracking failed: Missing User/Course/Lesson ID.");
        return;
    }

    const userRef = doc(db, "users", userId);
    
    // Structure: users/{userId}/progress/{courseId}
    const progressUpdate = {
        [`progress.${courseId}.${lessonId}.completed`]: true,
        [`progress.${courseId}.${lessonId}.completedAt`]: new Date().toISOString(),
        [`progress.${courseId}.lastAccessed`]: new Date().toISOString(),
    };

    try {
        console.log(`[Firestore] Attempting write for user: ${userId}, course: ${courseId}`);
        
        await setDoc(userRef, progressUpdate, { merge: true });
        
        // --- SUCCESS LOG ---
        console.log(`[Firestore] SUCCESS: Progress tracked for user ${userId}: ${courseId}/${lessonId}`);
    } catch (e) {
        // --- FAILURE LOG ---
        // This will now capture and display any connection or permission failures.
        console.error("[Firestore] FATAL ERROR tracking progress:", e);
    }
};

/**
 * Gets the completion status of a specific lesson.
 */
export const getLessonStatus = (userData, courseId, lessonId) => {
    // Check if progress map exists, then course ID, then lesson ID, then completed status
    return userData?.progress?.[courseId]?.[lessonId]?.completed || false;
};