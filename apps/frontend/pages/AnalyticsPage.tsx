import React from 'react';
import { BarChart3, PieChart, TrendingUp, Globe, Mail, BarChart2 } from 'lucide-react';
import { 
  BarChart, Bar, 
  XAxis, YAxis, 
  CartesianGrid, Tooltip, 
  ResponsiveContainer, 
  Legend,
  PieChart as RPieChart, Pie, Cell
} from 'recharts';

const data = [
  { name: 'Outlook', success: 4000, bounce: 240 },
  { name: 'Gmail', success: 3000, bounce: 139 },
  { name: 'Office 365', success: 2000, bounce: 980 },
  { name: 'Others', success: 2780, bounce: 390 },
];

const AnalyticsPage: React.FC<{ theme: 'ethereal' | 'glass' }> = ({ theme }) => {
  const isEthereal = theme === 'ethereal';
  const primaryColor = isEthereal ? '#10b981' : '#00E5FF';
  const COLORS = [primaryColor, isEthereal ? '#6366f1' : '#10b981', '#f59e0b', '#ef4444'];

  return (
    <div className="space-y-8 fade-in pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 className={`text-3xl md:text-4xl font-black font-heading tracking-tight ${isEthereal ? 'text-[#064e3b]' : 'text-white'}`}>Intelligence Hub</h1>
          <p className={`${isEthereal ? 'text-slate-600' : 'text-slate-400'} font-medium`}>Granular deliverability tracking and performance auditing.</p>
        </div>
        <div className="flex items-center space-x-3">
           <button className={`px-5 py-2.5 rounded-xl font-bold text-sm border transition-all ${isEthereal ? 'bg-white border-slate-100 text-slate-700' : 'bg-white/5 border-white/10 text-slate-300'}`}>Export CSV</button>
           <button className="btn-primary px-6 py-2.5 rounded-xl font-bold text-sm transition-all shadow-lg">Generate Report</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass-surface rounded-[2.5rem] p-8">
          <h3 className={`text-lg font-black font-heading mb-8 flex items-center ${isEthereal ? 'text-[#064e3b]' : 'text-white'}`}>
            <Globe className={`w-5 h-5 mr-3 ${isEthereal ? 'text-[#10b981]' : 'text-[#00E5FF]'}`} /> Deliverability by ISP
          </h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isEthereal ? "rgba(0,0,0,0.05)" : "rgba(255,255,255,0.05)"} />
                <XAxis dataKey="name" stroke={isEthereal ? "#94a3b8" : "#475569"} fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke={isEthereal ? "#94a3b8" : "#475569"} fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip 
                   contentStyle={{ backgroundColor: isEthereal ? '#fff' : '#1e293b', border: 'none', borderRadius: '16px', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
                />
                <Legend />
                <Bar dataKey="success" fill={primaryColor} radius={[6, 6, 0, 0]} name="Delivered" />
                <Bar dataKey="bounce" fill="#f43f5e" radius={[6, 6, 0, 0]} name="Bounced" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-surface rounded-[2.5rem] p-8">
          <h3 className={`text-lg font-black font-heading mb-8 flex items-center ${isEthereal ? 'text-[#064e3b]' : 'text-white'}`}>
            <BarChart3 className={`w-5 h-5 mr-3 ${isEthereal ? 'text-[#10b981]' : 'text-[#00E5FF]'}`} /> Sentiment Analysis
          </h3>
          <div className="h-[300px] flex items-center">
            <ResponsiveContainer width="100%" height="100%">
              <RPieChart>
                <Pie
                  data={[
                    { name: 'Interested', value: 400 },
                    { name: 'Neutral', value: 300 },
                    { name: 'Not Interested', value: 200 },
                    { name: 'Unsubscribe', value: 100 },
                  ]}
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={8}
                  dataKey="value"
                >
                  {[0, 1, 2, 3].map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none' }} />
                <Legend />
              </RPieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="glass-surface rounded-[2.5rem] overflow-hidden">
        <div className={`p-8 border-b ${isEthereal ? 'border-slate-100 bg-white/30' : 'border-white/5 bg-white/5'}`}>
          <h2 className={`text-xl font-black font-heading ${isEthereal ? 'text-[#064e3b]' : 'text-white'}`}>Sequence Performance Audit</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
             <thead>
               <tr className={`text-[10px] font-black uppercase tracking-widest ${isEthereal ? 'text-[#064e3b]/40 bg-[#10b981]/5' : 'text-slate-500 bg-white/5'}`}>
                 <th className="px-10 py-6">Campaign</th>
                 <th className="px-10 py-6">Top Step</th>
                 <th className="px-10 py-6">Open Velocity</th>
                 <th className="px-10 py-6">Status</th>
               </tr>
             </thead>
             <tbody className={`divide-y ${isEthereal ? 'divide-slate-100' : 'divide-white/5'}`}>
               {[1, 2, 3, 4].map(i => (
                 <tr key={i} className={`transition-colors ${isEthereal ? 'hover:bg-[#10b981]/5' : 'hover:bg-white/5'}`}>
                   <td className={`px-10 py-8 font-black text-sm ${isEthereal ? 'text-[#064e3b]' : 'text-white'}`}>Enterprise Series #{i}</td>
                   <td className="px-10 py-8 text-slate-500 font-bold text-sm">Step {i+1} (Follow-up)</td>
                   <td className="px-10 py-8">
                      <div className="flex items-center space-x-3">
                        <span className={`text-sm font-black ${isEthereal ? 'text-[#10b981]' : 'text-[#00E5FF]'}`}>8{i}%</span>
                        <div className={`w-24 h-1.5 rounded-full overflow-hidden ${isEthereal ? 'bg-slate-200' : 'bg-white/10'}`}>
                          <div className={`h-full ${isEthereal ? 'bg-[#10b981]' : 'bg-[#00E5FF]'}`} style={{ width: `8${i}%` }}></div>
                        </div>
                      </div>
                   </td>
                   <td className="px-10 py-8">
                      <span className={`px-2.5 py-1 text-[10px] font-black rounded-lg uppercase tracking-widest border ${
                        isEthereal ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                      }`}>Optimized</span>
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

export default AnalyticsPage;