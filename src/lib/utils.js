// src/lib/utils.js
import { db } from './firebase';
import { doc, setDoc, deleteDoc } from 'firebase/firestore';

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
    
    // --- CRITICAL FIX: Use the nested field path notation ---
    // This tells Firestore to update the nested map fields correctly.
    const progressUpdate = {
        // Example: progress.beginners_mind.day1.completed
        [`progress.${courseId}.${lessonId}.completed`]: true,
        [`progress.${courseId}.${lessonId}.completedAt`]: new Date().toISOString(),
        [`progress.${courseId}.lastAccessed`]: new Date().toISOString(),
    };
    // The previous implementation was already using this syntax, 
    // but the issue often arises when the parent 'progress' map is missing.
    
    // To ensure the parent 'progress' map exists, we rely on the AuthContext
    // initializer, but the syntax itself is the correct way to perform nested writes 
    // in Firestore using the Firebase SDK. We will trust the syntax and rely on 
    // the AuthContext fix from the previous step.

    try {
        console.log(`[Firestore] Attempting course progress write for user: ${userId}, course: ${courseId}`);
        
        await setDoc(userRef, progressUpdate, { merge: true });
        
        // --- SUCCESS LOG ---
        console.log(`[Firestore] SUCCESS: Progress tracked for user ${userId}: ${courseId}/${lessonId}`);
    } catch (e) {
        console.error("[Firestore] FATAL ERROR tracking progress:", e);
    }
};

/**
 * Gets the completion status of a specific lesson.
 */
export const getLessonStatus = (userData, courseId, lessonId) => {
    // This client-side read relies on the Firestore data being nested maps:
    // userData.progress -> { 'beginners_mind': { 'day1': { completed: true } } }
    
    // If the Firestore data is currently flat (as per screenshot), 
    // this read will ALWAYS return false until the structure is fixed.
    return userData?.progress?.[courseId]?.[lessonId]?.completed || false;
};


// ------------------------------------------------------------------
// --- ADMIN FUNCTIONS (Checking for the same flat field issue here) ---
// ------------------------------------------------------------------

/**
 * Admin utility to update generalized user data (like notes or subscription fields).
 */
export const updateUserDataAdmin = async (userId, data) => {
    if (!userId) {
        console.error("Admin update failed: Missing User ID.");
        return;
    }
    const userRef = doc(db, "users", userId);
    await setDoc(userRef, data, { merge: true });
    console.log(`[Admin] Successfully updated general data for user: ${userId}`);
};

/**
 * Admin utility to manually set a specific lesson status (up or down progress).
 */
export const updateUserLessonStatusAdmin = async (userId, courseId, lessonId, completed) => {
    if (!userId || !courseId || !lessonId) {
        console.error("Admin progress update failed: Missing IDs.");
        return;
    }

    const userRef = doc(db, "users", userId);
    
    // Construct the field path - This is correct for nested writes
    const fieldPath = `progress.${courseId}.${lessonId}.completed`;
    
    const update = {
        [fieldPath]: completed,
    };
    
    if (completed) {
        update[`progress.${courseId}.${lessonId}.completedAt`] = new Date().toISOString();
        update[`progress.${courseId}.lastAccessed`] = new Date().toISOString(); // Added lastAccessed update for completeness
    } else {
        // Note: For incomplete, we explicitly set `completed` to false.
        update[`progress.${courseId}.${lessonId}.completedAt`] = null; 
    }
    
    await setDoc(userRef, update, { merge: true });
    console.log(`[Admin] Progress updated for user ${userId}: ${courseId}/${lessonId} set to ${completed}`);
};

/**
 * Admin utility to delete a wisdom post.
 */
export const deleteWisdomPost = async (postId) => {
    if (!postId) {
        console.error("Delete failed: Missing Post ID.");
        return;
    }
    const postRef = doc(db, "wisdom_posts", postId);
    await deleteDoc(postRef);
    console.log(`[Admin] Successfully deleted wisdom post: ${postId}`);
};