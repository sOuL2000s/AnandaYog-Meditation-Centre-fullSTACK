// src/components/Header.js
"use client";

import Link from 'next/link';
import { useAuth } from '../context/AuthContext';

export default function Header() {
  const { currentUser, login, loading } = useAuth();

  return (
    <header className="bg-white shadow-lg sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-20"> {/* Slightly taller header */}
        {/* Logo/Title */}
        <Link href="/" className="text-3xl font-serif font-bold text-indigo-700 hover:text-purple-600 transition">
          AnandaYog
        </Link>

        {/* Navigation Links (Publicly accessible) */}
        <nav className="flex space-x-8">
          <Link href="/classes" className="text-gray-600 hover:text-indigo-600 font-medium transition">
            Classes
          </Link>
          <Link href="/about" className="text-gray-600 hover:text-indigo-600 font-medium transition">
            About Us
          </Link>
          <Link href="/pricing" className="text-gray-600 hover:text-indigo-600 font-medium transition">
            Pricing
          </Link>
          <Link href="/contact" className="text-gray-600 hover:text-indigo-600 font-medium transition">
            Contact
          </Link>
        </nav>

        {/* Auth Status / Action Button */}
        <div className="flex items-center space-x-4">
          {!loading && (
            currentUser ? (
              // Link to the /account page (which redirects to /dashboard if logged in)
              <Link href="/account" className="bg-purple-600 text-white py-2 px-5 rounded-full hover:bg-purple-700 transition duration-300 shadow">
                My Account
              </Link>
            ) : (
              <button 
                onClick={login}
                className="text-indigo-600 border border-indigo-600 py-2 px-5 rounded-full hover:bg-indigo-50 transition duration-300 font-medium"
              >
                Login / Join
              </button>
            )
          )}
        </div>
      </div>
    </header>
  );
}
