// src/app/pricing/page.js

import Link from 'next/link';

export default function PricingPage() {
  return (
    <div className="container mx-auto p-8 text-center">
      <h1 className="text-4xl font-serif font-bold text-brand-primary mb-10">
        Choose Your Path to Peace
      </h1>

      <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
        {/* Tier 1: Free (Refactored to Surface 1) */}
        <div className="bg-surface-1 p-8 rounded-xl shadow-2xl border-2 border-gray-200 transform hover:scale-105 transition duration-300">
          <h2 className="text-2xl font-bold text-text-base mb-2">Explorer</h2>
          <p className="text-4xl font-extrabold text-status-success mb-6">Free</p>
          <ul className="text-left space-y-3 text-text-muted mb-8">
            <li className="text-text-base">✓ Access to 5 Foundational Videos</li>
            <li className="text-text-base">✓ Weekly Newsletter</li>
            <li className="text-text-muted">✗ Unlimited Course Access</li>
          </ul>
          <Link 
            href="/classes" 
            className="w-full inline-block bg-surface-2 text-text-base py-3 rounded-lg font-semibold hover:bg-gray-300 transition"
          >
            Start Learning
          </Link>
        </div>

        {/* Tier 2: Monthly Subscription (Primary Accent Card) */}
        <div className="bg-surface-1 p-8 rounded-xl shadow-2xl border-2 border-brand-accent transform hover:scale-105 transition duration-300">
          <p className="text-sm font-semibold text-white bg-brand-accent inline-block px-3 py-1 rounded-full mb-4">Recommended</p>
          <h2 className="text-2xl font-bold text-brand-primary mb-2">Yogi Monthly</h2>
          <p className="text-4xl font-extrabold text-brand-accent mb-6">₹500/mo</p>
          <ul className="text-left space-y-3 text-text-base mb-8">
            <li>✓ All Free Tier benefits</li>
            <li>✓ Unlimited Course Access</li>
            <li>✓ Live Q&A Sessions (Weekly)</li>
          </ul>
          <Link 
            href="/dashboard" 
            className="w-full inline-block bg-brand-accent text-white py-3 rounded-lg font-semibold hover:bg-brand-accent-darker transition shadow-lg"
          >
            Subscribe Now
          </Link>
        </div>

        {/* Tier 3: Annual Subscription (Primary Brand Card) */}
        <div className="bg-surface-1 p-8 rounded-xl shadow-2xl border-2 border-brand-primary transform hover:scale-105 transition duration-300">
          <h2 className="text-2xl font-bold text-brand-primary mb-2">Yogi Annual</h2>
          <p className="text-4xl font-extrabold text-brand-primary mb-1">₹4,800/yr</p>
          {/* Added savings text */}
          <p className="text-sm text-status-success mb-6 font-medium">(Save ₹1,200 - 2 Months Free!)</p> 
          <ul className="text-left space-y-3 text-text-base mb-8">
            <li>✓ All Monthly benefits</li>
            <li>✓ 2 Months Free (Included)</li>
            <li>✓ Private Member Community</li>
          </ul>
          <Link 
            href="/dashboard" 
            className="w-full inline-block bg-brand-primary text-white py-3 rounded-lg font-semibold hover:bg-brand-primary-darker transition"
          >
            Go Annual
          </Link>
        </div>
      </div>
    </div>
  );
}