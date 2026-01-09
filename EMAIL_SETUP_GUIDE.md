# Email Configuration Guide

## Error: Missing credentials for "PLAIN"

This error occurs when email credentials are not configured in your `.env` file. The email service requires `EMAIL_USER` and `EMAIL_PASS` to send verification emails.

## Quick Setup

### Step 1: Add Email Credentials to `.env`

Open your `.env` file in the `mansoor_app_backend` directory and add:

```env
# Required: Email credentials
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Optional: SMTP settings (defaults to Gmail)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_FROM=noreply@yourdomain.com

# Optional: Base URL for verification links
BASE_URL=http://localhost:3000
```

### Step 2: Get Gmail App Password (if using Gmail)

**Important:** You cannot use your regular Gmail password. You need to create an App Password.

1. **Enable 2-Step Verification** (if not already enabled):
   - Go to your Google Account: https://myaccount.google.com/
   - Security → 2-Step Verification → Enable

2. **Generate App Password**:
   - Go to: https://myaccount.google.com/apppasswords
   - Or: Google Account → Security → 2-Step Verification → App passwords
   - Select "Mail" as the app
   - Select "Other (Custom name)" as the device
   - Enter "Mansoor App" as the name
   - Click "Generate"
   - Copy the 16-character password (no spaces)

3. **Add to `.env`**:
   ```env
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=abcdefghijklmnop  # Use the generated App Password here
   ```

### Step 3: Restart Server

After adding credentials, restart your backend server:

```bash
# Stop the server (Ctrl+C) and restart
npm start
# or
npm run dev
```

You should see: `✅ Email service is ready to send messages`

## Alternative Email Providers

### Outlook/Hotmail
```env
EMAIL_USER=your-email@outlook.com
EMAIL_PASS=your-password
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
```

### Yahoo Mail
```env
EMAIL_USER=your-email@yahoo.com
EMAIL_PASS=your-app-password
SMTP_HOST=smtp.mail.yahoo.com
SMTP_PORT=587
```

### Custom SMTP Server
```env
EMAIL_USER=your-email@yourdomain.com
EMAIL_PASS=your-password
SMTP_HOST=smtp.yourdomain.com
SMTP_PORT=587
SMTP_FROM=noreply@yourdomain.com
```

## Testing Email Configuration

### Option 1: Check Server Startup
When you start the server, you should see:
- ✅ `Email service is ready to send messages` (if configured correctly)
- ⚠️ `Email service not configured` (if credentials missing)

### Option 2: Test Registration
Try registering a new user. Check:
- Server console for email sending status
- Your email inbox for verification email
- No email errors in console

### Option 3: Manual Test (Advanced)
Create a test script:
```javascript
// test-email.js
const { sendVerificationEmail } = require('./services/emailService');
require('dotenv').config();

sendVerificationEmail(
  'test@example.com',
  'Test User',
  'test-token-123',
  'http://localhost:3000'
).then(() => {
  console.log('✅ Email sent successfully');
  process.exit(0);
}).catch((error) => {
  console.error('❌ Error:', error.message);
  process.exit(1);
});
```

Run: `node test-email.js`

## Troubleshooting

### Error: "Missing credentials for PLAIN"
**Solution:** Make sure both `EMAIL_USER` and `EMAIL_PASS` are set in `.env`

### Error: "Invalid login"
**Solution:** 
- For Gmail: Use App Password, not your regular password
- Check that 2-Step Verification is enabled
- Make sure there are no extra spaces in `.env` file

### Error: "Connection timeout"
**Solution:**
- Check your internet connection
- Verify SMTP_HOST and SMTP_PORT are correct
- Check firewall settings

### Error: "Authentication failed"
**Solution:**
- For Gmail: Make sure you're using App Password, not account password
- Check if "Less secure app access" is required (older Gmail accounts)
- Verify credentials are correct (no typos)

### Emails Not Sending (No Error)
**Solution:**
- Check spam/junk folder
- Verify email address is correct
- Check server console for any warnings
- Make sure transporter was initialized successfully

## Development Mode (Without Email)

If you want to test without configuring email:

1. **Registration will still work** - user will be created
2. **Verification email won't be sent** - error is logged but doesn't crash
3. **User can still verify** - use resend verification endpoint with a valid token
4. **For testing**: Manually set `email_verified = true` in database for test users

### Manual Verification for Testing
```sql
-- Set email as verified for testing
UPDATE "tblUsers" 
SET email_verified = TRUE 
WHERE email = 'test@example.com';
```

## Production Setup

For production, use a proper email service:

### Recommended Services:
1. **SendGrid** - Free tier: 100 emails/day
2. **Mailgun** - Free tier: 5,000 emails/month
3. **AWS SES** - Pay as you go
4. **Postmark** - Pay per email

### Example: SendGrid
```env
EMAIL_USER=apikey
EMAIL_PASS=your-sendgrid-api-key
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
```

### Example: Mailgun
```env
EMAIL_USER=postmaster@yourdomain.mailgun.org
EMAIL_PASS=your-mailgun-password
SMTP_HOST=smtp.mailgun.org
SMTP_PORT=587
```

## Security Best Practices

⚠️ **NEVER commit `.env` file to version control!**

- Keep email credentials secure
- Use environment-specific credentials (dev/prod)
- Rotate credentials regularly
- Use App Passwords instead of account passwords
- Consider using email service API keys instead of SMTP

## Verification

After setup, verify by:
1. Registering a new user
2. Checking email inbox for verification email
3. Clicking verification link
4. Attempting to login (should work after verification)

If you see `✅ Email service is ready to send messages` on server startup, you're good to go!
