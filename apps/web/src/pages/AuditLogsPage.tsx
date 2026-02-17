import React, { useState } from 'react';
import { Search, Filter, History, ShieldCheck, ArrowRight, Activity, Database } from 'lucide-react';
import { motion } from 'framer-motion';

const AuditLogsPage: React.FC<{ theme: 'ethereal' | 'glass' }> = ({ theme }) => {
  const isEthereal = theme === 'ethereal';

  const mockLogs = [
    { id: 'a1', user: 'Alex Reed', action: 'Paused Campaign', entity: 'Enterprise Series', time: '12m ago', type: 'campaign' },
    { id: 'a2', user: 'Jordan Smith', action: 'Updated Sequence', entity: 'SaaS Growth', time: '1h ago', type: 'sequence' },
    { id: 'a3', user: 'System', action: 'Triggered Shield', entity: 'sales@skyreach.io', time: '4h ago', type: 'security' }
  ];

  return (
    <div className="space-y-8 fade-in pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 className={`text-3xl md:text-4xl font-black font-heading tracking-tight ${isEthereal ? 'text-[#064e3b]' : 'text-white'}`}>Governance Trail</h1>
          <p className={`${isEthereal ? 'text-slate-600' : 'text-slate-400'} font-medium`}>Immutable security audit logs for workspace operations.</p>
        </div>
        <div className={`px-5 py-2.5 rounded-2xl flex items-center border ${isEthereal ? 'bg-[#10b981]/10 border-[#10b981]/20 text-[#064e3b]' : 'bg-[#00E5FF]/10 border-[#00E5FF]/20 text-[#00E5FF]'}`}>
          <ShieldCheck size={18} className="mr-3" />
          <span className="text-[10px] font-black uppercase tracking-widest">WORM Storage Active</span>
        </div>
      </div>

      <div className="glass-surface rounded-[2.5rem] overflow-hidden">
        <div className={`p-8 border-b flex flex-col md:flex-row md:items-center justify-between gap-6 ${isEthereal ? 'border-slate-100 bg-white/30' : 'border-white/5 bg-white/5'}`}>
           <div className="relative flex-1 max-w-lg">
             <Search className={`absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 ${isEthereal ? 'text-slate-400' : 'text-slate-500'}`} />
             <input 
               type="text" 
               placeholder="Audit by user or entity..."
               className={`w-full h-12 pl-14 pr-6 rounded-2xl text-xs font-bold focus:outline-none transition-all ${
                 isEthereal ? 'bg-white/60 border-slate-200 text-slate-700' : 'bg-black/20 border-white/5 text-white'
               }`}
             />
           </div>
           <button className={`p-4 rounded-2xl transition-all ${isEthereal ? 'bg-slate-100 text-slate-600' : 'bg-white/5 text-slate-400'}`}>
              <Filter size={20} />
           </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className={`text-[10px] font-black uppercase tracking-[0.2em] ${isEthereal ? 'text-[#064e3b]/40 bg-[#10b981]/5' : 'text-slate-500 bg-white/5'}`}>
                <th className="px-10 py-6">Timestamp</th>
                <th className="px-10 py-6">Authority</th>
                <th className="px-10 py-6">Action Protocol</th>
                <th className="px-10 py-6">Target Entity</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${isEthereal ? 'divide-slate-100' : 'divide-white/5'}`}>
              {mockLogs.map((log) => (
                <tr key={log.id} className={`transition-all ${isEthereal ? 'hover:bg-[#10b981]/5' : 'hover:bg-white/5'}`}>
                  <td className="px-10 py-8 whitespace-nowrap">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-tighter">{log.time}</span>
                  </td>
                  <td className="px-10 py-8">
                    <div className="flex items-center space-x-4">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-[10px] text-white ${isEthereal ? 'bg-[#10b981]' : 'bg-[#00E5FF] text-slate-900'}`}>
                        {log.user[0]}
                      </div>
                      <span className={`text-sm font-black ${isEthereal ? 'text-[#064e3b]' : 'text-white'}`}>{log.user}</span>
                    </div>
                  </td>
                  <td className="px-10 py-8">
                     <span className={`px-2.5 py-1 text-[10px] font-black uppercase rounded-lg border ${
                       isEthereal ? 'bg-slate-50 border-slate-200 text-slate-600' : 'bg-white/5 border-white/10 text-slate-400'
                     }`}>{log.action}</span>
                  </td>
                  <td className="px-10 py-8">
                    <div className="flex items-center space-x-3 text-slate-500 font-bold text-sm">
                       {log.type === 'campaign' ? <Activity size={16} /> : <Database size={16} />}
                       <span>{log.entity}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className={`glass-surface rounded-[2.5rem] p-10 flex flex-col md:flex-row items-center justify-between border-dashed border-2 ${isEthereal ? 'border-slate-200' : 'border-white/10'}`}>
        <div className="flex items-center space-x-6 mb-6 md:mb-0">
           <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${isEthereal ? 'bg-[#10b981]/10 text-[#10b981]' : 'bg-[#00E5FF]/10 text-[#00E5FF]'}`}>
              <History size={28} />
           </div>
           <div>
              <p className={`text-lg font-black font-heading ${isEthereal ? 'text-[#064e3b]' : 'text-white'}`}>Compliance Export</p>
              <p className="text-sm font-medium text-slate-500">Generate a signed audit report for SOC2 or HIPAA compliance reviews.</p>
           </div>
        </div>
        <button className="btn-primary px-10 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg active:scale-95 transition-all">
           Request Protocol Log <ArrowRight size={14} className="inline ml-2" />
        </button>
      </div>
    </div>
  );
};

export default AuditLogsPage;