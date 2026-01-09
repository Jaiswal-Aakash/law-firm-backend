-- Add status column to tblUsers for activation/deactivation
ALTER TABLE "tblUsers" 
ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'Pending' CHECK (status IN ('Pending', 'Active', 'Inactive'));

-- Create index on status for faster filtering
CREATE INDEX IF NOT EXISTS idx_tblusers_status ON "tblUsers"(status);

-- Update existing users to have 'Pending' status if NULL
UPDATE "tblUsers" SET status = 'Pending' WHERE status IS NULL;


