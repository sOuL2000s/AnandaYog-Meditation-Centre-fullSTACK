// src/app/api/create-order/route.js (Node.js Serverless Function)

import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';

// Use environment variables securely
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export async function POST(request) {
  try {
    // Expect amount, currency, and receiptId (which is userId)
    const { amount, currency = 'INR', receiptId, planName } = await request.json();

    if (!amount || amount < 1) {
        return NextResponse.json({ error: 'Invalid amount.' }, { status: 400 });
    }

    // --- FIX for Razorpay receipt length limit (max 40 chars) ---
    // Use the user ID (receiptId) and a short, time-based suffix for uniqueness.
    // Firebase UID is usually ~28 chars, leaving plenty of room.
    const timeSuffix = Date.now().toString().slice(-6); // Last 6 digits of timestamp
    const shortReceipt = `user_${receiptId.substring(0, 20)}_${timeSuffix}`;
    // This ensures the receipt is always well under 40 characters.
    // -------------------------------------------------------------

    const options = {
      amount: amount * 100, // Convert to paisa
      currency: currency,
      receipt: shortReceipt, // Use the shortened receipt
      payment_capture: 1, 
      notes: { planName } // Add plan name to notes
    };

    const order = await razorpay.orders.create(options);

    // Only expose the public key and order ID to the client
    return NextResponse.json({
      id: order.id,
      currency: order.currency,
      amount: order.amount,
      key: process.env.RAZORPAY_KEY_ID,
      planName 
    }, { status: 200 });

  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    
    // Ensure we return a structured error response
    const status = error.statusCode || 500;
    const errorMessage = error.error?.description || error.message || 'Internal Server Error';
    return NextResponse.json({ error: errorMessage }, { status });
  }
}