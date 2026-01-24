import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type UserRole = 'seeker' | 'employer';

export interface Profile {
  id: string;
  role: UserRole;
  full_name: string;
  email: string;
  phone?: string;
  created_at: string;
  updated_at: string;
}

export interface SeekerProfile {
  id: string;
  user_id: string;
  skills: string[];
  education: any[];
  experience: any[];
  resume_url?: string;
  bio?: string;
  location?: string;
  phone?: string;
  created_at: string;
  updated_at: string;
}

export interface EmployerProfile {
  id: string;
  user_id: string;
  company_name: string;
  company_logo_url?: string;
  about_company?: string;
  industry?: string;
  company_size?: string;
  website?: string;
  location?: string;
  created_at: string;
  updated_at: string;
}

export interface Job {
  id: string;
  employer_id: string;
  title: string;
  description: string;
  requirements?: string;
  salary_min?: number;
  salary_max?: number;
  location?: string;
  job_type: string;
  category?: string;
  status: 'active' | 'closed';
  created_at: string;
  updated_at: string;
  employer_profile?: EmployerProfile;
}

export interface Application {
  id: string;
  job_id: string;
  seeker_id: string;
  status: 'pending' | 'viewed' | 'shortlisted' | 'rejected';
  applied_at: string;
  updated_at: string;
  job?: Job;
  seeker_profile?: SeekerProfile & { profile?: Profile };
}
