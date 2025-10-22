const mongoose = require('mongoose');
require('dotenv').config();

const User = require('../models/User');

async function checkUserPassword() {
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
        console.log(`🆔 User ID: ${user._id}`);
        console.log(`🔐 Has password: ${!!user.password}`);
        console.log(`📧 Email verified: ${user.isEmailVerified}`);
        console.log(`👑 Is admin: ${user.isAdmin}`);

        // Test password
        console.log('\n🧪 Testing password "password123"...');
        const isValid = await user.comparePassword('password123');
        console.log(`✅ Password "password123" is valid: ${isValid}`);

        if (!isValid) {
            console.log('\n🧪 Testing password "123456"...');
            const isValid2 = await user.comparePassword('123456');
            console.log(`✅ Password "123456" is valid: ${isValid2}`);
        }

    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await mongoose.disconnect();
        console.log('\n🔌 Disconnected from MongoDB');
    }
}

checkUserPassword();


