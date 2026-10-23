import React, { useState } from 'react';
import { AlertCircle, HeartHandshake, Layers } from 'lucide-react';
import ComplaintPortal from './ComplaintPortal';
import CommunityMarketplace from './CommunityMarketplace';

export default function StudentPortal() {
  const [activeTab, setActiveTab] = useState('complaints'); // 'complaints' | 'marketplace'

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      
      {/* Clean Minimalist Primary Tab Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-1.5 flex items-center gap-1 shadow-subtle">
        
        <button
          type="button"
          onClick={() => setActiveTab('complaints')}
          className={`flex-1 py-2.5 px-4 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-colors ${
            activeTab === 'complaints'
              ? 'bg-brand-dark text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <AlertCircle className="w-4 h-4 text-emerald-400" />
          <span>Govind Bhawan 200 Bins & Complaints</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('marketplace')}
          className={`flex-1 py-2.5 px-4 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-colors ${
            activeTab === 'marketplace'
              ? 'bg-brand-dark text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <HeartHandshake className="w-4 h-4 text-amber-300" />
          <span>Govind Bhawan Re-Use & EcoTrade</span>
        </button>

      </div>

      {/* Render active module */}
      {activeTab === 'complaints' && <ComplaintPortal />}
      {activeTab === 'marketplace' && <CommunityMarketplace />}

    </div>
  );
}
