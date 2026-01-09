-- Migration script to convert case_id from INTEGER to VARCHAR and add auto-generation
-- Run this script manually if the table already exists with INTEGER case_id

-- Step 1: Convert existing integer case_ids to CASE format
UPDATE "tblCaseDetails" 
SET case_id = 'CASE' || LPAD(case_id::TEXT, 3, '0')
WHERE case_id !~ '^CASE[0-9]+$' AND case_id ~ '^[0-9]+$';

-- Step 2: Alter column type from INTEGER to VARCHAR
ALTER TABLE "tblCaseDetails" 
ALTER COLUMN case_id TYPE VARCHAR(50) USING case_id::VARCHAR(50);

-- Step 3: Remove default if it exists (SERIAL creates a default)
ALTER TABLE "tblCaseDetails" 
ALTER COLUMN case_id DROP DEFAULT IF EXISTS;

-- Step 4: Ensure created_on has default
ALTER TABLE "tblCaseDetails" 
ALTER COLUMN created_on SET DEFAULT CURRENT_TIMESTAMP;

-- Step 5: Update existing NULL created_on values
UPDATE "tblCaseDetails" 
SET created_on = CURRENT_TIMESTAMP 
WHERE created_on IS NULL;

-- Step 6: Create sequence if not exists
CREATE SEQUENCE IF NOT EXISTS case_id_seq START WITH 1;

-- Step 7: Initialize sequence based on existing data
DO $$
DECLARE
    max_num INTEGER;
BEGIN
    SELECT COALESCE(MAX(
        CASE 
            WHEN case_id ~ '^CASE[0-9]+$' 
            THEN CAST(SUBSTRING(case_id FROM 5) AS INTEGER)
            ELSE 0
        END
    ), 0) INTO max_num
    FROM "tblCaseDetails";
    
    IF max_num > 0 THEN
        PERFORM setval('case_id_seq', max_num + 1, false);
    END IF;
END $$;

-- Step 8: Create/update trigger function
CREATE OR REPLACE FUNCTION generate_case_id()
RETURNS TRIGGER AS $$
DECLARE
    next_num INTEGER;
    new_case_id VARCHAR(50);
BEGIN
    -- Only generate if case_id is NULL or empty or is an integer
    IF NEW.case_id IS NULL OR NEW.case_id = '' OR NEW.case_id ~ '^[0-9]+$' THEN
        -- Get next sequence number
        next_num := nextval('case_id_seq');
        -- Format as CASE001, CASE002, etc. (3 digits with leading zeros)
        new_case_id := 'CASE' || LPAD(next_num::TEXT, 3, '0');
        NEW.case_id := new_case_id;
    END IF;
    
    -- Ensure created_on is set if null
    IF NEW.created_on IS NULL THEN
        NEW.created_on := CURRENT_TIMESTAMP;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Step 9: Create/update trigger
DROP TRIGGER IF EXISTS trigger_generate_case_id ON "tblCaseDetails";
CREATE TRIGGER trigger_generate_case_id
    BEFORE INSERT ON "tblCaseDetails"
    FOR EACH ROW
    EXECUTE FUNCTION generate_case_id();

