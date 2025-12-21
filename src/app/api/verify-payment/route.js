// src/app/api/verify-payment/route.js
// CRITICAL: Securely verifies the Razorpay payment signature
// This prevents users from faking successful payments in the frontend.

import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, setDoc } from 'firebase/firestore';
import Razorpay from 'razorpay';
import crypto from 'crypto';

// Re-initialize Razorpay (Secret key is only used securely on the server)
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export async function POST(request) {
  try {
    const { 
      orderId, 
      paymentId, 
      signature, 
      userId, 
      amount // Included for verification against the order amount
    } = await request.json();

    // 1. Construct the signature string
    const shasum = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET);
    shasum.update(`${orderId}|${paymentId}`);
    const digest = shasum.digest('hex');

    // 2. Compare the calculated digest with the signature received from the client
    if (digest !== signature) {
      return NextResponse.json({ status: 'failure', message: 'Signature verification failed.' }, { status: 400 });
    }

    // --- Verification Successful ---
    
    // 3. Optional: Fetch the payment details from Razorpay to confirm amount
    // const payment = await razorpay.payments.fetch(paymentId);
    // if (payment.amount !== 50000) { /* Check amount */ }

    // 4. Update the user's Firestore record (Heavy Lifting Done Here!)
    const userRef = doc(db, "users", userId);
    await setDoc(userRef, {
      lastSubscriptionDate: new Date().toISOString(),
      isSubscribed: true,
      subscriptionPlan: 'Yogi Monthly',
      razorpayDetails: { orderId, paymentId, signature, amount },
    }, { merge: true });

    return NextResponse.json({ 
      status: 'success', 
      message: 'Payment verified and subscription activated!',
      userId 
    }, { status: 200 });

  } catch (error) {
    console.error("Payment Verification Error:", error);
    return NextResponse.json({ status: 'error', message: 'Internal server error during verification.' }, { status: 500 });
  }
}

