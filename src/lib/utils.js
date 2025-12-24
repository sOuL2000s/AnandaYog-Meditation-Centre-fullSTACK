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


// ------------------------------------------------------------------
// --- ADMIN FUNCTIONS ---
// ------------------------------------------------------------------

/**
 * Admin utility to update generalized user data (like notes or subscription fields).
 * @param {string} userId 
 * @param {object} data - Data object to merge (e.g., { adminNotes: '...', subscriptionExpires: '...' })
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
 * @param {string} userId 
 * @param {string} courseId 
 * @param {string} lessonId 
 * @param {boolean} completed - True to mark complete, false to mark incomplete.
 */
export const updateUserLessonStatusAdmin = async (userId, courseId, lessonId, completed) => {
    if (!userId || !courseId || !lessonId) {
        console.error("Admin progress update failed: Missing IDs.");
        return;
    }

    const userRef = doc(db, "users", userId);
    
    // Construct the field path
    const fieldPath = `progress.${courseId}.${lessonId}.completed`;
    
    const update = {
        [fieldPath]: completed,
    };
    
    if (completed) {
        update[`progress.${courseId}.${lessonId}.completedAt`] = new Date().toISOString();
    } else {
        // If marking incomplete, we might want to remove the timestamp field to clean up
        // Note: Firestore merge prevents simple deletion; we just overwrite `completed: false`
        update[`progress.${courseId}.${lessonId}.completedAt`] = null; 
    }
    
    await setDoc(userRef, update, { merge: true });
    console.log(`[Admin] Progress updated for user ${userId}: ${courseId}/${lessonId} set to ${completed}`);
};

/**
 * Admin utility to delete a wisdom post.
 * @param {string} postId 
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