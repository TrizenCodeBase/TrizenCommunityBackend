// Test with the exact data format the frontend sends
async function testFrontendData() {
    try {
        console.log('🔍 Testing with frontend data format...');

        // This is the exact format the frontend sends
        const frontendData = {
            name: 'Test User',
            email: 'testuser@example.com',
            phone: '',
            organization: 'Test Organization',
            position: '',
            expertise: ['Technology'],
            topics: [],
            bio: 'This is a test bio that is more than 50 characters long to meet the validation requirements for the speaker application.',
            shortDescription: '',
            profilePicture: '',
            portfolio: '',
            linkedin: '',
            twitter: '',
            website: '',
            previousSpeakingExperience: '',
            availability: '',
            specialRequirements: '',
            eventId: ''
        };

        console.log('📧 Sending frontend data format:', JSON.stringify(frontendData, null, 2));

        const response = await fetch('https://trizencommunitybackend.llp.trizenventures.com/api/speakers/apply', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(frontendData)
        });

        console.log('📊 Response status:', response.status);
        const result = await response.text();
        console.log('📊 Raw response:', result);

        try {
            const parsedResult = JSON.parse(result);
            console.log('📊 Parsed response:', JSON.stringify(parsedResult, null, 2));

            if (response.ok) {
                console.log('✅ Frontend data format works!');
            } else {
                console.log('❌ Frontend data format failed:', parsedResult.message);
                if (parsedResult.errors) {
                    console.log('🔍 Validation errors:');
                    parsedResult.errors.forEach(error => {
                        console.log(`   - ${error.msg} (field: ${error.path})`);
                    });
                }
            }
        } catch (parseError) {
            console.log('❌ Failed to parse response:', parseError.message);
        }

    } catch (error) {
        console.log('❌ Network error:', error.message);
    }
}

testFrontendData();


