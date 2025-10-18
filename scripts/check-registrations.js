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

const checkRegistrations = async () => {
    await connectDB();

    console.log('\nChecking registrations...');

    try {
        // Get all users
        const users = await User.find({}).select('_id name email');
        console.log(`\nFound ${users.length} users:`);
        users.forEach(user => {
            console.log(`- ${user.name} (${user.email}) - ID: ${user._id}`);
        });

        // Get all registrations
        const registrations = await EventRegistration.find({}).populate('event', 'title').populate('user', 'name email');
        console.log(`\nFound ${registrations.length} registrations:`);

        if (registrations.length === 0) {
            console.log('No registrations found in database');
        } else {
            registrations.forEach(reg => {
                console.log(`- User: ${reg.user?.name} (${reg.user?.email}) registered for: ${reg.event?.title}`);
            });
        }

        // Check for a specific user's registrations
        if (users.length > 0) {
            const firstUser = users[0];
            console.log(`\nChecking registrations for user: ${firstUser.name} (${firstUser._id})`);

            const userRegistrations = await EventRegistration.getUserRegistrations(firstUser._id);
            console.log(`User has ${userRegistrations.length} registrations`);

            userRegistrations.forEach(reg => {
                console.log(`- Event: ${reg.event?.title} (Status: ${reg.status})`);
            });
        }

    } catch (error) {
        console.error('Error checking registrations:', error);
    }

    console.log('\n✅ Registration check completed');
    mongoose.disconnect();
};

checkRegistrations();
