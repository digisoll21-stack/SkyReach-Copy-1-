import React from 'react';
import { Users, Mail, Reply, AlertCircle, TrendingUp, ArrowUpRight, ArrowDownRight, Plus, Zap } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';

const data = [
  { name: 'Mon', sent: 2400, replies: 400 },
  { name: 'Tue', sent: 1398, replies: 300 },
  { name: 'Wed', sent: 9800, replies: 800 },
  { name: 'Thu', sent: 3908, replies: 500 },
  { name: 'Fri', sent: 4800, replies: 600 },
  { name: 'Sat', sent: 3800, replies: 400 },
  { name: 'Sun', sent: 4300, replies: 450 },
];

const StatCard: React.FC<{ 
  title: string; value: string; change: string; isPositive: boolean; icon: React.ElementType; color: string; theme: 'ethereal' | 'glass';
}> = ({ title, value, change, isPositive, icon: Icon, color, theme }) => {
  const isEthereal = theme === 'ethereal';
  return (
    <div className={`glass-surface p-6 rounded-[2.5rem] relative overflow-hidden group transition-all duration-500`}>
      <div className={`absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 opacity-10 rounded-full transition-transform duration-700 group-hover:scale-150 ${isEthereal ? 'bg-[#10b981]' : 'bg-[#00E5FF]'}`}></div>
      <div className="flex justify-between items-start mb-6">
        <div className={`p-3.5 rounded-2xl transition-all duration-300 group-hover:scale-110 ${isEthereal ? 'bg-[#10b981]/10 text-[#059669]' : 'bg-[#00E5FF]/10 text-[#00E5FF]'}`}>
          <Icon className="w-6 h-6" />
        </div>
        <div className={`flex items-center text-xs font-black px-2 py-1 rounded-full ${isPositive ? 'bg-emerald-500/10 text-emerald-600' : 'bg-rose-500/10 text-rose-600'}`}>
          {isPositive ? <ArrowUpRight size={14} className="mr-1" /> : <ArrowDownRight size={14} className="mr-1" />}
          {change}
        </div>
      </div>
      <h3 className={`text-[10px] font-black uppercase tracking-widest mb-1 ${isEthereal ? 'text-slate-500' : 'text-slate-400'}`}>{title}</h3>
      <p className={`text-2xl font-black font-heading ${isEthereal ? 'text-[#064e3b]' : 'text-white'}`}>{value}</p>
    </div>
  );
};

const DashboardPage: React.FC<{ theme: 'ethereal' | 'glass' }> = ({ theme }) => {
  const isEthereal = theme === 'ethereal';
  const primaryColor = isEthereal ? '#10b981' : '#00E5FF';

  return (
    <div className="space-y-8 fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 className={`text-3xl md:text-4xl font-black font-heading tracking-tight ${isEthereal ? 'text-[#064e3b]' : 'text-white'}`}>Pulse Monitor</h1>
          <p className={`${isEthereal ? 'text-slate-600' : 'text-slate-400'} font-medium`}>Real-time performance metrics for <span className={`${isEthereal ? 'text-[#10b981]' : 'text-[#00E5FF]'} font-bold`}>Alpha Growth</span>.</p>
        </div>
        <button className={`btn-primary px-8 py-4 rounded-2xl font-black text-sm transition-all active:scale-95 flex items-center justify-center`}>
          <Plus size={18} className="mr-2" /> Start Sequence
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard theme={theme} title="Total Outbound" value="124,802" change="+12.5%" isPositive icon={Mail} color="indigo" />
        <StatCard theme={theme} title="Engaged Replies" value="14.2%" change="+2.4%" isPositive icon={Reply} color="emerald" />
        <StatCard theme={theme} title="Valid Contacts" value="32,451" change="-0.8%" isPositive={false} icon={Users} color="sky" />
        <StatCard theme={theme} title="Shield Protection" value="1.14%" change="+0.1%" isPositive={false} icon={AlertCircle} color="rose" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 glass-surface rounded-[2.5rem] p-8">
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center space-x-3">
              <div className={`p-2.5 rounded-xl ${isEthereal ? 'bg-[#10b981]/10 text-[#10b981]' : 'bg-[#00E5FF]/10 text-[#00E5FF]'}`}>
                <TrendingUp size={20} />
              </div>
              <h2 className={`text-xl font-black font-heading ${isEthereal ? 'text-[#064e3b]' : 'text-white'}`}>Delivery Volume</h2>
            </div>
            <select className={`text-[10px] font-black uppercase tracking-widest px-4 py-2.5 rounded-xl outline-none border transition-all ${isEthereal ? 'bg-white/80 border-slate-200 text-slate-700' : 'bg-white/5 border-white/10 text-white'}`}>
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
            </select>
          </div>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorMain" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={primaryColor} stopOpacity={0.3}/>
                    <stop offset="95%" stopColor={primaryColor} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isEthereal ? "rgba(0,0,0,0.05)" : "rgba(255,255,255,0.05)"} />
                <XAxis dataKey="name" stroke={isEthereal ? "#94a3b8" : "#475569"} fontSize={11} tickLine={false} axisLine={false} dy={10} />
                <YAxis stroke={isEthereal ? "#94a3b8" : "#475569"} fontSize={11} tickLine={false} axisLine={false} dx={-10} />
                <Tooltip 
                  contentStyle={{ backgroundColor: isEthereal ? '#fff' : '#1e293b', border: 'none', borderRadius: '16px', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
                  itemStyle={{ color: isEthereal ? '#064e3b' : '#fff', fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="sent" stroke={primaryColor} strokeWidth={4} fillOpacity={1} fill="url(#colorMain)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-surface rounded-[2.5rem] p-8 flex flex-col">
          <h2 className={`text-xl font-black font-heading mb-10 ${isEthereal ? 'text-[#064e3b]' : 'text-white'}`}>Audit Stream</h2>
          <div className="flex-1 space-y-8">
            {[
              { type: 'reply', user: 'Mark Jefferson', campaign: 'Enterprise Outreach', time: '2m ago' },
              { type: 'bounce', user: 'sarah@temp.com', campaign: 'Startup Growth', time: '15m ago' },
              { type: 'sent', user: '25 recipients', campaign: 'Investor Series', time: '1h ago' },
              { type: 'warmup', user: 'System Auto', campaign: 'Health Check', time: '3h ago' },
            ].map((activity, idx) => (
              <div key={idx} className="flex items-start space-x-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${isEthereal ? 'bg-[#10b981]/10 text-[#059669]' : 'bg-[#00E5FF]/10 text-[#00E5FF]'}`}>
                  <Zap size={18} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className={`text-sm font-black truncate ${isEthereal ? 'text-[#064e3b]' : 'text-slate-200'}`}>{activity.user}</p>
                  <p className={`text-[10px] font-black uppercase tracking-widest truncate ${isEthereal ? 'text-slate-500' : 'text-slate-500'}`}>{activity.campaign} • {activity.time}</p>
                </div>
              </div>
            ))}
          </div>
          <button className={`w-full mt-10 py-4 border-2 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all ${
            isEthereal ? 'border-[#10b981]/10 text-[#064e3b] hover:bg-[#10b981]/5' : 'border-white/5 text-slate-400 hover:bg-white/5 hover:text-white'
          }`}>
            View Detailed Logs
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;