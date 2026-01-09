const { query } = require('../config/database');
const fs = require('fs');
const path = require('path');
const initAdminTables = require('./init_admin');
const fixCaseIdAndCreatedOn = require('./fix_case_id');
const fixLawFirmTable = require('./fix_law_firm_table');
const fixUserTable = require('./fix_user_table');
const addVerificationToken = require('./add_verification_token');

// Initialize database with schema
const initDatabase = async () => {
  try {
    console.log('Initializing database...');
    
    // First, fix case_id and created_on if needed
    try {
      await fixCaseIdAndCreatedOn();
    } catch (error) {
      console.log('Note: Fix script had issues, continuing with init...', error.message);
    }
    
    // Fix law firm table structure
    try {
      await fixLawFirmTable();
    } catch (error) {
      console.log('Note: Law firm table fix had issues, continuing with init...', error.message);
    }
    
    // Fix user table structure
    try {
      await fixUserTable();
    } catch (error) {
      console.log('Note: User table fix had issues, continuing with init...', error.message);
    }
    
    // Add verification token columns to user table
    try {
      await addVerificationToken();
    } catch (error) {
      console.log('Note: Verification token columns had issues, continuing with init...', error.message);
    }
    
    // Read SQL file
    const sql = fs.readFileSync(
      path.join(__dirname, 'init.sql'),
      'utf8'
    );
    
    // Remove comments and split into lines
    const lines = sql.split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0 && !line.startsWith('--'));
    
    // Reconstruct SQL and split by semicolons, but preserve $$ blocks
    const fullSql = lines.join('\n');
    
    // Split statements manually, handling $$ delimiters
    const statements = [];
    let currentStatement = '';
    let inDollarBlock = false;
    let dollarDelimiter = '';
    
    for (let i = 0; i < fullSql.length; i++) {
      const char = fullSql[i];
      
      // Detect start of dollar-quoted block ($$ or $tag$)
      if (char === '$' && !inDollarBlock) {
        // Look ahead to find the full delimiter
        let delimiterEnd = i + 1;
        while (delimiterEnd < fullSql.length && fullSql[delimiterEnd] !== '$') {
          delimiterEnd++;
        }
        if (delimiterEnd < fullSql.length) {
          dollarDelimiter = fullSql.substring(i, delimiterEnd + 1);
          inDollarBlock = true;
          currentStatement += dollarDelimiter;
          i = delimiterEnd;
          continue;
        }
      }
      
      // Detect end of dollar-quoted block
      if (inDollarBlock) {
        const remaining = fullSql.length - i;
        if (remaining >= dollarDelimiter.length) {
          const potentialEnd = fullSql.substring(i, i + dollarDelimiter.length);
          if (potentialEnd === dollarDelimiter) {
            inDollarBlock = false;
            currentStatement += dollarDelimiter;
            i += dollarDelimiter.length - 1;
            continue;
          }
        }
      }
      
      currentStatement += char;
      
      // If not in dollar block and we hit a semicolon, end the statement
      if (!inDollarBlock && char === ';') {
        const stmt = currentStatement.trim();
        if (stmt.length > 0) {
          statements.push(stmt);
        }
        currentStatement = '';
      }
    }
    
    // Add any remaining statement
    if (currentStatement.trim().length > 0) {
      statements.push(currentStatement.trim());
    }
    
    // Execute each statement
    for (const statement of statements) {
      if (statement && statement.trim().length > 0) {
        await query(statement);
      }
    }
    
    // Initialize admin tables
    try {
      await initAdminTables();
    } catch (error) {
      console.log('Note: Admin tables initialization had issues, continuing...', error.message);
    }
    
    console.log('Database initialized successfully!');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
};

// Run initialization if this file is executed directly
if (require.main === module) {
  initDatabase()
    .then(() => {
      console.log('Database setup complete');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Database setup failed:', error);
      process.exit(1);
    });
}

module.exports = initDatabase;

