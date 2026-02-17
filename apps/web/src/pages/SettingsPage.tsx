
import React, { useState } from 'react';
import { User, Building, CreditCard, Shield, Key, CheckCircle2, Zap, ArrowUpRight, Crown, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SettingsPage: React.FC<{ theme: 'ethereal' | 'glass' }> = ({ theme }) => {
  const isEthereal = theme === 'ethereal';
  const [activeMenu, setActiveMenu] = useState('Profile');

  const menuItems = [
    { name: 'Profile', icon: User },
    { name: 'Workspace', icon: Building },
    { name: 'Subscription', icon: CreditCard },
    { name: 'Security', icon: Shield },
    { name: 'Integrations', icon: Key },
  ];

  const plans = [
    { name: 'Seed', price: '$49', features: ['1 SDR Seat', '2 Active Inboxes', '500 Contacts/mo'], current: false },
    { name: 'Growth', price: '$149', features: ['5 SDR Seats', '20 Active Inboxes', 'Unlimited Contacts'], current: true, popular: true },
    { name: 'Enterprise', price: '$499', features: ['Unlimited Seats', 'Dedicated Warmup', 'White-labeled Links'], current: false },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8 fade-in pb-20">
      <div>
        <h1 className={`text-3xl md:text-4xl font-black font-heading tracking-tight ${isEthereal ? 'text-[#064e3b]' : 'text-white'}`}>Configuration</h1>
        <p className={`${isEthereal ? 'text-slate-600' : 'text-slate-400'} font-medium`}>Manage your SDR protocol and billing cycles.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-10">
        <div className="w-full lg:w-72 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.name}
              onClick={() => setActiveMenu(item.name)}
              className={`w-full flex items-center px-6 py-4 rounded-2xl transition-all font-black text-sm ${
                activeMenu === item.name 
                  ? (isEthereal ? 'bg-[#10b981]/15 text-[#064e3b] border border-[#10b981]/20' : 'bg-[#00E5FF]/20 text-[#00E5FF] border border-[#00E5FF]/20') 
                  : (isEthereal ? 'text-slate-500 hover:bg-slate-100' : 'text-slate-400 hover:bg-white/5')
              }`}
            >
              <item.icon className="w-5 h-5 mr-4" />
              {item.name}
            </button>
          ))}
        </div>

        <div className="flex-1">
          <AnimatePresence mode="wait">
            {activeMenu === 'Subscription' ? (
              <motion.div key="sub" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                <div className="glass-surface p-10 rounded-[3rem] border-2 border-[#10b981]/20 relative overflow-hidden">
                  <div className={`absolute top-0 right-0 w-40 h-40 ${isEthereal ? 'bg-[#10b981]' : 'bg-[#00E5FF]'} blur-[100px] opacity-10 -mr-20 -mt-20`}></div>
                  <div className="flex items-center justify-between relative z-10">
                    <div>
                       <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${isEthereal ? 'bg-[#10b981]/10 text-[#10b981]' : 'bg-[#00E5FF]/10 text-[#00E5FF]'}`}>Active Protocol</span>
                       <h2 className={`text-3xl font-black font-heading mt-2 ${isEthereal ? 'text-[#064e3b]' : 'text-white'}`}>Growth Tier</h2>
                    </div>
                    <div className="text-right">
                       <p className="text-xs text-slate-500 font-bold uppercase">Next billing cycle</p>
                       <p className={`text-sm font-black ${isEthereal ? 'text-[#064e3b]' : 'text-slate-200'}`}>June 12, 2024</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {plans.map((plan) => (
                    <div key={plan.name} className={`glass-surface p-8 rounded-[2.5rem] border flex flex-col ${plan.current ? 'border-[#10b981]' : 'border-white/5 opacity-80'}`}>
                      {plan.popular && (
                         <span className="text-[9px] font-black uppercase text-[#10b981] mb-2 flex items-center"><Crown size={12} className="mr-1" /> Market Leader</span>
                      )}
                      <h3 className={`text-lg font-black font-heading ${isEthereal ? 'text-[#064e3b]' : 'text-white'}`}>{plan.name}</h3>
                      <div className="flex items-baseline my-4">
                        <span className={`text-3xl font-black ${isEthereal ? 'text-[#064e3b]' : 'text-white'}`}>{plan.price}</span>
                        <span className="text-xs text-slate-500 ml-1">/mo</span>
                      </div>
                      <div className="flex-1 space-y-3 my-6">
                        {plan.features.map(f => (
                          <div key={f} className="flex items-center text-xs font-medium text-slate-500">
                             <Check size={14} className="mr-2 text-[#10b981]" /> {f}
                          </div>
                        ))}
                      </div>
                      <button className={`w-full py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                        plan.current 
                        ? 'bg-slate-500/10 text-slate-500 cursor-not-allowed' 
                        : (isEthereal ? 'bg-[#10b981] text-white shadow-md' : 'bg-[#00E5FF] text-slate-900')
                      }`}>
                        {plan.current ? 'Current Plan' : 'Synchronize'}
                      </button>
                    </div>
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.div key="other" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-10">
                <div className="glass-surface rounded-[2.5rem] p-8 md:p-10">
                  <h2 className={`text-2xl font-black font-heading mb-8 ${isEthereal ? 'text-[#064e3b]' : 'text-white'}`}>Workspace Details</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Entity Name</label>
                      <input 
                        type="text" defaultValue="Alpha Growth" 
                        className={`w-full h-14 px-6 rounded-2xl text-sm font-bold focus:outline-none transition-all ${isEthereal ? 'bg-white border-slate-200 text-slate-700' : 'bg-black/20 border-white/5 text-white'}`}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Primary Domain</label>
                      <input 
                        type="text" defaultValue="skyreach.ai" 
                        className={`w-full h-14 px-6 rounded-2xl text-sm font-bold focus:outline-none transition-all ${isEthereal ? 'bg-white border-slate-200 text-slate-700' : 'bg-black/20 border-white/5 text-white'}`}
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
