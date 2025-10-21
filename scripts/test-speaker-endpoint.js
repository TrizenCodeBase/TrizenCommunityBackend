// Test the speaker application endpoint
const fetch = require('node-fetch');

async function testSpeakerEndpoint() {
    try {
        console.log('🔍 Testing speaker application endpoint...');

        const response = await fetch('http://localhost:5000/api/speakers/apply', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: 'Test Speaker',
                email: 'test@example.com',
                phone: '1234567890',
                organization: 'Test Org',
                position: 'Developer',
                expertise: ['Technology'],
                topics: ['AI/ML'],
                bio: 'Test bio',
                linkedin: 'https://linkedin.com/test',
                website: 'https://test.com',
                speakingExperience: '5 years',
                availability: 'Flexible',
                requirements: 'None'
            })
        });

        if (response.ok) {
            const result = await response.json();
            console.log('✅ Speaker endpoint is working!');
            console.log('📧 Response:', result);
        } else {
            console.log('❌ Server responded with error:', response.status);
            const error = await response.text();
            console.log('Error details:', error);
        }

    } catch (error) {
        console.log('❌ Connection failed:', error.message);
        console.log('💡 Make sure the server is running on port 5000');
    }
}

testSpeakerEndpoint();
