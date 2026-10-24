import React, { useState } from 'react';
import { 
  AlertCircle, 
  HeartHandshake, 
  Sparkles, 
  Recycle, 
  Trophy,
  Layers 
} from 'lucide-react';
import ComplaintPortal from './ComplaintPortal';
import CommunityMarketplace from './CommunityMarketplace';
import WasteClassifier from '../AI/WasteClassifier';
import CircularResourceDirectory from '../Recycling/CircularResourceDirectory';
import GreenBhawanLeaderboard from '../Leaderboard/GreenBhawanLeaderboard';

export default function StudentPortal() {
  const [activeTab, setActiveTab] = useState('complaints');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6 font-sans">
      
      {/* 5 Clean Student Tabs */}
      <div className="bg-white rounded-xl border border-slate-200 p-1.5 flex flex-wrap lg:flex-nowrap items-center gap-1 shadow-subtle text-xs">
        
        <button
          type="button"
          onClick={() => setActiveTab('complaints')}
          className={`flex-1 min-w-[150px] py-2 px-3 rounded-lg font-medium flex items-center justify-center gap-1.5 transition-colors ${
            activeTab === 'complaints'
              ? 'bg-slate-900 text-white font-semibold'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <AlertCircle className="w-3.5 h-3.5 text-emerald-400" />
          <span>Govind Bins & Alerts</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('ai_classifier')}
          className={`flex-1 min-w-[150px] py-2 px-3 rounded-lg font-medium flex items-center justify-center gap-1.5 transition-colors ${
            activeTab === 'ai_classifier'
              ? 'bg-slate-900 text-white font-semibold'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span>AI Waste Identifier</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('marketplace')}
          className={`flex-1 min-w-[150px] py-2 px-3 rounded-lg font-medium flex items-center justify-center gap-1.5 transition-colors ${
            activeTab === 'marketplace'
              ? 'bg-slate-900 text-white font-semibold'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <HeartHandshake className="w-3.5 h-3.5 text-blue-400" />
          <span>Govind Re-Use (Trade)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('leaderboard')}
          className={`flex-1 min-w-[150px] py-2 px-3 rounded-lg font-medium flex items-center justify-center gap-1.5 transition-colors ${
            activeTab === 'leaderboard'
              ? 'bg-slate-900 text-white font-semibold'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Trophy className="w-3.5 h-3.5 text-amber-500" />
          <span>Hostel Leaderboard</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('resources')}
          className={`flex-1 min-w-[150px] py-2 px-3 rounded-lg font-medium flex items-center justify-center gap-1.5 transition-colors ${
            activeTab === 'resources'
              ? 'bg-slate-900 text-white font-semibold'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Recycle className="w-3.5 h-3.5 text-purple-400" />
          <span>Campus Recovery</span>
        </button>

      </div>

      {/* Render Selected View */}
      {activeTab === 'complaints' && <ComplaintPortal />}
      {activeTab === 'ai_classifier' && <WasteClassifier />}
      {activeTab === 'marketplace' && <CommunityMarketplace />}
      {activeTab === 'leaderboard' && <GreenBhawanLeaderboard />}
      {activeTab === 'resources' && <CircularResourceDirectory />}

    </div>
  );
}
