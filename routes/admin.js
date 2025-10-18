const express = require('express');
const { body, validationResult, query } = require('express-validator');
const User = require('../models/User');
const Event = require('../models/Event');
const EventRegistration = require('../models/EventRegistration');
const { protect, isAdmin } = require('../middleware/auth');

const router = express.Router();

// Apply admin middleware to all routes
router.use(protect);
router.use(isAdmin);

// @desc    Get admin dashboard stats
// @route   GET /api/admin/dashboard
// @access  Private (Admin only)
router.get('/dashboard', async (req, res) => {
    try {
        const [
            totalUsers,
            activeUsers,
            totalEvents,
            upcomingEvents,
            totalRegistrations,
            recentUsers,
            recentEvents
        ] = await Promise.all([
            User.countDocuments(),
            User.countDocuments({ isActive: true }),
            Event.countDocuments(),
            Event.countDocuments({ startDate: { $gt: new Date() } }),
            EventRegistration.countDocuments(),
            User.find().sort({ createdAt: -1 }).limit(5).select('name email createdAt'),
            Event.find().sort({ createdAt: -1 }).limit(5).populate('organizer', 'name')
        ]);

        // Calculate growth metrics (mock data for now)
        const userGrowth = 12.5; // Percentage
        const eventGrowth = 8.3; // Percentage
        const registrationGrowth = 15.7; // Percentage

        res.json({
            success: true,
            data: {
                stats: {
                    totalUsers,
                    activeUsers,
                    totalEvents,
                    upcomingEvents,
                    totalRegistrations,
                    userGrowth,
                    eventGrowth,
                    registrationGrowth
                },
                recent: {
                    users: recentUsers,
                    events: recentEvents
                }
            }
        });
    } catch (error) {
        console.error('Get dashboard stats error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching dashboard stats'
        });
    }
});

// @desc    Get all users (admin view)
// @route   GET /api/admin/users
// @access  Private (Admin only)
router.get('/users', [
    query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
    query('search').optional().isString().withMessage('Search must be a string'),
    query('isActive').optional().isBoolean().withMessage('isActive must be a boolean'),
    query('isEmailVerified').optional().isBoolean().withMessage('isEmailVerified must be a boolean')
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

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;

        // Build query
        const query = {};

        if (req.query.search) {
            query.$or = [
                { name: { $regex: req.query.search, $options: 'i' } },
                { email: { $regex: req.query.search, $options: 'i' } },
                { username: { $regex: req.query.search, $options: 'i' } }
            ];
        }

        if (req.query.isActive !== undefined) {
            query.isActive = req.query.isActive === 'true';
        }

        if (req.query.isEmailVerified !== undefined) {
            query.isEmailVerified = req.query.isEmailVerified === 'true';
        }

        const users = await User.find(query)
            .select('-password -emailVerificationToken -passwordResetToken')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await User.countDocuments(query);

        res.json({
            success: true,
            data: {
                users,
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
        console.error('Get admin users error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching users'
        });
    }
});

// @desc    Update user status
// @route   PUT /api/admin/users/:id/status
// @access  Private (Admin only)
router.put('/users/:id/status', [
    body('isActive').isBoolean().withMessage('isActive must be boolean'),
    body('isAdmin').optional().isBoolean().withMessage('isAdmin must be boolean'),
    body('isModerator').optional().isBoolean().withMessage('isModerator must be boolean')
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

        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Prevent admin from deactivating themselves
        if (user._id.toString() === req.user._id.toString() && req.body.isActive === false) {
            return res.status(400).json({
                success: false,
                message: 'Cannot deactivate your own account'
            });
        }

        user.isActive = req.body.isActive;
        if (req.body.isAdmin !== undefined) user.isAdmin = req.body.isAdmin;
        if (req.body.isModerator !== undefined) user.isModerator = req.body.isModerator;

        await user.save();

        res.json({
            success: true,
            message: 'User status updated successfully',
            data: { user: user.getPublicProfile() }
        });
    } catch (error) {
        console.error('Update user status error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while updating user status'
        });
    }
});

// @desc    Get all events (admin view)
// @route   GET /api/admin/events
// @access  Private (Admin only)
router.get('/events', [
    query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
    query('status').optional().isString().withMessage('Status must be a string'),
    query('search').optional().isString().withMessage('Search must be a string')
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

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;

        // Build query
        const query = {};

        if (req.query.status) {
            query.status = req.query.status;
        }

        if (req.query.search) {
            query.$or = [
                { title: { $regex: req.query.search, $options: 'i' } },
                { description: { $regex: req.query.search, $options: 'i' } }
            ];
        }

        const events = await Event.find(query)
            .populate('organizer', 'name email')
            .sort({ createdAt: -1 })
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
        console.error('Get admin events error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching events'
        });
    }
});

// @desc    Update event status
// @route   PUT /api/admin/events/:id/status
// @access  Private (Admin only)
router.put('/events/:id/status', [
    body('status').isIn(['Draft', 'Published', 'Cancelled', 'Completed', 'Postponed']).withMessage('Invalid status'),
    body('isFeatured').optional().isBoolean().withMessage('isFeatured must be boolean')
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

        event.status = req.body.status;
        if (req.body.isFeatured !== undefined) event.isFeatured = req.body.isFeatured;

        await event.save();
        await event.populate('organizer', 'name email');

        res.json({
            success: true,
            message: 'Event status updated successfully',
            data: { event }
        });
    } catch (error) {
        console.error('Update event status error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while updating event status'
        });
    }
});

// @desc    Get event registrations
// @route   GET /api/admin/events/:id/registrations
// @access  Private (Admin only)
router.get('/events/:id/registrations', async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);

        if (!event) {
            return res.status(404).json({
                success: false,
                message: 'Event not found'
            });
        }

        const registrations = await EventRegistration.getEventRegistrations(event._id);

        res.json({
            success: true,
            data: { registrations }
        });
    } catch (error) {
        console.error('Get event registrations error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching event registrations'
        });
    }
});

// @desc    Get system analytics
// @route   GET /api/admin/analytics
// @access  Private (Admin only)
router.get('/analytics', async (req, res) => {
    try {
        const { period = '30d' } = req.query;

        // Calculate date range based on period
        const now = new Date();
        let startDate;

        switch (period) {
            case '7d':
                startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                break;
            case '30d':
                startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
                break;
            case '90d':
                startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
                break;
            default:
                startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        }

        // Get analytics data
        const [
            userRegistrations,
            eventCreations,
            eventRegistrations
        ] = await Promise.all([
            User.aggregate([
                { $match: { createdAt: { $gte: startDate } } },
                {
                    $group: {
                        _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
                        count: { $sum: 1 }
                    }
                },
                { $sort: { _id: 1 } }
            ]),
            Event.aggregate([
                { $match: { createdAt: { $gte: startDate } } },
                {
                    $group: {
                        _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
                        count: { $sum: 1 }
                    }
                },
                { $sort: { _id: 1 } }
            ]),
            EventRegistration.aggregate([
                { $match: { createdAt: { $gte: startDate } } },
                {
                    $group: {
                        _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
                        count: { $sum: 1 }
                    }
                },
                { $sort: { _id: 1 } }
            ])
        ]);

        res.json({
            success: true,
            data: {
                period,
                analytics: {
                    userRegistrations,
                    eventCreations,
                    eventRegistrations
                }
            }
        });
    } catch (error) {
        console.error('Get analytics error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching analytics'
        });
    }
});

// @desc    Send announcement
// @route   POST /api/admin/announcements
// @access  Private (Admin only)
router.post('/announcements', [
    body('title').trim().isLength({ min: 5, max: 200 }).withMessage('Title must be between 5 and 200 characters'),
    body('message').trim().isLength({ min: 10, max: 1000 }).withMessage('Message must be between 10 and 1000 characters'),
    body('type').isIn(['info', 'warning', 'success', 'error']).withMessage('Invalid announcement type'),
    body('targetUsers').optional().isArray().withMessage('Target users must be an array')
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

        const { title, message, type, targetUsers } = req.body;

        // In a real implementation, you would:
        // 1. Save the announcement to database
        // 2. Send notifications to target users
        // 3. Use Socket.IO for real-time notifications

        const announcement = {
            _id: Date.now().toString(),
            title,
            message,
            type,
            targetUsers: targetUsers || 'all',
            createdBy: req.user._id,
            createdAt: new Date()
        };

        // Emit real-time notification
        const io = req.app.get('io');
        if (io) {
            if (targetUsers && targetUsers.length > 0) {
                targetUsers.forEach(userId => {
                    io.to(`user-${userId}`).emit('announcement', announcement);
                });
            } else {
                io.emit('announcement', announcement);
            }
        }

        res.status(201).json({
            success: true,
            message: 'Announcement sent successfully',
            data: { announcement }
        });
    } catch (error) {
        console.error('Send announcement error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while sending announcement'
        });
    }
});

module.exports = router;
