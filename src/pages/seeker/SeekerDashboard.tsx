import { useEffect, useState, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Job, Application, jobsAPI, applicationsAPI } from '../../lib/api';
import { useAuth } from '../../contexts/AuthContext';
import Layout from '../../components/Layout';
import GlassCard from '../../components/GlassCard';
import Button from '../../components/Button';
import { StackedJobCard } from '../../components';
import FilterDrawer from '../../components/FilterDrawer';
import { Search, Briefcase, MapPin, Clock, FileText, X } from 'lucide-react';

interface SearchSuggestion {
  type: 'title' | 'location' | 'skill';
  value: string;
  count: number;
}

export default function SeekerDashboard() {
  const { user, token, profile } = useAuth();
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [allJobs, setAllJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [debouncedLocationFilter, setDebouncedLocationFilter] = useState('');
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);

  const categories = [
    { value: '', label: 'All Categories' },
    { value: 'Technology', label: 'Technology' },
    { value: 'Marketing', label: 'Marketing' },
    { value: 'Finance', label: 'Finance' },
    { value: 'Design', label: 'Design' },
    { value: 'Sales', label: 'Sales' },
  ];

  useEffect(() => {
    if (user && token) {
      fetchJobs();
      fetchApplications();
    }
  }, [user, token]);

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Debounce location filter
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedLocationFilter(locationFilter);
    }, 300);
    return () => clearTimeout(timer);
  }, [locationFilter]);

  const fetchJobs = async () => {
    try {
      const data = await jobsAPI.getAll();
      setAllJobs(data || []);
      setJobs(data || []);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchApplications = async () => {
    if (!user || !token) return;

    try {
      const data = await applicationsAPI.getMyApplications(token);
      setApplications(data || []);
    } catch (error) {
      console.error('Error fetching applications:', error);
    }
  };

  // Generate search suggestions
  const suggestions = useMemo((): SearchSuggestion[] => {
    if (!searchTerm && !locationFilter) return [];

    const allSuggestions: SearchSuggestion[] = [];
    const seen = new Set<string>();

    // Collect job titles
    const jobTitles = new Map<string, number>();
    allJobs.forEach(job => {
      const title = job.title.toLowerCase();
      jobTitles.set(title, (jobTitles.get(title) || 0) + 1);
    });

    // Collect locations
    const locations = new Map<string, number>();
    allJobs.forEach(job => {
      if (job.location) {
        const loc = job.location.toLowerCase();
        locations.set(loc, (locations.get(loc) || 0) + 1);
      }
    });

    // Add matching job titles
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      jobTitles.forEach((count, title) => {
        if (title.includes(searchLower) && !seen.has(title)) {
          allSuggestions.push({ type: 'title', value: title, count });
          seen.add(title);
        }
      });
    }

    // Add matching locations
    if (locationFilter) {
      const locLower = locationFilter.toLowerCase();
      locations.forEach((count, location) => {
        if (location.includes(locLower) && !seen.has(location)) {
          allSuggestions.push({ type: 'location', value: location, count });
          seen.add(location);
        }
      });
    }

    // Sort by relevance and count
    return allSuggestions.sort((a, b) => {
      const aScore = b.count - a.count;
      return aScore;
    }).slice(0, 8);
  }, [searchTerm, locationFilter, allJobs]);

  // Calculate relevance score for prioritization
  const calculateRelevance = useCallback((job: Job, search: string, location: string): number => {
    let score = 0;
    const searchLower = search.toLowerCase();
    const locationLower = location.toLowerCase();

    if (!search && !location) return 0;

    if (searchLower) {
      // Exact match in title
      if (job.title.toLowerCase() === searchLower) score += 100;
      // Title starts with search term
      else if (job.title.toLowerCase().startsWith(searchLower)) score += 80;
      // Title contains search term
      else if (job.title.toLowerCase().includes(searchLower)) score += 60;
      // Description contains search term
      else if (job.description.toLowerCase().includes(searchLower)) score += 30;
    }

    if (locationLower && job.location) {
      // Exact match in location
      if (job.location.toLowerCase() === locationLower) score += 50;
      // Location contains search term
      else if (job.location.toLowerCase().includes(locationLower)) score += 30;
    }

    return score;
  }, []);

  // Filter and prioritize jobs
  const filteredJobs = useMemo(() => {
    let filtered = allJobs.filter((job) => {
      const matchesSearch = !debouncedSearchTerm || 
        job.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        job.description.toLowerCase().includes(debouncedSearchTerm.toLowerCase());
      
      const matchesLocation = !debouncedLocationFilter || 
        job.location?.toLowerCase().includes(debouncedLocationFilter.toLowerCase());
      
      const matchesCategory = !categoryFilter || job.category === categoryFilter;
      
      return matchesSearch && matchesLocation && matchesCategory;
    });

    // Sort by relevance score
    filtered.sort((a, b) => {
      const scoreA = calculateRelevance(a, debouncedSearchTerm, debouncedLocationFilter);
      const scoreB = calculateRelevance(b, debouncedSearchTerm, debouncedLocationFilter);
      return scoreB - scoreA;
    });

    return filtered;
  }, [allJobs, debouncedSearchTerm, debouncedLocationFilter, categoryFilter, calculateRelevance]);

  const hasApplied = (jobId: string) => {
    return applications.some(app => app.job_id === jobId);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 12,
      },
    },
  };

  return (
    <Layout>
      <div className="space-y-8 max-w-6xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-2">Find Your Dream Job</h1>
          <p className="text-gray-400 text-sm sm:text-base">Discover opportunities that match your skills</p>
        </motion.div>

        <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-4">
          <div className="flex space-x-4">
            <Link to="/profile">
              <Button variant="secondary">
                <FileText className="w-4 h-4 mr-2" />
                My Profile
              </Button>
            </Link>
            <Link to="/my-applications">
              <Button variant="secondary">
                <Briefcase className="w-4 h-4 mr-2" />
                My Applications ({applications.length})
              </Button>
            </Link>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="secondary" onClick={() => setFilterDrawerOpen(true)}>
              Filters
            </Button>
            <Button variant="primary" onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })}>
              Explore
            </Button>
          </div>
        </div>

        <GlassCard className="p-4 sm:p-6 relative z-20 overflow-visible">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search jobs..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setShowSuggestions(true);
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                  className="w-full pl-10 pr-10 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}

                {/* Job Title Suggestions Dropdown */}
                {showSuggestions && searchTerm && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute top-full left-0 right-0 mt-2 bg-gray-900/95 backdrop-blur border border-white/10 rounded-lg shadow-xl z-50 max-h-64 overflow-y-auto"
                  >
                    {suggestions
                      .filter(s => s.type === 'title')
                      .map((suggestion, idx) => (
                        <button
                          key={idx}
                          onClick={() => {
                            setSearchTerm(suggestion.value);
                            setShowSuggestions(false);
                          }}
                          className="w-full text-left px-4 py-3 hover:bg-blue-500/20 transition-colors border-b border-white/5 last:border-b-0"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-white font-medium capitalize">
                              {suggestion.value}
                            </span>
                            <span className="text-xs text-gray-400">
                              {suggestion.count} {suggestion.count === 1 ? 'job' : 'jobs'}
                            </span>
                          </div>
                        </button>
                      ))}
                    {suggestions.filter(s => s.type === 'title').length === 0 && (
                      <div className="px-4 py-3 text-gray-400 text-sm">
                        No matching job titles
                      </div>
                    )}
                  </motion.div>
                )}
              </div>
            </div>

            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <div className="relative">
                <input
                  type="text"
                  placeholder="Location..."
                  value={locationFilter}
                  onChange={(e) => {
                    setLocationFilter(e.target.value);
                    setShowSuggestions(true);
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                  className="w-full pl-10 pr-10 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                />
                {locationFilter && (
                  <button
                    onClick={() => setLocationFilter('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}

                {/* Location Suggestions Dropdown */}
                {showSuggestions && locationFilter && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute top-full left-0 right-0 mt-2 bg-gray-900/95 backdrop-blur border border-white/10 rounded-lg shadow-xl z-30 max-h-64 overflow-y-auto"
                  >
                    {suggestions
                      .filter(s => s.type === 'location')
                      .map((suggestion, idx) => (
                        <button
                          key={idx}
                          onClick={() => {
                            setLocationFilter(suggestion.value);
                            setShowSuggestions(false);
                          }}
                          className="w-full text-left px-4 py-3 hover:bg-blue-500/20 transition-colors border-b border-white/5 last:border-b-0"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                              <span className="text-white font-medium capitalize">
                                {suggestion.value}
                              </span>
                            </div>
                            <span className="text-xs text-gray-400">
                              {suggestion.count} {suggestion.count === 1 ? 'job' : 'jobs'}
                            </span>
                          </div>
                        </button>
                      ))}
                    {suggestions.filter(s => s.type === 'location').length === 0 && (
                      <div className="px-4 py-3 text-gray-400 text-sm">
                        No matching locations
                      </div>
                    )}
                  </motion.div>
                )}
              </div>
            </div>

            <div className="relative z-10">
              <button
                onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                onBlur={() => setTimeout(() => setShowCategoryDropdown(false), 150)}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all cursor-pointer text-left flex items-center justify-between"
              >
                <span>{categories.find(c => c.value === categoryFilter)?.label}</span>
                <svg className={`w-5 h-5 transition-transform ${showCategoryDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </button>

              {showCategoryDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute top-full left-0 right-0 mt-2 bg-gray-900/95 backdrop-blur border border-white/10 rounded-lg shadow-xl z-30 max-h-64 overflow-y-auto"
                >
                  {categories.map((category, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setCategoryFilter(category.value);
                        setShowCategoryDropdown(false);
                      }}
                      className={`w-full text-left px-4 py-3 hover:bg-blue-500/20 transition-colors border-b border-white/5 last:border-b-0 ${
                        categoryFilter === category.value ? 'bg-blue-500/30' : ''
                      }`}
                    >
                      <span className="text-white font-medium">
                        {category.label}
                      </span>
                    </button>
                  ))}
                </motion.div>
              )}
            </div>
          </div>
        </GlassCard>

        {loading ? (
          <div className="text-center text-gray-400">Loading jobs...</div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 lg:grid-cols-2 gap-6 relative z-0 auto-rows-max"
          >
            {filteredJobs.map((job, idx) => (
              <motion.div key={job._id} variants={itemVariants}>
                <StackedJobCard
                  job={job}
                  onViewDetails={(id) => navigate(`/jobs/${id}`)}
                  index={idx}
                />
              </motion.div>
            ))}
          </motion.div>
        )}

        {!loading && filteredJobs.length === 0 && (
          <GlassCard className="p-12 text-center">
            <Briefcase className="w-16 h-16 mx-auto mb-4 text-gray-600" />
            <h3 className="text-xl font-semibold text-white mb-2">No jobs found</h3>
            <p className="text-gray-400">Try adjusting your search filters</p>
          </GlassCard>
        )}

        {/* Filter Drawer */}
        <FilterDrawer
          isOpen={filterDrawerOpen}
          onClose={() => setFilterDrawerOpen(false)}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          locationFilter={locationFilter}
          onLocationChange={setLocationFilter}
          categoryFilter={categoryFilter}
          onCategoryChange={setCategoryFilter}
          onReset={() => { setCategoryFilter(''); setLocationFilter(''); setSearchTerm(''); }}
          categories={categories}
          theme={profile?.role === 'employer' ? 'employer' : 'seeker'}
        />
      </div>
    </Layout>
  );
}
