import React from 'react';
import { Bell, Search, ChevronDown, Menu, Sparkles, Sun } from 'lucide-react';

interface NavbarProps {
  workspace: { id: string; name: string };
  theme: 'ethereal' | 'glass';
  onToggleTheme: () => void;
  onWorkspaceChange: (w: { id: string; name: string }) => void;
  onToggleSidebar: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ workspace, theme, onToggleTheme, onToggleSidebar }) => {
  const isEthereal = theme === 'ethereal';

  return (
    <header className="h-20 flex items-center justify-between px-4 md:px-8 z-30 sticky top-0 w-full transition-all duration-500">
      <div className="flex-1 flex items-center justify-between px-6 h-16 glass-surface rounded-3xl shadow-lg border-white/20">
        <div className="flex items-center space-x-4">
          <button onClick={onToggleSidebar} className={`p-2 lg:hidden ${isEthereal ? 'text-slate-600' : 'text-slate-300'}`}>
            <Menu size={24} />
          </button>
          <div className={`flex items-center space-x-3 px-3 py-1.5 rounded-2xl border cursor-pointer hover:shadow-sm transition-all ${isEthereal ? 'bg-white/20 border-white/40' : 'bg-white/5 border-white/10'}`}>
            <span className={`w-7 h-7 rounded-lg text-[10px] flex items-center justify-center font-black text-white ${isEthereal ? 'bg-[#10b981]' : 'bg-[#00E5FF] text-slate-900'}`}>AG</span>
            <span className={`text-sm font-black ${isEthereal ? 'text-[#064e3b]' : 'text-white'}`}>{workspace.name}</span>
            <ChevronDown size={14} className={isEthereal ? 'text-slate-400' : 'text-slate-500'} />
          </div>
        </div>

        <div className="flex-1 max-w-lg mx-10 relative hidden md:block">
          <Search className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 ${isEthereal ? 'text-slate-400' : 'text-slate-500'}`} />
          <input 
            type="text" 
            placeholder="Search leads or sequences..." 
            className={`w-full h-10 pl-12 pr-4 rounded-2xl text-xs font-medium focus:outline-none transition-all ${
              isEthereal ? 'bg-white/40 border border-white/60 text-slate-700 focus:bg-white/60' : 'bg-black/20 border border-white/10 text-white focus:bg-white/10'
            }`}
          />
        </div>

        <div className="flex items-center space-x-3">
          <button 
            onClick={onToggleTheme}
            className={`p-2.5 rounded-2xl transition-all ${isEthereal ? 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100' : 'bg-[#FFC107]/10 text-[#FFC107] hover:bg-[#FFC107]/20'}`}
          >
            {isEthereal ? <Sparkles size={18} /> : <Sun size={18} />}
          </button>
          <button className={`relative p-2.5 rounded-2xl transition-all ${isEthereal ? 'text-slate-400 hover:bg-slate-100' : 'text-slate-400 hover:bg-white/10'}`}>
            <Bell size={20} />
            <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white shadow-sm"></span>
          </button>
          <div className={`w-[1.5px] h-8 mx-2 ${isEthereal ? 'bg-slate-200' : 'bg-white/10'}`}></div>
          <div className="flex items-center space-x-3 pl-2">
            <div className={`w-9 h-9 rounded-2xl flex items-center justify-center font-black text-white ${isEthereal ? 'bg-[#10b981]' : 'bg-[#00E5FF] text-slate-900'}`}>AR</div>
            <div className="hidden sm:block leading-tight">
              <p className={`text-xs font-black ${isEthereal ? 'text-[#064e3b]' : 'text-white'}`}>Alex Reed</p>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Admin</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;