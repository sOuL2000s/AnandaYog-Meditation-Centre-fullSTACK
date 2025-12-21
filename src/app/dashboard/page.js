// src/app/dashboard/page.js
import ProtectedRoute from '../../components/ProtectedRoute';
import PaymentInitiator from '../../components/PaymentInitiator';
import { useAuth } from '../../context/AuthContext';

// Since we need hooks (useAuth), this must be a client component
// but is protected by the ProtectedRoute wrapper.
function DashboardContent() {
  const { currentUser } = useAuth();
  
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold text-indigo-800 mb-4">
        Welcome, {currentUser?.displayName || 'Yogi'}!
      </h1>
      <p className="text-lg text-gray-600 mb-8">
        This is your private dashboard. Access secured content and manage your subscription.
      </p>

      {/* Placeholder for protected content */}
      <div className="bg-white p-6 rounded-lg shadow-xl mb-8">
        <h2 className="text-2xl font-semibold mb-3">Your Active Courses</h2>
        <ul className="list-disc list-inside space-y-2 text-gray-700">
          <li>Daily Chakra Balancing (Video Access)</li>
          <li>Guided Sleep Meditation Audio</li>
        </ul>
      </div>

      <PaymentInitiator />
    </div>
  );
}


export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}