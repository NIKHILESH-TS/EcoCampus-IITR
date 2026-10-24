import React, { useState, useEffect } from 'react';
import { 
  Camera, 
  AlertCircle, 
  Coffee, 
  ArrowRight, 
  MapPin, 
  Coins,
  QrCode,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { db } from '../../services/db';
import { WasteBadge } from '../Common/Badges';

export default function StudentHomeHub({ 
  onNavigateTab, 
  onOpenReportModal, 
  onOpenQrScanner 
}) {
  const [user, setUser] = useState(db.getCurrentUser());
  const [vault, setVault] = useState(db.getVault());
  const [recentComplaint, setRecentComplaint] = useState(null);
  const [nearestBins, setNearestBins] = useState([]);

  useEffect(() => {
    loadData();
    window.addEventListener('ecocampus_db_change', loadData);
    return () => window.removeEventListener('ecocampus_db_change', loadData);
  }, []);

  const loadData = () => {
    setUser(db.getCurrentUser());
    setVault(db.getVault());
    setNearestBins(db.getBins().slice(0, 3));
    const comps = db.getComplaints();
    setRecentComplaint(comps.length > 0 ? comps[0] : null);
  };

  const inrValue = Math.round(user.ecoPointsBalance * (vault.exchangeRateInrPerToken || 0.50));

  return (
    <div className="space-y-8 pb-8 font-sans">
      
      {/* 1. Calm Minimalist Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
            <MapPin className="w-3.5 h-3.5 text-emerald-600" />
            <span>Govind Bhawan · Room 214</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900">
            Hello, {user.name.split(' ')[0]}
          </h1>
        </div>

        {/* Clean Token Wallet Pill */}
        <button
          type="button"
          onClick={() => onNavigateTab('rewards')}
          className="self-start sm:self-auto flex items-center gap-3.5 bg-white hover:bg-slate-50 border border-slate-200/90 px-4 py-2.5 rounded-2xl shadow-2xs transition-all cursor-pointer"
        >
          <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
            <Coins className="w-4 h-4" />
          </div>
          <div className="text-left pr-1">
            <div className="text-[11px] text-slate-400 font-medium">Available Balance</div>
            <div className="flex items-baseline gap-1.5">
              <span className="font-mono font-semibold text-base text-slate-900">
                {user.ecoPointsBalance} Tokens
              </span>
              <span className="text-xs text-emerald-600 font-medium">
                (₹{inrValue})
              </span>
            </div>
          </div>
        </button>
      </div>

      {/* 2. Primary Actions (3 Clean Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
        
        {/* Card 1: AI Waste Scanner */}
        <button
          type="button"
          onClick={() => onNavigateTab('ai_classifier')}
          className="text-left bg-white hover:border-slate-300 border border-slate-200/80 rounded-2xl p-6 shadow-2xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
        >
          <div className="space-y-4">
            <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-slate-900 tracking-tight">
                AI Waste Scanner
              </h2>
              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                Identify any item with camera or Hindi/English voice for instant bin guidance.
              </p>
            </div>
          </div>

          <div className="mt-6 flex items-center gap-1.5 text-xs font-semibold text-emerald-600">
            <span>Scan item</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </button>

        {/* Card 2: Quick Bin Report */}
        <button
          type="button"
          onClick={onOpenReportModal}
          className="text-left bg-white hover:border-slate-300 border border-slate-200/80 rounded-2xl p-6 shadow-2xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
        >
          <div className="space-y-4">
            <div className="w-11 h-11 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-slate-900 tracking-tight">
                Report Bin Issue
              </h2>
              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                Spot an overflowing or damaged bin? Dispatch Field Squad #2 and earn +35 tokens.
              </p>
            </div>
          </div>

          <div className="mt-6 flex items-center gap-1.5 text-xs font-semibold text-slate-900">
            <span>Report in 2 taps</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </button>

        {/* Card 3: Canteen Pass */}
        <button
          type="button"
          onClick={() => onNavigateTab('rewards')}
          className="text-left bg-white hover:border-slate-300 border border-slate-200/80 rounded-2xl p-6 shadow-2xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
        >
          <div className="space-y-4">
            <div className="w-11 h-11 rounded-2xl bg-slate-100 text-slate-800 flex items-center justify-center">
              <Coffee className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-slate-900 tracking-tight">
                Canteen & Nescafe Pass
              </h2>
              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                Redeem your EcoTokens for coffee vouchers, night mess meals, or flood relief.
              </p>
            </div>
          </div>

          <div className="mt-6 flex items-center gap-1.5 text-xs font-semibold text-slate-900">
            <span>Redeem tokens</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </button>

      </div>

      {/* 3. Single Active Ticket Bar (Only if a complaint exists) */}
      {recentComplaint && (
        <div className="bg-white rounded-2xl border border-slate-200/80 px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs text-xs">
          <div className="flex items-center gap-3">
            {recentComplaint.verificationStatus === 'verified_legitimate' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            ) : (
              <Clock className="w-4 h-4 text-amber-600 flex-shrink-0" />
            )}
            <div>
              <span className="font-semibold text-slate-900">
                Latest Report: {recentComplaint.locationText}
              </span>
              <span className="text-slate-400 mx-2">·</span>
              <span className="text-slate-500">{recentComplaint.issueType}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            {recentComplaint.verificationStatus === 'verified_legitimate' ? (
              <span className="text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg font-medium">
                Verified · +35 Tokens Credited
              </span>
            ) : recentComplaint.verificationStatus === 'reported_false' ? (
              <span className="text-rose-700 bg-rose-50 px-2.5 py-1 rounded-lg font-medium">
                False Alarm · -25 Tokens
              </span>
            ) : (
              <span className="text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg font-medium">
                Squad #2 Assigned
              </span>
            )}
          </div>
        </div>
      )}

      {/* 4. Nearby Bins (Clean 3-Card Grid) */}
      <div className="space-y-3.5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-slate-900">
              Nearby Bins
            </h3>
          </div>
          <button
            type="button"
            onClick={onOpenQrScanner}
            className="text-xs text-slate-600 hover:text-slate-900 font-medium flex items-center gap-1.5 cursor-pointer"
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>Scan Bin QR</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {nearestBins.map(bin => {
            const isFull = bin.fillLevel >= 75;
            const weight = bin.weightKg || (bin.fillLevel * 0.32 + 2.4).toFixed(1);

            return (
              <div 
                key={bin.id}
                className="bg-white rounded-2xl border border-slate-200/80 p-5 space-y-4 shadow-2xs flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-semibold text-slate-900 text-xs">
                      #{bin.id}
                    </span>
                    <WasteBadge category={bin.category} />
                  </div>

                  <div>
                    <div className="font-medium text-slate-900 text-xs">
                      {bin.locationDetail}
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      Next shift: {bin.nextShiftTime}
                    </div>
                  </div>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <div className="flex justify-between text-[11px] font-mono text-slate-500">
                    <span>{bin.fillLevel}% full</span>
                    <span>{weight} kg</span>
                  </div>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all ${
                        isFull ? 'bg-rose-500' : bin.fillLevel > 50 ? 'bg-amber-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${bin.fillLevel}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
