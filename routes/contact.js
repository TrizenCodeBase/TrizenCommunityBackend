const express = require('express');
const { body, validationResult } = require('express-validator');
const { sendEmail } = require('../utils/email');

const router = express.Router();

// @desc    Send contact form message
// @route   POST /api/contact
// @access  Public
router.post('/', [
    body('name').trim().isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters'),
    body('email').isEmail().withMessage('Please provide a valid email address'),
    body('company').optional().trim().isLength({ max: 100 }).withMessage('Company name cannot exceed 100 characters'),
    body('inquiryType').isIn(['general', 'partnership', 'support', 'sales', 'media', 'career']).withMessage('Invalid inquiry type'),
    body('subject').trim().isLength({ min: 5, max: 200 }).withMessage('Subject must be between 5 and 200 characters'),
    body('message').trim().isLength({ min: 10, max: 2000 }).withMessage('Message must be between 10 and 2000 characters')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: errors.array()
            });
        }

        const { name, email, company, inquiryType, subject, message } = req.body;

        // Check if email configuration is available
        if (!process.env.EMAIL_HOST || !process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
            console.log('⚠️ Email configuration not available, storing contact form data locally');

            // In development, just log the contact form data
            console.log('📧 Contact Form Submission:', {
                name,
                email,
                company,
                inquiryType,
                subject,
                message,
                timestamp: new Date().toISOString()
            });

            return res.status(200).json({
                success: true,
                message: 'Thank you for your message! We will get back to you soon.',
                data: {
                    submitted: true,
                    timestamp: new Date().toISOString()
                }
            });
        }

        // Send email to support team
        try {
            await sendEmail({
                email: process.env.EMAIL_USER, // Send to support email
                subject: `New Contact Form Submission: ${subject}`,
                template: 'contactForm',
                data: {
                    name,
                    email,
                    company: company || 'Not provided',
                    inquiryType,
                    subject,
                    message,
                    timestamp: new Date().toLocaleString(),
                    userAgent: req.get('User-Agent') || 'Unknown',
                    ipAddress: req.ip || req.connection.remoteAddress || 'Unknown'
                }
            });

            console.log('✅ Contact form email sent successfully to support team');

            // Send confirmation email to user
            try {
                await sendEmail({
                    email: email,
                    subject: 'Thank you for contacting Trizen Ventures',
                    template: 'contactConfirmation',
                    data: {
                        name,
                        inquiryType,
                        subject,
                        supportEmail: process.env.EMAIL_USER,
                        websiteUrl: process.env.FRONTEND_URL || 'https://trizenventures.com'
                    }
                });

                console.log('✅ Confirmation email sent successfully to user:', email);
            } catch (confirmationError) {
                console.error('❌ Failed to send confirmation email:', confirmationError.message);
                // Don't fail the main request if confirmation email fails
            }

            res.status(200).json({
                success: true,
                message: 'Thank you for your message! We have received your inquiry and will get back to you within 24 hours.',
                data: {
                    submitted: true,
                    timestamp: new Date().toISOString(),
                    confirmationSent: true
                }
            });

        } catch (emailError) {
            console.error('❌ Failed to send contact form email:', emailError.message);

            // Still return success to user, but log the error
            res.status(200).json({
                success: true,
                message: 'Thank you for your message! We have received your inquiry and will get back to you within 24 hours.',
                data: {
                    submitted: true,
                    timestamp: new Date().toISOString(),
                    emailSent: false,
                    note: 'Message received but email delivery may be delayed'
                }
            });
        }

    } catch (error) {
        console.error('Contact form submission error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while processing your message. Please try again later.'
        });
    }
});

module.exports = router;

