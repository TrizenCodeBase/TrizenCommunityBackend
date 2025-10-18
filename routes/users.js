const express = require('express');
const { body, validationResult, query } = require('express-validator');
const User = require('../models/User');
const { protect, isAdmin } = require('../middleware/auth');

const router = express.Router();

// @desc    Get all users
// @route   GET /api/users
// @access  Private (Admin only)
router.get('/', protect, isAdmin, [
    query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('Limit must be between 1 and 50'),
    query('search').optional().isString().withMessage('Search must be a string'),
    query('role').optional().isString().withMessage('Role must be a string'),
    query('isActive').optional().isBoolean().withMessage('isActive must be a boolean')
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
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        // Build query
        const query = {};

        // Search filter
        if (req.query.search) {
            query.$or = [
                { name: { $regex: req.query.search, $options: 'i' } },
                { email: { $regex: req.query.search, $options: 'i' } },
                { username: { $regex: req.query.search, $options: 'i' } }
            ];
        }

        // Role filter
        if (req.query.role) {
            query.role = req.query.role;
        }

        // Active status filter
        if (req.query.isActive !== undefined) {
            query.isActive = req.query.isActive === 'true';
        }

        // Execute query
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
        console.error('Get users error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching users'
        });
    }
});

// @desc    Get user profile
// @route   GET /api/users/:id
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Check privacy settings
        const isOwnProfile = req.user && req.user._id.toString() === user._id.toString();
        const isAdmin = req.user && req.user.isAdmin;

        if (!isOwnProfile && !isAdmin) {
            // Apply privacy filters
            if (user.preferences.privacy.profileVisibility === 'private') {
                return res.status(403).json({
                    success: false,
                    message: 'Profile is private'
                });
            }

            // Remove sensitive information
            const publicProfile = user.getPublicProfile();

            if (!user.preferences.privacy.showEmail) {
                delete publicProfile.email;
            }

            if (!user.preferences.privacy.showLocation) {
                delete publicProfile.location;
            }

            return res.json({
                success: true,
                data: { user: publicProfile }
            });
        }

        res.json({
            success: true,
            data: { user: user.getPublicProfile() }
        });
    } catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching user'
        });
    }
});

// @desc    Update user profile
// @route   PUT /api/users/:id
// @access  Private
router.put('/:id', protect, [
    body('name').optional().trim().isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters'),
    body('bio').optional().trim().isLength({ max: 500 }).withMessage('Bio cannot be more than 500 characters'),
    body('location').optional().trim().isLength({ max: 100 }).withMessage('Location cannot be more than 100 characters'),
    body('website').optional().isURL().withMessage('Please provide a valid URL'),
    body('company').optional().trim().isLength({ max: 100 }).withMessage('Company name cannot be more than 100 characters'),
    body('jobTitle').optional().trim().isLength({ max: 100 }).withMessage('Job title cannot be more than 100 characters'),
    body('experience').optional().isIn(['Student', '0-2 years', '3-5 years', '6-10 years', '10+ years']).withMessage('Invalid experience level'),
    body('skills').optional().isArray().withMessage('Skills must be an array'),
    body('interests').optional().isArray().withMessage('Interests must be an array'),
    body('specialties').optional().isArray().withMessage('Specialties must be an array')
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

        // Check if user is updating their own profile or is admin
        if (user._id.toString() !== req.user._id.toString() && !req.user.isAdmin) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to update this profile'
            });
        }

        // Update allowed fields
        const allowedFields = [
            'name', 'bio', 'location', 'website', 'company', 'jobTitle',
            'experience', 'skills', 'interests', 'specialties', 'socialLinks'
        ];

        allowedFields.forEach(field => {
            if (req.body[field] !== undefined) {
                user[field] = req.body[field];
            }
        });

        await user.save();

        res.json({
            success: true,
            message: 'Profile updated successfully',
            data: { user: user.getPublicProfile() }
        });
    } catch (error) {
        console.error('Update user error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while updating profile'
        });
    }
});

// @desc    Update user preferences
// @route   PUT /api/users/:id/preferences
// @access  Private
router.put('/:id/preferences', protect, [
    body('emailNotifications').optional().isBoolean().withMessage('Email notifications must be boolean'),
    body('eventNotifications').optional().isBoolean().withMessage('Event notifications must be boolean'),
    body('newsletter').optional().isBoolean().withMessage('Newsletter must be boolean'),
    body('privacy.profileVisibility').optional().isIn(['public', 'community', 'private']).withMessage('Invalid profile visibility'),
    body('privacy.showEmail').optional().isBoolean().withMessage('Show email must be boolean'),
    body('privacy.showLocation').optional().isBoolean().withMessage('Show location must be boolean')
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

        // Check if user is updating their own preferences or is admin
        if (user._id.toString() !== req.user._id.toString() && !req.user.isAdmin) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to update these preferences'
            });
        }

        // Update preferences
        if (req.body.emailNotifications !== undefined) {
            user.preferences.emailNotifications = req.body.emailNotifications;
        }
        if (req.body.eventNotifications !== undefined) {
            user.preferences.eventNotifications = req.body.eventNotifications;
        }
        if (req.body.newsletter !== undefined) {
            user.preferences.newsletter = req.body.newsletter;
        }
        if (req.body.privacy) {
            Object.keys(req.body.privacy).forEach(key => {
                if (req.body.privacy[key] !== undefined) {
                    user.preferences.privacy[key] = req.body.privacy[key];
                }
            });
        }

        await user.save();

        res.json({
            success: true,
            message: 'Preferences updated successfully',
            data: { preferences: user.preferences }
        });
    } catch (error) {
        console.error('Update preferences error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while updating preferences'
        });
    }
});

// @desc    Change password
// @route   PUT /api/users/:id/password
// @access  Private
router.put('/:id/password', protect, [
    body('currentPassword').notEmpty().withMessage('Current password is required'),
    body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters')
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

        const user = await User.findById(req.params.id).select('+password');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Check if user is changing their own password or is admin
        if (user._id.toString() !== req.user._id.toString() && !req.user.isAdmin) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to change this password'
            });
        }

        // Verify current password
        const isCurrentPasswordValid = await user.comparePassword(req.body.currentPassword);
        if (!isCurrentPasswordValid) {
            return res.status(400).json({
                success: false,
                message: 'Current password is incorrect'
            });
        }

        // Update password
        user.password = req.body.newPassword;
        await user.save();

        res.json({
            success: true,
            message: 'Password changed successfully'
        });
    } catch (error) {
        console.error('Change password error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while changing password'
        });
    }
});

// @desc    Deactivate user account
// @route   PUT /api/users/:id/deactivate
// @access  Private
router.put('/:id/deactivate', protect, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Check if user is deactivating their own account or is admin
        if (user._id.toString() !== req.user._id.toString() && !req.user.isAdmin) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to deactivate this account'
            });
        }

        user.isActive = false;
        await user.save();

        res.json({
            success: true,
            message: 'Account deactivated successfully'
        });
    } catch (error) {
        console.error('Deactivate user error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while deactivating account'
        });
    }
});

// @desc    Get user's events
// @route   GET /api/users/:id/events
// @access  Public
router.get('/:id/events', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        const Event = require('../models/Event');
        const events = await Event.find({
            organizer: user._id,
            status: 'Published'
        })
            .populate('organizer', 'name avatar')
            .sort({ startDate: 1 });

        res.json({
            success: true,
            data: { events }
        });
    } catch (error) {
        console.error('Get user events error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching user events'
        });
    }
});

// @desc    Get user's event registrations
// @route   GET /api/users/:id/registrations
// @access  Private
router.get('/:id/registrations', protect, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Check if user is viewing their own registrations or is admin
        if (user._id.toString() !== req.user._id.toString() && !req.user.isAdmin) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to view these registrations'
            });
        }

        const EventRegistration = require('../models/EventRegistration');
        const registrations = await EventRegistration.getUserRegistrations(user._id, {
            status: req.query.status
        });

        res.json({
            success: true,
            data: { registrations }
        });
    } catch (error) {
        console.error('Get user registrations error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching user registrations'
        });
    }
});

// @desc    Search users
// @route   GET /api/users/search
// @access  Public
router.get('/search', [
    query('q').notEmpty().withMessage('Search query is required'),
    query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    query('limit').optional().isInt({ min: 1, max: 20 }).withMessage('Limit must be between 1 and 20')
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
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const users = await User.find({
            $or: [
                { name: { $regex: req.query.q, $options: 'i' } },
                { username: { $regex: req.query.q, $options: 'i' } },
                { skills: { $in: [new RegExp(req.query.q, 'i')] } },
                { specialties: { $in: [new RegExp(req.query.q, 'i')] } }
            ],
            isActive: true,
            'preferences.privacy.profileVisibility': { $ne: 'private' }
        })
            .select('name username avatar bio location skills specialties company jobTitle')
            .sort({ profileViews: -1 })
            .skip(skip)
            .limit(limit);

        const total = await User.countDocuments({
            $or: [
                { name: { $regex: req.query.q, $options: 'i' } },
                { username: { $regex: req.query.q, $options: 'i' } },
                { skills: { $in: [new RegExp(req.query.q, 'i')] } },
                { specialties: { $in: [new RegExp(req.query.q, 'i')] } }
            ],
            isActive: true,
            'preferences.privacy.profileVisibility': { $ne: 'private' }
        });

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
        console.error('Search users error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while searching users'
        });
    }
});

module.exports = router;
