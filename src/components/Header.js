// src/components/Header.js
"use client";

import Link from 'next/link';
import { useAuth } from '../context/AuthContext';

export default function Header() {
  const { currentUser, login, loading, userData } = useAuth();
  
  const isSubscribed = userData?.isSubscribed;

  return (
    <header className="bg-white shadow-xl sticky top-0 z-20 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-20"> 
        {/* Logo/Title */}
        <Link href="/" className="text-3xl font-serif font-extrabold text-indigo-800 hover:text-purple-600 transition tracking-tight">
          AnandaYog
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex space-x-8">
          <NavLink href="/classes">Classes</NavLink>
          <NavLink href="/about">Our Story</NavLink>
          <NavLink href="/pricing">Pricing</NavLink>
          <NavLink href="/contact">Contact</NavLink>
        </nav>

        {/* Auth Status / Action Button */}
        <div className="flex items-center space-x-4">
          {!loading && (
            currentUser ? (
              // If logged in, button shows subscription status
              <Link 
                href="/dashboard" 
                className={`text-white py-2 px-5 rounded-full font-semibold transition duration-300 shadow-md ${isSubscribed ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-purple-600 hover:bg-purple-700'}`}
              >
                {isSubscribed ? 'Subscription Active' : 'My Dashboard'}
              </Link>
            ) : (
              <button 
                onClick={login}
                className="text-indigo-700 border-2 border-indigo-700 py-2 px-5 rounded-full hover:bg-indigo-50 transition duration-300 font-medium shadow-sm"
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

const NavLink = ({ href, children }) => (
    <Link href={href} className="text-gray-600 hover:text-indigo-600 font-medium text-lg transition duration-200">
        {children}
    </Link>
);

