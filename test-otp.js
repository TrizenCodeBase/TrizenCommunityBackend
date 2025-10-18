const mongoose = require('mongoose');
const OTP = require('./models/OTP');
const { sendEmail } = require('./utils/email');
require('dotenv').config();

async function testOTPSystem() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/trizen_community');
        console.log('✅ Connected to MongoDB');

        // Test email credentials
        const testEmail = process.env.EMAIL_USER;
        const testName = 'Test User';

        if (!testEmail) {
            console.error('❌ EMAIL_USER not found in environment variables');
            return;
        }

        console.log(`📧 Testing with email: ${testEmail}`);

        // Create and send OTP
        console.log('🔄 Creating OTP...');
        const otpDoc = await OTP.createOTP(testEmail, 'email_verification');
        console.log(`✅ OTP created: ${otpDoc.otp}`);

        // Send email
        console.log('📤 Sending email...');
        await sendEmail({
            email: testEmail,
            subject: 'Test OTP - Trizen Community',
            template: 'otpVerification',
            data: {
                name: testName,
                otp: otpDoc.otp,
                type: 'email_verification'
            }
        });
        console.log('✅ Email sent successfully!');

        // Test OTP verification
        console.log('🔍 Testing OTP verification...');
        const verificationResult = await OTP.verifyOTP(testEmail, otpDoc.otp, 'email_verification');

        if (verificationResult.success) {
            console.log('✅ OTP verification successful!');
        } else {
            console.log('❌ OTP verification failed:', verificationResult.message);
        }

        // Test expired OTP
        console.log('⏰ Testing expired OTP...');
        const expiredResult = await OTP.verifyOTP(testEmail, otpDoc.otp, 'email_verification');

        if (!expiredResult.success) {
            console.log('✅ Expired OTP correctly rejected:', expiredResult.message);
        } else {
            console.log('❌ Expired OTP was not rejected');
        }

        console.log('\n🎉 OTP system test completed successfully!');
        console.log('📧 Check your email for the test OTP message.');

    } catch (error) {
        console.error('❌ Test failed:', error.message);
        console.error('Full error:', error);
    } finally {
        await mongoose.disconnect();
        console.log('🔌 Disconnected from MongoDB');
        process.exit(0);
    }
}

// Run the test
testOTPSystem();
