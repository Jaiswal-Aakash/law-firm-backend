const { query } = require('../config/database');

async function checkExistingTables() {
  try {
    console.log('🔍 Checking existing table structures...\n');

    // Check tblLawFirmDetails
    const firmColumns = await query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'tblLawFirmDetails'
      ORDER BY ordinal_position
    `);
    
    console.log('📊 tblLawFirmDetails columns:');
    firmColumns.rows.forEach(col => {
      console.log(`  - ${col.column_name} (${col.data_type}, nullable: ${col.is_nullable})`);
    });

    // Check tblUsers
    const userColumns = await query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'tblUsers'
      ORDER BY ordinal_position
    `);
    
    console.log('\n📊 tblUsers columns:');
    userColumns.rows.forEach(col => {
      console.log(`  - ${col.column_name} (${col.data_type}, nullable: ${col.is_nullable})`);
    });

    // Check sample data
    const firmCount = await query('SELECT COUNT(*) as count FROM "tblLawFirmDetails"');
    const userCount = await query('SELECT COUNT(*) as count FROM "tblUsers"');
    
    console.log(`\n📊 Data counts:`);
    console.log(`  Firms: ${firmCount.rows[0].count}`);
    console.log(`  Users: ${userCount.rows[0].count}`);

    if (firmCount.rows[0].count > 0) {
      const sampleFirms = await query('SELECT * FROM "tblLawFirmDetails" LIMIT 3');
      console.log('\n📋 Sample firms:');
      sampleFirms.rows.forEach((firm, i) => {
        console.log(`  ${i + 1}.`, firm);
      });
    }

    if (userCount.rows[0].count > 0) {
      const sampleUsers = await query('SELECT * FROM "tblUsers" LIMIT 3');
      console.log('\n📋 Sample users:');
      sampleUsers.rows.forEach((user, i) => {
        console.log(`  ${i + 1}.`, user);
      });
    }

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

if (require.main === module) {
  checkExistingTables()
    .then(() => process.exit(0))
    .catch(err => {
      console.error('❌ Fatal error:', err);
      process.exit(1);
    });
}

module.exports = checkExistingTables;


