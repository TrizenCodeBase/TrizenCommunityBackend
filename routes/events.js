const express = require('express');
const mongoose = require('mongoose');
const { body, validationResult, query } = require('express-validator');
const Event = require('../models/Event');
const EventRegistration = require('../models/EventRegistration');
const { protect, optionalAuth, isAdmin } = require('../middleware/auth');
const { sendEmail } = require('../utils/email');

const router = express.Router();

// Helper function to generate unique ticket number
const generateTicketNumber = () => {
    const prefix = 'TRZ';
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `${prefix}-${timestamp}-${random}`;
};

// Helper function to format event date
const formatEventDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
};

// Helper function to format event time
const formatEventTime = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);

    const startTime = start.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    });

    const endTime = end.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    });

    return `${startTime} - ${endTime}`;
};

// @desc    Get all events
// @route   GET /api/events
// @access  Public
router.get('/', [
    query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('Limit must be between 1 and 50'),
    query('category').optional().isString().withMessage('Category must be a string'),
    query('type').optional().isString().withMessage('Type must be a string'),
    query('status').optional().isString().withMessage('Status must be a string'),
    query('search').optional().isString().withMessage('Search must be a string'),
    query('sort').optional().isIn(['date', '-date', 'title', '-title', 'createdAt', '-createdAt']).withMessage('Invalid sort option')
], optionalAuth, async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: errors.array()
            });
        }

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        // Build query
        const query = { status: 'Published' };

        // Category filter
        if (req.query.category) {
            query.category = req.query.category;
        }

        // Type filter
        if (req.query.type) {
            query.type = req.query.type;
        }

        // Status filter (for admin)
        if (req.query.status && req.user?.isAdmin) {
            query.status = req.query.status;
        }

        // Search filter
        if (req.query.search) {
            query.$text = { $search: req.query.search };
        }

        // Date filter
        if (req.query.upcoming === 'true') {
            query.startDate = { $gt: new Date() };
        }

        if (req.query.past === 'true') {
            query.endDate = { $lt: new Date() };
        }

        // Sort
        let sort = { startDate: 1 }; // Default sort by start date
        if (req.query.sort) {
            sort = { [req.query.sort.replace('-', '')]: req.query.sort.startsWith('-') ? -1 : 1 };
        }

        // Execute query
        const events = await Event.find(query)
            .populate('organizer', 'name avatar')
            .populate('coOrganizers', 'name avatar')
            .sort(sort)
            .skip(skip)
            .limit(limit);

        const total = await Event.countDocuments(query);

        res.json({
            success: true,
            data: {
                events,
                pagination: {
                    current: page,
                    pages: Math.ceil(total / limit),
                    total,
                    hasNext: page < Math.ceil(total / limit),
                    hasPrev: page > 1
                }
            }
        });
    } catch (error) {
        console.error('Get events error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching events'
        });
    }
});

// @desc    Get single event
// @route   GET /api/events/:id
// @access  Public
router.get('/:id', optionalAuth, async (req, res) => {
    try {
        const event = await Event.findById(req.params.id)
            .populate('organizer', 'name avatar bio')
            .populate('coOrganizers', 'name avatar')
            .populate('reviews.user', 'name avatar');

        if (!event) {
            return res.status(404).json({
                success: false,
                message: 'Event not found'
            });
        }

        // Check if user is registered (if authenticated)
        let userRegistration = null;
        if (req.user) {
            userRegistration = await EventRegistration.findOne({
                event: event._id,
                user: req.user._id
            });
        }

        // Increment view count
        event.views += 1;
        await event.save();

        res.json({
            success: true,
            data: {
                event,
                userRegistration
            }
        });
    } catch (error) {
        console.error('Get event error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching event'
        });
    }
});

// @desc    Create new event
// @route   POST /api/events
// @access  Private (Admin only)
router.post('/', protect, isAdmin, [
    body('title').trim().isLength({ min: 5, max: 100 }).withMessage('Title must be between 5 and 100 characters'),
    body('description').trim().isLength({ min: 20, max: 2000 }).withMessage('Description must be between 20 and 2000 characters'),
    body('category').isIn(['Workshop', 'Conference', 'Meetup', 'Webinar', 'Training', 'Hackathon', 'Networking', 'Other']).withMessage('Invalid category'),
    body('type').isIn(['Online', 'In-Person', 'Hybrid']).withMessage('Invalid type'),
    body('startDate').isISO8601().withMessage('Invalid start date'),
    body('endDate').isISO8601().withMessage('Invalid end date'),
    body('maxAttendees').isInt({ min: 1 }).withMessage('Max attendees must be at least 1'),
    body('price').optional().isFloat({ min: 0 }).withMessage('Price must be non-negative')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: errors.array()
            });
        }

        const eventData = {
            ...req.body,
            organizer: req.user._id
        };

        // Validate dates
        if (new Date(eventData.startDate) >= new Date(eventData.endDate)) {
            return res.status(400).json({
                success: false,
                message: 'End date must be after start date'
            });
        }

        if (new Date(eventData.startDate) < new Date()) {
            return res.status(400).json({
                success: false,
                message: 'Start date cannot be in the past'
            });
        }

        const event = new Event(eventData);
        await event.save();

        await event.populate('organizer', 'name avatar');

        res.status(201).json({
            success: true,
            message: 'Event created successfully',
            data: { event }
        });
    } catch (error) {
        console.error('Create event error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while creating event'
        });
    }
});

// @desc    Update event
// @route   PUT /api/events/:id
// @access  Private
router.put('/:id', protect, [
    body('title').optional().trim().isLength({ min: 5, max: 100 }).withMessage('Title must be between 5 and 100 characters'),
    body('description').optional().trim().isLength({ min: 20, max: 2000 }).withMessage('Description must be between 20 and 2000 characters'),
    body('category').optional().isIn(['Workshop', 'Conference', 'Meetup', 'Webinar', 'Training', 'Hackathon', 'Networking', 'Other']).withMessage('Invalid category'),
    body('type').optional().isIn(['Online', 'In-Person', 'Hybrid']).withMessage('Invalid type'),
    body('startDate').optional().isISO8601().withMessage('Invalid start date'),
    body('endDate').optional().isISO8601().withMessage('Invalid end date'),
    body('maxAttendees').optional().isInt({ min: 1 }).withMessage('Max attendees must be at least 1'),
    body('price').optional().isFloat({ min: 0 }).withMessage('Price must be non-negative')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: errors.array()
            });
        }

        const event = await Event.findById(req.params.id);

        if (!event) {
            return res.status(404).json({
                success: false,
                message: 'Event not found'
            });
        }

        // Check if user is organizer or admin
        if (event.organizer.toString() !== req.user._id.toString() && !req.user.isAdmin) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to update this event'
            });
        }

        // Validate dates if provided
        if (req.body.startDate || req.body.endDate) {
            const startDate = req.body.startDate ? new Date(req.body.startDate) : event.startDate;
            const endDate = req.body.endDate ? new Date(req.body.endDate) : event.endDate;

            if (startDate >= endDate) {
                return res.status(400).json({
                    success: false,
                    message: 'End date must be after start date'
                });
            }
        }

        // Update event
        Object.keys(req.body).forEach(key => {
            if (req.body[key] !== undefined) {
                event[key] = req.body[key];
            }
        });

        await event.save();
        await event.populate('organizer', 'name avatar');

        res.json({
            success: true,
            message: 'Event updated successfully',
            data: { event }
        });
    } catch (error) {
        console.error('Update event error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while updating event'
        });
    }
});

// @desc    Delete event
// @route   DELETE /api/events/:id
// @access  Private
router.delete('/:id', protect, async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);

        if (!event) {
            return res.status(404).json({
                success: false,
                message: 'Event not found'
            });
        }

        // Check if user is organizer or admin
        if (event.organizer.toString() !== req.user._id.toString() && !req.user.isAdmin) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to delete this event'
            });
        }

        // Delete all registrations for this event
        await EventRegistration.deleteMany({ event: event._id });

        // Delete event
        await Event.findByIdAndDelete(req.params.id);

        res.json({
            success: true,
            message: 'Event deleted successfully'
        });
    } catch (error) {
        console.error('Delete event error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while deleting event'
        });
    }
});

// @desc    Register for event
// @route   POST /api/events/:id/register
// @access  Private
router.post('/:id/register', protect, async (req, res) => {
    try {
        console.log('🔍 Registration attempt:', {
            eventId: req.params.id,
            userId: req.user._id,
            userEmail: req.user.email,
            authHeader: req.headers.authorization,
            hasUser: !!req.user
        });

        // Check database connection
        if (mongoose.connection.readyState !== 1) {
            console.error('❌ Database not connected. ReadyState:', mongoose.connection.readyState);
            return res.status(500).json({
                success: false,
                message: 'Database connection not available'
            });
        }

        const event = await Event.findById(req.params.id);

        if (!event) {
            console.log('❌ Event not found:', req.params.id);
            return res.status(404).json({
                success: false,
                message: 'Event not found'
            });
        }

        console.log('✅ Event found:', event.title);

        // Check if user can register
        try {
            const canRegister = event.canRegister(req.user._id);
            console.log('🔍 Can register check:', canRegister);
            if (!canRegister.can) {
                console.log('❌ Cannot register:', canRegister.reason);
                return res.status(400).json({
                    success: false,
                    message: canRegister.reason
                });
            }
        } catch (canRegisterError) {
            console.error('❌ Error checking registration eligibility:', canRegisterError);
            return res.status(500).json({
                success: false,
                message: 'Error checking registration eligibility'
            });
        }

        // Check if already registered
        const existingRegistration = await EventRegistration.findOne({
            event: event._id,
            user: req.user._id
        });

        if (existingRegistration) {
            return res.status(400).json({
                success: false,
                message: 'Already registered for this event'
            });
        }

        // Generate unique ticket number
        const ticketNumber = generateTicketNumber();

        // Create registration
        let registration;
        try {
            registration = new EventRegistration({
                event: event._id,
                user: req.user._id,
                ticketNumber: ticketNumber,
                registrationData: req.body.registrationData || {},
                status: event.requiresApproval ? 'pending' : 'approved'
            });

            await registration.save();
            await registration.populate('user', 'name email avatar');
            console.log('✅ Registration created successfully:', registration._id);
        } catch (registrationError) {
            console.error('❌ Error creating registration:', registrationError);
            return res.status(500).json({
                success: false,
                message: 'Error creating registration'
            });
        }

        // Prepare location string
        let eventLocation = '';
        if (event.type === 'Online') {
            eventLocation = 'Online Event';
        } else if (event.type === 'Hybrid') {
            eventLocation = event.location.venue ? `${event.location.venue} & Online` : 'Hybrid Event';
        } else {
            if (event.location.venue) {
                eventLocation = event.location.venue;
                if (event.location.city) {
                    eventLocation += `, ${event.location.city}`;
                }
            } else if (event.location.city) {
                eventLocation = event.location.city;
            } else {
                eventLocation = 'In-Person Event';
            }
        }

        // Format dates and times
        const eventDate = formatEventDate(event.startDate);
        const eventTime = formatEventTime(event.startDate, event.endDate);

        // Prepare ticket URL
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:8081';
        const ticketUrl = `${frontendUrl}/events/${event._id}/ticket/${registration._id}`;
        const eventUrl = `${frontendUrl}/events/${event._id}`;

        // Send confirmation email (optional - won't fail registration if email fails)
        try {
            console.log('📧 Attempting to send confirmation email to:', req.user.email);

            // Check if email configuration is available
            if (process.env.EMAIL_HOST && process.env.EMAIL_USER && process.env.EMAIL_PASS) {
                await sendEmail({
                    email: req.user.email,
                    template: 'eventRegistration',
                    data: {
                        name: req.user.name,
                        eventTitle: event.title,
                        eventDate: eventDate,
                        eventTime: eventTime,
                        eventLocation: eventLocation,
                        eventType: event.type,
                        eventCategory: event.category,
                        ticketNumber: ticketNumber,
                        ticketUrl: ticketUrl,
                        eventUrl: eventUrl,
                        requiresApproval: event.requiresApproval,
                        supportUrl: `${frontendUrl}/contact`,
                        websiteUrl: frontendUrl
                    }
                });

                console.log('✅ Confirmation email sent successfully to:', req.user.email);
                registration.notifications.confirmationSent = true;
            } else {
                console.log('⚠️ Email configuration not available, skipping email send');
                registration.notifications.confirmationSent = false;
            }

            await registration.save();
        } catch (emailError) {
            console.error('❌ Failed to send confirmation email:', emailError.message);
            console.log('⚠️ Continuing with registration despite email failure');
            registration.notifications.confirmationSent = false;
            await registration.save();
        }

        res.status(201).json({
            success: true,
            message: event.requiresApproval ? 'Registration submitted for approval' : 'Successfully registered for event',
            data: { registration }
        });
    } catch (error) {
        console.error('❌ Event registration error:', error);
        console.error('❌ Error details:', {
            message: error.message,
            stack: error.stack,
            name: error.name,
            code: error.code,
            keyValue: error.keyValue
        });

        // Return more specific error messages
        let errorMessage = 'Server error while registering for event';
        if (error.name === 'ValidationError') {
            errorMessage = 'Validation error: ' + error.message;
        } else if (error.name === 'MongoError' && error.code === 11000) {
            errorMessage = 'Duplicate registration detected';
        } else if (error.name === 'CastError') {
            errorMessage = 'Invalid event ID format';
        }

        res.status(500).json({
            success: false,
            message: errorMessage,
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// @desc    Cancel event registration
// @route   DELETE /api/events/:id/register
// @access  Private
router.delete('/:id/register', protect, async (req, res) => {
    try {
        const registration = await EventRegistration.findOne({
            event: req.params.id,
            user: req.user._id
        });

        if (!registration) {
            return res.status(404).json({
                success: false,
                message: 'Registration not found'
            });
        }

        if (registration.status === 'cancelled') {
            return res.status(400).json({
                success: false,
                message: 'Registration already cancelled'
            });
        }

        registration.status = 'cancelled';
        registration.cancelledAt = new Date();
        await registration.save();

        res.json({
            success: true,
            message: 'Registration cancelled successfully'
        });
    } catch (error) {
        console.error('Cancel registration error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while cancelling registration'
        });
    }
});

// @desc    Get event registrations
// @route   GET /api/events/:id/registrations
// @access  Private
router.get('/:id/registrations', protect, async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);

        if (!event) {
            return res.status(404).json({
                success: false,
                message: 'Event not found'
            });
        }

        // Check if user is organizer or admin
        if (event.organizer.toString() !== req.user._id.toString() && !req.user.isAdmin) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to view registrations'
            });
        }

        const registrations = await EventRegistration.getEventRegistrations(event._id, {
            status: req.query.status
        });

        res.json({
            success: true,
            data: { registrations }
        });
    } catch (error) {
        console.error('Get registrations error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching registrations'
        });
    }
});

// @desc    Get featured events
// @route   GET /api/events/featured
// @access  Public
router.get('/featured', async (req, res) => {
    try {
        const events = await Event.find({
            isFeatured: true,
            status: 'Published',
            startDate: { $gt: new Date() }
        })
            .populate('organizer', 'name avatar')
            .sort({ startDate: 1 })
            .limit(6);

        res.json({
            success: true,
            data: { events }
        });
    } catch (error) {
        console.error('Get featured events error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching featured events'
        });
    }
});

module.exports = router;
