import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Reply, Users, AlertCircle, TrendingUp, ArrowUpRight, ArrowDownRight, Zap, Plus, Loader2 } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import apiClient from '../utils/api-client';

import Skeleton from '../components/Skeleton';

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
  title: string; value: string; change: string; isPositive: boolean; icon: React.ElementType; theme: 'ethereal' | 'glass'; isLoading?: boolean;
}> = ({ title, value, change, isPositive, icon: Icon, theme, isLoading }) => {
  const isEthereal = theme === 'ethereal';
  const colorClass = isEthereal ? 'bg-[#10b981]/10 text-[#059669]' : 'bg-[#00E5FF]/10 text-[#00E5FF]';
  const accentBg = isEthereal ? 'bg-[#10b981]' : 'bg-[#00E5FF]';

  return (
    <div className="glass-surface p-6 rounded-[2.5rem] relative overflow-hidden group transition-all duration-500 border border-white/10">
      <div className={`absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 opacity-10 rounded-full transition-transform duration-700 group-hover:scale-150 ${accentBg}`}></div>
      <div className="flex justify-between items-start mb-6 relative z-10">
        <div className={`p-3.5 rounded-2xl transition-all duration-300 group-hover:scale-110 ${colorClass}`}>
          <Icon size={24} />
        </div>
        {isLoading ? (
          <Skeleton className="w-12 h-4 rounded-full" />
        ) : (
          <div className={`flex items-center text-[10px] font-black px-2.5 py-1 rounded-full ${isPositive ? 'bg-emerald-500/10 text-emerald-600' : 'bg-rose-500/10 text-rose-600'}`}>
            {isPositive ? <ArrowUpRight size={12} className="mr-1" /> : <ArrowDownRight size={12} className="mr-1" />}
            {change}
          </div>
        )}
      </div>
      <div className="relative z-10">
        <h3 className={`text-[10px] font-black uppercase tracking-widest mb-1 ${isEthereal ? 'text-slate-500' : 'text-slate-400'}`}>{title}</h3>
        {isLoading ? (
          <Skeleton className="w-20 h-8 mt-1" />
        ) : (
          <p className={`text-2xl font-black font-heading ${isEthereal ? 'text-[#064e3b]' : 'text-white'}`}>{value}</p>
        )}
      </div>
    </div>
  );
};

const DashboardPage: React.FC<{ theme: 'ethereal' | 'glass' }> = ({ theme }) => {
  const navigate = useNavigate();
  const isEthereal = theme === 'ethereal';
  const primaryColor = isEthereal ? '#10b981' : '#00E5FF';
  const [stats, setStats] = useState({ leads: '0', inboxes: '0', campaigns: '0' });
  const [chartData, setChartData] = useState<any[]>([]);
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [lRes, iRes, cRes, pRes] = await Promise.all([
          apiClient.get('/leads'),
          apiClient.get('/inboxes'),
          apiClient.get('/campaigns'),
          apiClient.get('/analytics/pulse')
        ]);

        setStats({
          leads: (lRes.data?.length || 0).toLocaleString(),
          inboxes: (iRes.data?.data?.length || iRes.data?.length || 0).toString(), // Handle paginated response
          campaigns: (cRes.data?.data?.length || cRes.data?.length || 0).toString() // Handle paginated response
        });

        setCampaigns(cRes.data?.data || cRes.data || []); // Handle paginated response
        setChartData(pRes.data || []);
      } catch (err) {
        console.error('Data fetch failed');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const statCards = [
    { title: 'Total Leads', value: stats.leads, change: '+2.4%', isPositive: true, icon: Users, path: '/leads' },
    { title: 'Email Accounts', value: stats.inboxes, change: '+0.0%', isPositive: true, icon: Zap, path: '/inboxes' },
    { title: 'Active Campaigns', value: stats.campaigns, change: '+12.5%', isPositive: true, icon: TrendingUp, path: '/campaigns' },
    { title: 'Fleet Health', value: '98.2%', change: '+0.1%', isPositive: true, icon: AlertCircle, path: '/inboxes' }, // Linked to inboxes for now
  ];

  return (
    <div className="space-y-8 fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 className={`text-3xl md:text-4xl font-black font-heading tracking-tight ${isEthereal ? 'text-[#064e3b]' : 'text-white'}`}>Pulse Dashboard</h1>
          <p className={`${isEthereal ? 'text-slate-600' : 'text-slate-400'} font-medium`}>Performance monitoring for <span className={`${isEthereal ? 'text-[#10b981]' : 'text-[#00E5FF]'} font-bold`}>Alpha Growth</span>.</p>
        </div>
        <button
          onClick={() => navigate('/campaigns/new')}
          className="btn-primary px-8 py-4 rounded-2xl font-black text-sm transition-all active:scale-95 flex items-center justify-center shadow-xl"
        >
          <Plus size={18} className="mr-2" /> Start Sequence
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => (
          <div key={index} onClick={() => navigate(card.path)} className="cursor-pointer">
            <StatCard isLoading={isLoading} theme={theme} title={card.title} value={card.value} change={card.change} isPositive={card.isPositive} icon={card.icon} />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 glass-surface rounded-[2.5rem] p-8 border border-white/10">
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center space-x-3">
              <div className={`p-2.5 rounded-xl ${isEthereal ? 'bg-[#10b981]/10 text-[#10b981]' : 'bg-[#00E5FF]/10 text-[#00E5FF]'}`}>
                <TrendingUp size={20} />
              </div>
              <h2 className={`text-xl font-black font-heading ${isEthereal ? 'text-[#064e3b]' : 'text-white'}`}>Outreach Velocity</h2>
            </div>
            <select className={`text-[10px] font-black uppercase tracking-widest px-4 py-2.5 rounded-xl outline-none border transition-all ${isEthereal ? 'bg-white/80 border-slate-200 text-slate-700' : 'bg-white/5 border-white/10 text-white'}`}>
              <option>Last 7 Days</option>
            </select>
          </div>
          <div className="h-[350px] w-full">
            {isLoading ? (
              <Skeleton className="w-full h-full rounded-2xl" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorMain" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={primaryColor} stopOpacity={0.3} />
                      <stop offset="95%" stopColor={primaryColor} stopOpacity={0} />
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
                  <Area type="monotone" dataKey="replies" stroke="#8b5cf6" strokeWidth={4} fillOpacity={0} />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <div className="glass-surface rounded-[2.5rem] p-8 flex flex-col border border-white/10">
          <h2 className={`text-xl font-black font-heading mb-10 ${isEthereal ? 'text-[#064e3b]' : 'text-white'}`}>Campaign Fleet</h2>
          <div className="flex-1 space-y-6 overflow-y-auto pr-2">
            {isLoading ? (
              Array(5).fill(0).map((_, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="space-y-2">
                    <Skeleton className="w-32 h-4" />
                    <Skeleton className="w-20 h-2" />
                  </div>
                  <Skeleton className="w-12 h-8 rounded-lg" />
                </div>
              ))
            ) : campaigns.length > 0 ? (
              campaigns.slice(0, 5).map((campaign) => (
                <div key={campaign.id} className="flex items-center justify-between group cursor-pointer" onClick={() => navigate(`/campaigns/${campaign.id}`)}>
                  <div className="min-w-0 flex-1">
                    <p className={`text-sm font-black truncate ${isEthereal ? 'text-[#064e3b]' : 'text-slate-200'}`}>{campaign.name}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <div className={`w-1.5 h-1.5 rounded-full ${campaign.status === 'active' ? 'bg-emerald-500' : 'bg-slate-500'}`}></div>
                      <p className={`text-[10px] font-black uppercase tracking-widest ${isEthereal ? 'text-slate-500' : 'text-slate-500'}`}>{campaign.status}</p>
                    </div>
                  </div>
                  <div className="text-right ml-4">
                    <p className={`text-xs font-black ${isEthereal ? 'text-[#10b981]' : 'text-[#00E5FF]'}`}>32% Open</p>
                    <p className="text-[9px] font-black uppercase text-slate-500">Rate</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                <Mail size={32} className="text-slate-400 opacity-30" />
                <p className="text-xs font-bold text-slate-500">No campaigns launched yet.</p>
              </div>
            )}
          </div>
          <button
            onClick={() => navigate('/campaigns')}
            className={`w-full mt-10 py-4 border-2 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all ${isEthereal ? 'border-[#10b981]/10 text-[#064e3b] hover:bg-[#10b981]/5' : 'border-white/10 text-slate-400 hover:bg-white/5 hover:text-white'
              }`}>
            Launch Center
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;