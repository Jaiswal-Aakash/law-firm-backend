-- Insert dummy data for Admin Panel testing
-- This creates sample firms and advocates for demonstration

-- Insert dummy firms first
INSERT INTO firms (firm_name, firm_address, firm_phone, firm_email, registration_number, status)
VALUES 
  ('ABC Law Associates', '123 Main Street, Coimbatore - 641001', '0422-1234567', 'info@abclaw.com', 'REG-001', 'Active'),
  ('XYZ Legal Services', '456 Park Avenue, Coimbatore - 641002', '0422-2345678', 'contact@xyzlegal.com', 'REG-002', 'Active'),
  ('Premier Law Firm', '789 Business District, Coimbatore - 641003', '0422-3456789', 'admin@premierlaw.com', 'REG-003', 'Active')
ON CONFLICT DO NOTHING;

-- Advocates for ABC Law Associates
INSERT INTO users (name, email, phone, status, role, firm_id)
SELECT 
  'John Doe',
  'john.doe@abclaw.com',
  '9876543210',
  'Pending',
  'Advocate',
  id
FROM firms WHERE firm_name = 'ABC Law Associates' LIMIT 1
ON CONFLICT (email) DO NOTHING;

INSERT INTO users (name, email, phone, status, role, firm_id)
SELECT 
  'Jane Smith',
  'jane.smith@abclaw.com',
  '9876543211',
  'Active',
  'Advocate',
  id
FROM firms WHERE firm_name = 'ABC Law Associates' LIMIT 1
ON CONFLICT (email) DO NOTHING;

INSERT INTO users (name, email, phone, status, role, firm_id)
SELECT 
  'Robert Johnson',
  'robert.johnson@abclaw.com',
  '9876543212',
  'Active',
  'Advocate',
  id
FROM firms WHERE firm_name = 'ABC Law Associates' LIMIT 1
ON CONFLICT (email) DO NOTHING;

-- Advocates for XYZ Legal Services
INSERT INTO users (name, email, phone, status, role, firm_id)
SELECT 
  'Sarah Williams',
  'sarah.williams@xyzlegal.com',
  '9876543213',
  'Pending',
  'Advocate',
  id
FROM firms WHERE firm_name = 'XYZ Legal Services' LIMIT 1
ON CONFLICT (email) DO NOTHING;

INSERT INTO users (name, email, phone, status, role, firm_id)
SELECT 
  'Michael Brown',
  'michael.brown@xyzlegal.com',
  '9876543214',
  'Active',
  'Advocate',
  id
FROM firms WHERE firm_name = 'XYZ Legal Services' LIMIT 1
ON CONFLICT (email) DO NOTHING;

-- Advocates for Premier Law Firm
INSERT INTO users (name, email, phone, status, role, firm_id)
SELECT 
  'Emily Davis',
  'emily.davis@premierlaw.com',
  '9876543215',
  'Inactive',
  'Advocate',
  id
FROM firms WHERE firm_name = 'Premier Law Firm' LIMIT 1
ON CONFLICT (email) DO NOTHING;

INSERT INTO users (name, email, phone, status, role, firm_id)
SELECT 
  'David Wilson',
  'david.wilson@premierlaw.com',
  '9876543216',
  'Active',
  'Advocate',
  id
FROM firms WHERE firm_name = 'Premier Law Firm' LIMIT 1
ON CONFLICT (email) DO NOTHING;

-- Advocates without a firm (firm_id = NULL)
INSERT INTO users (name, email, phone, status, role, firm_id)
VALUES 
  ('Lisa Anderson', 'lisa.anderson@example.com', '9876543217', 'Pending', 'Advocate', NULL),
  ('James Taylor', 'james.taylor@example.com', '9876543218', 'Active', 'Advocate', NULL),
  ('Maria Garcia', 'maria.garcia@example.com', '9876543219', 'Pending', 'Advocate', NULL)
ON CONFLICT (email) DO NOTHING;
