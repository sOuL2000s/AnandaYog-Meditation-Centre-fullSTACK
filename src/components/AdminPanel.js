// src/components/AdminPanel.js
"use client";

import { useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export default function AdminPanel({ currentUser }) {
    const [title, setTitle] = useState('');
    const [summary, setSummary] = useState('');
    const [access, setAccess] = useState('free');
    const [status, setStatus] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (currentUser?.uid !== process.env.NEXT_PUBLIC_ADMIN_FIREBASE_UID) {
        return null; 
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title || !summary) {
            setStatus("Title and Summary are required.");
            return;
        }

        setIsSubmitting(true);
        setStatus("Posting content...");

        try {
            await addDoc(collection(db, "wisdom_posts"), {
                title,
                summary,
                access,
                author: currentUser.displayName || 'Admin',
                createdAt: serverTimestamp(),
            });

            setStatus("Post created successfully!");
            setTitle('');
            setSummary('');
            setAccess('free');
        } catch (error) {
            console.error("Error adding document: ", error);
            setStatus(`Error: Failed to create post. ${error.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="p-6 bg-surface-2 rounded-lg shadow-inner border border-brand-primary">
            <h2 className="text-2xl font-serif font-bold text-brand-primary mb-4">Admin Content Manager</h2>
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
                    <label htmlFor="summary" className="block text-sm font-medium text-text-base">Summary/Content (Placeholder)</label>
                    <textarea
                        id="summary"
                        value={summary}
                        onChange={(e) => setSummary(e.target.value)}
                        rows="3"
                        required
                        className="w-full px-3 py-2 border rounded-md"
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
                    {isSubmitting ? 'Publishing...' : 'Publish Post'}
                </button>
                {status && <p className="text-sm mt-2 text-center text-status-success">{status}</p>}
            </form>
        </div>
    );
}