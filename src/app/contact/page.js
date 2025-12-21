// src/app/contact/page.js
"use client"; // Form handling usually requires a Client Component

import { useState } from 'react';

export default function ContactPage() {
    const [status, setStatus] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        setStatus('Sending...');
        
        // --- REAL WORLD TODO: 
        // Implement form submission logic here (e.g., using a serverless function)
        
        setTimeout(() => {
            setStatus('Thank you! Your message has been received.');
            e.target.reset();
        }, 2000);
    };

    return (
      <div className="container mx-auto p-8 sm:p-12 max-w-4xl">
        
        <div className="text-center mb-10">
            <h1 className="text-4xl font-serif font-extrabold text-indigo-800 mb-3">
                Connect With Us
            </h1>
            <p className="text-lg text-gray-600">
                We are here to answer your questions and guide your practice.
            </p>
        </div>

        <div className="bg-white p-8 rounded-xl shadow-2xl border border-gray-100">
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name
                    </label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                    />
                </div>
                
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address
                    </label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                    />
                </div>

                <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                        Your Message
                    </label>
                    <textarea
                        id="message"
                        name="message"
                        rows="4"
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                    ></textarea>
                </div>

                <button
                    type="submit"
                    className="w-full bg-green-600 text-white font-semibold py-3 rounded-lg hover:bg-green-700 transition disabled:opacity-50"
                    disabled={status.includes('Sending') || status.includes('received')}
                >
                    {status.includes('Sending') ? 'Sending...' : 'Send Message'}
                </button>
                
                {status && !status.includes('Sending') && (
                    <p className={`mt-4 text-center ${status.includes('received') ? 'text-green-600' : 'text-red-500'}`}>
                        {status}
                    </p>
                )}
            </form>
        </div>

      </div>
    );
}