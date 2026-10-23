import React, { useState } from 'react';
import { 
  Trash2, 
  Camera, 
  HeartHandshake, 
  Sparkles, 
  Clock, 
  MapPin, 
  Coins, 
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import GovindBhawanBinComplaint from './GovindBhawanBinComplaint';
import SpotAiWasteComplaint from './SpotAiWasteComplaint';
import GovindBhawanReUseMarket from './GovindBhawanReUseMarket';

export default function StudentPortal() {
  const [activeTab, setActiveTab] = useState('bins');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 font-sans">
      
      {/* Hallmark 3-Option Navigation Tabs */}
      <div className="bg-white rounded-3xl p-2 sm:p-2.5 border border-hallmark-border shadow-soft flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
        
        {/* Option 1: Govind Bhawan 200 Bins */}
        <button
          type="button"
          onClick={() => setActiveTab('bins')}
          className={`flex-1 py-3.5 px-4 rounded-2xl flex items-center justify-center sm:justify-start gap-3 transition-all ${
            activeTab === 'bins'
              ? 'bg-hallmark-primary text-white shadow-md'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
            activeTab === 'bins' ? 'bg-white/20 text-white' : 'bg-emerald-50 text-emerald-800'
          }`}>
            <Trash2 className="w-5 h-5" />
          </div>
          <div className="text-left">
            <div className="text-xs font-bold font-display uppercase tracking-wider opacity-80">Option 1</div>
            <div className="text-sm font-semibold leading-tight">Govind Bhawan 200 Dustbins</div>
            <div className={`text-[11px] truncate ${activeTab === 'bins' ? 'text-emerald-100' : 'text-slate-400'}`}>
              Fill levels, timings & reports
            </div>
          </div>
        </button>

        {/* Option 2: Spot AI Complaint */}
        <button
          type="button"
          onClick={() => setActiveTab('ai_spot')}
          className={`flex-1 py-3.5 px-4 rounded-2xl flex items-center justify-center sm:justify-start gap-3 transition-all ${
            activeTab === 'ai_spot'
              ? 'bg-hallmark-primary text-white shadow-md'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
            activeTab === 'ai_spot' ? 'bg-white/20 text-white' : 'bg-amber-50 text-amber-800'
          }`}>
            <Camera className="w-5 h-5" />
          </div>
          <div className="text-left">
            <div className="text-xs font-bold font-display uppercase tracking-wider opacity-80">Option 2</div>
            <div className="text-sm font-semibold leading-tight">Random Spot AI Complaint</div>
            <div className={`text-[11px] truncate ${activeTab === 'ai_spot' ? 'text-emerald-100' : 'text-slate-400'}`}>
              Azure Cloud AI identification
            </div>
          </div>
        </button>

        {/* Option 3: Govind Bhawan Re-Use Market */}
        <button
          type="button"
          onClick={() => setActiveTab('market')}
          className={`flex-1 py-3.5 px-4 rounded-2xl flex items-center justify-center sm:justify-start gap-3 transition-all ${
            activeTab === 'market'
              ? 'bg-hallmark-primary text-white shadow-md'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
            activeTab === 'market' ? 'bg-white/20 text-white' : 'bg-blue-50 text-blue-800'
          }`}>
            <HeartHandshake className="w-5 h-5" />
          </div>
          <div className="text-left">
            <div className="text-xs font-bold font-display uppercase tracking-wider opacity-80">Option 3</div>
            <div className="text-sm font-semibold leading-tight">Govind Re-Use & EcoTrade</div>
            <div className={`text-[11px] truncate ${activeTab === 'market' ? 'text-emerald-100' : 'text-slate-400'}`}>
              Smart points giveaway algorithm
            </div>
          </div>
        </button>

      </div>

      {/* Render Selected Feature */}
      <div className="animate-fadeIn">
        {activeTab === 'bins' && <GovindBhawanBinComplaint />}
        {activeTab === 'ai_spot' && <SpotAiWasteComplaint />}
        {activeTab === 'market' && <GovindBhawanReUseMarket />}
      </div>

    </div>
  );
}
