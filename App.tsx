import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAppContext } from './context/AppContext';
import DashboardLayout from './components/DashboardLayout';
import LandingPage from './components/LandingPage';
import { LoginPage } from './src/pages/Auth/LoginPage';
import { mockAuthService } from './src/services/mockAuth';
import ExamRoom from './src/pages/Student/ExamRoom';
import WalkIn from './src/pages/Secretary/WalkIn';
import AITutorPage from './src/pages/AITutorPage';

// Session Restorer
const SessionRestorer = ({ children }: { children: any }) => {
  const { setUser, setSystemName, setCurrentTenant } = useAppContext();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const session = mockAuthService.getCurrentSession();
    if (session) {
      setUser(session.user);
      setSystemName(session.tenant.name);
      setCurrentTenant(session.tenant);
    }
    setChecked(true);
  }, []);

  if (!checked) return <div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-400">Loading Session...</div>;
  return children;
};

// Protected Route Wrapper
const ProtectedRoute = ({ children }: { children: any }) => {
  const { user } = useAppContext();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
};

const AppRoutes = () => {
  const { user } = useAppContext();
  const navigate = useNavigate();

  return (
    <Routes>
      {/* Public Landing Page for Tenants - Now supports Demo Mode */}
      <Route path="/:tenant_slug" element={<LandingPage onStart={() => navigate('/dashboard')} />} />

      {/* Auth */}
      <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <LoginPage />} />

      {/* Main Application */}
      <Route path="/dashboard/*" element={
        <ProtectedRoute>
          <DashboardLayout role={user?.role!} onLogout={() => {
            mockAuthService.logout();
            navigate('/login');
          }} onRoleSwitch={() => { }} />
        </ProtectedRoute>
      } />

      {/* Special Fullscreen Routes */}
      <Route path="/student/exam-room" element={<ProtectedRoute><ExamRoom /></ProtectedRoute>} />
      <Route path="/secretary/walk-in" element={<ProtectedRoute><WalkIn /></ProtectedRoute>} />
      <Route path="/ai-tutor" element={<ProtectedRoute><AITutorPage /></ProtectedRoute>} />


      {/* Default - Show Landing Page for Demo */}
      <Route path="/" element={<LandingPage onStart={() => navigate('/dashboard')} />} />
    </Routes>
  );
};

const App: React.FC = () => {
  const { systemLogo } = useAppContext();

  useEffect(() => {
    // Dynamic Favicon
    const link = document.querySelector("link[rel*='icon']") as HTMLLinkElement || document.createElement('link');
    link.type = 'image/png';
    link.rel = 'icon';
    link.href = systemLogo;
    document.getElementsByTagName('head')[0].appendChild(link);
  }, [systemLogo]);

  return (
    <SessionRestorer>
      <AppRoutes />
    </SessionRestorer>
  );
};

export default App;
