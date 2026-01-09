const { query } = require('../config/database');

async function checkAdminData() {
  try {
    console.log('🔍 Checking admin panel data...\n');

    // Check firms
    const firmsResult = await query('SELECT COUNT(*) as count FROM firms');
    console.log(`📊 Firms in database: ${firmsResult.rows[0].count}`);

    if (firmsResult.rows[0].count > 0) {
      const firms = await query('SELECT * FROM firms LIMIT 5');
      console.log('\nSample firms:');
      firms.rows.forEach((firm, index) => {
        console.log(`  ${index + 1}. ${firm.firm_name} (ID: ${firm.id}, Status: ${firm.status})`);
      });
    }

    // Check users with role='Advocate'
    const advocatesResult = await query(`
      SELECT COUNT(*) as count 
      FROM users 
      WHERE role = 'Advocate' OR role IS NULL
    `);
    console.log(`\n📊 Users (potential advocates) in database: ${advocatesResult.rows[0].count}`);

    // Check all users
    const allUsersResult = await query('SELECT COUNT(*) as count FROM users');
    console.log(`📊 Total users in database: ${allUsersResult.rows[0].count}`);

    if (allUsersResult.rows[0].count > 0) {
      const users = await query(`
        SELECT id, name, email, status, role, firm_id 
        FROM users 
        LIMIT 10
      `);
      console.log('\nSample users:');
      users.rows.forEach((user, index) => {
        console.log(`  ${index + 1}. ${user.name} (Email: ${user.email}, Status: ${user.status || 'NULL'}, Role: ${user.role || 'NULL'}, Firm ID: ${user.firm_id || 'NULL'})`);
      });
    }

    // Check users with status
    const statusCheck = await query(`
      SELECT status, COUNT(*) as count 
      FROM users 
      GROUP BY status
    `);
    console.log('\n📊 Users by status:');
    statusCheck.rows.forEach(row => {
      console.log(`  ${row.status || 'NULL'}: ${row.count}`);
    });

    console.log('\n✅ Data check complete!');
  } catch (error) {
    console.error('❌ Error checking data:', error);
  }
}

// Run if called directly
if (require.main === module) {
  checkAdminData()
    .then(() => {
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Fatal error:', error);
      process.exit(1);
    });
}

module.exports = checkAdminData;


