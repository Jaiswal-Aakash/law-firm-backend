-- Create tables for Admin Panel: Firms, Advocates, and User Status

-- 1. Update users table to include status and firm_id
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'Pending' CHECK (status IN ('Pending', 'Active', 'Inactive')),
ADD COLUMN IF NOT EXISTS firm_id INTEGER,
ADD COLUMN IF NOT EXISTS role VARCHAR(20) DEFAULT 'Advocate' CHECK (role IN ('Admin', 'Firm', 'Advocate')),
ADD COLUMN IF NOT EXISTS phone VARCHAR(20),
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

-- Create index on status for faster filtering
CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);
CREATE INDEX IF NOT EXISTS idx_users_firm_id ON users(firm_id);

-- 2. Create firms table
CREATE TABLE IF NOT EXISTS firms (
    id SERIAL PRIMARY KEY,
    firm_name VARCHAR(255) NOT NULL,
    firm_address TEXT,
    firm_phone VARCHAR(20),
    firm_email VARCHAR(255),
    registration_number VARCHAR(100),
    status VARCHAR(20) DEFAULT 'Active' CHECK (status IN ('Active', 'Inactive')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index on firm status
CREATE INDEX IF NOT EXISTS idx_firms_status ON firms(status);

-- 3. Add foreign key constraint for users.firm_id
-- Check if constraint exists before adding
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'fk_users_firm'
    ) THEN
        ALTER TABLE users
        ADD CONSTRAINT fk_users_firm 
        FOREIGN KEY (firm_id) REFERENCES firms(id) ON DELETE SET NULL;
    END IF;
END $$;

-- 4. Create advocates table (if needed separately, or use users with role='Advocate')
-- For now, we'll use users table with role='Advocate' and firm_id

-- 5. Create admin_users table to track admin access
CREATE TABLE IF NOT EXISTS admin_users (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL UNIQUE,
    admin_level VARCHAR(20) DEFAULT 'Admin' CHECK (admin_level IN ('SuperAdmin', 'Admin')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Add comments for documentation
COMMENT ON COLUMN users.status IS 'User account status: Pending, Active, or Inactive';
COMMENT ON COLUMN users.role IS 'User role: Admin, Firm, or Advocate';
COMMENT ON COLUMN users.firm_id IS 'Foreign key to firms table - links advocate to their firm';
COMMENT ON TABLE firms IS 'Stores law firm information';
COMMENT ON TABLE admin_users IS 'Tracks which users have admin access';

