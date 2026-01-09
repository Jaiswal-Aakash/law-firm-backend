const { query } = require('../config/database');

// Script to fix case_id and created_on issues
const fixCaseIdAndCreatedOn = async () => {
  try {
    console.log('Fixing case_id and created_on...');
    
    // Check current table structure (handle case sensitivity)
    const checkResult = await query(`
      SELECT column_name, data_type, column_default
      FROM information_schema.columns
      WHERE (table_name = 'tblCaseDetails' OR table_name = 'tblcasedetails')
      AND table_schema = 'public'
      ORDER BY column_name;
    `);
    
    if (checkResult.rows.length === 0) {
      console.log('Table tblCaseDetails does not exist yet, skipping migration');
      return;
    }
    
    console.log('Current table structure:', checkResult.rows);
    
    // Check if case_id is integer
    const caseIdColumn = checkResult.rows.find(col => 
      col.column_name.toLowerCase() === 'case_id'
    );
    
    if (caseIdColumn && (caseIdColumn.data_type === 'integer' || caseIdColumn.data_type === 'bigint')) {
      console.log('Converting case_id from INTEGER to VARCHAR...');
      
      // Convert existing integer IDs to CASE format
      await query(`
        UPDATE "tblCaseDetails" 
        SET case_id = 'CASE' || LPAD(case_id::TEXT, 3, '0')
        WHERE case_id::TEXT !~ '^CASE[0-9]+$';
      `);
      
      // Alter column type
      await query(`
        ALTER TABLE "tblCaseDetails" 
        ALTER COLUMN case_id TYPE VARCHAR(50) USING case_id::VARCHAR(50);
      `);
      
      // Remove default
      await query(`
        ALTER TABLE "tblCaseDetails" 
        ALTER COLUMN case_id DROP DEFAULT IF EXISTS;
      `);
      
      console.log('case_id converted successfully!');
    }
    
    // Ensure created_on has default for tblCaseDetails (handle errors gracefully)
    try {
      console.log('Setting created_on default for tblCaseDetails...');
      await query(`
        ALTER TABLE "tblCaseDetails" 
        ALTER COLUMN created_on SET DEFAULT CURRENT_TIMESTAMP;
      `);
    } catch (error) {
      console.log('Note: created_on default may already be set:', error.message);
    }
    
    // Update NULL created_on values in tblCaseDetails
    try {
      await query(`
        UPDATE "tblCaseDetails" 
        SET created_on = CURRENT_TIMESTAMP 
        WHERE created_on IS NULL;
      `);
    } catch (error) {
      console.log('Note: Could not update NULL created_on values:', error.message);
    }
    
    // Ensure created_on has default for tblCaseAccusedDetails
    try {
      console.log('Setting created_on default for tblCaseAccusedDetails...');
      await query(`
        ALTER TABLE "tblCaseAccusedDetails" 
        ALTER COLUMN created_on SET DEFAULT CURRENT_TIMESTAMP;
      `);
      
      // Update NULL created_on values
      await query(`
        UPDATE "tblCaseAccusedDetails" 
        SET created_on = CURRENT_TIMESTAMP 
        WHERE created_on IS NULL;
      `);
      console.log('created_on default set for tblCaseAccusedDetails');
    } catch (error) {
      console.log('Note: Could not set created_on default for tblCaseAccusedDetails:', error.message);
    }
    
    // Ensure created_on has default for tblCaseComplainantDetails
    try {
      console.log('Setting created_on default for tblCaseComplainantDetails...');
      await query(`
        ALTER TABLE "tblCaseComplainantDetails" 
        ALTER COLUMN created_on SET DEFAULT CURRENT_TIMESTAMP;
      `);
      
      // Update NULL created_on values
      await query(`
        UPDATE "tblCaseComplainantDetails" 
        SET created_on = CURRENT_TIMESTAMP 
        WHERE created_on IS NULL;
      `);
      console.log('created_on default set for tblCaseComplainantDetails');
    } catch (error) {
      console.log('Note: Could not set created_on default for tblCaseComplainantDetails:', error.message);
    }
    
    // Create sequence
    await query('CREATE SEQUENCE IF NOT EXISTS case_id_seq START WITH 1;');
    
    // Initialize sequence
    const maxResult = await query(`
      SELECT COALESCE(MAX(
        CASE 
          WHEN case_id ~ '^CASE[0-9]+$' 
          THEN CAST(SUBSTRING(case_id FROM 5) AS INTEGER)
          ELSE 0
        END
      ), 0) as max_num
      FROM "tblCaseDetails";
    `);
    
    const maxNum = parseInt(maxResult.rows[0].max_num) || 0;
    if (maxNum > 0) {
      await query(`SELECT setval('case_id_seq', ${maxNum + 1}, false);`);
      console.log(`Sequence initialized to ${maxNum + 1}`);
    }
    
    // Create/update trigger function
    await query(`
      CREATE OR REPLACE FUNCTION generate_case_id()
      RETURNS TRIGGER AS $$
      DECLARE
          next_num INTEGER;
          new_case_id VARCHAR(50);
      BEGIN
          -- Only generate if case_id is NULL or empty or is an integer
          IF NEW.case_id IS NULL OR NEW.case_id = '' OR NEW.case_id ~ '^[0-9]+$' THEN
              -- Get next sequence number
              next_num := nextval('case_id_seq');
              -- Format as CASE001, CASE002, etc. (3 digits with leading zeros)
              new_case_id := 'CASE' || LPAD(next_num::TEXT, 3, '0');
              NEW.case_id := new_case_id;
          END IF;
          
          -- Ensure created_on is set if null
          IF NEW.created_on IS NULL THEN
              NEW.created_on := CURRENT_TIMESTAMP;
          END IF;
          
          RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `);
    
    // Create/update trigger
    await query(`
      DROP TRIGGER IF EXISTS trigger_generate_case_id ON "tblCaseDetails";
      CREATE TRIGGER trigger_generate_case_id
          BEFORE INSERT ON "tblCaseDetails"
          FOR EACH ROW
          EXECUTE FUNCTION generate_case_id();
    `);
    
    // Fix ca_id: Convert from INTEGER to VARCHAR and auto-generate CA001, CA002, etc.
    try {
      console.log('Fixing ca_id for tblCaseAccusedDetails...');
      
      // Check if ca_id column is INTEGER type
      const checkResult = await query(`
        SELECT column_name, data_type, column_default
        FROM information_schema.columns
        WHERE (table_name = 'tblCaseAccusedDetails' OR table_name = 'tblcaseaccuseddetails')
        AND column_name = 'ca_id'
        AND table_schema = 'public';
      `);
      
      if (checkResult.rows.length > 0) {
        const caIdColumn = checkResult.rows[0];
        
        if (caIdColumn.data_type === 'integer' || caIdColumn.data_type === 'bigint') {
          console.log('Converting ca_id from INTEGER to VARCHAR...');
          
          // Convert existing integer IDs to CA format
          await query(`
            UPDATE "tblCaseAccusedDetails" 
            SET ca_id = 'CA' || LPAD(ca_id::TEXT, 3, '0')
            WHERE ca_id::TEXT !~ '^CA[0-9]+$';
          `);
          
          // Alter column type from INTEGER to VARCHAR
          await query(`
            ALTER TABLE "tblCaseAccusedDetails" 
            ALTER COLUMN ca_id TYPE VARCHAR(50) USING ca_id::VARCHAR(50);
          `);
          
          // Remove default if it exists (SERIAL creates a default)
          await query(`
            ALTER TABLE "tblCaseAccusedDetails" 
            ALTER COLUMN ca_id DROP DEFAULT IF EXISTS;
          `);
          
          console.log('ca_id converted successfully!');
        }
      }
      
      // Create sequence for ca_id
      await query('CREATE SEQUENCE IF NOT EXISTS ca_id_seq START WITH 1;');
      
      // Initialize sequence based on existing data
      const maxResult = await query(`
        SELECT COALESCE(MAX(
          CASE 
            WHEN ca_id ~ '^CA[0-9]+$' 
            THEN CAST(SUBSTRING(ca_id FROM 3) AS INTEGER)
            ELSE 0
          END
        ), 0) as max_num
        FROM "tblCaseAccusedDetails";
      `);
      
      const maxNum = parseInt(maxResult.rows[0].max_num) || 0;
      if (maxNum > 0) {
        await query(`SELECT setval('ca_id_seq', ${maxNum + 1}, false);`);
        console.log(`ca_id sequence initialized to ${maxNum + 1}`);
      }
      
      // Create/update trigger function
      await query(`
        CREATE OR REPLACE FUNCTION generate_ca_id()
        RETURNS TRIGGER AS $$
        DECLARE
            next_num INTEGER;
            new_ca_id VARCHAR(50);
        BEGIN
            -- Only generate if ca_id is NULL or empty or is an integer
            IF NEW.ca_id IS NULL OR NEW.ca_id = '' OR NEW.ca_id ~ '^[0-9]+$' THEN
                -- Get next sequence number
                next_num := nextval('ca_id_seq');
                -- Format as CA001, CA002, etc. (3 digits with leading zeros)
                new_ca_id := 'CA' || LPAD(next_num::TEXT, 3, '0');
                NEW.ca_id := new_ca_id;
            END IF;
            
            -- Ensure created_on is set if null
            IF NEW.created_on IS NULL THEN
                NEW.created_on := CURRENT_TIMESTAMP;
            END IF;
            
            RETURN NEW;
        END;
        $$ LANGUAGE plpgsql;
      `);
      
      // Create/update trigger
      await query(`
        DROP TRIGGER IF EXISTS trigger_generate_ca_id ON "tblCaseAccusedDetails";
        CREATE TRIGGER trigger_generate_ca_id
            BEFORE INSERT ON "tblCaseAccusedDetails"
            FOR EACH ROW
            EXECUTE FUNCTION generate_ca_id();
      `);
      
      console.log('ca_id auto-generation trigger created for tblCaseAccusedDetails');
    } catch (error) {
      console.log('Note: Could not fix ca_id:', error.message);
    }
    
    // Fix cc_id: Convert from INTEGER to VARCHAR and auto-generate CC001, CC002, etc.
    try {
      console.log('Fixing cc_id for tblCaseComplainantDetails...');
      
      // Check if cc_id column is INTEGER type
      const checkResult = await query(`
        SELECT column_name, data_type, column_default
        FROM information_schema.columns
        WHERE (table_name = 'tblCaseComplainantDetails' OR table_name = 'tblcasecomplainantdetails')
        AND column_name = 'cc_id'
        AND table_schema = 'public';
      `);
      
      if (checkResult.rows.length > 0) {
        const ccIdColumn = checkResult.rows[0];
        
        if (ccIdColumn.data_type === 'integer' || ccIdColumn.data_type === 'bigint') {
          console.log('Converting cc_id from INTEGER to VARCHAR...');
          
          // Convert existing integer IDs to CC format
          await query(`
            UPDATE "tblCaseComplainantDetails" 
            SET cc_id = 'CC' || LPAD(cc_id::TEXT, 3, '0')
            WHERE cc_id::TEXT !~ '^CC[0-9]+$';
          `);
          
          // Alter column type from INTEGER to VARCHAR
          await query(`
            ALTER TABLE "tblCaseComplainantDetails" 
            ALTER COLUMN cc_id TYPE VARCHAR(50) USING cc_id::VARCHAR(50);
          `);
          
          // Remove default if it exists (SERIAL creates a default)
          await query(`
            ALTER TABLE "tblCaseComplainantDetails" 
            ALTER COLUMN cc_id DROP DEFAULT IF EXISTS;
          `);
          
          console.log('cc_id converted successfully!');
        }
      }
      
      // Create sequence for cc_id
      await query('CREATE SEQUENCE IF NOT EXISTS cc_id_seq START WITH 1;');
      
      // Initialize sequence based on existing data
      const maxResult = await query(`
        SELECT COALESCE(MAX(
          CASE 
            WHEN cc_id ~ '^CC[0-9]+$' 
            THEN CAST(SUBSTRING(cc_id FROM 3) AS INTEGER)
            ELSE 0
          END
        ), 0) as max_num
        FROM "tblCaseComplainantDetails";
      `);
      
      const maxNum = parseInt(maxResult.rows[0].max_num) || 0;
      if (maxNum > 0) {
        await query(`SELECT setval('cc_id_seq', ${maxNum + 1}, false);`);
        console.log(`cc_id sequence initialized to ${maxNum + 1}`);
      }
      
      // Create/update trigger function
      await query(`
        CREATE OR REPLACE FUNCTION generate_cc_id()
        RETURNS TRIGGER AS $$
        DECLARE
            next_num INTEGER;
            new_cc_id VARCHAR(50);
        BEGIN
            -- Only generate if cc_id is NULL or empty or is an integer
            IF NEW.cc_id IS NULL OR NEW.cc_id = '' OR NEW.cc_id ~ '^[0-9]+$' THEN
                -- Get next sequence number
                next_num := nextval('cc_id_seq');
                -- Format as CC001, CC002, etc. (3 digits with leading zeros)
                new_cc_id := 'CC' || LPAD(next_num::TEXT, 3, '0');
                NEW.cc_id := new_cc_id;
            END IF;
            
            -- Ensure created_on is set if null
            IF NEW.created_on IS NULL THEN
                NEW.created_on := CURRENT_TIMESTAMP;
            END IF;
            
            RETURN NEW;
        END;
        $$ LANGUAGE plpgsql;
      `);
      
      // Create/update trigger
      await query(`
        DROP TRIGGER IF EXISTS trigger_generate_cc_id ON "tblCaseComplainantDetails";
        CREATE TRIGGER trigger_generate_cc_id
            BEFORE INSERT ON "tblCaseComplainantDetails"
            FOR EACH ROW
            EXECUTE FUNCTION generate_cc_id();
      `);
      
      console.log('cc_id auto-generation trigger created for tblCaseComplainantDetails');
    } catch (error) {
      console.log('Note: Could not fix cc_id:', error.message);
    }
    
    console.log('Fix completed successfully!');
  } catch (error) {
    console.error('Error fixing case_id and created_on:', error);
    throw error;
  }
};

// Run if executed directly
if (require.main === module) {
  fixCaseIdAndCreatedOn()
    .then(() => {
      console.log('Fix script completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Fix script failed:', error);
      process.exit(1);
    });
}

module.exports = fixCaseIdAndCreatedOn;

