const mongoose = require('mongoose');
require('dotenv').config();

const User = require('../models/User');

async function setUserPassword() {
    try {
        console.log('🔗 Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // Find the specific user
        const user = await User.findOne({ email: 'shivasaiganeeb9@gmail.com' });
        if (!user) {
            console.log('❌ User not found');
            return;
        }

        console.log(`👤 Found user: ${user.name} (${user.email})`);

        // Set password
        console.log('🔐 Setting password to "password123"...');
        user.password = 'password123';
        await user.save();

        console.log('✅ Password set successfully');

        // Test the password
        console.log('🧪 Testing new password...');
        const isValid = await user.comparePassword('password123');
        console.log(`✅ Password test result: ${isValid}`);

    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await mongoose.disconnect();
        console.log('\n🔌 Disconnected from MongoDB');
    }
}

setUserPassword();
