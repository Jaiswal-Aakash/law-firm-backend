const { query } = require('../config/database');
const fs = require('fs');
const path = require('path');

async function initAdminTables() {
  try {
    console.log('Creating admin tables...');
    
    // Read and execute admin tables SQL
    const adminTablesSQL = fs.readFileSync(
      path.join(__dirname, 'create_admin_tables.sql'),
      'utf8'
    );
    
    await query(adminTablesSQL);
    console.log('✅ Admin tables created successfully');
    
    return true;
  } catch (error) {
    // If tables already exist, that's okay
    if (error.message.includes('already exists') || error.message.includes('duplicate')) {
      console.log('ℹ️  Admin tables already exist, skipping creation');
      return true;
    }
    console.error('❌ Error creating admin tables:', error);
    throw error;
  }
}

module.exports = initAdminTables;


