
import React, { useState, useEffect } from 'react';
import { Users, Upload, Download, Search, Filter, CheckCircle2, Zap, ChevronRight, X, FileText, Loader2, AlertCircle, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import apiClient from '../utils/api-client';
import Skeleton from '../components/Skeleton';

const FieldMapper: React.FC<{
  headers: string[],
  onComplete: (mapping: Record<string, string>) => void,
  theme: 'ethereal' | 'glass'
}> = ({ headers, onComplete, theme }) => {
  const isEthereal = theme === 'ethereal';
  const systemFields = [
    { key: 'email', label: 'Email Address (Required)', required: true },
    { key: 'firstName', label: 'First Name', required: false },
    { key: 'lastName', label: 'Last Name', required: false },
    { key: 'company', label: 'Company Name', required: false },
  ];

  const [mapping, setMapping] = useState<Record<string, string>>({});

  const autoMap = () => {
    const newMap: Record<string, string> = {};
    headers.forEach(h => {
      const lower = h.toLowerCase();
      if (lower.includes('email')) newMap.email = h;
      if (lower.includes('first')) newMap.firstName = h;
      if (lower.includes('last')) newMap.lastName = h;
      if (lower.includes('company') || lower.includes('org')) newMap.company = h;
    });
    setMapping(newMap);
  };

  useEffect(() => autoMap(), [headers]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4">
        {systemFields.map(field => (
          <div key={field.key} className={`p-4 rounded-2xl border flex items-center justify-between ${isEthereal ? 'bg-white border-slate-100' : 'bg-white/5 border-white/5'}`}>
            <span className={`text-xs font-black uppercase tracking-widest ${isEthereal ? 'text-slate-500' : 'text-slate-400'}`}>{field.label}</span>
            <select
              value={mapping[field.key] || ''}
              onChange={(e) => setMapping({ ...mapping, [field.key]: e.target.value })}
              className={`text-xs font-bold p-2 rounded-xl outline-none border ${isEthereal ? 'bg-slate-50 border-slate-200' : 'bg-black/20 border-white/10 text-white'}`}
            >
              <option value="">Select Column</option>
              {headers.map(h => <option key={h} value={h}>{h}</option>)}
            </select>
          </div>
        ))}
      </div>
      <button
        onClick={() => onComplete(mapping)}
        disabled={!mapping.email}
        className="w-full btn-primary h-14 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl flex items-center justify-center disabled:opacity-50"
      >
        Finalize Import <ArrowRight size={18} className="ml-2" />
      </button>
    </div>
  );
};

const LeadDetailsSidebar: React.FC<{ lead: any, onClose: () => void, isEthereal: boolean }> = ({ lead, onClose, isEthereal }) => {
  const [timeline, setTimeline] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTimeline = async () => {
      try {
        const { data } = await apiClient.get(`/leads/${lead.id}/timeline`);
        setTimeline(data);
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTimeline();
  }, [lead.id]);

  return (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      className={`fixed top-0 right-0 h-full w-full md:w-[450px] z-[110] shadow-2xl border-l backdrop-blur-xl ${isEthereal ? 'bg-white/90 border-slate-100' : 'bg-slate-900/90 border-white/5'}`}
    >
      <div className="p-8 h-full flex flex-col">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className={`text-xl font-black font-heading ${isEthereal ? 'text-[#064e3b]' : 'text-white'}`}>Lead Dossier</h2>
            <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Historical Interaction Matrix</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-slate-500/10"><X size={20} /></button>
        </div>

        <div className={`p-6 rounded-[2rem] mb-8 ${isEthereal ? 'bg-slate-50 border border-slate-100' : 'bg-white/5 border border-white/5'}`}>
          <div className="flex items-center space-x-4 mb-4">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xl ${isEthereal ? 'bg-white shadow-sm text-[#10b981]' : 'bg-white/5 text-slate-400'}`}>
              {lead.firstName?.[0] || lead.email[0].toUpperCase()}
            </div>
            <div>
              <p className={`font-black text-lg ${isEthereal ? 'text-[#064e3b]' : 'text-white'}`}>{lead.email}</p>
              <p className="text-xs text-slate-500 font-bold">{lead.firstName} {lead.lastName}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-[9px] font-black uppercase text-slate-400">Company</p>
              <p className={`text-xs font-bold ${isEthereal ? 'text-slate-700' : 'text-slate-300'}`}>{lead.company || 'Unknown Entity'}</p>
            </div>
            <div className="space-y-1">
              <p className="text-[9px] font-black uppercase text-slate-400">Current Status</p>
              <div className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase border border-current w-fit ${lead.status === 'replied' ? 'text-emerald-500' : 'text-slate-500'}`}>
                {lead.status}
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto pr-2 space-y-6">
          <h3 className="text-[10px] font-black uppercase text-slate-500 tracking-widest mb-4">Activity Timeline</h3>
          {isLoading ? (
            <div className="py-20 text-center"><Loader2 className="animate-spin mx-auto text-[#10b981]" /></div>
          ) : timeline.length === 0 ? (
            <div className="py-20 text-center text-[10px] font-black uppercase text-slate-600">Zero events detected.</div>
          ) : (
            <div className="space-y-6 relative ml-4 border-l border-slate-500/10 pl-6">
              {timeline.map((event, i) => (
                <div key={i} className="relative">
                  <div className={`absolute -left-[31px] top-1.5 w-2 h-2 rounded-full border-2 ${event.type === 'inbound' ? 'bg-emerald-500 border-emerald-500/20' : 'bg-slate-400 border-slate-400/20'}`} />
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <p className={`text-[10px] font-black uppercase ${isEthereal ? 'text-[#064e3b]' : 'text-[#00E5FF]'}`}>{event.type === 'inbound' ? 'Reply Received' : 'Dispatch Sent'}</p>
                      <span className="text-[9px] font-bold text-slate-500">{new Date(event.createdAt).toLocaleDateString()}</span>
                    </div>
                    <p className={`text-[11px] font-medium leading-relaxed ${isEthereal ? 'text-slate-600' : 'text-slate-400'}`}>
                      {event.type === 'inbound' ? `Classified as: ${event.metadata.classification}` : `Sequence step transmitted successfully.`}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

const LeadsPage: React.FC<{ theme: 'ethereal' | 'glass' }> = ({ theme }) => {
  const isEthereal = theme === 'ethereal';
  const [leads, setLeads] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [csvHeaders, setCsvHeaders] = useState<string[]>([]);
  const [importStep, setImportStep] = useState(1);
  const [csvContent, setCsvContent] = useState('');

  const [selectedLeadIds, setSelectedLeadIds] = useState<string[]>([]);
  const [activeLead, setActiveLead] = useState<any | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const fetchLeads = async () => {
    setIsLoading(true);
    try {
      const { data } = await apiClient.get('/leads', { params: { search: searchQuery, status: statusFilter } });
      setLeads(data || []);
    } catch (err) {
      setLeads([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const t = setTimeout(() => fetchLeads(), 300);
    return () => clearTimeout(t);
  }, [searchQuery, statusFilter]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const text = ev.target?.result as string;
        setCsvContent(text);
        const firstLine = text.split('\n')[0];
        setCsvHeaders(firstLine.split(',').map(h => h.trim().replace(/"/g, '')));
        setImportStep(2);
      };
      reader.readAsText(file);
    }
  };

  const handleImportComplete = async (mapping: Record<string, string>) => {
    setIsLoading(true);
    try {
      const lines = csvContent.split('\n').filter(l => l.trim());
      const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
      const records = lines.slice(1).map(line => {
        const values = line.split(',').map(v => v.trim().replace(/"/g, ''));
        const record: any = { customFields: {} };
        Object.entries(mapping).forEach(([systemField, csvHeader]) => {
          const index = headers.indexOf(csvHeader);
          if (index > -1) {
            if (['email', 'firstName', 'lastName', 'company'].includes(systemField)) {
              record[systemField] = values[index];
            } else {
              record.customFields[systemField] = values[index];
            }
          }
        });
        return record;
      }).filter(r => r.email);

      await apiClient.post('/leads/import', { leads: records, tags: ['csv-import'] });
      setIsImportModalOpen(false);
      setImportStep(1);
      fetchLeads();
    } catch (error) {
      alert('Transmission failure during lead ingestion.');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedLeadIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const selectAll = () => {
    if (selectedLeadIds.length === leads.length) setSelectedLeadIds([]);
    else setSelectedLeadIds(leads.map(l => l.id));
  };

  const bulkAction = async (action: 'delete' | 'status', value?: string) => {
    if (!selectedLeadIds.length) return;
    setIsLoading(true);
    try {
      if (action === 'delete') {
        await apiClient.post('/leads/bulk-delete', { ids: selectedLeadIds });
      } else {
        await apiClient.post('/leads/bulk-status', { ids: selectedLeadIds, status: value });
      }
      setSelectedLeadIds([]);
      fetchLeads();
    } catch (e) {
      alert('Bulk protocol failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8 fade-in pb-20 relative">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className={`text-3xl md:text-4xl font-black font-heading tracking-tight ${isEthereal ? 'text-[#064e3b]' : 'text-white'}`}>Lead CRM</h1>
          <p className={`${isEthereal ? 'text-slate-600' : 'text-slate-400'} font-medium`}>Enterprise-scale audience management.</p>
        </div>
        <div className="flex items-center space-x-3">
          <button onClick={() => setIsImportModalOpen(true)} className="btn-primary px-8 py-4 rounded-2xl font-black text-sm shadow-xl flex items-center">
            <Upload size={18} className="mr-2" /> Bulk Ingest
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative group">
          <Search size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-[#10b981] transition-colors" />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by identity, organization or matrix..."
            className={`w-full h-14 pl-16 pr-8 rounded-2xl text-xs font-black shadow-lg focus:outline-none transition-all ${isEthereal ? 'bg-white border-slate-100 text-slate-700' : 'bg-white/5 border-white/5 text-white'}`}
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className={`h-14 px-8 rounded-2xl text-[10px] font-black uppercase tracking-widest cursor-pointer shadow-lg outline-none ${isEthereal ? 'bg-white border-slate-100' : 'bg-white/5 border-white/5 text-slate-400'}`}
        >
          <option value="">Status Filter</option>
          <option value="unassigned">Unassigned</option>
          <option value="active">Active</option>
          <option value="replied">Replied</option>
          <option value="paused">Paused</option>
          <option value="bounced">Bounced</option>
        </select>
      </div>

      <AnimatePresence>
        {selectedLeadIds.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className={`fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] px-8 py-4 rounded-[2rem] border shadow-2xl flex items-center space-x-8 ${isEthereal ? 'bg-white border-slate-100' : 'bg-slate-900 border-white/10'}`}
          >
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{selectedLeadIds.length} Nodes Selected</span>
            <div className="h-6 w-px bg-white/10"></div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => bulkAction('status', 'paused')}
                className="text-[10px] font-black uppercase tracking-widest text-[#10b981] hover:underline"
              >Pause</button>
              <button
                onClick={() => bulkAction('delete')}
                className="text-[10px] font-black uppercase tracking-widest text-rose-500 hover:underline"
              >Delete</button>
            </div>
            <button onClick={() => setSelectedLeadIds([])} className="p-2 rounded-xl bg-white/5 hover:bg-white/10"><X size={14} /></button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="glass-surface rounded-[2.5rem] overflow-hidden min-h-[500px] border border-white/5">
        {isLoading ? (
          <div className="p-8 space-y-4">
            {Array(5).fill(0).map((_, i) => (
              <div key={i} className="flex items-center justify-between p-4 glass-surface rounded-2xl border border-white/5">
                <div className="flex items-center space-x-4">
                  <Skeleton className="w-4 h-4 rounded" />
                  <div className="space-y-2">
                    <Skeleton className="w-32 h-4" />
                    <Skeleton className="w-48 h-3" />
                  </div>
                </div>
                <Skeleton className="w-20 h-6 rounded-full" />
              </div>
            ))}
          </div>
        ) : (
          <>
            {/* Mobile Card View */}
            <div className="grid grid-cols-1 gap-4 lg:hidden p-4">
              {leads.map(lead => (
                <div
                  key={lead.id}
                  className={`glass-surface p-6 rounded-[2rem] border transition-all ${selectedLeadIds.includes(lead.id) ? 'border-[#10b981] bg-[#10b981]/5' : 'border-white/5'}`}
                  onClick={() => setActiveLead(lead)}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center space-x-3">
                      <button onClick={(e) => { e.stopPropagation(); toggleSelect(lead.id); }} className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${selectedLeadIds.includes(lead.id) ? 'bg-[#10b981] border-[#10b981]' : 'border-slate-500/20'}`}>
                        {selectedLeadIds.includes(lead.id) && <CheckCircle2 size={12} className="text-white" />}
                      </button>
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs ${isEthereal ? 'bg-white shadow-sm text-[#10b981]' : 'bg-white/5 text-slate-400'}`}>
                        {lead.firstName?.[0] || lead.email[0].toUpperCase()}
                      </div>
                      <div>
                        <p className={`font-black text-sm truncate max-w-[150px] ${isEthereal ? 'text-[#064e3b]' : 'text-white'}`}>{lead.email}</p>
                        <p className="text-[10px] text-slate-500 font-bold">{lead.firstName} {lead.lastName}</p>
                      </div>
                    </div>
                    <div className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase border border-current w-fit ${lead.status === 'replied' ? 'text-emerald-500' : 'text-slate-500'}`}>
                      {lead.status}
                    </div>
                  </div>
                  <div className="flex justify-between items-center text-[10px] font-bold text-slate-500 uppercase pt-4 border-t border-white/5">
                    <span>{lead.company || '—'}</span>
                    <span>{lead.lastEventAt ? new Date(lead.lastEventAt).toLocaleDateString() : 'No Events'}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Table View */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className={`text-[10px] font-black uppercase tracking-widest ${isEthereal ? 'text-[#064e3b]/40 bg-[#10b981]/5' : 'text-slate-500 bg-white/5'}`}>
                    <th className="pl-10 pr-4 py-6">
                      <button onClick={selectAll} className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${selectedLeadIds.length === leads.length ? 'bg-[#10b981] border-[#10b981]' : 'border-slate-500/30'}`}>
                        {selectedLeadIds.length === leads.length && <CheckCircle2 size={12} className="text-white" />}
                      </button>
                    </th>
                    <th className="px-6 py-6">Identity</th>
                    <th className="px-6 py-6 text-center">Engagement</th>
                    <th className="px-6 py-6">Organization</th>
                    <th className="px-6 py-6">Latest Event</th>
                    <th className="px-10 py-6 text-right">Dossier</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-500/5">
                  {leads.map(lead => (
                    <tr key={lead.id} className={`group transition-all ${isEthereal ? 'hover:bg-slate-50' : 'hover:bg-white/5'} cursor-pointer ${selectedLeadIds.includes(lead.id) ? (isEthereal ? 'bg-emerald-50' : 'bg-emerald-500/5') : ''}`}>
                      <td className="pl-10 pr-4 py-6">
                        <button onClick={(e) => { e.stopPropagation(); toggleSelect(lead.id); }} className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${selectedLeadIds.includes(lead.id) ? 'bg-[#10b981] border-[#10b981]' : 'border-slate-500/20'}`}>
                          {selectedLeadIds.includes(lead.id) && <CheckCircle2 size={12} className="text-white" />}
                        </button>
                      </td>
                      <td className="px-6 py-6" onClick={() => setActiveLead(lead)}>
                        <div className="flex items-center space-x-4">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs ${isEthereal ? 'bg-white shadow-sm text-[#10b981]' : 'bg-white/5 text-slate-400'}`}>
                            {lead.firstName?.[0] || lead.email[0].toUpperCase()}
                          </div>
                          <div>
                            <p className={`font-black text-sm ${isEthereal ? 'text-[#064e3b]' : 'text-white'}`}>{lead.email}</p>
                            <p className="text-[10px] text-slate-500 font-bold">{lead.firstName} {lead.lastName}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-6 text-center" onClick={() => setActiveLead(lead)}>
                        <div className={`mx-auto px-2 py-0.5 rounded-md text-[9px] font-black uppercase border border-current w-fit ${lead.status === 'replied' ? 'text-emerald-500' : 'text-slate-500'}`}>
                          {lead.status}
                        </div>
                      </td>
                      <td className={`px-6 py-6 text-sm font-bold ${isEthereal ? 'text-slate-600' : 'text-slate-400'}`} onClick={() => setActiveLead(lead)}>{lead.company || '—'}</td>
                      <td className="px-6 py-6 text-[10px] font-bold text-slate-500 uppercase" onClick={() => setActiveLead(lead)}>{lead.lastEventAt ? new Date(lead.lastEventAt).toLocaleDateString() : '—'}</td>
                      <td className="px-10 py-6 text-right">
                        <button onClick={(e) => { e.stopPropagation(); setActiveLead(lead); }} className={`p-2 rounded-xl transition-all ${isEthereal ? 'hover:bg-[#10b981]/10 hover:text-[#10b981]' : 'hover:bg-white/10 hover:text-[#00E5FF]'}`}><ChevronRight size={20} /></button>
                      </td>
                    </tr>
                  ))}
                  {leads.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-40 text-center">
                        <Users size={48} className="mx-auto mb-6 text-slate-500 opacity-20" />
                        <p className="text-sm font-bold text-slate-500">Zero leads identified in current matrix.</p>
                        <button onClick={() => setIsImportModalOpen(true)} className="mt-4 text-[#10b981] font-black uppercase tracking-widest text-[10px] hover:underline">Launch Ingestion Protocol</button>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      <AnimatePresence>
        {isImportModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="w-full max-w-2xl glass-surface rounded-[3rem] overflow-hidden border border-white/5 shadow-2xl">
              <div className="p-8 border-b border-white/10 flex justify-between items-center bg-white/5">
                <div>
                  <h2 className={`text-xl font-black font-heading ${isEthereal ? 'text-[#064e3b]' : 'text-white'}`}>
                    {importStep === 1 ? 'Bulk Ingest Leads' : 'Field Synchronization'}
                  </h2>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Lead CRM Integration Protocol</p>
                </div>
                <button onClick={() => { setIsImportModalOpen(false); setImportStep(1); }} className="p-2 text-slate-500 hover:text-white transition-colors"><X /></button>
              </div>
              <div className="p-10">
                {importStep === 1 ? (
                  <label className="block border-2 border-dashed border-slate-500/20 rounded-[2.5rem] p-20 text-center cursor-pointer hover:border-[#10b981] transition-all group">
                    <div className={`w-16 h-16 rounded-[2rem] flex items-center justify-center mx-auto mb-6 transition-all ${isEthereal ? 'bg-[#10b981]/10 text-[#10b981]' : 'bg-[#00E5FF]/10 text-[#00E5FF] group-hover:bg-[#00E5FF]/20'}`}>
                      <Upload size={32} />
                    </div>
                    <span className="text-sm font-black uppercase text-slate-500 tracking-widest">Drop CSV Matrix</span>
                    <p className="text-[10px] font-medium text-slate-600 mt-2">Maximum packet size: 50MB</p>
                    <input type="file" className="hidden" accept=".csv" onChange={handleFileUpload} />
                  </label>
                ) : (
                  <FieldMapper theme={theme} headers={csvHeaders} onComplete={handleImportComplete} />
                )}
              </div>
            </motion.div>
          </div>
        )}

        {activeLead && (
          <>
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[105]" onClick={() => setActiveLead(null)} />
            <LeadDetailsSidebar lead={activeLead} onClose={() => setActiveLead(null)} isEthereal={isEthereal} />
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LeadsPage;
