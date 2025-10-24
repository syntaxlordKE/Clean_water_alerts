/*
  # Clean Water Alert System - Water Reports Table

  ## Purpose
  Create the core table for storing water supply issue reports submitted by users.

  ## New Tables
    - `water_reports`
      - `id` (uuid, primary key) - Unique identifier for each report
      - `title` (text) - Brief title of the water issue
      - `description` (text) - Detailed description of the problem
      - `location` (text) - Location/address of the water issue
      - `latitude` (numeric, nullable) - Geographic latitude coordinate
      - `longitude` (numeric, nullable) - Geographic longitude coordinate
      - `status` (text) - Current status: 'active', 'investigating', 'resolved'
      - `severity` (text) - Issue severity: 'low', 'medium', 'high', 'critical'
      - `reported_by` (text) - Name of person reporting
      - `contact_info` (text, nullable) - Optional contact information
      - `created_at` (timestamptz) - Timestamp when report was created
      - `updated_at` (timestamptz) - Timestamp when report was last updated

  ## Security
    - Enable RLS on `water_reports` table
    - Add policy for anyone to read reports (public information)
    - Add policy for anyone to create reports (anonymous reporting allowed)
    - Add policy for anyone to view all reports

  ## Notes
    - Status defaults to 'active' for new reports
    - Severity defaults to 'medium' if not specified
    - All timestamps default to current time
    - Public read access allows community awareness
    - Anonymous submissions enabled for easier reporting
*/

CREATE TABLE IF NOT EXISTS water_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  location text NOT NULL,
  latitude numeric,
  longitude numeric,
  status text NOT NULL DEFAULT 'active',
  severity text NOT NULL DEFAULT 'medium',
  reported_by text NOT NULL,
  contact_info text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE water_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view water reports"
  ON water_reports
  FOR SELECT
  USING (true);

CREATE POLICY "Anyone can create water reports"
  ON water_reports
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update water reports"
  ON water_reports
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Create index for faster queries on status and created_at
CREATE INDEX IF NOT EXISTS idx_water_reports_status ON water_reports(status);
CREATE INDEX IF NOT EXISTS idx_water_reports_created_at ON water_reports(created_at DESC);