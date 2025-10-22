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

const cleanupRegistrations = async () => {
    await connectDB();

    console.log('\nCleaning up registrations...');

    try {
        // Get all current events
        const events = await Event.find({});
        console.log(`\nFound ${events.length} current events:`);
        events.forEach(event => {
            console.log(`- ${event.title} (ID: ${event._id})`);
        });

        // Get all registrations
        const allRegistrations = await EventRegistration.find({});
        console.log(`\nFound ${allRegistrations.length} total registrations`);

        // Find registrations with invalid event references
        const validEventIds = events.map(event => event._id.toString());
        const invalidRegistrations = allRegistrations.filter(reg =>
            !validEventIds.includes(reg.event.toString())
        );

        console.log(`\nFound ${invalidRegistrations.length} registrations with invalid event references`);

        if (invalidRegistrations.length > 0) {
            console.log('Deleting invalid registrations...');
            await EventRegistration.deleteMany({
                _id: { $in: invalidRegistrations.map(reg => reg._id) }
            });
            console.log(`Deleted ${invalidRegistrations.length} invalid registrations`);
        }

        // Create a test registration for the admin user
        const adminUser = await User.findOne({ email: 'shivasaiganeeb9@gmail.com' });
        if (adminUser && events.length > 0) {
            const firstEvent = events[0];

            // Check if user already has a registration for this event
            const existingRegistration = await EventRegistration.findOne({
                user: adminUser._id,
                event: firstEvent._id
            });

            if (!existingRegistration) {
                console.log(`\nCreating test registration for ${adminUser.name} for event: ${firstEvent.title}`);

                const testRegistration = new EventRegistration({
                    user: adminUser._id,
                    event: firstEvent._id,
                    registrationData: new Map([
                        ['firstName', adminUser.name.split(' ')[0] || 'Test'],
                        ['lastName', adminUser.name.split(' ')[1] || 'User'],
                        ['email', adminUser.email],
                        ['phoneNumber', '+1234567890']
                    ]),
                    ticketNumber: `TRZ-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
                    status: 'approved'
                });

                await testRegistration.save();
                console.log('Test registration created successfully');
            } else {
                console.log(`\nUser ${adminUser.name} already has a registration for ${firstEvent.title}`);
            }
        }

        // Show final registration count
        const finalRegistrations = await EventRegistration.find({}).populate('event', 'title').populate('user', 'name email');
        console.log(`\nFinal registration count: ${finalRegistrations.length}`);
        finalRegistrations.forEach(reg => {
            console.log(`- ${reg.user?.name} registered for: ${reg.event?.title} (Status: ${reg.status})`);
        });

    } catch (error) {
        console.error('Error during cleanup:', error);
    }

    console.log('\n✅ Cleanup completed');
    mongoose.disconnect();
};

cleanupRegistrations();


