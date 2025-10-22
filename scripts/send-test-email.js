// Send a test email with the new template
const { sendEmail } = require('../utils/email');

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

async function sendTestEmail() {
    try {
        console.log('📧 Sending test email with new template...');

        const result = await sendEmail({
            email: 'shivasaiganeeb9@gmail.com',
            template: 'eventRegistration',
            data: testData
        });

        console.log('✅ Email sent successfully!');
        console.log('📧 Check your inbox - you should now see:');
        console.log('   • ⚡ TRIZEN VENTURES header');
        console.log('   • 🎉 Registration Confirmed! banner');
        console.log('   • Contact information footer');
        console.log('   • LinkedIn link');

    } catch (error) {
        console.error('❌ Error sending email:', error.message);
        console.log('💡 Make sure your email configuration is set up correctly');
    }
}

sendTestEmail();


