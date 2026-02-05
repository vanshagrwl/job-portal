# Quick Integration Guide

## Copy-Paste Examples for Dashboard Pages

### 1. Update Button Usage

**Before:**
```tsx
<Button variant="primary">Search Jobs</Button>
```

**After:**
```tsx
<Button variant="primary" theme={theme}>Search Jobs</Button>
```

---

### 2. Update Seeker Dashboard Job List

**Before:**
```tsx
{jobs.map((job) => (
  <div key={job._id} className="p-4 border rounded-lg">
    <h3>{job.title}</h3>
    <p>{job.location}</p>
    <button onClick={() => viewDetail(job._id)}>View</button>
  </div>
))}
```

**After:**
```tsx
{jobs.map((job, idx) => (
  <StackedJobCard
    key={job._id}
    job={job}
    onViewDetails={viewDetail}
    theme={theme}
    index={idx}
  />
))}
```

---

### 3. Add Filter Drawer

**Before:**
```tsx
const [searchTerm, setSearchTerm] = useState('');
const [locationFilter, setLocationFilter] = useState('');

return (
  <>
    <input 
      value={searchTerm} 
      onChange={(e) => setSearchTerm(e.target.value)} 
    />
    <input 
      value={locationFilter}
      onChange={(e) => setLocationFilter(e.target.value)}
    />
    {/* jobs list */}
  </>
);
```

**After:**
```tsx
const [searchTerm, setSearchTerm] = useState('');
const [locationFilter, setLocationFilter] = useState('');
const [showFilters, setShowFilters] = useState(false);
const { theme } = useTheme();

return (
  <>
    <Button theme={theme} onClick={() => setShowFilters(true)}>
      Filters
    </Button>
    
    <FilterDrawer
      isOpen={showFilters}
      onClose={() => setShowFilters(false)}
      searchTerm={searchTerm}
      onSearchChange={setSearchTerm}
      locationFilter={locationFilter}
      onLocationChange={setLocationFilter}
      categoryFilter={categoryFilter}
      onCategoryChange={setCategoryFilter}
      onReset={handleReset}
      categories={categories}
      theme={theme}
    />
    
    {/* jobs list with StackedJobCard */}
  </>
);
```

---

### 4. Update Data Tables to Card Layout

**Before:**
```tsx
<table className="w-full">
  <tbody>
    {applications.map((app) => (
      <tr key={app._id}>
        <td>{app.job?.title}</td>
        <td>{app.status}</td>
        <td><button>View</button></td>
      </tr>
    ))}
  </tbody>
</table>
```

**After:**
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  {applications.map((app, idx) => (
    <motion.div
      key={app._id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: idx * 0.05 }}
    >
      <Card theme={theme} stackEffect={true}>
        <h3 className={`text-lg font-bold ${theme === 'employer' ? 'text-employer-primary' : 'text-seeker-primary'}`}>
          {app.job?.title}
        </h3>
        <p className="text-gray-600 mb-4">{app.status}</p>
        <Button
          variant="primary"
          theme={theme}
          onClick={() => viewDetails(app._id)}
        >
          View Application
        </Button>
      </Card>
    </motion.div>
  ))}
</div>
```

---

### 5. Create Modal/Form with Drawer

**Before:**
```tsx
{showForm && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
    <div className="bg-white p-8 rounded-lg w-96">
      <h2>Edit Profile</h2>
      {/* form fields */}
      <button onClick={handleSubmit}>Save</button>
    </div>
  </div>
)}
```

**After:**
```tsx
<Drawer
  isOpen={showForm}
  onClose={() => setShowForm(false)}
  title="Edit Profile"
  theme={theme}
>
  {/* form fields - automatically styled and animated */}
  <Button
    variant="primary"
    theme={theme}
    onClick={handleSubmit}
    className="w-full mt-4"
  >
    Save Changes
  </Button>
</Drawer>
```

---

### 6. Theming Setup in App.tsx

**Add this wrapper:**
```tsx
import { ThemeProvider } from './contexts/ThemeContext';

function App() {
  return (
    <Router>
      <AuthProvider>
        <ThemeProvider>  {/* Add this */}
          <Routes>
            {/* existing routes */}
          </Routes>
        </ThemeProvider>
      </AuthProvider>
    </Router>
  );
}
```

---

### 7. Using Theme in Components

```tsx
import { useTheme } from '../contexts/ThemeContext';
import { Button, Card, StackedJobCard } from '../components';

export function MyDashboard() {
  const { theme, colors } = useTheme();
  
  return (
    <div className={theme === 'employer' ? 'bg-employer-bg' : 'bg-seeker-bg'}>
      {/* All components automatically use theme colors */}
      <Button theme={theme} variant="primary">
        Action Button
      </Button>
      
      <Card theme={theme} stackEffect={true}>
        Content here
      </Card>
    </div>
  );
}
```

---

### 8. Common Tailwind Classes by Theme

```tsx
// Employer theme classes
className={`
  bg-gradient-employer
  text-employer-primary
  border-employer-secondary
  shadow-lift-employer
`}

// Seeker theme classes  
className={`
  bg-gradient-seeker
  text-seeker-primary
  border-seeker-secondary
  shadow-lift-seeker
`}

// Dynamic based on theme
className={theme === 'employer' 
  ? 'bg-gradient-employer' 
  : 'bg-gradient-seeker'
}
```

---

### 9. Full Component Example: Job Listing Page

```tsx
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import {
  StackedJobCard,
  FilterDrawer,
  Button,
  LoadingSpinner,
} from '../components';
import { Job } from '../lib/api';

interface JobListingProps {
  jobs: Job[];
  loading: boolean;
  onViewDetails: (jobId: string) => void;
}

export function JobListing({
  jobs,
  loading,
  onViewDetails,
}: JobListingProps) {
  const { theme } = useTheme();
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  const categories = [
    { value: '', label: 'All Categories' },
    { value: 'Technology', label: 'Technology' },
    { value: 'Marketing', label: 'Marketing' },
    { value: 'Design', label: 'Design' },
  ];

  const handleReset = () => {
    setSearchTerm('');
    setLocationFilter('');
    setCategoryFilter('');
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="p-6">
      {/* Header with Filter Button */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          {theme === 'employer' ? 'Manage Jobs' : 'Find Jobs'}
        </h1>
        <Button
          theme={theme}
          variant="primary"
          onClick={() => setShowFilters(true)}
        >
          Filters
        </Button>
      </div>

      {/* Filter Drawer */}
      <FilterDrawer
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        locationFilter={locationFilter}
        onLocationChange={setLocationFilter}
        categoryFilter={categoryFilter}
        onCategoryChange={setCategoryFilter}
        onReset={handleReset}
        categories={categories}
        theme={theme}
      />

      {/* Jobs Grid with Stacked Cards */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: { staggerChildren: 0.05 },
          },
        }}
        initial="hidden"
        animate="visible"
      >
        {jobs.map((job, idx) => (
          <StackedJobCard
            key={job._id}
            job={job}
            onViewDetails={onViewDetails}
            theme={theme}
            index={idx}
          />
        ))}
      </motion.div>

      {/* Empty State */}
      {jobs.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12"
        >
          <p className="text-gray-500 text-lg">
            No jobs found. Try adjusting your filters.
          </p>
        </motion.div>
      )}
    </div>
  );
}
```

---

### 10. Import Quick Reference

```tsx
// Components
import {
  Card,
  Drawer,
  Button,
  StackedJobCard,
  FilterDrawer,
  RoleToggle,
} from '../components';

// Context
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';

// Animations
import { motion, AnimatePresence } from 'framer-motion';
```

---

## Common Patterns

### Theme-Aware Styling
```tsx
const { theme } = useTheme();

className={theme === 'employer'
  ? 'bg-employer-primary text-white'
  : 'bg-seeker-primary text-white'
}
```

### Staggered List Animations
```tsx
<motion.div
  variants={{
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  }}
  initial="hidden"
  animate="visible"
>
  {items.map((item, idx) => (
    <motion.div key={item.id} variants={itemVariants}>
      {/* item content */}
    </motion.div>
  ))}
</motion.div>
```

### Hover Effects
```tsx
<motion.div
  whileHover={{ scale: 1.05, y: -4 }}
  whileTap={{ scale: 0.95 }}
  transition={{ type: 'spring', stiffness: 300 }}
>
  Interactive content
</motion.div>
```

---

**That's it! Copy-paste these examples and your dashboard will have the new visual overhaul.**
