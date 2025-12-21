// src/components/Footer.js

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white mt-8">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 text-center">
        <p>&copy; {new Date().getFullYear()} AnandaYog Meditation Centre. All rights reserved.</p>
        <div className="mt-4 space-x-4">
          <a href="#" className="hover:text-teal-400 transition">Privacy Policy</a>
          <a href="#" className="hover:text-teal-400 transition">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
}