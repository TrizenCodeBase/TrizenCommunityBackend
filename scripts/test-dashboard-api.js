// Test the dashboard API endpoint directly
// Using built-in fetch (Node.js 18+)

async function testDashboardAPI() {
    try {
        console.log('🧪 Testing Dashboard API endpoint...');

        // Test if server is running by trying auth endpoint
        console.log('🔍 Testing server connectivity...');
        try {
            const testResponse = await fetch('https://trizencommunitybackend.llp.trizenventures.com/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: 'test', password: 'test' })
            });
            console.log('Server is responding, status:', testResponse.status);
        } catch (error) {
            console.log('❌ Server not responding:', error.message);
            return;
        }

        // Test login first
        console.log('\n🔐 Testing login...');
        const loginResponse = await fetch('https://trizencommunitybackend.llp.trizenventures.com/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: 'shivasaiganeeb9@gmail.com',
                password: 'password123'
            })
        });

        const loginData = await loginResponse.json();
        console.log('Login response status:', loginResponse.status);
        console.log('Login response:', loginData);

        if (!loginData.success) {
            console.log('❌ Login failed');
            return;
        }

        const token = loginData.data.token;
        const userId = loginData.data.user._id;

        console.log(`\n👤 User ID: ${userId}`);
        console.log(`🔑 Token: ${token.substring(0, 20)}...`);

        // Test the registrations endpoint
        console.log('\n📋 Testing registrations endpoint...');
        const registrationsResponse = await fetch(`https://trizencommunitybackend.llp.trizenventures.com/api/users/${userId}/registrations`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            }
        });

        console.log('Registrations response status:', registrationsResponse.status);

        if (!registrationsResponse.ok) {
            const errorText = await registrationsResponse.text();
            console.log('❌ Registrations endpoint failed:', errorText);
            return;
        }

        const registrationsData = await registrationsResponse.json();
        console.log('✅ Registrations response:', JSON.stringify(registrationsData, null, 2));

    } catch (error) {
        console.error('❌ Error:', error);
    }
}

testDashboardAPI();
