const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const LinkedInStrategy = require('passport-linkedin-oauth2').Strategy;
const User = require('../models/User');

// Serialize user for session
passport.serializeUser((user, done) => {
    done(null, user._id);
});

// Deserialize user from session
passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});

// Google OAuth Strategy
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "/api/auth/google/callback"
    },
        async (accessToken, refreshToken, profile, done) => {
            try {
                // Check if user already exists
                let user = await User.findOne({
                    $or: [
                        { googleId: profile.id },
                        { email: profile.emails[0].value }
                    ]
                });

                if (user) {
                    // Update Google ID if not present
                    if (!user.googleId) {
                        user.googleId = profile.id;
                        await user.save();
                    }
                    return done(null, user);
                }

                // Create new user
                user = new User({
                    googleId: profile.id,
                    email: profile.emails[0].value,
                    name: profile.displayName,
                    avatar: profile.photos[0]?.value,
                    isEmailVerified: true,
                    provider: 'google'
                });

                await user.save();
                return done(null, user);
            } catch (error) {
                return done(error, null);
            }
        }));
}

// GitHub OAuth Strategy
if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
    passport.use(new GitHubStrategy({
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: "/api/auth/github/callback"
    },
        async (accessToken, refreshToken, profile, done) => {
            try {
                // Check if user already exists
                let user = await User.findOne({
                    $or: [
                        { githubId: profile.id },
                        { email: profile.emails?.[0]?.value }
                    ]
                });

                if (user) {
                    // Update GitHub ID if not present
                    if (!user.githubId) {
                        user.githubId = profile.id;
                        await user.save();
                    }
                    return done(null, user);
                }

                // Create new user
                user = new User({
                    githubId: profile.id,
                    email: profile.emails?.[0]?.value || `${profile.username}@github.local`,
                    name: profile.displayName || profile.username,
                    username: profile.username,
                    avatar: profile.photos[0]?.value,
                    isEmailVerified: !!profile.emails?.[0]?.value,
                    provider: 'github'
                });

                await user.save();
                return done(null, user);
            } catch (error) {
                return done(error, null);
            }
        }));
}

// LinkedIn OAuth Strategy
if (process.env.LINKEDIN_CLIENT_ID && process.env.LINKEDIN_CLIENT_SECRET) {
    passport.use(new LinkedInStrategy({
        clientID: process.env.LINKEDIN_CLIENT_ID,
        clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
        callbackURL: "/api/auth/linkedin/callback",
        scope: ['r_emailaddress', 'r_liteprofile']
    },
        async (accessToken, refreshToken, profile, done) => {
            try {
                // Check if user already exists
                let user = await User.findOne({
                    $or: [
                        { linkedinId: profile.id },
                        { email: profile.emails[0].value }
                    ]
                });

                if (user) {
                    // Update LinkedIn ID if not present
                    if (!user.linkedinId) {
                        user.linkedinId = profile.id;
                        await user.save();
                    }
                    return done(null, user);
                }

                // Create new user
                user = new User({
                    linkedinId: profile.id,
                    email: profile.emails[0].value,
                    name: profile.displayName,
                    avatar: profile.photos[0]?.value,
                    isEmailVerified: true,
                    provider: 'linkedin'
                });

                await user.save();
                return done(null, user);
            } catch (error) {
                return done(error, null);
            }
        }));
}

module.exports = passport;
