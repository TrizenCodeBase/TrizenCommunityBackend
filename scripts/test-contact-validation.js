// Using built-in fetch (Node.js 18+)

async function testContactForm() {
    const testData = {
        name: 'John Doe',
        email: 'john@example.com',
        company: 'Test Company',
        inquiryType: 'general',
        subject: 'Test Subject',
        message: 'This is a test message with more than 10 characters.'
    };

    try {
        console.log('🧪 Testing contact form with data:', testData);

        const response = await fetch('http://localhost:5000/api/contact', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(testData),
        });

        console.log('📊 Response status:', response.status);

        const result = await response.json();
        console.log('📊 Full response:', JSON.stringify(result, null, 2));

        if (result.success) {
            console.log('✅ Contact form test successful!');
        } else {
            console.log('❌ Contact form test failed:', result.message);
            if (result.errors) {
                console.log('🔍 Validation errors:', result.errors);
            }
        }
    } catch (error) {
        console.error('❌ Test error:', error);
    }
}

testContactForm();
