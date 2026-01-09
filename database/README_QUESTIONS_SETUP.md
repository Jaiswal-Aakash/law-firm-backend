# Questions Table Setup

This directory contains SQL scripts to create and populate the `tblPetitionTemplateQuestions` table.

## Files

- `create_questions_table.sql` - Creates the questions table structure
- `insert_questions_data.sql` - Inserts questions for TEMP-001 and TEMP-002 templates
- `setup_questions_table.js` - Node.js script to run both SQL files automatically

## Setup Instructions

### Option 1: Using the Node.js Script (Recommended)

```bash
cd flutter/Mansoor-s-App-Backend
node database/setup_questions_table.js
```

### Option 2: Manual SQL Execution

1. Run the table creation script:
```sql
\i database/create_questions_table.sql
```

2. Run the data insertion script:
```sql
\i database/insert_questions_data.sql
```

### Option 3: Using psql Command Line

```bash
psql -U your_username -d your_database -f database/create_questions_table.sql
psql -U your_username -d your_database -f database/insert_questions_data.sql
```

## Table Structure

The `tblPetitionTemplateQuestions` table has the following columns:

- `tq_id` - Primary key (auto-increment)
- `ptm_id` - Foreign key to `tblPetitionTemplateMaster`
- `question_id` - Unique identifier (e.g., "num_accused", "court_name")
- `question_text` - The question text displayed to users
- `question_type` - Type of input: "text", "textarea", "number", "dropdown"
- `is_required` - Boolean indicating if the question is required
- `placeholder` - Placeholder text for the input field
- `options` - JSONB field for dropdown options (null for other types)
- `display_order` - Order in which questions should be displayed
- `created_on` - Timestamp
- `created_by` - User who created the question

## Unique Constraint

The table has a unique constraint on (`ptm_id`, `question_id`) to prevent duplicate questions for the same template.

## How It Works

1. The backend model (`PetitionTemplateMaster.js`) now fetches questions from the database
2. If no questions are found in the database, it falls back to the hardcoded questions (for backward compatibility)
3. Questions are fetched based on the `ptm_id` (template ID) and ordered by `display_order`

## Verifying Setup

After running the setup, you can verify by:

```sql
-- Check total questions
SELECT COUNT(*) FROM "tblPetitionTemplateQuestions";

-- Check questions per template
SELECT ptm.pet_number, COUNT(tq.tq_id) as question_count
FROM "tblPetitionTemplateMaster" ptm
LEFT JOIN "tblPetitionTemplateQuestions" tq ON ptm.ptm_id = tq.ptm_id
GROUP BY ptm.pet_number;

-- View all questions for a template
SELECT * FROM "tblPetitionTemplateQuestions" 
WHERE "ptm_id" = (SELECT ptm_id FROM "tblPetitionTemplateMaster" WHERE "pet_number" = 'TEMP-001')
ORDER BY "display_order";
```

