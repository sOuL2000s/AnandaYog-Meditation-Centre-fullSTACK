// src/app/page.js
import Link from 'next/link';
import Image from 'next/image';

// Placeholder for a serene image (Assume it's in /public/hero-image.jpg)
// You should place a calming image (e.g., sunrise, nature, person meditating) 
// at public/hero-image.jpg for the best effect.

const BlissfulHero = () => (
  <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
    {/* Background Image Placeholder (Replace with your own image in public/hero-image.jpg) */}
    <div className="absolute inset-0">
      {/* 
        NOTE: For deployment, replace the Image component with a simple img tag 
        if you don't have a specific hero-image.jpg file yet.
      */}
      <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/70 to-purple-800/60 z-10"></div>
      <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('/placeholder-serene.jpg')" }}></div>
    </div>

    {/* Content */}
    <div className="relative z-20 text-center text-white p-6 max-w-4xl">
      <p className="text-xl font-light tracking-widest uppercase mb-4 opacity-90">
        Discover Your Sanctuary
      </p>
      <h1 className="text-6xl md:text-7xl font-extrabold font-serif leading-tight mb-6">
        The Journey to Inner Peace Starts Now
      </h1>
      <p className="text-xl md:text-2xl font-light mb-10 opacity-95">
        Guided meditation and authentic yoga practices designed to quiet the mind and nourish the soul.
      </p>
      <Link 
        href="/classes" 
        className="bg-purple-500 text-white text-xl font-semibold py-4 px-10 rounded-full hover:bg-purple-600 transition duration-300 shadow-xl border-2 border-white/50"
      >
        Explore Our Offerings
      </Link>
    </div>
  </section>
);


// This is a Server Component, excellent for SEO/speed
export default function HomePage() {
  return (
    <>
      <BlissfulHero />

      <div className="container mx-auto p-8 sm:p-12">
        {/* Core Values Section */}
        <section className="py-16 text-center">
          <h2 className="text-4xl font-bold text-indigo-800 mb-4 font-serif">Our Philosophy</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-12">
            AnandaYog is built on principles of authenticity, community, and accessible guidance for all levels of practitioners.
          </p>

          <div className="grid md:grid-cols-3 gap-8 text-left">
            <ValueCard 
              icon="🧘‍♀️"
              title="Authentic Practice"
              description="Rooted in ancient tradition, delivered with modern clarity."
            />
            <ValueCard 
              icon="✨"
              title="Accessible to All"
              description="Courses for absolute beginners to advanced deep-dive retreats."
            />
            <ValueCard 
              icon="🌿"
              title="Mindful Living"
              description="Tools to integrate peace and presence into your daily life."
            />
          </div>
        </section>
        
        {/* Call to Action for About Page */}
        <section className="mt-16 text-center bg-green-50 p-10 rounded-xl shadow-inner">
            <h2 className="text-3xl font-bold text-sage-800 mb-4">Ready to Begin?</h2>
            <p className="text-lg text-gray-700 mb-6">
                Meet our dedicated teachers and learn more about our centre&apos;s mission.
            </p>
            <Link 
                href="/about"
                className="bg-green-600 text-white font-semibold py-3 px-8 rounded-full hover:bg-green-700 transition duration-300"
            >
                Read Our Story
            </Link>
        </section>

      </div>
    </>
  );
}

// Helper Component for consistency
const ValueCard = ({ icon, title, description }) => (
    <div className="p-6 bg-white rounded-lg shadow-md border border-gray-100">
        <div className="text-4xl mb-4">{icon}</div>
        <h3 className="text-xl font-semibold text-indigo-700 mb-2">{title}</h3>
        <p className="text-gray-600">{description}</p>
    </div>
);
