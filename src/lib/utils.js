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
    if (!userId || !courseId || !lessonId) return;

    const userRef = doc(db, "users", userId);
    
    // Structure: users/{userId}/progress/{courseId}
    const progressUpdate = {
        [`progress.${courseId}.${lessonId}.completed`]: true,
        [`progress.${courseId}.${lessonId}.completedAt`]: new Date().toISOString(),
        [`progress.${courseId}.lastAccessed`]: new Date().toISOString(),
    };

    try {
        await setDoc(userRef, progressUpdate, { merge: true });
        console.log(`Progress tracked for user ${userId}: ${courseId}/${lessonId}`);
    } catch (e) {
        console.error("Error tracking progress:", e);
    }
};

/**
 * Gets the completion status of a specific lesson.
 */
export const getLessonStatus = (userData, courseId, lessonId) => {
    // Check if progress map exists, then course ID, then lesson ID, then completed status
    return userData?.progress?.[courseId]?.[lessonId]?.completed || false;
};
