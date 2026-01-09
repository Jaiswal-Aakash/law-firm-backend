const { Pool } = require('pg');
require('dotenv').config();

// Validate DATABASE_URL
if (!process.env.DATABASE_URL) {
  console.error('ERROR: DATABASE_URL is not set in .env file');
  console.error('Please set DATABASE_URL in your .env file');
  process.exit(1);
}

// Create PostgreSQL connection pool using DATABASE_URL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  connectionTimeoutMillis: 10000, // 10 seconds timeout
  idleTimeoutMillis: 30000,
  max: 20,
});

// Test database connection
pool.on('connect', () => {
  console.log('Connected to PostgreSQL database');
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

// Test database connection
const testConnection = async () => {
  try {
    const client = await pool.connect();
    await client.query('SELECT NOW()');
    client.release();
    console.log('✓ Database connection successful');
    return true;
  } catch (error) {
    console.error('✗ Database connection failed:', error.message);
    if (error.code === 'ENETUNREACH') {
      console.error('\nNetwork Error: Cannot reach database server');
      console.error('Possible causes:');
      console.error('  1. Database server is down or unreachable');
      console.error('  2. Incorrect DATABASE_URL in .env file');
      console.error('  3. Firewall blocking the connection');
      console.error('  4. Network connectivity issues');
      console.error('\nPlease check your DATABASE_URL and network connection.');
    } else if (error.code === 'ECONNREFUSED') {
      console.error('\nConnection Refused: Database server is not accepting connections');
      console.error('Please verify the database server is running and accessible.');
    } else if (error.code === 'ETIMEDOUT') {
      console.error('\nConnection Timeout: Database server did not respond in time');
      console.error('Please check if the database server is accessible.');
    }
    return false;
  }
};

// Helper function to execute queries
const query = async (text, params) => {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log('Executed query', { text, duration, rows: res.rowCount });
    return res;
  } catch (error) {
    console.error('Database query error', { text, error: error.message });
    if (error.code === 'ENETUNREACH' || error.code === 'ECONNREFUSED') {
      console.error('Database connection lost. Please check your database server.');
    }
    throw error;
  }
};

// Get a client from the pool for transactions
const getClient = async () => {
  const client = await pool.connect();
  const query = client.query.bind(client);
  const release = client.release.bind(client);
  
  // Set a timeout of 5 seconds
  const timeout = setTimeout(() => {
    console.error('A client has been checked out for more than 5 seconds!');
  }, 5000);
  
  // Monkey patch the query method to log the duration
  client.query = (...args) => {
    client.lastQuery = args;
    return query(...args);
  };
  
  client.release = () => {
    clearTimeout(timeout);
    client.query = query;
    client.release = release;
    return release.apply(client);
  };
  
  return client;
};

module.exports = {
  pool,
  query,
  getClient,
  testConnection
};

