#!/usr/bin/env node

/**
 * Test script to verify JWT authentication is working
 * Run this script with: node test-auth.js
 */

const http = require('http');

const BASE_URL = 'http://localhost:3000/api';

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
};

function log(color, message) {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function makeRequest(method, path, token = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const options = {
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (token) {
      options.headers['Authorization'] = `Bearer ${token}`;
    }

    const req = http.request(url, options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve({
            status: res.statusCode,
            data: json,
          });
        } catch (e) {
          resolve({
            status: res.statusCode,
            data: data,
          });
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    if (method === 'POST' || method === 'PUT' || method === 'PATCH') {
      req.write(JSON.stringify({}));
    }

    req.end();
  });
}

async function testAuthentication() {
  log('blue', '\n🔒 Testing JWT Authentication...\n');

  // Test 1: Protected route without token (should fail)
  log('yellow', 'Test 1: Accessing protected route WITHOUT token...');
  try {
    const response = await makeRequest('GET', '/case-details');
    if (response.status === 401 && response.data.message) {
      log('green', '✅ PASSED: Protected route correctly requires authentication');
      log('green', `   Response: ${response.data.message}`);
    } else {
      log('red', '❌ FAILED: Protected route should return 401');
      log('red', `   Status: ${response.status}`);
      log('red', `   Response: ${JSON.stringify(response.data)}`);
    }
  } catch (error) {
    log('red', `❌ ERROR: ${error.message}`);
  }

  console.log('');

  // Test 2: Protected route with invalid token (should fail)
  log('yellow', 'Test 2: Accessing protected route WITH invalid token...');
  try {
    const response = await makeRequest('GET', '/case-details', 'invalid-token');
    if (response.status === 401 && response.data.message) {
      log('green', '✅ PASSED: Invalid token correctly rejected');
      log('green', `   Response: ${response.data.message}`);
    } else {
      log('red', '❌ FAILED: Invalid token should return 401');
      log('red', `   Status: ${response.status}`);
      log('red', `   Response: ${JSON.stringify(response.data)}`);
    }
  } catch (error) {
    log('red', `❌ ERROR: ${error.message}`);
  }

  console.log('');

  // Test 3: Public route (login) without token (should work)
  log('yellow', 'Test 3: Accessing public route (login) WITHOUT token...');
  try {
    const response = await makeRequest('POST', '/users/login');
    if (response.status !== 401) {
      log('green', '✅ PASSED: Public route accessible without token');
      log('green', `   Status: ${response.status}`);
    } else {
      log('red', '❌ FAILED: Public route should not require authentication');
      log('red', `   Status: ${response.status}`);
    }
  } catch (error) {
    log('red', `❌ ERROR: ${error.message}`);
  }

  console.log('');

  log('blue', '\n📝 Summary:');
  log('blue', 'If Test 1 and Test 2 passed, authentication is working correctly.');
  log('blue', 'If they failed, check:');
  log('blue', '  1. JWT_SECRET is set in .env file');
  log('blue', '  2. Server is restarted after route changes');
  log('blue', '  3. All routes are using authenticate middleware');
  console.log('');
}

// Run tests
testAuthentication().catch((error) => {
  log('red', `\n❌ Test failed with error: ${error.message}\n`);
  process.exit(1);
});
