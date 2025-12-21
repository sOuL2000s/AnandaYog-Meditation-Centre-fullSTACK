// src/app/layout.js (Added font links for visual appeal)

import './globals.css';
import { AuthProvider } from '../context/AuthContext';
import Header from '../components/Header';
import Footer from '../components/Footer';

export const metadata = {
  title: 'AnandaYog Meditation Centre: Inner Peace & Authentic Practice',
  description: 'Guided meditation, authentic yoga, and mindful living courses. Start your journey to tranquility today.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      {/* 
        NOTE: For best visual results, link Google Fonts (Playfair Display & Inter) 
        in the <head> of the document or update the CSS. 
        Assuming system fonts for this pasteable code.
      */}
      <body className="flex flex-col min-h-screen antialiased">
        <AuthProvider>
          <Header />
          {/* Increased padding on main for better visual spacing */}
          <main className="grow pt-4 pb-16"> 
            {children}
          </main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
