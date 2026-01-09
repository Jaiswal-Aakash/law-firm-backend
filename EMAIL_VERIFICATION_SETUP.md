# Email Verification Setup Guide

## Overview

Email verification has been implemented to ensure users verify their email addresses after signup. Users must verify their email before they can log in.

## Database Changes

✅ **New columns added to `tblUsers` table:**
- `verification_token` (VARCHAR) - Stores the verification token
- `verification_token_expiry` (TIMESTAMP) - Token expiration time (24 hours)
- `email_verified` (BOOLEAN) - Email verification status (default: false)

To apply these changes, run:
```bash
node database/add_verification_token.js
```

Or the changes will be applied automatically on next server start via `init.js`.

## Backend Implementation

### New Endpoints

1. **GET /api/users/verify-email?token={token}**
   - Verifies email using the token from the email link
   - Public endpoint (no authentication required)
   - Response: Success/error message

2. **POST /api/users/resend-verification**
   - Resends verification email to user
   - Body: `{ "email": "user@example.com" }`
   - Public endpoint (no authentication required)
   - Response: Success/error message

### Updated Endpoints

1. **POST /api/users/register**
   - Now generates verification token on signup
   - Sends verification email automatically
   - Sets `email_verified = false` by default
   - Returns success message with verification instructions

2. **POST /api/users/login**
   - Now checks if email is verified before allowing login
   - Returns `requiresVerification: true` if email not verified
   - Users with unverified email cannot login

### Email Service

- Added `sendVerificationEmail()` function
- Sends HTML email with verification link
- Link expires in 24 hours
- Email includes both button and plain link

## Frontend Implementation

### New Screen

**Email Verification Page** (`email_verification_page.dart`)
- Shows verification status (verifying, verified, error)
- Allows manual token entry for verification
- Resend verification email functionality
- Navigates to login after successful verification

### Updated Screens

1. **Sign Up Page**
   - Shows dialog with verification instructions after signup
   - Displays user's email address
   - Instructs user to check email

2. **Login Page**
   - Handles unverified email errors
   - Shows dialog with option to navigate to verification page
   - Option to resend verification email

### API Service Methods

- `verifyEmail(token)` - Verifies email with token
- `resendVerificationEmail(email)` - Resends verification email

## User Flow

### Registration Flow
1. User signs up → Account created with `email_verified = false`
2. Verification token generated → Expires in 24 hours
3. Verification email sent → Contains verification link
4. Success dialog shown → Instructions to check email

### Verification Flow (Option 1: Email Link)
1. User clicks link in email → Opens in browser
2. Backend verifies token → Updates `email_verified = true`
3. Shows success message → User can now login

### Verification Flow (Option 2: Manual)
1. User navigates to verification page in app
2. Enters verification token from email (or uses token from URL)
3. App calls verify endpoint → Updates `email_verified = true`
4. Shows success → User can now login

### Resend Verification Flow
1. User clicks "Resend Verification Email"
2. Enters email address
3. New verification token generated → New email sent
4. Previous token invalidated

### Login Flow (Updated)
1. User enters email and password
2. System checks:
   - ✅ Email exists
   - ✅ Password correct
   - ✅ Email verified (`email_verified = true`)
   - ✅ Account active (`status = 'Active'`)
3. If email not verified → Shows dialog with verification option
4. If all checks pass → Login successful → JWT token generated

## Configuration

### Backend Environment Variables

Add to your `.env` file:

```env
# Email Configuration (Required for email verification)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Optional email settings
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_FROM=noreply@yourdomain.com

# Base URL for verification links (optional - defaults to request host)
BASE_URL=http://localhost:3000
```

### Gmail Setup (for testing)

1. Enable 2-Step Verification on your Google account
2. Generate an App Password:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate password for "Mail"
   - Use this password in `EMAIL_PASS`

### For Production

- Use a proper email service (SendGrid, Mailgun, AWS SES, etc.)
- Update `BASE_URL` to your production domain
- Ensure SMTP credentials are secure
- Set up proper email templates

## Testing

### Manual Testing

1. **Sign Up:**
   ```bash
   curl -X POST http://localhost:3000/api/users/register \
     -H "Content-Type: application/json" \
     -d '{
       "name": "Test User",
       "email": "test@example.com",
       "password": "password123",
       "confirm_password": "password123"
     }'
   ```
   - Check email inbox for verification email
   - Copy verification token from email

2. **Verify Email:**
   ```bash
   curl "http://localhost:3000/api/users/verify-email?token=YOUR_TOKEN_HERE"
   ```

3. **Resend Verification:**
   ```bash
   curl -X POST http://localhost:3000/api/users/resend-verification \
     -H "Content-Type: application/json" \
     -d '{"email": "test@example.com"}'
   ```

4. **Try Login (Before Verification):**
   ```bash
   curl -X POST http://localhost:3000/api/users/login \
     -H "Content-Type: application/json" \
     -d '{
       "email": "test@example.com",
       "password": "password123"
     }'
   ```
   - Should return `requiresVerification: true`

5. **Try Login (After Verification):**
   - Should return JWT token if email verified and account active

## Security Features

- ✅ Verification tokens expire after 24 hours
- ✅ Tokens are cryptographically secure (32 bytes random)
- ✅ Email verification required before login
- ✅ Resend invalidates previous token
- ✅ Tokens stored securely in database
- ✅ No sensitive data in email links (only token)

## Troubleshooting

### Email not sending
- Check SMTP credentials in `.env`
- Verify email service is initialized
- Check server console for email errors
- Test email service: Check `initEmailService()` output

### Verification link not working
- Check `BASE_URL` is set correctly in `.env`
- Ensure token hasn't expired (24 hours)
- Verify token format in database
- Check server logs for verification errors

### Users can't login after verification
- Verify `email_verified = true` in database
- Check account status is 'Active' (admin activation required)
- Verify token was cleared after verification
- Check login controller logic

### Database errors
- Run migration: `node database/add_verification_token.js`
- Check database connection
- Verify columns exist: `SELECT * FROM "tblUsers" LIMIT 1;`

## Next Steps (Optional Enhancements)

1. **Deep Linking** - Set up app deep linking for mobile verification
2. **Email Templates** - Customize email HTML templates
3. **Verification Reminder** - Send reminder emails after 24 hours
4. **Rate Limiting** - Limit verification email requests
5. **Analytics** - Track verification rates and times
