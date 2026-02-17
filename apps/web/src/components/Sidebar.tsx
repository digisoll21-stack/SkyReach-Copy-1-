import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, Send, Users, Inbox, Mail, Flame,
  TestTube2, BarChart3, Bell, History, Settings, Zap, X
} from 'lucide-react';

interface SidebarProps {
  workspace: { id: string; name: string };
  theme: 'ethereal' | 'glass';
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ workspace, theme, onClose }) => {
  const isEthereal = theme === 'ethereal';

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Campaigns', path: '/campaigns', icon: Send },
    { name: 'Lead CRM', path: '/leads', icon: Users },
    { name: 'Master Inbox', path: '/replies', icon: Inbox },
    { name: 'Email Accounts', path: '/inboxes', icon: Mail },
    { name: 'Warmup', path: '/warmup', icon: Flame },
    { name: 'Deliverability Lab', path: '/lab', icon: TestTube2 },
    { name: 'Analytics', path: '/analytics', icon: BarChart3 },
    { name: 'Notifications', path: '/notifications', icon: Bell },
    { name: 'Audit Logs', path: '/audit-logs', icon: History },
  ];

  return (
    <aside className="w-72 h-screen flex flex-col transition-all duration-500 py-4 px-4 overflow-hidden">
      <div className="flex-1 flex flex-col glass-surface rounded-[2.5rem] overflow-hidden">
        <div className="p-8 flex items-center justify-between">
          <div className="flex items-center space-x-3.5">
            <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shadow-lg transition-all ${isEthereal ? 'bg-gradient-to-br from-[#10b981] to-[#059669]' : 'bg-[#00E5FF]'}`}>
              <Zap className={`w-6 h-6 ${isEthereal ? 'text-white' : 'text-slate-900'} fill-current`} />
            </div>
            <span className={`text-2xl font-black font-heading tracking-tighter ${isEthereal ? 'text-[#064e3b]' : 'text-white'}`}>SkyReach</span>
          </div>
          <button onClick={onClose} className="lg:hidden p-2 text-slate-400">
            <X size={24} />
          </button>
        </div>

        <nav className="flex-1 px-5 py-4 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center px-5 py-3.5 rounded-2xl transition-all duration-300 group font-bold text-sm ${isActive
                  ? (isEthereal ? 'bg-[#10b981]/15 text-[#064e3b] shadow-sm' : 'bg-[#00E5FF]/20 text-[#00E5FF]')
                  : (isEthereal ? 'text-slate-500 hover:bg-[#10b981]/5 hover:text-[#064e3b]' : 'text-slate-400 hover:bg-white/5 hover:text-white')
                }`
              }
            >
              <item.icon className="w-5 h-5 mr-4 transition-transform duration-300 group-hover:scale-110" />
              {item.name}
            </NavLink>
          ))}
        </nav>

        <div className={`px-6 py-8 mt-auto ${isEthereal ? 'border-t border-[#10b981]/10 bg-[#10b981]/5' : 'border-t border-white/5 bg-white/5'}`}>
          <div className="mb-6 px-1">
            <div className="flex items-center justify-between mb-3">
              <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${isEthereal ? 'text-slate-400' : 'text-slate-500'}`}>Workspace Health</span>
              <span className={`text-[11px] font-black ${isEthereal ? 'text-[#10b981]' : 'text-[#00E5FF]'}`}>98%</span>
            </div>
            <div className={`w-full h-2 rounded-full overflow-hidden ${isEthereal ? 'bg-white shadow-inner' : 'bg-slate-800'}`}>
              <div className={`h-full w-[98%] transition-all duration-1000 ${isEthereal ? 'bg-[#10b981]' : 'bg-[#00E5FF] shadow-[0_0_10px_rgba(0,229,255,0.4)]'}`}></div>
            </div>
          </div>

          <NavLink
            to="/settings"
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center px-5 py-3.5 rounded-2xl transition-all duration-200 group font-bold text-sm ${isActive
                ? (isEthereal ? 'bg-[#10b981]/15 text-[#064e3b]' : 'bg-[#00E5FF]/20 text-[#00E5FF]')
                : (isEthereal ? 'text-slate-500 hover:text-[#064e3b]' : 'text-slate-400 hover:text-white')
              }`
            }
          >
            <Settings className="w-5 h-5 mr-4 group-hover:rotate-45 transition-transform duration-500" />
            Settings
          </NavLink>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;