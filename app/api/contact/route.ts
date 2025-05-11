import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { EmailTemplate } from '../../../components/EmailTemplate';

// Initialize Resend with your API key - make sure to set RESEND_API_KEY in Vercel environment variables
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    // Parse the request body
    let name, email, message;
    try {
      const body = await request.json();
      name = body.name;
      email = body.email;
      message = body.message;    } catch {
      return NextResponse.json(
        { error: 'Invalid request format' },
        { status: 400 }
      );
    }

    // Validate the data
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email, and message are required' },
        { status: 400 }
      );
    }

    // Send the email using Resend
    const data = await resend.emails.send({
      from: 'Contact Form <onboarding@resend.dev>', // Update with your verified domain in Resend
      to: process.env.CONTACT_EMAIL || 'rasuen27@gmail.com', // Your email address
      subject: `New Contact Form Submission from ${name}`,
      react: await EmailTemplate({ name, email, message }),
      replyTo: email
    });

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    );
  }
}