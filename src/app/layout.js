// src/app/layout.js (Modified)

import './globals.css';
import { AuthProvider } from '../context/AuthContext';
import Header from '../components/Header';
import Footer from '../components/Footer';

export const metadata = {
  title: 'AnandaYog Meditation Centre',
  description: 'Find inner peace through meditation and yoga.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen">
        {/* Wrap everything in the AuthProvider */}
        <AuthProvider>
          <Header />
          {/* Changed 'flex-grow' to 'grow' */}
          <main className="grow"> 
            {children}
          </main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
