# Quick Deploy - Mansoor App Backend

Since you already have Node.js and PM2 installed, here's the quick deployment:

## Quick Steps

### 1. Transfer Files
```bash
# From your local machine
scp -r Mansoor-s-App-Backend username@103.27.234.248:/home/username/
```

### 2. SSH and Navigate
```bash
ssh username@103.27.234.248
cd ~/Mansoor-s-App-Backend
```

### 3. Install Dependencies
```bash
npm install --production
```

### 4. Create Logs Directory
```bash
mkdir -p logs
```

### 5. Create .env File
```bash
nano .env
```

Add:
```env
DATABASE_URL=postgresql://user:password@host:5432/database_name
JWT_SECRET=your-jwt-secret-here
TEMPLATE_SERVER_URL=http://103.27.234.248:8080
PORT=3000
NODE_ENV=production
```

Save: `Ctrl+X`, `Y`, `Enter`

### 6. Test Database
```bash
node -e "require('./config/database').testConnection()"
```

### 7. Start with PM2
```bash
pm2 start ecosystem.config.cjs
pm2 save
```

### 8. Test
```bash
curl http://localhost:3000/api/users
```

### 9. Configure Firewall
```bash
sudo ufw allow 3000/tcp
```

## Done! 🎉

Your backend is now running on port 3000.

