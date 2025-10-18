const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
require('dotenv').config();

// Initialize Express app
const app = express();

// Security middleware
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
            fontSrc: ["'self'", "https://fonts.gstatic.com"],
            imgSrc: ["'self'", "data:", "https:", "blob:"],
            scriptSrc: ["'self'"],
            connectSrc: ["'self'", "ws:", "wss:"]
        }
    }
}));

// Rate limiting
const limiter = rateLimit({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // limit each IP to 100 requests per windowMs
    message: {
        error: 'Too many requests from this IP, please try again later.'
    },
    standardHeaders: true,
    legacyHeaders: false,
});

app.use('/api/', limiter);

// CORS configuration
app.use(cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Compression middleware
app.use(compression());

// Logging middleware
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
} else {
    app.use(morgan('combined'));
}

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'Trizen Community API is running',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV
    });
});

// Test authentication endpoints (without database)
app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;
    
    // Simple test login
    if (email === 'test@example.com' && password === 'password123') {
        res.json({
            success: true,
            message: 'Login successful',
            data: {
                user: {
                    _id: 'test-user-id',
                    name: 'Test User',
                    email: 'test@example.com',
                    avatar: null,
                    isEmailVerified: true,
                    isAdmin: false,
                    isModerator: false,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                },
                token: 'test-jwt-token-12345'
            }
        });
    } else {
        res.status(401).json({
            success: false,
            message: 'Invalid credentials'
        });
    }
});

app.post('/api/auth/register', (req, res) => {
    const { name, email, password } = req.body;
    
    // Simple test registration
    res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: {
            user: {
                _id: 'new-user-id',
                name: name,
                email: email,
                avatar: null,
                isEmailVerified: false,
                isAdmin: false,
                isModerator: false,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            },
            token: 'new-jwt-token-67890'
        }
    });
});

app.get('/api/auth/me', (req, res) => {
    // Simple test for getting current user
    res.json({
        success: true,
        data: {
            user: {
                _id: 'test-user-id',
                name: 'Test User',
                email: 'test@example.com',
                avatar: null,
                isEmailVerified: true,
                isAdmin: false,
                isModerator: false,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            }
        }
    });
});

app.post('/api/auth/logout', (req, res) => {
    res.json({
        success: true,
        message: 'Logged out successfully'
    });
});

// Start server
const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || 'localhost';

app.listen(PORT, HOST, () => {
    console.log(`🚀 Test Server running on ${HOST}:${PORT}`);
    console.log(`📊 Environment: ${process.env.NODE_ENV}`);
    console.log(`🌐 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
    console.log(`\n📝 Test credentials:`);
    console.log(`   Email: test@example.com`);
    console.log(`   Password: password123`);
});

module.exports = app;
