-- Add template_name column to tblPetitionTemplateMaster
-- This allows template names to be stored in the database instead of being hardcoded

ALTER TABLE "tblPetitionTemplateMaster" 
ADD COLUMN IF NOT EXISTS "template_name" VARCHAR(255);

-- Update existing templates with their names
UPDATE "tblPetitionTemplateMaster" 
SET "template_name" = 'Petition under Section 355(1) - Absence Condonation'
WHERE "pet_number" = 'TEMP-001' AND "template_name" IS NULL;

UPDATE "tblPetitionTemplateMaster" 
SET "template_name" = 'Vakalathnama - Power of Attorney'
WHERE "pet_number" = 'TEMP-002' AND "template_name" IS NULL;

-- Add comment
COMMENT ON COLUMN "tblPetitionTemplateMaster"."template_name" IS 'Display name of the petition template';

