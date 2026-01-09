-- Add email verification token columns to tblUsers table
-- This migration adds verification_token and verification_token_expiry columns

-- Check if verification_token column exists, if not add it
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'tblUsers' 
        AND column_name = 'verification_token'
    ) THEN
        ALTER TABLE "tblUsers" 
        ADD COLUMN verification_token VARCHAR(255);
        
        CREATE INDEX IF NOT EXISTS idx_users_verification_token 
        ON "tblUsers"(verification_token);
        
        RAISE NOTICE 'verification_token column added successfully';
    ELSE
        RAISE NOTICE 'verification_token column already exists';
    END IF;
END $$;

-- Check if verification_token_expiry column exists, if not add it
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'tblUsers' 
        AND column_name = 'verification_token_expiry'
    ) THEN
        ALTER TABLE "tblUsers" 
        ADD COLUMN verification_token_expiry TIMESTAMP;
        
        RAISE NOTICE 'verification_token_expiry column added successfully';
    ELSE
        RAISE NOTICE 'verification_token_expiry column already exists';
    END IF;
END $$;

-- Check if email_verified column exists, if not add it (optional - can use status instead)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'tblUsers' 
        AND column_name = 'email_verified'
    ) THEN
        ALTER TABLE "tblUsers" 
        ADD COLUMN email_verified BOOLEAN DEFAULT FALSE;
        
        RAISE NOTICE 'email_verified column added successfully';
    ELSE
        RAISE NOTICE 'email_verified column already exists';
    END IF;
END $$;
