// Test email configuration
require('dotenv').config();
const { sendEmail } = require('../utils/email');

async function testEmailConfiguration() {
    console.log('🧪 Testing email configuration...');
    console.log('📧 Email settings:');
    console.log('   - EMAIL_HOST:', process.env.EMAIL_HOST || 'Not set');
    console.log('   - EMAIL_USER:', process.env.EMAIL_USER || 'Not set');
    console.log('   - EMAIL_FROM:', process.env.EMAIL_FROM || 'Not set');
    console.log('   - EMAIL_PASS:', process.env.EMAIL_PASS ? 'Set (hidden)' : 'Not set');
    console.log('');

    if (!process.env.EMAIL_HOST || !process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.log('❌ Email configuration incomplete!');
        console.log('Please set up the following in your .env file:');
        console.log('   - EMAIL_HOST=smtp.gmail.com');
        console.log('   - EMAIL_USER=support@trizenventures.com');
        console.log('   - EMAIL_PASS=your_gmail_app_password');
        console.log('   - EMAIL_FROM=support@trizenventures.com');
        return;
    }

    try {
        console.log('📤 Sending test email...');

        await sendEmail({
            email: process.env.EMAIL_USER, // Send to support email
            subject: 'Test Email from Trizen Community Backend',
            template: 'contactForm',
            data: {
                name: 'Test User',
                email: 'test@example.com',
                company: 'Test Company',
                inquiryType: 'general',
                subject: 'Test Email',
                message: 'This is a test email to verify email configuration.',
                timestamp: new Date().toLocaleString(),
                userAgent: 'Test Script',
                ipAddress: '127.0.0.1'
            }
        });

        console.log('✅ Test email sent successfully!');
        console.log('📧 Check your inbox at:', process.env.EMAIL_USER);

    } catch (error) {
        console.error('❌ Failed to send test email:', error.message);
        console.log('');
        console.log('🔧 Troubleshooting:');
        console.log('1. Make sure you have a valid Gmail App Password');
        console.log('2. Check that 2-Step Verification is enabled on your Google account');
        console.log('3. Verify the email address and password in .env file');
    }
}

testEmailConfiguration();

