import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Pause, Edit2, Plus, Loader2, Trash2, BarChart2, MoreVertical } from 'lucide-react';
import apiClient from '../utils/api-client';
import Skeleton from '../components/Skeleton';
import Pagination from '../components/Pagination';

const CampaignsPage: React.FC<{ theme: 'ethereal' | 'glass' }> = ({ theme }) => {
  const navigate = useNavigate();
  const isEthereal = theme === 'ethereal';
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'paused' | 'draft'>('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(10);

  const fetchCampaigns = async (p = page, status = filterStatus) => {
    setIsLoading(true);
    try {
      const response = await apiClient.get('/campaigns', {
        params: { page: p, limit, status }
      });
      // Handle both old array format (fallback) and new paginated format
      if (Array.isArray(response.data)) {
        setCampaigns(response.data);
        setTotalPages(1);
      } else {
        setCampaigns(response.data.data || []);
        setTotalPages(response.data.meta.totalPages || 1);
      }
    } catch (err) {
      setCampaigns([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setPage(1); // Reset to page 1 on filter change
    fetchCampaigns(1, filterStatus);
  }, [filterStatus]);

  useEffect(() => {
    fetchCampaigns(page, filterStatus);
  }, [page]);

  const toggleStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'paused' : 'active';
    try {
      await apiClient.put(`/campaigns/${id}`, { status: newStatus });
      fetchCampaigns(); // Refresh to ensure data consistency
    } catch (err) {
      console.error('Status toggle failed');
    }
  };

  const deleteCampaign = async (id: string) => {
    if (!window.confirm('Are you sure you want to decommission this campaign node?')) return;
    try {
      await apiClient.delete(`/campaigns/${id}`);
      fetchCampaigns();
    } catch (err) {
      console.error('Deletion failed');
    }
  };

  return (
    <div className="space-y-10 fade-in pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className={`text-3xl md:text-4xl font-black font-heading tracking-tight ${isEthereal ? 'text-[#064e3b]' : 'text-white'}`}>Campaign Fleet</h1>
          <p className={`${isEthereal ? 'text-slate-600' : 'text-slate-400'} font-medium`}>Managing automated outreach protocols at scale.</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className={`flex p-1.5 rounded-[1.2rem] border ${isEthereal ? 'bg-white/50 border-slate-200 shadow-sm' : 'bg-white/5 border-white/10'}`}>
            {(['all', 'active', 'paused', 'draft'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filterStatus === status
                  ? (isEthereal ? 'bg-[#10b981] text-white shadow-md' : 'bg-[#00E5FF] text-slate-900 shadow-lg')
                  : 'text-slate-500 hover:text-slate-700'
                  }`}
              >
                {status}
              </button>
            ))}
          </div>
          <button
            onClick={() => navigate('/campaigns/new')}
            className="btn-primary px-8 py-4 rounded-2xl font-black text-sm shadow-xl active:scale-95 flex items-center"
          >
            <Plus className="w-5 h-5 mr-2" /> Launch Campaign
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {Array(3).fill(0).map((_, i) => (
            <div key={i} className="glass-surface p-8 rounded-[2.5rem] border border-white/5">
              <div className="flex justify-between items-center">
                <div className="space-y-3">
                  <Skeleton className="w-48 h-6" />
                  <Skeleton className="w-32 h-3" />
                </div>
                <div className="flex space-x-2">
                  <Skeleton className="w-10 h-10 rounded-xl" />
                  <Skeleton className="w-10 h-10 rounded-xl" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          {/* Mobile Card View */}
          <div className="grid grid-cols-1 gap-4 lg:hidden">
            {campaigns.map(campaign => (
              <div key={campaign.id} className="glass-surface p-6 rounded-[2rem] border border-white/5 space-y-4">
                <div className="flex justify-between items-start">
                  <div onClick={() => navigate(`/campaigns/${campaign.id}`)} className="cursor-pointer">
                    <h3 className={`font-black text-sm ${isEthereal ? 'text-[#064e3b]' : 'text-white'}`}>{campaign.name}</h3>
                    <div className="flex items-center space-x-2 mt-1">
                      <div className={`w-1.5 h-1.5 rounded-full ${campaign.status === 'active' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-500'}`}></div>
                      <span className="text-[10px] font-black uppercase text-slate-500">{campaign.status}</span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button onClick={() => toggleStatus(campaign.id, campaign.status)} className="p-2 rounded-xl bg-white/5 text-slate-400">
                      {campaign.status === 'active' ? <Pause size={14} /> : <Play size={14} />}
                    </button>
                    <button onClick={() => deleteCampaign(campaign.id)} className="p-2 rounded-xl bg-rose-500/10 text-rose-500">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-2 pt-4 border-t border-white/5">
                  <div className="text-center">
                    <p className="text-[9px] font-black text-slate-500 uppercase">Sent</p>
                    <p className="text-xs font-black text-slate-300">0</p>
                  </div>
                  <div className="text-center">
                    <p className="text-[9px] font-black text-slate-500 uppercase">Open</p>
                    <p className="text-xs font-black text-[#00E5FF]">0%</p>
                  </div>
                  <div className="text-center">
                    <p className="text-[9px] font-black text-slate-500 uppercase">Replied</p>
                    <p className="text-xs font-black text-emerald-500">0%</p>
                  </div>
                  <div className="text-center">
                    <p className="text-[9px] font-black text-slate-500 uppercase">Leads</p>
                    <p className="text-xs font-black text-slate-300">{campaign._count?.leads || 0}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Table View */}
          <div className="hidden lg:block glass-surface rounded-[2.5rem] overflow-hidden border border-white/5">
            <table className="w-full border-collapse">
              <thead>
                <tr className={`${isEthereal ? 'bg-slate-50/50' : 'bg-white/5'} text-[10px] font-black uppercase tracking-[0.2em] text-slate-500`}>
                  <th className="px-8 py-6 text-left">Campaign Name</th>
                  <th className="px-6 py-6 text-center">Status</th>
                  <th className="px-6 py-6 text-center">Sent</th>
                  <th className="px-6 py-6 text-center">Opens</th>
                  <th className="px-6 py-6 text-center">Replies</th>
                  <th className="px-6 py-6 text-center">Leads</th>
                  <th className="px-8 py-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-medium">
                {campaigns.map(campaign => (
                  <tr
                    key={campaign.id}
                    className={`group transition-all ${isEthereal ? 'hover:bg-slate-50/30' : 'hover:bg-white/[0.02]'}`}
                  >
                    <td className="px-8 py-6" onClick={() => navigate(`/campaigns/${campaign.id}`)}>
                      <div className="flex flex-col cursor-pointer">
                        <span className={`text-sm font-black transition-colors ${isEthereal ? 'text-[#064e3b] group-hover:text-[#10b981]' : 'text-white group-hover:text-[#00E5FF]'}`}>
                          {campaign.name}
                        </span>
                        <span className="text-[10px] text-slate-500 mt-1 uppercase tracking-tight">Active Protocol GEN-01</span>
                      </div>
                    </td>
                    <td className="px-6 py-6 text-center">
                      <div className="flex items-center justify-center space-x-2">
                        <div className={`w-1.5 h-1.5 rounded-full ${campaign.status === 'active' ? 'bg-emerald-500 animate-pulse' : campaign.status === 'paused' ? 'bg-amber-500' : 'bg-slate-500'}`}></div>
                        <span className={`text-[10px] font-black uppercase tracking-widest ${isEthereal ? 'text-slate-600' : 'text-slate-400'}`}>
                          {campaign.status}
                        </span>
                      </div>
                    </td>
                    <td className={`px-6 py-6 text-center text-xs font-black ${isEthereal ? 'text-slate-600' : 'text-slate-300'}`}>0</td>
                    <td className={`px-6 py-6 text-center text-xs font-black ${isEthereal ? 'text-emerald-600' : 'text-[#00E5FF]'}`}>0%</td>
                    <td className={`px-6 py-6 text-center text-xs font-black ${isEthereal ? 'text-[#10b981]' : 'text-amber-500'}`}>0%</td>
                    <td className={`px-6 py-6 text-center text-xs font-black ${isEthereal ? 'text-slate-600' : 'text-slate-300'}`}>
                      {campaign._count?.leads || 0}
                    </td>
                    <td className="px-8 py-3 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={(e) => { e.stopPropagation(); navigate(`/campaigns/${campaign.id}`); }}
                          className={`p-2 rounded-lg transition-all ${isEthereal ? 'bg-slate-100 text-slate-500 hover:bg-[#10b981]/10 hover:text-[#10b981]' : 'bg-white/5 text-slate-400 hover:bg-[#00E5FF]/10 hover:text-[#00E5FF]'}`}
                          title="Edit Campaign"
                        >
                          <Edit2 size={14} />
                        </button>

                        <div className="relative group">
                          <button className={`p-2 rounded-lg transition-all ${isEthereal ? 'bg-slate-100 text-slate-500' : 'bg-white/5 text-slate-400'}`}>
                            <MoreVertical size={14} />
                          </button>
                          <div className="absolute right-0 top-full mt-2 w-48 z-10 glass-surface border border-white/10 rounded-xl shadow-2xl overflow-hidden hidden group-hover:block">
                            <button
                              onClick={(e) => { e.stopPropagation(); toggleStatus(campaign.id, campaign.status); }}
                              className="w-full text-left px-4 py-3 text-[10px] font-black uppercase tracking-widest hover:bg-white/5 flex items-center space-x-2 text-slate-400 hover:text-white"
                            >
                              {campaign.status === 'active' ? <><Pause size={14} /> <span>Stop Protocol</span></> : <><Play size={14} /> <span>Resume Protocol</span></>}
                            </button>
                            <button
                              onClick={(e) => { e.stopPropagation(); deleteCampaign(campaign.id); }}
                              className="w-full text-left px-4 py-3 text-[10px] font-black uppercase tracking-widest hover:bg-rose-500/10 flex items-center space-x-2 text-slate-400 hover:text-rose-500"
                            >
                              <Trash2 size={14} /> <span>Decommission</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
              isLoading={isLoading}
            />
          </div>

          {campaigns.length === 0 && (
            <div className="text-center py-20 px-8 glass-surface rounded-[2rem] border border-white/5 mt-4">
              <p className="text-slate-500 font-bold">Zero active sequences detected in this filter.</p>
              <button onClick={() => navigate('/campaigns/new')} className="mt-4 text-[#10b981] font-black uppercase tracking-widest text-[10px] hover:underline">Apply Protocol Patch</button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CampaignsPage;