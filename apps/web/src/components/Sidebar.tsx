import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  Leaf,
  LayoutDashboard,
  Megaphone,
  Users,
  Mail,
  Inbox,
  Flame,
  BarChart3,
  Settings,
  Search,
  CheckCircle,
  XCircle,
  History,
  Bell,
  HelpCircle
} from 'lucide-react';

interface SidebarProps {
  theme: 'ethereal' | 'glass';
  workspace: { id: string; name: string };
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ theme, workspace, onClose }) => {
  const location = useLocation();

  const sidebarItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: Megaphone, label: 'Campaigns', path: '/campaigns' },
    { icon: Users, label: 'Leads', path: '/leads' },
    { icon: Mail, label: 'Smart Inbox', path: '/replies' },
    { icon: Inbox, label: 'Email Accounts', path: '/inboxes' },
    { icon: Flame, label: 'Warmup', path: '/warmup' },
    { icon: BarChart3, label: 'Analytics', path: '/analytics' },
    { icon: History, label: 'Audit Logs', path: '/audit-logs' },
    { icon: Bell, label: 'Notifications', path: '/notifications' },
    { icon: HelpCircle, label: 'Support', path: '/support' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  return (
    <aside className={`w-64 h-full flex flex-col transition-all duration-300 relative z-50
      ${theme === 'glass'
        ? 'bg-slate-900/80 backdrop-blur-xl border-r border-slate-800'
        : 'bg-white/80 backdrop-blur-xl border-r border-slate-200 shadow-xl'
      }
    `}>
      <div className="p-6 flex items-center gap-3">
        <div className={`p-2 rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-500 shadow-lg`}>
          <Leaf className="text-white w-6 h-6" />
        </div>
        <div>
          <h1 className={`font-bold text-xl tracking-tight font-heading
            ${theme === 'glass' ? 'text-white' : 'text-slate-800'}
          `}>
            SkyReach
          </h1>
          <p className={`text-xs font-medium
             ${theme === 'glass' ? 'text-slate-400' : 'text-slate-500'}
          `}>
            Enterprise
          </p>
        </div>
      </div>

      <div className="px-4 mb-4">
        <div className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all
          ${theme === 'glass'
            ? 'bg-slate-800/50 border-slate-700 hover:bg-slate-800 text-slate-200'
            : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700'
          }
        `}>
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm
              ${theme === 'glass' ? 'bg-slate-700' : 'bg-slate-200'}
            `}>
              {workspace.name.substring(0, 1)}
            </div>
            <span className="font-medium text-sm truncate max-w-[100px]">{workspace.name}</span>
          </div>
          <svg className="w-4 h-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-1 overflow-y-auto custom-scrollbar">
        {sidebarItems.map((item) => {
          const isActive = location.pathname.startsWith(item.path);
          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={({ isActive }) => `
                flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group
                ${isActive
                  ? (theme === 'glass'
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20'
                    : 'bg-emerald-500 text-white shadow-lg shadow-emerald-200'
                  )
                  : (theme === 'glass'
                    ? 'text-slate-400 hover:bg-slate-800 hover:text-white'
                    : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
                  )
                }
              `}
            >
              <item.icon className={`w-5 h-5 transition-transform group-hover:scale-110 ${isActive ? 'animate-pulse-slow' : ''}`} />
              <span className="font-medium">{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className={`p-4 border-t ${theme === 'glass' ? 'border-slate-800' : 'border-slate-200'}`}>
        <div className={`rounded-xl p-4 relative overflow-hidden group
           ${theme === 'glass' ? 'bg-gradient-to-br from-indigo-900/50 to-purple-900/50 border border-indigo-500/20' : 'bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100'}
        `}>
          <div className="absolute top-0 right-0 w-16 h-16 bg-white/10 rounded-full blur-2xl transform translate-x-1/2 -translate-y-1/2"></div>
          <div className="relative z-10">
            <h4 className={`text-sm font-bold mb-1 ${theme === 'glass' ? 'text-white' : 'text-indigo-900'}`}>
              Pro Plan
            </h4>
            <p className={`text-xs mb-3 ${theme === 'glass' ? 'text-indigo-200' : 'text-indigo-600'}`}>
              2,450 / 5,000 emails
            </p>
            <div className={`h-1.5 rounded-full overflow-hidden ${theme === 'glass' ? 'bg-black/20' : 'bg-indigo-100'}`}>
              <div className="h-full bg-gradient-to-r from-indigo-400 to-purple-400 w-[55%] rounded-full"></div>
            </div>
            <button className={`mt-3 w-full py-1.5 text-xs font-bold rounded-lg transition-colors
              ${theme === 'glass'
                ? 'bg-white/10 hover:bg-white/20 text-white'
                : 'bg-indigo-100 hover:bg-indigo-200 text-indigo-700'
              }
            `}>
              Upgrade Limit
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;