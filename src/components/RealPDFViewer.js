// src/components/RealPDFViewer.js
"use client";

import { Document, Page, pdfjs } from 'react-pdf';

/* --- CRITICAL FIXES: CSS Imports --- */
// NOTE: You MUST manually copy the following CSS files from 
// node_modules/react-pdf/dist/esm/Page/ into src/styles/pdf/
import '@/styles/pdf/AnnotationLayer.css'; 
import '@/styles/pdf/TextLayer.css';      

import { useState, useMemo } from 'react';

/* --- CRITICAL FIX: Worker Source Configuration --- */
// Use the version exposed by react-pdf to ensure worker synchronization.
// This resolves the "No workerSrc specified" and version mismatch errors.
const PDFJS_VERSION = pdfjs.version;
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${PDFJS_VERSION}/build/pdf.worker.min.mjs`;


export default function RealPDFViewer({ file, pageNumber, onDocumentLoadSuccess }) {
    
    const [containerWidth, setContainerWidth] = useState(null);
    const [isLoading, setIsLoading] = useState(true); 

    // FIX: Ensure containerRef is declared before use (fixes ReferenceError)
    const containerRef = useMemo(() => (el) => {
        if (el) {
            // Use ResizeObserver for responsive updates if necessary, 
            // but simple client rect width on mount is usually sufficient
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
        <div style={{ height: '600px', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgb(var(--bg-surface-1))' }}>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary"></div>
            <p className="mt-4 text-brand-primary">
                Loading Bhagavad Gita ({file.name}). Document Initialization in Progress...
            </p>
        </div>
    );
    
    // Determine max page width for rendering
    // We aim for max readability (800px) or fit the container if it's smaller.
    const maxWidth = containerWidth ? Math.min(containerWidth - 32, 800) : undefined; // Subtract padding/margin

    return (
        // REMOVED FIXED HEIGHT: Allow natural PDF height to dictate vertical size.
        <div ref={containerRef} className="w-full flex justify-center py-4" style={{ minHeight: '600px' }}>
            <Document
                file={file.path} 
                onLoadSuccess={onDocumentLoad}
                loading={LoadingComponent} 
                error={<div className="text-red-500 p-8">Failed to load PDF file. Please ensure the file exists.</div>}
            >
                {/* Only render the Page component if the document structure is loaded */}
                {!isLoading && (
                    <Page 
                        pageNumber={pageNumber} 
                        // Set width to control the zoom/scale
                        width={maxWidth}
                        renderTextLayer={true} 
                        renderAnnotationLayer={true}
                    />
                )}
            </Document>
        </div>
    );
}