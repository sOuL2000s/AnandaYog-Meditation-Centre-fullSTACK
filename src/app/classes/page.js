// src/app/classes/page.js

export default function ClassesPage() {
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-serif font-bold text-teal-800 mb-8">Our Course Catalog</h1>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Example Course 1 */}
        <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-100">
          <h2 className="text-xl font-semibold text-teal-600 mb-2">Beginner&apos;s Mind (7 Days)</h2>
          <p className="text-gray-600 mb-4">An introductory course covering breathwork and foundational sitting techniques.</p>
          <button 
            className="w-full bg-amber-500 text-white py-2 rounded-lg hover:bg-amber-600 transition"
          >
            Enroll Now (Login Required)
          </button>
        </div>
        
        {/* Example Course 2 */}
        <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-100">
          <h2 className="text-xl font-semibold text-teal-600 mb-2">Vipassana Deep Dive</h2>
          <p className="text-gray-600 mb-4">Advanced silent meditation techniques for experienced practitioners.</p>
          <button 
            className="w-full bg-amber-500 text-white py-2 rounded-lg hover:bg-amber-600 transition"
          >
            Enroll Now (Login Required)
          </button>
        </div>
        
        {/* Placeholder for more content */}
      </div>
    </div>
  );
}