// Quick test to check if server is running
async function quickTest() {
    try {
        console.log('🔍 Testing server connection...');

        const response = await fetch('http://localhost:5000/api/speakers/apply', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: 'Test User',
                email: 'test@example.com',
                organization: 'Test Org',
                expertise: ['Technology'],
                bio: 'This is a test bio that is more than 50 characters long to meet the validation requirements.'
            })
        });

        console.log('✅ Server is responding! Status:', response.status);
        const result = await response.text();
        console.log('📧 Response:', result);

    } catch (error) {
        console.log('❌ Server not responding:', error.message);
        console.log('💡 Make sure to run: node server.js');
    }
}

quickTest();
