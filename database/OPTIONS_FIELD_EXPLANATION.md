# Options Field Explanation

## What is the `options` field?

The `options` field in `tblPetitionTemplateQuestions` is a **JSONB column** that stores dropdown options for questions that have `question_type = 'dropdown'`.

## When to Use It

- ✅ **Use `options`**: When `question_type = 'dropdown'`
- ❌ **Don't use `options`**: When `question_type = 'text'`, `'textarea'`, or `'number'` (set to `NULL`)

## Data Format

The `options` field stores a **JSON array of strings**:

```json
["Option 1", "Option 2", "Option 3"]
```

## Examples

### Example 1: Court Name Dropdown

```sql
INSERT INTO "tblPetitionTemplateQuestions" 
("ptm_id", "question_id", "question_text", "question_type", "is_required", "options", "display_order")
SELECT 
    ptm_id, 
    'court_name', 
    'Court Name', 
    'dropdown',  -- Must be 'dropdown'
    true, 
    '["COIMBATORE", "CHENNAI", "MADRAS", "BANGALORE"]'::jsonb,  -- JSON array
    3
FROM "tblPetitionTemplateMaster" 
WHERE "pet_number" = 'TEMP-001';
```

### Example 2: Section Number Dropdown

```sql
INSERT INTO "tblPetitionTemplateQuestions" 
("ptm_id", "question_id", "question_text", "question_type", "is_required", "options", "display_order")
SELECT 
    ptm_id, 
    'section_number', 
    'Section Number', 
    'dropdown',
    true, 
    '["355(1)", "355(2)", "356", "357"]'::jsonb,
    4
FROM "tblPetitionTemplateMaster" 
WHERE "pet_number" = 'TEMP-001';
```

### Example 3: Regular Text Question (No Options)

```sql
INSERT INTO "tblPetitionTemplateQuestions" 
("ptm_id", "question_id", "question_text", "question_type", "is_required", "placeholder", "options", "display_order")
SELECT 
    ptm_id, 
    'advocate_name', 
    'Advocate Name', 
    'text',  -- Not dropdown, so options is NULL
    true, 
    'Enter advocate name',
    NULL,  -- No options for text fields
    15
FROM "tblPetitionTemplateMaster" 
WHERE "pet_number" = 'TEMP-001';
```

## How It Works in the Application

1. **Backend**: The `PetitionTemplateMaster` model fetches questions and includes the `options` field
2. **API Response**: Returns questions with `options` as a JSON array (or `null` for non-dropdown questions)
3. **Flutter App**: 
   - If `questionType == 'dropdown'` and `options != null`, displays a dropdown
   - Otherwise, displays a text field, textarea, or number input

## Current Questions

Currently, all questions in the database are:
- `text` type (like "Court Name", "Section Number")
- `textarea` type (like "Petition Point 1", "Prayer")
- `number` type (like "Number of Accused")

**None of them use dropdowns yet**, so all have `options = NULL`.

## Adding a Dropdown Question

To add a dropdown question:

1. Set `question_type = 'dropdown'`
2. Set `options` to a JSON array: `'["Option 1", "Option 2"]'::jsonb`
3. The Flutter app will automatically render it as a dropdown

## Updating Existing Questions to Dropdowns

If you want to convert an existing text question to a dropdown:

```sql
-- Convert "Court Name" from text to dropdown
UPDATE "tblPetitionTemplateQuestions"
SET 
    "question_type" = 'dropdown',
    "options" = '["COIMBATORE", "CHENNAI", "MADRAS", "BANGALORE", "HYDERABAD"]'::jsonb
WHERE "question_id" = 'court_name' 
  AND "ptm_id" = (SELECT ptm_id FROM "tblPetitionTemplateMaster" WHERE "pet_number" = 'TEMP-001');
```

