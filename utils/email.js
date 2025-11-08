const nodemailer = require('nodemailer');

// Email configuration
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp-mail.outlook.com',
  port: process.env.EMAIL_PORT || 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Helper function to generate email header with TRIZEN logo and banner
const generateEmailHeader = (bannerTitle, bannerSubtitle) => {
  return `
                <!-- Header with Trizen Logo and Banner -->
                <tr>
                <td style="padding: 40px 40px 20px 40px; text-align: center; background: #372f87; -webkit-user-select: none; -moz-user-select: none; user-select: none;">
                <div style="max-width: 300px; margin: 0 auto 30px auto;">
                <img src="https://drive.google.com/uc?export=view&id=1L_BZnvQMruCtK30J_nVlhyq01iZNA1KL" 
                alt="TRIZEN" 
                style="height: auto; width: 100%; max-width: 250px; display: block; margin: 0 auto;"
                onerror="this.src='https://drive.google.com/thumbnail?id=1L_BZnvQMruCtK30J_nVlhyq01iZNA1KL&sz=w500'; this.onerror=null;">
                </div>
                <div style="padding-top: 20px; border-top: 1px solid rgba(255, 255, 255, 0.2);">
                    <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: bold; font-family: Arial, sans-serif;">${bannerTitle}</h1>
                    ${bannerSubtitle ? `<p style="margin: 10px 0 0 0; color: #ffffff; font-size: 16px; font-family: Arial, sans-serif;">${bannerSubtitle}</p>` : ''}
                </div>
                </td>
                </tr>
`;
};

// Helper function to generate unsubscribe footer
const generateUnsubscribeFooter = (subscriptionToken) => {
  // Redirect to settings page with email tab for easy unsubscribe
  const frontendUrl = process.env.FRONTEND_URL || 'https://community.trizenventures.com';
  const unsubscribeUrl = `${frontendUrl}/settings?tab=emails`;

  return `
                      <tr>
                        <td align="center" style="padding: 30px 20px; background-color: #f8f9fa; border-top: 2px solid #e9ecef;">
                          <div style="max-width: 400px; margin: 0 auto;">
                            <div style="background-color: #ffffff; padding: 25px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); margin-bottom: 20px;">
                              <h4 style="margin: 0 0 15px 0; font-size: 16px; color: #333333; font-family: Arial, sans-serif; font-weight: bold;">
                                Email Preferences
                              </h4>
                              <p style="margin: 0 0 20px 0; font-size: 14px; color: #6c757d; font-family: Arial, sans-serif; line-height: 1.5;">
                                You're receiving this email because you're part of the Trizen Community. 
                                Manage your email preferences or unsubscribe anytime.
                              </p>
                              <a href="${unsubscribeUrl}" 
                                 style="display: inline-block; background-color: #372f87; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-size: 14px; font-family: Arial, sans-serif; font-weight: bold; margin-bottom: 15px; transition: background-color 0.3s;">
                                Manage Email Settings
                              </a>
                              <p style="margin: 0; font-size: 12px; color: #999999; font-family: Arial, sans-serif;">
                                This will take you to your account settings where you can customize your email preferences.
                              </p>
                            </div>
                            <p style="margin: 0; font-size: 11px; color: #999999; font-family: Arial, sans-serif;">
                              © 2025 Trizen Ventures. All rights reserved.
                            </p>
                          </div>
                        </td>
                      </tr>
`;
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
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f8fafc;">
          <tr>
            <td align="center" style="padding: 40px 20px;">
              <table width="900" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.15); max-width: 900px;">
                ${generateEmailHeader('Registration Confirmed!', `You're all set for ${data.eventTitle}`)}
                
                <!-- Event Details -->
                <tr>
                  <td style="padding: 40px;">
                    <h2 style="margin: 0 0 20px 0; color: #333333; font-size: 20px; font-family: Arial, sans-serif;">Event Details</h2>
                    <table width="100%" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td style="padding: 10px 0; border-bottom: 1px solid #e9ecef;">
                          <strong style="color: #333333; font-family: Arial, sans-serif;">Event:</strong>
                          <span style="color: #666666; font-family: Arial, sans-serif; margin-left: 10px;">${data.eventTitle}</span>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 10px 0; border-bottom: 1px solid #e9ecef;">
                          <strong style="color: #333333; font-family: Arial, sans-serif;">Date:</strong>
                          <span style="color: #666666; font-family: Arial, sans-serif; margin-left: 10px;">${data.eventDate}</span>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 10px 0; border-bottom: 1px solid #e9ecef;">
                          <strong style="color: #333333; font-family: Arial, sans-serif;">Time:</strong>
                          <span style="color: #666666; font-family: Arial, sans-serif; margin-left: 10px;">${data.eventTime}</span>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 10px 0; border-bottom: 1px solid #e9ecef;">
                          <strong style="color: #333333; font-family: Arial, sans-serif;">Registration ID:</strong>
                          <span style="color: #372f87; font-family: Arial, sans-serif; margin-left: 10px; font-weight: bold;">${data.ticketNumber || 'TRIZEN-' + Date.now().toString().slice(-8)}</span>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 10px 0; border-bottom: 1px solid #e9ecef;">
                          <strong style="color: #333333; font-family: Arial, sans-serif;">Location:</strong>
                          <span style="color: #666666; font-family: Arial, sans-serif; margin-left: 10px;">${data.eventLocation}</span>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 10px 0;">
                          <strong style="color: #333333; font-family: Arial, sans-serif;">Registration ID:</strong>
                          <span style="color: #666666; font-family: Arial, sans-serif; margin-left: 10px;">${data.registrationId}</span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                
                <!-- Ticket Section -->
                <tr>
                  <td style="padding: 20px 30px; background-color: #f8f9fa; border-top: 1px solid #e9ecef;">
                    <div style="background-color: #ffffff; border: 2px solid #372f87; border-radius: 8px; padding: 20px; text-align: center;">
                      <h3 style="margin: 0 0 10px 0; color: #372f87; font-size: 18px; font-family: Arial, sans-serif;">Your Event Ticket</h3>
                      <div style="background-color: #372f87; color: #ffffff; padding: 15px; border-radius: 6px; margin: 10px 0;">
                        <strong style="font-size: 16px; font-family: Arial, sans-serif;">Registration ID: ${data.ticketNumber || 'TRIZEN-' + Date.now().toString().slice(-8)}</strong>
          </div>
                      <p style="margin: 10px 0 0 0; color: #666666; font-size: 14px; font-family: Arial, sans-serif;">Please keep this ID for your records</p>
          </div>
                  </td>
                </tr>
                
                <!-- Next Steps -->
                <tr>
                  <td style="padding: 0 30px 30px 30px;">
                    <h3 style="margin: 0 0 15px 0; color: #333333; font-size: 18px; font-family: Arial, sans-serif;">What's Next?</h3>
                    <ul style="margin: 0; padding-left: 20px; color: #666666; font-family: Arial, sans-serif; line-height: 1.6;">
                      <li>You'll receive a calendar invite shortly</li>
                      <li>Check your email for any updates or changes</li>
                      <li>Join our community for networking opportunities</li>
                      <li>Follow us on LinkedIn for event updates</li>
                    </ul>
                  </td>
                </tr>
                
                <!-- Contact Information -->
                <tr>
                  <td style="background-color: #f8f9fa; padding: 30px; text-align: center; border-top: 1px solid #e9ecef;">
                    <table width="100%" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td align="center" style="padding: 15px; background-color: #ffffff; border-radius: 8px; margin-bottom: 15px;">
                          <p style="margin: 0; font-size: 16px; font-weight: bold; color: #333333; font-family: Arial, sans-serif;">Trizen Ventures</p>
                          <p style="margin: 5px 0 0 0; font-size: 14px; color: #666666; font-family: Arial, sans-serif;">Email: <span style="background-color: #fff3cd; padding: 2px 6px; border-radius: 3px;">support@trizenventures.com</span></p>
                          <p style="margin: 5px 0 0 0; font-size: 14px; color: #666666; font-family: Arial, sans-serif;">Website: <a href="https://trizenventures.com" style="color: #372f87; text-decoration: none;">https://trizenventures.com</a></p>
                          <p style="margin: 5px 0 0 0; font-size: 14px; color: #666666; font-family: Arial, sans-serif;">LinkedIn: <a href="https://linkedin.com/company/trizenventures" style="color: #372f87; text-decoration: none;">Follow us on LinkedIn</a></p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                
                ${generateUnsubscribeFooter(data.subscriptionToken)}
              </table>
            </td>
          </tr>
        </table>
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
      </head>
      <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f8fafc;">
          <tr>
            <td align="center" style="padding: 40px 20px;">
              <table width="900" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.15); max-width: 900px;">
                ${generateEmailHeader('New Contact Form Submission', data.subject)}
                
                <!-- Contact Form Details -->
                <tr>
                  <td style="padding: 30px;">
                    <h2 style="margin: 0 0 20px 0; color: #333333; font-size: 20px; font-family: Arial, sans-serif;">New Contact Form Submission</h2>
                    <table width="100%" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td style="padding: 10px 0; border-bottom: 1px solid #e9ecef;">
                          <strong style="color: #333333; font-family: Arial, sans-serif;">Name:</strong>
                          <span style="color: #666666; font-family: Arial, sans-serif; margin-left: 10px;">${data.name}</span>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 10px 0; border-bottom: 1px solid #e9ecef;">
                          <strong style="color: #333333; font-family: Arial, sans-serif;">Email:</strong>
                          <span style="color: #666666; font-family: Arial, sans-serif; margin-left: 10px;">${data.email}</span>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 10px 0; border-bottom: 1px solid #e9ecef;">
                          <strong style="color: #333333; font-family: Arial, sans-serif;">Company:</strong>
                          <span style="color: #666666; font-family: Arial, sans-serif; margin-left: 10px;">${data.company}</span>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 10px 0; border-bottom: 1px solid #e9ecef;">
                          <strong style="color: #333333; font-family: Arial, sans-serif;">Inquiry Type:</strong>
                          <span style="color: #666666; font-family: Arial, sans-serif; margin-left: 10px;">${data.inquiryType}</span>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 10px 0; border-bottom: 1px solid #e9ecef;">
                          <strong style="color: #333333; font-family: Arial, sans-serif;">Subject:</strong>
                          <span style="color: #666666; font-family: Arial, sans-serif; margin-left: 10px;">${data.subject}</span>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 10px 0;">
                          <strong style="color: #333333; font-family: Arial, sans-serif;">Message:</strong>
                          <div style="color: #666666; font-family: Arial, sans-serif; margin-top: 10px; padding: 15px; background-color: #f8f9fa; border-radius: 5px; line-height: 1.6;">${data.message}</div>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                
                <!-- Contact Information -->
                <tr>
                  <td style="background-color: #f8f9fa; padding: 30px; text-align: center; border-top: 1px solid #e9ecef;">
                    <table width="100%" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td align="center" style="padding: 15px; background-color: #ffffff; border-radius: 8px; margin-bottom: 15px;">
                          <p style="margin: 0; font-size: 16px; font-weight: bold; color: #333333; font-family: Arial, sans-serif;">Trizen Ventures</p>
                          <p style="margin: 5px 0 0 0; font-size: 14px; color: #666666; font-family: Arial, sans-serif;">Email: <span style="background-color: #fff3cd; padding: 2px 6px; border-radius: 3px;">support@trizenventures.com</span></p>
                          <p style="margin: 5px 0 0 0; font-size: 14px; color: #666666; font-family: Arial, sans-serif;">Website: <a href="https://trizenventures.com" style="color: #372f87; text-decoration: none;">https://trizenventures.com</a></p>
                          <p style="margin: 5px 0 0 0; font-size: 14px; color: #666666; font-family: Arial, sans-serif;">LinkedIn: <a href="https://linkedin.com/company/trizenventures" style="color: #372f87; text-decoration: none;">Follow us on LinkedIn</a></p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                
                ${generateUnsubscribeFooter(data.subscriptionToken)}
              </table>
            </td>
          </tr>
        </table>
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
      </head>
      <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f8fafc;">
          <tr>
            <td align="center" style="padding: 40px 20px;">
              <table width="900" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.15); max-width: 900px;">
                ${generateEmailHeader('Thank You for Contacting Us!', 'We\'ll get back to you soon')}
                
                <!-- Thank You Message -->
                <tr>
                  <td style="padding: 30px; text-align: center;">
                    <h1 style="margin: 0 0 20px 0; color: #333333; font-size: 24px; font-family: Arial, sans-serif;">Thank You for Contacting Us!</h1>
                    <p style="margin: 0 0 20px 0; color: #666666; font-size: 16px; font-family: Arial, sans-serif; line-height: 1.6;">
                      Hi ${data.name},
                    </p>
                    <p style="margin: 0 0 20px 0; color: #666666; font-size: 16px; font-family: Arial, sans-serif; line-height: 1.6;">
                      Thank you for reaching out to us regarding <strong>${data.inquiryType}</strong>. We have received your message about "<strong>${data.subject}</strong>" and will get back to you within 24 hours.
                    </p>
                    <p style="margin: 0 0 20px 0; color: #666666; font-size: 16px; font-family: Arial, sans-serif; line-height: 1.6;">
                      In the meantime, feel free to explore our community and upcoming events.
                    </p>
                  </td>
                </tr>
                
                <!-- Contact Information -->
                <tr>
                  <td style="background-color: #f8f9fa; padding: 30px; text-align: center; border-top: 1px solid #e9ecef;">
                    <table width="100%" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td align="center" style="padding: 15px; background-color: #ffffff; border-radius: 8px; margin-bottom: 15px;">
                          <p style="margin: 0; font-size: 16px; font-weight: bold; color: #333333; font-family: Arial, sans-serif;">Trizen Ventures</p>
                          <p style="margin: 5px 0 0 0; font-size: 14px; color: #666666; font-family: Arial, sans-serif;">Email: <span style="background-color: #fff3cd; padding: 2px 6px; border-radius: 3px;">support@trizenventures.com</span></p>
                          <p style="margin: 5px 0 0 0; font-size: 14px; color: #666666; font-family: Arial, sans-serif;">Website: <a href="https://trizenventures.com" style="color: #372f87; text-decoration: none;">https://trizenventures.com</a></p>
                          <p style="margin: 5px 0 0 0; font-size: 14px; color: #666666; font-family: Arial, sans-serif;">LinkedIn: <a href="https://linkedin.com/company/trizenventures" style="color: #372f87; text-decoration: none;">Follow us on LinkedIn</a></p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                
                ${generateUnsubscribeFooter(data.subscriptionToken)}
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
        <title>Speaker Application Received</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f8fafc;">
          <tr>
            <td align="center" style="padding: 40px 20px;">
              <table width="900" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.15); max-width: 900px;">
                ${generateEmailHeader('Speaker Application Received!', 'We\'ll review your application soon')}
                
                <!-- Application Confirmation -->
                <tr>
                  <td style="padding: 30px; text-align: center;">
                    <h1 style="margin: 0 0 20px 0; color: #333333; font-size: 24px; font-family: Arial, sans-serif;">Speaker Application Received!</h1>
                    <p style="margin: 0 0 20px 0; color: #666666; font-size: 16px; font-family: Arial, sans-serif; line-height: 1.6;">
                      Hi ${data.name},
                    </p>
                    <p style="margin: 0 0 20px 0; color: #666666; font-size: 16px; font-family: Arial, sans-serif; line-height: 1.6;">
                      Thank you for your interest in speaking at Trizen Ventures events. We have received your application from <strong>${data.organization}</strong> and will review it carefully.
                    </p>
                    <p style="margin: 0 0 20px 0; color: #666666; font-size: 16px; font-family: Arial, sans-serif; line-height: 1.6;">
                      We will get back to you within 5-7 business days with our decision.
                    </p>
                  </td>
                </tr>
                
                <!-- Contact Information -->
                <tr>
                  <td style="background-color: #f8f9fa; padding: 30px; text-align: center; border-top: 1px solid #e9ecef;">
                    <table width="100%" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td align="center" style="padding: 15px; background-color: #ffffff; border-radius: 8px; margin-bottom: 15px;">
                          <p style="margin: 0; font-size: 16px; font-weight: bold; color: #333333; font-family: Arial, sans-serif;">Trizen Ventures</p>
                          <p style="margin: 5px 0 0 0; font-size: 14px; color: #666666; font-family: Arial, sans-serif;">Email: <span style="background-color: #fff3cd; padding: 2px 6px; border-radius: 3px;">support@trizenventures.com</span></p>
                          <p style="margin: 5px 0 0 0; font-size: 14px; color: #666666; font-family: Arial, sans-serif;">Website: <a href="https://trizenventures.com" style="color: #372f87; text-decoration: none;">https://trizenventures.com</a></p>
                          <p style="margin: 5px 0 0 0; font-size: 14px; color: #666666; font-family: Arial, sans-serif;">LinkedIn: <a href="https://linkedin.com/company/trizenventures" style="color: #372f87; text-decoration: none;">Follow us on LinkedIn</a></p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                
                ${generateUnsubscribeFooter(data.subscriptionToken)}
              </table>
            </td>
          </tr>
        </table>
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
      </head>
      <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f8fafc;">
          <tr>
            <td align="center" style="padding: 40px 20px;">
              <table width="900" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.15); max-width: 900px;">
                ${generateEmailHeader('New Speaker Application', `From ${data.name}`)}
                
                <!-- New Application Notification -->
                <tr>
                  <td style="padding: 30px;">
                    <h2 style="margin: 0 0 20px 0; color: #333333; font-size: 20px; font-family: Arial, sans-serif;">New Speaker Application Received</h2>
                    <table width="100%" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td style="padding: 10px 0; border-bottom: 1px solid #e9ecef;">
                          <strong style="color: #333333; font-family: Arial, sans-serif;">Name:</strong>
                          <span style="color: #666666; font-family: Arial, sans-serif; margin-left: 10px;">${data.name}</span>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 10px 0; border-bottom: 1px solid #e9ecef;">
                          <strong style="color: #333333; font-family: Arial, sans-serif;">Email:</strong>
                          <span style="color: #666666; font-family: Arial, sans-serif; margin-left: 10px;">${data.email}</span>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 10px 0; border-bottom: 1px solid #e9ecef;">
                          <strong style="color: #333333; font-family: Arial, sans-serif;">Organization:</strong>
                          <span style="color: #666666; font-family: Arial, sans-serif; margin-left: 10px;">${data.organization}</span>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 10px 0; border-bottom: 1px solid #e9ecef;">
                          <strong style="color: #333333; font-family: Arial, sans-serif;">Expertise:</strong>
                          <span style="color: #666666; font-family: Arial, sans-serif; margin-left: 10px;">${data.expertise.join(', ')}</span>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 10px 0;">
                          <strong style="color: #333333; font-family: Arial, sans-serif;">Bio:</strong>
                          <div style="color: #666666; font-family: Arial, sans-serif; margin-top: 10px; padding: 15px; background-color: #f8f9fa; border-radius: 5px; line-height: 1.6;">${data.bio}</div>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                
                <!-- Contact Information -->
                <tr>
                  <td style="background-color: #f8f9fa; padding: 30px; text-align: center; border-top: 1px solid #e9ecef;">
                    <table width="100%" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td align="center" style="padding: 15px; background-color: #ffffff; border-radius: 8px; margin-bottom: 15px;">
                          <p style="margin: 0; font-size: 16px; font-weight: bold; color: #333333; font-family: Arial, sans-serif;">Trizen Ventures</p>
                          <p style="margin: 5px 0 0 0; font-size: 14px; color: #666666; font-family: Arial, sans-serif;">Email: <span style="background-color: #fff3cd; padding: 2px 6px; border-radius: 3px;">support@trizenventures.com</span></p>
                          <p style="margin: 5px 0 0 0; font-size: 14px; color: #666666; font-family: Arial, sans-serif;">Website: <a href="https://trizenventures.com" style="color: #372f87; text-decoration: none;">https://trizenventures.com</a></p>
                          <p style="margin: 5px 0 0 0; font-size: 14px; color: #666666; font-family: Arial, sans-serif;">LinkedIn: <a href="https://linkedin.com/company/trizenventures" style="color: #372f87; text-decoration: none;">Follow us on LinkedIn</a></p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                
                ${generateUnsubscribeFooter(data.subscriptionToken)}
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `
  }),

  // OTP Verification template for email verification and password reset
  otpVerification: (data) => ({
    subject: data.type === 'password_reset'
      ? 'Your Password Reset Code - Trizen Community'
      : 'Verify Your Email - Trizen Community',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${data.type === 'password_reset' ? 'Password Reset' : 'Email Verification'}</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f8fafc;">
          <tr>
            <td align="center" style="padding: 40px 20px;">
              <table width="900" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.15); max-width: 900px;">
                ${generateEmailHeader(
                  data.type === 'password_reset' ? 'Password Reset Request' : 'Verify Your Email',
                  data.type === 'password_reset' 
                    ? 'Use the code below to reset your password' 
                    : 'Welcome to Trizen Community!'
                )}
                
                <!-- Content -->
                <tr>
                  <td style="padding: 40px;">
                    <p style="margin: 0 0 20px 0; color: #333333; font-size: 16px; font-family: Arial, sans-serif;">
                      Hi ${data.name},
                    </p>
                    <p style="margin: 0 0 20px 0; color: #666666; font-size: 16px; font-family: Arial, sans-serif; line-height: 1.6;">
                      ${data.type === 'password_reset'
        ? 'We received a request to reset your password. Use the verification code below to complete the process:'
        : 'Thank you for joining the Trizen Community! Please use the verification code below to verify your email address:'}
                    </p>
                    
                    <!-- OTP Code Box -->
                    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 30px 0;">
                      <tr>
                        <td align="center">
                          <div style="background: linear-gradient(135deg, #372f87 0%, #4c3fa3 100%); padding: 30px; border-radius: 12px; display: inline-block;">
                            <p style="margin: 0 0 10px 0; color: #ffffff; font-size: 14px; font-family: Arial, sans-serif; text-transform: uppercase; letter-spacing: 1px;">
                              Your Verification Code
                            </p>
                            <p style="margin: 0; color: #ffffff; font-size: 42px; font-weight: bold; font-family: 'Courier New', monospace; letter-spacing: 8px;">
                              ${data.otp}
                            </p>
                          </div>
                        </td>
                      </tr>
                    </table>
                    
                    <p style="margin: 20px 0; color: #666666; font-size: 14px; font-family: Arial, sans-serif; line-height: 1.6;">
                      This code will expire in <strong>10 minutes</strong> for your security.
                    </p>
                    
                    ${data.type === 'password_reset'
        ? `<p style="margin: 20px 0; color: #dc2626; font-size: 14px; font-family: Arial, sans-serif; line-height: 1.6;">
                          <strong>⚠️ Important:</strong> If you didn't request a password reset, please ignore this email or contact our support team.
                        </p>`
        : ''}
                    
                    <div style="background-color: #f8f9fa; padding: 20px; border-left: 4px solid #372f87; border-radius: 4px; margin: 30px 0;">
                      <p style="margin: 0; color: #666666; font-size: 14px; font-family: Arial, sans-serif;">
                        <strong>Need help?</strong> Contact us at 
                        <a href="mailto:support@trizenventures.com" style="color: #372f87; text-decoration: none;">support@trizenventures.com</a>
                      </p>
                    </div>
                  </td>
                </tr>
                
                <!-- Footer -->
                <tr>
                  <td style="background-color: #f8f9fa; padding: 30px; text-align: center; border-top: 1px solid #e9ecef;">
                    <p style="margin: 0 0 10px 0; color: #999999; font-size: 12px; font-family: Arial, sans-serif;">
                      This is an automated message, please do not reply to this email.
                    </p>
                    <p style="margin: 0; font-size: 11px; color: #999999; font-family: Arial, sans-serif;">
                      © 2025 Trizen Ventures. All rights reserved.
                    </p>
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

// Send email function
const sendEmail = async ({ email, template, data, checkSubscription = true }) => {
  // If checking subscription, verify user is subscribed
  if (checkSubscription && data.userId) {
    const User = require('../models/User');
    const user = await User.findById(data.userId);
    if (!user || !user.isSubscribed) {
      console.log('📧 User not subscribed, skipping email:', email);
      return { success: false, error: 'User not subscribed' };
    }
    // Add subscription token to data if not present
    if (!data.subscriptionToken) {
      data.subscriptionToken = user.subscriptionToken;
    }
  }

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

module.exports = { sendEmail };