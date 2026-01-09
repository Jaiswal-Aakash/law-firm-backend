const { query } = require('../config/database');

// Fix tblLawFirmDetails table to ensure l_id is auto-generated as LF001, LF002, etc.
const fixLawFirmTable = async () => {
  try {
    console.log('Checking tblLawFirmDetails table structure...');
    
    // Check if table exists
    const tableCheck = await query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'tblLawFirmDetails'
      );
    `);
    
    if (!tableCheck.rows[0].exists) {
      console.log('Creating tblLawFirmDetails table...');
      // Create the table with l_id as VARCHAR
      await query(`
        CREATE TABLE "tblLawFirmDetails" (
          l_id VARCHAR(50) PRIMARY KEY,
          l_name VARCHAR(255) NOT NULL,
          l_designation VARCHAR(255),
          l_address TEXT,
          l_phone_number VARCHAR(50),
          l_email VARCHAR(255),
          created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          created_by VARCHAR(255)
        );
      `);
      console.log('✅ tblLawFirmDetails table created successfully!');
    }
    
    // Check if l_id column exists and its type
    const columnCheck = await query(`
      SELECT 
        column_name,
        data_type,
        column_default
      FROM information_schema.columns
      WHERE table_schema = 'public' 
      AND table_name = 'tblLawFirmDetails'
      AND column_name = 'l_id';
    `);
    
    if (columnCheck.rows.length === 0) {
      console.log('l_id column does not exist. Adding it...');
      // Add l_id as VARCHAR
      await query(`
        ALTER TABLE "tblLawFirmDetails" 
        ADD COLUMN l_id VARCHAR(50);
      `);
      console.log('✅ l_id column added successfully!');
    }
    
    const columnInfo = columnCheck.rows[0];
    const isVarchar = columnInfo.data_type === 'character varying' || columnInfo.data_type === 'varchar';
    const isInteger = columnInfo.data_type === 'integer';
    
    // Check if there are existing rows
    const rowCount = await query('SELECT COUNT(*) FROM "tblLawFirmDetails"');
    const count = parseInt(rowCount.rows[0].count);
    
    // Create sequence for law firm IDs
    console.log('Creating sequence for law firm IDs...');
    await query(`
      CREATE SEQUENCE IF NOT EXISTS lf_id_seq START WITH 1;
    `);
    
    // Initialize sequence based on existing data
    if (count > 0) {
      console.log(`Found ${count} existing rows. Initializing sequence...`);
      let maxNum = 0;
      
      if (isVarchar) {
        // Extract max number from existing LF### IDs
        const maxResult = await query(`
          SELECT COALESCE(MAX(
            CASE 
              WHEN l_id ~ '^LF[0-9]+$' 
              THEN CAST(SUBSTRING(l_id FROM 3) AS INTEGER)
              ELSE 0
            END
          ), 0) as max_num
          FROM "tblLawFirmDetails";
        `);
        maxNum = parseInt(maxResult.rows[0].max_num) || 0;
      } else if (isInteger) {
        // If it's integer, get max first
        const maxResult = await query(`
          SELECT MAX(l_id) as max_id FROM "tblLawFirmDetails";
        `);
        maxNum = parseInt(maxResult.rows[0].max_id) || 0;
        
        // Convert column type first, then update values
        console.log('Converting l_id from integer to VARCHAR...');
        // Drop primary key constraint if exists
        try {
          await query(`
            ALTER TABLE "tblLawFirmDetails" 
            DROP CONSTRAINT IF EXISTS tblLawFirmDetails_pkey;
          `);
        } catch (e) {
          // Ignore if constraint doesn't exist
        }
        
        // Convert column type to VARCHAR
        await query(`
          ALTER TABLE "tblLawFirmDetails" 
          ALTER COLUMN l_id TYPE VARCHAR(50) USING l_id::TEXT;
        `);
        
        // Convert existing integer IDs to LF### format
        console.log('Converting existing integer IDs to LF### format...');
        await query(`
          UPDATE "tblLawFirmDetails"
          SET l_id = 'LF' || LPAD(l_id, 3, '0')
          WHERE l_id ~ '^[0-9]+$';
        `);
      }
      
      // Set sequence to continue from max + 1
      if (maxNum > 0) {
        await query(`
          SELECT setval('lf_id_seq', $1, false);
        `, [maxNum + 1]);
      }
    }
    
    // Note: Integer conversion is handled above in the sequence initialization section
    
    // Ensure l_id is VARCHAR(50) and NOT NULL
    if (!isVarchar || columnInfo.is_nullable === 'YES') {
      await query(`
        ALTER TABLE "tblLawFirmDetails" 
        ALTER COLUMN l_id TYPE VARCHAR(50),
        ALTER COLUMN l_id SET NOT NULL;
      `);
    }
    
    // Create function to generate LF### IDs
    console.log('Creating trigger function for LF### ID generation...');
    await query(`
      CREATE OR REPLACE FUNCTION generate_lf_id()
      RETURNS TRIGGER AS $$
      DECLARE
          next_num INTEGER;
          new_l_id VARCHAR(50);
      BEGIN
          -- Only generate if l_id is NULL or empty or is an integer
          IF NEW.l_id IS NULL OR NEW.l_id = '' OR NEW.l_id ~ '^[0-9]+$' THEN
              -- Get next sequence number
              next_num := nextval('lf_id_seq');
              -- Format as LF001, LF002, etc. (3 digits with leading zeros)
              new_l_id := 'LF' || LPAD(next_num::TEXT, 3, '0');
              NEW.l_id := new_l_id;
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
    console.log('Creating trigger for auto-generating l_id...');
    await query(`
      DROP TRIGGER IF EXISTS trigger_generate_lf_id ON "tblLawFirmDetails";
    `);
    await query(`
      CREATE TRIGGER trigger_generate_lf_id
          BEFORE INSERT ON "tblLawFirmDetails"
          FOR EACH ROW
          EXECUTE FUNCTION generate_lf_id();
    `);
    
    // Make it the primary key if not already
    const pkCheck = await query(`
      SELECT constraint_name 
      FROM information_schema.table_constraints 
      WHERE table_schema = 'public' 
      AND table_name = 'tblLawFirmDetails' 
      AND constraint_type = 'PRIMARY KEY';
    `);
    
    if (pkCheck.rows.length === 0) {
      try {
        await query(`
          ALTER TABLE "tblLawFirmDetails" 
          ADD PRIMARY KEY (l_id);
        `);
        console.log('✅ Primary key added to l_id');
      } catch (e) {
        console.log('Note: Could not add primary key:', e.message);
      }
    } else {
      console.log('✅ Primary key already exists');
    }
    
    console.log('✅ l_id column configured for LF### format!');
    
    // Ensure other columns exist
    const allColumns = await query(`
      SELECT column_name 
      FROM information_schema.columns
      WHERE table_schema = 'public' 
      AND table_name = 'tblLawFirmDetails';
    `);
    
    const existingColumns = allColumns.rows.map(r => r.column_name);
    const requiredColumns = {
      'l_name': 'VARCHAR(255) NOT NULL',
      'l_designation': 'VARCHAR(255)',
      'l_address': 'TEXT',
      'l_phone_number': 'VARCHAR(50)',
      'l_email': 'VARCHAR(255)',
      'created_on': 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP',
      'created_by': 'VARCHAR(255)'
    };
    
    for (const [colName, colDef] of Object.entries(requiredColumns)) {
      if (!existingColumns.includes(colName)) {
        console.log(`Adding missing column: ${colName}...`);
        await query(`
          ALTER TABLE "tblLawFirmDetails" 
          ADD COLUMN ${colName} ${colDef};
        `);
      }
    }
    
    console.log('✅ tblLawFirmDetails table structure verified!');
  } catch (error) {
    console.error('Error fixing tblLawFirmDetails table:', error);
    throw error;
  }
};

// Run if executed directly
if (require.main === module) {
  fixLawFirmTable()
    .then(() => {
      console.log('Law firm table fix complete');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Law firm table fix failed:', error);
      process.exit(1);
    });
}

module.exports = fixLawFirmTable;
