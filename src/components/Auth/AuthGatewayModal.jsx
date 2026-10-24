import React, { useState } from 'react';
import {
  Leaf,
  User,
  Truck,
  Shield,
  Building2,
  Mail,
  Lock,
  ArrowRight,
  Check,
  KeyRound,
  X,
  Copy,
  CheckCircle2,
  UserPlus,
  LogIn
} from 'lucide-react';
import { db } from '../../services/db';

export const DEMO_ACCOUNTS = [
  {
    role: 'student',
    userId: 'USR-001',
    title: 'Campus Student',
    name: 'Nikhil Sharma',
    org: 'Govind Bhawan • Room 214',
    email: 'nikhil.sharma@iitr.ac.in',
    password: 'iitr@student26',
    badge: '285 EcoTokens',
    highlights: 'AI Waste Scanner, 2-Step Bin Report, Nescafe Voucher Pass & Hostel Re-Use Bazaar',
    icon: User
  },
  {
    role: 'worker',
    userId: 'USR-003',
    title: 'Sanitation Field Crew',
    name: 'Ramesh Kumar',
    org: 'Sanitation Squad #2 • Beat A',
    email: 'ramesh.squad2@iitr.ac.in',
    password: 'iitr@crew26',
    badge: 'Hindi / English Audio',
    highlights: 'MobileNetV3 Secondary Sorter, Ground-Truth False Alarm Verification & UPI Bonus Tracker',
    icon: Truck
  },
  {
    role: 'admin',
    userId: 'USR-002',
    title: 'Estate Officer (Admin)',
    name: 'Prof. A.K. Verma',
    org: 'IITR Estate & Sanitation Command',
    email: 'estate.swm@iitr.ac.in',
    password: 'iitr@admin26',
    badge: 'Master Control',
    highlights: '200-Bin IoT Load/Ultrasonic Telemetry, TSP Route Optimizer & B2B Scrap Lot Creation',
    icon: Shield
  },
  {
    role: 'recycler',
    userId: 'USR-004',
    title: 'B2B Recycler Partner',
    name: 'ITC Paperboards & Specialty',
    org: 'GSTIN: 05AAACI1234Q1Z2',
    email: 'procurement@itcpspd.com',
    password: 'itc@bidder26',
    badge: 'Verified Buyer',
    highlights: 'Live Reverse Auction Bidding, Moisture/Grade Lab Specs & Weighbridge Gate Passes',
    icon: Building2
  }
];

export default function AuthGatewayModal({ isOpen, onClose, currentRole, onSelectRole }) {
  const [mode, setMode] = useState('signin'); // 'signin' | 'signup'
  const [selectedRole, setSelectedRole] = useState(currentRole || 'student');
  const [email, setEmail] = useState(DEMO_ACCOUNTS[0].email);
  const [password, setPassword] = useState(DEMO_ACCOUNTS[0].password);
  const [fullName, setFullName] = useState('');
  const [orgDetail, setOrgDetail] = useState('');
  const [copiedEmail, setCopiedEmail] = useState(null);

  if (!isOpen) return null;

  const handleSelectDemoCard = (account) => {
    setSelectedRole(account.role);
    setEmail(account.email);
    setPassword(account.password);
    if (mode === 'signup') {
      setFullName(account.name);
      setOrgDetail(account.org);
    }
  };

  const handleQuickLaunch = (account) => {
    db.setCurrentUser(account.userId);
    onSelectRole(account.role);
    onClose();
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const matched = DEMO_ACCOUNTS.find(a => a.role === selectedRole) || DEMO_ACCOUNTS[0];
    db.setCurrentUser(matched.userId);
    onSelectRole(selectedRole);
    onClose();
  };

  const handleCopyCredentials = (e, account) => {
    e.stopPropagation();
    navigator.clipboard?.writeText(`${account.email} / ${account.password}`);
    setCopiedEmail(account.email);
    setTimeout(() => setCopiedEmail(null), 1800);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-4xl w-full border border-slate-200/80 shadow-[0_24px_60px_-15px_rgba(0,0,0,0.15)] overflow-hidden my-8">
        
        {/* Top Clean Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-white">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-slate-900 flex items-center justify-center text-white">
              <Leaf className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-slate-900 tracking-tight">
                EcoCampus Identity & Demo Access Gateway
              </h2>
              <p className="text-xs text-slate-500">
                Unified authentication across all 4 circular economy stakeholders
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Main 2-Column Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12">
          
          {/* Left Column: Sign In / Sign Up Form (5 Cols) */}
          <div className="lg:col-span-5 p-6 sm:p-7 border-b lg:border-b-0 lg:border-r border-slate-100 flex flex-col justify-between bg-white">
            <div className="space-y-5">
              
              {/* Segmented Mode Switcher (Apple Style) */}
              <div className="bg-slate-100 p-1 rounded-xl grid grid-cols-2 text-xs font-medium">
                <button
                  type="button"
                  onClick={() => setMode('signin')}
                  className={`py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    mode === 'signin'
                      ? 'bg-white text-slate-900 shadow-xs font-semibold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Sign In</span>
                </button>
                <button
                  type="button"
                  onClick={() => setMode('signup')}
                  className={`py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    mode === 'signup'
                      ? 'bg-white text-slate-900 shadow-xs font-semibold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Create Account</span>
                </button>
              </div>

              <form onSubmit={handleFormSubmit} className="space-y-4">
                
                {/* Stakeholder Role Selector */}
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                    Select Portal Role
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {DEMO_ACCOUNTS.map(acc => {
                      const Icon = acc.icon;
                      const active = selectedRole === acc.role;
                      return (
                        <button
                          key={acc.role}
                          type="button"
                          onClick={() => handleSelectDemoCard(acc)}
                          className={`p-2.5 rounded-xl border text-left transition-all flex items-center gap-2 cursor-pointer ${
                            active
                              ? 'border-slate-900 bg-slate-900 text-white font-semibold shadow-xs'
                              : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                          }`}
                        >
                          <Icon className={`w-3.5 h-3.5 flex-shrink-0 ${active ? 'text-emerald-400' : 'text-slate-500'}`} />
                          <span className="text-xs truncate">{acc.title.split(' ')[0]}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {mode === 'signup' && (
                  <>
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">
                        Full Name / Company Name
                      </label>
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="e.g., Nikhil Sharma or ITC Ltd."
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 bg-slate-50/50 focus:bg-white focus:border-slate-900 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">
                        {selectedRole === 'student' ? 'Bhawan & Room Number' : selectedRole === 'recycler' ? 'Corporate GSTIN' : 'Department / Squad Beat'}
                      </label>
                      <input
                        type="text"
                        required
                        value={orgDetail}
                        onChange={(e) => setOrgDetail(e.target.value)}
                        placeholder={selectedRole === 'student' ? 'Govind Bhawan • Room 214' : '05AAACI1234Q1Z2'}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 bg-slate-50/50 focus:bg-white focus:border-slate-900 transition-colors"
                      />
                    </div>
                  </>
                )}

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Official Email / SSO ID
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 bg-slate-50/50 focus:bg-white focus:border-slate-900 font-mono transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 bg-slate-50/50 focus:bg-white focus:border-slate-900 font-mono transition-colors"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-all shadow-xs cursor-pointer"
                >
                  <span>{mode === 'signin' ? 'Continue to Workspace' : 'Create Verified Account'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </div>

            <div className="pt-6 border-t border-slate-100 mt-6 text-[11px] text-slate-400 flex items-center justify-between">
              <span>IIT Roorkee SSO Integrated</span>
              <span className="font-mono">TLS 1.3 • JWT Session</span>
            </div>
          </div>

          {/* Right Column: 4 Pre-Configured Demo Credential Cards (7 Cols) */}
          <div className="lg:col-span-7 p-6 sm:p-7 bg-slate-50/70 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                  Judge & Video Demo Presets
                </span>
                <h3 className="text-sm font-semibold text-slate-900 mt-1">
                  1-Click Demo Credentials for All 4 Use Cases
                </h3>
              </div>
              <span className="text-[11px] text-slate-500 hidden sm:inline">
                Click any card to launch session immediately
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {DEMO_ACCOUNTS.map(account => {
                const Icon = account.icon;
                const isSelected = selectedRole === account.role;

                return (
                  <div
                    key={account.role}
                    onClick={() => handleSelectDemoCard(account)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between bg-white ${
                      isSelected
                        ? 'border-slate-900 ring-1 ring-slate-900 shadow-sm'
                        : 'border-slate-200/90 hover:border-slate-300'
                    }`}
                  >
                    <div className="space-y-2.5">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2.5">
                          <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                            isSelected ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700'
                          }`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="font-semibold text-slate-900 text-xs">{account.title}</div>
                            <div className="text-[11px] text-slate-500">{account.name}</div>
                          </div>
                        </div>
                        <span className="text-[10px] font-mono font-medium bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md">
                          {account.badge}
                        </span>
                      </div>

                      <p className="text-[11px] text-slate-500 leading-relaxed">
                        {account.highlights}
                      </p>

                      {/* Credentials Box */}
                      <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/70 font-mono text-[10px] space-y-1">
                        <div className="flex items-center justify-between text-slate-600">
                          <span className="truncate">ID: <strong className="text-slate-900">{account.email}</strong></span>
                          <button
                            type="button"
                            onClick={(e) => handleCopyCredentials(e, account)}
                            className="text-slate-400 hover:text-slate-700 ml-1"
                            title="Copy credentials"
                          >
                            {copiedEmail === account.email ? (
                              <Check className="w-3 h-3 text-emerald-600" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </button>
                        </div>
                        <div className="text-slate-500">
                          Pass: <strong className="text-slate-800">{account.password}</strong>
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleQuickLaunch(account);
                      }}
                      className="mt-3 w-full py-2 rounded-xl bg-slate-100 hover:bg-slate-900 hover:text-white text-slate-800 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <span>Launch {account.title.split(' ')[0]} Demo</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>

            {/* End-to-End Video Recording Storyline Guide */}
            <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 text-xs space-y-1.5">
              <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Recommended 4-Step Demo Video Flow</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-[11px] text-slate-600 pt-1">
                <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
                  <strong className="text-slate-900 block">1. Student</strong>
                  AI Scan waste + Report bin issue + Check Nescafe Pass
                </div>
                <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
                  <strong className="text-slate-900 block">2. Field Crew</strong>
                  Hindi Voice + Verify/False Alarm + MobileNet Sorter
                </div>
                <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
                  <strong className="text-slate-900 block">3. Estate Admin</strong>
                  IoT Load/Volume Sensor Sim + Create B2B Scrap Lot
                </div>
                <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
                  <strong className="text-slate-900 block">4. B2B Recycler</strong>
                  ITC places counter-bid + Settles cash into Campus Vault
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
