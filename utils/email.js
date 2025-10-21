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
              <table width="800" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                <!-- Header with Trizen Logo -->
                <tr>
                  <td style="background-color: #1e3a8a; padding: 30px; text-align: center;">
                    <table width="100%" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td align="center" style="color: #ffffff; font-size: 32px; font-weight: bold; font-family: Arial, sans-serif; letter-spacing: 2px;">
                          TRIZEN
                        </td>
                      </tr>
                    </table>
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
                  <td style="padding: 30px;">
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
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f5f5f5;">
          <tr>
            <td align="center" style="padding: 20px;">
              <table width="800" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                <!-- Header with Trizen Logo -->
                <tr>
                  <td style="background-color: #1e3a8a; padding: 30px; text-align: center;">
                    <table width="100%" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td align="center" style="color: #ffffff; font-size: 32px; font-weight: bold; font-family: Arial, sans-serif; letter-spacing: 2px;">
                          TRIZEN
                        </td>
                      </tr>
                    </table>
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
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f5f5f5;">
          <tr>
            <td align="center" style="padding: 20px;">
              <table width="800" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                <!-- Header with Trizen Logo -->
                <tr>
                  <td style="background-color: #1e3a8a; padding: 30px; text-align: center;">
                    <table width="100%" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td align="center" style="color: #ffffff; font-size: 32px; font-weight: bold; font-family: Arial, sans-serif; letter-spacing: 2px;">
                          TRIZEN
                        </td>
                      </tr>
                    </table>
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
        <title>Speaker Application Received</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f5f5f5;">
          <tr>
            <td align="center" style="padding: 20px;">
              <table width="800" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                <!-- Header with Trizen Logo -->
                <tr>
                  <td style="background-color: #1e3a8a; padding: 30px; text-align: center;">
                    <table width="100%" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td align="center" style="color: #ffffff; font-size: 32px; font-weight: bold; font-family: Arial, sans-serif; letter-spacing: 2px;">
                          TRIZEN
                        </td>
                      </tr>
                    </table>
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
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f5f5f5;">
          <tr>
            <td align="center" style="padding: 20px;">
              <table width="800" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                <!-- Header with Trizen Logo -->
                <tr>
                  <td style="background-color: #1e3a8a; padding: 30px; text-align: center;">
                    <table width="100%" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td align="center" style="color: #ffffff; font-size: 32px; font-weight: bold; font-family: Arial, sans-serif; letter-spacing: 2px;">
                          TRIZEN
                        </td>
                      </tr>
                    </table>
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
  })
};

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

module.exports = { sendEmail };