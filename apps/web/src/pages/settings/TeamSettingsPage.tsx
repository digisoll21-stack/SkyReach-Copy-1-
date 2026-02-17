
import React, { useState } from 'react';
import { Users, UserPlus, Copy, Check, Mail, Shield } from 'lucide-react';

const TeamSettingsPage: React.FC<{ theme: 'ethereal' | 'glass' }> = ({ theme }) => {
    const isEthereal = theme === 'ethereal';
    const [inviteLink, setInviteLink] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Mock Members Data (Replace with API call later)
    const members = [
        { id: '1', name: 'You', email: 'admin@skyreach.ai', role: 'Owner', avatar: 'ME' },
    ];

    const generateInvite = async () => {
        setIsLoading(true);
        try {
            // In a real app, this would be an API call
            // const res = await api.post('/workspaces/CURRENT_ID/invites');
            // setInviteLink(res.data.inviteUrl);

            // Simulating API delay
            setTimeout(() => {
                setInviteLink('https://app.skyreach.ai/#/accept-invite/8f92-vb92-1920');
                setIsLoading(false);
            }, 600);
        } catch (e) {
            setIsLoading(false);
        }
    };

    const copyLink = () => {
        if (inviteLink) {
            navigator.clipboard.writeText(inviteLink);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <div className={`space-y-8 ${isEthereal ? 'text-slate-800' : 'text-slate-100'}`}>
            <div className="flex items-center justify-between">
                <div>
                    <h2 className={`text-2xl font-black font-heading ${isEthereal ? 'text-[#064e3b]' : 'text-white'}`}>Team Management</h2>
                    <p className={`${isEthereal ? 'text-slate-500' : 'text-slate-400'} mt-1`}>Manage access to your workspace and billing.</p>
                </div>
                <button
                    onClick={generateInvite}
                    disabled={!!inviteLink}
                    className={`px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all
            ${isEthereal
                            ? 'bg-[#10b981] text-white shadow-lg hover:bg-[#059669]'
                            : 'bg-blue-600 text-white hover:bg-blue-700'
                        }
          `}
                >
                    <UserPlus size={18} />
                    {inviteLink ? 'Link Generated' : 'Invite Member'}
                </button>
            </div>

            {/* Invite Link Section */}
            {inviteLink && (
                <div className={`p-6 rounded-2xl border ${isEthereal ? 'bg-emerald-50 border-emerald-200' : 'bg-blue-900/20 border-blue-800'}`}>
                    <h4 className={`text-sm font-bold mb-2 ${isEthereal ? 'text-emerald-800' : 'text-blue-300'}`}>
                        Share this link to invite members
                    </h4>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            readOnly
                            value={inviteLink}
                            className={`flex-1 px-4 py-3 rounded-xl font-mono text-sm border focus:outline-none 
                ${isEthereal ? 'bg-white border-emerald-200 text-emerald-900' : 'bg-black/40 border-slate-700 text-slate-300'}
              `}
                        />
                        <button
                            onClick={copyLink}
                            className={`px-4 rounded-xl flex items-center gap-2 font-bold transition-colors
                ${isEthereal ? 'bg-emerald-200 hover:bg-emerald-300 text-emerald-900' : 'bg-slate-700 hover:bg-slate-600 text-white'}
              `}
                        >
                            {copied ? <Check size={18} /> : <Copy size={18} />}
                            {copied ? 'Copied' : 'Copy'}
                        </button>
                    </div>
                    <p className="text-xs mt-2 opacity-60 flex items-center gap-1">
                        <Shield size={12} />
                        Link expires in 7 days. Anyone with this link can join as a Member.
                    </p>
                </div>
            )}

            {/* Members List */}
            <div className={`rounded-[2.5rem] p-8 border ${isEthereal ? 'bg-white/60 border-white shadow-sm' : 'bg-slate-900/50 border-slate-800'}`}>
                <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                    <Users size={20} className="text-slate-400" />
                    Active Members
                </h3>

                <div className="space-y-4">
                    {members.map(member => (
                        <div key={member.id} className={`flex items-center justify-between p-4 rounded-2xl border transition-colors
               ${isEthereal ? 'border-slate-100 hover:border-slate-200 bg-white' : 'border-slate-800 hover:border-slate-700 bg-black/20'}
            `}>
                            <div className="flex items-center gap-4">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs
                  ${isEthereal ? 'bg-slate-100 text-slate-600' : 'bg-slate-800 text-slate-300'}
                `}>
                                    {member.avatar}
                                </div>
                                <div>
                                    <h4 className="font-bold text-sm">{member.name} {member.id === '1' && '(You)'}</h4>
                                    <p className="text-xs opacity-60">{member.email}</p>
                                </div>
                            </div>
                            <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider
                ${isEthereal ? 'bg-slate-100 text-slate-600' : 'bg-slate-800 text-slate-300'}
              `}>
                                {member.role}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TeamSettingsPage;
