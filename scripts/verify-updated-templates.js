// Verify that all email templates are updated with image placeholders
const { templates } = require('../utils/email');

console.log('🔍 Checking all email templates for image placeholders...');

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
    requiresApproval: false,
    subject: 'Test Contact Form',
    inquiryType: 'general',
    supportEmail: 'support@trizenventures.com'
};

try {
    console.log('\n📧 Testing Event Registration Template:');
    const eventEmail = templates.eventRegistration(testData);
    console.log('✅ Event registration template loaded');

    if (eventEmail.html.includes('your-trizen-logo.png')) {
        console.log('✅ Contains Trizen logo placeholder');
    } else {
        console.log('❌ Missing Trizen logo placeholder');
    }

    if (eventEmail.html.includes('your-contact-info.png')) {
        console.log('✅ Contains contact info placeholder');
    } else {
        console.log('❌ Missing contact info placeholder');
    }

    console.log('\n📧 Testing Contact Form Template:');
    const contactEmail = templates.contactForm(testData);
    console.log('✅ Contact form template loaded');

    if (contactEmail.html.includes('your-trizen-logo.png')) {
        console.log('✅ Contains Trizen logo placeholder');
    } else {
        console.log('❌ Missing Trizen logo placeholder');
    }

    if (contactEmail.html.includes('your-contact-info.png')) {
        console.log('✅ Contains contact info placeholder');
    } else {
        console.log('❌ Missing contact info placeholder');
    }

    console.log('\n📧 Testing Contact Confirmation Template:');
    const confirmationEmail = templates.contactConfirmation(testData);
    console.log('✅ Contact confirmation template loaded');

    if (confirmationEmail.html.includes('your-trizen-logo.png')) {
        console.log('✅ Contains Trizen logo placeholder');
    } else {
        console.log('❌ Missing Trizen logo placeholder');
    }

    if (confirmationEmail.html.includes('your-contact-info.png')) {
        console.log('✅ Contains contact info placeholder');
    } else {
        console.log('❌ Missing contact info placeholder');
    }

    console.log('\n🎯 All templates are ready for your actual images!');
    console.log('\n📝 Next steps:');
    console.log('1. Upload your Trizen logo to imgur.com');
    console.log('2. Upload your contact info image to imgur.com');
    console.log('3. Replace "your-trizen-logo.png" with your actual logo URL');
    console.log('4. Replace "your-contact-info.png" with your actual contact image URL');

} catch (error) {
    console.error('❌ Error loading templates:', error.message);
}


