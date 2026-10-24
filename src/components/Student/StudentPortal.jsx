import React, { useState, useEffect } from 'react';
import { 
  Home,
  Sparkles, 
  Coffee, 
  ShoppingBag, 
  AlertCircle, 
  Trophy,
  Recycle,
  Layers,
  ChevronDown,
  Coins
} from 'lucide-react';
import StudentHomeHub from './StudentHomeHub';
import QuickReportModal from './QuickReportModal';
import ComplaintPortal from './ComplaintPortal';
import CommunityMarketplace from './CommunityMarketplace';
import WasteClassifier from '../AI/WasteClassifier';
import StudentRewardsHub from './StudentRewardsHub';
import GreenBhawanLeaderboard from '../Leaderboard/GreenBhawanLeaderboard';
import CircularResourceDirectory from '../Recycling/CircularResourceDirectory';
import { db } from '../../services/db';

export default function StudentPortal({ onOpenQrScanner, onOpenVoiceAgent }) {
  const [activeTab, setActiveTab] = useState('home'); // 'home' | 'ai_classifier' | 'rewards' | 'marketplace' | 'all_bins' | 'leaderboard'
  const [user, setUser] = useState(db.getCurrentUser());
  const [isQuickReportOpen, setIsQuickReportOpen] = useState(false);

  useEffect(() => {
    const handleUpdate = () => setUser(db.getCurrentUser());
    window.addEventListener('ecocampus_db_change', handleUpdate);
    return () => window.removeEventListener('ecocampus_db_change', handleUpdate);
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-6 font-sans pb-24 md:pb-8">
      
      {/* Desktop / Tablet Clean Segmented Top Navigation */}
      <div className="hidden md:flex items-center justify-between bg-white rounded-2xl border border-slate-200 p-1.5 shadow-xs text-xs">
        
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setActiveTab('home')}
            className={`py-2 px-4 rounded-xl font-semibold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'home'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Home className="w-3.5 h-3.5" />
            <span>Home Hub</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('ai_classifier')}
            className={`py-2 px-4 rounded-xl font-semibold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'ai_classifier'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>AI Waste Identifier</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('rewards')}
            className={`py-2 px-4 rounded-xl font-semibold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'rewards'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Coffee className="w-3.5 h-3.5 text-emerald-400" />
            <span>Canteen Pass</span>
            <span className="font-mono text-[10px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.2 rounded font-bold">
              {user.ecoPointsBalance} Pts
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('marketplace')}
            className={`py-2 px-4 rounded-xl font-semibold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'marketplace'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5 text-blue-400" />
            <span>Hostel Bazaar</span>
          </button>
        </div>

        {/* Secondary Options */}
        <div className="flex items-center gap-1 border-l border-slate-200 pl-2">
          <button
            type="button"
            onClick={() => setActiveTab('all_bins')}
            className={`py-1.5 px-3 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
              activeTab === 'all_bins'
                ? 'bg-slate-100 text-slate-900 font-bold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            All 200 Bins
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('leaderboard')}
            className={`py-1.5 px-3 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
              activeTab === 'leaderboard'
                ? 'bg-slate-100 text-slate-900 font-bold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Hostel Trophy
          </button>
        </div>

      </div>

      {/* Render Selected View */}
      {activeTab === 'home' && (
        <StudentHomeHub 
          onNavigateTab={setActiveTab}
          onOpenReportModal={() => setIsQuickReportOpen(true)}
          onOpenVoiceModal={onOpenVoiceAgent}
          onOpenQrScanner={onOpenQrScanner}
        />
      )}

      {activeTab === 'ai_classifier' && <WasteClassifier />}
      {activeTab === 'rewards' && <StudentRewardsHub />}
      {activeTab === 'marketplace' && <CommunityMarketplace />}
      {activeTab === 'all_bins' && <ComplaintPortal />}
      {activeTab === 'leaderboard' && <GreenBhawanLeaderboard />}
      {activeTab === 'resources' && <CircularResourceDirectory />}

      {/* Simplified 2-Step Quick Report Modal */}
      <QuickReportModal
        isOpen={isQuickReportOpen}
        onClose={() => setIsQuickReportOpen(false)}
      />

      {/* Native Persistent Mobile Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 py-1.5 px-3 shadow-lg flex items-center justify-around">
        
        {/* Tab 1: Home Hub */}
        <button
          type="button"
          onClick={() => setActiveTab('home')}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all cursor-pointer ${
            activeTab === 'home'
              ? 'text-slate-900 font-bold'
              : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <Home className={`w-5 h-5 ${activeTab === 'home' ? 'text-slate-900 stroke-[2.5]' : 'text-slate-400'}`} />
          <span className="text-[10px] mt-0.5 tracking-tight">Home</span>
        </button>

        {/* Tab 2: AI Scan (Prominent Center Button) */}
        <button
          type="button"
          onClick={() => setActiveTab('ai_classifier')}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all cursor-pointer ${
            activeTab === 'ai_classifier'
              ? 'text-emerald-700 font-bold'
              : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <div className={`w-7 h-7 rounded-full flex items-center justify-center ${
            activeTab === 'ai_classifier' 
              ? 'bg-emerald-600 text-white shadow-xs' 
              : 'bg-emerald-100 text-emerald-800'
          }`}>
            <Sparkles className="w-4 h-4" />
          </div>
          <span className="text-[10px] mt-0.5 tracking-tight">AI Scan</span>
        </button>

        {/* Tab 3: Rewards & Canteen Pass */}
        <button
          type="button"
          onClick={() => setActiveTab('rewards')}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all cursor-pointer relative ${
            activeTab === 'rewards'
              ? 'text-slate-900 font-bold'
              : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <Coffee className={`w-5 h-5 ${activeTab === 'rewards' ? 'text-slate-900 stroke-[2.5]' : 'text-slate-400'}`} />
          <span className="text-[10px] mt-0.5 tracking-tight">Rewards</span>
          <span className="absolute -top-0.5 right-1 bg-emerald-600 text-white text-[9px] font-mono font-bold px-1 rounded-full">
            {user.ecoPointsBalance}
          </span>
        </button>

        {/* Tab 4: Re-Use Bazaar */}
        <button
          type="button"
          onClick={() => setActiveTab('marketplace')}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all cursor-pointer ${
            activeTab === 'marketplace'
              ? 'text-slate-900 font-bold'
              : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <ShoppingBag className={`w-5 h-5 ${activeTab === 'marketplace' ? 'text-slate-900 stroke-[2.5]' : 'text-slate-400'}`} />
          <span className="text-[10px] mt-0.5 tracking-tight">Bazaar</span>
        </button>

      </nav>

    </div>
  );
}
