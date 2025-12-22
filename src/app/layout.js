// src/app/layout.js 

import './globals.css';
import { AuthProvider } from '../context/AuthContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ThemeInitializer from '@/components/ThemeInitializer'; 

export const metadata = {
  title: 'AnandaYog Meditation Centre: Inner Peace & Authentic Practice',
  description: 'Guided meditation, authentic yoga, and mindful living courses. Start your journey to tranquility today.',
};

export default function RootLayout({ children }) {
  return (
    // FIX 1: Explicitly set 'light' class to ensure Light Mode CSS variables 
    // are applied on the server side, eliminating the dark mode flash/default.
    <html lang="en" className="light"> 
      {/* 
        NOTE: For best visual results, link Google Fonts (Playfair Display & Inter) 
        in the <head> of the document or update the CSS. 
      */}
      <body className="flex flex-col min-h-screen antialiased">
        <AuthProvider>
          <ThemeInitializer /> 
          <Header />
          {/* FIX 2 (Gap Fix): Removed pb-16 padding to eliminate the gap between the content and the footer. */}
          <main className="grow"> 
            {children}
          </main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}