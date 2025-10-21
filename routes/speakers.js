const express = require('express');
const mongoose = require('mongoose');
const { body, validationResult } = require('express-validator');
const Speaker = require('../models/Speaker');
const Event = require('../models/Event');
const { protect, isAdmin } = require('../middleware/auth');
const { sendEmail } = require('../utils/email');

const router = express.Router();

// @desc    Apply as a speaker
// @route   POST /api/speakers/apply
// @access  Public
router.post('/apply', [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Please enter a valid email address'),
    body('organization').trim().notEmpty().withMessage('Organization is required'),
    body('expertise').isArray({ min: 1 }).withMessage('At least one expertise area is required'),
    body('bio').trim().isLength({ min: 50 }).withMessage('Bio must be at least 50 characters'),
    body('phone').optional().isLength({ min: 10, max: 20 }).withMessage('Phone number must be between 10-20 characters'),
    body('topics').optional().isArray(),
    body('linkedin').optional().isURL().withMessage('LinkedIn must be a valid URL'),
    body('twitter').optional().isURL().withMessage('Twitter must be a valid URL'),
    body('website').optional().isURL().withMessage('Website must be a valid URL')
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

        const {
            name,
            email,
            phone,
            organization,
            position,
            expertise,
            topics,
            bio,
            shortDescription,
            profilePicture,
            portfolio,
            linkedin,
            twitter,
            website,
            previousSpeakingExperience,
            availability,
            specialRequirements,
            eventId
        } = req.body;

        // Check if speaker already applied
        const existingSpeaker = await Speaker.findOne({ email });
        if (existingSpeaker) {
            return res.status(400).json({
                success: false,
                message: 'You have already applied as a speaker. We will review your application soon.'
            });
        }

        // Create new speaker application
        const speaker = new Speaker({
            name,
            email,
            phone,
            organization,
            position,
            expertise,
            topics,
            bio,
            shortDescription,
            profilePicture,
            portfolio,
            linkedin,
            twitter,
            website,
            previousSpeakingExperience,
            availability,
            specialRequirements,
            eventId,
            applicationType: 'self_application',
            status: 'pending'
        });

        await speaker.save();

        // Send confirmation email to speaker (optional - don't fail if email fails)
        if (process.env.EMAIL_HOST && process.env.EMAIL_USER && process.env.EMAIL_PASS) {
            try {
                await sendEmail({
                    email: email,
                    template: 'speakerApplicationConfirmation',
                    data: {
                        name,
                        organization,
                        appliedAt: new Date().toLocaleDateString(),
                        supportEmail: process.env.EMAIL_FROM || 'support@trizenventures.com'
                    }
                });
                console.log(`✅ Speaker application confirmation email sent to ${email}`);
            } catch (emailError) {
                console.error('❌ Failed to send speaker confirmation email:', emailError);
                // Don't fail the application if email fails
            }
        } else {
            console.log('⚠️ Email configuration not set - skipping confirmation email');
        }

        // Send notification to admin (optional - don't fail if email fails)
        if (process.env.EMAIL_HOST && process.env.EMAIL_USER && process.env.EMAIL_PASS) {
            try {
                await sendEmail({
                    email: process.env.EMAIL_FROM || 'support@trizenventures.com',
                    template: 'speakerApplicationNotification',
                    data: {
                        name,
                        email,
                        organization,
                        expertise,
                        bio,
                        appliedAt: new Date().toLocaleDateString(),
                        adminUrl: `${process.env.FRONTEND_URL || 'http://localhost:8081'}/admin/speakers`
                    }
                });
                console.log(`✅ Speaker application notification sent to admin`);
            } catch (emailError) {
                console.error('❌ Failed to send admin notification:', emailError);
                // Don't fail the application if email fails
            }
        } else {
            console.log('⚠️ Email configuration not set - skipping admin notification');
        }

        res.status(201).json({
            success: true,
            message: 'Speaker application submitted successfully! We will review your application and get back to you soon.',
            data: {
                speakerId: speaker._id,
                status: speaker.status
            }
        });

    } catch (error) {
        console.error('❌ Error creating speaker application:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to submit speaker application. Please try again later.'
        });
    }
});

// @desc    Get all speaker applications (Admin only)
// @route   GET /api/speakers
// @access  Private (Admin)
router.get('/', protect, isAdmin, async (req, res) => {
    try {
        const { status, eventId, page = 1, limit = 10 } = req.query;

        const filter = {};
        if (status) filter.status = status;
        if (eventId) filter.eventId = eventId;

        const speakers = await Speaker.find(filter)
            .populate('eventId', 'title date')
            .populate('reviewedBy', 'name email')
            .sort({ appliedAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await Speaker.countDocuments(filter);

        res.json({
            success: true,
            data: {
                speakers,
                pagination: {
                    current: parseInt(page),
                    pages: Math.ceil(total / limit),
                    total
                }
            }
        });

    } catch (error) {
        console.error('❌ Error fetching speakers:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch speaker applications'
        });
    }
});

// @desc    Get speaker by ID
// @route   GET /api/speakers/:id
// @access  Private (Admin)
router.get('/:id', protect, isAdmin, async (req, res) => {
    try {
        const speaker = await Speaker.findById(req.params.id)
            .populate('eventId', 'title date location')
            .populate('reviewedBy', 'name email');

        if (!speaker) {
            return res.status(404).json({
                success: false,
                message: 'Speaker application not found'
            });
        }

        res.json({
            success: true,
            data: speaker
        });

    } catch (error) {
        console.error('❌ Error fetching speaker:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch speaker application'
        });
    }
});

// @desc    Update speaker status (Admin only)
// @route   PUT /api/speakers/:id/status
// @access  Private (Admin)
router.put('/:id/status', protect, isAdmin, [
    body('status').isIn(['pending', 'approved', 'rejected', 'invited']).withMessage('Invalid status'),
    body('adminNotes').optional().isLength({ max: 500 }).withMessage('Admin notes cannot exceed 500 characters')
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

        const { status, adminNotes } = req.body;

        const speaker = await Speaker.findById(req.params.id);
        if (!speaker) {
            return res.status(404).json({
                success: false,
                message: 'Speaker application not found'
            });
        }

        speaker.status = status;
        speaker.adminNotes = adminNotes;
        speaker.reviewedAt = new Date();
        speaker.reviewedBy = req.user._id;

        await speaker.save();

        // Send status update email to speaker
        if (process.env.EMAIL_HOST && process.env.EMAIL_USER && process.env.EMAIL_PASS) {
            try {
                await sendEmail({
                    email: speaker.email,
                    template: 'speakerStatusUpdate',
                    data: {
                        name: speaker.name,
                        status,
                        adminNotes,
                        updatedAt: new Date().toLocaleDateString(),
                        supportEmail: process.env.EMAIL_FROM || 'support@trizenventures.com'
                    }
                });
                console.log(`✅ Speaker status update email sent to ${speaker.email}`);
            } catch (emailError) {
                console.error('❌ Failed to send status update email:', emailError);
            }
        }

        res.json({
            success: true,
            message: `Speaker status updated to ${status}`,
            data: speaker
        });

    } catch (error) {
        console.error('❌ Error updating speaker status:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update speaker status'
        });
    }
});

// @desc    Invite speaker (Admin only)
// @route   POST /api/speakers/invite
// @access  Private (Admin)
router.post('/invite', protect, isAdmin, [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Please enter a valid email address'),
    body('organization').trim().notEmpty().withMessage('Organization is required'),
    body('eventId').isMongoId().withMessage('Valid event ID is required'),
    body('message').optional().isLength({ max: 500 }).withMessage('Message cannot exceed 500 characters')
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

        const { name, email, organization, eventId, message } = req.body;

        // Check if event exists
        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({
                success: false,
                message: 'Event not found'
            });
        }

        // Check if speaker already exists
        let speaker = await Speaker.findOne({ email });

        if (speaker) {
            // Update existing speaker
            speaker.status = 'invited';
            speaker.eventId = eventId;
            speaker.adminNotes = message;
            speaker.reviewedAt = new Date();
            speaker.reviewedBy = req.user._id;
        } else {
            // Create new speaker invitation
            speaker = new Speaker({
                name,
                email,
                organization,
                eventId,
                applicationType: 'invitation',
                status: 'invited',
                adminNotes: message,
                reviewedAt: new Date(),
                reviewedBy: req.user._id
            });
        }

        await speaker.save();

        // Send invitation email
        if (process.env.EMAIL_HOST && process.env.EMAIL_USER && process.env.EMAIL_PASS) {
            try {
                await sendEmail({
                    email: email,
                    template: 'speakerInvitation',
                    data: {
                        name,
                        organization,
                        eventTitle: event.title,
                        eventDate: event.startDate,
                        eventLocation: event.location,
                        message,
                        invitationUrl: `${process.env.FRONTEND_URL || 'http://localhost:8081'}/speakers/apply`,
                        supportEmail: process.env.EMAIL_FROM || 'support@trizenventures.com'
                    }
                });
                console.log(`✅ Speaker invitation email sent to ${email}`);
            } catch (emailError) {
                console.error('❌ Failed to send speaker invitation:', emailError);
            }
        }

        res.status(201).json({
            success: true,
            message: 'Speaker invitation sent successfully',
            data: {
                speakerId: speaker._id,
                status: speaker.status
            }
        });

    } catch (error) {
        console.error('❌ Error sending speaker invitation:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to send speaker invitation'
        });
    }
});

// @desc    Get approved speakers for an event
// @route   GET /api/speakers/event/:eventId
// @access  Public
router.get('/event/:eventId', async (req, res) => {
    try {
        const speakers = await Speaker.find({
            eventId: req.params.eventId,
            status: 'approved'
        }).select('name organization position expertise bio profilePicture linkedin twitter website');

        res.json({
            success: true,
            data: speakers
        });

    } catch (error) {
        console.error('❌ Error fetching event speakers:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch event speakers'
        });
    }
});

module.exports = router;
