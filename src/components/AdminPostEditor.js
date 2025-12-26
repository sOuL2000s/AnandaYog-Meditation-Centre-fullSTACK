// src/components/AdminPostEditor.js (Integrated Cloudinary Direct Upload)
"use client";

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, addDoc, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '@/context/AuthContext'; // Import useAuth to access current user for status

// Get Cloudinary config from environment variables
const CLOUDINARY_CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

export default function AdminPostEditor({ postToEdit, onClose }) {
    
    const { currentUser } = useAuth();
    const [title, setTitle] = useState(''); 
    const [summary, setSummary] = useState(''); 
    const [content, setContent] = useState(''); 
    const [access, setAccess] = useState('free');
    const [status, setStatus] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    // NEW: State for image upload process
    const [isUploadingImage, setIsUploadingImage] = useState(false); 
    const [uploadProgress, setUploadProgress] = useState(0);

    const isEditing = !!postToEdit && !!postToEdit.id;

    useEffect(() => {
        if (postToEdit) {
            setTitle(postToEdit.title || '');
            setSummary(postToEdit.summary || '');
            setContent(postToEdit.content || '');
            setAccess(postToEdit.access || 'free');
            setStatus('');
        } else {
            setTitle('');
            setSummary('');
            setContent('');
            setAccess('free');
            setStatus('');
        }
    }, [postToEdit]);

    
    // --- NEW: Cloudinary Image Upload Handler ---
    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_UPLOAD_PRESET) {
            setStatus("Configuration Error: Cloudinary keys (Cloud Name or Preset) are missing in .env.local.");
            return;
        }

        setIsUploadingImage(true);
        setStatus(`Uploading image: ${file.name}...`);
        setUploadProgress(0);

        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

        try {
            // 1. Direct POST request to the Cloudinary unsigned upload URL
            const response = await fetch(
                `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
                {
                    method: 'POST',
                    body: formData,
                    // Note: No headers needed for FormData
                }
            );

            // Cloudinary's response body contains the secure URL
            const result = await response.json();

            if (response.ok && result.secure_url) {
                const imageUrl = result.secure_url;
                
                // 2. Wrap the URL in an HTML img tag and inject it into the content
                const imageHtml = 
                    `<p><img src="${imageUrl}" alt="${file.name}" style="max-width: 100%; height: auto; display: block; margin: 16px auto;" /></p>\n`;
                
                setContent(prevContent => prevContent + imageHtml);

                setStatus(`Image uploaded successfully to Cloudinary and URL inserted into content area.`);
            } else {
                console.error("Cloudinary Upload Error:", result);
                setStatus(`Image upload failed: ${result.error?.message || 'Check Cloudinary settings/preset.'}`);
            }

        } catch (error) {
            console.error("Network or Submission Error:", error);
            setStatus(`Network error during upload: ${error.message}`);
        } finally {
            setIsUploadingImage(false);
            setUploadProgress(0);
            e.target.value = null; // Clear the input field for next upload
        }
    };
    
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isUploadingImage) {
            setStatus("Please wait for the image upload to complete.");
            return;
        }
        if (!title || !summary || !content) {
            setStatus("Title, Summary, and Content are required.");
            return;
        }

        setIsSubmitting(true);
        setStatus(isEditing ? "Updating content..." : "Posting content...");
        
        const postData = {
            title,
            summary,
            content, 
            access,
            author: currentUser?.displayName || 'Admin',
            updatedAt: serverTimestamp(),
        };

        try {
            if (isEditing) {
                const postRef = doc(db, "wisdom_posts", postToEdit.id);
                await updateDoc(postRef, postData);
                setStatus("Post updated successfully!");
                onClose();
            } else {
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
        return null; 
    }

    return (
        <div className="p-6 bg-surface-2 rounded-lg shadow-inner border border-brand-primary">
            <h2 className="text-2xl font-serif font-bold text-brand-primary mb-4">
                {isEditing ? `Editing Post: ${postToEdit.title}` : 'Create New Wisdom Post'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                
                {/* Cloudinary Image Uploader Tool */}
                <div className="p-3 bg-surface-1 rounded-lg border border-gray-300">
                    <label htmlFor="image-upload" className="block text-sm font-bold text-brand-accent mb-2">
                        Upload Image to Cloudinary
                    </label>
                    <input
                        type="file"
                        id="image-upload"
                        accept="image/*"
                        onChange={handleImageUpload}
                        disabled={isUploadingImage}
                        className="w-full text-sm text-text-base file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-brand-primary file:text-white hover:file:bg-brand-primary-darker disabled:file:bg-gray-400"
                    />
                    {isUploadingImage && (
                        <div className='mt-2'>
                            <p className="text-xs text-status-warning">Uploading... Please wait for the process to complete.</p>
                            {/* Simple simulated progress bar could go here if needed, but fetch doesn't easily expose progress */}
                        </div>
                    )}
                </div>
                {/* --- End Cloudinary Uploader Tool --- */}
                
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
                        placeholder="Content inserted by the uploader will appear at the cursor position."
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
                    disabled={isSubmitting || isUploadingImage} 
                >
                    {isSubmitting ? (isEditing ? 'Updating...' : 'Publishing...') : (isEditing ? 'Save Changes' : 'Publish Post')}
                </button>
                {status && <p className={`text-sm mt-2 text-center ${status.includes('Error') || status.includes('failed') ? 'text-red-500' : 'text-status-success'}`}>{status}</p>}
            </form>
        </div>
    );
}