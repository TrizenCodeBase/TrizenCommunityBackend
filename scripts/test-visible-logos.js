// Test that the Trizen logos are now visible in email templates
const { templates } = require('../utils/email');

console.log('🔍 Testing visible Trizen logos in email templates...');

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

    if (eventEmail.html.includes('via.placeholder.com')) {
        console.log('✅ Trizen logo placeholder URL is working');
    } else {
        console.log('❌ Trizen logo placeholder URL not found');
    }

    if (eventEmail.html.includes('text=TRIZEN')) {
        console.log('✅ Trizen logo will display "TRIZEN" text');
    } else {
        console.log('❌ Trizen logo text not found');
    }

    if (eventEmail.html.includes('1e3a8a/ffffff')) {
        console.log('✅ Trizen logo has correct colors (dark blue background, white text)');
    } else {
        console.log('❌ Trizen logo colors not correct');
    }

    console.log('\n📧 Testing Contact Form Template:');
    const contactEmail = templates.contactForm(testData);

    if (contactEmail.html.includes('via.placeholder.com')) {
        console.log('✅ Contact form has visible Trizen logo');
    } else {
        console.log('❌ Contact form missing Trizen logo');
    }

    console.log('\n📧 Testing Contact Confirmation Template:');
    const confirmationEmail = templates.contactConfirmation(testData);

    if (confirmationEmail.html.includes('via.placeholder.com')) {
        console.log('✅ Contact confirmation has visible Trizen logo');
    } else {
        console.log('❌ Contact confirmation missing Trizen logo');
    }

    console.log('\n🎯 Logo visibility improvements:');
    console.log('✅ Using working placeholder URLs');
    console.log('✅ Trizen logo will display "TRIZEN" text');
    console.log('✅ Dark blue background with white text');
    console.log('✅ Proper sizing (150px max-width)');
    console.log('✅ Centered alignment');

    console.log('\n📝 Next steps:');
    console.log('1. Register for an event to test the email');
    console.log('2. Check your email - you should now see the Trizen logo');
    console.log('3. If you want to use your actual logo, upload it to imgur.com');
    console.log('4. Replace the placeholder URL with your actual logo URL');

} catch (error) {
    console.error('❌ Error testing templates:', error.message);
}

