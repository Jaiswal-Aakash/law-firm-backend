const { query } = require('../config/database');
const fs = require('fs');
const path = require('path');

async function insertDummyAdminData() {
  try {
    console.log('🔄 Inserting dummy admin data...\n');

    // Read the SQL file
    const sqlFilePath = path.join(__dirname, 'insert_dummy_admin_data.sql');
    const sql = fs.readFileSync(sqlFilePath, 'utf8');

    // Split by semicolons and execute each statement
    const statements = sql
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));

    for (const statement of statements) {
      if (statement.trim()) {
        try {
          await query(statement);
        } catch (err) {
          // Ignore duplicate key errors (ON CONFLICT DO NOTHING)
          if (!err.message.includes('duplicate key') && !err.message.includes('already exists')) {
            console.warn('Warning executing statement:', err.message);
          }
        }
      }
    }

    console.log('✅ Dummy data inserted successfully!\n');

    // Verify the data
    console.log('📋 Verifying inserted data...\n');
    
    // Check firms
    const firmsResult = await query('SELECT COUNT(*) as count FROM firms');
    console.log(`Firms: ${firmsResult.rows[0].count}`);

    // Check advocates
    const advocatesResult = await query(`
      SELECT COUNT(*) as count 
      FROM users 
      WHERE role = 'Advocate' OR role IS NULL
    `);
    console.log(`Advocates: ${advocatesResult.rows[0].count}`);

    // Show sample data
    const firms = await query('SELECT id, firm_name, status FROM firms ORDER BY id');
    console.log('\n📊 Firms:');
    firms.rows.forEach(firm => {
      console.log(`  ${firm.id}. ${firm.firm_name} (${firm.status})`);
    });

    const advocates = await query(`
      SELECT u.id, u.name, u.status, f.firm_name 
      FROM users u 
      LEFT JOIN firms f ON u.firm_id = f.id 
      WHERE u.role = 'Advocate' OR u.role IS NULL
      ORDER BY f.firm_name NULLS LAST, u.name
      LIMIT 10
    `);
    console.log('\n📊 Advocates:');
    advocates.rows.forEach(adv => {
      const firmInfo = adv.firm_name ? ` (${adv.firm_name})` : ' (No Firm)';
      console.log(`  ${adv.id}. ${adv.name} - ${adv.status}${firmInfo}`);
    });

    console.log('\n✅ Dummy data setup complete!');
  } catch (error) {
    console.error('❌ Error inserting dummy data:', error);
    throw error;
  }
}

// Run if called directly
if (require.main === module) {
  insertDummyAdminData()
    .then(() => {
      console.log('\n✨ Done!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Fatal error:', error);
      process.exit(1);
    });
}

module.exports = insertDummyAdminData;


