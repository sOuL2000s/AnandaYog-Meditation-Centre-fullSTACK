// src/app/terms/page.js
// Request #7: Terms of Service Content

import Link from 'next/link';

export default function TermsPage() {
    return (
        <div className="container mx-auto p-8 max-w-4xl">
            <h1 className="text-4xl font-serif font-bold text-brand-primary mb-6">Terms of Service</h1>
            <p className="text-sm italic text-red-600 dark:text-red-400 mb-6">
                NOTE: This is a legal template for demonstration purposes. Please consult with a legal professional before deploying these terms in a live environment.
            </p>

            <section className="space-y-4 text-text-base">
                <h2 className="text-2xl font-semibold text-brand-primary mt-6">1. Agreement to Terms</h2>
                <p>
                    By accessing or using our website and services (AnandaYog), you agree to be bound by these Terms of Service (&quot;Terms&quot;). If you disagree with any part of the terms, then you may not access the Service.
                </p>

                <h2 className="text-2xl font-semibold text-brand-primary mt-6">2. Subscription and Payments</h2>
                <p>
                    Some parts of the Service are billed on a subscription basis (&quot;Subscription&quot;). You will be billed in advance on a recurring, periodic basis (such as monthly or annually). Payment processing is handled by Razorpay. Failure to pay may result in the termination of your subscription access.
                </p>

                <h2 className="text-2xl font-semibold text-brand-primary mt-6">3. Content and Intellectual Property</h2>
                <p>
                    All content provided on AnandaYog, including course videos, text, graphics, and logos, are the property of AnandaYog and are protected by copyright laws. You may not reproduce, redistribute, or create derivative works from the content without explicit written permission.
                </p>

                <h2 className="text-2xl font-semibold text-brand-primary mt-6">4. Limitation of Liability</h2>
                <p>
                    The Service is provided on an &quot;AS IS&quot; and &quot;AS AVAILABLE&quot; basis. AnandaYog makes no representations or warranties of any kind, express or implied, as to the operation of their services, or the information, content or materials included therein. You expressly agree that your use of the Service is at your sole risk.
                </p>
                
                <h2 className="text-2xl font-semibold text-brand-primary mt-6">5. Changes to Terms</h2>
                <p>
                    We reserve the right, at our sole discretion, to modify or replace these Terms at any time. We will provide at least 30 days notice before any new terms take effect.
                </p>
            </section>
        </div>
    );
}