// src/components/PaymentInitiator.js (UPDATED for dynamic plans)
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

export default function PaymentInitiator({ planName, amount, description, isAnnual = false }) {
  const { currentUser, userData } = useAuth();
  const [status, setStatus] = useState('');
  
  if (userData?.isSubscribed && userData.subscriptionPlan === planName) {
      return (
        <div className="p-6 bg-green-50 border border-green-200 rounded-lg shadow-md">
            <h3 className="text-xl font-bold text-green-700 mb-2">{planName} Active!</h3>
            <p className="text-gray-600">Your current plan is active. Enjoy your unlimited access.</p>
        </div>
      );
  }
  
  // If user is subscribed but trying to buy the other plan (e.g., currently monthly, seeing annual)
  if (userData?.isSubscribed && userData.subscriptionPlan !== planName) {
      return (
        <div className="p-6 bg-yellow-50 border border-yellow-200 rounded-lg shadow-md">
            <h3 className="text-xl font-bold text-yellow-700 mb-2">Upgrade/Change Plan</h3>
            <p className="text-gray-600">You must cancel your current {userData.subscriptionPlan} subscription to switch to the {planName} plan.</p>
        </div>
      );
  }

  const handleCheckout = async () => {
    if (!currentUser) {
        setStatus('Error: User not logged in.');
        return;
    }

    setStatus(`Preparing checkout for ${planName}...`);
    
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
        amount: amount, 
        receiptId: currentUser.uid,
        planName: planName
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
      description: `${planName} Access (${orderData.amount / 100} ${orderData.currency})`,
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
                amount: amount,
                planName: planName // Send the plan name to the server
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

  const buttonColor = isAnnual ? 'bg-teal-600 hover:bg-teal-700' : 'bg-amber-500 hover:bg-amber-600';
  const borderColor = isAnnual ? 'border-teal-300' : 'border-amber-300';


  return (
    <div className={`p-6 bg-white border-2 ${borderColor} rounded-lg shadow-xl flex flex-col justify-between`}>
      <div>
        <h3 className="text-xl font-bold text-gray-800 mb-1">{planName}</h3>
        <p className="text-4xl font-extrabold text-teal-600 mb-3">₹{amount}</p>
        <p className="mb-4 text-gray-700 text-sm">{description}</p>
      </div>
      
      <button 
        onClick={handleCheckout}
        disabled={status.includes('Preparing') || status.includes('Verifying') || status.includes('Waiting')}
        className={`text-white py-3 px-8 rounded-full text-lg font-semibold transition duration-300 disabled:opacity-50 shadow-md ${buttonColor}`}
      >
        {status.includes('Waiting') ? 'Payment Window Open...' : `Purchase Plan (₹${amount})`}
      </button>

      {status && <p className={`mt-4 text-sm ${status.includes('Activated') ? 'text-green-600 font-medium' : 'text-gray-600'}`}>{status}</p>}
    </div>
  );
}