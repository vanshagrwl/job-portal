import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ToastProvider } from './contexts/ToastContext';
import { MotionPrefProvider } from './contexts/MotionPreferenceContext';
import ProtectedRoute from './components/ProtectedRoute';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import SeekerDashboard from './pages/seeker/SeekerDashboard';
import EmployerDashboard from './pages/employer/EmployerDashboard';
import JobDetail from './pages/seeker/JobDetail';
import SeekerProfile from './pages/seeker/SeekerProfile';
import EmployerProfile from './pages/employer/EmployerProfile';
import MyApplications from './pages/seeker/MyApplications';
import PostJob from './pages/employer/PostJob';
import JobEdit from './pages/employer/JobEdit';
import EmployerApplications from './pages/employer/EmployerApplications';
import ApplicationReview from './pages/employer/ApplicationReview';

function DashboardRouter() {
  const { profile, loading, user, token } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-white">Loading dashboard...</div>
      </div>
    );
  }

  // Prefer the authoritative profile role, fall back to signed-in user role
  const role = profile?.role || user?.role;

  if (!role || !token) {
    console.warn('No role detected, redirecting to login. Profile:', profile, 'User:', user);
    return <Navigate to="/login" />;
  }

  if (role === 'seeker') {
    return <SeekerDashboard />;
  }
  
  if (role === 'employer') {
    return <EmployerDashboard />;
  }

  console.warn('Unknown role:', role);
  return <Navigate to="/login" />;
}

function App() {
  return (
    <MotionPrefProvider>
      <Router>
        <AuthProvider>
          <ToastProvider>
          <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardRouter />
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute requireRole="seeker">
                <SeekerProfile />
              </ProtectedRoute>
            }
          />

          <Route
            path="/employer-profile"
            element={
              <ProtectedRoute requireRole="employer">
                <EmployerProfile />
              </ProtectedRoute>
            }
          />

          <Route
            path="/jobs/:id"
            element={
              <ProtectedRoute requireRole="seeker">
                <JobDetail />
              </ProtectedRoute>
            }
          />

          <Route
            path="/my-applications"
            element={
              <ProtectedRoute requireRole="seeker">
                <MyApplications />
              </ProtectedRoute>
            }
          />

          <Route
            path="/post-job"
            element={
              <ProtectedRoute requireRole="employer">
                <PostJob />
              </ProtectedRoute>
            }
          />

          <Route
            path="/jobs/:id/edit"
            element={
              <ProtectedRoute requireRole="employer">
                <JobEdit />
              </ProtectedRoute>
            }
          />

          <Route
            path="/employer-applications"
            element={
              <ProtectedRoute requireRole="employer">
                <EmployerApplications />
              </ProtectedRoute>
            }
          />

          <Route
            path="/applications/:id"
            element={
              <ProtectedRoute requireRole="employer">
                <ApplicationReview />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" />} />
          </Routes>
          </ToastProvider>
        </AuthProvider>
      </Router>
    </MotionPrefProvider>
  );
}

export default App;
