// src/components/PaymentInitiator.js (UPDATED for secure verification and color)
"use client";

import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

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
  const { currentUser, userData } = useAuth();
  const [status, setStatus] = useState('');
  
  if (userData?.isSubscribed) {
      return (
        <div className="p-6 bg-green-50 border border-green-200 rounded-lg shadow-md">
            <h3 className="text-xl font-bold text-green-700 mb-2">Subscription Active!</h3>
            <p className="text-gray-600">You have unlimited access to all courses. Enjoy your bliss.</p>
        </div>
      );
  }


  const handleCheckout = async () => {
    setStatus('Preparing checkout...');
    
    // 1. Load Razorpay script
    const loaded = await loadRazorpayScript('https://checkout.razorpay.com/v1/checkout.js');
    if (!loaded) {
      setStatus('Razorpay SDK failed to load. Check network.');
      return;
    }

    // 2. Request a secure Order ID from our Node.js API Route
    const paymentAmountINR = 500;
    const orderDataResponse = await fetch('/api/create-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        amount: paymentAmountINR, 
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
      key: orderData.key,
      amount: orderData.amount,
      currency: orderData.currency,
      name: "AnandaYog Subscription",
      description: "Yogi Monthly Unlimited Access (₹500)",
      order_id: orderData.id,
      
      handler: async function (response) {
        setStatus('Payment successful, securely verifying...');
        
        // 4. CRITICAL: Send response to the secure server verification endpoint
        const verificationResponse = await fetch('/api/verify-payment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                orderId: response.razorpay_order_id,
                paymentId: response.razorpay_payment_id,
                signature: response.razorpay_signature,
                userId: currentUser.uid,
                amount: paymentAmountINR // send amount for double check
            }),
        });
        
        if (verificationResponse.ok) {
            setStatus('Subscription Activated! Welcome, Yogi.');
            // AuthContext's onSnapshot listener handles the state refresh
        } else {
            setStatus('Verification failed. Contact support with payment ID.');
        }
      },
      prefill: {
        name: currentUser.displayName,
        email: currentUser.email,
      },
      theme: {
        // Updated theme color to Deep Teal
        color: "#0E5B6A" 
      }
    };
    
    const rzp = new window.Razorpay(options);
    rzp.open();
    setStatus('Waiting for payment...');
  };

  return (
    // Changed colors to Sage/Teal
    <div className="p-6 bg-teal-50 border border-teal-200 rounded-lg shadow-xl">
      <h3 className="text-2xl font-bold text-teal-700 mb-4">Unlock Unlimited Bliss</h3>
      <p className="mb-4 text-gray-700">Get unlimited access to all courses, live sessions, and the community archive for only ₹500/month.</p>
      
      <button 
        onClick={handleCheckout}
        disabled={status.includes('Preparing') || status.includes('Verifying') || status.includes('Waiting')}
        // Changed CTA to Warm Gold accent color
        className="bg-amber-500 text-white py-3 px-8 rounded-full text-lg font-semibold hover:bg-amber-600 transition duration-300 disabled:opacity-50 shadow-md"
      >
        {status.includes('Waiting') ? 'Payment Window Open...' : 'Subscribe Now (₹500/mo)'}
      </button>

      {status && <p className={`mt-4 text-sm ${status.includes('Activated') ? 'text-green-600 font-medium' : 'text-gray-600'}`}>{status}</p>}
    </div>
  );
}