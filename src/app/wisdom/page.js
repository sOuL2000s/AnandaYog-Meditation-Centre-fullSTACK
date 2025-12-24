// src/app/wisdom/page.js
"use client";

import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/firebase';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { useState, useEffect } from 'react';
import AdminPostEditor from '@/components/AdminPostEditor'; // Updated name
import { deleteWisdomPost } from '@/lib/utils';
import Link from 'next/link';

export default function WisdomPage() {
    const { currentUser, userData, loading, isAdmin } = useAuth();
    const [posts, setPosts] = useState([]);
    const [editingPost, setEditingPost] = useState(null); // State to hold post being edited

    const isSubscribed = userData?.isSubscribed;
    
    // Fetch posts in real-time
    useEffect(() => {
        const postsCol = collection(db, "wisdom_posts");
        const q = query(postsCol, orderBy("createdAt", "desc"));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const fetchedPosts = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setPosts(fetchedPosts);
        }, (error) => {
            console.error("Error fetching wisdom posts:", error);
        });

        return () => unsubscribe();
    }, []);

    // Filter posts based on user access
    const filteredPosts = posts.filter(post => {
        // Admins see everything
        if (isAdmin) return true;
        // Free posts are always visible
        if (post.access === 'free') return true;
        // Premium posts require subscription
        if (post.access === 'premium' && isSubscribed) return true;
        
        return false;
    });
    
    const handleDelete = async (postId) => {
        if (window.confirm("Are you sure you want to delete this wisdom post?")) {
            try {
                await deleteWisdomPost(postId);
            } catch (error) {
                alert("Failed to delete post.");
            }
        }
    }

    if (loading) {
        return <div className="text-center py-20 text-text-muted">Loading Wisdom Library...</div>;
    }

    return (
        <div className="container mx-auto p-8 max-w-4xl">
            <h1 className="text-4xl font-serif font-bold text-brand-primary mb-2">
                The Yogi&apos;s Wisdom
            </h1>
            <p className="text-lg text-text-muted mb-8">
                Daily insights, practice tips, and philosophical reflections.
            </p>

            {isAdmin && (
                <div className="mb-8">
                    {/* Render editor component (reused for creation/editing) */}
                    <AdminPostEditor 
                        postToEdit={editingPost}
                        onClose={() => setEditingPost(null)}
                    />
                    <div className='text-center mt-4'>
                        <button 
                            onClick={() => setEditingPost(editingPost ? null : {})}
                            className='bg-brand-primary text-white py-2 px-6 rounded-full hover:bg-brand-primary-darker transition'
                        >
                            {editingPost ? 'Cancel Editing' : 'Create New Wisdom Post'}
                        </button>
                    </div>
                </div>
            )}

            <div className="space-y-6">
                {filteredPosts.length > 0 ? (
                    filteredPosts.map(post => (
                        <PostCard 
                            key={post.id} 
                            post={post} 
                            isSubscribed={isSubscribed}
                            isAdmin={isAdmin}
                            onEdit={() => setEditingPost(post)}
                            onDelete={() => handleDelete(post.id)}
                        />
                    ))
                ) : (
                    <div className="p-8 bg-surface-2 rounded-lg text-center text-text-muted">
                        No wisdom posts available yet.
                    </div>
                )}
            </div>

            {!isSubscribed && posts.some(p => p.access === 'premium') && (
                <div className="mt-10 p-8 text-center bg-brand-accent/10 border-l-4 border-brand-accent rounded-lg">
                    <p className="text-xl font-semibold text-brand-accent mb-4">Unlock Premium Wisdom</p>
                    <p className="text-text-base mb-4">
                        Subscribe to gain exclusive access to deep-dive articles and masterclass videos reserved only for paid members.
                    </p>
                    <Link href="/pricing" className="bg-brand-accent text-white py-2 px-6 rounded-full hover:bg-brand-accent-darker transition">
                        View Subscription Plans
                    </Link>
                </div>
            )}
        </div>
    );
}

const PostCard = ({ post, isSubscribed, isAdmin, onEdit, onDelete }) => {
    const isPremium = post.access === 'premium';
    const isLocked = isPremium && !isSubscribed && !isAdmin;
    const [isExpanded, setIsExpanded] = useState(false);
    
    // Style adjustments for locked content
    const cardClass = isLocked ? 'opacity-50 blur-sm' : 'hover:shadow-xl';
    
    return (
        <div className={`relative p-6 bg-surface-1 rounded-lg shadow-md border-l-4 ${isPremium ? 'border-brand-accent' : 'border-status-success'} transition duration-300 ${cardClass}`}>
            
            {/* Header */}
            <div className="flex justify-between items-start mb-2">
                <h2 className="text-2xl font-serif font-bold text-text-base">{post.title}</h2>
                <span className={`text-xs font-semibold px-3 py-1 rounded-full ${isPremium ? 'bg-brand-accent text-white' : 'bg-status-success text-white'}`}>
                    {isPremium ? 'Premium' : 'Free'}
                </span>
            </div>
            
            {/* Summary */}
            <p className="text-text-muted mb-4">{post.summary}</p>
            
            {/* Locked Overlay */}
            {isLocked && (
                <div className="absolute inset-0 flex items-center justify-center backdrop-blur-sm z-10">
                    <span className="text-xl font-bold text-red-600 dark:text-red-400">Content Locked</span>
                </div>
            )}
            
            {/* Full Content (Visible only if not locked and expanded) */}
            {!isLocked && isExpanded && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                    <h3 className="text-lg font-semibold mb-2 text-brand-primary">Full Content:</h3>
                    {/* CRITICAL: Allows rich content (HTML/Markdown converted to HTML) */}
                    <div 
                        className="prose dark:prose-invert max-w-none text-text-base text-sm" 
                        dangerouslySetInnerHTML={{ __html: post.content || post.summary }}
                    ></div>
                </div>
            )}

            {/* Actions */}
            <div className='mt-4 flex justify-between items-center'>
                {!isLocked && (
                    <button 
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="text-brand-primary hover:underline font-medium text-sm"
                    >
                        {isExpanded ? 'Collapse ▲' : 'Read Full Post →'}
                    </button>
                )}
                
                {isAdmin && (
                    <div className='flex space-x-2 z-20'>
                        <button onClick={onEdit} className='text-xs text-brand-accent hover:text-brand-accent-darker font-medium'>
                            Edit
                        </button>
                        <button onClick={onDelete} className='text-xs text-red-600 hover:text-red-800 font-medium'>
                            Delete
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};
