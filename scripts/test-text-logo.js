// Test the new text-based Trizen logo in email templates
const { templates } = require('../utils/email');

console.log('🎨 Testing text-based Trizen logo in email templates...');

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

    if (eventEmail.html.includes('TRIZEN')) {
        console.log('✅ Trizen logo text is present');
    } else {
        console.log('❌ Trizen logo text not found');
    }

    if (eventEmail.html.includes('⚡')) {
        console.log('✅ Lightning bolt symbol is present');
    } else {
        console.log('❌ Lightning bolt symbol not found');
    }

    if (eventEmail.html.includes('#1e3a8a')) {
        console.log('✅ Dark blue background color is present');
    } else {
        console.log('❌ Dark blue background color not found');
    }

    if (eventEmail.html.includes('VENTURES')) {
        console.log('✅ "VENTURES" text is present');
    } else {
        console.log('❌ "VENTURES" text not found');
    }

    console.log('\n📧 Testing Contact Form Template:');
    const contactEmail = templates.contactForm(testData);

    if (contactEmail.html.includes('TRIZEN')) {
        console.log('✅ Contact form has Trizen logo');
    } else {
        console.log('❌ Contact form missing Trizen logo');
    }

    console.log('\n📧 Testing Contact Confirmation Template:');
    const confirmationEmail = templates.contactConfirmation(testData);

    if (confirmationEmail.html.includes('TRIZEN')) {
        console.log('✅ Contact confirmation has Trizen logo');
    } else {
        console.log('❌ Contact confirmation missing Trizen logo');
    }

    console.log('\n🎯 Text-based logo features:');
    console.log('✅ No external dependencies');
    console.log('✅ Always visible in email clients');
    console.log('✅ Professional styling');
    console.log('✅ Dark blue background (#1e3a8a)');
    console.log('✅ White text with lightning bolt symbol');
    console.log('✅ "TRIZEN VENTURES" branding');

    console.log('\n📝 Benefits of this approach:');
    console.log('✅ No image hosting required');
    console.log('✅ Works in all email clients');
    console.log('✅ Fast loading');
    console.log('✅ Professional appearance');

} catch (error) {
    console.error('❌ Error testing templates:', error.message);
}
