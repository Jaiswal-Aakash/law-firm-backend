const fs = require('fs');
const path = require('path');
const { query } = require('../config/database');

async function updateTemp002Questions() {
  try {
    console.log('🔄 Updating questions for TEMP-002 (Vakalathnama)...\n');

    // Read the SQL file
    const sqlFilePath = path.join(__dirname, 'update_temp002_questions.sql');
    const sql = fs.readFileSync(sqlFilePath, 'utf8');

    // Execute the SQL
    await query(sql);

    console.log('✅ Successfully updated questions for TEMP-002!\n');

    // Verify the questions
    console.log('📋 Verifying updated questions...\n');
    const result = await query(`
      SELECT 
        "question_id", 
        "question_text", 
        "question_type", 
        "is_required", 
        "display_order"
      FROM "tblPetitionTemplateQuestions"
      WHERE "ptm_id" IN (SELECT ptm_id FROM "tblPetitionTemplateMaster" WHERE "pet_number" = 'TEMP-002')
      ORDER BY "display_order" ASC
    `);

    console.log(`Found ${result.rows.length} questions for TEMP-002:\n`);
    result.rows.forEach((row, index) => {
      console.log(`${index + 1}. [${row.question_id}] ${row.question_text} (${row.question_type}, Required: ${row.is_required})`);
    });

    console.log('\n✅ Update complete!');
  } catch (error) {
    console.error('❌ Error updating questions:', error);
    process.exit(1);
  }
}

// Run the update
updateTemp002Questions()
  .then(() => {
    console.log('\n✨ Done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  });

