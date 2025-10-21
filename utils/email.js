const nodemailer = require('nodemailer');

// Email configuration
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: process.env.EMAIL_PORT || 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Send email function
const sendEmail = async ({ email, template, data }) => {
  const emailTemplate = templates[template](data);

  const mailOptions = {
    from: `"Trizen Ventures" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: emailTemplate.subject,
    html: emailTemplate.html
  };

  try {
    const result = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent successfully:', result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('❌ Email sending failed:', error);
    throw error;
  }
};

// Email templates
const templates = {
  eventRegistration: (data) => ({
    subject: `Registration Confirmed: ${data.eventTitle} - Trizen Community`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Event Registration Confirmed</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f5f5f5;">
          <tr>
            <td align="center" style="padding: 20px;">
              <table width="600" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden;">
                
                <!-- Header with Trizen Logo -->
                <tr>
                  <td style="background-color: #1e3a8a; padding: 30px; text-align: center;">
                    <table width="100%" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td align="center" style="color: #ffffff; font-size: 32px; font-weight: bold; font-family: Arial, sans-serif; letter-spacing: 2px;">
                          ⚡ TRIZEN
                        </td>
                      </tr>
                      <tr>
                        <td align="center" style="color: #ffffff; font-size: 14px; font-weight: 600; letter-spacing: 1px; text-transform: uppercase; padding-top: 5px;">
                          VENTURES
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                
                <!-- Registration Confirmed Banner -->
                <tr>
                  <td style="background-color: #2563eb; padding: 25px; text-align: center;">
                    <h1 style="color: #ffffff; font-size: 24px; font-weight: bold; margin: 0; font-family: Arial, sans-serif;">🎉 Registration Confirmed!</h1>
                    <p style="color: #ffffff; font-size: 16px; margin: 8px 0 0 0; font-family: Arial, sans-serif;">Trizen Community</p>
                  </td>
                </tr>
                
                <!-- Main Content -->
                <tr>
                  <td style="padding: 30px;">
                    <p style="font-size: 16px; font-weight: bold; color: #333333; margin: 0 0 20px 0; font-family: Arial, sans-serif;">Dear ${data.name},</p>
                    
                    <p style="font-size: 15px; color: #555555; line-height: 1.6; margin: 0 0 25px 0; font-family: Arial, sans-serif;">
                      Thank you for your interest in attending <strong>${data.eventTitle}</strong>. We're excited to confirm your registration!
                    </p>
                    
                    <!-- Event Details -->
                    <div style="background-color: #f8f9fa; border: 1px solid #e9ecef; border-radius: 8px; padding: 20px; margin: 20px 0;">
                      <h2 style="color: #333333; font-size: 20px; margin: 0 0 15px 0; font-family: Arial, sans-serif;">${data.eventTitle}</h2>
                      <table width="100%" cellpadding="0" cellspacing="0" border="0">
                        <tr>
                          <td style="padding: 8px 0; font-size: 14px; color: #666666; font-family: Arial, sans-serif;">📅 Date:</td>
                          <td style="padding: 8px 0; font-size: 14px; color: #333333; font-weight: 500; font-family: Arial, sans-serif;">${data.eventDate}</td>
                        </tr>
                        <tr>
                          <td style="padding: 8px 0; font-size: 14px; color: #666666; font-family: Arial, sans-serif;">🕐 Time:</td>
                          <td style="padding: 8px 0; font-size: 14px; color: #333333; font-weight: 500; font-family: Arial, sans-serif;">${data.eventTime}</td>
                        </tr>
                        <tr>
                          <td style="padding: 8px 0; font-size: 14px; color: #666666; font-family: Arial, sans-serif;">📍 Location:</td>
                          <td style="padding: 8px 0; font-size: 14px; color: #333333; font-weight: 500; font-family: Arial, sans-serif;">${data.eventLocation}</td>
                        </tr>
                      </table>
                    </div>
                    
                    <!-- Ticket Info -->
                    <div style="background-color: #e8f5e8; border: 1px solid #c3e6c3; border-radius: 8px; padding: 20px; margin: 20px 0;">
                      <h3 style="color: #2d5a2d; margin: 0 0 10px 0; font-size: 16px; font-family: Arial, sans-serif;">🎫 Your Registration Details</h3>
                      <p style="color: #2d5a2d; font-size: 14px; margin: 0 0 10px 0; font-family: Arial, sans-serif;">Your ticket number:</p>
                      <div style="background-color: #ffffff; border: 1px solid #2d5a2d; border-radius: 4px; padding: 10px; font-family: 'Courier New', monospace; font-size: 16px; font-weight: bold; color: #2d5a2d; display: inline-block;">${data.ticketNumber}</div>
                    </div>
                    
                    <!-- Action Buttons -->
                    <div style="text-align: center; margin: 25px 0;">
                      <a href="${data.ticketUrl}" style="background-color: #2563eb; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: bold; font-size: 14px; font-family: Arial, sans-serif; display: inline-block; margin: 5px;">View Your Ticket</a>
                      <a href="${data.eventUrl}" style="background-color: #059669; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: bold; font-size: 14px; font-family: Arial, sans-serif; display: inline-block; margin: 5px;">Event Details</a>
                    </div>
                    
                    <p style="color: #666666; font-size: 14px; line-height: 1.6; margin: 20px 0 0 0; font-family: Arial, sans-serif;">
                      If you have any questions or need to make changes to your registration, please don't hesitate to contact us at <a href="${data.supportUrl}" style="color: #2563eb; text-decoration: none;">our support center</a>.
                    </p>
                  </td>
                </tr>
                
                <!-- Footer -->
                <tr>
                  <td style="background-color: #f8f9fa; padding: 25px; text-align: center; border-top: 1px solid #e9ecef;">
                    <table width="100%" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td align="center" style="padding: 15px; background-color: #ffffff; border-radius: 8px; margin-bottom: 15px;">
                          <p style="margin: 0; font-size: 16px; font-weight: bold; color: #333333; font-family: Arial, sans-serif;">Trizen Ventures</p>
                          <p style="margin: 5px 0 0 0; font-size: 14px; color: #666666; font-family: Arial, sans-serif;">Email: <span style="background-color: #fff3cd; padding: 2px 6px; border-radius: 3px;">support@trizenventures.com</span></p>
                          <p style="margin: 5px 0 0 0; font-size: 14px; color: #666666; font-family: Arial, sans-serif;">Website: <a href="https://trizenventures.com" style="color: #2563eb; text-decoration: none;">https://trizenventures.com</a></p>
                          <p style="margin: 5px 0 0 0; font-size: 14px; color: #666666; font-family: Arial, sans-serif;">LinkedIn: <a href="https://linkedin.com/company/trizenventures" style="color: #2563eb; text-decoration: none;">Follow us on LinkedIn</a></p>
                        </td>
                      </tr>
                      <tr>
                        <td align="center" style="padding-top: 15px;">
                          <p style="margin: 0; font-size: 12px; color: #999999; font-family: Arial, sans-serif;">© 2025 Trizen Ventures. All rights reserved.</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                
              </table>
            </td>
          </tr>
        </table>
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
      </head>
      <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f5f5f5;">
          <tr>
            <td align="center" style="padding: 20px;">
              <table width="600" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden;">
                
                <!-- Header with Trizen Logo -->
                <tr>
                  <td style="background-color: #1e3a8a; padding: 30px; text-align: center;">
                    <table width="100%" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td align="center" style="color: #ffffff; font-size: 32px; font-weight: bold; font-family: Arial, sans-serif; letter-spacing: 2px;">
                          ⚡ TRIZEN
                        </td>
                      </tr>
                      <tr>
                        <td align="center" style="color: #ffffff; font-size: 14px; font-weight: 600; letter-spacing: 1px; text-transform: uppercase; padding-top: 5px;">
                          VENTURES
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                
                <!-- Main Content -->
                <tr>
                  <td style="padding: 30px;">
                    <h1 style="color: #333333; font-size: 24px; margin: 0 0 20px 0; font-family: Arial, sans-serif;">Thank You for Your Speaker Application!</h1>
                    
                    <p style="font-size: 16px; color: #333333; margin: 0 0 20px 0; font-family: Arial, sans-serif;">Dear ${data.name},</p>
                    
                    <p style="font-size: 15px; color: #555555; line-height: 1.6; margin: 0 0 25px 0; font-family: Arial, sans-serif;">
                      Thank you for your interest in speaking at Trizen Ventures events. We have received your application and are excited about the possibility of having you as a speaker.
                    </p>
                    
                    <div style="background-color: #e8f5e8; border: 1px solid #c3e6c3; border-radius: 8px; padding: 20px; margin: 20px 0;">
                      <h3 style="color: #2d5a2d; margin: 0 0 15px 0; font-size: 18px; font-family: Arial, sans-serif;">Application Details</h3>
                      <p style="color: #2d5a2d; font-size: 14px; margin: 5px 0; font-family: Arial, sans-serif;"><strong>Name:</strong> ${data.name}</p>
                      <p style="color: #2d5a2d; font-size: 14px; margin: 5px 0; font-family: Arial, sans-serif;"><strong>Organization:</strong> ${data.organization}</p>
                      <p style="color: #2d5a2d; font-size: 14px; margin: 5px 0; font-family: Arial, sans-serif;"><strong>Applied On:</strong> ${data.appliedAt}</p>
                      <p style="color: #2d5a2d; font-size: 14px; margin: 5px 0; font-family: Arial, sans-serif;"><strong>Status:</strong> Under Review</p>
                    </div>
                    
                    <h3 style="color: #333333; font-size: 18px; margin: 20px 0 15px 0; font-family: Arial, sans-serif;">What Happens Next?</h3>
                    <ul style="color: #555555; font-size: 14px; line-height: 1.6; margin: 0 0 20px 0; font-family: Arial, sans-serif;">
                      <li>Our team will review your application within 3-5 business days</li>
                      <li>We'll assess your expertise and speaking experience</li>
                      <li>You'll receive an email with our decision</li>
                      <li>If approved, we'll discuss event details and logistics</li>
                    </ul>
                    
                    <p style="color: #555555; font-size: 14px; line-height: 1.6; margin: 20px 0 0 0; font-family: Arial, sans-serif;">
                      We appreciate your interest in sharing your knowledge with our community. If you have any questions, please don't hesitate to contact us.
                    </p>
                    
                    <p style="color: #555555; font-size: 14px; margin: 20px 0 0 0; font-family: Arial, sans-serif;">
                      Best regards,<br>The Trizen Ventures Team
                    </p>
                  </td>
                </tr>
                
                <!-- Footer -->
                <tr>
                  <td style="background-color: #f8f9fa; padding: 25px; text-align: center; border-top: 1px solid #e9ecef;">
                    <table width="100%" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td align="center" style="padding: 15px; background-color: #ffffff; border-radius: 8px; margin-bottom: 15px;">
                          <p style="margin: 0; font-size: 16px; font-weight: bold; color: #333333; font-family: Arial, sans-serif;">Trizen Ventures</p>
                          <p style="margin: 5px 0 0 0; font-size: 14px; color: #666666; font-family: Arial, sans-serif;">Email: <span style="background-color: #fff3cd; padding: 2px 6px; border-radius: 3px;">${data.supportEmail}</span></p>
                          <p style="margin: 5px 0 0 0; font-size: 14px; color: #666666; font-family: Arial, sans-serif;">Website: <a href="https://trizenventures.com" style="color: #2563eb; text-decoration: none;">https://trizenventures.com</a></p>
                          <p style="margin: 5px 0 0 0; font-size: 14px; color: #666666; font-family: Arial, sans-serif;">LinkedIn: <a href="https://linkedin.com/company/trizenventures" style="color: #2563eb; text-decoration: none;">Follow us on LinkedIn</a></p>
                        </td>
                      </tr>
                      <tr>
                        <td align="center" style="padding-top: 15px;">
                          <p style="margin: 0; font-size: 12px; color: #999999; font-family: Arial, sans-serif;">© 2025 Trizen Ventures. All rights reserved.</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `
  }),

  speakerApplicationNotification: (data) => ({
    subject: 'New Speaker Application - Trizen Ventures',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Speaker Application</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f5f5f5;">
          <tr>
            <td align="center" style="padding: 20px;">
              <table width="600" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden;">
                
                <!-- Header with Trizen Logo -->
                <tr>
                  <td style="background-color: #1e3a8a; padding: 30px; text-align: center;">
                    <table width="100%" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td align="center" style="color: #ffffff; font-size: 32px; font-weight: bold; font-family: Arial, sans-serif; letter-spacing: 2px;">
                          ⚡ TRIZEN
                        </td>
                      </tr>
                      <tr>
                        <td align="center" style="color: #ffffff; font-size: 14px; font-weight: 600; letter-spacing: 1px; text-transform: uppercase; padding-top: 5px;">
                          VENTURES
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                
                <!-- Main Content -->
                <tr>
                  <td style="padding: 30px;">
                    <h1 style="color: #333333; font-size: 24px; margin: 0 0 20px 0; font-family: Arial, sans-serif;">New Speaker Application Received</h1>
                    
                    <p style="font-size: 16px; color: #333333; margin: 0 0 20px 0; font-family: Arial, sans-serif;">A new speaker application has been submitted:</p>
                    
                    <div style="background-color: #f8f9fa; border: 1px solid #e9ecef; border-radius: 8px; padding: 20px; margin: 20px 0;">
                      <h3 style="color: #333333; margin: 0 0 15px 0; font-size: 18px; font-family: Arial, sans-serif;">Application Details</h3>
                      <p style="color: #555555; font-size: 14px; margin: 5px 0; font-family: Arial, sans-serif;"><strong>Name:</strong> ${data.name}</p>
                      <p style="color: #555555; font-size: 14px; margin: 5px 0; font-family: Arial, sans-serif;"><strong>Email:</strong> ${data.email}</p>
                      <p style="color: #555555; font-size: 14px; margin: 5px 0; font-family: Arial, sans-serif;"><strong>Organization:</strong> ${data.organization}</p>
                      <p style="color: #555555; font-size: 14px; margin: 5px 0; font-family: Arial, sans-serif;"><strong>Expertise:</strong> ${data.expertise.join(', ')}</p>
                      <p style="color: #555555; font-size: 14px; margin: 5px 0; font-family: Arial, sans-serif;"><strong>Applied On:</strong> ${data.appliedAt}</p>
                    </div>
                    
                    <div style="background-color: #e3f2fd; border: 1px solid #bbdefb; border-radius: 8px; padding: 20px; margin: 20px 0;">
                      <h3 style="color: #1976d2; margin: 0 0 10px 0; font-size: 16px; font-family: Arial, sans-serif;">Bio</h3>
                      <p style="color: #555555; font-size: 14px; line-height: 1.6; margin: 0; font-family: Arial, sans-serif;">${data.bio}</p>
                    </div>
                    
                    <div style="text-align: center; margin: 25px 0;">
                      <a href="${data.adminUrl}" style="background-color: #2563eb; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: bold; font-size: 14px; font-family: Arial, sans-serif; display: inline-block;">Review Application</a>
                    </div>
                  </td>
                </tr>
                
                <!-- Footer -->
                <tr>
                  <td style="background-color: #f8f9fa; padding: 25px; text-align: center; border-top: 1px solid #e9ecef;">
                    <p style="margin: 0; font-size: 12px; color: #999999; font-family: Arial, sans-serif;">© 2025 Trizen Ventures. All rights reserved.</p>
                  </td>
                </tr>
                
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `
  })
};

module.exports = { sendEmail, templates };
