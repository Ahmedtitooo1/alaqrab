
import * as React from 'react';
import { useState, useEffect } from 'react';
import { UserRole } from './types';
import LandingPage from './components/LandingPage';
import DashboardLayout from './components/DashboardLayout';

import { useAppContext } from './context/AppContext';

const App: React.FC = () => {
  const [role, setRole] = useState<UserRole>(UserRole.GUEST);
  const [isLoading, setIsLoading] = useState(true);
  const { systemLogo } = useAppContext();

  useEffect(() => {
    // Dynamic Favicon
    const link = document.querySelector("link[rel*='icon']") as HTMLLinkElement || document.createElement('link');
    link.type = 'image/png';
    link.rel = 'icon';
    link.href = systemLogo;
    document.getElementsByTagName('head')[0].appendChild(link);
  }, [systemLogo]);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-[#f1f5f9] text-slate-900 overflow-hidden relative">
        {/* Background Elements */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-3xl animate-pulse"></div>

        <div className="flex flex-col items-center relative z-10 p-10 glass-card">
          <div className="relative mb-8">
            <div className="absolute inset-0 bg-indigo-600/20 blur-2xl rounded-full scale-110 animate-pulse"></div>
            <img
              src={systemLogo}
              className="w-32 h-32 object-contain relative z-10 animate-bounce"
              alt="AleaQrab"
            />
          </div>
          <div className="flex flex-col items-center gap-3">
            <h1 className="font-black text-4xl tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-slate-800 uppercase">ALEAQRAB</h1>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-600 animate-ping"></span>
              <p className="text-slate-400 font-bold text-xs tracking-[0.2em] uppercase">Initializing System...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (role === UserRole.GUEST) {
    return <LandingPage onStart={(selectedRole) => setRole(selectedRole)} />;
  }

  return (
    <DashboardLayout
      role={role}
      onLogout={() => setRole(UserRole.GUEST)}
      onRoleSwitch={(newRole) => setRole(newRole)}
    />
  );
};

export default App;
