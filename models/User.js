const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    // Basic Information
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
        maxlength: [50, 'Name cannot be more than 50 characters']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        match: [
            /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
            'Please provide a valid email'
        ],
        index: true
    },
    password: {
        type: String,
        minlength: [6, 'Password must be at least 6 characters'],
        select: false
    },
    username: {
        type: String,
        unique: true,
        sparse: true,
        trim: true,
        lowercase: true,
        match: [/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'],
        index: true
    },

    // Profile Information
    avatar: {
        type: String,
        default: null
    },
    bio: {
        type: String,
        maxlength: [500, 'Bio cannot be more than 500 characters']
    },
    location: {
        type: String,
        maxlength: [100, 'Location cannot be more than 100 characters']
    },
    website: {
        type: String,
        match: [/^https?:\/\/.+/, 'Please provide a valid URL']
    },
    company: {
        type: String,
        maxlength: [100, 'Company name cannot be more than 100 characters']
    },
    jobTitle: {
        type: String,
        maxlength: [100, 'Job title cannot be more than 100 characters']
    },
    experience: {
        type: String,
        enum: ['Student', '0-2 years', '3-5 years', '6-10 years', '10+ years']
    },

    // Skills and Interests
    skills: [{
        type: String,
        trim: true
    }],
    interests: [{
        type: String,
        trim: true
    }],
    specialties: [{
        type: String,
        trim: true
    }],

    // Social Links
    socialLinks: {
        linkedin: String,
        github: String,
        twitter: String,
        portfolio: String
    },

    // OAuth IDs
    googleId: String,
    githubId: String,
    linkedinId: String,
    provider: {
        type: String,
        enum: ['local', 'google', 'github', 'linkedin'],
        default: 'local'
    },

    // Account Status
    isEmailVerified: {
        type: Boolean,
        default: false
    },
    emailVerificationToken: String,
    emailVerificationExpires: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    isActive: {
        type: Boolean,
        default: true
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    isModerator: {
        type: Boolean,
        default: false
    },

    // Activity Tracking
    lastLogin: Date,
    loginCount: {
        type: Number,
        default: 0
    },
    profileViews: {
        type: Number,
        default: 0
    },

    // Email Subscription
    isSubscribed: {
        type: Boolean,
        default: true
    },
    subscriptionToken: {
        type: String,
        unique: true,
        sparse: true
    },
    subscriptionPreferences: {
        eventUpdates: {
            type: Boolean,
            default: true
        },
        newsletter: {
            type: Boolean,
            default: true
        },
        promotional: {
            type: Boolean,
            default: false
        }
    },

    // Preferences
    preferences: {
        emailNotifications: {
            type: Boolean,
            default: true
        },
        eventNotifications: {
            type: Boolean,
            default: true
        },
        newsletter: {
            type: Boolean,
            default: true
        },
        privacy: {
            profileVisibility: {
                type: String,
                enum: ['public', 'community', 'private'],
                default: 'community'
            },
            showEmail: {
                type: Boolean,
                default: false
            },
            showLocation: {
                type: Boolean,
                default: true
            }
        }
    },

    // Achievements and Stats
    achievements: [{
        type: {
            type: String,
            enum: ['event_organizer', 'active_member', 'mentor', 'contributor', 'speaker']
        },
        title: String,
        description: String,
        earnedAt: {
            type: Date,
            default: Date.now
        }
    }],
    stats: {
        eventsAttended: {
            type: Number,
            default: 0
        },
        eventsOrganized: {
            type: Number,
            default: 0
        },
        postsCreated: {
            type: Number,
            default: 0
        },
        commentsMade: {
            type: Number,
            default: 0
        }
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Indexes for better performance
userSchema.index({ googleId: 1 });
userSchema.index({ githubId: 1 });
userSchema.index({ linkedinId: 1 });
userSchema.index({ isActive: 1 });
userSchema.index({ createdAt: -1 });

// Virtual for full name
userSchema.virtual('fullName').get(function () {
    return this.name;
});

// Virtual for profile completion percentage
userSchema.virtual('profileCompletion').get(function () {
    const fields = ['name', 'email', 'bio', 'location', 'skills', 'avatar'];
    const completedFields = fields.filter(field => {
        if (field === 'skills') return this.skills && this.skills.length > 0;
        return this[field] && this[field].toString().trim() !== '';
    });
    return Math.round((completedFields.length / fields.length) * 100);
});

// Pre-save middleware to hash password and generate subscription token
userSchema.pre('save', async function (next) {
    // Hash password if modified
    if (this.isModified('password')) {
        try {
            const salt = await bcrypt.genSalt(parseInt(process.env.BCRYPT_ROUNDS) || 12);
            this.password = await bcrypt.hash(this.password, salt);
        } catch (error) {
            return next(error);
        }
    }

    // Generate subscription token if not exists
    if (this.isNew && !this.subscriptionToken) {
        this.subscriptionToken = require('crypto').randomBytes(32).toString('hex');
    }

    next();
});

// Method to compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
    if (!this.password) return false;
    return await bcrypt.compare(candidatePassword, this.password);
};

// Method to generate JWT token
userSchema.methods.generateAuthToken = function () {
    return jwt.sign(
        {
            id: this._id,
            email: this.email,
            isAdmin: this.isAdmin
        },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRE || '7d' }
    );
};

// Method to generate refresh token
userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        { id: this._id },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: process.env.JWT_REFRESH_EXPIRE || '30d' }
    );
};

// Method to get public profile
userSchema.methods.getPublicProfile = function () {
    const userObject = this.toObject();
    delete userObject.password;
    delete userObject.emailVerificationToken;
    delete userObject.emailVerificationExpires;
    delete userObject.passwordResetToken;
    delete userObject.passwordResetExpires;
    delete userObject.googleId;
    delete userObject.githubId;
    delete userObject.linkedinId;
    return userObject;
};

// Method to generate subscription token
userSchema.methods.generateSubscriptionToken = function () {
    this.subscriptionToken = require('crypto').randomBytes(32).toString('hex');
    return this.subscriptionToken;
};

// Method to unsubscribe
userSchema.methods.unsubscribe = function () {
    this.isSubscribed = false;
    return this.save();
};

// Method to subscribe
userSchema.methods.subscribe = function () {
    this.isSubscribed = true;
    return this.save();
};

// Static method to find by subscription token
userSchema.statics.findBySubscriptionToken = function (token) {
    return this.findOne({ subscriptionToken: token });
};

// Static method to find by email or username
userSchema.statics.findByEmailOrUsername = function (identifier) {
    return this.findOne({
        $or: [
            { email: identifier.toLowerCase() },
            { username: identifier.toLowerCase() }
        ]
    });
};

module.exports = mongoose.model('User', userSchema);
