import React from 'react';
import { User, Building, CreditCard, Shield, Bell, Key, CheckCircle2 } from 'lucide-react';

const SettingsPage: React.FC<{ theme: 'ethereal' | 'glass' }> = ({ theme }) => {
  const isEthereal = theme === 'ethereal';

  const menuItems = [
    { name: 'Profile', icon: User, active: true },
    { name: 'Workspace', icon: Building, active: false },
    { name: 'Subscription', icon: CreditCard, active: false },
    { name: 'Security', icon: Shield, active: false },
    { name: 'Integrations', icon: Key, active: false },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8 fade-in pb-20">
      <div>
        <h1 className={`text-3xl md:text-4xl font-black font-heading tracking-tight ${isEthereal ? 'text-[#064e3b]' : 'text-white'}`}>Configuration</h1>
        <p className={`${isEthereal ? 'text-slate-600' : 'text-slate-400'} font-medium`}>Fine-tune your workspace protocols and team security.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-10">
        <div className="w-full lg:w-72 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.name}
              className={`w-full flex items-center px-6 py-4 rounded-2xl transition-all font-black text-sm ${
                item.active 
                  ? (isEthereal ? 'bg-[#10b981]/15 text-[#064e3b] border border-[#10b981]/20' : 'bg-[#00E5FF]/20 text-[#00E5FF] border border-[#00E5FF]/20') 
                  : (isEthereal ? 'text-slate-500 hover:bg-slate-100' : 'text-slate-400 hover:bg-white/5')
              }`}
            >
              <item.icon className="w-5 h-5 mr-4" />
              {item.name}
            </button>
          ))}
        </div>

        <div className="flex-1 space-y-10">
          <div className="glass-surface rounded-[2.5rem] p-8 md:p-10">
            <h2 className={`text-2xl font-black font-heading mb-8 ${isEthereal ? 'text-[#064e3b]' : 'text-white'}`}>Workspace Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Entity Name</label>
                <input 
                  type="text" 
                  defaultValue="Alpha Growth" 
                  className={`w-full h-14 px-6 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 transition-all ${
                    isEthereal ? 'bg-white/60 border-slate-200 text-slate-700 focus:ring-[#10b981]/20' : 'bg-black/20 border-white/5 text-white focus:ring-[#00E5FF]/20'
                  }`}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Primary Domain</label>
                <input 
                  type="text" 
                  defaultValue="skyreach.ai" 
                  className={`w-full h-14 px-6 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 transition-all ${
                    isEthereal ? 'bg-white/60 border-slate-200 text-slate-700 focus:ring-[#10b981]/20' : 'bg-black/20 border-white/5 text-white focus:ring-[#00E5FF]/20'
                  }`}
                />
              </div>
            </div>
          </div>

          <div className="glass-surface rounded-[2.5rem] p-8 md:p-10">
            <div className="flex items-center justify-between mb-10">
               <h2 className={`text-2xl font-black font-heading ${isEthereal ? 'text-[#064e3b]' : 'text-white'}`}>Team Governance</h2>
               <button className="btn-primary px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-md">Invite Member</button>
            </div>
            <div className="space-y-4">
              {[
                { name: 'Alex Reed', role: 'Protocol Owner', email: 'alex@skyreach.ai', status: 'Active' },
                { name: 'Jordan Smith', role: 'Security Admin', email: 'jordan@skyreach.ai', status: 'Active' },
              ].map(m => (
                <div key={m.email} className={`flex items-center justify-between p-6 rounded-[1.8rem] border transition-all ${
                  isEthereal ? 'bg-white border-slate-100 hover:shadow-sm' : 'bg-white/5 border-white/5 hover:bg-white/10'
                }`}>
                  <div className="flex items-center space-x-5">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xs text-white ${isEthereal ? 'bg-[#10b981]' : 'bg-[#00E5FF] text-slate-900'}`}>
                      {m.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p className={`text-sm font-black ${isEthereal ? 'text-[#064e3b]' : 'text-white'}`}>{m.name}</p>
                      <p className="text-xs text-slate-500 font-bold">{m.email}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">{m.role}</p>
                    <span className="text-[10px] font-black text-emerald-500 flex items-center justify-end uppercase tracking-tighter">
                      <CheckCircle2 size={12} className="mr-1.5" /> {m.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end pt-6">
            <button className="btn-primary px-12 py-4 rounded-2xl font-black uppercase tracking-widest text-xs transition-all shadow-xl active:scale-95">
              Sync All Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;