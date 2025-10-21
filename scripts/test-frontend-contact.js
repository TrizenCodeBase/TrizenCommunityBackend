// Test script to simulate frontend contact form submission

async function testFrontendContactForm() {
    // Simulate the exact data structure that the frontend sends
    const frontendFormData = {
        name: '',
        email: '',
        company: '',
        inquiryType: '',
        subject: '',
        message: ''
    };

    console.log('🧪 Testing with empty form data (frontend default):');
    console.log('Data:', frontendFormData);

    try {
        const response = await fetch('http://localhost:5000/api/contact', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(frontendFormData),
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

    // Test with valid data
    console.log('\n🧪 Testing with valid form data:');
    const validFormData = {
        name: 'John Doe',
        email: 'john@example.com',
        company: 'Test Company',
        inquiryType: 'general',
        subject: 'Test Subject',
        message: 'This is a test message with more than 10 characters.'
    };

    try {
        const response = await fetch('http://localhost:5000/api/contact', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(validFormData),
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

testFrontendContactForm();
