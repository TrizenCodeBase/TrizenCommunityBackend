const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect } = require('../middleware/auth');

// @desc    Subscribe to email updates
// @route   POST /api/subscriptions/subscribe
// @access  Private
router.post('/subscribe', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        await user.subscribe();

        res.json({
            success: true,
            message: 'Successfully subscribed to email updates',
            isSubscribed: user.isSubscribed
        });
    } catch (error) {
        console.error('Subscribe error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to subscribe to email updates'
        });
    }
});

// @desc    Unsubscribe from email updates
// @route   POST /api/subscriptions/unsubscribe
// @access  Private
router.post('/unsubscribe', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        await user.unsubscribe();

        res.json({
            success: true,
            message: 'Successfully unsubscribed from email updates',
            isSubscribed: user.isSubscribed
        });
    } catch (error) {
        console.error('Unsubscribe error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to unsubscribe from email updates'
        });
    }
});

// @desc    Unsubscribe via token (from email link)
// @route   GET /api/subscriptions/unsubscribe/:token
// @access  Public
router.get('/unsubscribe/:token', async (req, res) => {
    try {
        const { token } = req.params;

        const user = await User.findBySubscriptionToken(token);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Invalid unsubscribe link'
            });
        }

        await user.unsubscribe();

        res.json({
            success: true,
            message: 'Successfully unsubscribed from email updates',
            user: {
                name: user.name,
                email: user.email
            }
        });
    } catch (error) {
        console.error('Token unsubscribe error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to unsubscribe from email updates'
        });
    }
});

// @desc    Subscribe via token (from email link)
// @route   GET /api/subscriptions/subscribe/:token
// @access  Public
router.get('/subscribe/:token', async (req, res) => {
    try {
        const { token } = req.params;

        const user = await User.findBySubscriptionToken(token);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Invalid subscribe link'
            });
        }

        await user.subscribe();

        res.json({
            success: true,
            message: 'Successfully subscribed to email updates',
            user: {
                name: user.name,
                email: user.email
            }
        });
    } catch (error) {
        console.error('Token subscribe error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to subscribe to email updates'
        });
    }
});

// @desc    Get subscription status
// @route   GET /api/subscriptions/status
// @access  Private
router.get('/status', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('isSubscribed subscriptionPreferences');
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.json({
            success: true,
            data: {
                isSubscribed: user.isSubscribed,
                preferences: user.subscriptionPreferences
            }
        });
    } catch (error) {
        console.error('Get subscription status error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get subscription status'
        });
    }
});

// @desc    Subscribe guest email (non-authenticated)
// @route   POST /api/subscriptions/guest
// @access  Public
router.post('/guest', async (req, res) => {
    try {
        const { email } = req.body;

        if (!email || !email.match(/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/)) {
            return res.status(400).json({
                success: false,
                message: 'Please provide a valid email address'
            });
        }

        // Check if user already exists with this email
        const existingUser = await User.findOne({ email: email.toLowerCase() });

        if (existingUser) {
            // If user exists, subscribe them
            await existingUser.subscribe();
            return res.json({
                success: true,
                message: 'Successfully subscribed to email updates',
                isSubscribed: existingUser.isSubscribed
            });
        }

        // For guest subscriptions, we could:
        // 1. Create a guest user record
        // 2. Store in a separate guest subscriptions collection
        // 3. Send a welcome email

        // For now, we'll just return success
        // In a real implementation, you might want to store guest emails
        res.json({
            success: true,
            message: 'Thanks for subscribing! We\'ll send updates to your email.',
            email: email
        });
    } catch (error) {
        console.error('Guest subscription error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to subscribe to email updates'
        });
    }
});

// @desc    Update subscription preferences
// @route   PUT /api/subscriptions/preferences
// @access  Private
router.put('/preferences', protect, async (req, res) => {
    try {
        const { eventUpdates, newsletter, promotional } = req.body;

        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Update preferences
        if (eventUpdates !== undefined) {
            user.subscriptionPreferences.eventUpdates = eventUpdates;
        }
        if (newsletter !== undefined) {
            user.subscriptionPreferences.newsletter = newsletter;
        }
        if (promotional !== undefined) {
            user.subscriptionPreferences.promotional = promotional;
        }

        await user.save();

        res.json({
            success: true,
            message: 'Subscription preferences updated successfully',
            data: {
                isSubscribed: user.isSubscribed,
                preferences: user.subscriptionPreferences
            }
        });
    } catch (error) {
        console.error('Update preferences error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update subscription preferences'
        });
    }
});

module.exports = router;
