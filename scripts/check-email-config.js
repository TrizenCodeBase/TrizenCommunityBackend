const fs = require('fs');
const path = require('path');

console.log('🔍 Email Configuration Checker');
console.log('');

// Check if .env file exists
const envPath = path.join(__dirname, '..', '.env');
if (!fs.existsSync(envPath)) {
    console.log('❌ .env file not found!');
    console.log('Please create a .env file in the TrizenCommunityBackend directory.');
    return;
}

// Read .env file
const envContent = fs.readFileSync(envPath, 'utf8');
const lines = envContent.split('\n');

console.log('📧 Current email configuration:');
console.log('');

let emailHost = 'Not set';
let emailUser = 'Not set';
let emailPass = 'Not set';
let emailFrom = 'Not set';

lines.forEach(line => {
    if (line.startsWith('EMAIL_HOST=')) {
        emailHost = line.split('=')[1] || 'Not set';
    } else if (line.startsWith('EMAIL_USER=')) {
        emailUser = line.split('=')[1] || 'Not set';
    } else if (line.startsWith('EMAIL_PASS=')) {
        emailPass = line.split('=')[1] || 'Not set';
    } else if (line.startsWith('EMAIL_FROM=')) {
        emailFrom = line.split('=')[1] || 'Not set';
    }
});

console.log(`   - EMAIL_HOST: ${emailHost}`);
console.log(`   - EMAIL_USER: ${emailUser}`);
console.log(`   - EMAIL_FROM: ${emailFrom}`);
console.log(`   - EMAIL_PASS: ${emailPass === 'your_microsoft_password_here' ? '❌ Still using placeholder!' : emailPass === 'Not set' ? '❌ Not set!' : '✅ Set (hidden)'}`);
console.log('');

if (emailPass === 'your_microsoft_password_here' || emailPass === 'Not set') {
    console.log('❌ EMAIL_PASS is not configured correctly!');
    console.log('');
    console.log('🔧 To fix this:');
    console.log('1. Open the .env file in your backend directory');
    console.log('2. Find the line: EMAIL_PASS=your_microsoft_password_here');
    console.log('3. Replace "your_microsoft_password_here" with your actual Microsoft password');
    console.log('');
    console.log('📖 For Microsoft Outlook:');
    console.log('   - Use your regular Microsoft account password');
    console.log('   - OR create an App Password if you have 2FA enabled');
    console.log('');
    console.log('🔍 To create an App Password:');
    console.log('   1. Go to https://account.microsoft.com/security');
    console.log('   2. Sign in with your Microsoft account');
    console.log('   3. Go to "Security" → "Advanced security options"');
    console.log('   4. Under "App passwords", create a new app password');
    console.log('   5. Use that app password in the .env file');
} else {
    console.log('✅ Email configuration looks correct!');
    console.log('If emails are still not working, the password might be incorrect.');
    console.log('Try updating the EMAIL_PASS with your actual Microsoft password.');
}

console.log('');
console.log('🔄 After updating the password:');
console.log('1. Save the .env file');
console.log('2. Restart the server: node server.js');
console.log('3. Test the contact form');


