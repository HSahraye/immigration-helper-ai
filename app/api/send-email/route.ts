import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: NextRequest) {
  try {
    const { to, subject, content } = await req.json();

    // Get credentials from environment variables
    const emailUser = process.env.EMAIL_USER;
    const emailPassword = process.env.EMAIL_APP_PASSWORD;

    if (!emailUser || !emailPassword) {
      throw new Error('Email credentials are not configured.');
    }

    // Create a Nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: emailUser,
        pass: emailPassword,
      },
    });

    // Setup email data
    const mailOptions = {
      from: `Immigration Helper AI <${emailUser}>`,
      to,
      subject,
      text: content,
      // You can also include HTML content
      html: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 5px;">
        <h2 style="color: #333;">${subject}</h2>
        <div style="white-space: pre-line; margin-top: 20px; color: #555;">
          ${content.replace(/\n/g, '<br>')}
        </div>
        <p style="margin-top: 30px; color: #777; font-size: 12px;">
          This email was sent from Immigration Helper AI. Please do not reply to this email.
        </p>
      </div>`,
    };

    // Send the email
    const info = await transporter.sendMail(mailOptions);

    return NextResponse.json({ 
      success: true, 
      message: 'Email sent successfully',
      messageId: info.messageId
    });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to send email', error: (error as Error).message },
      { status: 500 }
    );
  }
} 