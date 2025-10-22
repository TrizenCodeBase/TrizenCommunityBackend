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

// Helper function to generate unsubscribe footer
const generateUnsubscribeFooter = (subscriptionToken) => {
  // Use the backend direct unsubscribe endpoint that works without frontend
  const unsubscribeUrl = `${process.env.BACKEND_URL || 'http://localhost:5000'}/unsubscribe/${subscriptionToken || ''}`;

  return `
                      <tr>
                        <td align="center" style="padding: 20px; background-color: #f8f9fa; border-top: 1px solid #e9ecef;">
                          <div style="max-width: 300px; margin: 0 auto;">
                            <p style="margin: 0 0 15px 0; font-size: 12px; color: #6c757d; font-family: Arial, sans-serif; line-height: 1.4;">
                              You're receiving this email because you're part of the Trizen Community. 
                              If you no longer wish to receive these emails, you can unsubscribe below.
                            </p>
                            <a href="${unsubscribeUrl}" 
                               style="display: inline-block; background-color: #dc3545; color: #ffffff; text-decoration: none; padding: 8px 16px; border-radius: 4px; font-size: 12px; font-family: Arial, sans-serif; font-weight: bold; margin-bottom: 10px;">
                              Unsubscribe from Emails
                            </a>
                            <p style="margin: 10px 0 0 0; font-size: 11px; color: #999999; font-family: Arial, sans-serif;">
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
              <table width="900" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.15); max-width: 900px;"
                <!-- Header with Trizen Logo -->
                <tr>
                <td style="padding: 0; text-align: center; background: #ffffff; -webkit-user-select: none; -moz-user-select: none; user-select: none;">
                <div style="padding: 40px; max-width: 600px; margin: 0 auto;">
                <img src="https://drive.google.com/thumbnail?id=1WSn_2v5WJAuMOOrLU1Lsalw4zizdO3VR&sz=w500" 
                alt="TRIZEN" 
                style="height: auto; width: 100%; max-width: 450px; display: block; margin: 0 auto;"
                onerror="this.src='https://lh3.googleusercontent.com/d/1WSn_2v5WJAuMOOrLU1Lsalw4zizdO3VR'; this.onerror=null;">
                </div>
                </td>
                </tr>
                
                <!-- Registration Banner -->
                <tr>
                  <td style="background-color: #2563eb; padding: 20px; text-align: center;">
                    <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: bold; font-family: Arial, sans-serif;">Registration Confirmed!</h1>
                    <p style="margin: 10px 0 0 0; color: #ffffff; font-size: 16px; font-family: Arial, sans-serif;">You're all set for ${data.eventTitle}</p>
                  </td>
                </tr>
                
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
                          <span style="color: #2563eb; font-family: Arial, sans-serif; margin-left: 10px; font-weight: bold;">${data.ticketNumber || 'TRIZEN-' + Date.now().toString().slice(-8)}</span>
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
                    <div style="background-color: #ffffff; border: 2px solid #2563eb; border-radius: 8px; padding: 20px; text-align: center;">
                      <h3 style="margin: 0 0 10px 0; color: #2563eb; font-size: 18px; font-family: Arial, sans-serif;">Your Event Ticket</h3>
                      <div style="background-color: #2563eb; color: #ffffff; padding: 15px; border-radius: 6px; margin: 10px 0;">
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
                
                <!-- Footer -->
                <tr>
                  <td style="background-color: #f8f9fa; padding: 35px; text-align: center; border-top: 1px solid #e9ecef; border-radius: 0 0 12px 12px;">
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
                          <p style="margin: 0 0 10px 0; font-size: 12px; color: #999999; font-family: Arial, sans-serif;">© 2025 Trizen Ventures. All rights reserved.</p>
                          <p style="margin: 0; font-size: 11px; color: #999999; font-family: Arial, sans-serif;">
                            <a href="${process.env.BACKEND_URL || 'http://localhost:5000'}/unsubscribe/${data.subscriptionToken || ''}" style="color: #999999; text-decoration: underline;">Unsubscribe from emails</a>
                          </p>
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
              <table width="900" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.15); max-width: 900px;"
                <!-- Header with Trizen Logo -->
                <tr>
                  <td style="padding: 60px 40px; text-align: center; border-radius: 12px 12px 0 0; background: linear-gradient(135deg, #2E1F5C 0%, #1a0f3a 100%); -webkit-user-select: none; -moz-user-select: none; user-select: none; min-height: 200px; position: relative;">
                    <!-- Trizen Logo Container -->
                    <div style="display: inline-block; background-color: rgba(255, 255, 255, 0.95); padding: 20px 30px; border-radius: 8px; box-shadow: 0 4px 15px rgba(0,0,0,0.2);">
                      <img src="https://drive.google.com/uc?export=view&id=1WSn_2v5WJAuMOOrLU1Lsalw4zizdO3VR" 
                           alt="TRIZEN" 
                           style="height: 60px; width: auto; max-width: 300px; display: block; margin: 0 auto;"
                           onerror="this.style.display='none'; this.nextElementSibling.style.display='block';">
                      <!-- Fallback text if image fails -->
                      <div style="display: none; color: #2E1F5C; font-size: 32px; font-weight: bold; font-family: Arial, sans-serif; letter-spacing: 2px;">TRIZEN</div>
                    </div>
                    <!-- Tagline -->
                    <div style="margin-top: 20px; color: #ffffff; font-size: 16px; font-family: Arial, sans-serif; font-weight: 300; opacity: 0.9;">
                      Innovation Community
                    </div>
                  </td>
                </tr>
                
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
                
                <!-- Footer -->
                <tr>
                  <td style="background-color: #f8f9fa; padding: 35px; text-align: center; border-top: 1px solid #e9ecef; border-radius: 0 0 12px 12px;">
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
                          <p style="margin: 0 0 10px 0; font-size: 12px; color: #999999; font-family: Arial, sans-serif;">© 2025 Trizen Ventures. All rights reserved.</p>
                          <p style="margin: 0; font-size: 11px; color: #999999; font-family: Arial, sans-serif;">
                            <a href="${process.env.BACKEND_URL || 'http://localhost:5000'}/unsubscribe/${data.subscriptionToken || ''}" style="color: #999999; text-decoration: underline;">Unsubscribe from emails</a>
                          </p>
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
              <table width="900" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.15); max-width: 900px;"
                <!-- Header with Trizen Logo -->
                <tr>
                  <td style="padding: 60px 40px; text-align: center; border-radius: 12px 12px 0 0; background: linear-gradient(135deg, #2E1F5C 0%, #1a0f3a 100%); -webkit-user-select: none; -moz-user-select: none; user-select: none; min-height: 200px; position: relative;">
                    <!-- Trizen Logo Container -->
                    <div style="display: inline-block; background-color: rgba(255, 255, 255, 0.95); padding: 20px 30px; border-radius: 8px; box-shadow: 0 4px 15px rgba(0,0,0,0.2);">
                      <img src="https://drive.google.com/uc?export=view&id=1WSn_2v5WJAuMOOrLU1Lsalw4zizdO3VR" 
                           alt="TRIZEN" 
                           style="height: 60px; width: auto; max-width: 300px; display: block; margin: 0 auto;"
                           onerror="this.style.display='none'; this.nextElementSibling.style.display='block';">
                      <!-- Fallback text if image fails -->
                      <div style="display: none; color: #2E1F5C; font-size: 32px; font-weight: bold; font-family: Arial, sans-serif; letter-spacing: 2px;">TRIZEN</div>
                    </div>
                    <!-- Tagline -->
                    <div style="margin-top: 20px; color: #ffffff; font-size: 16px; font-family: Arial, sans-serif; font-weight: 300; opacity: 0.9;">
                      Innovation Community
                    </div>
                  </td>
                </tr>
                
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
                
                <!-- Footer -->
                <tr>
                  <td style="background-color: #f8f9fa; padding: 35px; text-align: center; border-top: 1px solid #e9ecef; border-radius: 0 0 12px 12px;">
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
                          <p style="margin: 0 0 10px 0; font-size: 12px; color: #999999; font-family: Arial, sans-serif;">© 2025 Trizen Ventures. All rights reserved.</p>
                          <p style="margin: 0; font-size: 11px; color: #999999; font-family: Arial, sans-serif;">
                            <a href="${process.env.BACKEND_URL || 'http://localhost:5000'}/unsubscribe/${data.subscriptionToken || ''}" style="color: #999999; text-decoration: underline;">Unsubscribe from emails</a>
                          </p>
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
        <title>Speaker Application Received</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f8fafc;">
          <tr>
            <td align="center" style="padding: 40px 20px;">
              <table width="900" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.15); max-width: 900px;"
                <!-- Header with Trizen Logo -->
                <tr>
                  <td style="padding: 60px 40px; text-align: center; border-radius: 12px 12px 0 0; background: linear-gradient(135deg, #2E1F5C 0%, #1a0f3a 100%); -webkit-user-select: none; -moz-user-select: none; user-select: none; min-height: 200px; position: relative;">
                    <!-- Trizen Logo Container -->
                    <div style="display: inline-block; background-color: rgba(255, 255, 255, 0.95); padding: 20px 30px; border-radius: 8px; box-shadow: 0 4px 15px rgba(0,0,0,0.2);">
                      <img src="https://drive.google.com/uc?export=view&id=1WSn_2v5WJAuMOOrLU1Lsalw4zizdO3VR" 
                           alt="TRIZEN" 
                           style="height: 60px; width: auto; max-width: 300px; display: block; margin: 0 auto;"
                           onerror="this.style.display='none'; this.nextElementSibling.style.display='block';">
                      <!-- Fallback text if image fails -->
                      <div style="display: none; color: #2E1F5C; font-size: 32px; font-weight: bold; font-family: Arial, sans-serif; letter-spacing: 2px;">TRIZEN</div>
                    </div>
                    <!-- Tagline -->
                    <div style="margin-top: 20px; color: #ffffff; font-size: 16px; font-family: Arial, sans-serif; font-weight: 300; opacity: 0.9;">
                      Innovation Community
                    </div>
                  </td>
                </tr>
                
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
            
            <!-- Footer -->
                <tr>
                  <td style="background-color: #f8f9fa; padding: 35px; text-align: center; border-top: 1px solid #e9ecef; border-radius: 0 0 12px 12px;">
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
                          <p style="margin: 0 0 10px 0; font-size: 12px; color: #999999; font-family: Arial, sans-serif;">© 2025 Trizen Ventures. All rights reserved.</p>
                          <p style="margin: 0; font-size: 11px; color: #999999; font-family: Arial, sans-serif;">
                            <a href="${process.env.BACKEND_URL || 'http://localhost:5000'}/unsubscribe/${data.subscriptionToken || ''}" style="color: #999999; text-decoration: underline;">Unsubscribe from emails</a>
                          </p>
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
              <table width="900" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.15); max-width: 900px;"
                <!-- Header with Trizen Logo -->
                <tr>
                  <td style="padding: 60px 40px; text-align: center; border-radius: 12px 12px 0 0; background: linear-gradient(135deg, #2E1F5C 0%, #1a0f3a 100%); -webkit-user-select: none; -moz-user-select: none; user-select: none; min-height: 200px; position: relative;">
                    <!-- Trizen Logo Container -->
                    <div style="display: inline-block; background-color: rgba(255, 255, 255, 0.95); padding: 20px 30px; border-radius: 8px; box-shadow: 0 4px 15px rgba(0,0,0,0.2);">
                      <img src="https://drive.google.com/uc?export=view&id=1WSn_2v5WJAuMOOrLU1Lsalw4zizdO3VR" 
                           alt="TRIZEN" 
                           style="height: 60px; width: auto; max-width: 300px; display: block; margin: 0 auto;"
                           onerror="this.style.display='none'; this.nextElementSibling.style.display='block';">
                      <!-- Fallback text if image fails -->
                      <div style="display: none; color: #2E1F5C; font-size: 32px; font-weight: bold; font-family: Arial, sans-serif; letter-spacing: 2px;">TRIZEN</div>
                    </div>
                    <!-- Tagline -->
                    <div style="margin-top: 20px; color: #ffffff; font-size: 16px; font-family: Arial, sans-serif; font-weight: 300; opacity: 0.9;">
                      Innovation Community
                    </div>
                  </td>
                </tr>
                
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
                
                <!-- Footer -->
                <tr>
                  <td style="background-color: #f8f9fa; padding: 35px; text-align: center; border-top: 1px solid #e9ecef; border-radius: 0 0 12px 12px;">
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
                          <p style="margin: 0 0 10px 0; font-size: 12px; color: #999999; font-family: Arial, sans-serif;">© 2025 Trizen Ventures. All rights reserved.</p>
                          <p style="margin: 0; font-size: 11px; color: #999999; font-family: Arial, sans-serif;">
                            <a href="${process.env.BACKEND_URL || 'http://localhost:5000'}/unsubscribe/${data.subscriptionToken || ''}" style="color: #999999; text-decoration: underline;">Unsubscribe from emails</a>
                          </p>
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