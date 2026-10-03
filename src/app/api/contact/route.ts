// app/api/contact/route.ts  (or pages/api/contact.ts)
import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { name, email, message } = (await req.json()) as {
      name: string;
      email: string;
      message: string;
    };

    // ---- validation (same as before) ----
    if (!name?.trim() || !email?.trim() || !message?.trim())
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });

    // ---- send ----------------------------------------------------------------
    const { data, error } = await resend.emails.send({
      from: 'Feast of Esther <init-access@feastofestherusa.com>',
      to: 'feastofesthernaa@gmail.com',
      replyTo: email,
      subject: `New Contact Form Submission from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\nMessage:\n${message}`,
    });

    // **NEW** – log the whole response
    console.log('📧 Resend send result →', { data, error });

    if (error) {
      // Forward the exact error to the client (helps debugging)
      return NextResponse.json({ error: error.message }, { status: 502 });
    }

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error('🚨 Unexpected error', e);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
