# JWT Secret Key Setup Guide

## What is JWT_SECRET?

`JWT_SECRET` is a secret key used to sign and verify JWT (JSON Web Token) tokens. It's like a password that ensures your tokens are secure and haven't been tampered with.

## How to Generate a JWT Secret

### Method 1: Using the provided script (Recommended)

Run this command in your backend directory:

```bash
node generate-jwt-secret.js
```

This will generate a secure 512-bit random secret key.

### Method 2: Using Node.js directly

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### Method 3: Using online generator

Visit: https://randomkeygen.com/ and use a "CodeIgniter Encryption Keys" (256-bit or 512-bit)

## Setting Up JWT_SECRET

1. **Create or edit your `.env` file** in the `mansoor_app_backend` directory

2. **Add the JWT_SECRET** (use the generated key from above):

```env
JWT_SECRET=your-generated-secret-key-here
JWT_EXPIRES_IN=7d
```

3. **Example `.env` file:**

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=your_database_name
DB_USER=your_database_user
DB_PASSWORD=your_database_password

# Server Configuration
PORT=3000

# JWT Configuration
JWT_SECRET=b577fc6757b8a520f77f1bc52ccae73e8d15fa846d4c47531877caf2be3fd82ee56e0adefdc7cddecb8699659e2fdb66824f66b4c1dabb05d621bcdd91ce354a
JWT_EXPIRES_IN=7d
```

## Important Security Notes

⚠️ **NEVER commit your `.env` file to version control!**

- The `.env` file should already be in `.gitignore`
- Keep your JWT_SECRET private and secure
- Use different secrets for development and production
- The secret should be at least 32 characters long (64+ recommended)

## JWT_EXPIRES_IN Options

You can set token expiration time:
- `7d` - 7 days (default)
- `24h` - 24 hours
- `1h` - 1 hour
- `30m` - 30 minutes
- `3600` - 3600 seconds

## Verification

After setting up, restart your backend server:

```bash
npm start
# or
npm run dev
```

The server will automatically load the JWT_SECRET from your `.env` file.

## Troubleshooting

If you get authentication errors:
1. Make sure `.env` file exists in the backend directory
2. Check that `JWT_SECRET` is set correctly
3. Restart the server after changing `.env`
4. Ensure there are no extra spaces or quotes around the secret
