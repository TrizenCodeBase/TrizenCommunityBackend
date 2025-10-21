const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

const adminEmails = [
    'shivasaiganeeb9@gmail.com',
    'support@trizenventures.com'
];

async function setupAdmins() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/trizen-community');
        console.log('Connected to MongoDB');

        // Update admin status for specified emails
        for (const email of adminEmails) {
            const user = await User.findOne({ email: email.toLowerCase() });

            if (user) {
                if (!user.isAdmin) {
                    user.isAdmin = true;
                    await user.save();
                    console.log(`✅ Updated ${email} to admin status`);
                } else {
                    console.log(`ℹ️  ${email} is already an admin`);
                }
            } else {
                console.log(`⚠️  User with email ${email} not found. They need to register first.`);
            }
        }

        // List all current admins
        const admins = await User.find({ isAdmin: true }, 'name email isAdmin');
        console.log('\n📋 Current Admins:');
        admins.forEach(admin => {
            console.log(`- ${admin.name} (${admin.email})`);
        });

        console.log('\n✅ Admin setup completed');
    } catch (error) {
        console.error('❌ Error setting up admins:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    }
}

// Run the script
setupAdmins();

