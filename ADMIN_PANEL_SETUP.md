# Admin Panel Setup Guide

## Overview
The Admin Panel allows administrators to manage firms and advocates, activate/deactivate user accounts, and send activation emails.

## Features
- ✅ View all firms with their associated advocates
- ✅ View advocates without a firm
- ✅ Activate user accounts (sends success email)
- ✅ Deactivate user accounts
- ✅ Display user status (Pending, Active, Inactive)
- ✅ Web-only access (Flutter web)

## Database Setup

The admin tables are automatically created when the server starts. If you need to manually set them up:

```bash
cd flutter/Mansoor-s-App-Backend
node database/setup_admin_tables.js
```

### Tables Created:
1. **firms** - Stores law firm information
2. **users** (updated) - Added columns: `status`, `firm_id`, `role`, `phone`, `updated_at`
3. **admin_users** - Tracks admin access

## Email Configuration

To enable email notifications when users are activated, configure SMTP settings in your `.env` file:

```env
# SMTP Configuration for Email Service
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=noreply@yourdomain.com
```

### Gmail Setup:
1. Enable 2-Factor Authentication on your Google account
2. Generate an App Password: https://myaccount.google.com/apppasswords
3. Use the app password as `SMTP_PASS`

### Other Email Providers:
- **Outlook**: `smtp-mail.outlook.com`, port `587`
- **SendGrid**: Use their SMTP settings
- **Custom SMTP**: Configure according to your provider's documentation

**Note**: If email is not configured, the activation will still work, but no email will be sent (a warning will be logged).

## API Endpoints

### Get All Firms with Advocates
```
GET /api/admin/firms
```

Response:
```json
{
  "success": true,
  "data": {
    "firms": [
      {
        "id": 1,
        "firmName": "ABC Law Firm",
        "firmAddress": "123 Main St",
        "firmPhone": "1234567890",
        "firmEmail": "info@abclaw.com",
        "status": "Active",
        "advocates": [
          {
            "id": 1,
            "name": "John Doe",
            "email": "john@example.com",
            "status": "Pending",
            "role": "Advocate"
          }
        ],
        "advocateCount": 1
      }
    ],
    "advocatesWithoutFirm": []
  }
}
```

### Get All Advocates
```
GET /api/admin/advocates
```

### Activate User
```
PATCH /api/admin/users/:id/activate
```

### Deactivate User
```
PATCH /api/admin/users/:id/deactivate
```

## Accessing the Admin Panel

1. **Web Browser Only**: The Admin Panel is only accessible via Flutter web
2. **From Dashboard**: Click "Admin Panel" button (only visible on web)
3. **Direct URL**: Navigate to the Admin Panel page in your Flutter web app

## User Status Flow

1. **Pending** (default) - New user registration, awaiting activation
2. **Active** - User account activated by admin, can access the system
3. **Inactive** - User account deactivated by admin, cannot access the system

## User Registration

User registration will be handled separately. Once a user registers:
- Status is automatically set to "Pending"
- Admin can see them in the Admin Panel
- Admin can activate them, which sends a success email

## Testing

1. Start the backend server:
   ```bash
   cd flutter/Mansoor-s-App-Backend
   npm start
   ```

2. Run Flutter web:
   ```bash
   cd flutter/Mansoor-s-app-Frontend
   flutter run -d chrome
   ```

3. Navigate to Admin Panel from the dashboard

## Troubleshooting

### Email Not Sending
- Check SMTP configuration in `.env` file
- Verify SMTP credentials are correct
- Check server logs for email errors
- Note: Activation still works even if email fails

### No Firms/Advocates Showing
- Ensure users have been registered with `role='Advocate'`
- Check that firms exist in the database
- Verify `firm_id` is set correctly for advocates

### Admin Panel Not Accessible
- Ensure you're accessing via web browser (not mobile app)
- Check that Flutter web is running
- Verify backend server is running on port 3000


