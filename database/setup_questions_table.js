const { query } = require('../config/database');
const fs = require('fs');
const path = require('path');

async function setupQuestionsTable() {
  try {
    console.log('Setting up questions table...');
    
    // Read and execute table creation SQL
    const createTableSQL = fs.readFileSync(
      path.join(__dirname, 'create_questions_table.sql'),
      'utf8'
    );
    
    await query(createTableSQL);
    console.log('✅ Questions table created successfully');
    
    // Read and execute data insertion SQL
    const insertDataSQL = fs.readFileSync(
      path.join(__dirname, 'insert_questions_data.sql'),
      'utf8'
    );
    
    // Split by semicolons and execute each statement
    const statements = insertDataSQL
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
    
    console.log('✅ Questions data inserted successfully');
    
    // Verify the data
    const result = await query(
      'SELECT COUNT(*) as count FROM "tblPetitionTemplateQuestions"'
    );
    console.log(`✅ Total questions in database: ${result.rows[0].count}`);
    
    // Show questions per template
    const templateCounts = await query(`
      SELECT ptm.ptm_id, ptm.pet_number, COUNT(tq.tq_id) as question_count
      FROM "tblPetitionTemplateMaster" ptm
      LEFT JOIN "tblPetitionTemplateQuestions" tq ON ptm.ptm_id = tq.ptm_id
      GROUP BY ptm.ptm_id, ptm.pet_number
      ORDER BY ptm.ptm_id
    `);
    
    console.log('\nQuestions per template:');
    templateCounts.rows.forEach(row => {
      console.log(`  - ${row.pet_number} (ptm_id: ${row.ptm_id}): ${row.question_count} questions`);
    });
    
    console.log('\n✅ Setup completed successfully!');
  } catch (error) {
    console.error('❌ Error setting up questions table:', error);
    throw error;
  }
}

// Run if called directly
if (require.main === module) {
  setupQuestionsTable()
    .then(() => {
      console.log('Setup script completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Setup script failed:', error);
      process.exit(1);
    });
}

module.exports = setupQuestionsTable;

