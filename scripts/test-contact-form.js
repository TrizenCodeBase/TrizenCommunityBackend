// Using built-in fetch (Node.js 18+)

// Test contact form submission
async function testContactForm() {
    const testData = {
        name: 'Test User',
        email: 'test@example.com',
        company: 'Test Company',
        inquiryType: 'general',
        subject: 'Test Contact Form Submission',
        message: 'This is a test message to verify the contact form functionality.'
    };

    try {
        console.log('🧪 Testing contact form submission...');
        console.log('📤 Sending test data:', testData);

        const response = await fetch('https://trizencommunitybackend.llp.trizenventures.com/api/contact', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(testData),
        });

        const result = await response.json();

        console.log('📊 Response status:', response.status);
        console.log('📋 Response data:', JSON.stringify(result, null, 2));

        if (result.success) {
            console.log('✅ Contact form test PASSED');
            console.log('📧 Email should have been sent to support team');
            console.log('📧 Confirmation email should have been sent to user');
        } else {
            console.log('❌ Contact form test FAILED');
            console.log('❌ Error:', result.message);
        }

    } catch (error) {
        console.error('❌ Test failed with error:', error.message);
        console.log('💡 Make sure the backend server is running on port 5000');
    }
}

// Run the test
testContactForm();
