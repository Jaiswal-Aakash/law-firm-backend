const { query } = require('../config/database');

async function exploreTables() {
  try {
    console.log('🔍 Exploring database tables...\n');
    
    // Get all tables
    const tablesResult = await query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE' 
      ORDER BY table_name
    `);
    
    console.log('📋 Existing Tables:');
    console.log('='.repeat(50));
    tablesResult.rows.forEach((row, index) => {
      console.log(`${index + 1}. ${row.table_name}`);
    });
    
    // Get columns for tblUsers
    console.log('\n📊 tblUsers Table Structure:');
    console.log('='.repeat(50));
    const tblUsersCols = await query(`
      SELECT 
        column_name, 
        data_type, 
        is_nullable,
        column_default
      FROM information_schema.columns 
      WHERE table_name = 'tblUsers' 
      ORDER BY ordinal_position
    `);
    tblUsersCols.rows.forEach(col => {
      const nullable = col.is_nullable === 'YES' ? 'NULL' : 'NOT NULL';
      const defaultVal = col.column_default ? ` DEFAULT ${col.column_default}` : '';
      console.log(`  - ${col.column_name.padEnd(25)} ${col.data_type.padEnd(20)} ${nullable}${defaultVal}`);
    });
    
    // Get columns for tblLawFirmDetails
    console.log('\n📊 tblLawFirmDetails Table Structure:');
    console.log('='.repeat(50));
    const tblLawFirmCols = await query(`
      SELECT 
        column_name, 
        data_type, 
        is_nullable,
        column_default
      FROM information_schema.columns 
      WHERE table_name = 'tblLawFirmDetails' 
      ORDER BY ordinal_position
    `);
    tblLawFirmCols.rows.forEach(col => {
      const nullable = col.is_nullable === 'YES' ? 'NULL' : 'NOT NULL';
      const defaultVal = col.column_default ? ` DEFAULT ${col.column_default}` : '';
      console.log(`  - ${col.column_name.padEnd(25)} ${col.data_type.padEnd(20)} ${nullable}${defaultVal}`);
    });
    
    // Check relationship
    console.log('\n🔗 Relationship Check:');
    console.log('='.repeat(50));
    const relationshipCheck = await query(`
      SELECT 
        u.user_id,
        u.name,
        u.law_firm,
        l.l_id,
        l.l_name as firm_name
      FROM "tblUsers" u
      LEFT JOIN "tblLawFirmDetails" l ON u.law_firm = l.l_id
      LIMIT 5
    `);
    if (relationshipCheck.rows.length > 0) {
      console.log('Sample relationship data:');
      relationshipCheck.rows.forEach(row => {
        console.log(`  User: ${row.name} (${row.user_id}) → Firm: ${row.firm_name || 'NULL'} (${row.law_firm || 'NULL'})`);
      });
    } else {
      console.log('No data found in tables');
    }
    
    // Check status column
    console.log('\n✅ Status Column Check:');
    console.log('='.repeat(50));
    const statusCheck = await query(`
      SELECT 
        status,
        COUNT(*) as count
      FROM "tblUsers"
      GROUP BY status
    `);
    if (statusCheck.rows.length > 0) {
      statusCheck.rows.forEach(row => {
        console.log(`  ${row.status || 'NULL'}: ${row.count} users`);
      });
    }
    
    console.log('\n✅ Database exploration complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error exploring database:', error);
    process.exit(1);
  }
}

exploreTables();

