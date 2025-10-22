const mongoose = require('mongoose');
require('dotenv').config();

const Event = require('../models/Event');

async function quickCheck() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        const events = await Event.find({ speakers: { $exists: true, $not: { $size: 0 } } });
        console.log(`📋 Found ${events.length} events with speakers`);

        events.forEach((event, i) => {
            console.log(`\n${i + 1}. ${event.title}`);
            event.speakers.forEach((speaker, j) => {
                console.log(`   Speaker ${j + 1}: ${speaker.name}`);
                console.log(`     - Image: ${speaker.image ? 'Present (' + speaker.image.length + ' chars)' : 'Missing'}`);
                console.log(`     - Avatar: ${speaker.avatar ? 'Present' : 'Missing'}`);
                console.log(`     - ProfilePicture: ${speaker.profilePicture ? 'Present' : 'Missing'}`);
            });
        });

    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await mongoose.disconnect();
    }
}

quickCheck();

