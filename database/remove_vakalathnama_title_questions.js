const { query } = require('../config/database');
const fs = require('fs');
const path = require('path');

async function removeVakalathnamaTitleQuestions() {
  try {
    console.log('🔄 Removing vakalathnama title questions from TEMP-002...\n');

    // Read the SQL file
    const sqlFilePath = path.join(__dirname, 'remove_vakalathnama_title_questions.sql');
    const sql = fs.readFileSync(sqlFilePath, 'utf8');

    // Execute the SQL
    await query(sql);

    console.log('✅ Successfully removed vakalathnama title questions!\n');

    // Verify the questions
    console.log('📋 Verifying remaining questions...\n');
    const result = await query(`
      SELECT COUNT(*) as count
      FROM "tblPetitionTemplateQuestions"
      WHERE "ptm_id" IN (SELECT ptm_id FROM "tblPetitionTemplateMaster" WHERE "pet_number" = 'TEMP-002')
    `);

    console.log(`Total questions for TEMP-002: ${result.rows[0].count}\n`);

    // List remaining questions
    const questions = await query(`
      SELECT "question_id", "question_text", "display_order"
      FROM "tblPetitionTemplateQuestions"
      WHERE "ptm_id" IN (SELECT ptm_id FROM "tblPetitionTemplateMaster" WHERE "pet_number" = 'TEMP-002')
      ORDER BY "display_order" ASC
    `);

    console.log('Remaining questions:');
    questions.rows.forEach((row, index) => {
      console.log(`  ${index + 1}. [${row.question_id}] ${row.question_text}`);
    });

    console.log('\n✅ Removal complete!');
  } catch (error) {
    console.error('❌ Error removing questions:', error);
    process.exit(1);
  }
}

// Run the update
removeVakalathnamaTitleQuestions()
  .then(() => {
    console.log('\n✨ Done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  });

