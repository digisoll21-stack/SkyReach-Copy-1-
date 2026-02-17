import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
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
import UnsubscribePage from './pages/UnsubscribePage';
import TermsPage from './pages/TermsPage';
import PrivacyPage from './pages/PrivacyPage';
import LandingPage from './pages/LandingPage';
import { AdminLayout } from './layouts/AdminLayout';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminUsersPage } from './pages/admin/AdminUsersPage';
import { AdminCampaignsPage } from './pages/admin/AdminCampaignsPage';

// Support Integration
import { SupportPage } from './pages/SupportPage';
import { CrispChat } from './components/CrispChat';
import AcceptInvitePage from './pages/AcceptInvitePage';

type Theme = 'ethereal' | 'glass';

const AppContent: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
  const [theme, setTheme] = useState<Theme>((localStorage.getItem('app-theme') as Theme) || 'ethereal');
  const [currentWorkspace, setCurrentWorkspace] = useState({ id: 'w1', name: 'Alpha Growth' });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    document.body.className = `theme-${theme}`;
    localStorage.setItem('app-theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'ethereal' ? 'glass' : 'ethereal');
  const handleLogin = () => setIsAuthenticated(true);

  // Check if we are in the Admin section
  const isAdminRoute = location.pathname.startsWith('/admin');

  // If authenticated and in admin route, show Admin Layout
  if (isAuthenticated && isAdminRoute) {
    return (
      <Routes>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboardPage />} />
          <Route path="users" element={<AdminUsersPage />} />
          <Route path="campaigns" element={<AdminCampaignsPage />} />
        </Route>
      </Routes>
    );
  }

  return (
    <div className="flex h-screen w-full overflow-hidden relative">
      {/* Global Helper Components */}
      {isAuthenticated && <CrispChat />}

      {isAuthenticated && (
        <>
          {isSidebarOpen && (
            <div
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setIsSidebarOpen(false)}
            />
          )}
          <div className={`fixed inset-y-0 left-0 z-50 lg:static lg:block transition-transform duration-500 ease-out transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
            <Sidebar theme={theme} workspace={currentWorkspace} onClose={() => setIsSidebarOpen(false)} />
          </div>
        </>
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

        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 scroll-smooth">
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/" element={<LandingPage />} />
              <Route path="/terms" element={<TermsPage />} />
              <Route path="/privacy" element={<PrivacyPage />} />
              <Route path="/accept-invite/:token" element={<AcceptInvitePage />} />
              <Route path="/unsub/:leadId" element={<UnsubscribePage />} />

              {!isAuthenticated ? (
                <Route path="*" element={<Navigate to="/login" replace />} />
              ) : (
                <>
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
                  <Route path="/support" element={<SupportPage />} />
                </>
              )}
            </Routes>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <HashRouter>
      <AppContent />
    </HashRouter>
  );
};

export default App;
