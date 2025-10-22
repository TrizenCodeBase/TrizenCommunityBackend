const express = require('express');
const router = express.Router();
const User = require('../models/User');

// @desc    Direct unsubscribe page (no frontend required)
// @route   GET /unsubscribe/:token
// @access  Public
router.get('/:token', async (req, res) => {
    try {
        const { token } = req.params;

        if (!token) {
            return res.status(400).send(`
                <!DOCTYPE html>
                <html>
                <head>
                    <title>Invalid Unsubscribe Link</title>
                    <style>
                        body { font-family: Arial, sans-serif; text-align: center; padding: 50px; background-color: #f5f5f5; }
                        .container { max-width: 500px; margin: 0 auto; background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
                        .error { color: #dc3545; }
                        .success { color: #28a745; }
                        .btn { background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; display: inline-block; margin: 10px; }
                        .btn:hover { background-color: #0056b3; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <h1 class="error">Invalid Unsubscribe Link</h1>
                        <p>The unsubscribe link you clicked is invalid or has expired.</p>
                        <a href="/" class="btn">Go to Homepage</a>
                    </div>
                </body>
                </html>
            `);
        }

        const user = await User.findBySubscriptionToken(token);

        if (!user) {
            return res.status(404).send(`
                <!DOCTYPE html>
                <html>
                <head>
                    <title>User Not Found</title>
                    <style>
                        body { font-family: Arial, sans-serif; text-align: center; padding: 50px; background-color: #f5f5f5; }
                        .container { max-width: 500px; margin: 0 auto; background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
                        .error { color: #dc3545; }
                        .btn { background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; display: inline-block; margin: 10px; }
                        .btn:hover { background-color: #0056b3; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <h1 class="error">User Not Found</h1>
                        <p>We couldn't find a user associated with this unsubscribe link.</p>
                        <a href="/" class="btn">Go to Homepage</a>
                    </div>
                </body>
                </html>
            `);
        }

        // Unsubscribe the user
        await user.unsubscribe();

        return res.send(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Successfully Unsubscribed</title>
                <style>
                    body { font-family: Arial, sans-serif; text-align: center; padding: 50px; background-color: #f5f5f5; }
                    .container { max-width: 500px; margin: 0 auto; background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
                    .success { color: #28a745; }
                    .info { background-color: #d1ecf1; border: 1px solid #bee5eb; padding: 15px; border-radius: 4px; margin: 20px 0; }
                    .btn { background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; display: inline-block; margin: 10px; }
                    .btn:hover { background-color: #0056b3; }
                    .btn-secondary { background-color: #6c757d; }
                    .btn-secondary:hover { background-color: #545b62; }
                </style>
            </head>
            <body>
                <div class="container">
                    <h1 class="success">✓ Successfully Unsubscribed</h1>
                    <p><strong>${user.name}</strong> (${user.email}) has been unsubscribed from email updates.</p>
                    
                    <div class="info">
                        <h3>What happens next?</h3>
                        <ul style="text-align: left; margin: 10px 0;">
                            <li>You will no longer receive promotional emails</li>
                            <li>You may still receive important account-related emails</li>
                            <li>You can resubscribe anytime from your account settings</li>
                        </ul>
                    </div>
                    
                    <p>Thank you for being part of the Trizen Community!</p>
                    
                    <a href="https://trizenventures.com" class="btn">Visit Our Website</a>
                    <a href="mailto:support@trizenventures.com" class="btn btn-secondary">Contact Support</a>
                </div>
            </body>
            </html>
        `);

    } catch (error) {
        console.error('Direct unsubscribe error:', error);
        return res.status(500).send(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Error</title>
                <style>
                    body { font-family: Arial, sans-serif; text-align: center; padding: 50px; background-color: #f5f5f5; }
                    .container { max-width: 500px; margin: 0 auto; background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
                    .error { color: #dc3545; }
                    .btn { background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; display: inline-block; margin: 10px; }
                    .btn:hover { background-color: #0056b3; }
                </style>
            </head>
            <body>
                <div class="container">
                    <h1 class="error">Something went wrong</h1>
                    <p>We encountered an error while processing your unsubscribe request.</p>
                    <p>Please try again later or contact our support team.</p>
                    <a href="mailto:support@trizenventures.com" class="btn">Contact Support</a>
                </div>
            </body>
            </html>
        `);
    }
});

module.exports = router;

