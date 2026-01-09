const { query } = require('../config/database');

// Fix tblUsers table to ensure user_id is auto-generated as USR001, USR002, etc.
const fixUserTable = async () => {
  try {
    console.log('Checking tblUsers table structure...');
    
    // Check if table exists
    const tableCheck = await query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'tblUsers'
      );
    `);
    
    if (!tableCheck.rows[0].exists) {
      console.log('Creating tblUsers table...');
      // Create the table with user_id as VARCHAR
      await query(`
        CREATE TABLE "tblUsers" (
          user_id VARCHAR(50) PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255) UNIQUE NOT NULL,
          phone_number VARCHAR(50),
          address TEXT,
          law_firm VARCHAR(255),
          password VARCHAR(255) NOT NULL,
          created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          created_by VARCHAR(255),
          reset_token VARCHAR(255),
          reset_token_expiry TIMESTAMP,
          status VARCHAR(50) DEFAULT 'Pending'
        );
      `);
      console.log('✅ tblUsers table created successfully!');
    }
    
    // Check if user_id column exists and its type
    const columnCheck = await query(`
      SELECT 
        column_name,
        data_type,
        column_default,
        is_nullable
      FROM information_schema.columns
      WHERE table_schema = 'public' 
      AND table_name = 'tblUsers'
      AND column_name = 'user_id';
    `);
    
    if (columnCheck.rows.length === 0) {
      console.log('user_id column does not exist. Adding it...');
      // Add user_id as VARCHAR
      await query(`
        ALTER TABLE "tblUsers" 
        ADD COLUMN user_id VARCHAR(50);
      `);
      console.log('✅ user_id column added successfully!');
    }
    
    const columnInfo = columnCheck.rows[0];
    const isInteger = columnInfo.data_type === 'integer';
    const isVarchar = columnInfo.data_type === 'character varying' || columnInfo.data_type === 'varchar';
    
    // Check if there are existing rows
    const rowCount = await query('SELECT COUNT(*) FROM "tblUsers"');
    const count = parseInt(rowCount.rows[0].count);
    
    // Create sequence for user IDs
    console.log('Creating sequence for user IDs...');
    await query(`
      CREATE SEQUENCE IF NOT EXISTS usr_id_seq START WITH 1;
    `);
    
    // Initialize sequence based on existing data
    if (count > 0) {
      console.log(`Found ${count} existing rows. Initializing sequence...`);
      let maxNum = 0;
      
      if (isVarchar) {
        // Extract max number from existing USR### IDs
        const maxResult = await query(`
          SELECT COALESCE(MAX(
            CASE 
              WHEN user_id ~ '^USR[0-9]+$' 
              THEN CAST(SUBSTRING(user_id FROM 4) AS INTEGER)
              ELSE 0
            END
          ), 0) as max_num
          FROM "tblUsers";
        `);
        maxNum = parseInt(maxResult.rows[0].max_num) || 0;
      } else if (isInteger) {
        // If it's integer, get max and convert existing rows
        const maxResult = await query(`
          SELECT MAX(user_id) as max_id FROM "tblUsers";
        `);
        maxNum = parseInt(maxResult.rows[0].max_id) || 0;
        
        // Convert existing integer IDs to USR### format
        console.log('Converting existing integer IDs to USR### format...');
        // Drop primary key constraint if exists
        try {
          await query(`
            ALTER TABLE "tblUsers" 
            DROP CONSTRAINT IF EXISTS tblUsers_pkey;
          `);
        } catch (e) {
          // Ignore if constraint doesn't exist
        }
        
        // Convert column type to VARCHAR
        await query(`
          ALTER TABLE "tblUsers" 
          ALTER COLUMN user_id TYPE VARCHAR(50) USING user_id::TEXT;
        `);
        
        // Convert existing integer IDs to USR### format
        await query(`
          UPDATE "tblUsers"
          SET user_id = 'USR' || LPAD(user_id, 3, '0');
        `);
      }
      
      // Set sequence to continue from max + 1
      if (maxNum > 0) {
        await query(`
          SELECT setval('usr_id_seq', $1, false);
        `, [maxNum + 1]);
      }
    }
    
    // Convert l_id to VARCHAR if it's integer (handled above in sequence initialization)
    // Ensure user_id is VARCHAR(50) and NOT NULL
    if (!isVarchar || columnInfo.is_nullable === 'YES') {
      if (isInteger) {
        // Already converted above
      } else {
        await query(`
          ALTER TABLE "tblUsers" 
          ALTER COLUMN user_id TYPE VARCHAR(50),
          ALTER COLUMN user_id SET NOT NULL;
        `);
      }
    }
    
    // Create function to generate USR### IDs
    console.log('Creating trigger function for USR### ID generation...');
    await query(`
      CREATE OR REPLACE FUNCTION generate_usr_id()
      RETURNS TRIGGER AS $$
      DECLARE
          next_num INTEGER;
          new_user_id VARCHAR(50);
      BEGIN
          -- Only generate if user_id is NULL or empty or is an integer
          IF NEW.user_id IS NULL OR NEW.user_id = '' OR NEW.user_id ~ '^[0-9]+$' THEN
              -- Get next sequence number
              next_num := nextval('usr_id_seq');
              -- Format as USR001, USR002, etc. (3 digits with leading zeros)
              new_user_id := 'USR' || LPAD(next_num::TEXT, 3, '0');
              NEW.user_id := new_user_id;
          END IF;
          
          -- Ensure created_on is set if null
          IF NEW.created_on IS NULL THEN
              NEW.created_on := CURRENT_TIMESTAMP;
          END IF;
          
          RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `);
    
    // Create trigger
    console.log('Creating trigger for auto-generating user_id...');
    await query(`
      DROP TRIGGER IF EXISTS trigger_generate_usr_id ON "tblUsers";
    `);
    await query(`
      CREATE TRIGGER trigger_generate_usr_id
          BEFORE INSERT ON "tblUsers"
          FOR EACH ROW
          EXECUTE FUNCTION generate_usr_id();
    `);
    
    // Make it the primary key if not already
    const pkCheck = await query(`
      SELECT constraint_name 
      FROM information_schema.table_constraints 
      WHERE table_schema = 'public' 
      AND table_name = 'tblUsers' 
      AND constraint_type = 'PRIMARY KEY';
    `);
    
    if (pkCheck.rows.length === 0) {
      try {
        await query(`
          ALTER TABLE "tblUsers" 
          ADD PRIMARY KEY (user_id);
        `);
        console.log('✅ Primary key added to user_id');
      } catch (e) {
        console.log('Note: Could not add primary key:', e.message);
      }
    } else {
      console.log('✅ Primary key already exists');
    }
    
    console.log('✅ user_id column configured for USR### format!');
    
    // Ensure status column exists
    const statusCheck = await query(`
      SELECT column_name 
      FROM information_schema.columns
      WHERE table_schema = 'public' 
      AND table_name = 'tblUsers'
      AND column_name = 'status';
    `);
    
    if (statusCheck.rows.length === 0) {
      console.log('Adding status column...');
      await query(`
        ALTER TABLE "tblUsers" 
        ADD COLUMN status VARCHAR(50) DEFAULT 'Pending';
      `);
      console.log('✅ status column added');
    }
    
    console.log('✅ tblUsers table structure verified!');
  } catch (error) {
    console.error('Error fixing tblUsers table:', error);
    throw error;
  }
};

// Run if executed directly
if (require.main === module) {
  fixUserTable()
    .then(() => {
      console.log('User table fix complete');
      process.exit(0);
    })
    .catch((error) => {
      console.error('User table fix failed:', error);
      process.exit(1);
    });
}

module.exports = fixUserTable;
