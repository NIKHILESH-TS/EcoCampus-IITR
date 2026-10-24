import React, { useState, useEffect } from 'react';
import { 
  Home,
  Camera, 
  Coffee, 
  ShoppingBag, 
  Trophy,
  LayoutGrid
} from 'lucide-react';
import StudentHomeHub from './StudentHomeHub';
import QuickReportModal from './QuickReportModal';
import ComplaintPortal from './ComplaintPortal';
import CommunityMarketplace from './CommunityMarketplace';
import WasteClassifier from '../AI/WasteClassifier';
import StudentRewardsHub from './StudentRewardsHub';
import GreenBhawanLeaderboard from '../Leaderboard/GreenBhawanLeaderboard';
import { db } from '../../services/db';

const TABS = [
  { id: 'home', label: 'Overview', mobileLabel: 'Home', icon: Home },
  { id: 'ai_classifier', label: 'AI Waste Scanner', mobileLabel: 'Scan', icon: Camera },
  { id: 'rewards', label: 'Canteen Pass', mobileLabel: 'Pass', icon: Coffee },
  { id: 'marketplace', label: 'Re-Use Market', mobileLabel: 'Market', icon: ShoppingBag },
  { id: 'all_bins', label: 'All Bins & Reports', mobileLabel: 'Bins', icon: LayoutGrid },
  { id: 'leaderboard', label: 'Hostel Standings', mobileLabel: 'Rank', icon: Trophy }
];

export default function StudentPortal({ onOpenQrScanner, onOpenVoiceAgent }) {
  const [activeTab, setActiveTab] = useState('home');
  const [user, setUser] = useState(db.getCurrentUser());
  const [isQuickReportOpen, setIsQuickReportOpen] = useState(false);

  useEffect(() => {
    const handleUpdate = () => setUser(db.getCurrentUser());
    window.addEventListener('ecocampus_db_change', handleUpdate);
    return () => window.removeEventListener('ecocampus_db_change', handleUpdate);
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 sm:py-6 space-y-6 font-sans pb-24 md:pb-10">
      
      {/* Desktop Minimalist Underline Navigation */}
      <div className="hidden md:flex items-center gap-6 border-b border-slate-200/80 text-xs">
        {TABS.map(tab => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`pb-3.5 -mb-px font-medium flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
                active
                  ? 'border-slate-900 text-slate-900 font-semibold'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Icon className={`w-4 h-4 ${active ? 'text-emerald-600' : 'text-slate-400'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Active View */}
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

      {/* 2-Tap Quick Report Modal */}
      <QuickReportModal
        isOpen={isQuickReportOpen}
        onClose={() => setIsQuickReportOpen(false)}
      />

      {/* Mobile Native Bottom Tab Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-t border-slate-200/80 py-1.5 px-2 flex items-center justify-around">
        {TABS.slice(0, 5).map(tab => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-colors cursor-pointer ${
                active ? 'text-slate-900 font-semibold' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <Icon className={`w-5 h-5 ${active ? 'text-emerald-600' : 'text-slate-400'}`} />
              <span className="text-[10px] mt-0.5">{tab.mobileLabel}</span>
            </button>
          );
        })}
      </nav>

    </div>
  );
}
