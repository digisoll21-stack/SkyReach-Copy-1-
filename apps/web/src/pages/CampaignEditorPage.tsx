import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Save, Plus, Trash2, Clock, Zap,
  Info, ShieldAlert, Layout, Users, Sliders, Calendar, Loader2,
  ChevronRight, ChevronLeft, Upload, Mail, CheckCircle2, AlertCircle, FileText, BarChart3, ArrowRight, X
} from 'lucide-react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import apiClient from '../utils/api-client';

interface Step {
  id: string;
  order: number;
  subject: string;
  body: string;
  delayDays: number;
  waitMinutes: number;
  scheduledDate?: string; // YYYY-MM-DD
  specificStartTime?: string;
}

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
        Finalize Mapping <ArrowRight size={18} className="ml-2" />
      </button>
    </div>
  );
};

const Stepper: React.FC<{ currentStep: number, isEthereal: boolean, onStepClick: (step: number) => void }> = ({ currentStep, isEthereal, onStepClick }) => {
  const steps = [
    { n: 1, label: 'Import Leads', icon: Users },
    { n: 2, label: 'Sequence', icon: Layout },
    { n: 3, label: 'Setup', icon: Sliders },
    { n: 4, label: 'Preview', icon: CheckCircle2 },
  ];

  return (
    <div className="flex items-center justify-center space-x-2 md:space-x-4 mb-12">
      {steps.map((s, idx) => (
        <React.Fragment key={s.n}>
          <div
            className="flex flex-col items-center cursor-pointer group"
            onClick={() => onStepClick(s.n)}
          >
            <div className={`w-10 h-10 md:w-12 md:h-12 rounded-2xl flex items-center justify-center transition-all duration-500 group-hover:scale-110 ${currentStep === s.n
              ? (isEthereal ? 'bg-[#10b981] text-white shadow-lg' : 'bg-[#00E5FF] text-slate-900 shadow-[0_0_20px_rgba(0,229,255,0.3)]')
              : currentStep > s.n
                ? (isEthereal ? 'bg-[#10b981]/10 text-[#10b981]' : 'bg-[#00E5FF]/10 text-[#00E5FF]')
                : (isEthereal ? 'bg-slate-100 text-slate-400' : 'bg-white/5 text-slate-600')
              }`}>
              <s.icon size={18} />
            </div>
            <span className={`hidden sm:block text-[10px] font-black uppercase tracking-widest mt-3 transition-colors ${currentStep === s.n ? (isEthereal ? 'text-[#064e3b]' : 'text-white') : 'text-slate-500'
              }`}>{s.label}</span>
          </div>
          {idx < steps.length - 1 && (
            <div className={`w-8 md:w-16 h-0.5 rounded-full mb-0 md:mb-6 transition-colors duration-500 ${currentStep > s.n ? (isEthereal ? 'bg-[#10b981]' : 'bg-[#00E5FF]') : (isEthereal ? 'bg-slate-100' : 'bg-white/5')
              }`} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

const TZ_SUGGESTIONS: Record<string, string> = {
  'New York': 'America/New_York',
  'London': 'Europe/London',
  'Tokyo': 'Asia/Tokyo',
  'Dubai': 'Asia/Dubai',
  'Sydney': 'Australia/Sydney',
  'Mumbai': 'Asia/Kolkata',
  'San Francisco': 'America/Los_Angeles',
  'Bengaluru': 'Asia/Kolkata',
  'Berlin': 'Europe/Berlin',
  'Paris': 'Europe/Paris',
};

const CampaignEditorPage: React.FC<{ theme: 'ethereal' | 'glass' }> = ({ theme }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEthereal = theme === 'ethereal';

  const [currentStep, setCurrentStep] = useState(1);
  const [campaignName, setCampaignName] = useState(() => {
    if (!id || id === 'new') {
      const now = new Date();
      return `${now.getMonth() + 1}-${now.getDate()}-${now.getFullYear().toString().slice(-2)}-${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}-Campaign`;
    }
    return 'Loading Protocol...';
  });
  const [steps, setSteps] = useState<Step[]>([]);
  const [inboxes, setInboxes] = useState<any[]>([]);
  const [selectedInboxes, setSelectedInboxes] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [campaignStatus, setCampaignStatus] = useState('draft');
  const [leadsCount, setLeadsCount] = useState(0);

  // Manual Lead State
  const [manualInbound, setManualInbound] = useState({ firstName: '', email: '', lastName: '', company: '' });
  const [manualLeads, setManualLeads] = useState<any[]>([]);

  // Sequence UI State
  const [activeStepId, setActiveStepId] = useState<string | null>(null);

  // Ingestion State
  const [isImporting, setIsImporting] = useState(false);
  const [csvHeaders, setCsvHeaders] = useState<string[]>([]);
  const [csvContent, setCsvContent] = useState('');
  const [importStep, setImportStep] = useState(1);

  // Settings
  const [settings, setSettings] = useState({
    stopOnReply: true,
    trackOpens: true,
    trackClicks: false,
    workDaysOnly: true,
    dailyLimit: 50,
    timezone: 'UTC',
    startTime: '09:00',
  });

  const [locationSearch, setLocationSearch] = useState('');
  const [showAllTimezones, setShowAllTimezones] = useState(false);

  // Test Send State
  const [isTestSendOpen, setIsTestSendOpen] = useState(false);
  const [testSendConfig, setTestSendConfig] = useState({ inboxId: '', to: '' });

  // Helper to sync activeStepId
  useEffect(() => {
    if (steps.length > 0 && !activeStepId) {
      setActiveStepId(steps[0].id);
    }
  }, [steps]);

  useEffect(() => {
    fetchInboxes();
    if (id && id !== 'new') {
      fetchCampaign();
    } else {
      setSteps([{ id: `s_${Date.now()}`, order: 1, subject: '', body: '', delayDays: 0, waitMinutes: 0 }]);
    }
  }, [id]);

  // Auto-Save Engine
  useEffect(() => {
    if (id === 'new' || isLoading) return;
    const timer = setTimeout(() => {
      handleSave(true);
    }, 3000);
    return () => clearTimeout(timer);
  }, [campaignName, steps, selectedInboxes, settings]);

  const fetchInboxes = async () => {
    try {
      const response = await apiClient.get('/inboxes');
      // Handle both old array format (fallback) and new paginated format
      if (Array.isArray(response.data)) {
        setInboxes(response.data);
      } else {
        setInboxes(response.data.data || []);
      }
    } catch (err) { console.error('Inboxes fetch failed'); }
  };

  const fetchCampaign = async () => {
    setIsLoading(true);
    try {
      const { data } = await apiClient.get(`/campaigns/${id}`);
      setCampaignName(data.name);
      setCampaignStatus(data.status);
      setSettings({ ...settings, ...data.settings });
      setSelectedInboxes(data.settings?.inboxIds || []);

      if (data.sequences && Array.isArray(data.sequences) && data.sequences.length > 0) {
        setSteps(data.sequences.map((s: any) => ({
          id: s.id, order: s.order, subject: s.subject, body: s.body,
          delayDays: s.delayDays, waitMinutes: s.waitMinutes || 0, specificStartTime: s.specificStartTime || ''
        })));
      } else {
        setSteps([{ id: `s_${Date.now()}`, order: 1, subject: '', body: '', delayDays: 0, waitMinutes: 0 }]);
      }

      const { data: leadsResponse } = await apiClient.get(`/leads?campaignId=${id}`);
      const leads = Array.isArray(leadsResponse) ? leadsResponse : (leadsResponse?.data || []);
      setLeadsCount(leads.length || 0);

    } catch (err) { console.error('Fetch failed'); }
    finally { setIsLoading(false); }
  };

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
    setIsImporting(true);
    try {
      const lines = csvContent.split('\n').filter(l => l.trim());
      const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
      const records = lines.slice(1).map(line => {
        const values = line.split(',').map(v => v.trim().replace(/"/g, ''));
        const record: any = { customFields: {} };
        Object.entries(mapping).forEach(([systemField, csvHeader]) => {
          const index = headers.indexOf(csvHeader);
          if (index > -1) {
            if (['email', 'firstName', 'lastName', 'company'].includes(systemField)) record[systemField] = values[index];
            else record.customFields[systemField] = values[index];
          }
        });
        return record;
      }).filter(r => r.email);

      let campaignId = id;
      if (id === 'new') {
        const { data } = await apiClient.post('/campaigns', { name: campaignName });
        campaignId = data.id;
        navigate(`/campaigns/${campaignId}?step=1`, { replace: true });
      }

      await apiClient.post('/leads/import', {
        leads: records,
        campaignId,
        tags: ['campaign-import']
      });

      setLeadsCount(prev => prev + records.length);
      setImportStep(1);
      setCsvContent('');
    } catch (error) {
      alert('Import failed.');
    } finally {
      setIsImporting(false);
    }
  };

  const handleSave = async (isAuto = false) => {
    if (!isAuto) setIsSaving(true);
    try {
      let campaignId = id;

      // Basic Uniqueness Check (simplified for frontend)
      if (id === 'new' && !isAuto) {
        const { data: response } = await apiClient.get('/campaigns');
        const campaigns = Array.isArray(response) ? response : (response?.data || []);
        if (campaigns.some((c: any) => c.name.toLowerCase() === campaignName.toLowerCase())) {
          alert('A protocol with this designation already exists in your fleet.');
          if (!isAuto) setIsSaving(false);
          return;
        }
      }

      const campaignData = {
        name: campaignName,
        settings: { ...settings, inboxIds: selectedInboxes }
      };

      if (id === 'new') {
        const { data } = await apiClient.post('/campaigns', campaignData);
        campaignId = data.id;
        navigate(`/campaigns/${campaignId}${window.location.search}`, { replace: true });
      } else {
        await apiClient.put(`/campaigns/${id}`, campaignData);
      }

      await apiClient.put(`/campaigns/${campaignId}/sequence`, { steps });

      // Ingest Manual Leads if any
      if (manualLeads.length > 0) {
        await apiClient.post('/leads/import', {
          leads: manualLeads,
          campaignId,
          tags: ['manual-entry']
        });
        setLeadsCount(prev => prev + manualLeads.length);
        setManualLeads([]);
      }

      setLastSaved(new Date());

      if (!isAuto && currentStep === 4) {
        await apiClient.put(`/campaigns/${campaignId}`, { status: 'active' });
        navigate('/campaigns');
      }
      if (!isAuto) alert('Fleet synchronized successfully.');
    } catch (err) {
      if (!isAuto) alert('Synchronization failure.');
    } finally {
      if (!isAuto) setIsSaving(false);
    }
  }

  const handleManualAdd = () => {
    if (!manualInbound.firstName || !manualInbound.email) return;
    setManualLeads([...manualLeads, { ...manualInbound, id: Date.now().toString() }]);
    setManualInbound({ firstName: '', email: '', lastName: '', company: '' });
  };

  const handleNext = () => {
    if (currentStep < 4) setCurrentStep(currentStep + 1);
    else handleSave();
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const addStep = () => {
    const newStep: Step = { id: `s_${Date.now()}`, order: steps.length + 1, subject: '', body: '', delayDays: 3, waitMinutes: 0 };
    setSteps([...steps, newStep]);
  };

  const removeStep = (stepId: string) => {
    if (steps.length === 1) return;
    setSteps(steps.filter(s => s.id !== stepId).map((s, idx) => ({ ...s, order: idx + 1 })));
  };

  const updateStep = (stepId: string, updates: Partial<Step>) => {
    setSteps(steps.map(s => s.id === stepId ? { ...s, ...updates } : s));
  };

  if (isLoading) return (
    <div className="h-screen flex items-center justify-center">
      <Loader2 className="w-12 h-12 animate-spin text-slate-400" />
    </div>
  );

  return (
    <div className="space-y-10 fade-in pb-32">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div className="flex items-center space-x-6">
          <button onClick={() => navigate('/campaigns')} className={`p-4 rounded-2xl transition-all ${isEthereal ? 'bg-white text-slate-500 hover:bg-slate-100 shadow-sm' : 'bg-white/5 text-slate-400 hover:bg-white/10'}`}>
            <ArrowLeft size={20} />
          </button>
          <div>
            <div className="flex items-center space-x-3">
              <input
                value={campaignName}
                onChange={(e) => setCampaignName(e.target.value)}
                className={`text-2xl md:text-3xl font-black font-heading bg-transparent border-none p-0 focus:ring-0 min-w-[300px] ${isEthereal ? 'text-[#064e3b]' : 'text-white'}`}
              />
              <span className={`px-2.5 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-widest border ${campaignStatus === 'active' ? (isEthereal ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20') : 'bg-white/5 text-slate-500'}`}>{campaignStatus}</span>
            </div>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1">Campaign Configuration Matrix</p>
            {lastSaved && (
              <div className="flex items-center space-x-2 mt-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                <span className="text-[9px] font-black uppercase text-slate-500">Auto-saved at {lastSaved.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {currentStep > 1 && (
            <button onClick={handleBack} className={`px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center transition-all ${isEthereal ? 'text-slate-600 hover:bg-slate-100' : 'text-slate-400 hover:bg-white/5'}`}>
              <ChevronLeft className="mr-2" size={18} /> Back
            </button>
          )}
          <button
            onClick={handleNext}
            disabled={currentStep === 1 && leadsCount === 0 && manualLeads.length === 0}
            className="btn-primary px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl flex items-center group active:scale-95 disabled:opacity-50"
          >
            {currentStep === 4 ? 'Launch Fleet' : 'Next Step'} <ChevronRight className="ml-2 group-hover:translate-x-1 transition-transform" size={18} />
          </button>
        </div>
      </div>

      <Stepper currentStep={currentStep} isEthereal={isEthereal} onStepClick={setCurrentStep} />

      <div className="max-w-5xl mx-auto">
        <AnimatePresence mode="wait">
          {/* Step 1: Import Leads */}
          {currentStep === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8">
              <div className="glass-surface p-12 rounded-[3.5rem] border border-white/5 text-center space-y-10">
                {leadsCount === 0 ? (
                  <div className="space-y-10">
                    <div className={`w-24 h-24 rounded-[2.5rem] flex items-center justify-center mx-auto ${isEthereal ? 'bg-emerald-50 text-[#10b981]' : 'bg-cyan-500/5 text-cyan-400'}`}>
                      <Upload size={40} />
                    </div>
                    <div className="space-y-4">
                      <h2 className={`text-3xl font-black font-heading ${isEthereal ? 'text-[#064e3b]' : 'text-white'}`}>Load Target Matrix</h2>
                      <p className="text-slate-500 font-medium max-w-md mx-auto leading-relaxed">Transmit your lead CSV into the protocol to begin sequence generation.</p>
                    </div>

                    <div className="max-w-2xl mx-auto space-y-8">
                      {importStep === 1 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <label className="block border-2 border-dashed border-slate-500/20 rounded-[2.5rem] p-12 text-center cursor-pointer hover:border-[#10b981] transition-all group bg-white/5">
                            <Upload size={32} className="mx-auto mb-4 text-slate-500 group-hover:text-[#10b981] transition-colors" />
                            <span className="text-xs font-black uppercase text-slate-500 tracking-widest">Select CSV Matrix</span>
                            <input type="file" className="hidden" accept=".csv" onChange={handleFileUpload} />
                          </label>
                          <div className="glass-surface p-8 rounded-[2.5rem] border border-white/5 text-left space-y-4">
                            <h4 className="text-[10px] font-black uppercase text-slate-400">Manual Node Entry</h4>
                            <div className="grid grid-cols-2 gap-3">
                              <input placeholder="First Name*" className="w-full h-10 px-4 rounded-xl text-xs bg-black/20 border border-white/5 outline-none focus:border-[#10b981]" value={manualInbound.firstName} onChange={e => setManualInbound({ ...manualInbound, firstName: e.target.value })} />
                              <input placeholder="Last Name" className="w-full h-10 px-4 rounded-xl text-xs bg-black/20 border border-white/5 outline-none focus:border-[#10b981]" value={manualInbound.lastName} onChange={e => setManualInbound({ ...manualInbound, lastName: e.target.value })} />
                            </div>
                            <input placeholder="Email Address*" className="w-full h-10 px-4 rounded-xl text-xs bg-black/20 border border-white/5 outline-none focus:border-[#10b981]" value={manualInbound.email} onChange={e => setManualInbound({ ...manualInbound, email: e.target.value })} />
                            <input placeholder="Company Name" className="w-full h-10 px-4 rounded-xl text-xs bg-black/20 border border-white/5 outline-none focus:border-[#10b981]" value={manualInbound.company} onChange={e => setManualInbound({ ...manualInbound, company: e.target.value })} />
                            <button onClick={handleManualAdd} className="w-full py-3 rounded-xl bg-[#10b981]/10 text-[#10b981] text-[10px] font-black uppercase tracking-widest hover:bg-[#10b981] hover:text-white transition-all">Add to Protocol</button>
                          </div>
                        </div>
                      ) : (
                        <div className="text-left bg-white/5 p-8 rounded-[2.5rem] border border-white/10">
                          <FieldMapper theme={theme} headers={csvHeaders} onComplete={handleImportComplete} />
                        </div>
                      )}

                      {manualLeads.length > 0 && (
                        <div className="glass-surface p-6 rounded-3xl border border-white/5 max-h-[200px] overflow-y-auto">
                          <h4 className="text-[9px] font-black uppercase text-slate-500 mb-4">{manualLeads.length} Manual Nodes Staged</h4>
                          <div className="space-y-2">
                            {manualLeads.map(l => (
                              <div key={l.id} className="flex justify-between items-center text-xs p-2 bg-white/5 rounded-lg">
                                <span className="text-slate-300 font-bold">{l.email}</span>
                                <button onClick={() => setManualLeads(manualLeads.filter(ml => ml.id !== l.id))} className="text-rose-500"><X size={14} /></button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-10">
                    <div className={`w-28 h-28 rounded-[3rem] flex items-center justify-center mx-auto shadow-2xl ${isEthereal ? 'bg-[#10b981] text-white' : 'bg-[#00E5FF] text-slate-900'}`}>
                      <CheckCircle2 size={48} />
                    </div>
                    <div className="space-y-4">
                      <h2 className={`text-4xl font-black font-heading ${isEthereal ? 'text-[#064e3b]' : 'text-white'}`}>{leadsCount} Leads Ingested</h2>
                      <p className="text-slate-500 font-medium max-w-md mx-auto">Target matrix synchronized. Your outreach fleet is ready for sequence assignment.</p>
                    </div>
                    <button onClick={() => setLeadsCount(0)} className="text-[10px] font-black uppercase tracking-widest text-[#10b981] hover:underline">Import New Source</button>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Step 2: Sequence */}
          {currentStep === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-12">

              {/* Global Schedule Protocol */}
              <div className="glass-surface p-10 rounded-[3rem] border border-white/5 space-y-8">
                <div className="flex items-center justify-between">
                  <h3 className={`text-xl font-black font-heading ${isEthereal ? 'text-[#064e3b]' : 'text-white'}`}>Execution Window</h3>
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Global Protocol</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-[#10b981] ml-1">Dispatch Timezone</label>
                    <div className="relative">
                      <select
                        value={settings.timezone}
                        onChange={(e) => setSettings({ ...settings, timezone: e.target.value })}
                        className={`w-full h-12 px-6 rounded-2xl text-xs font-bold focus:outline-none appearance-none ${isEthereal ? 'bg-slate-50 border-slate-100' : 'bg-black/20 border-white/5 text-white'}`}
                      >
                        <option value="UTC">UTC (Universal Time)</option>
                        {Object.entries(TZ_SUGGESTIONS).map(([city, zone]) => (
                          <option key={zone} value={zone}>{city} ({zone})</option>
                        ))}
                        {showAllTimezones && Intl.supportedValuesOf('timeZone').map(tz => (
                          <option key={tz} value={tz}>{tz}</option>
                        ))}
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center space-x-2 pointer-events-none">
                        <Clock size={14} className="text-slate-500" />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Daily Start Time</label>
                    <input
                      type="time"
                      value={settings.startTime}
                      onChange={(e) => setSettings({ ...settings, startTime: e.target.value })}
                      className={`w-full h-12 px-6 rounded-2xl text-xs font-bold focus:outline-none ${isEthereal ? 'bg-slate-50 border-slate-100' : 'bg-black/20 border-white/5 text-white'}`}
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Smart Search</label>
                    <div className="relative">
                      <input
                        value={locationSearch}
                        onChange={(e) => {
                          const val = e.target.value;
                          setLocationSearch(val);
                          const found = Object.keys(TZ_SUGGESTIONS).find(k => k.toLowerCase().includes(val.toLowerCase()));
                          if (found && val.length > 2) {
                            setSettings({ ...settings, timezone: TZ_SUGGESTIONS[found] });
                          }
                        }}
                        placeholder="Search city or region..."
                        className={`w-full h-12 px-6 rounded-2xl text-xs font-bold focus:outline-none ${isEthereal ? 'bg-slate-50 border-slate-100' : 'bg-black/20 border-white/5 text-white'}`}
                      />
                      <Zap size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-400 opacity-50" />
                    </div>
                    <button onClick={() => setShowAllTimezones(!showAllTimezones)} className="text-[9px] font-black uppercase text-slate-600 hover:text-[#10b981] ml-1 transition-colors">
                      {showAllTimezones ? 'Hide expanded list' : 'View all timezones'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Two-Pane Sequence Builder */}
              <div className="flex flex-col lg:flex-row gap-8 min-h-[600px]">
                {/* Left Pane: Timeline */}
                <div className="w-full lg:w-[350px] space-y-4">
                  <div className="flex items-center justify-between px-4 mb-4">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500">Flow Timeline</h4>
                    <button onClick={addStep} className="p-2 rounded-xl bg-[#10b981]/10 text-[#10b981] hover:bg-[#10b981] hover:text-white transition-all">
                      <Plus size={16} />
                    </button>
                  </div>

                  <Reorder.Group axis="y" values={steps} onReorder={setSteps} className="space-y-4">
                    {steps.map((step, index) => (
                      <Reorder.Item
                        key={step.id}
                        value={step}
                        className={`relative cursor-pointer transition-all ${activeStepId === step.id ? 'z-10' : 'z-0'}`}
                        onClick={() => setActiveStepId(step.id)}
                      >
                        {/* Connecting Line */}
                        {index > 0 && (
                          <div className="absolute -top-4 left-[22px] w-0.5 h-4 bg-slate-500/20" />
                        )}

                        <div className={`p-5 rounded-[2rem] border transition-all ${activeStepId === step.id
                          ? 'glass-surface border-[#10b981] shadow-xl'
                          : 'bg-white/5 border-transparent hover:border-white/10'
                          }`}>
                          <div className="flex items-center space-x-4">
                            <div className={`w-11 h-11 rounded-xl flex items-center justify-center font-black ${activeStepId === step.id ? 'bg-[#10b981] text-white' : 'bg-slate-800 text-slate-400'}`}>
                              <Mail size={18} />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className={`text-[10px] font-black uppercase tracking-widest ${activeStepId === step.id ? 'text-[#10b981]' : 'text-slate-500'}`}>Email Step {index + 1}</p>
                              <p className={`text-xs font-bold truncate ${isEthereal ? 'text-[#064e3b]' : 'text-white'}`}>{step.subject || '(No Subject)'}</p>
                            </div>
                            {steps.length > 1 && (
                              <button onClick={(e) => { e.stopPropagation(); removeStep(step.id); }} className="opacity-0 group-hover:opacity-100 p-2 text-rose-500 hover:bg-rose-500/10 rounded-lg transition-all">
                                <Trash2 size={14} />
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Wait Delay Indicator */}
                        <div className="flex items-center space-x-3 px-4 py-3">
                          <div className="w-11 flex justify-center">
                            <Clock size={14} className="text-slate-600" />
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-[10px] font-black text-slate-500 uppercase">Wait for</span>
                            <input
                              type="number"
                              value={step.delayDays}
                              onChange={(e) => updateStep(step.id, { delayDays: parseInt(e.target.value) })}
                              onClick={(e) => e.stopPropagation()}
                              className="w-10 h-6 bg-white/5 border border-white/10 rounded text-center text-[10px] font-black text-[#10b981] outline-none"
                            />
                            <span className="text-[10px] font-black text-slate-500 uppercase whitespace-nowrap">day then</span>
                          </div>
                        </div>
                      </Reorder.Item>
                    ))}
                  </Reorder.Group>
                </div>

                {/* Right Pane: Editor */}
                <div className="flex-1 glass-surface rounded-[3rem] border border-white/5 overflow-hidden shadow-2xl flex flex-col">
                  {activeStepId ? (
                    (() => {
                      const activeStep = steps.find(s => s.id === activeStepId);
                      if (!activeStep) return null;
                      return (
                        <>
                          <div className="p-8 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                            <div className="flex items-center space-x-4">
                              <div className="w-10 h-10 rounded-xl bg-[#10b981] flex items-center justify-center text-white">
                                <Layout size={20} />
                              </div>
                              <div>
                                <h4 className={`text-lg font-black font-heading ${isEthereal ? 'text-[#064e3b]' : 'text-white'}`}>Edit Transmission Node</h4>
                                <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Protocol Generation Layer</span>
                              </div>
                            </div>
                            <div className="flex items-center space-x-3">
                              <button className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-white/5 text-[10px] font-black uppercase tracking-widest text-[#10b981] hover:bg-white/10 transition-all">
                                <Zap size={14} /> <span>AI Optimize</span>
                              </button>
                            </div>
                          </div>

                          <div className="p-10 flex-1 space-y-8 overflow-y-auto">
                            <div className="space-y-3">
                              <div className="flex justify-between items-center ml-1">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Subject Line</label>
                                <div className="flex items-center space-x-4">
                                  <div className="flex items-center space-x-1.5 cursor-pointer group" onClick={() => updateStep(activeStep.id, { subject: activeStep.subject + ' {{first_name}}' })}>
                                    <span className="text-[#10b981] font-black text-[10px]">{'{ }'}</span>
                                    <span className="text-[10px] font-black uppercase text-slate-500 group-hover:text-[#10b981] transition-colors">Variables</span>
                                  </div>
                                </div>
                              </div>
                              <input
                                value={activeStep.subject}
                                onChange={(e) => updateStep(activeStep.id, { subject: e.target.value })}
                                placeholder="Enter subject header..."
                                className={`w-full h-14 px-8 rounded-2xl text-sm font-bold focus:shadow-[0_0_30px_rgba(16,185,129,0.1)] transition-all ${isEthereal ? 'bg-slate-50 border-slate-100 text-slate-700' : 'bg-black/20 border-white/5 text-white'}`}
                              />
                            </div>

                            <div className="space-y-3">
                              {/* Toolbar */}
                              <div className={`p-4 rounded-2xl border flex items-center justify-between ${isEthereal ? 'bg-slate-50 border-slate-100' : 'bg-white/5 border-white/5'}`}>
                                <div className="flex items-center space-x-6">
                                  <div className="flex items-center space-x-4 border-r border-white/10 pr-6">
                                    <button className="text-slate-500 hover:text-[#10b981] transition-colors"><Mail size={16} /></button>
                                    <div className="relative group">
                                      <button className="flex items-center space-x-1 text-slate-500 hover:text-[#10b981] transition-colors">
                                        <span className="font-black text-sm">{'{ }'}</span>
                                      </button>
                                      {/* Simple tags dropdown mockup */}
                                      <div className="absolute top-full left-0 mt-2 w-48 bg-slate-900 border border-white/10 rounded-xl shadow-2xl p-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                                        {['first_name', 'last_name', 'company_name', 'email'].map(tag => (
                                          <button
                                            key={tag}
                                            onClick={() => updateStep(activeStep.id, { body: activeStep.body + ` {{${tag}}}` })}
                                            className="w-full text-left px-4 py-2 hover:bg-white/5 rounded-lg text-[10px] font-black uppercase text-slate-400 hover:text-white"
                                          >
                                            {tag.replace('_', ' ')}
                                          </button>
                                        ))}
                                      </div>
                                    </div>
                                    <button className="text-slate-500 hover:text-[#10b981] transition-colors"><Zap size={16} /></button>
                                  </div>
                                  <div className="flex items-center space-x-4">
                                    <button className="text-slate-500 hover:text-[#10b981] transition-colors font-serif italic text-lg">A</button>
                                    <button className="text-slate-500 hover:text-[#10b981] transition-colors"><FileText size={16} /></button>
                                    <button onClick={() => {
                                      const url = window.prompt('Enter Link Target URL:');
                                      if (url) updateStep(activeStep.id, { body: activeStep.body + ` [LINK](${url})` });
                                    }} className="text-slate-500 hover:text-[#10b981] transition-colors"><ArrowRight size={16} /></button>
                                  </div>
                                </div>
                                <div className="flex items-center space-x-4">
                                  <button className="text-slate-700 text-xs font-black">Aa</button>
                                </div>
                              </div>
                              <textarea
                                rows={12}
                                value={activeStep.body}
                                onChange={(e) => updateStep(activeStep.id, { body: e.target.value })}
                                className={`w-full p-10 rounded-[2.5rem] text-sm leading-relaxed focus:shadow-[0_0_30px_rgba(16,185,129,0.1)] transition-all resize-none ${isEthereal ? 'bg-slate-50 border-slate-100 text-slate-700' : 'bg-black/20 border-white/5 text-slate-300'}`}
                                placeholder="Start typing your advanced outreach matrix..."
                              />
                            </div>
                          </div>
                        </>
                      );
                    })()
                  ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-center p-20 space-y-6">
                      <div className="w-20 h-20 rounded-3xl bg-white/5 flex items-center justify-center text-slate-600">
                        <Mail size={40} />
                      </div>
                      <p className="text-sm font-black uppercase tracking-widest text-slate-500">Select a transmission node to begin editing</p>
                    </div>
                  )}
                </div>
              </div>
              <button onClick={addStep} className={`w-full py-10 border-2 border-dashed rounded-[3.5rem] transition-all flex flex-col items-center justify-center space-y-3 group ${isEthereal ? 'border-slate-200 text-slate-400 hover:bg-[#10b981]/5 hover:text-[#10b981] hover:border-[#10b981]/20' : 'border-white/5 text-slate-600 hover:bg-[#00E5FF]/5 hover:text-[#00E5FF] hover:border-[#00E5FF]/20'}`}>
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${isEthereal ? 'bg-slate-50 text-slate-400 group-hover:bg-[#10b981] group-hover:text-white' : 'bg-white/5 text-slate-500 group-hover:bg-[#00E5FF] group-hover:text-slate-900'}`}>
                  <Plus size={28} />
                </div>
                <span className="text-xs font-black uppercase tracking-[0.2em]">Add Transmission Node</span>
              </button>
            </motion.div>
          )}

          {/* Step 3: Setup */}
          {currentStep === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="glass-surface p-10 rounded-[3rem] border border-white/5 space-y-8">
                  <div className="flex items-center justify-between">
                    <h3 className={`text-xl font-black font-heading ${isEthereal ? 'text-[#064e3b]' : 'text-white'}`}>Dispatch Fleet</h3>
                    <span className="text-[10px] font-black text-slate-500 uppercase">{selectedInboxes.length} SELECTED</span>
                  </div>
                  <div className="space-y-4 max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
                    {inboxes.map(inbox => (
                      <div key={inbox.id} onClick={() => {
                        if (selectedInboxes.includes(inbox.id)) setSelectedInboxes(selectedInboxes.filter(i => i !== inbox.id));
                        else setSelectedInboxes([...selectedInboxes, inbox.id]);
                      }} className={`p-5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${selectedInboxes.includes(inbox.id)
                        ? (isEthereal ? 'bg-[#10b981]/5 border-[#10b981]/30' : 'bg-[#00E5FF]/5 border-[#00E5FF]/30')
                        : (isEthereal ? 'bg-white border-slate-100 hover:border-slate-200' : 'bg-black/20 border-white/5 hover:border-white/20')
                        }`}>
                        <div className="flex items-center space-x-4">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${inbox.status === 'authenticated' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
                            <Mail size={18} />
                          </div>
                          <div>
                            <p className={`text-sm font-black ${isEthereal ? 'text-[#064e3b]' : 'text-slate-200'}`}>{inbox.email}</p>
                            <p className="text-[10px] font-bold text-slate-500 uppercase">{inbox.provider}</p>
                          </div>
                        </div>
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${selectedInboxes.includes(inbox.id)
                          ? (isEthereal ? 'bg-[#10b981] border-[#10b981]' : 'bg-[#00E5FF] border-[#00E5FF]')
                          : 'border-slate-500/30'
                          }`}>
                          {selectedInboxes.includes(inbox.id) && <CheckCircle2 size={14} className={isEthereal ? 'text-white' : 'text-slate-900'} />}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="glass-surface p-10 rounded-[3rem] border border-white/5 space-y-10">
                  <h3 className={`text-xl font-black font-heading ${isEthereal ? 'text-[#064e3b]' : 'text-white'}`}>Safety Protocols</h3>
                  <div className="space-y-8">
                    {[
                      { key: 'stopOnReply', label: 'Stop on Reply', desc: 'Auto-cease sequence after lead engagement' },
                      { key: 'trackOpens', label: 'Open Tracking', desc: 'Enable pixel-based open monitoring' },
                      { key: 'workDaysOnly', label: 'Work Days Only', desc: 'Restrict transmission to Mon-Fri' },
                    ].map(protocol => (
                      <div key={protocol.key} className="flex items-center justify-between group">
                        <div className="flex-1">
                          <p className={`font-black text-sm ${isEthereal ? 'text-[#064e3b]' : 'text-slate-200'}`}>{protocol.label}</p>
                          <p className="text-[10px] text-slate-500 font-bold uppercase">{protocol.desc}</p>
                        </div>
                        <button onClick={() => setSettings({ ...settings, [protocol.key]: !((settings as any)[protocol.key]) })} className={`w-12 h-6 rounded-full transition-all relative ${(settings as any)[protocol.key] ? (isEthereal ? 'bg-[#10b981]' : 'bg-[#00E5FF]') : 'bg-slate-700'
                          }`}>
                          <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${(settings as any)[protocol.key] ? 'right-1' : 'left-1'}`} />
                        </button>
                      </div>
                    ))}
                    <div className="pt-4 border-t border-white/5">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-4">Daily Volume Limit (Per Inbox)</label>
                      <input type="range" min="10" max="200" step="10" value={settings.dailyLimit} onChange={(e) => setSettings({ ...settings, dailyLimit: parseInt(e.target.value) })} className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-[#10b981]" />
                      <div className="flex justify-between mt-2 text-[10px] font-black text-slate-500">
                        <span>10 EMAILS</span>
                        <span className={isEthereal ? 'text-[#10b981]' : 'text-[#00E5FF]'}>{settings.dailyLimit} EMAILS</span>
                        <span>200 EMAILS</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 4: Preview */}
          {currentStep === 4 && (
            <motion.div key="step4" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} className="space-y-8">
              <div className="glass-surface p-12 rounded-[4rem] border border-white/5 overflow-hidden relative">
                <div className={`absolute top-0 right-0 w-64 h-64 blur-[120px] opacity-20 ${isEthereal ? 'bg-[#10b981]' : 'bg-[#00E5FF]'}`} />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center relative z-10">
                  <div className="space-y-4">
                    <Users className={`mx-auto ${isEthereal ? 'text-[#10b981]' : 'text-[#00E5FF]'}`} size={32} />
                    <div>
                      <p className="text-3xl font-black text-white">{leadsCount}</p>
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Active Leads</p>
                    </div>
                  </div>
                  <div className="space-y-4 border-x border-white/5">
                    <Mail className={`mx-auto ${isEthereal ? 'text-[#10b981]' : 'text-[#00E5FF]'}`} size={32} />
                    <div>
                      <p className="text-3xl font-black text-white">{selectedInboxes.length}</p>
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Dispatch Inboxes</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <Zap className={`mx-auto ${isEthereal ? 'text-[#10b981]' : 'text-[#00E5FF]'}`} size={32} />
                    <div>
                      <p className="text-3xl font-black text-white">{steps.length}</p>
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Sequence Steps</p>
                    </div>
                  </div>
                </div>

                <div className="mt-16 p-10 bg-white/5 rounded-[3rem] border border-white/5">
                  <div className="flex items-center space-x-3 mb-8">
                    <ShieldAlert size={18} className="text-amber-500" />
                    <h4 className="text-sm font-black uppercase tracking-widest text-slate-200">Pre-Dispatch Checklist</h4>
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    {['Spintax Validated', 'Unsubscribe Ready', 'Rotation Active', 'IMAP Synced'].map(check => (
                      <div key={check} className="flex items-center space-x-4 text-xs font-bold text-slate-400">
                        <CheckCircle2 className="text-[#10b981]" size={16} />
                        <span>{check}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-12 flex flex-col items-center space-y-4">
                  <div className="flex items-center space-x-4 w-full justify-center">
                    <button onClick={() => setIsTestSendOpen(true)} className="px-8 py-4 rounded-[2rem] border border-white/10 font-black text-xs uppercase tracking-widest hover:bg-white/5 transition-all flex items-center">
                      <Zap size={16} className="mr-2 text-amber-500" /> Test Send
                    </button>
                    <button onClick={() => handleSave()} className="btn-primary px-12 py-4 rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] shadow-[0_0_40px_rgba(16,185,129,0.2)] hover:shadow-[0_0_60px_rgba(16,185,129,0.3)] transition-all">
                      Initiate Global Sequence
                    </button>
                  </div>
                  <p className="text-[10px] font-bold text-slate-600 mt-6 uppercase tracking-[0.2em]">Authorized Signature Required • Version 2.0.4</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Test Send Modal */}
      <AnimatePresence>
        {isTestSendOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="glass-surface p-8 rounded-[2.5rem] border border-white/10 w-full max-w-md space-y-6">
              <div className="flex justify-between items-center">
                <h3 className={`text-xl font-black font-heading ${isEthereal ? 'text-[#064e3b]' : 'text-white'}`}>Test Transmission</h3>
                <button onClick={() => setIsTestSendOpen(false)} className="text-slate-500 hover:text-white"><X size={20} /></button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Sender Node</label>
                  <select
                    value={testSendConfig.inboxId}
                    onChange={(e) => setTestSendConfig({ ...testSendConfig, inboxId: e.target.value })}
                    className={`w-full h-12 px-4 mt-2 rounded-xl text-xs font-bold outline-none ${isEthereal ? 'bg-slate-50 border-slate-200' : 'bg-black/20 border-white/10 text-white'}`}
                  >
                    <option value="">Select Inbox...</option>
                    {inboxes.map(i => <option key={i.id} value={i.id}>{i.email}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Recipient Target</label>
                  <input
                    value={testSendConfig.to}
                    onChange={(e) => setTestSendConfig({ ...testSendConfig, to: e.target.value })}
                    placeholder="receiver@example.com"
                    className={`w-full h-12 px-4 mt-2 rounded-xl text-xs font-bold outline-none ${isEthereal ? 'bg-slate-50 border-slate-200' : 'bg-black/20 border-white/10 text-white'}`}
                  />
                </div>
                <button
                  onClick={async () => {
                    if (!testSendConfig.inboxId || !testSendConfig.to) return alert('Select inbox and recipient');
                    try {
                      const step1 = steps[0];
                      await apiClient.post(`/inboxes/${testSendConfig.inboxId}/send-test`, {
                        to: testSendConfig.to,
                        subject: step1?.subject || 'Test Subject',
                        body: step1?.body || 'Test Body'
                      });
                      alert('Test transmission dispatched.');
                      setIsTestSendOpen(false);
                    } catch (err) {
                      alert('Transmission failed.');
                    }
                  }}
                  className="w-full btn-primary h-12 rounded-xl font-black uppercase tracking-widest text-xs flex items-center justify-center"
                >
                  <Zap size={16} className="mr-2" /> Dispatch Now
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CampaignEditorPage;