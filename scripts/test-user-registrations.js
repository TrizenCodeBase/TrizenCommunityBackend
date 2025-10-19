const mongoose = require('mongoose');
const EventRegistration = require('../models/EventRegistration');
const Event = require('../models/Event');
const User = require('../models/User');
require('dotenv').config();

const connectDB = async () => {
    try {
        const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://localhost:27017/trizen_community';
        console.log('Connecting to MongoDB...');
        await mongoose.connect(mongoUri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Connected to MongoDB');
    } catch (err) {
        console.error('MongoDB connection error:', err);
        process.exit(1);
    }
};

const testUserRegistrations = async () => {
    await connectDB();

    console.log('\nTesting user registrations API...');

    try {
        // Find the admin user
        const adminUser = await User.findOne({ email: 'shivasaiganeeb9@gmail.com' });
        if (!adminUser) {
            console.log('❌ Admin user not found');
            return;
        }

        console.log(`\n👤 Found user: ${adminUser.name} (${adminUser.email}) - ID: ${adminUser._id}`);

        // Test the getUserRegistrations method directly
        console.log('\n🔍 Testing getUserRegistrations method...');
        const registrations = await EventRegistration.getUserRegistrations(adminUser._id);
        console.log(`📊 Found ${registrations.length} registrations using getUserRegistrations`);

        registrations.forEach((reg, index) => {
            console.log(`\n📋 Registration ${index + 1}:`);
            console.log(`   - Event ID: ${reg.event?._id}`);
            console.log(`   - Event Title: ${reg.event?.title}`);
            console.log(`   - Status: ${reg.status}`);
            console.log(`   - Ticket: ${reg.ticketNumber}`);
        });

        // Test the API response format
        console.log('\n🌐 Testing API response format...');
        const apiResponse = {
            success: true,
            data: { registrations }
        };
        console.log('📡 API Response structure:', JSON.stringify(apiResponse, null, 2));

        // Check if events are properly populated
        console.log('\n🎯 Checking event population...');
        const populatedRegistrations = await EventRegistration.find({ user: adminUser._id })
            .populate({
                path: 'event',
                populate: {
                    path: 'organizer',
                    select: 'name avatar'
                }
            })
            .sort({ registeredAt: -1 });

        console.log(`📊 Found ${populatedRegistrations.length} populated registrations`);
        populatedRegistrations.forEach((reg, index) => {
            console.log(`\n📋 Populated Registration ${index + 1}:`);
            console.log(`   - Event: ${reg.event?.title || 'NO EVENT'}`);
            console.log(`   - Organizer: ${reg.event?.organizer?.name || 'NO ORGANIZER'}`);
            console.log(`   - Status: ${reg.status}`);
        });

    } catch (error) {
        console.error('❌ Error testing user registrations:', error);
    }

    console.log('\n✅ Test completed');
    mongoose.disconnect();
};

testUserRegistrations();
