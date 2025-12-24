// src/components/AdminPostEditor.js (Formerly AdminPanel.js, now a dedicated editor)
"use client";

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, addDoc, doc, updateDoc, serverTimestamp } from 'firebase/firestore';

export default function AdminPostEditor({ currentUser, postToEdit, onClose }) {
    
    // State is initialized based on postToEdit prop
    const [title, setTitle] = useState('');
    const [summary, setSummary] = useState(''); // Short text for card preview
    const [content, setContent] = useState(''); // Full HTML/Markdown content
    const [access, setAccess] = useState('free');
    const [status, setStatus] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const isEditing = !!postToEdit && !!postToEdit.id;

    useEffect(() => {
        if (postToEdit) {
            setTitle(postToEdit.title || '');
            setSummary(postToEdit.summary || '');
            setContent(postToEdit.content || '');
            setAccess(postToEdit.access || 'free');
            setStatus('');
        } else {
            // Reset for new post mode
            setTitle('');
            setSummary('');
            setContent('');
            setAccess('free');
            setStatus('');
        }
    }, [postToEdit]);


    // Admin check is assumed to be handled by the parent component (wisdom/page.js)

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title || !summary || !content) {
            setStatus("Title, Summary, and Content are required.");
            return;
        }

        setIsSubmitting(true);
        setStatus(isEditing ? "Updating content..." : "Posting content...");
        
        const postData = {
            title,
            summary,
            content, // Full rich content field
            access,
            author: currentUser?.displayName || 'Admin',
            updatedAt: serverTimestamp(),
        };

        try {
            if (isEditing) {
                // Update existing post
                const postRef = doc(db, "wisdom_posts", postToEdit.id);
                await updateDoc(postRef, postData);
                setStatus("Post updated successfully!");
                onClose();
            } else {
                // Create new post
                await addDoc(collection(db, "wisdom_posts"), {
                    ...postData,
                    createdAt: serverTimestamp(),
                });
                setStatus("Post created successfully!");
                setTitle('');
                setSummary('');
                setContent('');
                setAccess('free');
            }
        } catch (error) {
            console.error("Error managing document: ", error);
            setStatus(`Error: Failed to manage post. ${error.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!postToEdit) {
        return null; // Only show if we are actively editing or creating
    }

    return (
        <div className="p-6 bg-surface-2 rounded-lg shadow-inner border border-brand-primary">
            <h2 className="text-2xl font-serif font-bold text-brand-primary mb-4">
                {isEditing ? `Editing Post: ${postToEdit.title}` : 'Create New Wisdom Post'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-text-base">Title</label>
                    <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        className="w-full px-3 py-2 border rounded-md"
                    />
                </div>
                <div>
                    <label htmlFor="summary" className="block text-sm font-medium text-text-base">Summary (For Card Preview)</label>
                    <textarea
                        id="summary"
                        value={summary}
                        onChange={(e) => setSummary(e.target.value)}
                        rows="2"
                        required
                        className="w-full px-3 py-2 border rounded-md"
                    />
                </div>
                <div>
                    <label htmlFor="content" className="block text-sm font-medium text-text-base">Full Content (HTML / Markdown Supported)</label>
                    <textarea
                        id="content"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        rows="8"
                        required
                        className="w-full px-3 py-2 border rounded-md font-mono text-xs"
                        placeholder="Paste your rich content (HTML, links, image tags) here. Example: <h3>Title</h3><p>Content with <a href='...'>link</a></p><img src='...' />"
                    />
                </div>
                <div>
                    <label htmlFor="access" className="block text-sm font-medium text-text-base">Access Level</label>
                    <select
                        id="access"
                        value={access}
                        onChange={(e) => setAccess(e.target.value)}
                        className="w-full px-3 py-2 border rounded-md"
                    >
                        <option value="free">Free (All Users)</option>
                        <option value="premium">Premium (Subscribed Users Only)</option>
                    </select>
                </div>
                <button
                    type="submit"
                    className="w-full bg-brand-primary text-white py-2 rounded-lg hover:bg-brand-primary-darker disabled:opacity-50 transition"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? (isEditing ? 'Updating...' : 'Publishing...') : (isEditing ? 'Save Changes' : 'Publish Post')}
                </button>
                {status && <p className={`text-sm mt-2 text-center ${status.includes('Error') ? 'text-red-500' : 'text-status-success'}`}>{status}</p>}
            </form>
        </div>
    );
}