
import React, { useState } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './apps/web/src/components/Sidebar';
import Navbar from './apps/web/src/components/Navbar';
import DashboardPage from './apps/web/src/pages/DashboardPage';
import CampaignsPage from './apps/web/src/pages/CampaignsPage';
import InboxesPage from './apps/web/src/pages/InboxesPage';
import WarmupPage from './apps/web/src/pages/WarmupPage';
import AnalyticsPage from './apps/web/src/pages/AnalyticsPage';
import SettingsPage from './apps/web/src/pages/SettingsPage';

const App: React.FC = () => {
  const [currentWorkspace, setCurrentWorkspace] = useState({ id: 'w1', name: 'Alpha Growth' });
  
  // FIX: Added missing theme and sidebar visibility state
  const [theme, setTheme] = useState<'ethereal' | 'glass'>('ethereal');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleTheme = () => setTheme(prev => prev === 'ethereal' ? 'glass' : 'ethereal');

  return (
    <HashRouter>
      <div className="flex h-screen w-full bg-[#0b0f1a] overflow-hidden">
        {/* FIX: Passed required theme and onClose props to Sidebar */}
        <Sidebar 
          workspace={currentWorkspace} 
          theme={theme} 
          onClose={() => setIsSidebarOpen(false)} 
        />
        
        <div className="flex flex-col flex-1 overflow-hidden">
          {/* FIX: Passed required theme, onToggleTheme, and onToggleSidebar props to Navbar */}
          <Navbar 
            workspace={currentWorkspace} 
            theme={theme}
            onToggleTheme={toggleTheme}
            onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
            onWorkspaceChange={setCurrentWorkspace} 
          />
          
          <main className="flex-1 overflow-y-auto p-6 lg:p-10">
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              {/* FIX: Passed theme prop to page components to satisfy required prop types */}
              <Route path="/dashboard" element={<DashboardPage theme={theme} />} />
              <Route path="/campaigns" element={<CampaignsPage theme={theme} />} />
              <Route path="/inboxes" element={<InboxesPage theme={theme} />} />
              <Route path="/warmup" element={<WarmupPage theme={theme} />} />
              <Route path="/analytics" element={<AnalyticsPage theme={theme} />} />
              <Route path="/settings" element={<SettingsPage theme={theme} />} />
            </Routes>
          </main>
        </div>
      </div>
    </HashRouter>
  );
};

export default App;
