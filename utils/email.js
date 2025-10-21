const nodemailer = require('nodemailer');

// Create transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: process.env.EMAIL_PORT == 465,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

// Email templates
const templates = {
  emailVerification: (data) => ({
    subject: 'Verify Your Email - Trizen Community',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verify Your Email</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome to Trizen Community!</h1>
          </div>
          <div class="content">
            <h2>Hi ${data.name},</h2>
            <p>Thank you for joining our community! To complete your registration, please verify your email address by clicking the button below:</p>
            <a href="${data.verificationUrl}" class="button">Verify Email Address</a>
            <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
            <p><a href="${data.verificationUrl}">${data.verificationUrl}</a></p>
            <p>This link will expire in 24 hours.</p>
            <p>If you didn't create an account with us, please ignore this email.</p>
          </div>
          <div class="footer">
            <p>© 2025 Trizen Community. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `
  }),

  passwordReset: (data) => ({
    subject: 'Password Reset - Trizen Community',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Password Reset</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Password Reset Request</h1>
          </div>
          <div class="content">
            <h2>Hi ${data.name},</h2>
            <p>We received a request to reset your password. Click the button below to create a new password:</p>
            <a href="${data.resetUrl}" class="button">Reset Password</a>
            <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
            <p><a href="${data.resetUrl}">${data.resetUrl}</a></p>
            <p>This link will expire in 10 minutes.</p>
            <p>If you didn't request a password reset, please ignore this email.</p>
          </div>
          <div class="footer">
            <p>© 2025 Trizen Community. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `
  }),

  eventReminder: (data) => ({
    subject: `Event Reminder: ${data.eventTitle}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Event Reminder</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Event Reminder</h1>
          </div>
          <div class="content">
            <h2>Hi ${data.name},</h2>
            <p>This is a friendly reminder that you have an upcoming event:</p>
            <h3>${data.eventTitle}</h3>
            <p><strong>Date:</strong> ${data.eventDate}</p>
            <p><strong>Time:</strong> ${data.eventTime}</p>
            <p><strong>Location:</strong> ${data.eventLocation}</p>
            <a href="${data.eventUrl}" class="button">View Event Details</a>
            <p>We look forward to seeing you there!</p>
          </div>
          <div class="footer">
            <p>© 2025 Trizen Community. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `
  }),

  eventRegistration: (data) => ({
    subject: `Registration Confirmed: ${data.eventTitle} - Trizen Community`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Event Registration Confirmed</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; 
            line-height: 1.6; 
            color: #333; 
            background-color: #f5f7fa;
          }
          .email-wrapper { 
            max-width: 800px; 
            margin: 0 auto; 
            padding: 20px; 
          }
          .email-container { 
            background: #ffffff; 
            border-radius: 12px; 
            overflow: hidden; 
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.07);
          }
          .header-banner { 
            background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%); 
            color: white; 
            padding: 20px 30px; 
            text-align: center; 
          }
          .header-banner h1 { 
            font-size: 26px; 
            font-weight: 700; 
            margin-bottom: 8px;
            letter-spacing: -0.5px;
          }
          .header-banner p { 
            font-size: 15px; 
            opacity: 0.95; 
            margin: 0;
          }
          .content-section { 
            padding: 40px 30px; 
          }
          .greeting { 
            font-size: 18px; 
            color: #1f2937; 
            margin-bottom: 20px; 
            font-weight: 600;
          }
          .message { 
            font-size: 15px; 
            color: #4b5563; 
            margin-bottom: 30px; 
            line-height: 1.7;
          }
          .event-card { 
            background: #f9fafb; 
            border: 1px solid #e5e7eb; 
            border-radius: 10px; 
            padding: 25px; 
            margin: 30px 0;
          }
          .event-title { 
            font-size: 22px; 
            font-weight: 700; 
            color: #111827; 
            margin-bottom: 20px;
            line-height: 1.3;
          }
          .event-details { 
            margin: 0;
            padding: 0;
          }
          .detail-row { 
            display: flex; 
            padding: 12px 0; 
            border-bottom: 1px solid #e5e7eb;
          }
          .detail-row:last-child { 
            border-bottom: none; 
          }
          .detail-label { 
            font-weight: 600; 
            color: #6b7280; 
            min-width: 140px; 
            font-size: 14px;
          }
          .detail-value { 
            color: #111827; 
            font-size: 14px; 
            flex: 1;
          }
          .ticket-box { 
            background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%); 
            border: 2px dashed #3b82f6; 
            border-radius: 10px; 
            padding: 20px; 
            margin: 25px 0; 
            text-align: center;
          }
          .ticket-label { 
            font-size: 12px; 
            text-transform: uppercase; 
            letter-spacing: 1px; 
            color: #1e40af; 
            font-weight: 700; 
            margin-bottom: 8px;
          }
          .ticket-number { 
            font-size: 24px; 
            font-weight: 700; 
            color: #1e40af; 
            font-family: 'Courier New', monospace; 
            letter-spacing: 2px;
          }
          .button-container { 
            text-align: center; 
            margin: 35px 0;
          }
          .primary-button { 
            display: inline-block; 
            background: #dc2626; 
            color: white; 
            padding: 14px 40px; 
            text-decoration: none; 
            border-radius: 8px; 
            font-weight: 600; 
            font-size: 15px;
            box-shadow: 0 2px 4px rgba(220, 38, 38, 0.2);
            transition: all 0.3s ease;
          }
          .primary-button:hover { 
            background: #b91c1c;
            box-shadow: 0 4px 8px rgba(220, 38, 38, 0.3);
          }
          .info-box { 
            background: #fef3c7; 
            border-left: 4px solid #f59e0b; 
            padding: 16px 20px; 
            margin: 25px 0; 
            border-radius: 6px;
          }
          .info-box p { 
            font-size: 14px; 
            color: #92400e; 
            margin: 0;
            line-height: 1.6;
          }
          .footer-section { 
            background: #f9fafb; 
            padding: 30px; 
            text-align: center; 
            border-top: 1px solid #e5e7eb;
          }
          .footer-text { 
            font-size: 13px; 
            color: #6b7280; 
            margin: 5px 0;
          }
          .footer-links { 
            margin-top: 15px;
          }
          .footer-links a { 
            color: #2563eb; 
            text-decoration: none; 
            margin: 0 10px; 
            font-size: 13px;
          }
          .social-links { 
            margin-top: 20px;
          }
          .social-links a { 
            display: inline-block; 
            margin: 0 8px; 
            color: #6b7280; 
            text-decoration: none;
          }
        </style>
      </head>
      <body>
        <div class="email-wrapper">
          <div class="email-container">
            <!-- Header Banner -->
            <div class="header-banner">
              <div style="background: #1e3a8a; padding: 20px; border-radius: 8px; margin-bottom: 15px; text-align: center;">
                <div style="color: #ffffff; font-size: 32px; font-weight: bold; font-family: Arial, sans-serif; letter-spacing: 2px;">
                  <span style="font-size: 40px; margin-right: 10px;">⚡</span>TRIZEN
                </div>
                <div style="color: #ffffff; font-size: 14px; margin-top: 5px; opacity: 0.9;">
                  VENTURES
                </div>
              </div>
              <h1 style="font-size: 20px; margin: 10px 0 5px 0;">🎉 Registration Confirmed!</h1>
              <p style="font-size: 14px; margin: 0; opacity: 0.9;">Trizen Community</p>
            </div>
            
            <!-- Main Content -->
            <div class="content-section">
              <p class="greeting">Dear ${data.name},</p>
              
              <p class="message">
                Thank you for your interest in attending <strong>${data.eventTitle}</strong>. We're excited to confirm your registration!
                ${data.requiresApproval ? ' Please note that this is an invite-only event, and your registration is subject to confirmation. Our team will review your submission, and you can expect a response within 3 working days.' : ''}
              </p>
              
              <!-- Event Details Card -->
              <div class="event-card">
                <h2 class="event-title">${data.eventTitle}</h2>
                <div class="event-details">
                  <div class="detail-row">
                    <span class="detail-label">📅 Date</span>
                    <span class="detail-value">${data.eventDate}</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">🕐 Time</span>
                    <span class="detail-value">${data.eventTime}</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">📍 Location</span>
                    <span class="detail-value">${data.eventLocation}</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">🎫 Event Type</span>
                    <span class="detail-value">${data.eventType}</span>
                  </div>
                  ${data.eventCategory ? `
                  <div class="detail-row">
                    <span class="detail-label">🏷️ Category</span>
                    <span class="detail-value">${data.eventCategory}</span>
                  </div>
                  ` : ''}
                </div>
              </div>
              
              <!-- Ticket Number -->
              <div class="ticket-box">
                <div class="ticket-label">Your Registration ID</div>
                <div class="ticket-number">${data.ticketNumber}</div>
              </div>
              
              <!-- CTA Button -->
              <div class="button-container">
                <a href="${data.ticketUrl}" class="primary-button">View My Ticket</a>
              </div>
              
              <!-- Important Info -->
              ${!data.requiresApproval ? `
              <div class="info-box">
                <p><strong>Important:</strong> Please bring your registration ID or show this email at the event check-in. We'll send you a reminder closer to the event date.</p>
              </div>
              ` : `
              <div class="info-box">
                <p><strong>Next Steps:</strong> We appreciate your enthusiasm and will be in touch soon. Keep an eye on your inbox for updates regarding your registration status.</p>
              </div>
              `}
              
              <p class="message" style="margin-top: 30px;">
                If you have any questions or need to make changes to your registration, please don't hesitate to reach out to our team.
              </p>
              
              <p class="message">
                We look forward to seeing you at the event!
              </p>
              
              <p class="message" style="font-weight: 600; margin-top: 25px;">
                Best regards,<br>
                The Trizen Community Team
              </p>
            </div>
            
            <!-- Footer -->
            <div class="footer-section" style="background: #f5f5f5; padding: 20px; text-align: center; border-radius: 0 0 10px 10px;">
              <img src="https://via.placeholder.com/400x100/f5f5f5/333333?text=Trizen+Ventures+Contact+Info" alt="Trizen Ventures Contact Information" style="max-width: 100%; height: auto; margin-bottom: 15px;">
              <div class="footer-links" style="margin-top: 15px;">
                <a href="${data.eventUrl}" style="color: #2563eb; text-decoration: none; margin: 0 10px; font-size: 13px;">Event Details</a> | 
                <a href="${data.supportUrl || '#'}" style="color: #2563eb; text-decoration: none; margin: 0 10px; font-size: 13px;">Support</a> | 
                <a href="${data.websiteUrl || '#'}" style="color: #2563eb; text-decoration: none; margin: 0 10px; font-size: 13px;">Visit Website</a>
              </div>
              <p class="footer-text" style="margin-top: 15px; font-size: 12px; color: #666;">
                © 2025 Trizen Ventures. All rights reserved.
              </p>
              <p class="footer-text" style="margin-top: 10px; font-size: 12px; color: #666;">
                You're receiving this email because you registered for an event on Trizen Community.
              </p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `
  }),

  otpVerification: (data) => ({
    subject: 'Your Verification Code - Trizen Community',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verification Code</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .otp-code { 
            background: #667eea; 
            color: white; 
            font-size: 32px; 
            font-weight: bold; 
            padding: 20px; 
            text-align: center; 
            border-radius: 10px; 
            margin: 20px 0; 
            letter-spacing: 5px;
            font-family: 'Courier New', monospace;
          }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
          .warning { background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Verification Code</h1>
          </div>
          <div class="content">
            <h2>Hi ${data.name},</h2>
            <p>Your verification code for Trizen Community is:</p>
            <div class="otp-code">${data.otp}</div>
            <p>Please enter this code to complete your ${data.type === 'email_verification' ? 'email verification' : data.type === 'password_reset' ? 'password reset' : 'verification'}.</p>
            <div class="warning">
              <strong>Important:</strong> This code will expire in 10 minutes and can only be used once.
            </div>
            <p>If you didn't request this code, please ignore this email.</p>
          </div>
          <div class="footer">
            <p>© 2025 Trizen Community. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `
  }),

  contactForm: (data) => ({
    subject: `New Contact Form Submission: ${data.subject}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Contact Form Submission</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
          .container { max-width: 800px; margin: 0 auto; }
          .header { background: #1e3a8a; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .header img { max-width: 200px; height: auto; }
          .content { background: #f9f9f9; padding: 30px; }
          .info-box { background: #e3f2fd; border-left: 4px solid #2196f3; padding: 15px; margin: 15px 0; }
          .message-box { background: #fff; border: 1px solid #ddd; padding: 20px; border-radius: 5px; margin: 15px 0; }
          .footer { background: #f5f5f5; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; color: #666; font-size: 14px; }
          .footer a { color: #2563eb; text-decoration: none; }
          .footer a:hover { text-decoration: underline; }
          .label { font-weight: bold; color: #555; }
          .value { margin-bottom: 10px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header" style="background: #1e3a8a; padding: 20px; text-align: center; border-radius: 10px 10px 0 0;">
            <img src="<div style="background: #1e3a8a; padding: 20px; border-radius: 8px; margin-bottom: 15px; text-align: center;">
  <div style="color: #ffffff; font-size: 32px; font-weight: bold; font-family: Arial, sans-serif; letter-spacing: 2px;">
    <span style="font-size: 40px; margin-right: 10px;">⚡</span>TRIZEN
  </div>
  <div style="color: #ffffff; font-size: 14px; margin-top: 5px; opacity: 0.9;">
    VENTURES
  </div>
</div>" alt="Trizen Ventures Logo" style="max-width: 150px; height: auto; margin-bottom: 10px; display: block; margin-left: auto; margin-right: auto;">
            <h2 style="color: white; font-size: 18px; margin: 10px 0 5px 0;">New Contact Form Submission</h2>
          </div>
          <div class="content">
            <div class="info-box">
              <div class="value"><span class="label">Name:</span> ${data.name}</div>
              <div class="value"><span class="label">Email:</span> ${data.email}</div>
              <div class="value"><span class="label">Company:</span> ${data.company}</div>
              <div class="value"><span class="label">Inquiry Type:</span> ${data.inquiryType}</div>
              <div class="value"><span class="label">Subject:</span> ${data.subject}</div>
              <div class="value"><span class="label">Submitted:</span> ${data.timestamp}</div>
            </div>
            
            <h3>Message</h3>
            <div class="message-box">
              ${data.message.replace(/\n/g, '<br>')}
            </div>
            
            <div class="info-box">
              <div class="value"><span class="label">IP Address:</span> ${data.ipAddress}</div>
              <div class="value"><span class="label">User Agent:</span> ${data.userAgent}</div>
            </div>
            
            <p><strong>Action Required:</strong> Please respond to this inquiry within 24 hours.</p>
          </div>
          <div class="footer" style="background: #f5f5f5; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; color: #666; font-size: 14px;">
            <img src="https://via.placeholder.com/400x100/f5f5f5/333333?text=Trizen+Ventures+Contact+Info" alt="Trizen Ventures Contact Information" style="max-width: 100%; height: auto; margin-bottom: 15px;">
            <p style="margin-top: 15px; font-size: 12px;">© 2025 Trizen Ventures. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `
  }),

  contactConfirmation: (data) => ({
    subject: 'Thank you for contacting Trizen Ventures',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Thank you for contacting us</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
          .container { max-width: 800px; margin: 0 auto; }
          .header { background: #1e3a8a; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .header img { max-width: 200px; height: auto; }
          .content { background: #f9f9f9; padding: 30px; }
          .info-box { background: #e8f5e8; border-left: 4px solid #4caf50; padding: 15px; margin: 15px 0; }
          .footer { background: #f5f5f5; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; color: #666; font-size: 14px; }
          .footer a { color: #2563eb; text-decoration: none; }
          .footer a:hover { text-decoration: underline; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header" style="background: #1e3a8a; padding: 20px; text-align: center; border-radius: 10px 10px 0 0;">
            <img src="<div style="background: #1e3a8a; padding: 20px; border-radius: 8px; margin-bottom: 15px; text-align: center;">
  <div style="color: #ffffff; font-size: 32px; font-weight: bold; font-family: Arial, sans-serif; letter-spacing: 2px;">
    <span style="font-size: 40px; margin-right: 10px;">⚡</span>TRIZEN
  </div>
  <div style="color: #ffffff; font-size: 14px; margin-top: 5px; opacity: 0.9;">
    VENTURES
  </div>
</div>" alt="Trizen Ventures Logo" style="max-width: 150px; height: auto; margin-bottom: 10px; display: block; margin-left: auto; margin-right: auto;">
            <h2 style="color: white; font-size: 18px; margin: 10px 0 5px 0;">Thank You for Contacting Us!</h2>
          </div>
          <div class="content">
            <p style="font-size: 16px; margin-bottom: 20px;">Hi ${data.name},</p>
            <p>Thank you for reaching out to Trizen Ventures. We have received your ${data.inquiryType} inquiry regarding "<strong>${data.subject}</strong>" and will get back to you within 24 hours.</p>
            
            <div class="info-box">
              <h3>What happens next?</h3>
              <ul>
                <li>Our team will review your message</li>
                <li>We'll respond within 24 hours on business days</li>
                <li>For urgent matters, please call us directly</li>
              </ul>
            </div>
            
            <p>If you have any immediate questions, feel free to reach out to us at <a href="mailto:${data.supportEmail}">${data.supportEmail}</a>.</p>
            
            <p>Best regards,<br>The Trizen Ventures Team</p>
          </div>
          <div class="footer">
            <img src="https://via.placeholder.com/400x100/f5f5f5/333333?text=Trizen+Ventures+Contact+Info" alt="Trizen Ventures Contact Information" style="max-width: 100%; height: auto; margin-bottom: 15px;">
            <p style="margin-top: 15px; font-size: 12px;">© 2025 Trizen Ventures. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `
  }),

  speakerApplicationConfirmation: (data) => ({
    subject: 'Speaker Application Received - Trizen Ventures',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Speaker Application Confirmation</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
          .container { max-width: 800px; margin: 0 auto; }
          .header { background: #1e3a8a; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; }
          .info-box { background: #e8f5e8; border-left: 4px solid #4caf50; padding: 15px; margin: 15px 0; }
          .footer { background: #f5f5f5; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; color: #666; font-size: 14px; }
          .footer a { color: #2563eb; text-decoration: none; }
          .footer a:hover { text-decoration: underline; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div style="background: #1e3a8a; padding: 20px; border-radius: 8px; margin-bottom: 15px; text-align: center;">
              <div style="color: #ffffff; font-size: 32px; font-weight: bold; font-family: Arial, sans-serif; letter-spacing: 2px;">
                <span style="font-size: 40px; margin-right: 10px;">⚡</span>TRIZEN
              </div>
              <div style="color: #ffffff; font-size: 14px; margin-top: 5px; opacity: 0.9;">
                VENTURES
              </div>
            </div>
          </div>
          <div class="content">
            <h2>Thank You for Your Speaker Application!</h2>
            <p>Dear ${data.name},</p>
            <p>Thank you for your interest in speaking at Trizen Ventures events. We have received your application and are excited about the possibility of having you as a speaker.</p>
            
            <div class="info-box">
              <h3>Application Details</h3>
              <p><strong>Name:</strong> ${data.name}</p>
              <p><strong>Organization:</strong> ${data.organization}</p>
              <p><strong>Applied On:</strong> ${data.appliedAt}</p>
              <p><strong>Status:</strong> Under Review</p>
            </div>
            
            <h3>What Happens Next?</h3>
            <ul>
              <li>Our team will review your application within 3-5 business days</li>
              <li>We'll assess your expertise and speaking experience</li>
              <li>You'll receive an email with our decision</li>
              <li>If approved, we'll discuss event details and logistics</li>
            </ul>
            
            <p>We appreciate your interest in sharing your knowledge with our community. If you have any questions, please don't hesitate to contact us.</p>
            
            <p>Best regards,<br>The Trizen Ventures Team</p>
          </div>
          <div class="footer">
            <img src="https://via.placeholder.com/400x100/f5f5f5/333333?text=Trizen+Ventures+Contact+Info" alt="Trizen Ventures Contact Information" style="max-width: 100%; height: auto; margin-bottom: 15px;">
            <p style="margin-top: 15px; font-size: 12px;">© 2025 Trizen Ventures. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `
  }),

  speakerApplicationNotification: (data) => ({
    subject: `New Speaker Application: ${data.name} - Trizen Ventures`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Speaker Application</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
          .container { max-width: 800px; margin: 0 auto; }
          .header { background: #1e3a8a; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; }
          .info-box { background: #e3f2fd; border-left: 4px solid #2196f3; padding: 15px; margin: 15px 0; }
          .footer { background: #f5f5f5; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div style="background: #1e3a8a; padding: 20px; border-radius: 8px; margin-bottom: 15px; text-align: center;">
              <div style="color: #ffffff; font-size: 32px; font-weight: bold; font-family: Arial, sans-serif; letter-spacing: 2px;">
                <span style="font-size: 40px; margin-right: 10px;">⚡</span>TRIZEN
              </div>
              <div style="color: #ffffff; font-size: 14px; margin-top: 5px; opacity: 0.9;">
                VENTURES
              </div>
            </div>
          </div>
          <div class="content">
            <h2>New Speaker Application Received</h2>
            
            <div class="info-box">
              <h3>Speaker Details</h3>
              <p><strong>Name:</strong> ${data.name}</p>
              <p><strong>Email:</strong> ${data.email}</p>
              <p><strong>Organization:</strong> ${data.organization}</p>
              <p><strong>Expertise:</strong> ${data.expertise.join(', ')}</p>
              <p><strong>Applied On:</strong> ${data.appliedAt}</p>
            </div>
            
            <h3>Bio</h3>
            <p>${data.bio}</p>
            
            <p><strong>Action Required:</strong> Please review this application in the admin panel.</p>
            <p><a href="${data.adminUrl}" style="background: #2563eb; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Review Application</a></p>
          </div>
          <div class="footer">
            <img src="https://via.placeholder.com/400x100/f5f5f5/333333?text=Trizen+Ventures+Contact+Info" alt="Trizen Ventures Contact Information" style="max-width: 100%; height: auto; margin-bottom: 15px;">
            <p style="margin-top: 15px; font-size: 12px;">© 2025 Trizen Ventures. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `
  }),

  speakerStatusUpdate: (data) => ({
    subject: `Speaker Application Update - ${data.status.toUpperCase()} - Trizen Ventures`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Speaker Application Update</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
          .container { max-width: 800px; margin: 0 auto; }
          .header { background: #1e3a8a; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; }
          .status-box { background: ${data.status === 'approved' ? '#e8f5e8' : data.status === 'rejected' ? '#ffebee' : '#fff3e0'}; border-left: 4px solid ${data.status === 'approved' ? '#4caf50' : data.status === 'rejected' ? '#f44336' : '#ff9800'}; padding: 15px; margin: 15px 0; }
          .footer { background: #f5f5f5; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div style="background: #1e3a8a; padding: 20px; border-radius: 8px; margin-bottom: 15px; text-align: center;">
              <div style="color: #ffffff; font-size: 32px; font-weight: bold; font-family: Arial, sans-serif; letter-spacing: 2px;">
                <span style="font-size: 40px; margin-right: 10px;">⚡</span>TRIZEN
              </div>
              <div style="color: #ffffff; font-size: 14px; margin-top: 5px; opacity: 0.9;">
                VENTURES
              </div>
            </div>
          </div>
          <div class="content">
            <h2>Speaker Application Status Update</h2>
            <p>Dear ${data.name},</p>
            
            <div class="status-box">
              <h3>Status: ${data.status.toUpperCase()}</h3>
              <p><strong>Updated On:</strong> ${data.updatedAt}</p>
              ${data.adminNotes ? `<p><strong>Notes:</strong> ${data.adminNotes}</p>` : ''}
            </div>
            
            ${data.status === 'approved' ? `
              <h3>Congratulations! 🎉</h3>
              <p>We are excited to have you as a speaker at our upcoming events. Our team will contact you soon to discuss the details and logistics.</p>
            ` : data.status === 'rejected' ? `
              <h3>Thank You for Your Interest</h3>
              <p>While we appreciate your application, we are unable to proceed with your speaker application at this time. We encourage you to apply again in the future.</p>
            ` : `
              <h3>Application Under Review</h3>
              <p>Your application is still being reviewed. We will notify you once a decision has been made.</p>
            `}
            
            <p>If you have any questions, please contact us at <a href="mailto:${data.supportEmail}">${data.supportEmail}</a>.</p>
            
            <p>Best regards,<br>The Trizen Ventures Team</p>
          </div>
          <div class="footer">
            <img src="https://via.placeholder.com/400x100/f5f5f5/333333?text=Trizen+Ventures+Contact+Info" alt="Trizen Ventures Contact Information" style="max-width: 100%; height: auto; margin-bottom: 15px;">
            <p style="margin-top: 15px; font-size: 12px;">© 2025 Trizen Ventures. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `
  }),

  speakerInvitation: (data) => ({
    subject: `Speaker Invitation: ${data.eventTitle} - Trizen Ventures`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Speaker Invitation</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
          .container { max-width: 800px; margin: 0 auto; }
          .header { background: #1e3a8a; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; }
          .event-box { background: #e3f2fd; border-left: 4px solid #2196f3; padding: 15px; margin: 15px 0; }
          .footer { background: #f5f5f5; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div style="background: #1e3a8a; padding: 20px; border-radius: 8px; margin-bottom: 15px; text-align: center;">
              <div style="color: #ffffff; font-size: 32px; font-weight: bold; font-family: Arial, sans-serif; letter-spacing: 2px;">
                <span style="font-size: 40px; margin-right: 10px;">⚡</span>TRIZEN
              </div>
              <div style="color: #ffffff; font-size: 14px; margin-top: 5px; opacity: 0.9;">
                VENTURES
              </div>
            </div>
          </div>
          <div class="content">
            <h2>Speaker Invitation</h2>
            <p>Dear ${data.name},</p>
            <p>We would like to invite you to speak at our upcoming event. Your expertise and experience would be a valuable addition to our event.</p>
            
            <div class="event-box">
              <h3>Event Details</h3>
              <p><strong>Event:</strong> ${data.eventTitle}</p>
              <p><strong>Date:</strong> ${data.eventDate}</p>
              <p><strong>Location:</strong> ${data.eventLocation}</p>
              <p><strong>Organization:</strong> ${data.organization}</p>
            </div>
            
            ${data.message ? `<p><strong>Personal Message:</strong> ${data.message}</p>` : ''}
            
            <h3>Next Steps</h3>
            <p>To accept this invitation and provide your speaker details, please click the button below:</p>
            <p><a href="${data.invitationUrl}" style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">Accept Invitation</a></p>
            
            <p>If you have any questions or need more information, please contact us at <a href="mailto:${data.supportEmail}">${data.supportEmail}</a>.</p>
            
            <p>We look forward to having you as a speaker!</p>
            <p>Best regards,<br>The Trizen Ventures Team</p>
          </div>
          <div class="footer">
            <img src="https://via.placeholder.com/400x100/f5f5f5/333333?text=Trizen+Ventures+Contact+Info" alt="Trizen Ventures Contact Information" style="max-width: 100%; height: auto; margin-bottom: 15px;">
            <p style="margin-top: 15px; font-size: 12px;">© 2025 Trizen Ventures. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `
  })
};

// Send email function
const sendEmail = async ({ email, subject, template, data, html, text }) => {
  try {
    const transporter = createTransporter();

    let emailContent;
    if (template && templates[template]) {
      emailContent = templates[template](data);
    } else {
      emailContent = { subject, html, text };
    }

    const mailOptions = {
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to: email,
      subject: emailContent.subject || subject,
      html: emailContent.html || html,
      text: emailContent.text || text
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', result.messageId);
    return result;
  } catch (error) {
    console.error('Email sending failed:', error);
    throw error;
  }
};

// Send bulk emails
const sendBulkEmail = async (emails, { subject, template, data, html, text }) => {
  try {
    const transporter = createTransporter();
    const results = [];

    for (const email of emails) {
      try {
        let emailContent;
        if (template && templates[template]) {
          emailContent = templates[template](data);
        } else {
          emailContent = { subject, html, text };
        }

        const mailOptions = {
          from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
          to: email,
          subject: emailContent.subject || subject,
          html: emailContent.html || html,
          text: emailContent.text || text
        };

        const result = await transporter.sendMail(mailOptions);
        results.push({ email, success: true, messageId: result.messageId });
      } catch (error) {
        results.push({ email, success: false, error: error.message });
      }
    }

    return results;
  } catch (error) {
    console.error('Bulk email sending failed:', error);
    throw error;
  }
};

module.exports = {
  sendEmail,
  sendBulkEmail,
  templates
};
