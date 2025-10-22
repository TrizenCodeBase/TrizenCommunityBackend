// Test event registration email template
const { sendEmail } = require('../utils/email');

async function testEventRegistrationEmail() {
    const testData = {
        name: 'Test User',
        eventTitle: 'AI Development Workshop',
        eventDate: 'January 25, 2025',
        eventTime: '2:00 PM - 5:00 PM',
        eventLocation: 'Trizen Ventures Office, San Francisco',
        eventType: 'Workshop',
        eventCategory: 'Technology',
        ticketNumber: 'TRIZEN-2025-001',
        ticketUrl: 'https://trizenventures.com/events/ai-workshop/ticket',
        eventUrl: 'https://trizenventures.com/events/ai-workshop',
        supportUrl: 'https://trizenventures.com/contact',
        websiteUrl: 'https://trizenventures.com',
        requiresApproval: false
    };

    try {
        console.log('🧪 Testing event registration email template...');
        console.log('📤 Sending test email with data:', testData);

        await sendEmail({
            email: 'test@example.com',
            template: 'eventRegistration',
            data: testData
        });

        console.log('✅ Event registration email test PASSED');
        console.log('📧 Email should have been sent with new Trizen branding');

    } catch (error) {
        console.error('❌ Test failed with error:', error.message);
        console.log('💡 Make sure email configuration is set up in .env file');
    }
}

// Run the test
testEventRegistrationEmail();


