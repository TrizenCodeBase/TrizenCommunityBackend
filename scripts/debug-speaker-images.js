const mongoose = require('mongoose');
require('dotenv').config();

const Event = require('../models/Event');

async function debugSpeakerImages() {
    try {
        console.log('🔗 Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // Find events with speakers
        const eventsWithSpeakers = await Event.find({
            speakers: { $exists: true, $not: { $size: 0 } }
        }).select('title speakers');

        console.log('\n📋 Events with speakers:');
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
                    console.log(`     - Image type: ${speaker.image.substring(0, 20)}...`);
                }
                if (speaker.avatar) {
                    console.log(`     - Avatar type: ${speaker.avatar.substring(0, 20)}...`);
                }
                if (speaker.profilePicture) {
                    console.log(`     - Profile Picture type: ${speaker.profilePicture.substring(0, 20)}...`);
                }

                console.log(`     - Bio: ${speaker.bio ? speaker.bio.substring(0, 50) + '...' : 'None'}`);
                if (speaker.socialLinks) {
                    console.log(`     - LinkedIn: ${speaker.socialLinks.linkedin || 'None'}`);
                    console.log(`     - Twitter: ${speaker.socialLinks.twitter || 'None'}`);
                    console.log(`     - Website: ${speaker.socialLinks.website || 'None'}`);
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

debugSpeakerImages();

