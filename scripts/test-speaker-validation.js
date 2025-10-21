// Test speaker application with proper validation

async function testSpeakerApplication() {
    try {
        console.log('🔍 Testing speaker application with validation...');

        const testData = {
            name: 'John Doe',
            email: 'test.speaker@example.com',
            organization: 'Tech Corp',
            position: 'Senior Developer',
            expertise: ['Technology', 'AI/ML'],
            topics: ['Machine Learning', 'Data Science'],
            bio: 'I am an experienced software developer with over 10 years of experience in building scalable applications and leading technical teams. I have spoken at various conferences and have a passion for sharing knowledge with the community.',
            phone: '1234567890',
            linkedin: 'https://linkedin.com/in/johndoe',
            website: 'https://johndoe.com',
            previousSpeakingExperience: '5 years',
            availability: 'Flexible',
            specialRequirements: 'None'
        };

        console.log('📧 Sending test data:', {
            name: testData.name,
            email: testData.email,
            organization: testData.organization,
            expertise: testData.expertise,
            bioLength: testData.bio.length
        });

        const response = await fetch('http://localhost:5000/api/speakers/apply', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(testData)
        });

        const result = await response.json();

        if (response.ok) {
            console.log('✅ Speaker application successful!');
            console.log('📧 Response:', result);
        } else {
            console.log('❌ Validation failed:', result);
            if (result.errors) {
                console.log('🔍 Validation errors:');
                result.errors.forEach(error => {
                    console.log(`   - ${error.msg} (field: ${error.path})`);
                });
            }
        }

    } catch (error) {
        console.log('❌ Connection failed:', error.message);
        console.log('💡 Make sure the server is running on port 5000');
    }
}

testSpeakerApplication();
