const express = require('express');
const passport = require('passport');
const { body, validationResult } = require('express-validator');
const crypto = require('crypto');
const User = require('../models/User');
const OTP = require('../models/OTP');
const { protect } = require('../middleware/auth');
const { sendEmail } = require('../utils/email');

const router = express.Router();

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
router.post('/register', [
    body('name').trim().isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters'),
    body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('username').optional().isLength({ min: 3, max: 20 }).withMessage('Username must be between 3 and 20 characters')
], async (req, res) => {
    try {
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: errors.array()
            });
        }

        const { name, email, password, username } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({
            $or: [{ email }, ...(username ? [{ username }] : [])]
        });

        if (existingUser) {
            // If email exists but not verified, allow resending OTP
            if (existingUser.email === email && !existingUser.isEmailVerified) {
                // Regenerate and resend OTP for unverified email
                try {
                    const otpDoc = await OTP.createOTP(email, 'email_verification');

                    await sendEmail({
                        email: existingUser.email,
                        subject: 'Your Verification Code - Trizen Community',
                        template: 'otpVerification',
                        data: {
                            name: existingUser.name,
                            otp: otpDoc.otp,
                            type: 'email_verification'
                        },
                        checkSubscription: false
                    });

                    return res.status(200).json({
                        success: true,
                        message: 'Email already registered but not verified. A new verification code has been sent to your email.',
                        data: {
                            user: existingUser.getPublicProfile(),
                            requiresVerification: true
                        }
                    });
                } catch (emailError) {
                    console.error('Email sending failed:', emailError);
                    return res.status(200).json({
                        success: true,
                        message: 'Email already registered but not verified. Please try to login to resend verification code.',
                        data: {
                            user: existingUser.getPublicProfile(),
                            requiresVerification: true
                        }
                    });
                }
            }

            // Email is verified or username exists
            return res.status(400).json({
                success: false,
                message: existingUser.email === email ? 'Email already exists and is verified. Please login.' : 'Username already exists'
            });
        }

        // Create user (unverified initially)
        const user = new User({
            name,
            email,
            password,
            username,
            isEmailVerified: false
        });

        await user.save();

        // Generate and send OTP
        try {
            const otpDoc = await OTP.createOTP(email, 'email_verification');

            await sendEmail({
                email: user.email,
                subject: 'Your Verification Code - Trizen Community',
                template: 'otpVerification',
                data: {
                    name: user.name,
                    otp: otpDoc.otp,
                    type: 'email_verification'
                },
                checkSubscription: false
            });

            res.status(201).json({
                success: true,
                message: 'User registered successfully. Please check your email for the verification code.',
                data: {
                    user: user.getPublicProfile(),
                    requiresVerification: true
                }
            });
        } catch (emailError) {
            console.error('Email sending failed:', emailError);
            // Don't delete the user if email fails - just log the error
            // await User.deleteOne({ _id: user._id });

            res.status(201).json({
                success: true,
                message: 'User registered successfully. Please check your email for the verification code.',
                data: {
                    user: user.getPublicProfile(),
                    requiresVerification: true
                }
            });
        }
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during registration'
        });
    }
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
router.post('/login', [
    body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
    body('password').notEmpty().withMessage('Password is required')
], async (req, res) => {
    try {
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: errors.array()
            });
        }

        const { email, password } = req.body;

        // Find user and include password for comparison
        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Check if user is active
        if (!user.isActive) {
            return res.status(401).json({
                success: false,
                message: 'Account is deactivated'
            });
        }

        // Check if email is verified
        if (!user.isEmailVerified) {
            return res.status(401).json({
                success: false,
                message: 'Please verify your email before logging in',
                requiresVerification: true,
                email: user.email
            });
        }

        // Check password
        const isPasswordValid = await user.comparePassword(password);

        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Update login info
        user.lastLogin = new Date();
        user.loginCount += 1;
        await user.save();

        // Generate token
        const token = user.generateAuthToken();

        res.json({
            success: true,
            message: 'Login successful',
            data: {
                user: user.getPublicProfile(),
                token
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during login'
        });
    }
});

// @desc    Verify email with OTP
// @route   POST /api/auth/verify-email
// @access  Public
router.post('/verify-email', [
    body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
    body('otp').isLength({ min: 6, max: 6 }).withMessage('OTP must be 6 digits')
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

        const { email, otp } = req.body;

        // Verify OTP
        const otpResult = await OTP.verifyOTP(email, otp, 'email_verification');

        if (!otpResult.success) {
            // Increment attempts for failed verification
            await OTP.incrementAttempts(email, otp, 'email_verification');

            return res.status(400).json({
                success: false,
                message: otpResult.message
            });
        }

        // Update user email verification status
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        user.isEmailVerified = true;
        await user.save();

        // Generate token for verified user
        const token = user.generateAuthToken();

        res.json({
            success: true,
            message: 'Email verified successfully',
            data: {
                user: user.getPublicProfile(),
                token
            }
        });
    } catch (error) {
        console.error('Email verification error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during email verification'
        });
    }
});

// @desc    Resend OTP for email verification
// @route   POST /api/auth/resend-otp
// @access  Public
router.post('/resend-otp', [
    body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
    body('type').isIn(['email_verification', 'password_reset']).withMessage('Invalid OTP type')
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

        const { email, type } = req.body;

        // Check if user exists for email verification
        if (type === 'email_verification') {
            const user = await User.findOne({ email });
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'User not found'
                });
            }

            if (user.isEmailVerified) {
                return res.status(400).json({
                    success: false,
                    message: 'Email is already verified'
                });
            }
        }

        // Generate and send new OTP
        const otpDoc = await OTP.createOTP(email, type);

        const user = await User.findOne({ email });
        const name = user ? user.name : 'User';

        await sendEmail({
            email,
            subject: 'Your Verification Code - Trizen Community',
            template: 'otpVerification',
            data: {
                name,
                otp: otpDoc.otp,
                type
            },
            checkSubscription: false
        });

        res.json({
            success: true,
            message: 'Verification code sent successfully'
        });
    } catch (error) {
        console.error('Resend OTP error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during OTP resend'
        });
    }
});

// @desc    Forgot password
// @route   POST /api/auth/forgot-password
// @access  Public
router.post('/forgot-password', [
    body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email')
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

        const { email } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'No user found with this email'
            });
        }

        // Generate and send OTP for password reset
        try {
            const otpDoc = await OTP.createOTP(email, 'password_reset');

            await sendEmail({
                email: user.email,
                subject: 'Your Password Reset Code - Trizen Community',
                template: 'otpVerification',
                data: {
                    name: user.name,
                    otp: otpDoc.otp,
                    type: 'password_reset'
                },
                checkSubscription: false
            });

            res.json({
                success: true,
                message: 'Password reset code sent to your email'
            });
        } catch (emailError) {
            console.error('Email sending failed:', emailError);

            return res.status(500).json({
                success: false,
                message: 'Email could not be sent'
            });
        }
    } catch (error) {
        console.error('Forgot password error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during password reset'
        });
    }
});

// @desc    Reset password with OTP
// @route   POST /api/auth/reset-password
// @access  Public
router.post('/reset-password', [
    body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
    body('otp').isLength({ min: 6, max: 6 }).withMessage('OTP must be 6 digits'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
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

        const { email, otp, password } = req.body;

        // Verify OTP
        const otpResult = await OTP.verifyOTP(email, otp, 'password_reset');

        if (!otpResult.success) {
            // Increment attempts for failed verification
            await OTP.incrementAttempts(email, otp, 'password_reset');

            return res.status(400).json({
                success: false,
                message: otpResult.message
            });
        }

        // Find user and update password
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        user.password = password;
        await user.save();

        res.json({
            success: true,
            message: 'Password reset successfully'
        });
    } catch (error) {
        console.error('Reset password error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during password reset'
        });
    }
});

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
router.get('/me', protect, async (req, res) => {
    try {
        res.json({
            success: true,
            data: {
                user: req.user.getPublicProfile()
            }
        });
    } catch (error) {
        console.error('Get current user error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
router.post('/logout', protect, async (req, res) => {
    try {
        // In a more complex setup, you might want to blacklist the token
        res.json({
            success: true,
            message: 'Logged out successfully'
        });
    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during logout'
        });
    }
});

// Google OAuth routes
router.get('/google', passport.authenticate('google', {
    scope: ['profile', 'email']
}));

router.get('/google/callback',
    passport.authenticate('google', { failureRedirect: `${process.env.FRONTEND_URL}/login?error=oauth_failed` }),
    (req, res) => {
        const token = req.user.generateAuthToken();
        res.redirect(`${process.env.FRONTEND_URL}/auth/callback?token=${token}`);
    }
);

// GitHub OAuth routes
router.get('/github', passport.authenticate('github', {
    scope: ['user:email']
}));

router.get('/github/callback',
    passport.authenticate('github', { failureRedirect: `${process.env.FRONTEND_URL}/login?error=oauth_failed` }),
    (req, res) => {
        const token = req.user.generateAuthToken();
        res.redirect(`${process.env.FRONTEND_URL}/auth/callback?token=${token}`);
    }
);

// LinkedIn OAuth routes
router.get('/linkedin', passport.authenticate('linkedin'));

router.get('/linkedin/callback',
    passport.authenticate('linkedin', { failureRedirect: `${process.env.FRONTEND_URL}/login?error=oauth_failed` }),
    (req, res) => {
        const token = req.user.generateAuthToken();
        res.redirect(`${process.env.FRONTEND_URL}/auth/callback?token=${token}`);
    }
);

module.exports = router;
