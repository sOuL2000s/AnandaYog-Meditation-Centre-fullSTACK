import Image from 'next/image';

export default function AboutPage() {
    return (
      <div className="container mx-auto p-8 sm:p-12">
        
        {/* Hero Section - Changed background and text colors */}
        <div className="bg-teal-50 p-10 rounded-xl shadow-inner mb-12 text-center">
            <h1 className="text-5xl font-serif font-extrabold text-teal-800 mb-4">
                Our Roots, Our Vision
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Dedicated to spreading the wisdom of yoga and meditation in a supportive and modern environment.
            </p>
        </div>

        {/* Mission Section */}
        <section className="grid md:grid-cols-2 gap-12 items-center py-10">
            <div>
                <h2 className="text-3xl font-bold text-teal-700 mb-4">The AnandaYog Mission</h2>
                <p className="text-gray-700 mb-4 leading-relaxed">
                    Founded on the belief that inner tranquility is accessible to everyone, AnandaYog was created to be a digital sanctuary. We move beyond trendy fitness routines to offer practices that truly connect you with your deepest self.
                </p>
                <p className="text-gray-700 leading-relaxed italic">
                    &quot;Ananda&quot; means bliss, and &quot;Yog&quot; means union. Our goal is to help you achieve the union of mind and body, leading to lasting joy.
                </p>
            </div>
            {/* Image Placeholder REPLACED with Next.js Image Component */}
            <div className="rounded-lg shadow-md overflow-hidden relative h-64 md:h-96">
                <Image
                    src="/studio.jpg" // Replace with your image filename
                    alt="A peaceful yoga and meditation studio interior"
                    fill // Fills the parent container (h-64/h-96)
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover"
                />
            </div>
        </section>

        {/* Teacher Profiles Section - UPDATED */}
        <section className="py-16 text-center">
            <h2 className="text-3xl font-bold text-teal-800 dark:text-teal-400 mb-8">Meet Our Lead Teacher</h2>
            <div className="flex justify-center">
                <TeacherCard 
                    name="Souparna Paul" 
                    specialty="Vipassana, Pranayama, Ashtanga & Raja Yoga" 
                    quote="The mind is everything. What you think, you become."
                />
            </div>
        </section>

      </div>
    );
}

// TeacherCard Component - Modified to remove experience text and only display the quote
const TeacherCard = ({ name, specialty, quote }) => (
    <div className="bg-white p-6 rounded-lg shadow-xl border border-gray-100 max-w-sm">
        {/* Changed background color and icon color */}
        <div className="w-24 h-24 mx-auto bg-teal-100 rounded-full mb-4 flex items-center justify-center text-3xl text-teal-600">
            🧘‍♂️
        </div>
        <h3 className="text-xl font-semibold text-gray-900">{name}</h3>
        {/* Changed text color */}
        <p className="text-teal-600 italic mb-3">{specialty}</p>

        {/* Quote Display - Now the final descriptive element */}
        {quote && (
            <p className="text-sm text-gray-800 italic border-t border-b border-gray-100 py-3">
                &quot;{quote}&quot;
            </p>
        )}
        
    </div>
);