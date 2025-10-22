const mongoose = require('mongoose');
require('dotenv').config();

const Event = require('../models/Event');

async function checkDatabaseSpeakers() {
    try {
        console.log('🔗 Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // Find all events
        const allEvents = await Event.find({}).select('title speakers');
        console.log(`\n📋 Total events in database: ${allEvents.length}`);

        // Find events with speakers
        const eventsWithSpeakers = await Event.find({
            speakers: { $exists: true, $not: { $size: 0 } }
        }).select('title speakers');

        console.log(`📋 Events with speakers: ${eventsWithSpeakers.length}`);

        eventsWithSpeakers.forEach((event, index) => {
            console.log(`\n${index + 1}. ${event.title}`);
            console.log(`   Speakers: ${event.speakers.length}`);

            event.speakers.forEach((speaker, speakerIndex) => {
                console.log(`   Speaker ${speakerIndex + 1}:`);
                console.log(`     - Name: ${speaker.name}`);
                console.log(`     - Title: ${speaker.title}`);
                console.log(`     - Company: ${speaker.company}`);
                console.log(`     - Avatar: ${speaker.avatar ? 'Present' : 'Missing'}`);
                console.log(`     - Image: ${speaker.image ? 'Present' : 'Missing'}`);
                console.log(`     - Profile Picture: ${speaker.profilePicture ? 'Present' : 'Missing'}`);

                if (speaker.image) {
                    console.log(`     - Image type: ${speaker.image.substring(0, 30)}...`);
                    console.log(`     - Image length: ${speaker.image.length}`);
                }
                if (speaker.avatar) {
                    console.log(`     - Avatar type: ${speaker.avatar.substring(0, 30)}...`);
                    console.log(`     - Avatar length: ${speaker.avatar.length}`);
                }
                if (speaker.profilePicture) {
                    console.log(`     - Profile Picture type: ${speaker.profilePicture.substring(0, 30)}...`);
                    console.log(`     - Profile Picture length: ${speaker.profilePicture.length}`);
                }
            });
        });

        if (eventsWithSpeakers.length === 0) {
            console.log('\n❌ No events with speakers found');
        }

    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await mongoose.disconnect();
        console.log('\n🔌 Disconnected from MongoDB');
    }
}

checkDatabaseSpeakers();

