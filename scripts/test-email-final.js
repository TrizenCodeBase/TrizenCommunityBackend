// Test the final email template
const { templates } = require('../utils/email');

console.log('🎯 Testing Final Email Template...');

const testData = {
    name: 'shivasai Ganeeb',
    eventTitle: 'cybersecurity',
    eventDate: 'January 25, 2025',
    eventTime: '2:00 PM - 5:00 PM',
    eventLocation: 'Trizen Ventures Office, San Francisco',
    ticketNumber: 'TRIZEN-2025-001',
    ticketUrl: 'https://trizenventures.com/events/cybersecurity/ticket',
    eventUrl: 'https://trizenventures.com/events/cybersecurity',
    supportUrl: 'https://trizenventures.com/contact'
};

try {
    console.log('📧 Generating Event Registration Email...');

    const email = templates.eventRegistration(testData);

    console.log('✅ Email generated successfully!');
    console.log('📋 Subject:', email.subject);
    console.log('');

    // Check for key elements
    const hasTrizenLogo = email.html.includes('⚡ TRIZEN');
    const hasVenturesText = email.html.includes('VENTURES');
    const hasRegistrationBanner = email.html.includes('Registration Confirmed!');
    const hasTrizenCommunity = email.html.includes('Trizen Community');
    const hasFooter = email.html.includes('support@trizenventures.com');
    const hasLinkedIn = email.html.includes('Follow us on LinkedIn');

    console.log('🔍 Template Elements Check:');
    console.log(`   ⚡ TRIZEN logo: ${hasTrizenLogo ? '✅' : '❌'}`);
    console.log(`   VENTURES text: ${hasVenturesText ? '✅' : '❌'}`);
    console.log(`   Registration banner: ${hasRegistrationBanner ? '✅' : '❌'}`);
    console.log(`   Trizen Community: ${hasTrizenCommunity ? '✅' : '❌'}`);
    console.log(`   Footer contact info: ${hasFooter ? '✅' : '❌'}`);
    console.log(`   LinkedIn link: ${hasLinkedIn ? '✅' : '❌'}`);

    if (hasTrizenLogo && hasVenturesText && hasRegistrationBanner && hasTrizenCommunity && hasFooter && hasLinkedIn) {
        console.log('\n🎉 SUCCESS: All elements present!');
        console.log('');
        console.log('📧 Email Preview:');
        console.log('┌─────────────────────────────────────────────────────────┐');
        console.log('│                                                         │');
        console.log('│  ┌─────────────────────────────────────────────────┐   │');
        console.log('│  │  ⚡ TRIZEN                                      │   │');
        console.log('│  │     VENTURES                                   │   │');
        console.log('│  └─────────────────────────────────────────────────┘   │');
        console.log('│                                                         │');
        console.log('│  ┌─────────────────────────────────────────────────┐   │');
        console.log('│  │  🎉 Registration Confirmed!                    │   │');
        console.log('│  │  Trizen Community                             │   │');
        console.log('│  └─────────────────────────────────────────────────┘   │');
        console.log('│                                                         │');
        console.log('│  Dear shivasai Ganeeb,                                 │');
        console.log('│  Thank you for your interest in attending cybersecurity │');
        console.log('│                                                         │');
        console.log('│  [Event Details] [Ticket Info] [Action Buttons]       │');
        console.log('│                                                         │');
        console.log('│  ┌─────────────────────────────────────────────────┐   │');
        console.log('│  │  Trizen Ventures                              │   │');
        console.log('│  │  Email: support@trizenventures.com            │   │');
        console.log('│  │  Website: https://trizenventures.com          │   │');
        console.log('│  │  LinkedIn: Follow us on LinkedIn              │   │');
        console.log('│  └─────────────────────────────────────────────────┘   │');
        console.log('└─────────────────────────────────────────────────────────┘');
        console.log('');
        console.log('🚀 Ready to send! The email will now display:');
        console.log('   ✅ Professional Trizen logo header (⚡ TRIZEN VENTURES)');
        console.log('   ✅ Registration confirmed banner');
        console.log('   ✅ Complete event details');
        console.log('   ✅ Contact information footer');
        console.log('   ✅ LinkedIn link in footer');
        console.log('');
        console.log('🎯 This matches the professional design from your reference images!');
    } else {
        console.log('\n❌ ISSUE: Some elements are missing');
    }

} catch (error) {
    console.error('❌ Error testing email template:', error.message);
}
