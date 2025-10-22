// Verify that the email template is updated
const { templates } = require('../utils/email');

console.log('🔍 Checking eventRegistration template...');

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
    const emailContent = templates.eventRegistration(testData);

    console.log('✅ Template loaded successfully');
    console.log('📧 Subject:', emailContent.subject);

    // Check if the template contains the new Trizen logo
    if (emailContent.html.includes('TRIZEN')) {
        console.log('✅ Template contains TRIZEN logo');
    } else {
        console.log('❌ Template does NOT contain TRIZEN logo');
    }

    // Check if the template contains LinkedIn link
    if (emailContent.html.includes('linkedin.com/company/trizenventuresllp')) {
        console.log('✅ Template contains LinkedIn link');
    } else {
        console.log('❌ Template does NOT contain LinkedIn link');
    }

    // Check if the template contains support email
    if (emailContent.html.includes('support@trizenventures.com')) {
        console.log('✅ Template contains support email');
    } else {
        console.log('❌ Template does NOT contain support email');
    }

    console.log('\n📋 Template verification complete!');

} catch (error) {
    console.error('❌ Error loading template:', error.message);
}

