-- Create tblUsers table
CREATE TABLE IF NOT EXISTS "tblUsers" (
    user_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone_number VARCHAR(50),
    address TEXT,
    law_firm VARCHAR(255),
    password VARCHAR(255) NOT NULL,
    created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(255),
    reset_token VARCHAR(255),
    reset_token_expiry TIMESTAMP
);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_tbl_users_email ON "tblUsers"(email);

-- Create index on created_on for sorting
CREATE INDEX IF NOT EXISTS idx_tbl_users_created_on ON "tblUsers"(created_on);

-- Create law firms table for managing law firms
CREATE TABLE IF NOT EXISTS "tblLawFirms" (
    firm_id SERIAL PRIMARY KEY,
    firm_name VARCHAR(255) UNIQUE NOT NULL,
    created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(255)
);

-- Create index on firm_name for faster lookups
CREATE INDEX IF NOT EXISTS idx_law_firms_name ON "tblLawFirms"(firm_name);

-- Create tblCaseDetails table (actual structure)
-- Note: Table already exists in database with these fields:
-- case_id, description, sc_no, created_on, created_by
CREATE TABLE IF NOT EXISTS "tblCaseDetails" (
    case_id VARCHAR(50) PRIMARY KEY,
    description TEXT NOT NULL,
    sc_no VARCHAR(255) UNIQUE NOT NULL,
    created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(255)
);

-- Migrate existing table if case_id is INTEGER
-- Note: The fix_case_id.js script handles the migration
-- These statements will be executed by the fix script, but we include them here for reference

-- Create sequence for auto-generating case_id numbers
CREATE SEQUENCE IF NOT EXISTS case_id_seq START WITH 1;

-- Function to generate case_id (CASE001, CASE002, etc.)
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

-- Trigger to auto-generate case_id before insert
-- Always fires to ensure case_id is generated
DROP TRIGGER IF EXISTS trigger_generate_case_id ON "tblCaseDetails";
CREATE TRIGGER trigger_generate_case_id
    BEFORE INSERT ON "tblCaseDetails"
    FOR EACH ROW
    EXECUTE FUNCTION generate_case_id();

-- Initialize sequence based on existing data (if any)
-- This ensures new case_ids continue from the highest existing number
DO $$
DECLARE
    max_num INTEGER;
BEGIN
    -- Try to extract the maximum number from existing case_ids
    SELECT COALESCE(MAX(
        CASE 
            WHEN case_id ~ '^CASE[0-9]+$' 
            THEN CAST(SUBSTRING(case_id FROM 5) AS INTEGER)
            ELSE 0
        END
    ), 0) INTO max_num
    FROM "tblCaseDetails";
    
    -- Set sequence to continue from max_num + 1
    IF max_num > 0 THEN
        PERFORM setval('case_id_seq', max_num + 1, false);
    END IF;
END $$;

-- Create index on sc_no for faster lookups
CREATE INDEX IF NOT EXISTS idx_case_details_sc_no ON "tblCaseDetails"(sc_no);

-- Create index on created_on for sorting
CREATE INDEX IF NOT EXISTS idx_case_details_created_on ON "tblCaseDetails"(created_on);

-- Create index on created_by for filtering
CREATE INDEX IF NOT EXISTS idx_case_details_created_by ON "tblCaseDetails"(created_by);

-- Create tblCaseAccusedDetails table (actual structure)
-- Note: Table already exists in database with these fields:
-- ca_id, case_id, ca_name, ca_phone_number, ca_email, ca_address, accused_no, ca_signature_path, created_on, created_by
CREATE TABLE IF NOT EXISTS "tblCaseAccusedDetails" (
    ca_id VARCHAR(50) PRIMARY KEY,
    case_id VARCHAR(50) NOT NULL,
    ca_name VARCHAR(255) NOT NULL,
    ca_phone_number VARCHAR(50),
    ca_email VARCHAR(255),
    ca_address TEXT,
    accused_no VARCHAR(255),
    ca_signature_path VARCHAR(500),
    created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(255)
);

-- Create sequence for auto-generating ca_id numbers
CREATE SEQUENCE IF NOT EXISTS ca_id_seq START WITH 1;

-- Function to generate ca_id (CA001, CA002, etc.)
CREATE OR REPLACE FUNCTION generate_ca_id()
RETURNS TRIGGER AS $$
DECLARE
    next_num INTEGER;
    new_ca_id VARCHAR(50);
BEGIN
    -- Only generate if ca_id is NULL or empty or is an integer
    IF NEW.ca_id IS NULL OR NEW.ca_id = '' OR NEW.ca_id ~ '^[0-9]+$' THEN
        -- Get next sequence number
        next_num := nextval('ca_id_seq');
        -- Format as CA001, CA002, etc. (3 digits with leading zeros)
        new_ca_id := 'CA' || LPAD(next_num::TEXT, 3, '0');
        NEW.ca_id := new_ca_id;
    END IF;
    
    -- Ensure created_on is set if null
    IF NEW.created_on IS NULL THEN
        NEW.created_on := CURRENT_TIMESTAMP;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-generate ca_id before insert
DROP TRIGGER IF EXISTS trigger_generate_ca_id ON "tblCaseAccusedDetails";
CREATE TRIGGER trigger_generate_ca_id
    BEFORE INSERT ON "tblCaseAccusedDetails"
    FOR EACH ROW
    EXECUTE FUNCTION generate_ca_id();

-- Initialize sequence based on existing data (if any)
DO $$
DECLARE
    max_num INTEGER;
BEGIN
    -- Try to extract the maximum number from existing ca_ids
    SELECT COALESCE(MAX(
        CASE 
            WHEN ca_id ~ '^CA[0-9]+$' 
            THEN CAST(SUBSTRING(ca_id FROM 3) AS INTEGER)
            ELSE 0
        END
    ), 0) INTO max_num
    FROM "tblCaseAccusedDetails";
    
    -- Set sequence to continue from max_num + 1
    IF max_num > 0 THEN
        PERFORM setval('ca_id_seq', max_num + 1, false);
    END IF;
END $$;

-- Create index on case_id for faster lookups (foreign key relationship)
CREATE INDEX IF NOT EXISTS idx_accused_details_case_id ON "tblCaseAccusedDetails"(case_id);

-- Create index on accused_no for faster lookups
CREATE INDEX IF NOT EXISTS idx_accused_details_accused_no ON "tblCaseAccusedDetails"(accused_no);

-- Create index on created_on for sorting
CREATE INDEX IF NOT EXISTS idx_accused_details_created_on ON "tblCaseAccusedDetails"(created_on);

-- Create index on created_by for filtering
CREATE INDEX IF NOT EXISTS idx_accused_details_created_by ON "tblCaseAccusedDetails"(created_by);

-- Create tblCaseComplainantDetails table (actual structure)
-- Note: Table already exists in database with these fields:
-- cc_id, case_id, cc_name, cc_address, cc_phone_number, cc_mail, created_on, created_by
CREATE TABLE IF NOT EXISTS "tblCaseComplainantDetails" (
    cc_id VARCHAR(50) PRIMARY KEY,
    case_id VARCHAR(50) NOT NULL,
    cc_name VARCHAR(255) NOT NULL,
    cc_address TEXT,
    cc_phone_number VARCHAR(50),
    cc_mail VARCHAR(255),
    created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(255)
);

-- Create sequence for auto-generating cc_id numbers
CREATE SEQUENCE IF NOT EXISTS cc_id_seq START WITH 1;

-- Function to generate cc_id (CC001, CC002, etc.)
CREATE OR REPLACE FUNCTION generate_cc_id()
RETURNS TRIGGER AS $$
DECLARE
    next_num INTEGER;
    new_cc_id VARCHAR(50);
BEGIN
    -- Only generate if cc_id is NULL or empty or is an integer
    IF NEW.cc_id IS NULL OR NEW.cc_id = '' OR NEW.cc_id ~ '^[0-9]+$' THEN
        -- Get next sequence number
        next_num := nextval('cc_id_seq');
        -- Format as CC001, CC002, etc. (3 digits with leading zeros)
        new_cc_id := 'CC' || LPAD(next_num::TEXT, 3, '0');
        NEW.cc_id := new_cc_id;
    END IF;
    
    -- Ensure created_on is set if null
    IF NEW.created_on IS NULL THEN
        NEW.created_on := CURRENT_TIMESTAMP;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-generate cc_id before insert
DROP TRIGGER IF EXISTS trigger_generate_cc_id ON "tblCaseComplainantDetails";
CREATE TRIGGER trigger_generate_cc_id
    BEFORE INSERT ON "tblCaseComplainantDetails"
    FOR EACH ROW
    EXECUTE FUNCTION generate_cc_id();

-- Initialize sequence based on existing data (if any)
DO $$
DECLARE
    max_num INTEGER;
BEGIN
    -- Try to extract the maximum number from existing cc_ids
    SELECT COALESCE(MAX(
        CASE 
            WHEN cc_id ~ '^CC[0-9]+$' 
            THEN CAST(SUBSTRING(cc_id FROM 3) AS INTEGER)
            ELSE 0
        END
    ), 0) INTO max_num
    FROM "tblCaseComplainantDetails";
    
    -- Set sequence to continue from max_num + 1
    IF max_num > 0 THEN
        PERFORM setval('cc_id_seq', max_num + 1, false);
    END IF;
END $$;

-- Create index on case_id for faster lookups (foreign key relationship)
CREATE INDEX IF NOT EXISTS idx_complainant_details_case_id ON "tblCaseComplainantDetails"(case_id);

-- Create index on created_on for sorting
CREATE INDEX IF NOT EXISTS idx_complainant_details_created_on ON "tblCaseComplainantDetails"(created_on);

-- Create index on created_by for filtering
CREATE INDEX IF NOT EXISTS idx_complainant_details_created_by ON "tblCaseComplainantDetails"(created_by);

-- Note: Working with existing tblPetitionTemplateMaster table structure
-- Questions are generated dynamically in the model based on PetitionNumber
-- No table or column modifications - using only existing columns

