import React, { useState, useEffect } from 'react';
import { Mail, Plus, ShieldCheck, Activity, Trash2, Settings, RefreshCw, AlertCircle, Flame, Globe } from 'lucide-react';
import { motion } from 'framer-motion';

const InboxCard: React.FC<{ inbox: any; theme: 'ethereal' | 'glass' }> = ({ inbox, theme }) => {
  const isEthereal = theme === 'ethereal';
  const primaryColor = isEthereal ? '#10b981' : '#00E5FF';

  return (
    <div className={`glass-surface p-7 rounded-[2.5rem] group relative transition-all duration-500 hover:scale-[1.03]`}>
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${isEthereal ? 'bg-[#10b981]/10 text-[#059669]' : 'bg-white/5 text-[#00E5FF]'}`}>
            <Mail size={24} />
          </div>
          <div className="min-w-0">
            <h3 className={`font-black text-sm truncate max-w-[150px] ${isEthereal ? 'text-[#064e3b]' : 'text-white'}`}>{inbox.email}</h3>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">{inbox.provider}</p>
          </div>
        </div>
        <div className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border transition-colors ${
          inbox.status === 'active' ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' : 'bg-rose-500/10 text-rose-500 border-rose-500/20'
        }`}>
          {inbox.status}
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <div className="flex justify-between items-center mb-3">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Reputation</span>
            <span className={`text-xs font-black ${inbox.health > 90 ? 'text-emerald-500' : 'text-amber-500'}`}>{inbox.health}%</span>
          </div>
          <div className={`w-full h-2 rounded-full overflow-hidden ${isEthereal ? 'bg-white shadow-inner' : 'bg-slate-800'}`}>
            <div className={`h-full transition-all duration-1000 ${inbox.health > 90 ? 'bg-emerald-500' : 'bg-amber-500'}`} style={{ width: `${inbox.health}%` }}></div>
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Daily Flow</span>
          <span className={`text-xs font-black ${isEthereal ? 'text-slate-700' : 'text-white'}`}>34 / 50</span>
        </div>
      </div>

      <div className="flex items-center space-x-3 pt-6 mt-8 border-t border-slate-500/10 opacity-0 group-hover:opacity-100 transition-all duration-300">
        <button className={`flex-1 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${isEthereal ? 'bg-slate-100 text-slate-700' : 'bg-white/5 text-slate-400 hover:text-white'}`}>
          <Settings size={14} className="inline mr-2" /> Manage
        </button>
        <button className="p-3 bg-rose-500/10 hover:bg-rose-500 text-rose-500 hover:text-white rounded-2xl transition-all">
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
};

const InboxesPage: React.FC<{ theme: 'ethereal' | 'glass' }> = ({ theme }) => {
  const isEthereal = theme === 'ethereal';
  const mockInboxes = [
    { id: 1, email: 'alex@skyreach.ai', provider: 'google', status: 'active', health: 98 },
    { id: 2, email: 'sales@skyreach.io', provider: 'outlook', status: 'active', health: 94 },
    { id: 3, email: 'growth@fastmail.com', provider: 'smtp', status: 'warning', health: 72 },
  ];

  return (
    <div className="space-y-8 fade-in pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className={`text-3xl md:text-4xl font-black font-heading tracking-tight ${isEthereal ? 'text-[#064e3b]' : 'text-white'}`}>Mail Command</h1>
          <p className={`${isEthereal ? 'text-slate-600' : 'text-slate-400'} font-medium`}>Scaling outreach while maintaining 100% sender reputation.</p>
        </div>
        <button className="btn-primary px-8 py-4 rounded-2xl font-black text-sm transition-all shadow-xl active:scale-95 flex items-center">
          <Plus size={18} className="mr-2" /> Add Connection
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {mockInboxes.map(inbox => (
          <InboxCard key={inbox.id} inbox={inbox} theme={theme} />
        ))}
        <button className={`h-full min-h-[220px] rounded-[2.5rem] border-2 border-dashed flex flex-col items-center justify-center transition-all ${
          isEthereal ? 'border-slate-200 text-slate-400 hover:border-[#10b981]/50 hover:bg-[#10b981]/5 hover:text-[#10b981]' 
                    : 'border-white/10 text-slate-600 hover:border-[#00E5FF]/50 hover:bg-[#00E5FF]/5 hover:text-[#00E5FF]'
        }`}>
          <Plus size={40} className="mb-4" />
          <span className="text-xs font-black uppercase tracking-widest">Connect New Node</span>
        </button>
      </div>

      <div className={`glass-surface rounded-[3rem] p-10 flex flex-col md:flex-row items-center justify-between relative overflow-hidden`}>
        <div className={`absolute top-0 left-0 w-40 h-40 blur-3xl opacity-10 -ml-20 -mt-20 ${isEthereal ? 'bg-[#10b981]' : 'bg-[#00E5FF]'}`}></div>
        <div className="flex items-center mb-6 md:mb-0 relative z-10">
          <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center mr-8 shadow-xl ${isEthereal ? 'bg-[#10b981]' : 'bg-[#00E5FF]'}`}>
            <ShieldCheck className={isEthereal ? 'text-white' : 'text-slate-900'} size={36} />
          </div>
          <div>
            <h2 className={`text-2xl font-black font-heading ${isEthereal ? 'text-[#064e3b]' : 'text-white'}`}>Reputation Shield Active</h2>
            <p className={`${isEthereal ? 'text-slate-500' : 'text-slate-400'} text-sm font-medium max-w-lg`}>SPF, DKIM, and DMARC parameters are verified every 4 hours for all connected nodes.</p>
          </div>
        </div>
        <button className={`px-8 py-4 rounded-2xl text-xs font-black uppercase tracking-widest border transition-all ${
          isEthereal ? 'bg-white border-slate-100 text-[#064e3b] shadow-sm hover:shadow-md' : 'bg-white/5 border-white/10 text-white hover:bg-white/10'
        }`}>
          Audit All Domains <RefreshCw size={14} className="inline ml-3" />
        </button>
      </div>
    </div>
  );
};

export default InboxesPage;