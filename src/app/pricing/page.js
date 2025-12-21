// src/app/pricing/page.js

import Link from 'next/link';

export default function PricingPage() {
  return (
    <div className="container mx-auto p-8 text-center">
      <h1 className="text-4xl font-serif font-bold text-teal-800 mb-10">
        Choose Your Path to Peace
      </h1>

      <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
        {/* Tier 1: Free */}
        <div className="bg-white p-8 rounded-xl shadow-2xl border-2 border-gray-100 transform hover:scale-105 transition duration-300">
          <h2 className="text-2xl font-bold text-gray-700 mb-2">Explorer</h2>
          <p className="text-4xl font-extrabold text-green-600 mb-6">Free</p>
          <ul className="text-left space-y-3 text-gray-600 mb-8">
            <li>✓ Access to 5 Foundational Videos</li>
            <li>✓ Weekly Newsletter</li>
            <li className="text-gray-400">✗ Unlimited Course Access</li>
          </ul>
          <Link 
            href="/classes" 
            className="w-full inline-block bg-gray-300 text-gray-800 py-3 rounded-lg font-semibold hover:bg-gray-400 transition"
          >
            Start Learning
          </Link>
        </div>

        {/* Tier 2: Monthly Subscription (Primary Teal/Gold CTA) */}
        <div className="bg-teal-50 p-8 rounded-xl shadow-2xl border-2 border-teal-600 transform hover:scale-105 transition duration-300">
          <p className="text-sm font-semibold text-white bg-teal-600 inline-block px-3 py-1 rounded-full mb-4">Recommended</p>
          <h2 className="text-2xl font-bold text-teal-800 mb-2">Yogi Monthly</h2>
          <p className="text-4xl font-extrabold text-teal-600 mb-6">₹500/mo</p>
          <ul className="text-left space-y-3 text-gray-700 mb-8">
            <li>✓ All Free Tier benefits</li>
            <li>✓ Unlimited Course Access</li>
            <li>✓ Live Q&A Sessions (Weekly)</li>
          </ul>
          <Link 
            href="/dashboard" 
            className="w-full inline-block bg-amber-500 text-white py-3 rounded-lg font-semibold hover:bg-amber-600 transition shadow-lg"
          >
            Subscribe Now
          </Link>
        </div>

        {/* Tier 3: Annual Subscription */}
        <div className="bg-white p-8 rounded-xl shadow-2xl border-2 border-gray-100 transform hover:scale-105 transition duration-300">
          <h2 className="text-2xl font-bold text-gray-700 mb-2">Yogi Annual</h2>
          <p className="text-4xl font-extrabold text-teal-700 mb-1">₹4,800/yr</p>
          {/* Added savings text */}
          <p className="text-sm text-green-600 mb-6 font-medium">(Save ₹1,200 - 2 Months Free!)</p> 
          <ul className="text-left space-y-3 text-gray-600 mb-8">
            <li>✓ All Monthly benefits</li>
            <li>✓ 2 Months Free (Included)</li>
            <li>✓ Private Member Community</li>
          </ul>
          <Link 
            href="/dashboard" 
            className="w-full inline-block bg-teal-600 text-white py-3 rounded-lg font-semibold hover:bg-teal-700 transition"
          >
            Go Annual
          </Link>
        </div>
      </div>
    </div>
  );
}