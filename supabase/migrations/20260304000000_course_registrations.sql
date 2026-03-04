-- Course Registrations Table
CREATE TABLE IF NOT EXISTS course_registrations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  registration_id TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  location TEXT NOT NULL,
  course_title TEXT NOT NULL DEFAULT '1v1 Online Importation Class',
  amount NUMERIC(10, 2) NOT NULL DEFAULT 500.00,
  payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed')),
  payment_reference TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE course_registrations ENABLE ROW LEVEL SECURITY;

-- Allow public insert (for registration form)
CREATE POLICY "Anyone can register for a course" ON course_registrations
  FOR INSERT WITH CHECK (true);

-- Allow admin to read all registrations
CREATE POLICY "Admins can view all registrations" ON course_registrations
  FOR SELECT USING (true);

-- Allow updates to payment status (for callback)
CREATE POLICY "Allow payment status update" ON course_registrations
  FOR UPDATE USING (true);

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_course_registrations_registration_id ON course_registrations(registration_id);
CREATE INDEX IF NOT EXISTS idx_course_registrations_payment_status ON course_registrations(payment_status);
CREATE INDEX IF NOT EXISTS idx_course_registrations_created_at ON course_registrations(created_at DESC);

-- Add optional Snapchat handle field
ALTER TABLE course_registrations ADD COLUMN IF NOT EXISTS snapchat_handle TEXT;
