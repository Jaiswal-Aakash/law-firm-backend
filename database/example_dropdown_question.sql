-- Example: How to add a dropdown question to the database
-- This shows how to use the 'options' field for dropdown questions

-- Example 1: Court Name dropdown
INSERT INTO "tblPetitionTemplateQuestions" 
("ptm_id", "question_id", "question_text", "question_type", "is_required", "placeholder", "options", "display_order")
SELECT 
    ptm_id, 
    'court_name_dropdown', 
    'Court Name', 
    'dropdown',  -- Important: question_type must be 'dropdown'
    true, 
    'Select court name',
    '["COIMBATORE", "CHENNAI", "MADRAS", "BANGALORE", "HYDERABAD"]'::jsonb,  -- JSON array of options
    3
FROM "tblPetitionTemplateMaster" 
WHERE "pet_number" = 'TEMP-001'
ON CONFLICT ("ptm_id", "question_id") DO NOTHING;

-- Example 2: Section Number dropdown
INSERT INTO "tblPetitionTemplateQuestions" 
("ptm_id", "question_id", "question_text", "question_type", "is_required", "placeholder", "options", "display_order")
SELECT 
    ptm_id, 
    'section_number_dropdown', 
    'Section Number', 
    'dropdown',
    true, 
    'Select section number',
    '["355(1)", "355(2)", "356", "357", "358"]'::jsonb,
    4
FROM "tblPetitionTemplateMaster" 
WHERE "pet_number" = 'TEMP-001'
ON CONFLICT ("ptm_id", "question_id") DO NOTHING;

-- Example 3: Case Status dropdown
INSERT INTO "tblPetitionTemplateQuestions" 
("ptm_id", "question_id", "question_text", "question_type", "is_required", "placeholder", "options", "display_order")
SELECT 
    ptm_id, 
    'case_status', 
    'Case Status', 
    'dropdown',
    false, 
    'Select case status',
    '["Pending", "In Progress", "Completed", "Dismissed", "Closed"]'::jsonb,
    20
FROM "tblPetitionTemplateMaster" 
WHERE "pet_number" = 'TEMP-001'
ON CONFLICT ("ptm_id", "question_id") DO NOTHING;

-- Note: For non-dropdown questions (text, textarea, number), set options to NULL
-- Example of a regular text question (options is NULL):
INSERT INTO "tblPetitionTemplateQuestions" 
("ptm_id", "question_id", "question_text", "question_type", "is_required", "placeholder", "options", "display_order")
SELECT 
    ptm_id, 
    'advocate_name', 
    'Advocate Name', 
    'text',  -- Not a dropdown, so options is NULL
    true, 
    'Enter advocate name',
    NULL,  -- No options for text fields
    15
FROM "tblPetitionTemplateMaster" 
WHERE "pet_number" = 'TEMP-001'
ON CONFLICT ("ptm_id", "question_id") DO UPDATE SET
    "options" = NULL;  -- Ensure options is NULL for non-dropdown questions

