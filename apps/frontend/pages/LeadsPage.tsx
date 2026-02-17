import React, { useState } from 'react';
import { Users, Upload, Download, Search, Filter, Clock, Mail, CheckCircle2, AlertCircle, XCircle, ChevronRight, Zap, MousePointer2, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const LeadStatusBadge: React.FC<{ status: string, theme: 'ethereal' | 'glass' }> = ({ status, theme }) => {
  const isEthereal = theme === 'ethereal';
  const styles = {
    unassigned: isEthereal ? 'bg-slate-100 text-slate-500' : 'bg-slate-800 text-slate-400',
    queued: isEthereal ? 'bg-indigo-50 text-indigo-600' : 'bg-indigo-500/10 text-indigo-400',
    sent: isEthereal ? 'bg-sky-50 text-sky-600' : 'bg-sky-500/10 text-sky-400',
    opened: isEthereal ? 'bg-emerald-50 text-emerald-600' : 'bg-emerald-500/10 text-emerald-400',
    replied: isEthereal ? 'bg-[#10b981]/10 text-[#064e3b]' : 'bg-[#00E5FF]/10 text-[#00E5FF]',
    bounced: 'bg-rose-50 text-rose-600',
  };

  return (
    <div className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-transparent w-fit ${styles[status] || styles.unassigned}`}>
      {status}
    </div>
  );
};

const LeadsPage: React.FC<{ theme: 'ethereal' | 'glass' }> = ({ theme }) => {
  const isEthereal = theme === 'ethereal';
  const [search, setSearch] = useState('');

  const mockLeads = [
    { id: '1', email: 'jeff@amazon.com', firstName: 'Jeff', lastName: 'Bezos', company: 'Amazon', status: 'opened', lastSeen: '2h ago' },
    { id: '2', email: 'satya@microsoft.com', firstName: 'Satya', lastName: 'Nadella', company: 'Microsoft', status: 'replied', lastSeen: '5m ago' },
    { id: '3', email: 'tim@apple.com', firstName: 'Tim', lastName: 'Cook', company: 'Apple', status: 'unassigned', lastSeen: '1d ago' },
  ];

  return (
    <div className="space-y-8 fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className={`text-3xl md:text-4xl font-black font-heading tracking-tight ${isEthereal ? 'text-[#064e3b]' : 'text-white'}`}>Contact Cloud</h1>
          <p className={`${isEthereal ? 'text-slate-600' : 'text-slate-400'} font-medium`}>Manage outreach database and sequence triggers.</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className={`px-6 py-3.5 rounded-2xl font-black text-xs transition-all shadow-md flex items-center ${isEthereal ? 'bg-white text-slate-700' : 'bg-white/5 text-slate-300'}`}>
            <Download size={16} className="mr-2" /> Export
          </button>
          <button className="btn-primary px-6 py-3.5 rounded-2xl font-black text-xs transition-all shadow-xl flex items-center">
            <Upload size={16} className="mr-2" /> Import CSV
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Total Base', val: '12,451', icon: Users, color: isEthereal ? '#10b981' : '#00E5FF' },
          { label: 'High Interest', val: '1,842', icon: CheckCircle2, color: '#f59e0b' },
          { label: 'Live Sequences', val: '4,120', icon: Zap, color: '#6366f1' }
        ].map((stat, i) => (
          <div key={i} className="glass-surface p-8 rounded-[2.5rem] flex items-center space-x-5 transition-all hover:scale-[1.02]">
             <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ backgroundColor: `${stat.color}15`, color: stat.color }}>
                <stat.icon size={28} />
             </div>
             <div>
                <p className={`text-[10px] font-black uppercase tracking-[0.2em] mb-1 ${isEthereal ? 'text-slate-500' : 'text-slate-500'}`}>{stat.label}</p>
                <p className={`text-2xl font-black font-heading ${isEthereal ? 'text-[#064e3b]' : 'text-white'}`}>{stat.val}</p>
             </div>
          </div>
        ))}
      </div>

      <div className="glass-surface rounded-[2.5rem] overflow-hidden">
        <div className={`p-8 border-b ${isEthereal ? 'border-slate-100 bg-white/30' : 'border-white/5 bg-white/5'} flex flex-col md:flex-row md:items-center justify-between gap-6`}>
          <div className="relative flex-1 max-w-lg">
            <Search className={`absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 ${isEthereal ? 'text-slate-400' : 'text-slate-500'}`} />
            <input 
              type="text" 
              placeholder="Find a contact..." 
              className={`w-full h-12 pl-14 pr-6 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 transition-all ${
                isEthereal ? 'bg-white/60 border-slate-200 text-slate-700 focus:ring-[#10b981]/20' : 'bg-black/20 border-white/5 text-white focus:ring-[#00E5FF]/20'
              }`}
            />
          </div>
          <button className={`p-4 rounded-2xl transition-all ${isEthereal ? 'bg-white text-slate-600 hover:bg-slate-50' : 'bg-white/5 text-slate-400 hover:bg-white/10'}`}>
             <Filter size={20} />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className={`text-[10px] font-black uppercase tracking-widest ${isEthereal ? 'text-[#064e3b]/40 bg-[#10b981]/5' : 'text-slate-500 bg-white/5'}`}>
                <th className="px-10 py-6">Name & Email</th>
                <th className="px-10 py-6">Current Status</th>
                <th className="px-10 py-6">Organization</th>
                <th className="px-10 py-6">Last Event</th>
                <th className="px-10 py-6 text-right">Activity</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${isEthereal ? 'divide-slate-100' : 'divide-white/5'}`}>
              {mockLeads.map((lead) => (
                <tr key={lead.id} className={`${isEthereal ? 'hover:bg-[#10b981]/5' : 'hover:bg-white/5'} transition-colors group cursor-pointer`}>
                  <td className="px-10 py-8">
                    <div className="flex items-center space-x-4">
                      <div className={`w-11 h-11 rounded-2xl flex items-center justify-center font-black text-xs ${isEthereal ? 'bg-[#10b981]/10 text-[#064e3b]' : 'bg-[#00E5FF]/10 text-[#00E5FF]'}`}>
                        {lead.firstName[0]}{lead.lastName[0]}
                      </div>
                      <div className="min-w-0">
                        <p className={`text-sm font-black ${isEthereal ? 'text-[#064e3b]' : 'text-white'}`}>{lead.firstName} {lead.lastName}</p>
                        <p className={`text-[11px] font-bold ${isEthereal ? 'text-slate-500' : 'text-slate-500'}`}>{lead.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-10 py-8">
                    <LeadStatusBadge status={lead.status} theme={theme} />
                  </td>
                  <td className={`px-10 py-8 text-sm font-bold ${isEthereal ? 'text-slate-700' : 'text-slate-300'}`}>
                    {lead.company}
                  </td>
                  <td className={`px-10 py-8 text-[11px] font-black uppercase tracking-widest ${isEthereal ? 'text-slate-400' : 'text-slate-600'}`}>
                    {lead.lastSeen}
                  </td>
                  <td className="px-10 py-8 text-right">
                    <button className={`p-3 rounded-2xl transition-all ${isEthereal ? 'hover:bg-[#10b981]/10 text-[#064e3b]' : 'hover:bg-[#00E5FF]/10 text-[#00E5FF]'}`}>
                      <ChevronRight size={22} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default LeadsPage;