// src/app/page.js
import Link from 'next/link';

// NOTE: Ensure you have a background image named /public/placeholder-serene.jpg
// for the best visual effect.

const BlissfulHero = () => (
  // FIX: Changed h-[600px] to the canonical h-150 and hover:translate-y-[-2px] to hover:-translate-y-0.5
  <section className="relative h-150 flex items-center justify-center overflow-hidden shadow-2xl">
    {/* Background Image & Overlay */}
    <div className="absolute inset-0">
      <div 
        className="absolute inset-0 bg-cover bg-center transition duration-1000 ease-in-out hover:scale-[1.01]" 
        style={{ backgroundImage: "url('/placeholder-serene.jpg')" }}
      ></div>
      <div className="absolute inset-0 bg-serene-gradient z-10 opacity-90"></div>
    </div>

    {/* Content */}
    <div className="relative z-20 text-center text-white p-6 max-w-5xl">
      <p className="text-sm sm:text-lg font-light tracking-[0.3em] uppercase mb-4 opacity-90 text-teal-200">
        THE ANANDAYOG CENTRE
      </p>
      {/* Responsive font size adjustment */}
      <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold font-serif leading-tight mb-6 drop-shadow-lg">
        Find Silence. Find Yourself.
      </h1>
      <p className="text-lg md:text-2xl font-light mb-12 opacity-95 max-w-3xl mx-auto">
        Guided meditation and authentic yoga practices to quiet the mind and foster lasting peace.
      </p>
      <Link 
        href="/dashboard" // Changed to point to dashboard for login/status check
        // Refactored to use custom accent colors
        className="bg-brand-accent text-white text-xl font-bold py-4 px-12 rounded-full hover:bg-brand-accent-darker transition duration-300 shadow-2xl border-2 border-white/50 transform hover:-translate-y-0.5"
      >
        Start 7 Days Free
      </Link>
    </div>
  </section>
);


export default function HomePage() {
  return (
    <>
      <BlissfulHero />

      {/* Increased padding for more breathing room (UX Improvement) */}
      <div className="container mx-auto px-6 lg:px-12 py-20"> 
        {/* Core Values Section */}
        <section className="py-8 text-center">
          {/* Refactored text color */}
          <h2 className="text-4xl font-bold font-serif text-brand-primary mb-4">Our Practice Pillars</h2>
          <p className="text-lg text-surface-muted max-w-4xl mx-auto mb-16">
            AnandaYog is built on principles of authenticity, community, and accessible guidance for all levels of practitioners.
          </p>

          <div className="grid md:grid-cols-3 gap-10 text-left">
            <ValueCard 
              icon="🌿"
              title="Grounded in Tradition"
              description="Practices rooted in ancient texts, modernized for today's busy world."
            />
            <ValueCard 
              icon="🧘"
              title="Accessible Guidance"
              description="Courses structured clearly, perfect for beginners and deep divers alike."
            />
            <ValueCard 
              icon="✨"
              title="Transformative Results"
              description="Tools designed to integrate profound peace and mindfulness into daily life."
            />
          </div>
        </section>
        
        {/* Featured Courses Call to Action */}
        {/* Refactored background/border colors to Surface 2 and Primary */}
        <section className="mt-20 text-center bg-surface-2 p-12 rounded-2xl shadow-2xl border-t-4 border-brand-primary">
            {/* Refactored text color */}
            <h2 className="text-4xl font-serif font-bold text-brand-primary mb-4">Ready for Inner Change?</h2>
            <p className="text-lg text-text-base mb-8 max-w-3xl mx-auto">
                Explore our full catalog of guided meditations, Hatha, and Vinyasa courses designed by master teachers.
            </p>
            <Link 
                href="/classes"
                // Refactored CTA to use custom accent colors
                className="bg-brand-accent text-white font-bold text-lg py-4 px-10 rounded-full hover:bg-brand-accent-darker transition duration-300 shadow-lg"
            >
                View All Courses
            </Link>
        </section>

      </div>
    </>
  );
}

// Helper Component (Updated Styling)
const ValueCard = ({ icon, title, description }) => (
    // Refactored background to Surface 1
    <div className="p-8 bg-surface-1 rounded-xl shadow-lg border border-gray-50 hover:shadow-xl transform hover:scale-[1.02] transition duration-300">
        {/* Refactored background color */}
        <div className="text-4xl mb-4 p-3 bg-surface-2 rounded-lg inline-block">{icon}</div>
        {/* Refactored text color */}
        <h3 className="text-2xl font-semibold text-brand-primary mb-3 font-serif">{title}</h3>
        {/* Refactored text color */}
        <p className="text-text-base">{description}</p>
    </div>
);