-- Insert questions for TEMP-001 (Petition under Section 355(1) - Absence Condonation)
-- This uses a subquery to get the ptm_id dynamically based on pet_number

-- For TEMP-001
INSERT INTO "tblPetitionTemplateQuestions" ("ptm_id", "question_id", "question_text", "question_type", "is_required", "placeholder", "display_order")
SELECT ptm_id, 'num_accused', 'Number of Accused', 'number', true, 'Enter number of accused', 1
FROM "tblPetitionTemplateMaster" WHERE "pet_number" = 'TEMP-001'
ON CONFLICT ("ptm_id", "question_id") DO NOTHING;

INSERT INTO "tblPetitionTemplateQuestions" ("ptm_id", "question_id", "question_text", "question_type", "is_required", "placeholder", "display_order")
SELECT ptm_id, 'reason_accused', 'Reason for Accused', 'textarea', true, 'Enter reason for each accused', 2
FROM "tblPetitionTemplateMaster" WHERE "pet_number" = 'TEMP-001'
ON CONFLICT ("ptm_id", "question_id") DO NOTHING;

INSERT INTO "tblPetitionTemplateQuestions" ("ptm_id", "question_id", "question_text", "question_type", "is_required", "placeholder", "display_order")
SELECT ptm_id, 'court_name', 'Court Name', 'text', true, 'e.g., COIMBATORE', 3
FROM "tblPetitionTemplateMaster" WHERE "pet_number" = 'TEMP-001'
ON CONFLICT ("ptm_id", "question_id") DO NOTHING;

INSERT INTO "tblPetitionTemplateQuestions" ("ptm_id", "question_id", "question_text", "question_type", "is_required", "placeholder", "display_order")
SELECT ptm_id, 'section_number', 'Section Number', 'text', true, 'e.g., 355(1)', 4
FROM "tblPetitionTemplateMaster" WHERE "pet_number" = 'TEMP-001'
ON CONFLICT ("ptm_id", "question_id") DO NOTHING;

INSERT INTO "tblPetitionTemplateQuestions" ("ptm_id", "question_id", "question_text", "question_type", "is_required", "placeholder", "display_order")
SELECT ptm_id, 'respondent_name', 'Respondent Name', 'text', true, 'e.g., INSPECTOR OF POLICE', 5
FROM "tblPetitionTemplateMaster" WHERE "pet_number" = 'TEMP-001'
ON CONFLICT ("ptm_id", "question_id") DO NOTHING;

INSERT INTO "tblPetitionTemplateQuestions" ("ptm_id", "question_id", "question_text", "question_type", "is_required", "placeholder", "display_order")
SELECT ptm_id, 'respondent_station', 'Respondent Station', 'text', false, 'e.g., PERIYANAIKENPALAYAM POLICE STATION', 6
FROM "tblPetitionTemplateMaster" WHERE "pet_number" = 'TEMP-001'
ON CONFLICT ("ptm_id", "question_id") DO NOTHING;

INSERT INTO "tblPetitionTemplateQuestions" ("ptm_id", "question_id", "question_text", "question_type", "is_required", "placeholder", "display_order")
SELECT ptm_id, 'respondent_address', 'Respondent Address', 'textarea', true, 'Enter respondent address', 7
FROM "tblPetitionTemplateMaster" WHERE "pet_number" = 'TEMP-001'
ON CONFLICT ("ptm_id", "question_id") DO NOTHING;

INSERT INTO "tblPetitionTemplateQuestions" ("ptm_id", "question_id", "question_text", "question_type", "is_required", "placeholder", "display_order")
SELECT ptm_id, 'point1', 'Petition Point 1', 'textarea', true, 'Enter first point of the petition', 8
FROM "tblPetitionTemplateMaster" WHERE "pet_number" = 'TEMP-001'
ON CONFLICT ("ptm_id", "question_id") DO NOTHING;

INSERT INTO "tblPetitionTemplateQuestions" ("ptm_id", "question_id", "question_text", "question_type", "is_required", "placeholder", "display_order")
SELECT ptm_id, 'point2', 'Petition Point 2', 'textarea', true, 'Enter second point of the petition', 9
FROM "tblPetitionTemplateMaster" WHERE "pet_number" = 'TEMP-001'
ON CONFLICT ("ptm_id", "question_id") DO NOTHING;

INSERT INTO "tblPetitionTemplateQuestions" ("ptm_id", "question_id", "question_text", "question_type", "is_required", "placeholder", "display_order")
SELECT ptm_id, 'point3', 'Petition Point 3', 'textarea', true, 'Enter third point of the petition', 10
FROM "tblPetitionTemplateMaster" WHERE "pet_number" = 'TEMP-001'
ON CONFLICT ("ptm_id", "question_id") DO NOTHING;

INSERT INTO "tblPetitionTemplateQuestions" ("ptm_id", "question_id", "question_text", "question_type", "is_required", "placeholder", "display_order")
SELECT ptm_id, 'point4', 'Petition Point 4', 'textarea', true, 'Enter fourth point of the petition', 11
FROM "tblPetitionTemplateMaster" WHERE "pet_number" = 'TEMP-001'
ON CONFLICT ("ptm_id", "question_id") DO NOTHING;

INSERT INTO "tblPetitionTemplateQuestions" ("ptm_id", "question_id", "question_text", "question_type", "is_required", "placeholder", "display_order")
SELECT ptm_id, 'prayer', 'Prayer', 'textarea', true, 'Enter the prayer text', 12
FROM "tblPetitionTemplateMaster" WHERE "pet_number" = 'TEMP-001'
ON CONFLICT ("ptm_id", "question_id") DO NOTHING;

INSERT INTO "tblPetitionTemplateQuestions" ("ptm_id", "question_id", "question_text", "question_type", "is_required", "placeholder", "display_order")
SELECT ptm_id, 'place', 'Place', 'text', true, 'e.g., Coimbatore', 13
FROM "tblPetitionTemplateMaster" WHERE "pet_number" = 'TEMP-001'
ON CONFLICT ("ptm_id", "question_id") DO NOTHING;

INSERT INTO "tblPetitionTemplateQuestions" ("ptm_id", "question_id", "question_text", "question_type", "is_required", "placeholder", "display_order")
SELECT ptm_id, 'hearing_date', 'Hearing Date', 'text', true, 'e.g., 06/01/2026', 14
FROM "tblPetitionTemplateMaster" WHERE "pet_number" = 'TEMP-001'
ON CONFLICT ("ptm_id", "question_id") DO NOTHING;

INSERT INTO "tblPetitionTemplateQuestions" ("ptm_id", "question_id", "question_text", "question_type", "is_required", "placeholder", "display_order")
SELECT ptm_id, 'advocate_name', 'Advocate Name', 'text', true, 'Enter advocate name', 15
FROM "tblPetitionTemplateMaster" WHERE "pet_number" = 'TEMP-001'
ON CONFLICT ("ptm_id", "question_id") DO NOTHING;

INSERT INTO "tblPetitionTemplateQuestions" ("ptm_id", "question_id", "question_text", "question_type", "is_required", "placeholder", "display_order")
SELECT ptm_id, 'advocate_address', 'Advocate Address', 'textarea', false, 'Enter advocate address', 16
FROM "tblPetitionTemplateMaster" WHERE "pet_number" = 'TEMP-001'
ON CONFLICT ("ptm_id", "question_id") DO NOTHING;

INSERT INTO "tblPetitionTemplateQuestions" ("ptm_id", "question_id", "question_text", "question_type", "is_required", "placeholder", "display_order")
SELECT ptm_id, 'advocate_city', 'Advocate City', 'text', false, 'e.g., Coimbatore', 17
FROM "tblPetitionTemplateMaster" WHERE "pet_number" = 'TEMP-001'
ON CONFLICT ("ptm_id", "question_id") DO NOTHING;

INSERT INTO "tblPetitionTemplateQuestions" ("ptm_id", "question_id", "question_text", "question_type", "is_required", "placeholder", "display_order")
SELECT ptm_id, 'advocate_phone', 'Advocate Phone', 'text', false, 'Enter advocate phone number', 18
FROM "tblPetitionTemplateMaster" WHERE "pet_number" = 'TEMP-001'
ON CONFLICT ("ptm_id", "question_id") DO NOTHING;

-- Insert questions for TEMP-002 (Vakalathnama - Power of Attorney)
-- For TEMP-002
INSERT INTO "tblPetitionTemplateQuestions" ("ptm_id", "question_id", "question_text", "question_type", "is_required", "placeholder", "display_order")
SELECT ptm_id, 'num_accused', 'Number of Accused', 'number', true, 'Enter number of accused', 1
FROM "tblPetitionTemplateMaster" WHERE "pet_number" = 'TEMP-002'
ON CONFLICT ("ptm_id", "question_id") DO NOTHING;

INSERT INTO "tblPetitionTemplateQuestions" ("ptm_id", "question_id", "question_text", "question_type", "is_required", "placeholder", "display_order")
SELECT ptm_id, 'reason_accused', 'Reason for Accused', 'textarea', true, 'Enter reason for each accused', 2
FROM "tblPetitionTemplateMaster" WHERE "pet_number" = 'TEMP-002'
ON CONFLICT ("ptm_id", "question_id") DO NOTHING;

INSERT INTO "tblPetitionTemplateQuestions" ("ptm_id", "question_id", "question_text", "question_type", "is_required", "placeholder", "display_order")
SELECT ptm_id, 'tribunal_location', 'Tribunal Location', 'text', true, 'e.g., COIMBATORE', 3
FROM "tblPetitionTemplateMaster" WHERE "pet_number" = 'TEMP-002'
ON CONFLICT ("ptm_id", "question_id") DO NOTHING;

INSERT INTO "tblPetitionTemplateQuestions" ("ptm_id", "question_id", "question_text", "question_type", "is_required", "placeholder", "display_order")
SELECT ptm_id, 'applicant_name', 'Applicant Name', 'text', true, 'Enter applicant name', 4
FROM "tblPetitionTemplateMaster" WHERE "pet_number" = 'TEMP-002'
ON CONFLICT ("ptm_id", "question_id") DO NOTHING;

INSERT INTO "tblPetitionTemplateQuestions" ("ptm_id", "question_id", "question_text", "question_type", "is_required", "placeholder", "display_order")
SELECT ptm_id, 'applicant_branch', 'Applicant Branch', 'text', false, 'e.g., RAMNAGAR BRANCH', 5
FROM "tblPetitionTemplateMaster" WHERE "pet_number" = 'TEMP-002'
ON CONFLICT ("ptm_id", "question_id") DO NOTHING;

INSERT INTO "tblPetitionTemplateQuestions" ("ptm_id", "question_id", "question_text", "question_type", "is_required", "placeholder", "display_order")
SELECT ptm_id, 'applicant_address', 'Applicant Address', 'textarea', false, 'Enter applicant address', 6
FROM "tblPetitionTemplateMaster" WHERE "pet_number" = 'TEMP-002'
ON CONFLICT ("ptm_id", "question_id") DO NOTHING;

INSERT INTO "tblPetitionTemplateQuestions" ("ptm_id", "question_id", "question_text", "question_type", "is_required", "placeholder", "display_order")
SELECT ptm_id, 'oa_number', 'O.A. Number', 'text', true, 'e.g., 182', 7
FROM "tblPetitionTemplateMaster" WHERE "pet_number" = 'TEMP-002'
ON CONFLICT ("ptm_id", "question_id") DO NOTHING;

INSERT INTO "tblPetitionTemplateQuestions" ("ptm_id", "question_id", "question_text", "question_type", "is_required", "placeholder", "display_order")
SELECT ptm_id, 'oa_year', 'O.A. Year', 'text', true, 'e.g., 2025', 8
FROM "tblPetitionTemplateMaster" WHERE "pet_number" = 'TEMP-002'
ON CONFLICT ("ptm_id", "question_id") DO NOTHING;

INSERT INTO "tblPetitionTemplateQuestions" ("ptm_id", "question_id", "question_text", "question_type", "is_required", "placeholder", "display_order")
SELECT ptm_id, 'advocate_name', 'Advocate Name', 'text', true, 'Enter advocate name', 9
FROM "tblPetitionTemplateMaster" WHERE "pet_number" = 'TEMP-002'
ON CONFLICT ("ptm_id", "question_id") DO NOTHING;

INSERT INTO "tblPetitionTemplateQuestions" ("ptm_id", "question_id", "question_text", "question_type", "is_required", "placeholder", "display_order")
SELECT ptm_id, 'advocate_address', 'Advocate Address', 'textarea', false, 'Enter advocate address', 10
FROM "tblPetitionTemplateMaster" WHERE "pet_number" = 'TEMP-002'
ON CONFLICT ("ptm_id", "question_id") DO NOTHING;

INSERT INTO "tblPetitionTemplateQuestions" ("ptm_id", "question_id", "question_text", "question_type", "is_required", "placeholder", "display_order")
SELECT ptm_id, 'advocate_city', 'Advocate City', 'text', false, 'e.g., Coimbatore', 11
FROM "tblPetitionTemplateMaster" WHERE "pet_number" = 'TEMP-002'
ON CONFLICT ("ptm_id", "question_id") DO NOTHING;

INSERT INTO "tblPetitionTemplateQuestions" ("ptm_id", "question_id", "question_text", "question_type", "is_required", "placeholder", "display_order")
SELECT ptm_id, 'advocate_phone', 'Advocate Phone', 'text', false, 'Enter advocate phone number', 12
FROM "tblPetitionTemplateMaster" WHERE "pet_number" = 'TEMP-002'
ON CONFLICT ("ptm_id", "question_id") DO NOTHING;
-- Base questions (common to all templates)
(1, 'num_accused', 'Number of Accused', 'number', true, 'Enter number of accused', 1),
(1, 'reason_accused', 'Reason for Accused', 'textarea', true, 'Enter reason for each accused', 2),
-- TEMP-001 specific questions
(1, 'court_name', 'Court Name', 'text', true, 'e.g., COIMBATORE', 3),
(1, 'section_number', 'Section Number', 'text', true, 'e.g., 355(1)', 4),
(1, 'respondent_name', 'Respondent Name', 'text', true, 'e.g., INSPECTOR OF POLICE', 5),
(1, 'respondent_station', 'Respondent Station', 'text', false, 'e.g., PERIYANAIKENPALAYAM POLICE STATION', 6),
(1, 'respondent_address', 'Respondent Address', 'textarea', true, 'Enter respondent address', 7),
(1, 'point1', 'Petition Point 1', 'textarea', true, 'Enter first point of the petition', 8),
(1, 'point2', 'Petition Point 2', 'textarea', true, 'Enter second point of the petition', 9),
(1, 'point3', 'Petition Point 3', 'textarea', true, 'Enter third point of the petition', 10),
(1, 'point4', 'Petition Point 4', 'textarea', true, 'Enter fourth point of the petition', 11),
(1, 'prayer', 'Prayer', 'textarea', true, 'Enter the prayer text', 12),
(1, 'place', 'Place', 'text', true, 'e.g., Coimbatore', 13),
(1, 'hearing_date', 'Hearing Date', 'text', true, 'e.g., 06/01/2026', 14),
(1, 'advocate_name', 'Advocate Name', 'text', true, 'Enter advocate name', 15),
(1, 'advocate_address', 'Advocate Address', 'textarea', false, 'Enter advocate address', 16),
(1, 'advocate_city', 'Advocate City', 'text', false, 'e.g., Coimbatore', 17),
(1, 'advocate_phone', 'Advocate Phone', 'text', false, 'Enter advocate phone number', 18)
ON CONFLICT ("ptm_id", "question_id") DO NOTHING;

-- Insert questions for TEMP-002 (Vakalathnama - Power of Attorney)
-- For TEMP-002 (assuming ptm_id = 2, adjust based on your actual data)
INSERT INTO "tblPetitionTemplateQuestions" ("ptm_id", "question_id", "question_text", "question_type", "is_required", "placeholder", "display_order")
VALUES
-- Base questions (common to all templates)
(2, 'num_accused', 'Number of Accused', 'number', true, 'Enter number of accused', 1),
(2, 'reason_accused', 'Reason for Accused', 'textarea', true, 'Enter reason for each accused', 2),
-- TEMP-002 specific questions
(2, 'tribunal_location', 'Tribunal Location', 'text', true, 'e.g., COIMBATORE', 3),
(2, 'applicant_name', 'Applicant Name', 'text', true, 'Enter applicant name', 4),
(2, 'applicant_branch', 'Applicant Branch', 'text', false, 'e.g., RAMNAGAR BRANCH', 5),
(2, 'applicant_address', 'Applicant Address', 'textarea', false, 'Enter applicant address', 6),
(2, 'oa_number', 'O.A. Number', 'text', true, 'e.g., 182', 7),
(2, 'oa_year', 'O.A. Year', 'text', true, 'e.g., 2025', 8),
(2, 'advocate_name', 'Advocate Name', 'text', true, 'Enter advocate name', 9),
(2, 'advocate_address', 'Advocate Address', 'textarea', false, 'Enter advocate address', 10),
(2, 'advocate_city', 'Advocate City', 'text', false, 'e.g., Coimbatore', 11),
(2, 'advocate_phone', 'Advocate Phone', 'text', false, 'Enter advocate phone number', 12)
ON CONFLICT ("ptm_id", "question_id") DO NOTHING;

-- Note: Update the ptm_id values (1 and 2) based on the actual IDs in your tblPetitionTemplateMaster table
-- You can find the correct IDs by running: SELECT ptm_id, pet_number FROM "tblPetitionTemplateMaster";

