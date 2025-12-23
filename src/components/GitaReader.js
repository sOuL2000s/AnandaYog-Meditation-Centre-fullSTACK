// src/components/GitaReader.js
"use client";

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Image from 'next/image';
import dynamic from 'next/dynamic'; // Import dynamic

/* 
 * CRITICAL FIX: Dynamically import the viewer component.
 * This component will now handle setting the worker source and reporting the page count.
 */
const PDFViewerWrapper = dynamic(
    () => import('./RealPDFViewer'), 
    { ssr: false } 
);


// Map language codes to their paths (REMOVED hardcoded numPages)
const contentMap = {
    en: { path: '/gita_en.pdf', name: 'English' }, 
    hi: { path: '/gita_hi.pdf', name: 'Hindi' },
    bn: { path: '/gita_bn.pdf', name: 'Bengali' },
};

export default function GitaReader() {
    const { currentUser, userData, loading } = useAuth();
    const [selectedLang, setSelectedLang] = useState('en');
    const [pageNumber, setPageNumber] = useState(1);
    const [bookmarks, setBookmarks] = useState([]);
    // State to track if the initial Firestore data has been synchronized
    const [isInitialized, setIsInitialized] = useState(false);
    
    // NEW STATE: Holds the real page count loaded by react-pdf
    const [realNumPages, setRealNumPages] = useState(0); 
    
    // Derived state
    const currentFile = contentMap[selectedLang];
    const numPages = realNumPages; // Use the real number here

    // --- Persistence Handler (Fixed Bookmark Logic) ---
    const updateProgress = useCallback(async (page, lang, isBookmarkToggle = false) => {
        if (!currentUser) return;
        const userRef = doc(db, "users", currentUser.uid);
        const updateData = {};

        // Use the current local state of bookmarks for immediate UI feedback
        let currentBookmarks = isBookmarkToggle ? bookmarks : userData?.gita_progress?.bookmarks || [];

        if (isBookmarkToggle) {
            let newBookmarks = [...currentBookmarks];
            const pageIndex = page;

            if (newBookmarks.includes(pageIndex)) {
                newBookmarks = newBookmarks.filter(b => b !== pageIndex);
            } else {
                newBookmarks.push(pageIndex);
            }
            newBookmarks = Array.from(new Set(newBookmarks)).sort((a, b) => a - b);
            
            updateData['gita_progress.bookmarks'] = newBookmarks;
            setBookmarks(newBookmarks); // Update local state immediately

        } else {
            updateData['gita_progress.language'] = lang;
            updateData['gita_progress.lastPage'] = page;
        }

        try {
            await setDoc(userRef, updateData, { merge: true });
        } catch (e) {
            console.error("Error saving progress/bookmark:", e);
        }
    }, [currentUser, userData, bookmarks]); // Added bookmarks to dependencies

    // --- Handler for Page Count received from PDFViewerWrapper ---
    const handleDocumentLoadSuccess = useCallback((count) => {
        setRealNumPages(count);
        
        // Ensure the current page is valid for the newly loaded PDF
        setPageNumber(p => Math.max(1, Math.min(p, count))); 

    }, []); 


    // --- Effect: Load Synchronization State (Initial Load - Fixed sequence) ---
    useEffect(() => {
        if (loading || isInitialized) {
            return;
        }

        const initializeState = (user, data) => {
            if (user && data) {
                const progress = data?.gita_progress;
                
                const savedLang = progress?.language || 'en';
                const savedPage = progress?.lastPage || 1; 

                // Set initial state from Firestore
                setSelectedLang(savedLang);
                setBookmarks(progress?.bookmarks || []);
                setPageNumber(savedPage); 
                
            } else {
                setSelectedLang('en');
                setPageNumber(1);
                setBookmarks([]);
            }
            
            setIsInitialized(true); 
        };
        
        initializeState(currentUser, userData);
        
    }, [loading, currentUser, userData, isInitialized]); 


    // --- Debounced Tracking of Current Page ---
    useEffect(() => {
        if (currentUser && !loading && numPages > 0 && isInitialized) { 
            if (pageNumber >= 1 && pageNumber <= numPages) {
                const timeout = setTimeout(() => {
                    updateProgress(pageNumber, selectedLang, false);
                }, 1000); 
                return () => clearTimeout(timeout);
            }
        }
    }, [pageNumber, selectedLang, currentUser, loading, numPages, updateProgress, isInitialized]); 
    
    
    // --- FIX: Handler: Language Change ---
    const handleLanguageChange = (e) => {
        const newLang = e.target.value;
        if (newLang !== selectedLang) {
            setSelectedLang(newLang);
            setPageNumber(1); 
            setBookmarks([]);
            setRealNumPages(0); // Reset page count until new PDF loads
        }
    };
    // -----------------------------------------------------------


    const nextPage = () => setPageNumber(p => Math.min(p + 1, numPages));
    const prevPage = () => setPageNumber(p => Math.max(p - 1, 1));
    
    const toggleBookmark = () => {
        if (currentUser) {
            updateProgress(pageNumber, selectedLang, true);
        }
    };
    
    const isBookmarked = bookmarks.includes(pageNumber);

    if (loading || !isInitialized) {
        return <div className="text-center py-20 text-text-muted">Loading Bhagavad Gita reader...</div>;
    }

    const isReady = numPages > 0; 

    return (
        <div className="p-8 max-w-5xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-serif font-bold text-brand-primary">
                    The Bhagavad Gita Reader
                </h1>
                <select 
                    onChange={handleLanguageChange} // Referenced here!
                    value={selectedLang}
                    className="p-2 border border-gray-300 rounded-lg bg-surface-1 text-text-base"
                >
                    {Object.keys(contentMap).map(key => (
                        <option key={key} value={key}>{contentMap[key].name}</option>
                    ))}
                </select>
            </div>

            {/* Book Display Area */}
            <div className={`bg-surface-1 p-4 rounded-xl shadow-2xl border-t-4 border-brand-primary flex flex-col items-center transition-transform duration-500`}>
                
                {/* PDF Viewer Component */}
                <PDFViewerWrapper
                    file={currentFile}
                    pageNumber={pageNumber}
                    onDocumentLoadSuccess={handleDocumentLoadSuccess} // Pass the new handler
                />

                {/* Footer and Controls */}
                {isReady && ( 
                    <div className="mt-6 pt-4 w-full flex flex-wrap justify-between items-center gap-3">
                        
                        {/* Pagination */}
                        <div className="text-base font-semibold text-text-base">
                            Page {pageNumber} of {numPages}
                        </div>

                        {/* Controls */}
                        <div className="flex items-center space-x-3">
                            <button 
                                onClick={prevPage}
                                disabled={pageNumber <= 1}
                                className="px-4 py-2 bg-surface-2 text-text-base rounded-lg hover:bg-gray-300 transition disabled:opacity-50"
                            >
                                ← Previous Page
                            </button>

                            {/* Bookmark Button */}
                            <button
                                onClick={toggleBookmark}
                                className={`px-3 py-2 rounded-full transition font-semibold ${
                                    isBookmarked ? 'bg-brand-accent text-white shadow-md' : 'bg-surface-2 text-text-base hover:bg-brand-accent hover:text-white'
                                }`}
                                disabled={!currentUser}
                            >
                                {isBookmarked ? '★ Bookmarked' : '☆ Bookmark Page'}
                            </button>
                            
                            <button 
                                onClick={nextPage}
                                disabled={pageNumber >= numPages}
                                className="px-4 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-primary-darker transition disabled:opacity-50"
                            >
                                Next Page →
                            </button>
                        </div>
                    </div>
                )} 
                
                {!isReady && (
                    <p className='mt-4 text-text-muted'>Initializing PDF Viewer...</p>
                )}
                
                {currentUser && bookmarks.length > 0 && (
                    <div className="mt-4 text-sm text-text-muted text-right border-t border-gray-100 pt-2 w-full">
                        <span className='font-semibold mr-2'>Saved Bookmarks:</span>
                        {bookmarks.map(b => (
                            <button 
                                key={b} 
                                onClick={() => setPageNumber(b)}
                                className={`mx-1 px-3 py-1 rounded-full text-xs transition ${pageNumber === b ? 'bg-brand-accent text-white shadow-inner' : 'bg-brand-primary-light text-brand-primary hover:bg-brand-accent-darker hover:text-white'}`}
                            >
                                Page {b}
                            </button>
                        ))}
                    </div>
                )}
                {!currentUser && <p className='text-xs text-text-muted text-center pt-2'>Login to save your reading progress and bookmarks.</p>}
            </div>
        </div>
    );
}