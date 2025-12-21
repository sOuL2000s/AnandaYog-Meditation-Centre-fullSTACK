// src/components/Header.js
"use client";

import Link from 'next/link';
import { useState } from 'react'; 
import { useAuth } from '../context/AuthContext';

// Icons for mobile menu
const MenuIcon = ({ className = "w-6 h-6" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" /></svg>
);
const CloseIcon = ({ className = "w-6 h-6" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
);

export default function Header() {
  const { currentUser, login, loading, userData } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State for mobile menu
  
  const isSubscribed = userData?.isSubscribed;

  return (
    <header className="bg-white shadow-xl sticky top-0 z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-20"> 
        {/* Logo/Title */}
        <Link href="/" className="text-3xl font-serif font-extrabold text-teal-800 hover:text-teal-600 transition tracking-tight">
          AnandaYog
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex space-x-8">
          <NavLink href="/classes">Classes</NavLink>
          <NavLink href="/about">Our Story</NavLink>
          <NavLink href="/pricing">Pricing</NavLink>
          <NavLink href="/contact">Contact</NavLink>
        </nav>

        {/* Auth Status / Action Button (Desktop & Mobile) */}
        <div className="flex items-center space-x-4">
          {!loading && (
            currentUser ? (
              // If logged in, button directs to Dashboard
              <Link 
                href="/dashboard" 
                className={`text-white py-2 px-5 rounded-full font-semibold transition duration-300 shadow-md ${isSubscribed ? 'bg-green-600 hover:bg-green-700' : 'bg-teal-600 hover:bg-teal-700'}`}
              >
                {isSubscribed ? 'Subscription Active' : 'My Dashboard'}
              </Link>
            ) : (
              <button 
                onClick={login}
                className="text-teal-700 border-2 border-teal-700 py-2 px-5 rounded-full hover:bg-teal-50 transition duration-300 font-medium shadow-sm"
              >
                Login / Join
              </button>
            )
          )}
          
          {/* Mobile Menu Button */}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-teal-700 p-2"
            aria-label="Toggle navigation"
          >
            {isMenuOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>
      
      {/* Mobile Menu Drawer */}
      {isMenuOpen && (
        <div className="md:hidden absolute w-full bg-white shadow-lg border-t border-gray-100 pt-2 pb-4 z-40">
            <nav className="flex flex-col space-y-2 px-4">
                <MobileNavLink href="/classes" onClick={() => setIsMenuOpen(false)}>Classes</MobileNavLink>
                <MobileNavLink href="/about" onClick={() => setIsMenuOpen(false)}>Our Story</MobileNavLink>
                <MobileNavLink href="/pricing" onClick={() => setIsMenuOpen(false)}>Pricing</MobileNavLink>
                <MobileNavLink href="/contact" onClick={() => setIsMenuOpen(false)}>Contact</MobileNavLink>
            </nav>
        </div>
      )}
    </header>
  );
}

const NavLink = ({ href, children }) => (
    <Link href={href} className="text-gray-600 hover:text-teal-600 font-medium text-lg transition duration-200">
        {children}
    </Link>
);

const MobileNavLink = ({ href, children, onClick }) => (
    <Link href={href} onClick={onClick} className="block px-3 py-2 text-gray-700 hover:bg-teal-50 rounded-md text-base font-medium">
        {children}
    </Link>
);