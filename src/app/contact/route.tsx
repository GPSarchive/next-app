import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

// Firestore
import admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID!,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL!,
      privateKey: process.env.FIREBASE_PRIVATE_KEY!.replace(/\\n/g, '\n'),
    }),
  });
}
const db = getFirestore();

const redis = Redis.fromEnv();
const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, '10 s'),
});

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') ?? '127.0.0.1';
  const ua = req.headers.get('user-agent') ?? '';

  const { success } = await ratelimit.limit(ip);
  if (!success) {
    return NextResponse.json({ error: 'Rate limit exceeded. Please try again later.' }, { status: 429 });
  }

  const { firstName, lastName, email, number, message, privacyConsent } = await req.json();

  if (!firstName || !lastName || !email || !number || !message) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }
  if (!privacyConsent) {
    return NextResponse.json({ error: 'You must accept the Privacy Policy' }, { status: 400 });
  }

  try {
    // 1) Record consent in Firestore
    await db.collection('privacyConsents').add({
      firstName,
      lastName,
      email,
      number,
      acceptedAt: new Date().toISOString(),
      ipAddress: ip,
      userAgent: ua,
      policyVersion: process.env.PRIVACY_POLICY_VERSION || '1.0',
      context: 'contact-form',
    });

    // 2) Send the email
    const transporter = nodemailer.createTransport({
      host: 'smtp.office365.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER!,
        pass: process.env.SMTP_PASS!,
      },
    });

    await transporter.sendMail({
      from: `"${firstName} ${lastName}" <${process.env.SMTP_USER}>`,
      to: process.env.SMTP_USER,
      replyTo: email,
      subject: `New Contact Form Submission`,
      html: `
        <h2>New Contact Request</h2>
        <p><strong>First Name:</strong> ${firstName}</p>
        <p><strong>Last Name:</strong> ${lastName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone Number:</strong> ${number}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
    });

    return NextResponse.json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
}
