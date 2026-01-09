# Update Template Server URL

The backend has been updated to use the new template server URL: `http://103.27.234.248:8080`

## On Your Ubuntu Server

### Step 1: Navigate to Backend Directory
```bash
cd ~/path/to/Mansoor-s-App-Backend
```

### Step 2: Create or Edit .env File
```bash
nano .env
```

### Step 3: Add or Update TEMPLATE_SERVER_URL
Add this line (or update if it exists):
```env
TEMPLATE_SERVER_URL=http://103.27.234.248:8080
```

### Step 4: Save and Exit
- Press `Ctrl+X`
- Press `Y` to confirm
- Press `Enter` to save

### Step 5: Restart Backend
```bash
# Find your backend PM2 name
pm2 list

# Restart your backend (replace with actual name)
pm2 restart assetlifecycle-ba…
```

Or restart all:
```bash
pm2 restart all
```

### Step 6: Verify
Check backend logs:
```bash
pm2 logs assetlifecycle-ba… --lines 20
```

You should see the backend connecting to the template server successfully.

## Code Update

The default fallback URL in `controllers/casePetitionDetailsController.js` has been updated to:
```javascript
const TEMPLATE_SERVER_URL = process.env.TEMPLATE_SERVER_URL || 'http://103.27.234.248:8080';
```

This means:
- If `TEMPLATE_SERVER_URL` is set in `.env`, it will use that
- If not set, it will default to the production URL

## Testing

After restarting, test by creating a petition in your Flutter app. The backend should now call the template server at `http://103.27.234.248:8080`.

