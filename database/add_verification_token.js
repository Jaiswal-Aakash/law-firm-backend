const { query } = require('../config/database');

// Add email verification columns to tblUsers table
const addVerificationToken = async () => {
  try {
    console.log('Adding email verification columns to tblUsers table...');

    // Check and add verification_token column
    const tokenColumnCheck = await query(`
      SELECT column_name 
      FROM information_schema.columns
      WHERE table_schema = 'public' 
      AND table_name = 'tblUsers'
      AND column_name = 'verification_token';
    `);

    if (tokenColumnCheck.rows.length === 0) {
      console.log('Adding verification_token column...');
      await query(`
        ALTER TABLE "tblUsers" 
        ADD COLUMN verification_token VARCHAR(255);
      `);
      
      // Create index on verification_token for faster lookups
      await query(`
        CREATE INDEX IF NOT EXISTS idx_users_verification_token 
        ON "tblUsers"(verification_token);
      `);
      
      console.log('✅ verification_token column added');
    } else {
      console.log('✅ verification_token column already exists');
    }

    // Check and add verification_token_expiry column
    const expiryColumnCheck = await query(`
      SELECT column_name 
      FROM information_schema.columns
      WHERE table_schema = 'public' 
      AND table_name = 'tblUsers'
      AND column_name = 'verification_token_expiry';
    `);

    if (expiryColumnCheck.rows.length === 0) {
      console.log('Adding verification_token_expiry column...');
      await query(`
        ALTER TABLE "tblUsers" 
        ADD COLUMN verification_token_expiry TIMESTAMP;
      `);
      console.log('✅ verification_token_expiry column added');
    } else {
      console.log('✅ verification_token_expiry column already exists');
    }

    // Check and add email_verified column (optional - can use status instead)
    const verifiedColumnCheck = await query(`
      SELECT column_name 
      FROM information_schema.columns
      WHERE table_schema = 'public' 
      AND table_name = 'tblUsers'
      AND column_name = 'email_verified';
    `);

    if (verifiedColumnCheck.rows.length === 0) {
      console.log('Adding email_verified column...');
      await query(`
        ALTER TABLE "tblUsers" 
        ADD COLUMN email_verified BOOLEAN DEFAULT FALSE;
      `);
      console.log('✅ email_verified column added');
    } else {
      console.log('✅ email_verified column already exists');
    }

    console.log('✅ Email verification columns setup complete!');
  } catch (error) {
    console.error('Error adding verification columns:', error);
    throw error;
  }
};

// Run if executed directly
if (require.main === module) {
  require('../config/database').testConnection()
    .then((connected) => {
      if (!connected) {
        console.error('Cannot connect to database');
        process.exit(1);
      }
      return addVerificationToken();
    })
    .then(() => {
      console.log('\n✅ Database migration complete');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Database migration failed:', error);
      process.exit(1);
    });
}

module.exports = addVerificationToken;
