// src/app/contact/page.js
"use client";

import { useState } from 'react';

export default function ContactPage() {
    const [status, setStatus] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setStatus('Sending...');
        
        const formData = {
            name: e.target.name.value,
            email: e.target.email.value,
            message: e.target.message.value,
        };

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                setStatus('Thank you! Your message has been received.');
                e.target.reset();
            } else {
                const errorData = await response.json();
                setStatus(`Error: ${errorData.error || 'Failed to submit form.'}`);
            }
        } catch (error) {
            setStatus('Network error. Please try again later.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
      <div className="container mx-auto p-8 max-w-4xl">
        
        <div className="text-center mb-12">
            <h1 className="text-5xl font-serif font-extrabold text-brand-primary mb-4">
                Connect With Us
            </h1>
            <p className="text-xl text-text-muted">
                We are here to answer your questions and guide your practice.
            </p>
        </div>

        {/* Refactored background to Surface 1 */}
        <div className="bg-surface-1 p-10 rounded-2xl shadow-2xl border border-gray-100">
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="name" className="block text-sm font-semibold text-text-base mb-1">
                        Full Name
                    </label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-brand-primary focus:border-brand-primary transition duration-150"
                    />
                </div>
                
                <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-text-base mb-1">
                        Email Address
                    </label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-brand-primary focus:border-brand-primary transition duration-150"
                    />
                </div>

                <div>
                    <label htmlFor="message" className="block text-sm font-semibold text-text-base mb-1">
                        Your Message
                    </label>
                    <textarea
                        id="message"
                        name="message"
                        rows="5"
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-brand-primary focus:border-brand-primary transition duration-150"
                    ></textarea>
                </div>

                <button
                    type="submit"
                    // Refactored button to use accent colors
                    className="w-full bg-brand-accent text-white font-bold py-3 rounded-lg hover:bg-brand-accent-darker transition duration-300 shadow-md disabled:opacity-50"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>
                
                {status && (
                    <p className={`mt-4 text-center text-sm font-medium ${status.includes('Thank you') ? 'text-status-success' : 'text-red-500'}`}>
                        {status}
                    </p>
                )}
            </form>
        </div>

      </div>
    );
}