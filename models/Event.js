const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    // Basic Information
    title: {
        type: String,
        required: [true, 'Event title is required'],
        trim: true,
        maxlength: [100, 'Title cannot be more than 100 characters']
    },
    description: {
        type: String,
        required: [true, 'Event description is required'],
        maxlength: [2000, 'Description cannot be more than 2000 characters']
    },
    shortDescription: {
        type: String,
        maxlength: [300, 'Short description cannot be more than 300 characters']
    },

    // Event Details
    category: {
        type: String,
        required: [true, 'Event category is required'],
        enum: ['Workshop', 'Conference', 'Meetup', 'Webinar', 'Training', 'Hackathon', 'Networking', 'Other']
    },
    type: {
        type: String,
        required: [true, 'Event type is required'],
        enum: ['Online', 'In-Person', 'Hybrid']
    },
    difficulty: {
        type: String,
        enum: ['Beginner', 'Intermediate', 'Advanced', 'All Levels'],
        default: 'All Levels'
    },

    // Date and Time
    startDate: {
        type: Date,
        required: [true, 'Start date is required']
    },
    endDate: {
        type: Date,
        required: [true, 'End date is required']
    },
    timezone: {
        type: String,
        default: 'UTC'
    },
    duration: {
        type: Number, // in minutes
        required: false // Can be calculated from start and end dates
    },

    // Location Information
    location: {
        venue: String,
        address: String,
        city: String,
        state: String,
        country: String,
        coordinates: {
            latitude: Number,
            longitude: Number
        },
        onlineLink: String,
        meetingId: String,
        meetingPassword: String
    },

    // Organizer Information
    organizer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Event organizer is required']
    },
    coOrganizers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    speakers: [{
        name: String,
        title: String,
        company: String,
        bio: String,
        avatar: String,
        image: {
            type: String,
            maxlength: [10000000, 'Image data too large'] // 10MB limit
        },
        profilePicture: {
            type: String,
            maxlength: [10000000, 'Profile picture data too large'] // 10MB limit
        },
        socialLinks: {
            linkedin: String,
            twitter: String,
            website: String
        }
    }],

    // Pricing and Capacity
    price: {
        type: Number,
        default: 0,
        min: [0, 'Price cannot be negative']
    },
    currency: {
        type: String,
        default: 'USD',
        enum: ['USD', 'EUR', 'GBP', 'INR', 'CAD', 'AUD']
    },
    maxAttendees: {
        type: Number,
        required: [true, 'Maximum attendees is required'],
        min: [1, 'Maximum attendees must be at least 1']
    },
    currentAttendees: {
        type: Number,
        default: 0
    },

    // Event Status
    status: {
        type: String,
        enum: ['Draft', 'Published', 'Cancelled', 'Completed', 'Postponed'],
        default: 'Draft'
    },
    isFeatured: {
        type: Boolean,
        default: false
    },
    isPublic: {
        type: Boolean,
        default: true
    },

    // Registration
    registrationOpen: {
        type: Boolean,
        default: true
    },
    registrationDeadline: Date,
    requiresApproval: {
        type: Boolean,
        default: false
    },
    registrationFields: [{
        name: String,
        type: {
            type: String,
            enum: ['text', 'email', 'phone', 'textarea', 'select', 'checkbox', 'radio']
        },
        required: Boolean,
        options: [String], // for select, radio, checkbox
        placeholder: String
    }],

    // Content and Media
    coverImage: String,
    images: [String],
    videos: [{
        title: String,
        url: String,
        thumbnail: String
    }],
    documents: [{
        title: String,
        url: String,
        type: String
    }],
    agenda: [{
        time: String,
        title: String,
        description: String,
        speaker: String,
        duration: Number
    }],

    // Tags and Topics
    tags: [{
        type: String,
        trim: true,
        lowercase: true
    }],
    topics: [{
        type: String,
        trim: true
    }],

    // Requirements and Prerequisites
    prerequisites: [String],
    requirements: [String],
    whatYouWillLearn: [String],
    targetAudience: [String],

    // Engagement
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    bookmarks: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    shares: {
        type: Number,
        default: 0
    },
    views: {
        type: Number,
        default: 0
    },

    // Reviews and Ratings
    reviews: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        rating: {
            type: Number,
            min: 1,
            max: 5,
            required: true
        },
        comment: String,
        createdAt: {
            type: Date,
            default: Date.now
        }
    }],
    averageRating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
    },
    totalReviews: {
        type: Number,
        default: 0
    },

    // Analytics
    analytics: {
        registrations: [{
            date: Date,
            count: Number
        }],
        attendance: {
            registered: Number,
            attended: Number,
            noShow: Number
        },
        engagement: {
            pageViews: Number,
            uniqueVisitors: Number,
            timeOnPage: Number
        }
    },

    // Notifications
    notifications: {
        reminderSent: {
            type: Boolean,
            default: false
        },
        reminderDate: Date,
        followUpSent: {
            type: Boolean,
            default: false
        }
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Indexes for better performance
eventSchema.index({ title: 'text', description: 'text', tags: 'text' });
eventSchema.index({ category: 1 });
eventSchema.index({ status: 1 });
eventSchema.index({ startDate: 1 });
eventSchema.index({ organizer: 1 });
eventSchema.index({ isFeatured: 1, startDate: 1 });
eventSchema.index({ location: 1 });
eventSchema.index({ tags: 1 });

// Virtual for available spots
eventSchema.virtual('availableSpots').get(function () {
    return this.maxAttendees - this.currentAttendees;
});

// Virtual for registration status
eventSchema.virtual('registrationStatus').get(function () {
    if (!this.registrationOpen) return 'closed';
    if (this.registrationDeadline && new Date() > this.registrationDeadline) return 'deadline_passed';
    if (this.availableSpots <= 0) return 'full';
    return 'open';
});

// Virtual for event status based on dates
eventSchema.virtual('eventStatus').get(function () {
    const now = new Date();
    if (now < this.startDate) return 'upcoming';
    if (now >= this.startDate && now <= this.endDate) return 'ongoing';
    return 'completed';
});

// Pre-save middleware to update current attendees count and calculate duration
eventSchema.pre('save', function (next) {
    if (this.isModified('currentAttendees')) {
        if (this.currentAttendees > this.maxAttendees) {
            return next(new Error('Current attendees cannot exceed maximum attendees'));
        }
    }

    // Calculate duration if not provided
    if (!this.duration && this.startDate && this.endDate) {
        this.duration = Math.round((this.endDate - this.startDate) / (1000 * 60)); // Convert to minutes
    }

    next();
});

// Method to check if user can register
eventSchema.methods.canRegister = function (userId) {
    if (!this.registrationOpen) return { can: false, reason: 'Registration is closed' };
    if (this.registrationDeadline && new Date() > this.registrationDeadline) {
        return { can: false, reason: 'Registration deadline has passed' };
    }
    if (this.availableSpots <= 0) return { can: false, reason: 'Event is full' };
    if (this.status !== 'Published') return { can: false, reason: 'Event is not published' };
    return { can: true };
};

// Method to update average rating
eventSchema.methods.updateRating = function () {
    if (this.reviews.length === 0) {
        this.averageRating = 0;
        this.totalReviews = 0;
    } else {
        const totalRating = this.reviews.reduce((sum, review) => sum + review.rating, 0);
        this.averageRating = Math.round((totalRating / this.reviews.length) * 10) / 10;
        this.totalReviews = this.reviews.length;
    }
};

// Static method to find upcoming events
eventSchema.statics.findUpcoming = function (limit = 10) {
    return this.find({
        status: 'Published',
        startDate: { $gt: new Date() }
    })
        .sort({ startDate: 1 })
        .limit(limit)
        .populate('organizer', 'name avatar')
        .populate('coOrganizers', 'name avatar');
};

// Static method to find events by category
eventSchema.statics.findByCategory = function (category, limit = 10) {
    return this.find({
        category,
        status: 'Published',
        startDate: { $gt: new Date() }
    })
        .sort({ startDate: 1 })
        .limit(limit)
        .populate('organizer', 'name avatar');
};

module.exports = mongoose.model('Event', eventSchema);
