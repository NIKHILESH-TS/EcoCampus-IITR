import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Camera, 
  Mic, 
  AlertCircle, 
  Coffee, 
  Landmark, 
  ChevronRight, 
  CheckCircle2, 
  Clock, 
  ArrowRight, 
  MapPin, 
  Coins,
  QrCode,
  ShieldCheck,
  ThumbsUp,
  ThumbsDown,
  ExternalLink,
  ChevronDown
} from 'lucide-react';
import { db } from '../../services/db';

export default function StudentHomeHub({ 
  onNavigateTab, 
  onOpenReportModal, 
  onOpenVoiceModal,
  onOpenQrScanner 
}) {
  const [user, setUser] = useState(db.getCurrentUser());
  const [vault, setVault] = useState(db.getVault());
  const [recentComplaints, setRecentComplaints] = useState([]);
  const [nearestBins, setNearestBins] = useState([]);
  const [showAllBins, setShowAllBins] = useState(false);

  useEffect(() => {
    loadData();
    window.addEventListener('ecocampus_db_change', loadData);
    return () => window.removeEventListener('ecocampus_db_change', loadData);
  }, []);

  const loadData = () => {
    setUser(db.getCurrentUser());
    setVault(db.getVault());
    
    // Top 3 nearest bins in Govind Bhawan Wing B / Floor 1 & 2
    const all = db.getBins();
    setNearestBins(all.slice(0, 3));

    // Get recent student complaint for status tracking
    const comps = db.getComplaints().slice(0, 2);
    setRecentComplaints(comps);
  };

  const inrValue = Math.round(user.ecoPointsBalance * (vault.exchangeRateInrPerToken || 0.50));

  return (
    <div className="space-y-5 pb-6 max-w-xl mx-auto font-sans">
      
      {/* 1. Mobile Greeting & Wallet Summary */}
      <div className="bg-slate-900 text-white rounded-2xl p-5 border border-slate-800 shadow-sm relative overflow-hidden">
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <MapPin className="w-3.5 h-3.5 text-emerald-400" />
              <span>Govind Bhawan • Room 214</span>
            </div>
            <h1 className="text-xl font-bold text-white tracking-tight mt-1">
              Hey {user.name.split(' ')[0]} 👋
            </h1>
            <p className="text-xs text-slate-300 mt-0.5">
              What would you like to do on campus today?
            </p>
          </div>

          {/* Quick Balance Tap Card */}
          <button
            type="button"
            onClick={() => onNavigateTab('rewards')}
            className="bg-slate-800/90 hover:bg-slate-800 border border-slate-700 p-3 rounded-xl text-right transition-all active:scale-95 cursor-pointer"
          >
            <div className="text-[10px] text-slate-400 font-mono uppercase tracking-wider">EcoToken Pass</div>
            <div className="font-mono font-bold text-lg text-emerald-400 flex items-center justify-end gap-1">
              <Coins className="w-4 h-4 text-emerald-400" />
              <span>{user.ecoPointsBalance}</span>
            </div>
            <div className="text-[10px] text-emerald-300 font-medium">
              ≈ ₹{inrValue} Nescafe Pass
            </div>
          </button>
        </div>

        {/* Subtle background glow */}
        <div className="absolute -bottom-10 -right-10 w-36 h-36 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
      </div>

      {/* 2. THE 3 BIG ACTION-FIRST MOBILE TARGETS */}
      <div className="space-y-3">
        
        {/* ACTION 1: Throw Waste / AI Camera Scan */}
        <div 
          onClick={() => onNavigateTab('ai_classifier')}
          className="bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white rounded-2xl p-4.5 shadow-sm transition-all active:scale-98 cursor-pointer relative overflow-hidden group"
        >
          <div className="flex items-center justify-between">
            <div className="space-y-1 max-w-[75%]">
              <span className="bg-white/20 text-white font-mono text-[10px] font-bold px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-300" />
                AI CAMERA & MULTILINGUAL VOICE
              </span>
              <h2 className="text-base sm:text-lg font-bold tracking-tight">
                Scan Waste to Throw
              </h2>
              <p className="text-xs text-emerald-100 leading-snug">
                Unsure which dustbin to use? Snap a photo or ask in Hindi/English to segregate instantly.
              </p>
            </div>

            <div className="w-12 h-12 rounded-2xl bg-white/15 border border-white/20 flex items-center justify-center text-white flex-shrink-0 group-hover:bg-white/25 transition-colors">
              <Camera className="w-6 h-6 text-white" />
            </div>
          </div>

          <div className="mt-3 pt-2.5 border-t border-white/15 flex items-center justify-between text-xs font-semibold text-emerald-50">
            <span>Tap to open MobileNet Camera</span>
            <span className="flex items-center gap-1">
              Start Scan <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>

        {/* ACTION 2: Report Full or Broken Bin */}
        <div 
          onClick={onOpenReportModal}
          className="bg-white hover:bg-slate-50 border border-slate-200 rounded-2xl p-4.5 shadow-xs transition-all active:scale-98 cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <div className="space-y-1 max-w-[75%]">
              <span className="bg-amber-100 text-amber-900 font-mono text-[10px] font-bold px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                <AlertCircle className="w-3 h-3 text-amber-700" />
                SLA DISPATCH • +35 TOKENS
              </span>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                Report a Full or Broken Bin
              </h2>
              <p className="text-xs text-slate-500 leading-snug">
                Hostel bin overflowing or smelling? 2-tap photo report. Squad #2 is routed immediately.
              </p>
            </div>

            <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-800 flex-shrink-0 group-hover:bg-amber-100 transition-colors">
              <AlertCircle className="w-6 h-6 text-amber-700" />
            </div>
          </div>

          <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-700">
            <span className="text-[11px] text-slate-500">Anti-spam: False alarms deduct 25 pts</span>
            <span className="text-amber-800 flex items-center gap-1">
              Report Issue <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>

        {/* ACTION 3: Canteen & Nescafe Food Pass */}
        <div 
          onClick={() => onNavigateTab('rewards')}
          className="bg-white hover:bg-slate-50 border border-slate-200 rounded-2xl p-4.5 shadow-xs transition-all active:scale-98 cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <div className="space-y-1 max-w-[75%]">
              <span className="bg-emerald-100 text-emerald-900 font-mono text-[10px] font-bold px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                <Coffee className="w-3 h-3 text-emerald-700" />
                CAMPUS CIRCULAR VAULT
              </span>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                Redeem Nescafe & Mess Coupons
              </h2>
              <p className="text-xs text-slate-500 leading-snug">
                Trade your tokens for coffee, parathas, or donate to Uttarakhand flood relief.
              </p>
            </div>

            <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-800 flex-shrink-0 group-hover:bg-emerald-100 transition-colors">
              <Coffee className="w-6 h-6 text-emerald-700" />
            </div>
          </div>

          <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-emerald-800">
            <span className="font-mono text-[11px]">Instant Digital Code • 1 Token = ₹0.50</span>
            <span className="flex items-center gap-1">
              Open Food Pass <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>

      </div>

      {/* 3. RECENT REPORT TICKET (IF ANY) */}
      {recentComplaints.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-2.5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-800">
              <Clock className="w-3.5 h-3.5 text-blue-600" />
              <span>Your Active Issue Status</span>
            </div>
            <span className="text-[10px] font-mono text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
              Ticket Live
            </span>
          </div>

          {recentComplaints.map(c => (
            <div key={c.id} className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-900">{c.locationText}</span>
                <span className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded ${
                  c.status === 'resolved' 
                    ? 'bg-emerald-100 text-emerald-800' 
                    : c.status === 'assigned'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-amber-100 text-amber-800'
                }`}>
                  {c.status.toUpperCase()}
                </span>
              </div>
              <p className="text-slate-600 text-[11px] line-clamp-1">{c.issueType}</p>
              
              {c.verificationStatus === 'verified_legitimate' && (
                <div className="text-[11px] text-emerald-800 font-medium flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Issue verified by Squad #2! +35 EcoTokens credited to you.</span>
                </div>
              )}
              {c.verificationStatus === 'reported_false' && (
                <div className="text-[11px] text-rose-800 font-medium flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
                  <span>False report verified clean. -25 tokens deducted.</span>
                </div>
              )}
              {!c.verificationStatus && (
                <div className="text-[11px] text-slate-500">
                  Assigned to Ramesh Kumar (Squad #2) • +35 tokens on verification
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* 4. NEAREST BINS GLANCE (CLEAN & MINIMALIST) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <div>
            <h3 className="font-semibold text-slate-900 text-xs">
              Nearest Govind Bhawan Bins
            </h3>
            <p className="text-[11px] text-slate-400">Live fill percentage near your wing</p>
          </div>

          <button
            type="button"
            onClick={onOpenQrScanner}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-medium transition-colors"
          >
            <QrCode className="w-3 h-3" />
            <span>Scan Bin QR</span>
          </button>
        </div>

        <div className="space-y-2">
          {nearestBins.map(bin => {
            const isFull = bin.fillLevel >= 75;
            return (
              <div 
                key={bin.id}
                className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono font-bold text-slate-900 text-[11px]">#{bin.id}</span>
                    <span className="text-slate-700 font-medium">{bin.locationDetail}</span>
                  </div>
                  
                  {/* Clean Visual Progress Gauge */}
                  <div className="flex items-center gap-2">
                    <div className="w-24 bg-slate-200 h-1.5 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${
                          isFull ? 'bg-rose-500' : bin.fillLevel > 50 ? 'bg-amber-500' : 'bg-emerald-500'
                        }`}
                        style={{ width: `${bin.fillLevel}%` }}
                      />
                    </div>
                    <span className="font-mono text-[10px] text-slate-500 font-semibold">{bin.fillLevel}%</span>
                  </div>
                </div>

                <div>
                  {isFull ? (
                    <button
                      type="button"
                      onClick={onOpenReportModal}
                      className="px-2.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-medium text-[11px] transition-colors shadow-xs"
                    >
                      Report Full
                    </button>
                  ) : (
                    <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      Space Ready
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center pt-1">
          <button
            type="button"
            onClick={() => onNavigateTab('all_bins')}
            className="text-[11px] text-blue-600 hover:text-blue-800 font-medium inline-flex items-center gap-1"
          >
            Looking for a specific bin? View all 200 bins & search →
          </button>
        </div>
      </div>

      {/* 5. QUICK RE-USE MARKETPLACE TEASER */}
      <div 
        onClick={() => onNavigateTab('marketplace')}
        className="bg-slate-100 hover:bg-slate-200/70 border border-slate-200 rounded-2xl p-4 flex items-center justify-between cursor-pointer transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-800 shadow-xs">
            📚
          </div>
          <div>
            <div className="font-semibold text-slate-900 text-xs">Govind Hostel Re-Use Bazaar</div>
            <div className="text-[11px] text-slate-500">Books, kettles, skates & mini-drafters up for trade</div>
          </div>
        </div>
        <ChevronRight className="w-4 h-4 text-slate-400" />
      </div>

    </div>
  );
}
