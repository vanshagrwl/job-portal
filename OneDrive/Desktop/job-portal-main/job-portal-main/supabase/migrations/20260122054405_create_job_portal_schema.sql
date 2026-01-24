/*
  # Job Placement Portal Database Schema

  ## Overview
  This migration creates the complete database schema for a real-time job placement portal
  with separate functionality for Job Seekers and Employers.

  ## New Tables

  ### 1. profiles
  Extended user profile information for both roles
  - `id` (uuid, primary key) - Links to auth.users
  - `role` (text) - Either 'seeker' or 'employer'
  - `full_name` (text)
  - `email` (text)
  - `phone` (text)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 2. seeker_profiles
  Detailed information for job seekers
  - `id` (uuid, primary key)
  - `user_id` (uuid, foreign key to profiles)
  - `skills` (text array)
  - `education` (jsonb)
  - `experience` (jsonb)
  - `resume_url` (text)
  - `bio` (text)
  - `location` (text)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 3. employer_profiles
  Company information for employers
  - `id` (uuid, primary key)
  - `user_id` (uuid, foreign key to profiles)
  - `company_name` (text)
  - `company_logo_url` (text)
  - `about_company` (text)
  - `industry` (text)
  - `company_size` (text)
  - `website` (text)
  - `location` (text)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 4. jobs
  Job postings created by employers
  - `id` (uuid, primary key)
  - `employer_id` (uuid, foreign key to profiles)
  - `title` (text)
  - `description` (text)
  - `requirements` (text)
  - `salary_min` (integer)
  - `salary_max` (integer)
  - `location` (text)
  - `job_type` (text) - Full-time, Part-time, Contract, etc.
  - `category` (text) - Tech, Marketing, Finance, etc.
  - `status` (text) - active, closed
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 5. applications
  Job applications from seekers to specific jobs
  - `id` (uuid, primary key)
  - `job_id` (uuid, foreign key to jobs)
  - `seeker_id` (uuid, foreign key to profiles)
  - `status` (text) - pending, viewed, shortlisted, rejected
  - `cover_letter` (text)
  - `applied_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 6. saved_jobs
  Jobs saved by seekers for later
  - `id` (uuid, primary key)
  - `job_id` (uuid, foreign key to jobs)
  - `seeker_id` (uuid, foreign key to profiles)
  - `saved_at` (timestamptz)

  ## Security
  - Enable RLS on all tables
  - Profiles: Users can read their own profile and update it
  - Seeker Profiles: Only the owner can manage their profile; employers can view when reviewing applications
  - Employer Profiles: Public read for company info; only owner can update
  - Jobs: Public read for active jobs; only employer can create/update/delete their own
  - Applications: Seekers see their own; employers see applications for their jobs
  - Saved Jobs: Only owner can manage
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role text NOT NULL CHECK (role IN ('seeker', 'employer')),
  full_name text NOT NULL,
  email text NOT NULL,
  phone text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create seeker_profiles table
CREATE TABLE IF NOT EXISTS seeker_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE UNIQUE,
  skills text[] DEFAULT '{}',
  education jsonb DEFAULT '[]',
  experience jsonb DEFAULT '[]',
  resume_url text,
  bio text,
  location text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create employer_profiles table
CREATE TABLE IF NOT EXISTS employer_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE UNIQUE,
  company_name text NOT NULL,
  company_logo_url text,
  about_company text,
  industry text,
  company_size text,
  website text,
  location text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create jobs table
CREATE TABLE IF NOT EXISTS jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employer_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text NOT NULL,
  requirements text,
  salary_min integer,
  salary_max integer,
  location text,
  job_type text DEFAULT 'Full-time',
  category text,
  status text DEFAULT 'active' CHECK (status IN ('active', 'closed')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create applications table
CREATE TABLE IF NOT EXISTS applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id uuid NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  seeker_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'viewed', 'shortlisted', 'rejected')),
  cover_letter text,
  applied_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(job_id, seeker_id)
);

-- Create saved_jobs table
CREATE TABLE IF NOT EXISTS saved_jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id uuid NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  seeker_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  saved_at timestamptz DEFAULT now(),
  UNIQUE(job_id, seeker_id)
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE seeker_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE employer_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_jobs ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Seeker Profiles Policies
CREATE POLICY "Seekers can view their own profile"
  ON seeker_profiles FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Employers can view seeker profiles through applications"
  ON seeker_profiles FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM applications a
      JOIN jobs j ON j.id = a.job_id
      WHERE a.seeker_id = seeker_profiles.user_id
      AND j.employer_id = auth.uid()
    )
  );

CREATE POLICY "Seekers can insert their own profile"
  ON seeker_profiles FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Seekers can update their own profile"
  ON seeker_profiles FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Employer Profiles Policies
CREATE POLICY "Everyone can view employer profiles"
  ON employer_profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Employers can insert their own profile"
  ON employer_profiles FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Employers can update their own profile"
  ON employer_profiles FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Jobs Policies
CREATE POLICY "Everyone can view active jobs"
  ON jobs FOR SELECT
  TO authenticated
  USING (status = 'active' OR employer_id = auth.uid());

CREATE POLICY "Employers can insert their own jobs"
  ON jobs FOR INSERT
  TO authenticated
  WITH CHECK (employer_id = auth.uid());

CREATE POLICY "Employers can update their own jobs"
  ON jobs FOR UPDATE
  TO authenticated
  USING (employer_id = auth.uid())
  WITH CHECK (employer_id = auth.uid());

CREATE POLICY "Employers can delete their own jobs"
  ON jobs FOR DELETE
  TO authenticated
  USING (employer_id = auth.uid());

-- Applications Policies
CREATE POLICY "Seekers can view their own applications"
  ON applications FOR SELECT
  TO authenticated
  USING (seeker_id = auth.uid());

CREATE POLICY "Employers can view applications for their jobs"
  ON applications FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM jobs
      WHERE jobs.id = applications.job_id
      AND jobs.employer_id = auth.uid()
    )
  );

CREATE POLICY "Seekers can insert applications"
  ON applications FOR INSERT
  TO authenticated
  WITH CHECK (seeker_id = auth.uid());

CREATE POLICY "Employers can update application status"
  ON applications FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM jobs
      WHERE jobs.id = applications.job_id
      AND jobs.employer_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM jobs
      WHERE jobs.id = applications.job_id
      AND jobs.employer_id = auth.uid()
    )
  );

-- Saved Jobs Policies
CREATE POLICY "Seekers can view their saved jobs"
  ON saved_jobs FOR SELECT
  TO authenticated
  USING (seeker_id = auth.uid());

CREATE POLICY "Seekers can save jobs"
  ON saved_jobs FOR INSERT
  TO authenticated
  WITH CHECK (seeker_id = auth.uid());

CREATE POLICY "Seekers can unsave jobs"
  ON saved_jobs FOR DELETE
  TO authenticated
  USING (seeker_id = auth.uid());

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_jobs_employer_id ON jobs(employer_id);
CREATE INDEX IF NOT EXISTS idx_jobs_status ON jobs(status);
CREATE INDEX IF NOT EXISTS idx_jobs_category ON jobs(category);
CREATE INDEX IF NOT EXISTS idx_applications_job_id ON applications(job_id);
CREATE INDEX IF NOT EXISTS idx_applications_seeker_id ON applications(seeker_id);
CREATE INDEX IF NOT EXISTS idx_applications_status ON applications(status);
CREATE INDEX IF NOT EXISTS idx_saved_jobs_seeker_id ON saved_jobs(seeker_id);

-- Create storage bucket for resumes
INSERT INTO storage.buckets (id, name, public)
VALUES ('resumes', 'resumes', false)
ON CONFLICT (id) DO NOTHING;

-- Storage policy for resumes
CREATE POLICY "Authenticated users can upload resumes"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'resumes' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view their own resumes"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (bucket_id = 'resumes' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Employers can view applicant resumes"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'resumes' AND
    EXISTS (
      SELECT 1 FROM applications a
      JOIN jobs j ON j.id = a.job_id
      WHERE j.employer_id = auth.uid()
      AND (storage.foldername(name))[1] = a.seeker_id::text
    )
  );

CREATE POLICY "Users can update their own resumes"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'resumes' AND auth.uid()::text = (storage.foldername(name))[1])
  WITH CHECK (bucket_id = 'resumes' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own resumes"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'resumes' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Create storage bucket for company logos
INSERT INTO storage.buckets (id, name, public)
VALUES ('logos', 'logos', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policy for logos
CREATE POLICY "Authenticated users can upload logos"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'logos');

CREATE POLICY "Everyone can view logos"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (bucket_id = 'logos');

CREATE POLICY "Users can update their own logos"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'logos' AND auth.uid()::text = (storage.foldername(name))[1])
  WITH CHECK (bucket_id = 'logos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own logos"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'logos' AND auth.uid()::text = (storage.foldername(name))[1]);