const fs = require('fs');
const path = require('path');

console.log('🔧 Email Password Update Helper');
console.log('');
console.log('📧 Current email configuration:');
console.log('   - EMAIL_HOST: smtp-mail.outlook.com');
console.log('   - EMAIL_USER: support@trizenventures.com');
console.log('   - EMAIL_FROM: support@trizenventures.com');
console.log('');
console.log('❌ The current password is not working!');
console.log('');
console.log('🔧 To fix this, you need to:');
console.log('');
console.log('1. Open the .env file in your backend directory');
console.log('2. Find the line: EMAIL_PASS=your_microsoft_password_here');
console.log('3. Replace "your_microsoft_password_here" with your actual Microsoft password');
console.log('');
console.log('📖 For Microsoft Outlook, you need:');
console.log('   - Your actual Microsoft account password');
console.log('   - OR an App Password (if 2FA is enabled)');
console.log('');
console.log('🔍 To get an App Password:');
console.log('   1. Go to https://account.microsoft.com/security');
console.log('   2. Sign in with your Microsoft account');
console.log('   3. Go to "Security" → "Advanced security options"');
console.log('   4. Under "App passwords", create a new app password');
console.log('   5. Use that app password in the .env file');
console.log('');
console.log('📝 Example .env file update:');
console.log('   EMAIL_PASS=your_actual_password_here');
console.log('');
console.log('⚠️  After updating the password, restart the server!');


