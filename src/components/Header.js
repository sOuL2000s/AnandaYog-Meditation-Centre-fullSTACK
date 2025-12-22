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

// Moon/Sun Icons
const SunIcon = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
);

const MoonIcon = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
);

// FIX: Moved ThemeToggle outside the Header component function
const ThemeToggle = () => {
  const { theme, toggleTheme } = useAuth();
  return (
    <button
        onClick={toggleTheme}
        className="p-2 rounded-full text-teal-700 hover:bg-teal-50 dark:text-amber-300 dark:hover:bg-gray-700 transition"
        aria-label="Toggle Dark Mode"
    >
        {theme === 'light' ? <MoonIcon className="w-6 h-6" /> : <SunIcon className="w-6 h-6" />}
    </button>
  );
};


export default function Header() {
  const { currentUser, login, loading, userData } = useAuth(); 
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); 
  // FIX: Use optional chaining safely
  const isSubscribed = userData?.isSubscribed;

  return (
    <header className="bg-white dark:bg-gray-800 shadow-lg sticky top-0 z-50 border-b border-gray-100 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-20"> 
        {/* Logo/Title */}
        <Link href="/" className="text-3xl font-serif font-extrabold text-teal-800 hover:text-teal-600 transition tracking-tight dark:text-teal-400">
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
        {/* Use flex-shrink-0 on the button group to prevent clipping */}
        <div className="flex items-center space-x-2 sm:space-x-4 flex-shrink-0">
          
          {/* Theme Toggle */}
          <ThemeToggle /> 
          
          {!loading && (
            currentUser ? (
              // If logged in, button directs to Dashboard
              <Link 
                href="/dashboard" 
                className={`text-sm sm:text-base text-white py-2 px-3 sm:px-5 rounded-full font-semibold transition duration-300 shadow-md whitespace-nowrap
                ${isSubscribed 
                    ? 'bg-green-600 hover:bg-green-700 dark:bg-green-500' 
                    : 'bg-teal-600 hover:bg-teal-700 dark:bg-teal-700'
                }`}
              >
                {/* FIX: Shortened text for mobile screens */}
                {isSubscribed ? 'My Access' : 'Dashboard'} 
              </Link>
            ) : (
              <button 
                onClick={login}
                // FIX: Added sm:text-base for mobile scaling
                className="text-sm sm:text-base text-teal-700 border-2 border-teal-700 py-2 px-3 sm:px-5 rounded-full hover:bg-teal-50 transition duration-300 font-medium shadow-sm dark:text-teal-400 dark:border-teal-400 dark:hover:bg-gray-700 whitespace-nowrap"
              >
                Login / Join
              </button>
            )
          )}
          
          {/* Mobile Menu Button */}
          {/* FIX: Ensure the button has space and is not clipped */}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-teal-700 p-2 dark:text-teal-400 flex-shrink-0"
            aria-label="Toggle navigation"
          >
            {isMobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>
      
      {/* Mobile Menu Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute w-full bg-white dark:bg-gray-800 shadow-lg border-t border-gray-100 dark:border-gray-700 pt-2 pb-4 z-40">
            <nav className="flex flex-col space-y-2 px-4">
                <MobileNavLink href="/classes" onClick={() => setIsMobileMenuOpen(false)}>Classes</MobileNavLink>
                <MobileNavLink href="/about" onClick={() => setIsMobileMenuOpen(false)}>Our Story</MobileNavLink>
                <MobileNavLink href="/pricing" onClick={() => setIsMobileMenuOpen(false)}>Pricing</MobileNavLink>
                <MobileNavLink href="/contact" onClick={() => setIsMobileMenuOpen(false)}>Contact</MobileNavLink>
            </nav>
        </div>
      )}
    </header>
  );
}

const NavLink = ({ href, children }) => (
    <Link href={href} className="text-gray-600 hover:text-teal-600 font-medium text-lg transition duration-200 dark:text-gray-300 dark:hover:text-teal-400">
        {children}
    </Link>
);

const MobileNavLink = ({ href, children, onClick }) => (
    <Link href={href} onClick={onClick} className="block px-3 py-2 text-gray-700 hover:bg-teal-50 rounded-md text-base font-medium dark:text-gray-200 dark:hover:bg-gray-700">
        {children}
    </Link>
);