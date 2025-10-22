// Test email templates to verify logo visibility
const { templates } = require('../utils/email');

console.log('🔍 Testing Email Template Logo Visibility...');

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
    requiresApproval: false
};

try {
    console.log('\n📧 Testing Event Registration Email:');
    const eventEmail = templates.eventRegistration(testData);

    // Check if the logo elements are present
    const hasTrizenText = eventEmail.html.includes('TRIZEN');
    const hasLightningBolt = eventEmail.html.includes('⚡');
    const hasVenturesText = eventEmail.html.includes('VENTURES');
    const hasBlueBackground = eventEmail.html.includes('#1e3a8a');

    console.log('✅ Logo Elements Check:');
    console.log(`   TRIZEN text: ${hasTrizenText ? '✅' : '❌'}`);
    console.log(`   Lightning bolt: ${hasLightningBolt ? '✅' : '❌'}`);
    console.log(`   VENTURES text: ${hasVenturesText ? '✅' : '❌'}`);
    console.log(`   Blue background: ${hasBlueBackground ? '✅' : '❌'}`);

    if (hasTrizenText && hasLightningBolt && hasVenturesText && hasBlueBackground) {
        console.log('\n🎉 SUCCESS: Trizen logo is present in event registration email!');
    } else {
        console.log('\n❌ ISSUE: Some logo elements are missing');
    }

    // Show the logo HTML structure
    console.log('\n📋 Logo HTML Structure:');
    const logoMatch = eventEmail.html.match(/<div style="background: #1e3a8a[^>]*>[\s\S]*?<\/div>/);
    if (logoMatch) {
        console.log(logoMatch[0]);
    }

    console.log('\n🎯 What should be visible in emails:');
    console.log('   ┌─────────────────────────┐');
    console.log('   │  ⚡ TRIZEN              │');
    console.log('   │     VENTURES           │');
    console.log('   └─────────────────────────┘');
    console.log('   (Dark blue background, white text)');

} catch (error) {
    console.error('❌ Error testing email templates:', error.message);
}


