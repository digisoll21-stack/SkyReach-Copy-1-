import React, { useState, useEffect } from 'react';
import { Mail, Plus, ShieldCheck, Settings, Trash2, RefreshCw, X, ChevronRight, AlertCircle, CheckCircle2, Loader2, Search, Filter, MoreVertical, Play, Pause, Activity, Globe, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import apiClient from '../utils/api-client';
import Skeleton from '../components/Skeleton';

const PROVIDER_CONFIGS = {
  google: {
    name: 'Google Workspace',
    smtpHost: 'smtp.gmail.com',
    smtpPort: 465,
    imapHost: 'imap.gmail.com',
    imapPort: 993,
    help: 'Requires a 16-character App Password generated in your Google Account security settings.'
  },
  outlook: {
    name: 'Microsoft 365',
    smtpHost: 'smtp.office365.com',
    smtpPort: 587,
    imapHost: 'outlook.office365.com',
    imapPort: 993,
    help: 'Requires an App Password if Multi-Factor Authentication is enabled on your account.'
  },
  smtp: {
    name: 'Custom SMTP/IMAP',
    smtpHost: '',
    smtpPort: 465,
    imapHost: '',
    imapPort: 993,
    help: 'Contact your email administrator for specialized SMTP and IMAP host settings.'
  }
};

const AddInboxModal: React.FC<{ isOpen: boolean; onClose: () => void; theme: 'ethereal' | 'glass'; onCreated: () => void }> = ({ isOpen, onClose, theme, onCreated }) => {
  const isEthereal = theme === 'ethereal';
  const [step, setStep] = useState(1);
  const [provider, setProvider] = useState<keyof typeof PROVIDER_CONFIGS | null>(null);
  const [formData, setFormData] = useState({ email: '', password: '', fromName: '', smtpHost: '', smtpPort: 465, imapHost: '', imapPort: 993 });
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState('');

  const handleProviderSelect = (key: keyof typeof PROVIDER_CONFIGS) => {
    const config = PROVIDER_CONFIGS[key];
    setProvider(key);
    setFormData({
      ...formData,
      smtpHost: config.smtpHost,
      smtpPort: config.smtpPort,
      imapHost: config.imapHost,
      imapPort: config.imapPort
    });
    setStep(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsConnecting(true);
    setError('');

    try {
      await apiClient.post('/inboxes', {
        email: formData.email,
        provider,
        fromName: formData.fromName || formData.email.split('@')[0],
        credentials: {
          smtpHost: formData.smtpHost,
          smtpPort: Number(formData.smtpPort),
          smtpUser: formData.email,
          smtpPass: formData.password,
          imapHost: formData.imapHost,
          imapPort: Number(formData.imapPort),
          imapUser: formData.email,
          imapPass: formData.password
        }
      });
      onCreated();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Connection handshake failed.');
    } finally {
      setIsConnecting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className={`w-full max-w-xl rounded-[3rem] overflow-hidden shadow-2xl glass-surface`}
      >
        <div className="p-8 flex items-center justify-between border-b border-white/10">
          <h2 className={`text-xl font-black font-heading ${isEthereal ? 'text-[#064e3b]' : 'text-white'}`}>Connect Email Account</h2>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-10">
          {error && (
            <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-center text-rose-500 text-xs font-black uppercase tracking-widest">
              <AlertCircle size={16} className="mr-3 shrink-0" /> {error}
            </div>
          )}

          {step === 1 ? (
            <div className="space-y-6">
              <p className="text-xs font-black uppercase tracking-widest text-slate-500 mb-8">Select Protocol Provider</p>
              <div className="grid grid-cols-1 gap-4">
                {(Object.entries(PROVIDER_CONFIGS) as [keyof typeof PROVIDER_CONFIGS, any][]).map(([key, config]) => (
                  <button
                    key={key}
                    onClick={() => handleProviderSelect(key)}
                    className={`flex items-center justify-between p-6 rounded-2xl border transition-all ${isEthereal ? 'bg-white border-slate-100 hover:border-[#10b981]/50 hover:shadow-md' : 'bg-white/5 border-white/5 hover:bg-white/10'
                      }`}
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isEthereal ? 'bg-slate-50' : 'bg-black/20'}`}>
                        <Mail className={isEthereal ? 'text-[#10b981]' : 'text-[#00E5FF]'} />
                      </div>
                      <span className={`font-black text-sm ${isEthereal ? 'text-[#064e3b]' : 'text-white'}`}>{config.name}</span>
                    </div>
                    <ChevronRight size={18} className="text-slate-500" />
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className={`p-4 rounded-2xl border flex items-start space-x-3 mb-6 ${isEthereal ? 'bg-[#10b981]/5 border-[#10b981]/10' : 'bg-white/5 border-white/10'}`}>
                <AlertCircle size={18} className="shrink-0 mt-0.5 text-amber-500" />
                <p className="text-[10px] font-bold leading-relaxed text-slate-500">{provider && PROVIDER_CONFIGS[provider].help}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-500 ml-1">Email Address</label>
                  <input
                    type="email" required placeholder="alex@company.com"
                    className={`w-full h-14 px-6 rounded-2xl text-sm font-bold focus:outline-none transition-all ${isEthereal ? 'bg-white/60 border-slate-200' : 'bg-black/20 border-white/10 text-white'}`}
                    value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-500 ml-1">Sender Name</label>
                  <input
                    type="text" placeholder="Alex Reed"
                    className={`w-full h-14 px-6 rounded-2xl text-sm font-bold focus:outline-none transition-all ${isEthereal ? 'bg-white/60 border-slate-200' : 'bg-black/20 border-white/10 text-white'}`}
                    value={formData.fromName} onChange={(e) => setFormData({ ...formData, fromName: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-500 ml-1">App Password</label>
                <input
                  type="password" required placeholder="•••• •••• •••• ••••"
                  className={`w-full h-14 px-6 rounded-2xl text-sm font-bold focus:outline-none transition-all ${isEthereal ? 'bg-white/60 border-slate-200' : 'bg-black/20 border-white/10 text-white'}`}
                  value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>

              {provider === 'smtp' && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-6 pt-4 border-t border-white/5">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Protocol Configuration</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-slate-500 ml-1">SMTP Host</label>
                      <input
                        type="text" required placeholder="smtp.example.com"
                        className={`w-full h-12 px-6 rounded-2xl text-xs font-bold focus:outline-none transition-all ${isEthereal ? 'bg-white/60 border-slate-200' : 'bg-black/20 border-white/10 text-white'}`}
                        value={formData.smtpHost} onChange={(e) => setFormData({ ...formData, smtpHost: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-slate-500 ml-1">SMTP Port</label>
                      <input
                        type="number" required
                        className={`w-full h-12 px-6 rounded-2xl text-xs font-bold focus:outline-none transition-all ${isEthereal ? 'bg-white/60 border-slate-200' : 'bg-black/20 border-white/10 text-white'}`}
                        value={formData.smtpPort} onChange={(e) => setFormData({ ...formData, smtpPort: Number(e.target.value) })}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-slate-500 ml-1">IMAP Host</label>
                      <input
                        type="text" required placeholder="imap.example.com"
                        className={`w-full h-12 px-6 rounded-2xl text-xs font-bold focus:outline-none transition-all ${isEthereal ? 'bg-white/60 border-slate-200' : 'bg-black/20 border-white/10 text-white'}`}
                        value={formData.imapHost} onChange={(e) => setFormData({ ...formData, imapHost: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-slate-500 ml-1">IMAP Port</label>
                      <input
                        type="number" required
                        className={`w-full h-12 px-6 rounded-2xl text-xs font-bold focus:outline-none transition-all ${isEthereal ? 'bg-white/60 border-slate-200' : 'bg-black/20 border-white/10 text-white'}`}
                        value={formData.imapPort} onChange={(e) => setFormData({ ...formData, imapPort: Number(e.target.value) })}
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              <div className="flex space-x-4 pt-6">
                <button
                  type="button" onClick={() => setStep(1)}
                  className={`flex-1 h-14 rounded-2xl font-black uppercase tracking-widest text-[10px] border transition-all ${isEthereal ? 'bg-white border-slate-200 text-slate-500' : 'bg-white/5 border-white/5 text-slate-400'}`}
                >
                  Back
                </button>
                <button
                  type="submit" disabled={isConnecting}
                  className="flex-[2] btn-primary h-14 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl flex items-center justify-center"
                >
                  {isConnecting ? <RefreshCw className="w-5 h-5 animate-spin mr-2" /> : 'Synchronize Account'}
                </button>
              </div>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
};

import Pagination from '../components/Pagination';
import BulkUpdateModal from '../components/BulkUpdateModal';

const InboxesPage: React.FC<{ theme: 'ethereal' | 'glass' }> = ({ theme }) => {
  const isEthereal = theme === 'ethereal';
  const [inboxes, setInboxes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedInboxes, setSelectedInboxes] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'emails' | 'domains' | 'smartsender'>('emails');
  const [limit] = useState(10);

  const fetchInboxes = async (p = page, q = searchQuery) => {
    setIsLoading(true);
    try {
      const response = await apiClient.get('/inboxes', {
        params: { page: p, limit, search: q }
      });
      // Handle both old array format (fallback) and new paginated format
      if (Array.isArray(response.data)) {
        setInboxes(response.data);
        setTotalPages(1);
      } else {
        setInboxes(response.data.data || []);
        setTotalPages(response.data.meta.totalPages || 1);
      }
    } catch (err: any) {
      setInboxes([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setPage(1); // Reset to page 1 on search
      fetchInboxes(1, searchQuery);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  useEffect(() => {
    fetchInboxes(page, searchQuery);
  }, [page]);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Terminate this protocol node?')) return;
    try {
      await apiClient.delete(`/inboxes/${id}`);
      fetchInboxes();
    } catch (err) {
      console.error('Termination failed.');
    }
  };

  const toggleStatus = async (inbox: any) => {
    try {
      const newStatus = inbox.status === 'active' ? 'paused' : 'active';
      await apiClient.patch(`/inboxes/${inbox.id}`, { status: newStatus });
      fetchInboxes();
    } catch (err) {
      console.error('Status update failed');
    }
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedInboxes(inboxes.map(i => i.id));
    } else {
      setSelectedInboxes([]);
    }
  };

  const handleSelectOne = (id: string) => {
    if (selectedInboxes.includes(id)) {
      setSelectedInboxes(selectedInboxes.filter(i => i !== id));
    } else {
      setSelectedInboxes([...selectedInboxes, id]);
    }
  };

  return (
    <div className="space-y-8 fade-in pb-20 relative">

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/5 pb-4">
        <div className="flex items-center space-x-12">
          {[
            { id: 'emails', label: `Email Accounts (${inboxes.length})` },
            { id: 'domains', label: 'Domains' },
            { id: 'smartsender', label: 'SmartSender Orders' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`relative py-4 text-xs font-black uppercase tracking-widest transition-all ${activeTab === tab.id ? 'text-[#10b981]' : 'text-slate-500 hover:text-slate-700'}`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <motion.div layoutId="tab-underline" className="absolute bottom-[-1px] left-0 right-0 h-0.5 bg-[#10b981]" />
              )}
            </button>
          ))}
        </div>
        <div className="flex items-center space-x-4">
          <button className={`p-4 rounded-2xl transition-all ${isEthereal ? 'bg-white text-slate-500 hover:bg-slate-100 shadow-sm' : 'bg-white/5 text-slate-400 hover:bg-white/10'}`}>
            <RefreshCw size={18} />
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl active:scale-95 flex items-center hover:shadow-2xl hover:from-blue-500 hover:to-indigo-500"
          >
            <Plus size={16} className="mr-2" /> Connect Account
          </button>
          <button
            onClick={() => alert("Marketplace Launching Soon: Access premium aged domains and pre-warmed inboxes directly.")}
            className="bg-white/5 text-slate-400 border border-white/10 px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-sm active:scale-95 flex items-center hover:bg-white/10 hover:text-white"
          >
            Buy Mailbox
          </button>
        </div>
      </div>

      {activeTab === 'emails' ? (
        <div className="space-y-8 animate-in fade-in slide-in-from-top-4">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input
                type="text"
                placeholder="Search Email Accounts..."
                className={`w-full h-12 pl-12 pr-4 rounded-xl text-sm font-bold focus:outline-none transition-all ${isEthereal ? 'bg-white border-slate-200 focus:border-[#10b981]' : 'bg-white/5 focus:bg-white/10 border-transparent'}`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center space-x-4">
              <button className={`p-3 rounded-xl border ${isEthereal ? 'bg-white border-slate-200' : 'bg-white/5 border-white/5'}`}>
                <Filter size={18} className="text-slate-500" />
              </button>
              <button className={`p-3 rounded-xl border ${isEthereal ? 'bg-white border-slate-200' : 'bg-white/5 border-white/5'}`}>
                <Settings size={18} className="text-slate-500" />
              </button>
            </div>
          </div>

          {isLoading ? (
            <div className="space-y-4">
              {Array(4).fill(0).map((_, i) => (
                <div key={i} className="glass-surface p-6 rounded-[2.5rem] border border-white/5">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-4">
                      <Skeleton className="w-10 h-10 rounded-xl" />
                      <div className="space-y-2">
                        <Skeleton className="w-40 h-4" />
                        <Skeleton className="w-24 h-2" />
                      </div>
                    </div>
                    <Skeleton className="w-24 h-8 rounded-xl" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <>
              {/* Mobile Card View */}
              <div className="grid grid-cols-1 gap-4 lg:hidden">
                {inboxes.map(inbox => (
                  <div key={inbox.id} className="bg-white p-6 rounded-[1.5rem] border border-slate-100 space-y-4 shadow-sm">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-lg bg-[#10b981] flex items-center justify-center text-white">
                          <Mail size={16} />
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-xs text-slate-700 truncate">{inbox.fromName || 'System Node'}</p>
                          <p className="text-[10px] text-slate-500 font-medium">{inbox.email}</p>
                        </div>
                      </div>
                      <div className="px-2 py-0.5 bg-emerald-500 text-white rounded-md text-[9px] font-black">
                        {inbox.warmupAccount?.reputationScore || 100}%
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-50">
                      <div>
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Daily Limit</p>
                        <p className="text-xs font-bold text-slate-600">0 / 25</p>
                      </div>
                      <div>
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Warmup</p>
                        <p className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded inline-block">YES</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop Table View */}
              <div className="hidden lg:block bg-white rounded-[1.5rem] border border-slate-100 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-slate-50/50 text-[10px] font-black uppercase tracking-[0.1em] text-slate-500 border-b border-slate-100">
                        <th className="px-8 py-5 text-left">
                          <input
                            type="checkbox"
                            className="rounded border-slate-200"
                            checked={selectedInboxes.length === inboxes.length && inboxes.length > 0}
                            onChange={handleSelectAll}
                          />
                        </th>
                        <th className="px-6 py-5 text-left">Name</th>
                        <th className="px-6 py-5 text-left">Email Address</th>
                        <th className="px-6 py-5 text-left">Vendors</th>
                        <th className="px-6 py-5 text-left text-center">Daily Limit</th>
                        <th className="px-6 py-5 text-left text-center">Warmup Enabled</th>
                        <th className="px-6 py-5 text-right">Warmup Reputation</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {inboxes.map(inbox => (
                        <tr
                          key={inbox.id}
                          className={`group hover:bg-slate-50/50 transition-all cursor-pointer ${selectedInboxes.includes(inbox.id) ? 'bg-[#10b981]/5' : ''}`}
                          onClick={() => handleSelectOne(inbox.id)}
                        >
                          <td className="px-8 py-5 text-left">
                            <input
                              type="checkbox"
                              className="rounded border-slate-200"
                              checked={selectedInboxes.includes(inbox.id)}
                              onChange={(e) => {
                                e.stopPropagation();
                                handleSelectOne(inbox.id);
                              }}
                            />
                          </td>
                          <td className="px-6 py-5">
                            <div className="flex items-center space-x-2">
                              <span className="text-xs font-bold text-slate-700">{inbox.fromName || 'System Node'}</span>
                              <Globe size={12} className="text-slate-400 group-hover:text-[#10b981] transition-colors" />
                            </div>
                          </td>
                          <td className="px-6 py-5">
                            <div className="flex items-center space-x-2">
                              <Mail size={14} className="text-[#6366f1]" />
                              <span className="text-xs font-bold text-slate-600">{inbox.email}</span>
                            </div>
                          </td>
                          <td className="px-6 py-5">
                            <span className="text-[10px] font-black uppercase text-slate-500">SkyReach</span>
                          </td>
                          <td className="px-6 py-5 text-center">
                            <span className="text-xs font-bold text-slate-600">0 / {inbox.dailyLimit || 25}</span>
                          </td>
                          <td className="px-6 py-5 text-center">
                            <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-lg ${inbox.warmupEnabled ? 'text-emerald-600 bg-emerald-50' : 'text-slate-400 bg-slate-50'}`}>
                              {inbox.warmupEnabled ? 'Yes' : 'No'}
                            </span>
                          </td>
                          <td className="px-6 py-5">
                            <div className="flex justify-end">
                              <div className="inline-flex items-center space-x-2 px-2.5 py-1 bg-emerald-500 text-white rounded-lg text-[10px] font-black">
                                {inbox.warmupAccount?.reputationScore || 100}%
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
              </div>

              {inboxes.length === 0 && (
                <div className="px-8 py-20 text-center bg-white rounded-[2rem] border border-slate-100 mt-4 shadow-sm">
                  <div className="flex flex-col items-center justify-center text-slate-400 opacity-50">
                    <Globe size={48} className="mb-4" />
                    <p className="text-sm font-black uppercase tracking-widest">No matching accounts found in the sector</p>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Bulk Actions Bar */}
          <AnimatePresence>
            {selectedInboxes.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 100 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 100 }}
                className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[90] glass-surface border border-[#10b981]/30 px-8 py-4 rounded-[2rem] shadow-2xl flex items-center space-x-8"
              >
                <div className="flex items-center space-x-4 pr-8 border-r border-white/10">
                  <div className="w-10 h-10 rounded-xl bg-[#10b981] flex items-center justify-center text-white font-black">
                    {selectedInboxes.length}
                  </div>
                  <p className="text-xs font-black uppercase tracking-widest text-[#10b981]">Accounts Selected</p>
                </div>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setIsBulkModalOpen(true)}
                    className="flex items-center space-x-2 px-6 py-3 rounded-xl bg-[#6366f1] text-white text-[10px] font-black uppercase tracking-widest hover:bg-[#4f46e5] transition-all shadow-xl shadow-indigo-500/20"
                  >
                    <Settings size={14} />
                    <span>Bulk Update Settings</span>
                  </button>
                  <button
                    onClick={() => setSelectedInboxes([])}
                    className="px-4 py-3 rounded-xl bg-white/5 text-slate-400 text-[10px] font-black uppercase tracking-widest hover:text-white transition-all"
                  >
                    Deselect All
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="bg-white rounded-[1.5rem] border border-slate-100 p-8 flex flex-col md:flex-row items-center justify-between relative overflow-hidden shadow-sm">
            <div className={`absolute top-0 left-0 w-40 h-40 blur-3xl opacity-5 -ml-20 -mt-20 ${isEthereal ? 'bg-[#10b981]' : 'bg-[#00E5FF]'}`}></div>
            <div className="flex items-center mb-6 md:mb-0 relative z-10">
              <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center mr-6 shadow-sm">
                <ShieldCheck className="text-[#10b981]" size={24} />
              </div>
              <div>
                <h2 className="text-lg font-black font-heading text-slate-800">Reputation Shield Active</h2>
                <p className="text-slate-500 text-xs font-medium max-w-lg">SPF, DKIM, and DMARC parameters are verified every 4 hours for all connected nodes.</p>
              </div>
            </div>
            <button className="px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest border border-slate-100 bg-white text-slate-700 hover:bg-slate-50 transition-all relative z-10 shadow-sm">
              Audit All Domains <RefreshCw size={14} className="inline ml-2" />
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white p-20 rounded-[2rem] border border-slate-100 text-center space-y-6 shadow-sm animate-in fade-in slide-in-from-bottom-4">
          <div className="w-20 h-20 rounded-3xl bg-slate-50 flex items-center justify-center mx-auto text-slate-300">
            <ShieldCheck size={40} />
          </div>
          <div className="space-y-4">
            <h3 className="text-2xl font-black font-heading text-slate-800">System Protocol Restricted</h3>
            <p className="text-slate-500 font-medium max-w-md mx-auto">This module is currently under development. Advanced domain reputation tracking and SmartSender orders are coming soon.</p>
            <div className="pt-4">
              <span className="px-4 py-2 bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest rounded-xl border border-emerald-100 shadow-sm">Developer Roadmap Active</span>
            </div>
          </div>
        </div>
      )}

      <AddInboxModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        theme={theme}
        onCreated={fetchInboxes}
      />

      <BulkUpdateModal
        isOpen={isBulkModalOpen}
        onClose={() => setIsBulkModalOpen(false)}
        selectedIds={selectedInboxes}
        onUpdated={() => {
          fetchInboxes();
          setSelectedInboxes([]);
        }}
        theme={theme}
      />
    </div>
  );
};

export default InboxesPage;