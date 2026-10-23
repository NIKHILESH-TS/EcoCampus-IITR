import React, { useState } from 'react';
import { Leaf, ShieldCheck, User, Lock, Mail, CheckCircle2, X, ArrowRight, Sparkles } from 'lucide-react';

export default function LoginModal({ isOpen, onClose, onLoginSuccess }) {
  const [activeTab, setActiveTab] = useState('student');
  const [email, setEmail] = useState('student@iitr.ac.in');
  const [password, setPassword] = useState('iitr2026');

  if (!isOpen) return null;

  const handleTabSwitch = (tab) => {
    setActiveTab(tab);
    if (tab === 'student') {
      setEmail('student@iitr.ac.in');
      setPassword('student123');
    } else {
      setEmail('admin.sanitation@iitr.ac.in');
      setPassword('admin123');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onLoginSuccess(activeTab);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-lifted border border-hallmark-border overflow-hidden">
        
        {/* Top decorative Hallmark-style crest header */}
        <div className="bg-gradient-to-r from-hallmark-dark via-hallmark-primary to-emerald-800 text-white p-6 pb-8 text-center relative">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full text-emerald-200 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-inner">
            <Leaf className="w-8 h-8 text-emerald-300" />
          </div>
          <h2 className="font-display text-2xl font-bold tracking-tight">EcoCampus IIT Roorkee</h2>
          <p className="text-emerald-100/80 text-xs mt-1 font-sans">
            SOCIOTHON 2026 • Smart & Sustainable Waste Platform
          </p>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-hallmark-border bg-hallmark-muted/50 p-1.5 mx-6 -mt-5 rounded-2xl shadow-sm relative z-10 bg-white">
          <button
            type="button"
            onClick={() => handleTabSwitch('student')}
            className={`flex-1 py-2 text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'student'
                ? 'bg-hallmark-primary text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Student Portal (Govind Bhawan)</span>
          </button>
          
          <button
            type="button"
            onClick={() => handleTabSwitch('admin')}
            className={`flex-1 py-2 text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'admin'
                ? 'bg-hallmark-dark text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-amber-300" />
            <span>Estate & Admin Portal</span>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 pt-5 space-y-4 font-sans">
          <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-2xl p-3 text-xs text-emerald-900 flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 text-emerald-700 flex-shrink-0 mt-0.5" />
            <div>
              {activeTab === 'student' ? (
                <>
                  <strong className="font-semibold">Student Pilot Active:</strong> Govind Bhawan (200 Bins Monitor, AI Spot Camera, & EcoTrade Re-Use Marketplace).
                </>
              ) : (
                <>
                  <strong className="font-semibold">Admin Access:</strong> Central Telemetry, Automated One-Way Acknowledgment Engine, and Azure Custom Vision Model.
                </>
              )}
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              IIT Roorkee Official Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-hallmark-primary/40 focus:border-hallmark-primary text-sm bg-slate-50/50"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Campus Security Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-hallmark-primary/40 focus:border-hallmark-primary text-sm bg-slate-50/50"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 px-4 rounded-xl font-medium text-sm text-white bg-gradient-to-r from-hallmark-primary to-hallmark-dark hover:shadow-lg transition-all flex items-center justify-center gap-2 group"
            >
              <span>Sign In to {activeTab === 'student' ? 'Student Interface' : 'Administration Dashboard'}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="text-center pt-2">
            <button
              type="button"
              onClick={() => {
                onLoginSuccess(activeTab);
                onClose();
              }}
              className="text-xs text-hallmark-primary hover:text-hallmark-dark font-medium underline underline-offset-2"
            >
              ⚡ Instant 1-Click Demo Sign In ({activeTab.toUpperCase()})
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
