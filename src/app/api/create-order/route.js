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
    const { amount, currency = 'INR', receiptId } = await request.json();

    const options = {
      amount: amount * 100, // Convert to paisa
      currency: currency,
      receipt: receiptId,
      payment_capture: 1, 
    };

    const order = await razorpay.orders.create(options);

    // Only expose the public key and order ID to the client
    return NextResponse.json({
      id: order.id,
      currency: order.currency,
      amount: order.amount,
      key: process.env.RAZORPAY_KEY_ID 
    }, { status: 200 });

  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}