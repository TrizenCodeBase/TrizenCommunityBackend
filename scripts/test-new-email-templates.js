// Test script to verify the new email templates
require('dotenv').config();
const { sendEmail } = require('../utils/email');

async function testNewEmailTemplates() {
    console.log('🧪 Testing new email templates...');
    console.log('📧 Email settings:');
    console.log('   - EMAIL_HOST:', process.env.EMAIL_HOST || 'Not set');
    console.log('   - EMAIL_USER:', process.env.EMAIL_USER || 'Not set');
    console.log('   - EMAIL_FROM:', process.env.EMAIL_FROM || 'Not set');
    console.log('   - EMAIL_PASS:', process.env.EMAIL_PASS ? 'Set (hidden)' : 'Not set');
    console.log('');

    if (!process.env.EMAIL_HOST || !process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.log('❌ Email configuration incomplete!');
        console.log('Please update your .env file with correct email credentials.');
        return;
    }

    try {
        console.log('📤 Sending test contact form email...');

        await sendEmail({
            email: process.env.EMAIL_USER, // Send to support email
            subject: 'Test New Email Template - Contact Form',
            template: 'contactForm',
            data: {
                name: 'Test User',
                email: 'test@example.com',
                company: 'Test Company',
                inquiryType: 'general',
                subject: 'Testing New Email Template',
                message: 'This is a test to verify the new email template with Trizen logo header and contact info footer.',
                timestamp: new Date().toLocaleString(),
                userAgent: 'Test Script',
                ipAddress: '127.0.0.1'
            }
        });

        console.log('✅ Test contact form email sent successfully!');
        console.log('📧 Check your inbox at:', process.env.EMAIL_USER);
        console.log('');
        console.log('🔍 The email should now have:');
        console.log('   - TRIZEN logo header (white text on dark blue background)');
        console.log('   - Professional contact info footer');
        console.log('   - Trizen Ventures branding');

    } catch (error) {
        console.error('❌ Failed to send test email:', error.message);
        console.log('');
        console.log('🔧 Troubleshooting:');
        console.log('1. Make sure you have updated the EMAIL_PASS in .env file');
        console.log('2. Verify the email address and password are correct');
        console.log('3. Check that the server is running with the new templates');
    }
}

testNewEmailTemplates();

