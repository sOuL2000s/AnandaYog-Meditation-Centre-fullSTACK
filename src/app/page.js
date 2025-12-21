// src/app/page.js
import Link from 'next/link';

// NOTE: Ensure you have a background image named /public/placeholder-serene.jpg
// for the best visual effect.

const BlissfulHero = () => (
  <section className="relative h-[600px] flex items-center justify-center overflow-hidden shadow-2xl">
    {/* Background Image & Overlay */}
    <div className="absolute inset-0">
      {/* Visual background placeholder. Replace with Image component or actual image URL */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition duration-1000 ease-in-out hover:scale-[1.01]" 
        style={{ backgroundImage: "url('/placeholder-serene.jpg')" }}
      ></div>
      {/* Deep, rich gradient overlay for the serene/spiritual feel */}
      <div className="absolute inset-0 bg-serene-gradient z-10 opacity-90"></div>
    </div>

    {/* Content */}
    <div className="relative z-20 text-center text-white p-6 max-w-5xl">
      <p className="text-xl font-light tracking-[0.3em] uppercase mb-4 opacity-90 text-indigo-200">
        THE ANANDAYOG CENTRE
      </p>
      <h1 className="text-6xl md:text-7xl font-extrabold font-serif leading-tight mb-6 drop-shadow-lg">
        Find Silence. Find Yourself.
      </h1>
      <p className="text-xl md:text-2xl font-light mb-12 opacity-95 max-w-3xl mx-auto">
        Guided meditation and authentic yoga practices to quiet the mind and foster lasting peace.
      </p>
      <Link 
        href="/pricing" 
        className="bg-emerald-500 text-white text-xl font-bold py-4 px-12 rounded-full hover:bg-emerald-600 transition duration-300 shadow-2xl border-2 border-white/50 transform hover:translate-y-[-2px]"
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

      <div className="container mx-auto px-6 lg:px-12 py-16">
        {/* Core Values Section */}
        <section className="py-8 text-center">
          <h2 className="text-4xl font-bold font-serif text-indigo-700 mb-4">Our Practice Pillars</h2>
          <p className="text-lg text-gray-500 max-w-4xl mx-auto mb-16">
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
        <section className="mt-20 text-center bg-purple-50 p-12 rounded-2xl shadow-2xl border-t-4 border-purple-400">
            <h2 className="text-4xl font-serif font-bold text-purple-700 mb-4">Ready for Inner Change?</h2>
            <p className="text-lg text-gray-700 mb-8 max-w-3xl mx-auto">
                Explore our full catalog of guided meditations, Hatha, and Vinyasa courses designed by master teachers.
            </p>
            <Link 
                href="/classes"
                className="bg-purple-600 text-white font-bold text-lg py-4 px-10 rounded-full hover:bg-purple-700 transition duration-300 shadow-lg"
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
    <div className="p-8 bg-white rounded-xl shadow-lg border border-gray-50 hover:shadow-xl transform hover:scale-[1.02] transition duration-300">
        <div className="text-4xl mb-4 p-3 bg-indigo-100 rounded-lg inline-block">{icon}</div>
        <h3 className="text-2xl font-semibold text-indigo-800 mb-3 font-serif">{title}</h3>
        <p className="text-gray-600">{description}</p>
    </div>
);
