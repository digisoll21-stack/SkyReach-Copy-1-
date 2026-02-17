import React, { useState } from 'react';
import { 
  Inbox, Search, Filter, Reply, Smile, Meh, Frown,
  MoreVertical, ChevronRight, ExternalLink, Zap, Coffee, Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SentimentIcon: React.FC<{ category?: string }> = ({ category }) => {
  switch (category) {
    case 'interested': return <Smile className="w-4 h-4 text-emerald-500" />;
    case 'not_interested': return <Frown className="w-4 h-4 text-rose-500" />;
    case 'unsubscribe': return <Zap className="w-4 h-4 text-orange-500" />;
    case 'out_of_office': return <Coffee className="w-4 h-4 text-amber-500" />;
    default: return <Meh className="w-4 h-4 text-slate-400" />;
  }
};

const RepliesPage: React.FC<{ theme: 'ethereal' | 'glass' }> = ({ theme }) => {
  const isEthereal = theme === 'ethereal';
  const [selectedReply, setSelectedReply] = useState<any | null>(null);

  const mockReplies = [
    { id: 'r1', lead: 'Satya Nadella', email: 'satya@microsoft.com', subject: 'Re: Quick question about Microsoft', snippet: 'This looks very interesting, can you send over a deck?', classification: 'interested', confidence: 0.92, time: '12m ago', campaign: 'Q4 Enterprise' },
    { id: 'r2', lead: 'Jeff Bezos', email: 'jeff@amazon.com', subject: 'Re: Amazon / SkyReach Sync', snippet: 'Please remove me from this list immediately.', classification: 'unsubscribe', confidence: 0.98, time: '1h ago', campaign: 'Q4 Enterprise' },
    { id: 'r3', lead: 'Tim Cook', email: 'tim@apple.com', subject: 'Re: Apple / Outreach', snippet: 'Thanks. Let me check with my team and get back to you.', classification: 'neutral', confidence: 0.45, time: '3h ago', campaign: 'CEO Series' }
  ];

  return (
    <div className="space-y-8 fade-in h-[calc(100vh-140px)] flex flex-col">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 className={`text-3xl md:text-4xl font-black font-heading tracking-tight ${isEthereal ? 'text-[#064e3b]' : 'text-white'}`}>Unified Pulse</h1>
          <p className={`${isEthereal ? 'text-slate-600' : 'text-slate-400'} font-medium`}>Real-time campaign thread detection and sentiment classification.</p>
        </div>
      </div>

      <div className="flex-1 flex gap-8 min-h-0 overflow-hidden">
        {/* List Pane */}
        <div className={`w-full lg:w-[400px] flex flex-col glass-surface rounded-[2.5rem] overflow-hidden`}>
          <div className={`p-6 border-b space-y-4 ${isEthereal ? 'border-slate-100 bg-white/30' : 'border-white/5 bg-white/5'}`}>
             <div className="relative">
               <Search className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 ${isEthereal ? 'text-slate-400' : 'text-slate-500'}`} />
               <input 
                 type="text" 
                 placeholder="Search conversations..."
                 className={`w-full h-12 pl-12 pr-6 rounded-2xl text-xs font-bold focus:outline-none transition-all ${
                   isEthereal ? 'bg-white/60 border-slate-200 text-slate-700' : 'bg-black/20 border-white/5 text-white'
                 }`}
               />
             </div>
             <div className="flex space-x-2">
                <button className={`flex-1 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${isEthereal ? 'bg-[#10b981] text-white shadow-md' : 'bg-[#00E5FF] text-slate-900 shadow-md'}`}>Recent</button>
                <button className={`flex-1 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${isEthereal ? 'border-slate-200 text-slate-500' : 'border-white/10 text-slate-400'}`}>High Match</button>
             </div>
          </div>
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100/5">
            {mockReplies.map((reply) => (
              <div 
                key={reply.id}
                onClick={() => setSelectedReply(reply)}
                className={`p-6 cursor-pointer transition-all border-l-4 ${
                  selectedReply?.id === reply.id 
                    ? (isEthereal ? 'bg-[#10b981]/5 border-[#10b981]' : 'bg-[#00E5FF]/10 border-[#00E5FF]') 
                    : 'border-transparent hover:bg-white/5'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                   <h4 className={`text-sm font-black ${isEthereal ? 'text-[#064e3b]' : 'text-white'}`}>{reply.lead}</h4>
                   <span className="text-[10px] font-black text-slate-500 uppercase tracking-tighter">{reply.time}</span>
                </div>
                <p className="text-xs text-slate-500 font-bold truncate mb-3">{reply.subject}</p>
                <div className="flex items-center justify-between">
                   <div className="flex items-center space-x-2 px-2 py-1 rounded-lg bg-slate-500/5">
                      <SentimentIcon category={reply.classification} />
                      <span className={`text-[10px] font-black uppercase tracking-widest ${isEthereal ? 'text-slate-600' : 'text-slate-400'}`}>{reply.classification}</span>
                   </div>
                   <span className={`text-[10px] font-mono font-black ${isEthereal ? 'text-[#10b981]' : 'text-[#00E5FF]'}`}>
                     {Math.round(reply.confidence * 100)}% Match
                   </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Detail Pane */}
        <div className="hidden lg:flex flex-1 glass-surface rounded-[2.5rem] overflow-hidden flex-col">
          {selectedReply ? (
            <AnimatePresence mode="wait">
              <motion.div 
                key={selectedReply.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex-1 flex flex-col"
              >
                <div className={`p-8 border-b flex items-center justify-between ${isEthereal ? 'border-slate-100 bg-white/40' : 'border-white/5 bg-white/5'}`}>
                   <div>
                     <h2 className={`text-2xl font-black font-heading ${isEthereal ? 'text-[#064e3b]' : 'text-white'}`}>{selectedReply.lead}</h2>
                     <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">{selectedReply.email} • {selectedReply.campaign}</p>
                   </div>
                   <div className="flex items-center space-x-3">
                      <button className={`p-4 rounded-2xl transition-all ${isEthereal ? 'bg-slate-100 text-slate-500 hover:bg-slate-200' : 'bg-white/5 text-slate-400 hover:bg-white/10'}`}>
                         <MoreVertical size={20} />
                      </button>
                      <button className="btn-primary px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl flex items-center">
                         <Reply size={18} className="mr-3" /> Initiate Response
                      </button>
                   </div>
                </div>

                <div className="flex-1 overflow-y-auto p-10 space-y-10">
                   <div className={`max-w-3xl rounded-[2rem] p-8 border transition-all ${
                     isEthereal ? 'bg-white border-slate-100 shadow-sm' : 'bg-white/5 border-white/5'
                   }`}>
                      <div className="flex justify-between mb-6">
                         <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${isEthereal ? 'text-[#10b981]' : 'text-[#00E5FF]'}`}>Inbound Protocol • {selectedReply.time}</span>
                         <div className={`flex items-center space-x-2 px-3 py-1 rounded-full border ${isEthereal ? 'bg-slate-50 border-slate-100' : 'bg-black/20 border-white/5'}`}>
                            <SentimentIcon category={selectedReply.classification} />
                            <span className="text-[10px] font-black text-slate-500 uppercase">{selectedReply.classification}</span>
                         </div>
                      </div>
                      <p className={`text-base leading-relaxed font-medium ${isEthereal ? 'text-slate-700' : 'text-slate-200'}`}>
                        {selectedReply.snippet}
                      </p>
                      <div className={`mt-8 pt-6 border-t flex items-center justify-between ${isEthereal ? 'border-slate-50' : 'border-white/5'}`}>
                         <button className="text-[10px] font-black text-slate-400 hover:text-slate-600 uppercase tracking-widest flex items-center">
                            Technical Headers <ExternalLink size={12} className="ml-2" />
                         </button>
                         <button className={`text-[10px] font-black uppercase tracking-widest flex items-center transition-colors ${isEthereal ? 'text-indigo-600' : 'text-indigo-400'}`}>
                            Timeline Audit <ChevronRight size={14} className="ml-1" />
                         </button>
                      </div>
                   </div>
                </div>
              </motion.div>
            </AnimatePresence>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-12">
               <div className={`w-24 h-24 rounded-[2rem] flex items-center justify-center mb-8 ${isEthereal ? 'bg-slate-100 text-slate-300' : 'bg-white/5 text-slate-600'}`}>
                  <Inbox size={48} />
               </div>
               <h3 className={`text-2xl font-black font-heading mb-3 ${isEthereal ? 'text-[#064e3b]' : 'text-white'}`}>Zero Threads Active</h3>
               <p className="text-slate-500 font-medium max-w-sm mx-auto">Select a conversation from the global stream to audit thread sentiment and match confidence.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RepliesPage;