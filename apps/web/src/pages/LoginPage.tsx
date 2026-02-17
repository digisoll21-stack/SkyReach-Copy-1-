import React, { useState } from 'react';
import { Zap, Mail, Lock, ArrowRight, ShieldCheck, Activity, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import apiClient from '../utils/api-client';

const LoginPage: React.FC<{ onLogin: () => void }> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const { data } = await apiClient.post('/auth/login', {
        email: email.trim(),
        password: password
      });

      if (data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('workspaceId', data.workspace?.id || 'w1');
        localStorage.setItem('user', JSON.stringify(data.user));
        onLogin();
        navigate('/dashboard');
      } else {
        throw new Error('Protocol mismatch. Credentials rejected.');
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Handshake timed out.';
      setError(Array.isArray(msg) ? msg.join('. ') : msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen theme-ethereal flex items-center justify-center p-6">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[#10b981]/10 blur-[150px] rounded-full"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-sky-400/10 blur-[150px] rounded-full"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-[480px] glass-surface rounded-[3rem] p-12 shadow-2xl relative z-10"
      >
        <div className="flex flex-col items-center text-center mb-12">
          <motion.div 
            whileHover={{ rotate: 180 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="w-16 h-16 bg-gradient-to-br from-[#10b981] to-[#059669] rounded-2xl flex items-center justify-center mb-6 shadow-xl shadow-[#10b981]/30"
          >
            <Zap className="text-white w-9 h-9 fill-current" />
          </motion.div>
          <h1 className="text-4xl font-black text-[#064e3b] font-heading tracking-tighter">SkyReach</h1>
          <p className="text-slate-500 font-medium mt-2">The Enterprise Deliverability Protocol</p>
        </div>

        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 p-4 bg-rose-500/10 border border-rose-500/20 text-rose-600 text-[10px] font-black uppercase tracking-widest leading-relaxed rounded-2xl flex items-start"
          >
            <AlertCircle size={16} className="mr-3 shrink-0 mt-0.5" /> 
            <span>{error}</span>
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-3 ml-1">Terminal Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="commander@enterprise.io"
                className="w-full h-14 pl-12 pr-4 rounded-2xl text-sm font-bold bg-white/60 border border-slate-200 focus:outline-none focus:ring-4 focus:ring-[#10b981]/10 transition-all placeholder:text-slate-300"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-3 ml-1">Secure Passkey</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full h-14 pl-12 pr-4 rounded-2xl text-sm font-bold bg-white/60 border border-slate-200 focus:outline-none focus:ring-4 focus:ring-[#10b981]/10 transition-all placeholder:text-slate-300"
                required
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={isLoading}
            className="w-full btn-primary h-14 rounded-2xl font-black uppercase tracking-widest text-xs transition-all active:scale-95 flex items-center justify-center group mt-10"
          >
            {isLoading ? <Activity className="w-5 h-5 mr-3 animate-spin" /> : 'Authorize Protocol'}
            {!isLoading && <ArrowRight size={18} className="ml-3 group-hover:translate-x-1 transition-transform" />}
          </button>
        </form>

        <div className="mt-10 pt-8 border-t border-slate-100 text-center">
          <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">
            New Commander? <button onClick={() => navigate('/signup')} className="text-[#10b981] font-bold hover:underline">Initiate Signup</button>
          </p>
        </div>

        <div className="mt-8 flex items-center justify-center space-x-3 text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">
           <ShieldCheck size={14} className="text-[#10b981]" />
           <span>ISO 27001 Protocol</span>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;