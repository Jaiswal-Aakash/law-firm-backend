#!/usr/bin/env node

/**
 * Generate a secure JWT secret key
 * Run this script with: node generate-jwt-secret.js
 */

const crypto = require('crypto');

// Generate a 64-byte (512-bit) random secret
const secret = crypto.randomBytes(64).toString('hex');

console.log('\n🔐 Generated JWT Secret Key:');
console.log('=' .repeat(80));
console.log(secret);
console.log('=' .repeat(80));
console.log('\n📝 Add this to your .env file:');
console.log(`JWT_SECRET=${secret}`);
console.log('\n✅ Copy the JWT_SECRET line above and add it to your .env file\n');
