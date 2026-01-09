-- Remove vakalathnama title questions from TEMP-002 as they are now auto-generated
-- These fields are always the same: "VAKALATHNAMA FOR" and "THE DEFENDANTS 1,2,3" (numbers are dynamic)

DELETE FROM "tblPetitionTemplateQuestions" 
WHERE "ptm_id" IN (SELECT ptm_id FROM "tblPetitionTemplateMaster" WHERE "pet_number" = 'TEMP-002')
AND "question_id" IN ('vakalathnama_title_line1', 'vakalathnama_title_line2');

