const fs = require('fs');
const path = require('path');

// Create .env file with email configuration
const envContent = `# Server Configuration
NODE_ENV=development
PORT=5000
HOST=localhost

# Database Configuration
MONGODB_URI=mongodb+srv://yashasaiganeeb9:yashasaiganeeb9@cluster0.8jqjq.mongodb.net/trizen_community?retryWrites=true&w=majority
DB_NAME=trizen_community

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here_trizen_community_2025
JWT_EXPIRE=7d
JWT_REFRESH_SECRET=your_refresh_secret_key_here_trizen_community_2025
JWT_REFRESH_EXPIRE=30d

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=support@trizenventures.com
EMAIL_PASS=your_gmail_app_password_here
EMAIL_FROM=support@trizenventures.com

# Cloudinary Configuration (for image uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# OAuth Configuration
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
LINKEDIN_CLIENT_ID=your_linkedin_client_id
LINKEDIN_CLIENT_SECRET=your_linkedin_client_secret

# Session Configuration
SESSION_SECRET=your_session_secret_key_here_trizen_community_2025

# Frontend URL
FRONTEND_URL=https://community.trizenventures.com

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# File Upload Limits
MAX_FILE_SIZE=5242880
ALLOWED_FILE_TYPES=image/jpeg,image/png,image/gif,image/webp

# Security
BCRYPT_ROUNDS=12
CORS_ORIGIN=https://community.trizenventures.com`;

try {
    fs.writeFileSync(path.join(__dirname, '..', '.env'), envContent);
    console.log('✅ .env file created successfully!');
    console.log('📧 Email configuration added:');
    console.log('   - EMAIL_HOST: smtp.gmail.com');
    console.log('   - EMAIL_USER: support@trizenventures.com');
    console.log('   - EMAIL_FROM: support@trizenventures.com');
    console.log('');
    console.log('🔧 Next steps:');
    console.log('1. Get a Gmail App Password for support@trizenventures.com');
    console.log('2. Replace "your_gmail_app_password_here" with the actual app password');
    console.log('3. Restart the server');
    console.log('');
    console.log('📖 How to get Gmail App Password:');
    console.log('1. Go to Google Account settings');
    console.log('2. Security → 2-Step Verification (enable if not already)');
    console.log('3. Security → App passwords');
    console.log('4. Generate a new app password for "Mail"');
    console.log('5. Copy the 16-character password and replace in .env file');
} catch (error) {
    console.error('❌ Error creating .env file:', error.message);
}

