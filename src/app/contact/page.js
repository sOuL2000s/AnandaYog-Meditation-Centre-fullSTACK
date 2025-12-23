// src/app/contact/page.js
"use client";

import { useState } from 'react';

// Target email address provided by the user
const DIRECT_EMAIL = 'souparnopaulreborn@gmail.com';

export default function ContactPage() {
    const [status, setStatus] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    // New state to trigger the prominent fallback message
    const [submissionFailed, setSubmissionFailed] = useState(false); 

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setStatus('Sending...');
        setSubmissionFailed(false);
        
        // Retrieve the Web3Forms access key
        const accessKey = process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY;
        if (!accessKey) {
            setStatus('Configuration Error: Web3Forms access key is missing.');
            setSubmissionFailed(true);
            setIsSubmitting(false);
            return;
        }

        const formData = new FormData(e.target);
        // CRITICAL: Append the access key for Web3Forms
        formData.append("access_key", accessKey);
        // Optional: Add a subject line
        formData.append("subject", "New Contact Form Submission from AnandaYog");


        try {
            // POST request to the Web3Forms endpoint
            const response = await fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                body: formData,
            });

            const result = await response.json();

            if (result.success) {
                setStatus('Thank you! Your message has been received.');
                e.target.reset();
            } else {
                // Specific handling for submission failures (e.g., rate limits, errors)
                console.error("Web3Forms Submission Error:", result.message);
                
                // Set status and trigger the fallback visual
                setStatus(`Error: ${result.message || 'Failed to submit form.'}`);
                setSubmissionFailed(true);
            }
        } catch (error) {
            console.error("Network or Submission Error:", error);
            setStatus('Network error. Failed to connect to submission service.');
            setSubmissionFailed(true);
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
                        name="name" // Name attribute required for Web3Forms
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
                        name="email" // Name attribute required for Web3Forms
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
                        name="message" // Name attribute required for Web3Forms
                        rows="5"
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-brand-primary focus:border-brand-primary transition duration-150"
                    ></textarea>
                </div>

                <button
                    type="submit"
                    // Refactored button to use accent colors
                    className="w-full bg-brand-accent text-white font-bold py-3 rounded-lg hover:bg-brand-accent-darker transition duration-300 shadow-md disabled:opacity-50"
                    disabled={isSubmitting || status?.includes('Thank you')}
                >
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>
                
                {status && (
                    <p className={`mt-4 text-center text-sm font-medium ${status.includes('Thank you') ? 'text-status-success' : 'text-red-500'}`}>
                        {status}
                    </p>
                )}
            </form>
            
            {/* Direct Email Fallback Section */}
            <div className={`mt-8 pt-6 border-t border-gray-200 text-center transition-opacity duration-500`}>
                <p className="text-text-base mb-3">
                    {submissionFailed 
                        ? (
                            // Display user-requested fallback message
                            <span className="font-bold text-lg text-brand-primary">
                                There are too many requests right now. Please send us an email directly instead.
                            </span>
                        ) 
                        : "Prefer to email directly?"}
                </p>
                
                {/* Clickable Mailto Link */}
                <a 
                    href={`mailto:${DIRECT_EMAIL}?subject=Inquiry%20from%20AnandaYog%20Website`} 
                    className="text-lg font-bold text-brand-accent hover:text-brand-accent-darker hover:underline transition"
                >
                    {DIRECT_EMAIL}
                </a>
            </div>
        </div>

      </div>
    );
}