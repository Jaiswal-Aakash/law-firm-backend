const { query } = require('../config/database');

async function checkEmailVerified() {
  try {
    const result = await query('SELECT user_id, name, email, email_verified FROM "tblUsers" LIMIT 5');
    console.log('Sample users with email_verified:');
    result.rows.forEach(r => {
      console.log(`  User: ${r.name} | Email: ${r.email} | Verified: ${r.email_verified} | Type: ${typeof r.email_verified}`);
    });
    process.exit(0);
  } catch (e) {
    console.error('Error:', e.message);
    process.exit(1);
  }
}

checkEmailVerified();

