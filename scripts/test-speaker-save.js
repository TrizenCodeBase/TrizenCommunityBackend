const mongoose = require('mongoose');
require('dotenv').config();

const Event = require('../models/Event');

async function testSpeakerSave() {
    try {
        console.log('🔗 Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // Create a test event with speaker image
        const testEvent = new Event({
            title: 'Test Event with Speaker Image',
            description: 'Test description',
            category: 'Workshop',
            type: 'Online',
            startDate: new Date(),
            endDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
            maxAttendees: 100,
            price: 0,
            speakers: [{
                name: 'Test Speaker',
                title: 'Test Title',
                company: 'Test Company',
                bio: 'Test bio',
                image: 'data:image/jpeg;base64,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',
                socialLinks: {
                    linkedin: '',
                    twitter: '',
                    website: ''
                }
            }]
        });

        console.log('🔍 Test event created with speakers:', testEvent.speakers);
        console.log('🔍 First speaker image length:', testEvent.speakers[0].image.length);

        await testEvent.save();
        console.log('💾 Test event saved successfully');

        // Reload from database
        const savedEvent = await Event.findById(testEvent._id);
        console.log('💾 Event reloaded from database with speakers:', savedEvent.speakers);
        console.log('💾 First speaker image from database:', savedEvent.speakers[0].image);
        console.log('💾 First speaker image length from database:', savedEvent.speakers[0].image?.length);

        // Clean up
        await Event.findByIdAndDelete(testEvent._id);
        console.log('🧹 Test event deleted');

    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await mongoose.disconnect();
        console.log('\n🔌 Disconnected from MongoDB');
    }
}

testSpeakerSave();

