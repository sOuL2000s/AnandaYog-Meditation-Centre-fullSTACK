// src/app/policy/page.js
// Request #7: Privacy Policy Content

import Link from 'next/link';

export default function PolicyPage() {
    return (
        <div className="container mx-auto p-8 max-w-4xl">
            <h1 className="text-4xl font-serif font-bold text-brand-primary mb-6">Privacy Policy</h1>
            <p className="text-sm italic text-red-600 dark:text-red-400 mb-6">
                NOTE: This is a legal template for demonstration purposes. Please consult with a legal professional before deploying this policy in a live environment.
            </p>

            <section className="space-y-4 text-text-base">
                <h2 className="text-2xl font-semibold text-brand-primary mt-6">1. Information We Collect</h2>
                <p>
                    We collect personal information that you voluntarily provide to us when you register on the Services, express an interest in obtaining information about us or our products and Services, when you participate in activities on the Services, or otherwise when you contact us.
                </p>
                <ul className="list-disc list-inside ml-4">
                    <li>**Personal Information:** Email address (for login via Google Authentication), display name, and unique user ID (UID).</li>
                    <li>**Payment Data:** We do not store full credit card details. Payment processing is handled securely by Razorpay, and we only retain the payment ID, order ID, and signature for verification purposes.</li>
                    <li>**Usage Data:** Subscription status, expiration date, completed lessons, and theme preference.</li>
                </ul>

                <h2 className="text-2xl font-semibold text-brand-primary mt-6">2. How We Use Your Information</h2>
                <p>
                    We use the information we collect or receive for the following purposes:
                </p>
                <ul className="list-disc list-inside ml-4">
                    <li>To facilitate account creation and login process.</li>
                    <li>To determine your access level (free vs. premium content).</li>
                    <li>To track your course progress and store your subscription history.</li>
                    <li>To send you administrative information, such as service changes and policy updates.</li>
                    <li>To respond to your inquiries (via the Contact Form API endpoint).</li>
                </ul>

                <h2 className="text-2xl font-semibold text-brand-primary mt-6">3. Data Security</h2>
                <p>
                    We have implemented appropriate security measures designed to protect the security of any personal information we process. However, despite our safeguards and efforts to secure your information, no electronic transmission over the Internet or information storage technology can be guaranteed to be 100% secure.
                </p>
                
                <h2 className="text-2xl font-semibold text-brand-primary mt-6">4. Contact Us</h2>
                <p>
                    If you have questions or comments about this policy, you may contact us via our <Link href="/contact" className="text-brand-primary hover:underline">Contact Page</Link>.
                </p>
            </section>
        </div>
    );
}