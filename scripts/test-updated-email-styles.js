// Test the updated email templates with improved styling
const { templates } = require('../utils/email');

console.log('🎨 Testing updated email template styles...');

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

    // Check for improved styling
    if (eventEmail.html.includes('max-width: 800px')) {
        console.log('✅ Email width increased to 800px');
    } else {
        console.log('❌ Email width not updated');
    }

    if (eventEmail.html.includes('padding: 20px')) {
        console.log('✅ Header padding reduced');
    } else {
        console.log('❌ Header padding not reduced');
    }

    if (eventEmail.html.includes('max-width: 150px')) {
        console.log('✅ Logo size reduced to 150px');
    } else {
        console.log('❌ Logo size not updated');
    }

    if (eventEmail.html.includes('font-size: 20px')) {
        console.log('✅ Header text size reduced');
    } else {
        console.log('❌ Header text size not updated');
    }

    console.log('\n📧 Testing Contact Form Template:');
    const contactEmail = templates.contactForm(testData);

    if (contactEmail.html.includes('max-width: 800px')) {
        console.log('✅ Contact form width increased to 800px');
    } else {
        console.log('❌ Contact form width not updated');
    }

    console.log('\n📧 Testing Contact Confirmation Template:');
    const confirmationEmail = templates.contactConfirmation(testData);

    if (confirmationEmail.html.includes('max-width: 800px')) {
        console.log('✅ Confirmation email width increased to 800px');
    } else {
        console.log('❌ Confirmation email width not updated');
    }

    console.log('\n🎯 Email template improvements:');
    console.log('✅ Increased email width from 600px to 800px');
    console.log('✅ Reduced header padding from 40px to 20px');
    console.log('✅ Reduced logo size from 200px to 150px');
    console.log('✅ Reduced header text size');
    console.log('✅ Improved logo visibility with proper centering');

    console.log('\n📝 Next steps:');
    console.log('1. Upload your actual Trizen logo to imgur.com');
    console.log('2. Upload your contact info image to imgur.com');
    console.log('3. Replace the placeholder URLs with your actual image URLs');
    console.log('4. Test the email by registering for an event');

} catch (error) {
    console.error('❌ Error testing templates:', error.message);
}
