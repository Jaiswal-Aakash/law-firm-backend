# Mansoor App Backend - Ubuntu Deployment Guide

This guide will help you deploy the Mansoor App Backend on your Ubuntu server using PM2.

## Prerequisites

- ✅ Node.js (v18 or later) - Already installed
- ✅ PM2 - Already installed
- ✅ PostgreSQL database (local or remote)
- ✅ Environment variables configured

## Step 1: Check Port Availability

The backend uses port **3000** by default. Check if it's available:

```bash
sudo netstat -tlnp | grep 3000
```

If port 3000 is already in use, you can:
- Change the port in `ecosystem.config.cjs` (change `PORT: 3000` to another port)
- Or use a different port via environment variable

## Step 2: Transfer Files to Server

Upload the `Mansoor-s-App-Backend` folder to your Ubuntu server:

```bash
# From your local machine
scp -r Mansoor-s-App-Backend username@your-server-ip:/home/username/
```

Or use WinSCP, Git, or any other method.

## Step 3: SSH into Your Server

```bash
ssh username@your-server-ip
cd ~/Mansoor-s-App-Backend
```

## Step 4: Install Dependencies

```bash
npm install --production
```

## Step 5: Create Logs Directory

```bash
mkdir -p logs
```

## Step 6: Configure Environment Variables

### Create .env file

```bash
nano .env
```

### Required Environment Variables

```env
# Database Configuration (REQUIRED)
DATABASE_URL=postgresql://user:password@host:5432/database_name

# JWT Secret (REQUIRED)
# Generate a random secret: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
JWT_SECRET=your-jwt-secret-key-here

# Template Server URL (REQUIRED)
TEMPLATE_SERVER_URL=http://103.27.234.248:8080

# Server Port (optional, defaults to 3000)
PORT=3000

# Node Environment
NODE_ENV=production

# Email Configuration (Optional - for email verification)
# EMAIL_HOST=smtp.gmail.com
# EMAIL_PORT=587
# EMAIL_USER=your-email@gmail.com
# EMAIL_PASS=your-app-password
```

### Save and Exit
- Press `Ctrl+X`
- Press `Y` to confirm
- Press `Enter` to save

## Step 7: Generate JWT Secret (If Needed)

If you don't have a JWT secret:

```bash
node generate-jwt-secret.js
```

Or manually generate:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Copy the output and add it to your `.env` file as `JWT_SECRET`.

## Step 8: Test Database Connection

```bash
node -e "require('./config/database').testConnection()"
```

This should show: `✓ Database connection successful`

If it fails, check your `DATABASE_URL` in the `.env` file.

## Step 9: Initialize Database (If Needed)

If this is a fresh deployment, initialize the database:

```bash
npm run init-db
```

Or manually:
```bash
node database/init.js
```

## Step 10: Start with PM2

### Start the server
```bash
pm2 start ecosystem.config.cjs
```

### Verify it's running
```bash
pm2 list
```

You should see `mansoor-app-backend` in the list with status `online`.

### Check logs
```bash
pm2 logs mansoor-app-backend
```

You should see:
```
✓ Database connection successful
✅ Server is running on port 3000
```

Press `Ctrl+C` to exit logs.

## Step 11: Test the Server

```bash
# Health check (if you have a health endpoint)
curl http://localhost:3000/api/users

# Or test with your Flutter app
```

## Step 12: Save PM2 Configuration

```bash
pm2 save
```

This ensures the backend starts automatically on server reboot.

## Step 13: Configure Firewall (If Needed)

If you want external access:

```bash
sudo ufw allow 3000/tcp
sudo ufw reload
```

## Step 14: Update Flutter App Configuration

Update your Flutter app's API configuration to use the public IP:

**File:** `lib/src/config/api_config.dart`

Change the base URL to:
```dart
// For production
static const String productionApiUrl = 'http://103.27.234.248:3000/api';
```

## Troubleshooting

### Database Connection Failed
- Check `DATABASE_URL` in `.env` file
- Verify PostgreSQL is running and accessible
- Check firewall rules for PostgreSQL port (5432)

### Port Already in Use
```bash
# Find what's using port 3000
sudo lsof -i :3000

# Change port in ecosystem.config.cjs
nano ecosystem.config.cjs
# Change PORT: 3000 to PORT: 3001 (or another port)
```

### JWT Secret Missing
```bash
# Generate JWT secret
node generate-jwt-secret.js
# Add output to .env file as JWT_SECRET
```

### Server Not Starting
```bash
# Check logs for errors
pm2 logs mansoor-app-backend --err

# Check if all dependencies are installed
npm list
```

## PM2 Management Commands

```bash
# View status
pm2 status

# View logs
pm2 logs mansoor-app-backend

# Restart
pm2 restart mansoor-app-backend

# Stop
pm2 stop mansoor-app-backend

# Delete
pm2 delete mansoor-app-backend

# Monitor
pm2 monit
```

## Environment Variables Summary

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | ✅ Yes | PostgreSQL connection string |
| `JWT_SECRET` | ✅ Yes | Secret key for JWT tokens |
| `TEMPLATE_SERVER_URL` | ✅ Yes | Template server URL (http://103.27.234.248:8080) |
| `PORT` | ❌ No | Server port (default: 3000) |
| `NODE_ENV` | ❌ No | Environment (production/development) |
| `EMAIL_*` | ❌ No | Email configuration (optional) |

## Success Checklist

- [ ] Files transferred to server
- [ ] Dependencies installed (`npm install`)
- [ ] `.env` file created with all required variables
- [ ] Database connection tested successfully
- [ ] Server started with PM2
- [ ] Health check responds correctly
- [ ] PM2 configuration saved
- [ ] Firewall configured (if needed)
- [ ] Flutter app updated with new API URL

---

**Your backend should now be running on port 3000! 🎉**

