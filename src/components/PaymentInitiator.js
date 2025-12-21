// src/components/PaymentInitiator.js
"use client";

import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

// Utility function to load the Razorpay script dynamically
const loadRazorpayScript = (src) => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = src;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export default function PaymentInitiator() {
  const { currentUser } = useAuth();
  const [status, setStatus] = useState('');
  
  const handleCheckout = async () => {
    setStatus('Preparing checkout...');
    
    // 1. Load Razorpay script
    const loaded = await loadRazorpayScript('https://checkout.razorpay.com/v1/checkout.js');
    if (!loaded) {
      setStatus('Razorpay SDK failed to load. Check network.');
      return;
    }

    // 2. Request a secure Order ID from our Node.js API Route
    const orderDataResponse = await fetch('/api/create-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        amount: 500, // Example: ₹500 (API converts to paisa)
        receiptId: currentUser.uid 
      }),
    });
    
    if (!orderDataResponse.ok) {
        setStatus('Failed to create order on server.');
        return;
    }

    const orderData = await orderDataResponse.json();

    // 3. Configure the Razorpay Checkout
    const options = {
      key: orderData.key, // Public Key ID from .env.local
      amount: orderData.amount, // Amount in paisa
      currency: orderData.currency,
      name: "AnandaYog Subscription",
      description: "Monthly Unlimited Access",
      order_id: orderData.id,
      handler: function (response) {
        // SUCCESS: Send response to a secure webhook route for final verification
        // NOTE: You MUST implement a secure verification webhook on the server
        console.log("Payment successful. Verifying payment...");
        setStatus(`Payment Successful! ID: ${response.razorpay_payment_id}. Status update pending.`);
        
        // **TODO: Call /api/verify-payment Webhook here**
      },
      prefill: {
        name: currentUser.displayName,
        email: currentUser.email,
      },
      theme: {
        color: "#4f46e5" // Indigo theme
      }
    };
    
    const rzp = new window.Razorpay(options);
    rzp.open();
    setStatus('');
  };

  return (
    <div className="p-6 bg-indigo-50 border border-indigo-200 rounded-lg shadow-md">
      <h3 className="text-xl font-bold text-indigo-700 mb-4">Start Your Subscription</h3>
      <p className="mb-4">Get unlimited access to all courses for only ₹500/month.</p>
      
      <button 
        onClick={handleCheckout}
        disabled={status.includes('Preparing')}
        className="bg-purple-600 text-white py-3 px-8 rounded-full text-lg font-semibold hover:bg-purple-700 transition duration-300 disabled:opacity-50"
      >
        Subscribe Now (UPI/Card)
      </button>

      {status && <p className="mt-4 text-sm text-gray-600">{status}</p>}
    </div>
  );
}