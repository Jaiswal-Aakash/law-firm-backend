-- Add missing questions for TEMP-001 (Petition under Section 355(1))
-- These are additional fields that the template needs but might be missing

-- For TEMP-001 - Add missing fields
INSERT INTO "tblPetitionTemplateQuestions" 
("ptm_id", "question_id", "question_text", "question_type", "is_required", "placeholder", "display_order")
SELECT ptm_id, 'court_full_name', 'Court Full Name', 'text', false, 'e.g., PRINCIPAL DISTRICT AND SESSIONS JUDGE OF COIMBATORE', 19
FROM "tblPetitionTemplateMaster" WHERE "pet_number" = 'TEMP-001'
ON CONFLICT ("ptm_id", "question_id") DO NOTHING;

INSERT INTO "tblPetitionTemplateQuestions" 
("ptm_id", "question_id", "question_text", "question_type", "is_required", "placeholder", "display_order")
SELECT ptm_id, 'advocate_email', 'Advocate Email', 'text', false, 'Enter advocate email address', 20
FROM "tblPetitionTemplateMaster" WHERE "pet_number" = 'TEMP-001'
ON CONFLICT ("ptm_id", "question_id") DO NOTHING;

INSERT INTO "tblPetitionTemplateQuestions" 
("ptm_id", "question_id", "question_text", "question_type", "is_required", "placeholder", "display_order")
SELECT ptm_id, 'advocate_address_line1', 'Advocate Address Line 1', 'text', false, 'e.g., 78/82, Semi Basement,', 21
FROM "tblPetitionTemplateMaster" WHERE "pet_number" = 'TEMP-001'
ON CONFLICT ("ptm_id", "question_id") DO NOTHING;

INSERT INTO "tblPetitionTemplateQuestions" 
("ptm_id", "question_id", "question_text", "question_type", "is_required", "placeholder", "display_order")
SELECT ptm_id, 'advocate_address_line2', 'Advocate Address Line 2', 'text', false, 'e.g., Govt. Arts College Road,', 22
FROM "tblPetitionTemplateMaster" WHERE "pet_number" = 'TEMP-001'
ON CONFLICT ("ptm_id", "question_id") DO NOTHING;

INSERT INTO "tblPetitionTemplateQuestions" 
("ptm_id", "question_id", "question_text", "question_type", "is_required", "placeholder", "display_order")
SELECT ptm_id, 'advocate_address_line3', 'Advocate Address Line 3', 'text', false, 'e.g., Cheran Towers,', 23
FROM "tblPetitionTemplateMaster" WHERE "pet_number" = 'TEMP-001'
ON CONFLICT ("ptm_id", "question_id") DO NOTHING;

-- For TEMP-002 (Vakalathnama) - Add missing fields
INSERT INTO "tblPetitionTemplateQuestions" 
("ptm_id", "question_id", "question_text", "question_type", "is_required", "placeholder", "display_order")
SELECT ptm_id, 'advocate_enrollment', 'Advocate Enrollment Number', 'text', false, 'e.g., MS.3368/2022', 13
FROM "tblPetitionTemplateMaster" WHERE "pet_number" = 'TEMP-002'
ON CONFLICT ("ptm_id", "question_id") DO NOTHING;

INSERT INTO "tblPetitionTemplateQuestions" 
("ptm_id", "question_id", "question_text", "question_type", "is_required", "placeholder", "display_order")
SELECT ptm_id, 'advocates_list', 'Advocates List', 'textarea', false, 'e.g., A.AASHIK ALI.B.A.LL.B., (MS.3368/2022), V.VIJAYA KUMAR.B.A.LL.B., (MS.909/2022)', 14
FROM "tblPetitionTemplateMaster" WHERE "pet_number" = 'TEMP-002'
ON CONFLICT ("ptm_id", "question_id") DO NOTHING;

INSERT INTO "tblPetitionTemplateQuestions" 
("ptm_id", "question_id", "question_text", "question_type", "is_required", "placeholder", "display_order")
SELECT ptm_id, 'advocate_email', 'Advocate Email', 'text', false, 'Enter advocate email address', 15
FROM "tblPetitionTemplateMaster" WHERE "pet_number" = 'TEMP-002'
ON CONFLICT ("ptm_id", "question_id") DO NOTHING;

INSERT INTO "tblPetitionTemplateQuestions" 
("ptm_id", "question_id", "question_text", "question_type", "is_required", "placeholder", "display_order")
SELECT ptm_id, 'advocate_address_line1', 'Advocate Address Line 1', 'text', false, 'e.g., 78/82, Semi Basement,', 16
FROM "tblPetitionTemplateMaster" WHERE "pet_number" = 'TEMP-002'
ON CONFLICT ("ptm_id", "question_id") DO NOTHING;

INSERT INTO "tblPetitionTemplateQuestions" 
("ptm_id", "question_id", "question_text", "question_type", "is_required", "placeholder", "display_order")
SELECT ptm_id, 'advocate_address_line2', 'Advocate Address Line 2', 'text', false, 'e.g., Govt. Arts College Road,', 17
FROM "tblPetitionTemplateMaster" WHERE "pet_number" = 'TEMP-002'
ON CONFLICT ("ptm_id", "question_id") DO NOTHING;

INSERT INTO "tblPetitionTemplateQuestions" 
("ptm_id", "question_id", "question_text", "question_type", "is_required", "placeholder", "display_order")
SELECT ptm_id, 'advocate_address_line3', 'Advocate Address Line 3', 'text', false, 'e.g., Cheran Towers,', 18
FROM "tblPetitionTemplateMaster" WHERE "pet_number" = 'TEMP-002'
ON CONFLICT ("ptm_id", "question_id") DO NOTHING;

INSERT INTO "tblPetitionTemplateQuestions" 
("ptm_id", "question_id", "question_text", "question_type", "is_required", "placeholder", "display_order")
SELECT ptm_id, 'execution_day', 'Execution Day', 'text', false, 'e.g., 30', 19
FROM "tblPetitionTemplateMaster" WHERE "pet_number" = 'TEMP-002'
ON CONFLICT ("ptm_id", "question_id") DO NOTHING;

INSERT INTO "tblPetitionTemplateQuestions" 
("ptm_id", "question_id", "question_text", "question_type", "is_required", "placeholder", "display_order")
SELECT ptm_id, 'execution_month', 'Execution Month', 'text', false, 'e.g., December', 20
FROM "tblPetitionTemplateMaster" WHERE "pet_number" = 'TEMP-002'
ON CONFLICT ("ptm_id", "question_id") DO NOTHING;

INSERT INTO "tblPetitionTemplateQuestions" 
("ptm_id", "question_id", "question_text", "question_type", "is_required", "placeholder", "display_order")
SELECT ptm_id, 'execution_year', 'Execution Year', 'text', false, 'e.g., 2025', 21
FROM "tblPetitionTemplateMaster" WHERE "pet_number" = 'TEMP-002'
ON CONFLICT ("ptm_id", "question_id") DO NOTHING;

