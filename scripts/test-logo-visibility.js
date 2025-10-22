// Test if the Trizen logo is visible in email templates
const { templates } = require('../utils/email');

console.log('🔍 Testing Trizen logo visibility in email templates...');

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
        console.log('\n🎉 SUCCESS: Trizen logo is fully visible in event registration email!');
        console.log('   The logo will show: ⚡ TRIZEN');
        console.log('   With subtitle: VENTURES');
        console.log('   On dark blue background');
    } else {
        console.log('\n❌ ISSUE: Some logo elements are missing');
    }

    // Show a preview of the logo HTML
    console.log('\n📋 Logo HTML Preview:');
    const logoMatch = eventEmail.html.match(/<div style="background: #1e3a8a[^>]*>[\s\S]*?<\/div>/);
    if (logoMatch) {
        console.log(logoMatch[0].substring(0, 200) + '...');
    }

    console.log('\n🎯 What you should see in emails:');
    console.log('   ┌─────────────────────────┐');
    console.log('   │  ⚡ TRIZEN              │');
    console.log('   │     VENTURES           │');
    console.log('   └─────────────────────────┘');
    console.log('   (Dark blue background, white text)');

} catch (error) {
    console.error('❌ Error testing logo visibility:', error.message);
}

