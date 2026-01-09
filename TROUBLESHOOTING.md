# Troubleshooting Connection Issues

## Routes Available

The following routes are configured and available:

- `GET /api/case-details` - Get all case details
- `GET /api/case-details/:id` - Get case details by ID
- `GET /api/case-details/sc/:scNo` - Get case details by SC Number
- `POST /api/case-details` - Create new case details
- `PUT /api/case-details/:id` - Update case details
- `DELETE /api/case-details/:id` - Delete case details

## Connection Timeout Issues

If you're getting `ERR_CONNECTION_TIMED_OUT` when trying to access `http://10.0.2.2:3000/api/case-details`, follow these steps:

### 1. Verify Server is Running

Check if the server is running by looking for this output in your terminal:
```
✅ Server is running on port 3000
📡 API endpoints available at http://localhost:3000/api
📱 For Android emulator, use: http://10.0.2.2:3000/api
```

### 2. Test Server Locally

Open your browser and test:
- `http://localhost:3000/health` - Should return `{"status":"ok",...}`
- `http://localhost:3000/api/case-details` - Should return case details or empty array

### 3. Check Database Connection

The server requires a database connection to start. Make sure:
- PostgreSQL is running
- `.env` file exists with correct `DATABASE_URL`
- Database connection test passes on server startup

### 4. Verify Server Binding

The server is configured to bind to `0.0.0.0` which allows access from:
- `localhost` (browser)
- `10.0.2.2` (Android emulator)
- Your local IP address (physical devices)

### 5. Check Windows Firewall

Windows Firewall might be blocking port 3000:
1. Open Windows Defender Firewall
2. Click "Advanced settings"
3. Check if port 3000 is blocked
4. If needed, create an inbound rule to allow port 3000

### 6. Test from Emulator

From Android emulator, you can test using `adb`:
```bash
adb shell
curl http://10.0.2.2:3000/health
```

### 7. Alternative: Use Your Local IP

If `10.0.2.2` doesn't work, try using your computer's local IP:
1. Find your IP: `ipconfig` (look for IPv4 Address)
2. Update Flutter `api_config.dart` to use: `http://YOUR_IP:3000/api`

## Quick Start Commands

```bash
# Navigate to backend directory
cd flutter/Mansoor-s-App-Backend

# Install dependencies (if not done)
npm install

# Start the server
npm start
```

## Common Issues

### Server won't start
- **Database connection failed**: Check `.env` file and PostgreSQL service
- **Port already in use**: Change PORT in `.env` or kill process using port 3000

### Connection timeout from emulator
- **Server not running**: Start the server first
- **Firewall blocking**: Allow port 3000 in Windows Firewall
- **Wrong IP**: Verify you're using `10.0.2.2` for Android emulator

### CORS errors
- CORS is configured to allow all origins (`*`)
- If still getting CORS errors, check browser console for specific error

