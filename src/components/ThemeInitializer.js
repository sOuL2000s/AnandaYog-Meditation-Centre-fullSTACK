// src/components/ThemeInitializer.js
"use client";

import { useAuth } from '@/context/AuthContext';
import { useEffect } from 'react';

export default function ThemeInitializer() {
    const { theme, loading } = useAuth();

    useEffect(() => {
        // Only run when theme data is available (i.e., not loading)
        if (!loading && theme) {
            const root = window.document.documentElement;
            
            // 1. Remove both theme classes
            root.classList.remove('light', 'dark');
            
            // 2. Apply the current theme class
            root.classList.add(theme);

            // Debugging confirmation (optional)
            console.log(`ThemeInitializer: Applying theme class "${theme}"`);
        }
    }, [theme, loading]);

    return null; 
}