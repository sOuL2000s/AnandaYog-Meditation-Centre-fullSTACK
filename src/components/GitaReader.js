// src/components/GitaReader.js
"use client";

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Image from 'next/image';
import dynamic from 'next/dynamic'; 

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
    // NEW STATE: Input for page jumping
    const [inputPage, setInputPage] = useState('1'); 
    // State to track if the initial Firestore data has been synchronized
    const [isInitialized, setIsInitialized] = useState(false);
    
    // NEW STATE: Holds the real page count loaded by react-pdf
    const [realNumPages, setRealNumPages] = useState(0); 
    
    // Derived state
    const currentFile = contentMap[selectedLang];
    const numPages = realNumPages; 

    // --- Persistence Handler ---
    const updateProgress = useCallback(async (page, lang, isBookmarkToggle = false) => {
        if (!currentUser || !page || !lang) {
            console.warn("Skipping progress save: Missing user or data.");
            return;
        }
        const userRef = doc(db, "users", currentUser.uid);
        const updateData = {};
        
        // This is a safety check/optimization. Firestore needs a field path, 
        // but if the base field is missing, we ensure it exists.
        // (Handled by AuthContext, but good practice.)
        if (!userData?.gita_progress) {
             updateData['gita_progress'] = {};
        }

        if (isBookmarkToggle) {
            let newBookmarks = [...bookmarks];
            const pageIndex = page;

            if (newBookmarks.includes(pageIndex)) {
                newBookmarks = newBookmarks.filter(b => b !== pageIndex);
            } else {
                newBookmarks.push(pageIndex);
            }
            newBookmarks = Array.from(new Set(newBookmarks)).sort((a, b) => a - b);
            
            updateData['gita_progress.bookmarks'] = newBookmarks; 
            setBookmarks(newBookmarks); 

        } else {
            // Save current page and language
            updateData['gita_progress.language'] = lang;
            updateData['gita_progress.lastPage'] = page;
        }

        try {
            await setDoc(userRef, updateData, { merge: true });
            console.log(`[GitaReader] Progress saved: Page ${page}, Lang ${lang}.`);
        } catch (e) {
            console.error("[GitaReader] Error saving progress/bookmark. Check network or rules:", e);
        }
    }, [currentUser, bookmarks, userData]); 

    // --- Handler for Page Count received from PDFViewerWrapper ---
    const handleDocumentLoadSuccess = useCallback((count) => {
        setRealNumPages(count);
        
        // Ensure the current page is valid for the newly loaded PDF
        setPageNumber(p => {
            const newPage = Math.max(1, Math.min(p, count));
            setInputPage(newPage.toString());
            return newPage;
        }); 

    }, []); 


    // --- Effect: Load Synchronization State (Initial Load) ---
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
                setInputPage(savedPage.toString()); 
                
            } else {
                setSelectedLang('en');
                setPageNumber(1);
                setInputPage('1');
                setBookmarks([]);
            }
            
            setIsInitialized(true); 
        };
        
        initializeState(currentUser, userData);
        
    }, [loading, currentUser, userData, isInitialized]); 


    // --- Debounced Tracking of Current Page/Language ---
    // The dependency array now uses pageNumber and selectedLang as triggers.
    useEffect(() => {
        if (currentUser && !loading && numPages > 0 && isInitialized) { 
            if (pageNumber >= 1 && pageNumber <= numPages) {
                const timeout = setTimeout(() => {
                    // Only save if the current page is valid
                    updateProgress(pageNumber, selectedLang, false); 
                }, 1500); // Increased debounce time for less frequent writes
                return () => clearTimeout(timeout);
            }
        }
        // Added pageNumber and selectedLang to dependencies to trigger saving on change
    }, [pageNumber, selectedLang, currentUser, loading, numPages, updateProgress, isInitialized]); 
    
    
    // --- Handler: Language Change ---
    const handleLanguageChange = (e) => {
        const newLang = e.target.value;
        if (newLang !== selectedLang) {
            setSelectedLang(newLang);
            setPageNumber(1); 
            setInputPage('1'); 
            setRealNumPages(0); 
        }
    };
    
    // --- Handler: Page Jump Feature ---
    const handlePageJump = () => {
        const page = parseInt(inputPage, 10);
        if (isNaN(page) || page < 1 || page > numPages) {
            alert(`Please enter a valid page number between 1 and ${numPages}.`);
            // Reset input to current valid page number on error
            setInputPage(pageNumber.toString()); 
            return;
        }
        setPageNumber(page); // Update the primary page state
    };

    const nextPage = () => setPageNumber(p => {
        const newPage = Math.min(p + 1, numPages);
        setInputPage(newPage.toString());
        return newPage;
    });
    const prevPage = () => setPageNumber(p => {
        const newPage = Math.max(p - 1, 1);
        setInputPage(newPage.toString());
        return newPage;
    });
    
    const toggleBookmark = () => {
        if (currentUser) {
            updateProgress(pageNumber, selectedLang, true); 
        }
    };
    
    const handleInputPageChange = (e) => {
        setInputPage(e.target.value);
    }
    
    const handleBookmarkClick = (b) => {
        setPageNumber(b);
        setInputPage(b.toString());
    }

    const isBookmarked = bookmarks.includes(pageNumber);

    if (loading || !isInitialized) {
        return <div className="text-center py-20 text-text-muted">Loading Bhagavad Gita reader...</div>;
    }

    const isReady = numPages > 0; 

    return (
        <div className="p-8 max-w-5xl mx-auto">
            {/* ... (Header remains the same) ... */}
            <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
                <h1 className="text-3xl font-serif font-bold text-brand-primary">
                    The Bhagavad Gita Reader
                </h1>
                <select 
                    onChange={handleLanguageChange} 
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
                    key={currentFile.path} // Added key to force re-render on file change
                    file={currentFile}
                    pageNumber={pageNumber}
                    onDocumentLoadSuccess={handleDocumentLoadSuccess} 
                />

                {/* Footer and Controls */}
                {isReady && ( 
                    <div className="mt-6 pt-4 w-full flex flex-wrap justify-between items-center gap-3 border-t border-gray-100">
                        
                        {/* Pagination & Page Jump (NEW UI) */}
                        <div className="flex items-center space-x-3">
                            <div className="text-base font-semibold text-text-base whitespace-nowrap">
                                Page {pageNumber} of {numPages}
                            </div>
                            
                            {/* Page Jump Input */}
                            <input
                                type="number"
                                min="1"
                                max={numPages}
                                value={inputPage}
                                onChange={handleInputPageChange}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') handlePageJump();
                                }}
                                className="w-16 px-2 py-1 border border-gray-300 rounded-lg text-center bg-surface-2 text-text-base"
                            />
                            <button
                                onClick={handlePageJump}
                                className="px-3 py-1 bg-brand-primary text-white rounded-lg hover:bg-brand-primary-darker transition text-sm font-semibold"
                            >
                                Jump
                            </button>
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
                                onClick={() => handleBookmarkClick(b)}
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
