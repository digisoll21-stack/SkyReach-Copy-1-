import React from 'react';
import { Flame, CheckCircle2, ShieldCheck, BarChart3, Settings, Info, Play, Pause } from 'lucide-react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

const rampData = [
  { day: 'D1', vol: 5 }, { day: 'D2', vol: 10 }, { day: 'D3', vol: 15 }, { day: 'D4', vol: 20 },
  { day: 'D5', vol: 25 }, { day: 'D6', vol: 35 }, { day: 'D7', vol: 50 },
];

const WarmupPage: React.FC<{ theme: 'ethereal' | 'glass' }> = ({ theme }) => {
  const isEthereal = theme === 'ethereal';
  const primaryColor = isEthereal ? '#10b981' : '#00E5FF';

  return (
    <div className="space-y-8 fade-in pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className={`text-3xl md:text-4xl font-black font-heading tracking-tight ${isEthereal ? 'text-[#064e3b]' : 'text-white'}`}>Warmup Engine</h1>
          <p className={`${isEthereal ? 'text-slate-600' : 'text-slate-400'} font-medium`}>Protecting deliverability with AI-powered peer simulation.</p>
        </div>
        <div className={`px-5 py-2.5 rounded-2xl flex items-center border ${isEthereal ? 'bg-[#10b981]/10 border-[#10b981]/20' : 'bg-[#00E5FF]/10 border-[#00E5FF]/20'}`}>
          <div className={`w-2.5 h-2.5 rounded-full mr-3 animate-ping ${isEthereal ? 'bg-[#10b981]' : 'bg-[#00E5FF]'}`}></div>
          <span className={`text-[10px] font-black uppercase tracking-widest ${isEthereal ? 'text-[#064e3b]' : 'text-[#00E5FF]'}`}>Global Pool Online</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="glass-surface p-8 rounded-[2.5rem] relative overflow-hidden group">
          <Flame className={`absolute bottom-[-10px] right-[-10px] w-28 h-28 opacity-10 transition-transform duration-700 group-hover:scale-125 ${isEthereal ? 'text-[#10b981]' : 'text-orange-500'}`} />
          <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Network Reach</h3>
          <p className={`text-3xl font-black font-heading ${isEthereal ? 'text-[#064e3b]' : 'text-white'}`}>42,802</p>
          <p className="text-[10px] text-slate-400 font-bold">Authenticated senders</p>
        </div>
        <div className="glass-surface p-8 rounded-[2.5rem]">
          <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Inbox Placement</h3>
          <p className={`text-3xl font-black font-heading ${isEthereal ? 'text-[#064e3b]' : 'text-white'}`}>99.4%</p>
          <div className="flex items-center text-[10px] text-emerald-500 font-black uppercase tracking-widest mt-1">
            <CheckCircle2 size={12} className="mr-1.5" /> High Reputation
          </div>
        </div>
        <div className="glass-surface p-8 rounded-[2.5rem]">
          <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">AI Interactions</h3>
          <p className={`text-3xl font-black font-heading ${isEthereal ? 'text-[#064e3b]' : 'text-white'}`}>12.5k</p>
          <p className="text-[10px] text-slate-400 font-bold">Past 24 hours</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 glass-surface rounded-[2.5rem] overflow-hidden flex flex-col">
          <div className={`px-8 py-6 border-b flex items-center justify-between ${isEthereal ? 'border-slate-100 bg-white/30' : 'border-white/5 bg-white/5'}`}>
            <h2 className={`text-lg font-black font-heading ${isEthereal ? 'text-[#064e3b]' : 'text-white'}`}>Active Senders</h2>
            <button className={`text-[10px] font-black uppercase tracking-widest flex items-center transition-all ${isEthereal ? 'text-indigo-600 hover:text-indigo-700' : 'text-[#00E5FF] hover:text-cyan-300'}`}>
              Bulk Config <Settings size={14} className="ml-2" />
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className={`text-[9px] font-black uppercase tracking-[0.2em] ${isEthereal ? 'text-[#064e3b]/40 bg-[#10b981]/5' : 'text-slate-500 bg-white/5'}`}>
                  <th className="px-8 py-5">Node Identity</th>
                  <th className="px-8 py-5">Ramp Progress</th>
                  <th className="px-8 py-5">Health Status</th>
                  <th className="px-8 py-5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${isEthereal ? 'divide-slate-100' : 'divide-white/5'}`}>
                {[
                  { email: 'alex@skyreach.ai', vol: '25/50', health: '98%', status: 'active' },
                  { email: 'sales@skyreach.io', vol: '12/50', health: '94%', status: 'active' },
                ].map((node, i) => (
                  <tr key={i} className={`${isEthereal ? 'hover:bg-[#10b981]/5' : 'hover:bg-white/5'} transition-colors group`}>
                    <td className="px-8 py-6 font-bold text-sm">{node.email}</td>
                    <td className="px-8 py-6">
                      <div className="flex items-center space-x-3">
                        <div className={`w-32 h-1.5 rounded-full overflow-hidden ${isEthereal ? 'bg-slate-200' : 'bg-slate-800'}`}>
                           <div className="bg-orange-500 h-full" style={{ width: '60%' }}></div>
                        </div>
                        <span className="text-[10px] font-black text-slate-500">{node.vol}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                       <span className={`text-[10px] font-black uppercase tracking-widest ${isEthereal ? 'text-emerald-600' : 'text-[#00E5FF]'}`}>{node.health} Healthy</span>
                    </td>
                    <td className="px-8 py-6 text-right">
                       <button className={`p-2.5 rounded-2xl transition-all ${isEthereal ? 'bg-[#10b981]/10 text-[#059669]' : 'bg-white/5 text-slate-400 hover:text-white'}`}>
                         <Pause size={16} />
                       </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="glass-surface p-8 rounded-[2.5rem] flex flex-col">
           <h3 className={`text-sm font-black font-heading mb-8 flex items-center ${isEthereal ? 'text-[#064e3b]' : 'text-white'}`}>
              <BarChart3 className={`mr-3 ${isEthereal ? 'text-[#10b981]' : 'text-[#00E5FF]'}`} size={18} /> Simulation Curve
           </h3>
           <div className="flex-1 min-h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                 <AreaChart data={rampData}>
                    <defs>
                      <linearGradient id="colorRamp" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={primaryColor} stopOpacity={0.3}/>
                        <stop offset="95%" stopColor={primaryColor} stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <Area type="monotone" dataKey="vol" stroke={primaryColor} strokeWidth={4} fill="url(#colorRamp)" />
                    <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                 </AreaChart>
              </ResponsiveContainer>
           </div>
           <div className={`mt-8 p-6 rounded-[1.5rem] border ${isEthereal ? 'bg-[#10b981]/5 border-[#10b981]/10' : 'bg-white/5 border-white/10'}`}>
              <p className={`text-[10px] font-bold leading-relaxed ${isEthereal ? 'text-slate-600' : 'text-slate-400'}`}>
                 <Info size={14} className="inline mr-2 text-indigo-500" /> AI Nodes simulate realistic thread depth (1-4 replies) to maximize authority scores across ISP networks.
              </p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default WarmupPage;