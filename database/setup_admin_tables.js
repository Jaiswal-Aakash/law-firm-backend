const { query } = require('../config/database');
const fs = require('fs');
const path = require('path');

async function setupAdminTables() {
  try {
    console.log('🔄 Setting up admin tables...\n');

    // Read the SQL file
    const sqlFilePath = path.join(__dirname, 'create_admin_tables.sql');
    const sql = fs.readFileSync(sqlFilePath, 'utf8');

    // Execute the SQL
    await query(sql);

    console.log('✅ Admin tables created successfully!\n');

    // Verify the tables
    console.log('📋 Verifying tables...\n');
    
    // Check firms table
    const firmsCheck = await query(`
      SELECT COUNT(*) as count FROM firms
    `);
    console.log(`Firms table: ${firmsCheck.rows[0].count} records`);

    // Check users table structure
    const usersColumns = await query(`
      SELECT column_name, data_type, column_default
      FROM information_schema.columns
      WHERE table_name = 'users'
      AND column_name IN ('status', 'firm_id', 'role', 'phone', 'updated_at')
      ORDER BY column_name
    `);
    console.log(`\nUsers table columns added: ${usersColumns.rows.length}`);
    usersColumns.rows.forEach(row => {
      console.log(`  - ${row.column_name} (${row.data_type})`);
    });

    // Check admin_users table
    const adminUsersCheck = await query(`
      SELECT COUNT(*) as count FROM admin_users
    `);
    console.log(`\nAdmin users table: ${adminUsersCheck.rows[0].count} records`);

    console.log('\n✅ Setup complete!');
  } catch (error) {
    // If tables already exist, that's okay
    if (error.message.includes('already exists') || error.message.includes('duplicate')) {
      console.log('ℹ️  Admin tables already exist, skipping creation');
      return;
    }
    console.error('❌ Error setting up admin tables:', error);
    throw error;
  }
}

// Run if called directly
if (require.main === module) {
  setupAdminTables()
    .then(() => {
      console.log('\n✨ Done!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Fatal error:', error);
      process.exit(1);
    });
}

module.exports = setupAdminTables;


