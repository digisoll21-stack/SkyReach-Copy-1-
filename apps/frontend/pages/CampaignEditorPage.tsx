import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Save, Plus, Trash2, Clock, Mail, Zap, 
  Settings as SettingsIcon, ChevronDown, Info, ShieldAlert,
  ChevronRight, Layout, Users, Sliders
} from 'lucide-react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';

interface Step {
  id: string;
  order: number;
  subject: string;
  body: string;
  delayDays: number;
}

const CampaignEditorPage: React.FC<{ theme: 'ethereal' | 'glass' }> = ({ theme }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEthereal = theme === 'ethereal';
  const primaryColor = isEthereal ? '#10b981' : '#00E5FF';
  
  const [activeTab, setActiveTab] = useState<'sequence' | 'settings' | 'leads'>('sequence');
  const [campaignName, setCampaignName] = useState('Q4 Enterprise Outreach');
  const [bounceRate, setBounceRate] = useState(5);
  
  const [steps, setSteps] = useState<Step[]>([
    { id: 's1', order: 1, subject: '{Hi|Hello|Hey} {{firstName}}, quick question', body: "I was looking at {{company}} and noticed your team is expanding rapidly.\n\nWould love to discuss deliverability safety.\n\nBest,\nAlex", delayDays: 0 },
    { id: 's2', order: 2, subject: 'Re: {{firstName}} / SkyReach', body: "Just bumping this thread. Are you around for a quick sync next week?\n\n- Alex", delayDays: 3 }
  ]);

  const addStep = () => {
    const newStep: Step = { id: `s_${Date.now()}`, order: steps.length + 1, subject: '', body: '', delayDays: 3 };
    setSteps([...steps, newStep]);
  };

  const removeStep = (stepId: string) => {
    setSteps(steps.filter(s => s.id !== stepId).map((s, idx) => ({ ...s, order: idx + 1 })));
  };

  const updateStep = (stepId: string, updates: Partial<Step>) => {
    setSteps(steps.map(s => s.id === stepId ? { ...s, ...updates } : s));
  };

  return (
    <div className="space-y-8 fade-in pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center space-x-5">
          <button 
            onClick={() => navigate('/campaigns')}
            className={`p-3.5 rounded-2xl transition-all ${isEthereal ? 'bg-white text-slate-500 hover:bg-slate-50 shadow-sm' : 'bg-white/5 text-slate-400 hover:bg-white/10'}`}
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <div className="flex items-center space-x-3">
              <input 
                value={campaignName}
                onChange={(e) => setCampaignName(e.target.value)}
                className={`text-2xl font-black font-heading bg-transparent border-none p-0 focus:ring-0 w-fit max-w-[300px] md:max-w-none ${isEthereal ? 'text-[#064e3b]' : 'text-white'}`}
              />
              <span className={`px-2.5 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-widest border ${isEthereal ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'}`}>Draft</span>
            </div>
            <p className="text-slate-500 text-sm font-medium">Protocol ID: {id === 'new' ? 'GEN-01' : id}</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <button className={`flex-1 md:flex-none px-6 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest border transition-all ${isEthereal ? 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50' : 'bg-white/5 border-white/10 text-slate-300'}`}>
            <Sliders className="w-4 h-4 inline mr-2" /> Global Options
          </button>
          <button className="btn-primary px-10 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl transition-all active:scale-95">
            <Save className="w-4 h-4 inline mr-2" /> Synchronize Fleet
          </button>
        </div>
      </div>

      <div className={`flex items-center space-x-2 border-b ${isEthereal ? 'border-slate-100' : 'border-white/5'}`}>
        {[
          { id: 'sequence', label: 'Outbound Flow', icon: Layout },
          { id: 'leads', label: 'Contact List', icon: Users },
          { id: 'settings', label: 'Safety Protocols', icon: ShieldAlert }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center px-8 py-5 text-xs font-black uppercase tracking-widest transition-all relative ${
              activeTab === tab.id 
                ? (isEthereal ? 'text-[#064e3b]' : 'text-[#00E5FF]') 
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <tab.icon size={16} className="mr-3" />
            {tab.label}
            {activeTab === tab.id && (
              <motion.div 
                layoutId="editorTab"
                className={`absolute bottom-0 left-0 right-0 h-1 rounded-t-full ${isEthereal ? 'bg-[#10b981]' : 'bg-[#00E5FF]'}`}
              />
            )}
          </button>
        ))}
      </div>

      <div className="max-w-5xl mx-auto py-6">
        <AnimatePresence mode="wait">
          {activeTab === 'sequence' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-10">
              <div className={`p-6 rounded-[2rem] border flex items-start space-x-4 ${isEthereal ? 'bg-[#10b981]/5 border-[#10b981]/10' : 'bg-[#00E5FF]/5 border-[#00E5FF]/10'}`}>
                <Info className={`w-5 h-5 shrink-0 mt-1 ${isEthereal ? 'text-[#10b981]' : 'text-[#00E5FF]'}`} />
                <p className={`text-xs font-medium leading-relaxed ${isEthereal ? 'text-slate-600' : 'text-slate-400'}`}>
                  Personalization variables are dynamic. Use <span className="font-mono bg-white/40 px-1.5 py-0.5 rounded text-indigo-500">{"{{firstName}}"}</span> for name injection and <span className="font-mono bg-white/40 px-1.5 py-0.5 rounded text-indigo-500">{"{Hi|Hello}"}</span> for spintax rotations.
                </p>
              </div>

              <Reorder.Group axis="y" values={steps} onReorder={setSteps} className="space-y-8">
                {steps.map((step, index) => (
                  <Reorder.Item key={step.id} value={step} className="glass-surface rounded-[2.5rem] overflow-hidden shadow-2xl transition-all duration-500 border border-white/10">
                    <div className={`p-8 flex items-center justify-between border-b ${isEthereal ? 'bg-[#10b981]/5 border-[#10b981]/10' : 'bg-white/5 border-white/5'}`}>
                      <div className="flex items-center space-x-5">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black font-heading text-lg ${isEthereal ? 'bg-[#10b981] text-white shadow-lg' : 'bg-[#00E5FF] text-slate-900 shadow-[0_0_15px_rgba(0,229,255,0.4)]'}`}>
                          {index + 1}
                        </div>
                        <div>
                          <h4 className={`text-lg font-black font-heading ${isEthereal ? 'text-[#064e3b]' : 'text-white'}`}>Sequence Step {index + 1}</h4>
                          <div className="flex items-center text-[10px] font-black uppercase tracking-widest text-slate-500 mt-1">
                            <Clock className="w-3 h-3 mr-2" />
                            {index === 0 ? 'Protocol Launch' : `Wait ${step.delayDays} cycles after Step ${index}`}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        {index > 0 && (
                          <div className={`flex items-center rounded-xl px-4 py-2 border ${isEthereal ? 'bg-white border-slate-200' : 'bg-black/20 border-white/10'}`}>
                            <span className="text-[10px] font-black uppercase text-slate-500 mr-3">Wait</span>
                            <input 
                              type="number"
                              value={step.delayDays}
                              onChange={(e) => updateStep(step.id, { delayDays: parseInt(e.target.value) || 0 })}
                              className={`w-10 bg-transparent border-none p-0 text-sm font-black focus:ring-0 text-center ${isEthereal ? 'text-[#10b981]' : 'text-[#00E5FF]'}`}
                            />
                            <span className="text-[10px] font-black uppercase text-slate-500 ml-2">Days</span>
                          </div>
                        )}
                        <button onClick={() => removeStep(step.id)} className="p-3 rounded-2xl bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white transition-all">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                    
                    <div className="p-8 space-y-8">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Protocol Subject</label>
                        <input 
                          placeholder="Inject catchy subject line..."
                          value={step.subject}
                          onChange={(e) => updateStep(step.id, { subject: e.target.value })}
                          className={`w-full h-14 px-6 rounded-2xl text-sm font-bold focus:outline-none focus:ring-4 transition-all ${
                            isEthereal ? 'bg-white/60 border-slate-200 text-slate-700 focus:ring-[#10b981]/10' : 'bg-black/20 border-white/5 text-white focus:ring-[#00E5FF]/10'
                          }`}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Payload Content</label>
                        <textarea 
                          placeholder="Synthesize email body..."
                          rows={8}
                          value={step.body}
                          onChange={(e) => updateStep(step.id, { body: e.target.value })}
                          className={`w-full p-6 rounded-[1.8rem] text-sm font-medium focus:outline-none focus:ring-4 transition-all resize-none leading-relaxed ${
                            isEthereal ? 'bg-white/60 border-slate-200 text-slate-700 focus:ring-[#10b981]/10' : 'bg-black/20 border-white/5 text-slate-300 focus:ring-[#00E5FF]/10'
                          }`}
                        />
                      </div>
                    </div>
                  </Reorder.Item>
                ))}
              </Reorder.Group>

              <button 
                onClick={addStep}
                className={`w-full py-8 border-2 border-dashed rounded-[3rem] flex items-center justify-center space-x-4 transition-all group ${
                  isEthereal ? 'border-slate-200 text-slate-400 hover:border-[#10b981] hover:bg-[#10b981]/5 hover:text-[#10b981]' : 'border-white/10 text-slate-600 hover:border-[#00E5FF] hover:bg-[#00E5FF]/5 hover:text-[#00E5FF]'
                }`}
              >
                <Plus className="w-6 h-6 group-hover:scale-110 transition-transform" />
                <span className="text-sm font-black uppercase tracking-[0.2em]">Synthesize New Sequence Step</span>
              </button>
            </motion.div>
          )}

          {activeTab === 'settings' && (
            <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="max-w-3xl mx-auto space-y-10">
              <div className="glass-surface p-10 rounded-[3rem] space-y-10">
                <h3 className={`text-xl font-black font-heading flex items-center ${isEthereal ? 'text-[#064e3b]' : 'text-white'}`}>
                  <Zap className={`w-6 h-6 mr-4 ${isEthereal ? 'text-[#10b981]' : 'text-[#00E5FF]'}`} /> Flow Strategy
                </h3>
                
                <div className="space-y-8">
                  {[
                    { label: 'Stop on Reply', desc: 'Terminate protocol for a lead immediately upon interaction.', state: true },
                    { label: 'Pixel Tracking', desc: 'Embed high-fidelity invisible pixel to monitor open rates.', state: true },
                    { label: 'Weekend Pause', desc: 'Suspend all outgoing packets during non-business days.', state: false }
                  ].map((s, i) => (
                    <div key={i} className="flex items-center justify-between group">
                      <div>
                        <p className={`font-black text-base ${isEthereal ? 'text-[#064e3b]' : 'text-slate-200'}`}>{s.label}</p>
                        <p className="text-xs text-slate-500 font-medium">{s.desc}</p>
                      </div>
                      <div className={`w-14 h-7 rounded-full relative cursor-pointer p-1 transition-all ${s.state ? (isEthereal ? 'bg-[#10b981]' : 'bg-[#00E5FF]') : 'bg-slate-300'}`}>
                         <div className={`w-5 h-5 bg-white rounded-full absolute transition-all ${s.state ? 'right-1' : 'left-1'}`}></div>
                      </div>
                    </div>
                  ))}

                  <div className="pt-8 border-t border-slate-500/10">
                    <div className="flex justify-between items-center mb-6">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Daily Payload Limit</label>
                      <span className={`text-sm font-black ${isEthereal ? 'text-[#10b981]' : 'text-[#00E5FF]'}`}>200 Recipients</span>
                    </div>
                    <input type="range" className={`w-full accent-current transition-all ${isEthereal ? 'text-[#10b981]' : 'text-[#00E5FF]'}`} min="50" max="1000" step="50" defaultValue="200" />
                  </div>
                </div>
              </div>

              <div className={`p-10 rounded-[3rem] border-2 border-rose-500/20 space-y-10 relative overflow-hidden ${isEthereal ? 'bg-rose-500/5' : 'bg-rose-500/10'}`}>
                <div className={`absolute top-0 right-0 w-40 h-40 bg-rose-500 blur-3xl opacity-10 -mr-20 -mt-20`}></div>
                <h3 className="text-xl font-black font-heading flex items-center text-rose-500">
                  <ShieldAlert className="w-6 h-6 mr-4" /> Fail-Safe Parameters
                </h3>
                <div className="space-y-10">
                  <div>
                    <div className="flex justify-between items-center mb-6">
                      <label className="text-[10px] font-black uppercase tracking-widest text-rose-500/60">Auto-Pause (Hard Bounce %)</label>
                      <span className="text-sm font-black text-rose-500">{bounceRate}% Threshold</span>
                    </div>
                    <input 
                      type="range" 
                      className="w-full accent-rose-500" 
                      min="1" 
                      max="15" 
                      step="1" 
                      value={bounceRate}
                      onChange={(e) => setBounceRate(parseInt(e.target.value))}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className={`font-black text-base ${isEthereal ? 'text-[#064e3b]' : 'text-slate-200'}`}>Instant Spam Quarantine</p>
                      <p className="text-xs text-slate-500 font-medium">Auto-lock entire workspace upon detected ISP complaints.</p>
                    </div>
                    <div className="w-14 h-7 bg-rose-600 rounded-full relative cursor-pointer p-1">
                       <div className="w-5 h-5 bg-white rounded-full absolute right-1"></div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CampaignEditorPage;