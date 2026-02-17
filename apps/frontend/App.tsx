import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import DashboardPage from './pages/DashboardPage';
import CampaignsPage from './pages/CampaignsPage';
import CampaignEditorPage from './pages/CampaignEditorPage';
import LeadsPage from './pages/LeadsPage';
import InboxesPage from './pages/InboxesPage';
import WarmupPage from './pages/WarmupPage';
import AnalyticsPage from './pages/AnalyticsPage';
import SettingsPage from './pages/SettingsPage';
import RepliesPage from './pages/RepliesPage';
import DeliverabilityLabPage from './pages/DeliverabilityLabPage';
import NotificationsPage from './pages/NotificationsPage';
import AuditLogsPage from './pages/AuditLogsPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';

type Theme = 'ethereal' | 'glass';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
  const [theme, setTheme] = useState<Theme>((localStorage.getItem('app-theme') as Theme) || 'ethereal');
  const [currentWorkspace, setCurrentWorkspace] = useState({ id: 'w1', name: 'Alpha Growth' });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    document.body.className = `theme-${theme}`;
    localStorage.setItem('app-theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'ethereal' ? 'glass' : 'ethereal');
  const handleLogin = () => setIsAuthenticated(true);

  return (
    <HashRouter>
      <div className="flex h-screen w-full overflow-hidden relative z-10">
        {isAuthenticated && (
          <div className={`fixed inset-y-0 left-0 z-50 lg:static lg:block transition-transform duration-300 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
            <Sidebar theme={theme} workspace={currentWorkspace} onClose={() => setIsSidebarOpen(false)} />
          </div>
        )}
        
        <div className="flex flex-col flex-1 overflow-hidden w-full relative">
          {isAuthenticated && (
            <Navbar 
              theme={theme}
              onToggleTheme={toggleTheme}
              workspace={currentWorkspace} 
              onWorkspaceChange={setCurrentWorkspace} 
              onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
            />
          )}
          
          <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-10 scroll-smooth">
            <AnimatePresence mode="wait">
              <Routes>
                <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
                <Route path="/signup" element={<SignupPage />} />
                
                {!isAuthenticated ? (
                  <Route path="*" element={<Navigate to="/login" replace />} />
                ) : (
                  <>
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                    <Route path="/dashboard" element={<DashboardPage theme={theme} />} />
                    <Route path="/campaigns" element={<CampaignsPage theme={theme} />} />
                    <Route path="/campaigns/:id" element={<CampaignEditorPage theme={theme} />} />
                    <Route path="/leads" element={<LeadsPage theme={theme} />} />
                    <Route path="/replies" element={<RepliesPage theme={theme} />} />
                    <Route path="/inboxes" element={<InboxesPage theme={theme} />} />
                    <Route path="/warmup" element={<WarmupPage theme={theme} />} />
                    <Route path="/lab" element={<DeliverabilityLabPage theme={theme} />} />
                    <Route path="/analytics" element={<AnalyticsPage theme={theme} />} />
                    <Route path="/notifications" element={<NotificationsPage theme={theme} />} />
                    <Route path="/audit-logs" element={<AuditLogsPage theme={theme} />} />
                    <Route path="/settings" element={<SettingsPage theme={theme} />} />
                  </>
                )}
              </Routes>
            </AnimatePresence>
          </main>
        </div>
      </div>
    </HashRouter>
  );
};

export default App;