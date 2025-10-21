const mongoose = require('mongoose');

const speakerSchema = new mongoose.Schema({
    // Basic Information
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
        maxlength: [100, 'Name cannot exceed 100 characters']
    },

    email: {
        type: String,
        required: [true, 'Email is required'],
        trim: true,
        lowercase: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },

    phone: {
        type: String,
        trim: true,
        maxlength: [20, 'Phone number cannot exceed 20 characters']
    },

    // Professional Information
    organization: {
        type: String,
        required: [true, 'Organization is required'],
        trim: true,
        maxlength: [200, 'Organization name cannot exceed 200 characters']
    },

    position: {
        type: String,
        trim: true,
        maxlength: [100, 'Position cannot exceed 100 characters']
    },

    expertise: {
        type: [String],
        required: [true, 'At least one expertise area is required'],
        validate: {
            validator: function (v) {
                return v && v.length > 0;
            },
            message: 'At least one expertise area is required'
        }
    },

    topics: {
        type: [String],
        trim: true,
        maxlength: [50, 'Each topic cannot exceed 50 characters']
    },

    // Bio and Description
    bio: {
        type: String,
        required: [true, 'Bio is required'],
        trim: true,
        maxlength: [1000, 'Bio cannot exceed 1000 characters']
    },

    shortDescription: {
        type: String,
        trim: true,
        maxlength: [300, 'Short description cannot exceed 300 characters']
    },

    // Media
    profilePicture: {
        type: String,
        trim: true
    },

    portfolio: {
        type: String,
        trim: true
    },

    // Social Links
    linkedin: {
        type: String,
        trim: true
    },

    twitter: {
        type: String,
        trim: true
    },

    website: {
        type: String,
        trim: true
    },

    // Application Details
    applicationType: {
        type: String,
        enum: ['self_application', 'invitation'],
        default: 'self_application'
    },

    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected', 'invited'],
        default: 'pending'
    },

    // Event Association
    eventId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event',
        required: false // Optional for general applications
    },

    // Additional Information
    previousSpeakingExperience: {
        type: String,
        trim: true,
        maxlength: [500, 'Previous speaking experience cannot exceed 500 characters']
    },

    availability: {
        type: String,
        trim: true,
        maxlength: [200, 'Availability cannot exceed 200 characters']
    },

    specialRequirements: {
        type: String,
        trim: true,
        maxlength: [300, 'Special requirements cannot exceed 300 characters']
    },

    // Admin Notes
    adminNotes: {
        type: String,
        trim: true,
        maxlength: [500, 'Admin notes cannot exceed 500 characters']
    },

    // Timestamps
    appliedAt: {
        type: Date,
        default: Date.now
    },

    reviewedAt: {
        type: Date
    },

    reviewedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
});

// Indexes for better performance
speakerSchema.index({ email: 1 });
speakerSchema.index({ status: 1 });
speakerSchema.index({ eventId: 1 });
speakerSchema.index({ appliedAt: -1 });

// Virtual for full name with organization
speakerSchema.virtual('displayName').get(function () {
    return `${this.name} (${this.organization})`;
});

// Method to get public profile (without sensitive info)
speakerSchema.methods.getPublicProfile = function () {
    return {
        _id: this._id,
        name: this.name,
        organization: this.organization,
        position: this.position,
        expertise: this.expertise,
        topics: this.topics,
        bio: this.bio,
        shortDescription: this.shortDescription,
        profilePicture: this.profilePicture,
        linkedin: this.linkedin,
        twitter: this.twitter,
        website: this.website,
        previousSpeakingExperience: this.previousSpeakingExperience,
        status: this.status,
        appliedAt: this.appliedAt
    };
};

module.exports = mongoose.model('Speaker', speakerSchema);
