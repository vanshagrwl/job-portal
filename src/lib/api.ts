const API_URL = import.meta.env.VITE_API_URL || (typeof window !== 'undefined' && window.location.hostname === 'dreamai-job.vercel.app' 
  ? 'https://job-portal-backend-production-7db4.up.railway.app/api'
  : 'http://localhost:5000/api');

export { API_URL };

// API request timeout (10 seconds)
const REQUEST_TIMEOUT = 10000;

// Helper function for fetch with timeout
async function fetchWithTimeout(url: string, options: RequestInit = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);
  
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timeout);
    
    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`);
    }
    
    return response;
  } catch (error) {
    clearTimeout(timeout);
    throw error;
  }
}

export type UserRole = 'seeker' | 'employer';

export interface Profile {
  _id: string;
  role: UserRole;
  full_name: string;
  email: string;
  phone?: string;
  created_at: string;
  updated_at: string;
}

export interface SeekerProfile {
  _id?: string;
  user_id: string;
  full_name?: string;
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
  _id?: string;
  user_id: string;
  full_name?: string;
  company_name: string;
  company_logo_url?: string;
  about_company?: string;
  industry?: string;
  company_size?: string;
  website?: string;
  location?: string;
  phone?: string;
  created_at: string;
  updated_at: string;
}

export interface Job {
  _id: string;
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
  _id: string;
  job_id: string;
  seeker_id: string;
  status: 'pending' | 'viewed' | 'shortlisted' | 'rejected';
  resume_url?: string;
  applied_at: string;
  updated_at: string;
  job?: Job;
  seeker_profile?: SeekerProfile & { profile?: Profile };
}

// Auth API
export const authAPI = {
  signUp: async (email: string, password: string, fullName: string, role: UserRole, companyName?: string) => {
    try {
      const response = await fetchWithTimeout(`${API_URL}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, fullName, role, companyName })
      });
      const data = await response.json();
      return data;
    } catch (error: any) {
      throw new Error(error.message || 'Sign up failed. Please check your backend connection.');
    }
  },

  signIn: async (email: string, password: string) => {
    try {
      const response = await fetchWithTimeout(`${API_URL}/auth/signin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();
      return data;
    } catch (error: any) {
      throw new Error(error.message || 'Sign in failed. Please check your backend connection.');
    }
  },

  getProfile: async (token: string) => {
    const response = await fetch(`${API_URL}/auth/profile`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Failed to fetch profile');
    return data;
  },

  updateProfile: async (fullName: string, token: string) => {
    try {
      console.log('Calling updateProfile with token:', token ? token.substring(0, 20) + '...' : 'NO TOKEN');
      
      const response = await fetch(`${API_URL}/auth/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ full_name: fullName })
      });
      
      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);
      
      const text = await response.text();
      console.log('Response text:', text.substring(0, 200));
      
      if (!response.ok) {
        console.error('Response is not OK. Status:', response.status, 'Text:', text);
        // Try to parse as JSON error
        try {
          const errorData = JSON.parse(text);
          throw new Error(errorData.error || `Server error: ${response.status}`);
        } catch (parseError) {
          throw new Error(`Server error ${response.status}: ${text.substring(0, 100)}`);
        }
      }
      
      let data;
      try {
        data = JSON.parse(text);
      } catch (e) {
        console.error('Failed to parse success response:', text);
        throw new Error('Invalid response format from server');
      }
      
      console.log('Profile update successful:', data);
      return data;
    } catch (error: any) {
      console.error('updateProfile error:', error);
      throw error;
    }
  }
};

// Jobs API
export const jobsAPI = {
  getAll: async () => {
    const response = await fetch(`${API_URL}/jobs`);
    if (!response.ok) throw new Error('Failed to fetch jobs');
    return response.json();
  },

  getById: async (id: string) => {
    const response = await fetch(`${API_URL}/jobs/${id}`);
    if (!response.ok) throw new Error('Failed to fetch job');
    return response.json();
  },

  create: async (job: Omit<Job, '_id' | 'created_at' | 'updated_at'>, token: string) => {
    const response = await fetch(`${API_URL}/jobs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(job)
    });
    if (!response.ok) throw new Error('Failed to create job');
    return response.json();
  },

  update: async (id: string, job: Partial<Job>, token: string) => {
    const response = await fetch(`${API_URL}/jobs/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(job)
    });
    if (!response.ok) throw new Error('Failed to update job');
    return response.json();
  },

  delete: async (id: string, token: string) => {
    const response = await fetch(`${API_URL}/jobs/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    if (!response.ok) throw new Error('Failed to delete job');
    return response.json();
  }
};

// Applications API
export const applicationsAPI = {
  apply: async (job_id: string, token: string) => {
    const response = await fetch(`${API_URL}/applications`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ job_id })
    });
    if (!response.ok) throw new Error('Failed to apply');
    return response.json();
  },

  getMyApplications: async (token: string) => {
    const response = await fetch(`${API_URL}/applications/my-applications`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Failed to fetch applications');
    return response.json();
  },

  getEmployerApplications: async (token: string) => {
    const response = await fetch(`${API_URL}/applications/employer/my-applications`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Failed to fetch applications');
    return response.json();
  },

  getById: async (id: string, token: string) => {
    const response = await fetch(`${API_URL}/applications/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Failed to fetch application');
    return response.json();
  },

  updateStatus: async (id: string, status: string, token: string) => {
    const response = await fetch(`${API_URL}/applications/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ status })
    });
    if (!response.ok) throw new Error('Failed to update application');
    return response.json();
  }
};

// Profile API
export const profileAPI = {
  getSeekerProfile: async (token: string) => {
    const response = await fetch(`${API_URL}/profile/seeker`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Failed to fetch profile');
    return data;
  },

  updateSeekerProfile: async (profile: Partial<SeekerProfile>, token: string) => {
    try {
      const response = await fetch(`${API_URL}/profile/seeker`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(profile)
      });
      
      console.log('Update seeker profile response status:', response.status);
      const data = await response.json();
      console.log('Update seeker profile response data:', data);
      
      if (!response.ok) {
        throw new Error(data.error || `HTTP ${response.status}: Failed to update profile`);
      }
      return data;
    } catch (error: any) {
      console.error('updateSeekerProfile error:', error);
      throw error;
    }
  },

  getEmployerProfile: async (token: string) => {
    const response = await fetch(`${API_URL}/profile/employer`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Failed to fetch profile');
    return data;
  },

  updateEmployerProfile: async (profile: Partial<EmployerProfile>, token: string) => {
    try {
      const response = await fetch(`${API_URL}/profile/employer`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(profile)
      });
      
      console.log('Update employer profile response status:', response.status);
      const data = await response.json();
      console.log('Update employer profile response data:', data);
      
      if (!response.ok) {
        throw new Error(data.error || `HTTP ${response.status}: Failed to update profile`);
      }
      return data;
    } catch (error: any) {
      console.error('updateEmployerProfile error:', error);
      throw error;
    }
  }
};

export default {
  authAPI,
  jobsAPI,
  applicationsAPI,
  profileAPI
};
