
import React, { useState } from 'react';
import { Globe, RefreshCw, CheckCircle2, AlertTriangle, Link as LinkIcon, Server } from 'lucide-react';

const TrackingDomainPage: React.FC<{ theme: 'ethereal' | 'glass' }> = ({ theme }) => {
    const isEthereal = theme === 'ethereal';
    const [domain, setDomain] = useState('');
    const [status, setStatus] = useState<'idle' | 'checking' | 'verified' | 'failed'>('idle');

    const handleVerify = () => {
        if (!domain) return;
        setStatus('checking');

        // Simulate API Verification
        setTimeout(() => {
            // Randomly succeed for demo purposes
            setStatus('verified');
        }, 1500);
    };

    return (
        <div className={`space-y-8 ${isEthereal ? 'text-slate-800' : 'text-slate-100'}`}>
            <div>
                <h2 className={`text-2xl font-black font-heading ${isEthereal ? 'text-[#064e3b]' : 'text-white'}`}>Custom Tracking Domain</h2>
                <p className={`${isEthereal ? 'text-slate-500' : 'text-slate-400'} mt-1`}>
                    Improve deliverability by using your own domain for tracking links (opens/clicks).
                </p>
            </div>

            {/* Configuration Card */}
            <div className={`rounded-[2.5rem] p-8 border ${isEthereal ? 'bg-white/60 border-white shadow-sm' : 'bg-slate-900/50 border-slate-800'}`}>
                <div className="flex flex-col md:flex-row gap-6 items-start">
                    <div className="flex-1 space-y-4 w-full">
                        <label className="text-xs font-bold uppercase tracking-widest opacity-60 ml-1">Tracking Domain (subdomain)</label>
                        <div className="relative">
                            <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 opacity-40" />
                            <input
                                type="text"
                                placeholder="link.yourcompany.com"
                                value={domain}
                                onChange={(e) => setDomain(e.target.value)}
                                className={`w-full h-14 pl-12 pr-6 rounded-2xl font-mono text-sm font-medium focus:outline-none border transition-all
                            ${isEthereal
                                        ? 'bg-white border-slate-200 focus:border-[#10b981] text-slate-800'
                                        : 'bg-black/30 border-slate-700 focus:border-blue-500 text-white'
                                    }
                        `}
                            />
                        </div>
                        <p className="text-xs opacity-60 flex gap-2 items-center">
                            <Server size={12} />
                            Create a <strong>CNAME</strong> record pointing to <code>api.skyreach.ai</code>
                        </p>
                    </div>

                    <button
                        onClick={handleVerify}
                        disabled={status === 'checking' || !domain}
                        className={`h-14 px-8 rounded-2xl font-bold flex items-center gap-2 transition-all mt-8 md:mt-0
                    ${status === 'verified'
                                ? 'bg-green-500 text-white cursor-default'
                                : isEthereal
                                    ? 'bg-slate-900 text-white hover:bg-slate-800'
                                    : 'bg-white text-black hover:bg-slate-200'
                            }
                `}
                    >
                        {status === 'checking' && <RefreshCw className="animate-spin" size={18} />}
                        {status === 'verified' && <CheckCircle2 size={18} />}
                        {status === 'idle' && 'Verify DNS'}
                        {status === 'checking' && 'Checking...'}
                        {status === 'verified' && 'Verified'}
                        {status === 'failed' && 'Retry'}
                    </button>
                </div>

                {/* Status Display */}
                {status === 'verified' && (
                    <div className="mt-6 p-4 rounded-xl bg-green-500/10 border border-green-500/20 flex items-start gap-3">
                        <CheckCircle2 className="text-green-500 shrink-0 mt-0.5" size={18} />
                        <div>
                            <h4 className="font-bold text-green-500 text-sm">Domain Active</h4>
                            <p className="text-xs text-green-600/80 mt-1">
                                All emails sent from this workspace will now rewrite links to <code>{domain}</code>.
                                SSL certificate has been automatically provisioned.
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* FAQ / Info */}
            <div className={`p-6 rounded-2xl border ${isEthereal ? 'bg-blue-50/50 border-blue-100' : 'bg-slate-800/30 border-slate-800'}`}>
                <h4 className="font-bold text-sm mb-3 flex items-center gap-2">
                    <Globe size={16} />
                    Why use a custom tracking domain?
                </h4>
                <p className="text-xs opacity-70 leading-relaxed mb-4">
                    By default, all SkyReach users share a generic tracking domain. If another user sends spam, it could potentially hurt the reputation of the shared domain.
                    Using your own subdomain (e.g., <code>link.yourdomain.com</code>) isolates your reputation and improves Google/Outlook deliverability significantly.
                </p>
            </div>
        </div>
    );
};

export default TrackingDomainPage;
