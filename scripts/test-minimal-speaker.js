// Test with minimal required data only
async function testMinimalSpeaker() {
    try {
        console.log('🔍 Testing with minimal required data...');

        const minimalData = {
            name: 'Test User',
            email: 'minimal.test@example.com',
            organization: 'Test Organization',
            expertise: ['Technology'],
            bio: 'This is a test bio that is more than 50 characters long to meet the validation requirements for the speaker application.'
        };

        console.log('📧 Sending minimal data:', JSON.stringify(minimalData, null, 2));

        const response = await fetch('http://localhost:5000/api/speakers/apply', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(minimalData)
        });

        console.log('📊 Response status:', response.status);
        const result = await response.text();
        console.log('📊 Raw response:', result);

        try {
            const parsedResult = JSON.parse(result);
            console.log('📊 Parsed response:', JSON.stringify(parsedResult, null, 2));

            if (response.ok) {
                console.log('✅ Minimal data works!');
            } else {
                console.log('❌ Minimal data failed:', parsedResult.message);
            }
        } catch (parseError) {
            console.log('❌ Failed to parse response:', parseError.message);
        }

    } catch (error) {
        console.log('❌ Network error:', error.message);
    }
}

testMinimalSpeaker();

