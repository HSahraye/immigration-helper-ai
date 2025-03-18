import nodemailer from 'nodemailer';
import { prisma } from '../prisma';

// Set up nodemailer transporter
// For production, use a service like SendGrid, Mailgun, AWS SES, etc.
// For development, we'll use a test account
let transporter: nodemailer.Transporter;

/**
 * Initialize the email service
 */
export async function initEmailService() {
  if (process.env.NODE_ENV === 'production') {
    // Production email setup
    transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT || '587'),
      secure: process.env.EMAIL_SECURE === 'true',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  } else {
    // Development email setup using Ethereal
    const testAccount = await nodemailer.createTestAccount();
    transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
    console.log('Ethereal Email account created:', testAccount.user);
  }
}

/**
 * Send a welcome email to a new user
 */
export async function sendWelcomeEmail(userId: string) {
  try {
    // Get user info
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || !user.email) {
      throw new Error('User not found or email is missing');
    }

    // Initialize email service if needed
    if (!transporter) {
      await initEmailService();
    }

    // Send email
    const info = await transporter.sendMail({
      from: `"Immigration Helper AI" <${process.env.EMAIL_FROM || 'noreply@immigrationhelper.ai'}>`,
      to: user.email,
      subject: 'Welcome to Immigration Helper AI!',
      text: `
        Hi ${user.name || 'there'},
        
        Welcome to Immigration Helper AI! We're excited to have you on board.
        
        With our platform, you can get expert guidance on immigration processes, visa applications,
        citizenship, and more. Here's what you can do:
        
        - Get instant answers to your immigration questions
        - Access comprehensive resources on various immigration topics
        - Track your application progress
        - Get document assistance
        
        Start exploring our services now: ${process.env.NEXTAUTH_URL || 'http://localhost:3000'}
        
        If you have any questions, feel free to reply to this email.
        
        Best regards,
        The Immigration Helper AI Team
      `,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Welcome to Immigration Helper AI!</h2>
          <p>Hi ${user.name || 'there'},</p>
          <p>We're excited to have you on board.</p>
          
          <p>With our platform, you can get expert guidance on immigration processes, visa applications,
          citizenship, and more. Here's what you can do:</p>
          
          <ul>
            <li>Get instant answers to your immigration questions</li>
            <li>Access comprehensive resources on various immigration topics</li>
            <li>Track your application progress</li>
            <li>Get document assistance</li>
          </ul>
          
          <p><a href="${process.env.NEXTAUTH_URL || 'http://localhost:3000'}" 
            style="background-color: #4285f4; color: white; padding: 10px 20px; 
            text-decoration: none; border-radius: 5px; display: inline-block; margin-top: 10px;">
            Start Exploring Now</a></p>
          
          <p>If you have any questions, feel free to reply to this email.</p>
          
          <p>Best regards,<br>The Immigration Helper AI Team</p>
        </div>
      `,
    });

    if (process.env.NODE_ENV !== 'production') {
      console.log('Email preview URL:', nodemailer.getTestMessageUrl(info));
    }

    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending welcome email:', error);
    return { success: false, error };
  }
}

/**
 * Send a notification when a user reaches their usage limit
 */
export async function sendUsageLimitNotification(userId: string) {
  try {
    // Get user info
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        subscription: {
          include: {
            plan: true,
          },
        },
      },
    });

    if (!user || !user.email) {
      throw new Error('User not found or email is missing');
    }

    // Initialize email service if needed
    if (!transporter) {
      await initEmailService();
    }

    // Send email
    const info = await transporter.sendMail({
      from: `"Immigration Helper AI" <${process.env.EMAIL_FROM || 'noreply@immigrationhelper.ai'}>`,
      to: user.email,
      subject: "You've Reached Your Free Usage Limit",
      text: `
        Hi ${user.name || 'there'},
        
        You've reached your daily limit of free conversations with Immigration Helper AI.
        
        To continue getting unlimited help with your immigration needs, consider upgrading
        to one of our premium plans starting at just $9.99/month.
        
        Upgrade now: ${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/subscribe
        
        Benefits of upgrading:
        - Unlimited AI conversations
        - Document analysis and generation
        - Priority support
        - And much more!
        
        Best regards,
        The Immigration Helper AI Team
      `,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>You've Reached Your Free Usage Limit</h2>
          <p>Hi ${user.name || 'there'},</p>
          
          <p>You've reached your daily limit of free conversations with Immigration Helper AI.</p>
          
          <p>To continue getting unlimited help with your immigration needs, consider upgrading
          to one of our premium plans starting at just $9.99/month.</p>
          
          <p><a href="${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/subscribe" 
            style="background-color: #4285f4; color: white; padding: 10px 20px; 
            text-decoration: none; border-radius: 5px; display: inline-block; margin-top: 10px;">
            Upgrade Now</a></p>
          
          <h3>Benefits of upgrading:</h3>
          <ul>
            <li>Unlimited AI conversations</li>
            <li>Document analysis and generation</li>
            <li>Priority support</li>
            <li>And much more!</li>
          </ul>
          
          <p>Best regards,<br>The Immigration Helper AI Team</p>
        </div>
      `,
    });

    if (process.env.NODE_ENV !== 'production') {
      console.log('Email preview URL:', nodemailer.getTestMessageUrl(info));
    }

    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending usage limit notification:', error);
    return { success: false, error };
  }
}

/**
 * Send a subscription confirmation email
 */
export async function sendSubscriptionConfirmation(userId: string, planName: string) {
  try {
    // Get user info
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || !user.email) {
      throw new Error('User not found or email is missing');
    }

    // Initialize email service if needed
    if (!transporter) {
      await initEmailService();
    }

    // Send email
    const info = await transporter.sendMail({
      from: `"Immigration Helper AI" <${process.env.EMAIL_FROM || 'noreply@immigrationhelper.ai'}>`,
      to: user.email,
      subject: `Your Subscription to ${planName} is Confirmed!`,
      text: `
        Hi ${user.name || 'there'},
        
        Thank you for subscribing to our ${planName} plan! Your subscription is now active.
        
        You now have access to all premium features including:
        - Unlimited AI conversations
        - Document analysis and generation
        - Premium immigration resources
        - Priority support
        
        Visit your account to start exploring: ${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/profile
        
        If you have any questions about your subscription, please reply to this email.
        
        Best regards,
        The Immigration Helper AI Team
      `,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Your Subscription is Confirmed!</h2>
          <p>Hi ${user.name || 'there'},</p>
          
          <p>Thank you for subscribing to our <strong>${planName}</strong> plan! Your subscription is now active.</p>
          
          <p>You now have access to all premium features including:</p>
          <ul>
            <li>Unlimited AI conversations</li>
            <li>Document analysis and generation</li>
            <li>Premium immigration resources</li>
            <li>Priority support</li>
          </ul>
          
          <p><a href="${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/profile" 
            style="background-color: #4285f4; color: white; padding: 10px 20px; 
            text-decoration: none; border-radius: 5px; display: inline-block; margin-top: 10px;">
            Visit Your Account</a></p>
          
          <p>If you have any questions about your subscription, please reply to this email.</p>
          
          <p>Best regards,<br>The Immigration Helper AI Team</p>
        </div>
      `,
    });

    if (process.env.NODE_ENV !== 'production') {
      console.log('Email preview URL:', nodemailer.getTestMessageUrl(info));
    }

    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending subscription confirmation:', error);
    return { success: false, error };
  }
}

/**
 * Send a subscription cancellation confirmation
 */
export async function sendSubscriptionCancellation(userId: string) {
  try {
    // Get user info
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || !user.email) {
      throw new Error('User not found or email is missing');
    }

    // Initialize email service if needed
    if (!transporter) {
      await initEmailService();
    }

    // Send email
    const info = await transporter.sendMail({
      from: `"Immigration Helper AI" <${process.env.EMAIL_FROM || 'noreply@immigrationhelper.ai'}>`,
      to: user.email,
      subject: 'Your Subscription Has Been Canceled',
      text: `
        Hi ${user.name || 'there'},
        
        We're sorry to see you go. Your subscription has been canceled.
        
        You'll continue to have access to premium features until the end of your current billing period.
        
        We'd love to hear your feedback on how we can improve our service. Just reply to this email
        to let us know your thoughts.
        
        If you change your mind, you can resubscribe anytime: ${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/subscribe
        
        Best regards,
        The Immigration Helper AI Team
      `,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Your Subscription Has Been Canceled</h2>
          <p>Hi ${user.name || 'there'},</p>
          
          <p>We're sorry to see you go. Your subscription has been canceled.</p>
          
          <p>You'll continue to have access to premium features until the end of your current billing period.</p>
          
          <p>We'd love to hear your feedback on how we can improve our service. Just reply to this email
          to let us know your thoughts.</p>
          
          <p>If you change your mind, you can resubscribe anytime:</p>
          
          <p><a href="${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/subscribe" 
            style="background-color: #4285f4; color: white; padding: 10px 20px; 
            text-decoration: none; border-radius: 5px; display: inline-block; margin-top: 10px;">
            Resubscribe</a></p>
          
          <p>Best regards,<br>The Immigration Helper AI Team</p>
        </div>
      `,
    });

    if (process.env.NODE_ENV !== 'production') {
      console.log('Email preview URL:', nodemailer.getTestMessageUrl(info));
    }

    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending subscription cancellation:', error);
    return { success: false, error };
  }
} 