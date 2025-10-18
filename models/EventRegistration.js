const mongoose = require('mongoose');

const eventRegistrationSchema = new mongoose.Schema({
    event: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event',
        required: [true, 'Event is required']
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User is required']
    },

    // Registration Details
    registrationData: {
        type: Map,
        of: mongoose.Schema.Types.Mixed
    },

    // Ticket Information
    ticketNumber: {
        type: String,
        unique: true,
        required: true
    },
    qrCode: String,

    // Registration Status
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected', 'cancelled', 'attended', 'no_show'],
        default: 'pending'
    },

    // Payment Information
    payment: {
        amount: {
            type: Number,
            default: 0
        },
        currency: {
            type: String,
            default: 'USD'
        },
        status: {
            type: String,
            enum: ['pending', 'completed', 'failed', 'refunded'],
            default: 'pending'
        },
        transactionId: String,
        paymentMethod: String,
        paidAt: Date
    },

    // Attendance Tracking
    attendance: {
        checkedIn: {
            type: Boolean,
            default: false
        },
        checkedInAt: Date,
        checkedOut: {
            type: Boolean,
            default: false
        },
        checkedOutAt: Date,
        attendanceDuration: Number // in minutes
    },

    // Feedback
    feedback: {
        rating: {
            type: Number,
            min: 1,
            max: 5
        },
        comment: String,
        submittedAt: Date
    },

    // Notifications
    notifications: {
        confirmationSent: {
            type: Boolean,
            default: false
        },
        reminderSent: {
            type: Boolean,
            default: false
        },
        followUpSent: {
            type: Boolean,
            default: false
        }
    },

    // Additional Information
    notes: String,
    specialRequirements: String,
    dietaryRestrictions: String,

    // Timestamps
    registeredAt: {
        type: Date,
        default: Date.now
    },
    approvedAt: Date,
    cancelledAt: Date
}, {
    timestamps: true
});

// Compound index to ensure one registration per user per event
eventRegistrationSchema.index({ event: 1, user: 1 }, { unique: true });

// Indexes for better performance
eventRegistrationSchema.index({ user: 1 });
eventRegistrationSchema.index({ event: 1 });
eventRegistrationSchema.index({ status: 1 });
eventRegistrationSchema.index({ registeredAt: -1 });

// Virtual for registration age
eventRegistrationSchema.virtual('registrationAge').get(function () {
    return Math.floor((Date.now() - this.registeredAt) / (1000 * 60 * 60 * 24));
});

// Pre-save middleware to update event attendee count
eventRegistrationSchema.pre('save', async function (next) {
    if (this.isNew) {
        try {
            const Event = mongoose.model('Event');
            await Event.findByIdAndUpdate(
                this.event,
                { $inc: { currentAttendees: 1 } }
            );
        } catch (error) {
            return next(error);
        }
    }
    next();
});

// Pre-remove middleware to update event attendee count
eventRegistrationSchema.pre('remove', async function (next) {
    try {
        const Event = mongoose.model('Event');
        await Event.findByIdAndUpdate(
            this.event,
            { $inc: { currentAttendees: -1 } }
        );
    } catch (error) {
        return next(error);
    }
    next();
});

// Method to check in user
eventRegistrationSchema.methods.checkIn = function () {
    this.attendance.checkedIn = true;
    this.attendance.checkedInAt = new Date();
    return this.save();
};

// Method to check out user
eventRegistrationSchema.methods.checkOut = function () {
    if (!this.attendance.checkedIn) {
        throw new Error('User must be checked in before checking out');
    }

    this.attendance.checkedOut = true;
    this.attendance.checkedOutAt = new Date();

    if (this.attendance.checkedInAt) {
        this.attendance.attendanceDuration = Math.floor(
            (this.attendance.checkedOutAt - this.attendance.checkedInAt) / (1000 * 60)
        );
    }

    return this.save();
};

// Method to submit feedback
eventRegistrationSchema.methods.submitFeedback = function (rating, comment) {
    this.feedback.rating = rating;
    this.feedback.comment = comment;
    this.feedback.submittedAt = new Date();
    return this.save();
};

// Static method to get user's event registrations
eventRegistrationSchema.statics.getUserRegistrations = function (userId, options = {}) {
    const query = { user: userId };

    if (options.status) {
        query.status = options.status;
    }

    return this.find(query)
        .populate({
            path: 'event',
            populate: {
                path: 'organizer',
                select: 'name avatar'
            }
        })
        .sort({ registeredAt: -1 });
};

// Static method to get event registrations
eventRegistrationSchema.statics.getEventRegistrations = function (eventId, options = {}) {
    const query = { event: eventId };

    if (options.status) {
        query.status = options.status;
    }

    return this.find(query)
        .populate('user', 'name email avatar')
        .sort({ registeredAt: -1 });
};

module.exports = mongoose.model('EventRegistration', eventRegistrationSchema);
