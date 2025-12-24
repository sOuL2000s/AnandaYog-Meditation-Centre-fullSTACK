// src/app/teachings/page.js
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

const TEACHING_PRINCIPLES = [
    { 
        title: "The Eightfold Path", 
        description: "Practices rooted in Patanjali's Yoga Sutras, focusing on mental and ethical discipline (Raja Yoga)."
    },
    { 
        title: "Prana & Breathwork", 
        description: "Mastering life force (Pranayama) through structured breathing techniques for energy control and calm."
    },
    { 
        title: "Vipassana Meditation", 
        description: "The traditional method of insight meditation, focusing on deep, non-judgmental awareness of body sensations."
    },
    { 
        title: "Hatha & Vinyasa", 
        description: "Physical practices (Asana) blended into gentle Hatha flows and dynamic Vinyasa sequences for body integration."
    },
];

const CoursePillars = () => (
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
        {TEACHING_PRINCIPLES.map((pillar, index) => (
            <div 
                key={index} 
                // Refactored background to Surface 1
                className="bg-surface-1 p-6 rounded-xl shadow-lg border-t-4 border-brand-accent transform hover:scale-[1.03] transition duration-300"
            >
                <h3 className="text-xl font-semibold font-serif text-brand-primary mb-2">{pillar.title}</h3>
                <p className="text-text-base text-sm">{pillar.description}</p>
            </div>
        ))}
    </div>
);

export default function TeachingsPage() {
    return (
        <div className="container mx-auto p-8 max-w-6xl">
            {/* Hero Section */}
            <header className="text-center mb-16 pt-8">
                <h1 className="text-5xl font-serif font-extrabold text-brand-primary mb-4">
                    The AnandaYog Path: What We Teach
                </h1>
                <p className="text-xl text-text-muted max-w-4xl mx-auto">
                    We offer an integrated approach to ancient wisdom, guiding you from foundational breathwork to deep self-inquiry and liberation.
                </p>
            </header>

            {/* Teaching Pillars */}
            <section className="mb-16">
                <h2 className="text-3xl font-bold font-serif text-brand-primary mb-8 text-center">
                    Our Four Pillars of Practice
                </h2>
                <CoursePillars />
            </section>

            {/* Course Methodology */}
            <section className="bg-surface-2 p-10 rounded-2xl shadow-inner border-l-4 border-brand-primary">
                <h2 className="text-3xl font-bold font-serif text-brand-primary mb-4">
                    Our Course Methodology
                </h2>
                <div className="space-y-6 text-text-base">
                    <p>
                        All our premium courses are structured to facilitate growth at your own pace. Content is delivered via high-quality video, audio, and supplementary text guides. Access to our entire library is unlocked through a single monthly or annual subscription.
                    </p>
                    <ul className="list-disc list-inside ml-4 space-y-2">
                        {/* FIX: Corrected the text formatting for bolding using Tailwind class */}
                        <li><span className="font-bold">Foundational Courses:</span> Accessible to all (even free tier) to establish the basics.</li>
                        <li><span className="font-bold">Deep Dive Modules:</span> Reserved for subscribed members, providing structured paths in specific disciplines like Vipassana or Ashtanga.</li>
                        <li><span className="font-bold">Progress Tracking:</span> Your completion status is saved in real-time to your dashboard.</li>
                    </ul>
                </div>
                
                <div className="mt-8 text-center">
                    <Link 
                        href="/pricing"
                        // Refactored CTA to use custom accent colors
                        className="inline-block bg-brand-accent text-white font-bold text-lg py-4 px-10 rounded-full hover:bg-brand-accent-darker transition duration-300 shadow-lg"
                    >
                        See Subscription Plans
                    </Link>
                </div>
            </section>
        </div>
    );
}