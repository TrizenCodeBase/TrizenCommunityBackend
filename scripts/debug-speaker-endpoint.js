// Debug speaker application endpoint
async function testSpeakerEndpoint() {
    try {
        console.log('🔍 Testing speaker endpoint with detailed debugging...');

        const testData = {
            name: 'Debug Test',
            email: 'debug.test@example.com',
            organization: 'Debug Corp',
            position: 'Developer',
            expertise: ['Technology'],
            topics: ['Debugging'],
            bio: 'This is a test bio that is more than 50 characters long to meet the validation requirements.',
            phone: '1234567890',
            linkedin: 'https://linkedin.com/in/debugtest',
            website: 'https://debugtest.com',
            previousSpeakingExperience: '2 years',
            availability: 'Flexible',
            specialRequirements: 'None'
        };

        console.log('📧 Sending request to: http://localhost:5000/api/speakers/apply');
        console.log('📋 Data being sent:', JSON.stringify(testData, null, 2));

        const response = await fetch('http://localhost:5000/api/speakers/apply', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(testData)
        });

        console.log('📊 Response status:', response.status);
        console.log('📊 Response headers:', Object.fromEntries(response.headers.entries()));

        const responseText = await response.text();
        console.log('📊 Raw response:', responseText);

        try {
            const result = JSON.parse(responseText);
            console.log('📊 Parsed response:', JSON.stringify(result, null, 2));

            if (response.ok) {
                console.log('✅ Speaker application successful!');
            } else {
                console.log('❌ Speaker application failed:', result.message);
                if (result.errors) {
                    console.log('🔍 Validation errors:');
                    result.errors.forEach(error => {
                        console.log(`   - ${error.msg} (field: ${error.path})`);
                    });
                }
            }
        } catch (parseError) {
            console.log('❌ Failed to parse response as JSON:', parseError.message);
            console.log('📊 Raw response was:', responseText);
        }

    } catch (error) {
        console.log('❌ Network error:', error.message);
        console.log('💡 Make sure the server is running on port 5000');
    }
}

testSpeakerEndpoint();

