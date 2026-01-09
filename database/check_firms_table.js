const { query } = require('../config/database');

async function checkFirmsTable() {
  try {
    // Check if firms table exists
    const existsResult = await query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'firms'
      )
    `);
    
    const exists = existsResult.rows[0].exists;
    console.log('📊 firms table exists:', exists);
    
    if (exists) {
      const countResult = await query('SELECT COUNT(*) as count FROM firms');
      console.log('📊 firms table row count:', countResult.rows[0].count);
      
      if (parseInt(countResult.rows[0].count) > 0) {
        const sample = await query('SELECT * FROM firms LIMIT 3');
        console.log('\nSample firms data:');
        sample.rows.forEach((row, i) => {
          console.log(`  ${i + 1}. ID: ${row.id}, Name: ${row.firm_name}`);
        });
      }
    }
    
    // Check if Firm.js model is used anywhere
    console.log('\n🔍 Checking if Firm.js model is imported anywhere...');
    console.log('   (This requires manual code inspection)');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

checkFirmsTable();

