// src/app/api/verify-payment/route.js
// CRITICAL: Securely verifies the Razorpay payment signature

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
      amount,
      planName // New field
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
    
    // 3. Optional: Add logic to calculate expiration date based on planName (Monthly/Annual)
    let expirationDate = new Date();
    if (planName === 'Yogi Monthly') {
        expirationDate.setMonth(expirationDate.getMonth() + 1);
    } else if (planName === 'Yogi Annual') {
        expirationDate.setFullYear(expirationDate.getFullYear() + 1);
    }

    // 4. Update the user's Firestore record (Heavy Lifting Done Here!)
    const userRef = doc(db, "users", userId);
    await setDoc(userRef, {
      lastSubscriptionDate: new Date().toISOString(),
      subscriptionExpires: expirationDate.toISOString(),
      isSubscribed: true,
      subscriptionPlan: planName, // Store the specific plan
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