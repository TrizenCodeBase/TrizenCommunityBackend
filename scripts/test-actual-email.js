// Test sending an actual email to verify logo visibility
const { sendEmail } = require('../utils/email');

console.log('📧 Testing Actual Email with Logo...');

const testData = {
    name: 'Test User',
    eventTitle: 'Robotics Workshop',
    eventDate: 'January 25, 2025',
    eventTime: '2:00 PM - 5:00 PM',
    eventLocation: 'Trizen Ventures Office, San Francisco',
    eventType: 'Workshop',
    eventCategory: 'Technology',
    ticketNumber: 'TRIZEN-2025-001',
    ticketUrl: 'https://trizenventures.com/events/robotics-workshop/ticket',
    eventUrl: 'https://trizenventures.com/events/robotics-workshop',
    supportUrl: 'https://trizenventures.com/contact',
    websiteUrl: 'https://trizenventures.com',
    requiresApproval: false
};

async function testEmail() {
    try {
        console.log('📤 Sending test email...');

        const result = await sendEmail({
            email: 'shivasaiganeeb9@gmail.com', // Your email for testing
            template: 'eventRegistration',
            data: testData
        });

        console.log('✅ Email sent successfully!');
        console.log('📧 Check your inbox for the email with the Trizen logo');
        console.log('🎯 The email should show:');
        console.log('   ┌─────────────────────────────────┐');
        console.log('   │  ⚡ TRIZEN                      │');
        console.log('   │     VENTURES                   │');
        console.log('   │  Innovation • Technology •     │');
        console.log('   │  Community                     │');
        console.log('   └─────────────────────────────────┘');
        console.log('   Followed by "🎉 Registration Confirmed!"');

    } catch (error) {
        console.error('❌ Error sending email:', error.message);
        console.log('💡 Make sure your email configuration is set up correctly');
    }
}

// Only run if email configuration is available
if (process.env.EMAIL_HOST && process.env.EMAIL_USER && process.env.EMAIL_PASS) {
    testEmail();
} else {
    console.log('⚠️  Email configuration not found. Skipping actual email test.');
    console.log('💡 To test actual emails, make sure EMAIL_HOST, EMAIL_USER, and EMAIL_PASS are set in your environment variables.');
}
