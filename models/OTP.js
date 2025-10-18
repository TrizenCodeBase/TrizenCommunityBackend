const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Email is required'],
        lowercase: true,
        match: [
            /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
            'Please provide a valid email'
        ]
    },
    otp: {
        type: String,
        required: [true, 'OTP is required'],
        length: 6
    },
    type: {
        type: String,
        enum: ['email_verification', 'password_reset', 'login_verification'],
        required: [true, 'OTP type is required']
    },
    attempts: {
        type: Number,
        default: 0,
        max: 3
    },
    isUsed: {
        type: Boolean,
        default: false
    },
    expiresAt: {
        type: Date,
        required: true,
        default: () => new Date(Date.now() + 10 * 60 * 1000) // 10 minutes
    }
}, {
    timestamps: true
});

// Index for better performance
otpSchema.index({ email: 1, type: 1 });
otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // Auto-delete expired OTPs

// Static method to generate OTP
otpSchema.statics.generateOTP = function () {
    return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
};

// Static method to create OTP
otpSchema.statics.createOTP = async function (email, type) {
    // Delete any existing OTPs for this email and type
    await this.deleteMany({ email, type });

    const otp = this.generateOTP();
    const otpDoc = new this({
        email,
        otp,
        type
    });

    return await otpDoc.save();
};

// Static method to verify OTP
otpSchema.statics.verifyOTP = async function (email, otp, type) {
    const otpDoc = await this.findOne({
        email,
        otp,
        type,
        isUsed: false,
        expiresAt: { $gt: new Date() }
    });

    if (!otpDoc) {
        return { success: false, message: 'Invalid or expired OTP' };
    }

    // Check attempts
    if (otpDoc.attempts >= 3) {
        await this.deleteOne({ _id: otpDoc._id });
        return { success: false, message: 'Too many failed attempts. Please request a new OTP.' };
    }

    // Mark as used
    otpDoc.isUsed = true;
    await otpDoc.save();

    return { success: true, message: 'OTP verified successfully' };
};

// Static method to increment attempts
otpSchema.statics.incrementAttempts = async function (email, otp, type) {
    const otpDoc = await this.findOne({
        email,
        otp,
        type,
        isUsed: false,
        expiresAt: { $gt: new Date() }
    });

    if (otpDoc) {
        otpDoc.attempts += 1;
        await otpDoc.save();
    }
};

module.exports = mongoose.model('OTP', otpSchema);
