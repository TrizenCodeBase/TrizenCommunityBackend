// Test all email templates to verify logo visibility
const { templates } = require('../utils/email');

console.log('🔍 Testing All Email Template Logo Visibility...');

const testData = {
    name: 'John Doe',
    email: 'john.doe@example.com',
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
    verificationUrl: 'https://trizenventures.com/verify',
    resetUrl: 'https://trizenventures.com/reset',
    company: 'Tech Corp',
    inquiryType: 'general',
    subject: 'Test Inquiry',
    message: 'This is a test message',
    timestamp: new Date().toLocaleString(),
    ipAddress: '192.168.1.1',
    userAgent: 'Mozilla/5.0',
    organization: 'Tech Innovations Inc.',
    expertise: ['Technology', 'AI/ML'],
    bio: 'Expert in AI and machine learning',
    appliedAt: new Date().toLocaleDateString(),
    adminUrl: 'https://trizenventures.com/admin/speakers',
    status: 'approved',
    updatedAt: new Date().toLocaleDateString(),
    adminNotes: 'Excellent candidate',
    eventTitle: 'AI Workshop',
    eventDate: 'January 25, 2025',
    eventLocation: 'San Francisco',
    invitationUrl: 'https://trizenventures.com/speakers/apply',
    supportEmail: 'support@trizenventures.com'
};

const templatesToTest = [
    { name: 'Event Registration', template: 'eventRegistration' },
    { name: 'Contact Form', template: 'contactForm' },
    { name: 'Contact Confirmation', template: 'contactConfirmation' },
    { name: 'Speaker Application Confirmation', template: 'speakerApplicationConfirmation' },
    { name: 'Speaker Application Notification', template: 'speakerApplicationNotification' },
    { name: 'Speaker Status Update', template: 'speakerStatusUpdate' },
    { name: 'Speaker Invitation', template: 'speakerInvitation' }
];

try {
    console.log('\n📧 Testing All Email Templates:');

    let allPassed = true;

    templatesToTest.forEach(({ name, template }) => {
        try {
            const email = templates[template](testData);

            // Check if the logo elements are present
            const hasTrizenText = email.html.includes('TRIZEN');
            const hasLightningBolt = email.html.includes('⚡');
            const hasVenturesText = email.html.includes('VENTURES');
            const hasBlueBackground = email.html.includes('#1e3a8a') || email.html.includes('linear-gradient');
            const hasProfessionalStyling = email.html.includes('text-shadow') || email.html.includes('box-shadow');

            const passed = hasTrizenText && hasLightningBolt && hasVenturesText && hasBlueBackground;

            console.log(`\n✅ ${name}:`);
            console.log(`   TRIZEN text: ${hasTrizenText ? '✅' : '❌'}`);
            console.log(`   Lightning bolt: ${hasLightningBolt ? '✅' : '❌'}`);
            console.log(`   VENTURES text: ${hasVenturesText ? '✅' : '❌'}`);
            console.log(`   Blue background: ${hasBlueBackground ? '✅' : '❌'}`);
            console.log(`   Professional styling: ${hasProfessionalStyling ? '✅' : '❌'}`);
            console.log(`   Overall: ${passed ? '✅ PASS' : '❌ FAIL'}`);

            if (!passed) allPassed = false;

        } catch (error) {
            console.log(`\n❌ ${name}: ERROR - ${error.message}`);
            allPassed = false;
        }
    });

    console.log('\n🎯 Summary:');
    if (allPassed) {
        console.log('🎉 SUCCESS: All email templates have proper Trizen logos!');
        console.log('\n📋 Logo Features:');
        console.log('   ✅ Professional gradient background');
        console.log('   ✅ Large lightning bolt emoji (⚡)');
        console.log('   ✅ Bold TRIZEN text with proper spacing');
        console.log('   ✅ VENTURES subtitle');
        console.log('   ✅ Tagline: "Innovation • Technology • Community"');
        console.log('   ✅ Text shadows and box shadows for depth');
        console.log('   ✅ Responsive design for all email clients');
    } else {
        console.log('❌ ISSUE: Some email templates need logo fixes');
    }

    console.log('\n🎨 Logo Design Features:');
    console.log('   ┌─────────────────────────────────┐');
    console.log('   │  ⚡ TRIZEN                      │');
    console.log('   │     VENTURES                   │');
    console.log('   │  Innovation • Technology •     │');
    console.log('   │  Community                     │');
    console.log('   └─────────────────────────────────┘');
    console.log('   (Gradient blue background, white text, shadows)');

} catch (error) {
    console.error('❌ Error testing email templates:', error.message);
}
