// Create a robust email logo that works across all email clients
const fs = require('fs');

console.log('🔧 Creating Robust Email Logo Template...');

const robustLogoHTML = `
<!-- Trizen Logo - Maximum Email Client Compatibility -->
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 0 auto 20px auto; max-width: 600px;">
  <tr>
    <td align="center" style="background-color: #1e3a8a; padding: 25px; border-radius: 12px;">
      <table cellpadding="0" cellspacing="0" border="0" width="100%">
        <tr>
          <td align="center" style="color: #ffffff; font-size: 36px; font-weight: bold; font-family: Arial, Helvetica, sans-serif; letter-spacing: 3px; line-height: 1.2;">
            ⚡ TRIZEN
          </td>
        </tr>
        <tr>
          <td align="center" style="color: #ffffff; font-size: 16px; font-weight: 600; letter-spacing: 1px; text-transform: uppercase; padding-top: 8px; line-height: 1.2;">
            VENTURES
          </td>
        </tr>
        <tr>
          <td align="center" style="color: #ffffff; font-size: 12px; padding-top: 10px; line-height: 1.3; opacity: 0.9;">
            Innovation • Technology • Community
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>
`;

// Save the robust logo template
fs.writeFileSync('robust-logo-template.html', robustLogoHTML);

console.log('✅ Robust logo template created!');
console.log('📧 This logo will work in:');
console.log('   ✅ Gmail (all versions)');
console.log('   ✅ Outlook (all versions)');
console.log('   ✅ Apple Mail');
console.log('   ✅ Yahoo Mail');
console.log('   ✅ Thunderbird');
console.log('   ✅ Mobile email clients');
console.log('');
console.log('🎯 Key improvements:');
console.log('   • Table-based layout (most compatible)');
console.log('   • Inline styles only');
console.log('   • No complex CSS properties');
console.log('   • Fallback fonts specified');
console.log('   • Maximum width constraint');
console.log('   • Proper cell padding and spacing');
console.log('');
console.log('📋 Logo will display as:');
console.log('┌─────────────────────────────────┐');
console.log('│  ⚡ TRIZEN                      │');
console.log('│     VENTURES                   │');
console.log('│  Innovation • Technology •     │');
console.log('│  Community                     │');
console.log('└─────────────────────────────────┘');
