// src/components/RealPDFViewer.js
"use client";

import { Document, Page, pdfjs } from 'react-pdf';

/* --- CRITICAL FIXES: CSS Imports --- */
// NOTE: You MUST manually copy the following CSS files from 
// node_modules/react-pdf/dist/esm/Page/ into src/styles/pdf/


import { useState, useMemo } from 'react';

/* --- CRITICAL FIX: Worker Source Configuration --- */
// Use the version exposed by react-pdf to ensure worker synchronization.
// This resolves the "No workerSrc specified" and version mismatch errors.
const PDFJS_VERSION = pdfjs.version;
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${PDFJS_VERSION}/build/pdf.worker.min.mjs`;


export default function RealPDFViewer({ file, pageNumber, onDocumentLoadSuccess }) {
    
    const [containerWidth, setContainerWidth] = useState(null);
    const [isLoading, setIsLoading] = useState(true); // Added Loading state

    // FIX: Ensure containerRef is declared before use (fixes ReferenceError)
    const containerRef = useMemo(() => (el) => {
        if (el) {
            setContainerWidth(el.getBoundingClientRect().width);
        }
    }, []);

    // Load handler (now passes the real page count back to GitaReader)
    function onDocumentLoad({ numPages: nextNumPages }) {
        if (onDocumentLoadSuccess) {
            onDocumentLoadSuccess(nextNumPages); // Pass real count to parent
        }
        setIsLoading(false); // Document structure is loaded
    }

    // Custom Loading Component for better UX
    const LoadingComponent = (
        <div style={{ height: '600px', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f0f0f0' }}>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary"></div>
            <p className="mt-4 text-brand-primary">
                Loading Bhagavad Gita ({file.name}). Document Initialization in Progress...
            </p>
        </div>
    );
    

    return (
        <div ref={containerRef} style={{ width: '100%', height: '600px', overflow: 'auto' }}>
            <Document
                file={file.path} 
                onLoadSuccess={onDocumentLoad}
                loading={LoadingComponent} 
                error="Failed to load PDF file. Please ensure the file exists."
            >
                {/* Only render the Page component if the document is not loading */}
                {!isLoading && (
                    <Page 
                        pageNumber={pageNumber} 
                        width={containerWidth ? Math.min(containerWidth, 800) : undefined}
                    />
                )}
            </Document>
        </div>
    );
}