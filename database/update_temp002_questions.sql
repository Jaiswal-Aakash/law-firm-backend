-- Update questions for TEMP-002 (Vakalathnama - Power of Attorney)
-- Remove irrelevant fields and add missing ones based on actual template requirements

-- First, delete irrelevant questions for TEMP-002
DELETE FROM "tblPetitionTemplateQuestions" 
WHERE "ptm_id" IN (SELECT ptm_id FROM "tblPetitionTemplateMaster" WHERE "pet_number" = 'TEMP-002')
AND "question_id" IN ('num_accused', 'reason_accused');

-- Insert/Update correct questions for TEMP-002
-- Tribunal and Case Information
INSERT INTO "tblPetitionTemplateQuestions" ("ptm_id", "question_id", "question_text", "question_type", "is_required", "placeholder", "display_order")
SELECT ptm_id, 'tribunal_location', 'Tribunal Location', 'text', true, 'e.g., COIMBATORE', 1
FROM "tblPetitionTemplateMaster" WHERE "pet_number" = 'TEMP-002'
ON CONFLICT ("ptm_id", "question_id") DO UPDATE SET 
  "question_text" = EXCLUDED."question_text",
  "question_type" = EXCLUDED."question_type",
  "is_required" = EXCLUDED."is_required",
  "placeholder" = EXCLUDED."placeholder",
  "display_order" = EXCLUDED."display_order";

INSERT INTO "tblPetitionTemplateQuestions" ("ptm_id", "question_id", "question_text", "question_type", "is_required", "placeholder", "display_order")
SELECT ptm_id, 'oa_number', 'O.A. Number', 'text', true, 'e.g., 182', 2
FROM "tblPetitionTemplateMaster" WHERE "pet_number" = 'TEMP-002'
ON CONFLICT ("ptm_id", "question_id") DO UPDATE SET 
  "question_text" = EXCLUDED."question_text",
  "question_type" = EXCLUDED."question_type",
  "is_required" = EXCLUDED."is_required",
  "placeholder" = EXCLUDED."placeholder",
  "display_order" = EXCLUDED."display_order";

INSERT INTO "tblPetitionTemplateQuestions" ("ptm_id", "question_id", "question_text", "question_type", "is_required", "placeholder", "display_order")
SELECT ptm_id, 'oa_year', 'O.A. Year', 'text', true, 'e.g., 2025', 3
FROM "tblPetitionTemplateMaster" WHERE "pet_number" = 'TEMP-002'
ON CONFLICT ("ptm_id", "question_id") DO UPDATE SET 
  "question_text" = EXCLUDED."question_text",
  "question_type" = EXCLUDED."question_type",
  "is_required" = EXCLUDED."is_required",
  "placeholder" = EXCLUDED."placeholder",
  "display_order" = EXCLUDED."display_order";

-- Applicant Information
INSERT INTO "tblPetitionTemplateQuestions" ("ptm_id", "question_id", "question_text", "question_type", "is_required", "placeholder", "display_order")
SELECT ptm_id, 'applicant_name', 'Applicant Name', 'text', true, 'e.g., INDIAN BANK', 4
FROM "tblPetitionTemplateMaster" WHERE "pet_number" = 'TEMP-002'
ON CONFLICT ("ptm_id", "question_id") DO UPDATE SET 
  "question_text" = EXCLUDED."question_text",
  "question_type" = EXCLUDED."question_type",
  "is_required" = EXCLUDED."is_required",
  "placeholder" = EXCLUDED."placeholder",
  "display_order" = EXCLUDED."display_order";

INSERT INTO "tblPetitionTemplateQuestions" ("ptm_id", "question_id", "question_text", "question_type", "is_required", "placeholder", "display_order")
SELECT ptm_id, 'applicant_branch', 'Applicant Branch', 'text', false, 'e.g., RAMNAGAR BRANCH', 5
FROM "tblPetitionTemplateMaster" WHERE "pet_number" = 'TEMP-002'
ON CONFLICT ("ptm_id", "question_id") DO UPDATE SET 
  "question_text" = EXCLUDED."question_text",
  "question_type" = EXCLUDED."question_type",
  "is_required" = EXCLUDED."is_required",
  "placeholder" = EXCLUDED."placeholder",
  "display_order" = EXCLUDED."display_order";

INSERT INTO "tblPetitionTemplateQuestions" ("ptm_id", "question_id", "question_text", "question_type", "is_required", "placeholder", "display_order")
SELECT ptm_id, 'applicant_address', 'Applicant Address', 'textarea', false, 'e.g., COIMBATORE - 641 062.', 6
FROM "tblPetitionTemplateMaster" WHERE "pet_number" = 'TEMP-002'
ON CONFLICT ("ptm_id", "question_id") DO UPDATE SET 
  "question_text" = EXCLUDED."question_text",
  "question_type" = EXCLUDED."question_type",
  "is_required" = EXCLUDED."is_required",
  "placeholder" = EXCLUDED."placeholder",
  "display_order" = EXCLUDED."display_order";

-- Advocates Information (Multiple advocates with enrollment numbers)
INSERT INTO "tblPetitionTemplateQuestions" ("ptm_id", "question_id", "question_text", "question_type", "is_required", "placeholder", "display_order")
SELECT ptm_id, 'advocates_list', 'Advocates List (with enrollment numbers)', 'textarea', true, 'e.g., A.AASHIK ALI.B.A.LL.B., (MS.3368/2022), V.VIJAYA KUMAR.B.A.LL.B., (MS.909/2022)', 7
FROM "tblPetitionTemplateMaster" WHERE "pet_number" = 'TEMP-002'
ON CONFLICT ("ptm_id", "question_id") DO UPDATE SET 
  "question_text" = EXCLUDED."question_text",
  "question_type" = EXCLUDED."question_type",
  "is_required" = EXCLUDED."is_required",
  "placeholder" = EXCLUDED."placeholder",
  "display_order" = EXCLUDED."display_order";

INSERT INTO "tblPetitionTemplateQuestions" ("ptm_id", "question_id", "question_text", "question_type", "is_required", "placeholder", "display_order")
SELECT ptm_id, 'advocate_address', 'Advocate Address', 'textarea', true, 'e.g., 78/82, Semi Basement, Cheran Towers, Coimbatore-18', 8
FROM "tblPetitionTemplateMaster" WHERE "pet_number" = 'TEMP-002'
ON CONFLICT ("ptm_id", "question_id") DO UPDATE SET 
  "question_text" = EXCLUDED."question_text",
  "question_type" = EXCLUDED."question_type",
  "is_required" = EXCLUDED."is_required",
  "placeholder" = EXCLUDED."placeholder",
  "display_order" = EXCLUDED."display_order";

-- Execution Date
INSERT INTO "tblPetitionTemplateQuestions" ("ptm_id", "question_id", "question_text", "question_type", "is_required", "placeholder", "display_order")
SELECT ptm_id, 'execution_day', 'Execution Day', 'text', true, 'e.g., 1', 9
FROM "tblPetitionTemplateMaster" WHERE "pet_number" = 'TEMP-002'
ON CONFLICT ("ptm_id", "question_id") DO UPDATE SET 
  "question_text" = EXCLUDED."question_text",
  "question_type" = EXCLUDED."question_type",
  "is_required" = EXCLUDED."is_required",
  "placeholder" = EXCLUDED."placeholder",
  "display_order" = EXCLUDED."display_order";

INSERT INTO "tblPetitionTemplateQuestions" ("ptm_id", "question_id", "question_text", "question_type", "is_required", "placeholder", "display_order")
SELECT ptm_id, 'execution_month', 'Execution Month', 'text', true, 'e.g., September', 10
FROM "tblPetitionTemplateMaster" WHERE "pet_number" = 'TEMP-002'
ON CONFLICT ("ptm_id", "question_id") DO UPDATE SET 
  "question_text" = EXCLUDED."question_text",
  "question_type" = EXCLUDED."question_type",
  "is_required" = EXCLUDED."is_required",
  "placeholder" = EXCLUDED."placeholder",
  "display_order" = EXCLUDED."display_order";

INSERT INTO "tblPetitionTemplateQuestions" ("ptm_id", "question_id", "question_text", "question_type", "is_required", "placeholder", "display_order")
SELECT ptm_id, 'execution_year', 'Execution Year', 'text', true, 'e.g., 2025', 11
FROM "tblPetitionTemplateMaster" WHERE "pet_number" = 'TEMP-002'
ON CONFLICT ("ptm_id", "question_id") DO UPDATE SET 
  "question_text" = EXCLUDED."question_text",
  "question_type" = EXCLUDED."question_type",
  "is_required" = EXCLUDED."is_required",
  "placeholder" = EXCLUDED."placeholder",
  "display_order" = EXCLUDED."display_order";

-- Address for Service (Advocate Details)
INSERT INTO "tblPetitionTemplateQuestions" ("ptm_id", "question_id", "question_text", "question_type", "is_required", "placeholder", "display_order")
SELECT ptm_id, 'advocate_address_line1', 'Advocate Address Line 1', 'text', true, 'e.g., 78/82, Semi Basement,', 12
FROM "tblPetitionTemplateMaster" WHERE "pet_number" = 'TEMP-002'
ON CONFLICT ("ptm_id", "question_id") DO UPDATE SET 
  "question_text" = EXCLUDED."question_text",
  "question_type" = EXCLUDED."question_type",
  "is_required" = EXCLUDED."is_required",
  "placeholder" = EXCLUDED."placeholder",
  "display_order" = EXCLUDED."display_order";

INSERT INTO "tblPetitionTemplateQuestions" ("ptm_id", "question_id", "question_text", "question_type", "is_required", "placeholder", "display_order")
SELECT ptm_id, 'advocate_address_line2', 'Advocate Address Line 2', 'text', false, 'e.g., Govt. Arts College Road,', 13
FROM "tblPetitionTemplateMaster" WHERE "pet_number" = 'TEMP-002'
ON CONFLICT ("ptm_id", "question_id") DO UPDATE SET 
  "question_text" = EXCLUDED."question_text",
  "question_type" = EXCLUDED."question_type",
  "is_required" = EXCLUDED."is_required",
  "placeholder" = EXCLUDED."placeholder",
  "display_order" = EXCLUDED."display_order";

INSERT INTO "tblPetitionTemplateQuestions" ("ptm_id", "question_id", "question_text", "question_type", "is_required", "placeholder", "display_order")
SELECT ptm_id, 'advocate_address_line3', 'Advocate Address Line 3', 'text', false, 'e.g., Cheran Towers,', 14
FROM "tblPetitionTemplateMaster" WHERE "pet_number" = 'TEMP-002'
ON CONFLICT ("ptm_id", "question_id") DO UPDATE SET 
  "question_text" = EXCLUDED."question_text",
  "question_type" = EXCLUDED."question_type",
  "is_required" = EXCLUDED."is_required",
  "placeholder" = EXCLUDED."placeholder",
  "display_order" = EXCLUDED."display_order";

INSERT INTO "tblPetitionTemplateQuestions" ("ptm_id", "question_id", "question_text", "question_type", "is_required", "placeholder", "display_order")
SELECT ptm_id, 'advocate_city', 'Advocate City', 'text', true, 'e.g., Coimbatore', 15
FROM "tblPetitionTemplateMaster" WHERE "pet_number" = 'TEMP-002'
ON CONFLICT ("ptm_id", "question_id") DO UPDATE SET 
  "question_text" = EXCLUDED."question_text",
  "question_type" = EXCLUDED."question_type",
  "is_required" = EXCLUDED."is_required",
  "placeholder" = EXCLUDED."placeholder",
  "display_order" = EXCLUDED."display_order";

INSERT INTO "tblPetitionTemplateQuestions" ("ptm_id", "question_id", "question_text", "question_type", "is_required", "placeholder", "display_order")
SELECT ptm_id, 'advocate_phone', 'Advocate Phone', 'text', true, 'e.g., 93444 84069', 16
FROM "tblPetitionTemplateMaster" WHERE "pet_number" = 'TEMP-002'
ON CONFLICT ("ptm_id", "question_id") DO UPDATE SET 
  "question_text" = EXCLUDED."question_text",
  "question_type" = EXCLUDED."question_type",
  "is_required" = EXCLUDED."is_required",
  "placeholder" = EXCLUDED."placeholder",
  "display_order" = EXCLUDED."display_order";

INSERT INTO "tblPetitionTemplateQuestions" ("ptm_id", "question_id", "question_text", "question_type", "is_required", "placeholder", "display_order")
SELECT ptm_id, 'advocate_email', 'Advocate Email', 'text', false, 'e.g., aashiqalf12@gmail.com', 17
FROM "tblPetitionTemplateMaster" WHERE "pet_number" = 'TEMP-002'
ON CONFLICT ("ptm_id", "question_id") DO UPDATE SET 
  "question_text" = EXCLUDED."question_text",
  "question_type" = EXCLUDED."question_type",
  "is_required" = EXCLUDED."is_required",
  "placeholder" = EXCLUDED."placeholder",
  "display_order" = EXCLUDED."display_order";

-- Vakalathnama Title (for address section)
INSERT INTO "tblPetitionTemplateQuestions" ("ptm_id", "question_id", "question_text", "question_type", "is_required", "placeholder", "display_order")
SELECT ptm_id, 'vakalathnama_title_line1', 'Vakalathnama Title Line 1', 'text', false, 'e.g., VAKALATHNAMA FOR', 18
FROM "tblPetitionTemplateMaster" WHERE "pet_number" = 'TEMP-002'
ON CONFLICT ("ptm_id", "question_id") DO UPDATE SET 
  "question_text" = EXCLUDED."question_text",
  "question_type" = EXCLUDED."question_type",
  "is_required" = EXCLUDED."is_required",
  "placeholder" = EXCLUDED."placeholder",
  "display_order" = EXCLUDED."display_order";

INSERT INTO "tblPetitionTemplateQuestions" ("ptm_id", "question_id", "question_text", "question_type", "is_required", "placeholder", "display_order")
SELECT ptm_id, 'vakalathnama_title_line2', 'Vakalathnama Title Line 2', 'text', false, 'e.g., THE DEFENDANTS 1,2,3', 19
FROM "tblPetitionTemplateMaster" WHERE "pet_number" = 'TEMP-002'
ON CONFLICT ("ptm_id", "question_id") DO UPDATE SET 
  "question_text" = EXCLUDED."question_text",
  "question_type" = EXCLUDED."question_type",
  "is_required" = EXCLUDED."is_required",
  "placeholder" = EXCLUDED."placeholder",
  "display_order" = EXCLUDED."display_order";

-- Note: Defendants are automatically populated from selected case accused details
-- Note: Signatures (defendant_signature, advocate_signature, vakalathnama_signature) are handled separately via file uploads

