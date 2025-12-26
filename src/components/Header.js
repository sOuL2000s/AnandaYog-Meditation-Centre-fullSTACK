// src/components/Header.js
"use client";

import Link from 'next/link';
import { useState } from 'react'; 
import { useAuth } from '../context/AuthContext';
import { usePathname } from 'next/navigation'; 

// Icons for mobile menu (DEFINITIONS MUST BE HERE)
const MenuIcon = ({ className = "w-6 h-6" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" /></svg>
);
const CloseIcon = ({ className = "w-6 h-6" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
);

// Moon/Sun Icons (DEFINITIONS MUST BE HERE)
const SunIcon = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
);

const MoonIcon = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
);


const ThemeToggle = () => {
  const { theme, toggleTheme } = useAuth();
  return (
    <button
        onClick={toggleTheme}
        // Refactored to use custom primary colors
        className="p-2 rounded-full text-brand-primary hover:bg-surface-2 transition"
        aria-label="Toggle Dark Mode"
    >
        {/* FIX: MoonIcon and SunIcon are now correctly defined above */}
        {theme === 'light' ? <MoonIcon className="w-6 h-6" /> : <SunIcon className="w-6 h-6" />}
    </button>
  );
};


export default function Header() {
  const { currentUser, login, loading, userData } = useAuth(); 
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); 
  const isSubscribed = userData?.isSubscribed;
  const pathname = usePathname(); 

  return (
    // Note on Tailwind warnings: Tailwind Intellisense suggests 'shrink-0' instead of 'flex-shrink-0'.
    // While both work in Tailwind 4, for canonical code, consider switching if you want to eliminate the warning,
    // but the functionality is identical. We will leave the existing class names to match the initial structure.
    <header className="bg-surface-1 shadow-lg sticky top-0 z-50 border-b border-gray-100 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-20"> 
        {/* Logo/Title */}
        <Link href="/" className="text-3xl font-serif font-extrabold text-brand-primary hover:text-brand-primary-darker transition tracking-tight">
          AnandaYog
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex space-x-8">
          <NavLink href="/teachings" pathname={pathname}>What We Teach</NavLink> 
          <NavLink href="/wisdom" pathname={pathname}>Wisdom</NavLink> 
          <NavLink href="/gita" pathname={pathname}>Bhagavad Gita</NavLink>
          <NavLink href="/about" pathname={pathname}>Our Story</NavLink>
          <NavLink href="/pricing" pathname={pathname}>Pricing</NavLink>
          <NavLink href="/contact" pathname={pathname}>Contact</NavLink>
        </nav>

        {/* Auth Status / Action Button (Desktop & Mobile) */}
        <div className="flex items-center space-x-2 sm:space-x-4 flex-shrink-0">
          
          {/* Theme Toggle */}
          <ThemeToggle /> 
          
          {!loading && (
            currentUser ? (
              <Link 
                href="/dashboard" 
                className={`text-sm sm:text-base text-white py-2 px-3 sm:px-5 rounded-full font-semibold transition duration-300 shadow-md whitespace-nowrap
                ${isSubscribed 
                    ? 'bg-status-success hover:bg-green-700' 
                    : 'bg-brand-primary hover:bg-brand-primary-darker'
                }`}
              >
                {isSubscribed ? 'My Access' : 'Dashboard'} 
              </Link>
            ) : (
              <button 
                onClick={login}
                className="text-sm sm:text-base text-brand-primary border-2 border-brand-primary py-2 px-3 sm:px-5 rounded-full hover:bg-surface-2 transition duration-300 font-medium shadow-sm whitespace-nowrap"
              >
                Login / Join
              </button>
            )
          )}
          
          {/* Mobile Menu Button */}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-brand-primary p-2 flex-shrink-0"
            aria-label="Toggle navigation"
          >
            {/* FIX: CloseIcon and MenuIcon are now correctly defined above */}
            {isMobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>
      
      {/* Mobile Menu Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute w-full bg-surface-1 shadow-lg border-t border-gray-100 dark:border-gray-700 pt-2 pb-4 z-40">
            <nav className="flex flex-col space-y-2 px-4">
                <MobileNavLink href="/teachings" onClick={() => setIsMobileMenuOpen(false)} pathname={pathname}>What We Teach</MobileNavLink>
                <MobileNavLink href="/wisdom" onClick={() => setIsMobileMenuOpen(false)} pathname={pathname}>Wisdom</MobileNavLink>
                <MobileNavLink href="/gita" onClick={() => setIsMobileMenuOpen(false)} pathname={pathname}>Bhagavad Gita</MobileNavLink>
                <MobileNavLink href="/about" onClick={() => setIsMobileMenuOpen(false)} pathname={pathname}>Our Story</MobileNavLink>
                <MobileNavLink href="/pricing" onClick={() => setIsMobileMenuOpen(false)} pathname={pathname}>Pricing</MobileNavLink>
                <MobileNavLink href="/contact" onClick={() => setIsMobileMenuOpen(false)} pathname={pathname}>Contact</MobileNavLink>
            </nav>
        </div>
      )}
    </header>
  );
}

const NavLink = ({ href, children, pathname }) => {
    // Determine if the current path (or its root) matches the link href
    const isActive = pathname === href || (pathname.startsWith(href) && href !== '/');
    
    // Theme-relevant styling for active link: primary text and a thick underline
    const activeClass = isActive 
        ? 'text-brand-primary font-bold border-b-2 border-brand-primary' 
        : 'text-text-muted hover:text-brand-primary';

    return (
        <Link 
            href={href} 
            className={`font-medium text-lg transition duration-200 pb-1 ${activeClass}`}
        >
            {children}
        </Link>
    );
};

const MobileNavLink = ({ href, children, onClick, pathname }) => {
    const isActive = pathname === href || (pathname.startsWith(href) && href !== '/');
    
    const activeClass = isActive 
        ? 'bg-surface-2 text-brand-primary font-bold border-l-4 border-brand-primary' 
        : 'text-text-base hover:bg-surface-2';
        
    return (
        <Link 
            href={href} 
            onClick={onClick} 
            className={`block px-3 py-2 rounded-md text-base font-medium ${activeClass}`}
        >
            {children}
        </Link>
    );
};