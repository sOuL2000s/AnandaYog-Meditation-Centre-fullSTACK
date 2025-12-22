// src/components/Footer.js
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white mt-8 border-t-4 border-teal-600">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 text-center">
        <p>&copy; {new Date().getFullYear()} AnandaYog Meditation Centre. All rights reserved.</p>
        <div className="mt-4 space-x-4">
          <Link href="/policy" className="hover:text-teal-400 transition">Privacy Policy</Link>
          <Link href="/terms" className="hover:text-teal-400 transition">Terms of Service</Link>
        </div>
      </div>
    </footer>
  );
}