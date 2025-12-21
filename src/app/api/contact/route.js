// src/app/api/contact/route.js
// Handles submissions from the contact form (src/app/contact/page.js)

import { NextResponse } from 'next/server';

// NOTE: In a real production environment, you would use a service like 
// SendGrid, Resend, or Nodemailer (via SMTP) here to send the email.
// For this fully complete placeholder, we simulate a successful server action.

export async function POST(request) {
  try {
    const data = await request.json();
    
    // 1. Validate data (simple check)
    if (!data.name || !data.email || !data.message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    console.log("--- CONTACT FORM SUBMISSION RECEIVED ---");
    console.log(`From: ${data.name} (${data.email})`);
    console.log(`Message: ${data.message.substring(0, 50)}...`);
    console.log("--- End Submission ---");

    // 2. Simulate sending email (takes 1-2 seconds)
    await new Promise(resolve => setTimeout(resolve, 1500));

    // 3. Return success response
    return NextResponse.json({ 
      message: 'Message received successfully!',
      debug: 'Server action simulated (Replace with real email logic)' 
    }, { status: 200 });

  } catch (error) {
    console.error("Contact Form Error:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

