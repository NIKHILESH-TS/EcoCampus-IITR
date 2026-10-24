import React, { useState, useEffect } from 'react';
import { 
  Camera, 
  AlertCircle, 
  Coffee, 
  ChevronRight, 
  CheckCircle2, 
  Clock, 
  ArrowRight, 
  MapPin, 
  Coins,
  QrCode,
  Leaf,
  Scale,
  Zap,
  ShoppingBag,
  HeartHandshake,
  Mic,
  Award
} from 'lucide-react';
import { db } from '../../services/db';
import { WasteBadge } from '../Common/Badges';

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
  const [featuredMarketItems, setFeaturedMarketItems] = useState([]);

  useEffect(() => {
    loadData();
    window.addEventListener('ecocampus_db_change', loadData);
    return () => window.removeEventListener('ecocampus_db_change', loadData);
  }, []);

  const loadData = () => {
    setUser(db.getCurrentUser());
    setVault(db.getVault());
    
    const all = db.getBins();
    setNearestBins(all.slice(0, 3));

    const comps = db.getComplaints().slice(0, 2);
    setRecentComplaints(comps);

    const market = db.getMarketplaceItems().filter(i => i.status === 'available').slice(0, 2);
    setFeaturedMarketItems(market);
  };

  const inrValue = Math.round(user.ecoPointsBalance * (vault.exchangeRateInrPerToken || 0.50));

  return (
    <div className="space-y-6 pb-6 font-sans">
      
      {/* 1. CLEAN EXECUTIVE HEADER: Apple/Linear Surface */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/90 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.04)]">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          
          {/* Left: Clean Identity & Context */}
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <MapPin className="w-3.5 h-3.5 text-emerald-600" />
              <span className="font-medium text-slate-700">Govind Bhawan • Room 214</span>
              <span className="text-slate-300">•</span>
              <span className="hidden sm:inline">Wing B Beat</span>
            </div>
            
            <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-slate-900">
              Welcome back, {user.name.split(' ')[0]}
            </h1>
            
            <p className="text-xs sm:text-sm text-slate-500 max-w-xl leading-relaxed">
              Classify waste with edge computer vision, report bin overflows for rapid dispatch, and redeem tokens at campus canteens.
            </p>
          </div>

          {/* Right: Key Metrics & Wallet Pass */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3">
            
            {/* Desktop Metrics Strip */}
            <div className="hidden xl:flex items-center gap-5 bg-slate-50 px-4 py-3 rounded-xl border border-slate-200/70 text-xs">
              <div>
                <div className="text-[11px] text-slate-400">Diversion Rate</div>
                <div className="font-mono font-semibold text-slate-900 text-sm mt-0.5">73.4%</div>
              </div>
              <div className="h-6 w-px bg-slate-200" />
              <div>
                <div className="text-[11px] text-slate-400">CO₂ Avoided</div>
                <div className="font-mono font-semibold text-slate-900 text-sm mt-0.5">384 T/yr</div>
              </div>
              <div className="h-6 w-px bg-slate-200" />
              <div>
                <div className="text-[11px] text-slate-400">Vault Treasury</div>
                <div className="font-mono font-semibold text-emerald-700 text-sm mt-0.5">₹{(vault.totalCashInr / 1000).toFixed(0)}k</div>
              </div>
            </div>

            {/* Clean Wallet Pass Button */}
            <button
              type="button"
              onClick={() => onNavigateTab('rewards')}
              className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-white px-4 py-3 rounded-xl text-left transition-all cursor-pointer flex items-center justify-between gap-4 min-w-[200px]"
            >
              <div>
                <div className="text-[10px] text-slate-400 font-mono uppercase tracking-wider">EcoToken Balance</div>
                <div className="font-mono font-semibold text-xl text-white flex items-center gap-1.5 mt-0.5">
                  <Coins className="w-4 h-4 text-emerald-400" />
                  <span>{user.ecoPointsBalance}</span>
                  <span className="text-xs text-slate-400 font-sans font-normal">≈ ₹{inrValue}</span>
                </div>
              </div>
              <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center">
                <ChevronRight className="w-4 h-4 text-slate-300" />
              </div>
            </button>

          </div>

        </div>
      </div>

      {/* 2. PRIMARY ACTION CARDS: Clean 3-Column MNC Surface Architecture */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
        
        {/* Action 1: AI Waste Scanner */}
        <div 
          onClick={() => onNavigateTab('ai_classifier')}
          className="bg-white hover:border-slate-300 border border-slate-200/90 rounded-2xl p-5 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.04)] transition-all cursor-pointer flex flex-col justify-between group"
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200/60 flex items-center justify-center text-emerald-700">
                <Camera className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-mono font-medium text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                MobileNetV3 • Voice
              </span>
            </div>

            <div>
              <h3 className="text-base font-semibold tracking-tight text-slate-900">
                Scan Waste to Segregate
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Identify any item via camera or bilingual voice assistant for instant 4-way bin disposal guidance.
              </p>
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-medium text-slate-900">
            <span>Open AI Scanner</span>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-slate-900 group-hover:translate-x-0.5 transition-all" />
          </div>
        </div>

        {/* Action 2: Quick Bin Issue Report */}
        <div 
          onClick={onOpenReportModal}
          className="bg-white hover:border-slate-300 border border-slate-200/90 rounded-2xl p-5 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.04)] transition-all cursor-pointer flex flex-col justify-between group"
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200/60 flex items-center justify-center text-amber-700">
                <AlertCircle className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-mono font-medium text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full">
                +35 Tokens on Verify
              </span>
            </div>

            <div>
              <h3 className="text-base font-semibold tracking-tight text-slate-900">
                Report Bin Overflow or Issue
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Log overflowing or damaged hostel bins in two taps. Routes Field Squad #2 with anti-spam verification.
              </p>
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-medium text-slate-900">
            <span>Report Issue</span>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-slate-900 group-hover:translate-x-0.5 transition-all" />
          </div>
        </div>

        {/* Action 3: Canteen & Nescafe Pass */}
        <div 
          onClick={() => onNavigateTab('rewards')}
          className="bg-white hover:border-slate-300 border border-slate-200/90 rounded-2xl p-5 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.04)] transition-all cursor-pointer flex flex-col justify-between group"
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200/60 flex items-center justify-center text-slate-800">
                <Coffee className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-mono font-medium text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded-full">
                1 Token = ₹0.50
              </span>
            </div>

            <div>
              <h3 className="text-base font-semibold tracking-tight text-slate-900">
                Redeem Canteen Vouchers
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Convert EcoTokens into Nescafe coffee passes, night mess coupons, or donate to flood relief.
              </p>
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-medium text-slate-900">
            <span>Open Canteen Pass</span>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-slate-900 group-hover:translate-x-0.5 transition-all" />
          </div>
        </div>

      </div>

      {/* 3. ADAPTIVE 2-COLUMN WORKSPACE:
          - Mobile: Clean Nearest Bins & Active Tickets
          - Desktop (lg:): Full 12-Col Split with Empirical Campus Analytics
      */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN (7 Cols on PC) */}
        <div className="lg:col-span-7 space-y-5">
          
          {/* Active Issue Verification Status */}
          {recentComplaints.length > 0 && (
            <div className="bg-white rounded-2xl border border-slate-200/90 p-5 space-y-3 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.04)]">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-900">
                  <Clock className="w-4 h-4 text-slate-500" />
                  <span>Recent Dispatch & Verification Status</span>
                </div>
                <span className="text-[11px] font-mono text-slate-500">
                  Live SLA Tracker
                </span>
              </div>

              {recentComplaints.map(c => (
                <div key={c.id} className="p-3.5 bg-slate-50/70 rounded-xl border border-slate-200/70 text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-900">{c.locationText}</span>
                    <span className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded-md ${
                      c.status === 'resolved' 
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                        : c.status === 'assigned'
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}>
                      {c.status.toUpperCase()}
                    </span>
                  </div>
                  
                  <p className="text-slate-500 text-[11px]">{c.issueType}</p>
                  
                  {c.verificationStatus === 'verified_legitimate' && (
                    <div className="text-[11px] text-emerald-800 font-medium flex items-center gap-1.5 bg-emerald-50/60 p-2 rounded-lg border border-emerald-200/70">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                      <span>Verified & cleaned by Squad #2. +35 EcoTokens credited.</span>
                    </div>
                  )}
                  {c.verificationStatus === 'reported_false' && (
                    <div className="text-[11px] text-rose-800 font-medium flex items-center gap-1.5 bg-rose-50/60 p-2 rounded-lg border border-rose-200/70">
                      <AlertCircle className="w-3.5 h-3.5 text-rose-600 flex-shrink-0" />
                      <span>Marked false alarm by inspector. -25 EcoTokens deducted.</span>
                    </div>
                  )}
                  {!c.verificationStatus && (
                    <div className="text-[11px] text-slate-500 flex items-center justify-between pt-1 border-t border-slate-200/60">
                      <span>Assigned: Ramesh Kumar (Squad #2)</span>
                      <span className="font-mono text-emerald-700 font-medium">+35 Tokens on Verify</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Nearest Govind Bhawan Bins */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 space-y-3.5 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.04)]">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-semibold text-slate-900 text-sm">
                  Nearby Hostel Bins (Govind Bhawan)
                </h3>
                <p className="text-xs text-slate-500">Real-time ultrasonic fill & load-cell weight</p>
              </div>

              <button
                type="button"
                onClick={onOpenQrScanner}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200/80 text-slate-800 text-xs font-medium transition-colors cursor-pointer"
              >
                <QrCode className="w-3.5 h-3.5" />
                <span>Scan Bin QR</span>
              </button>
            </div>

            <div className="space-y-2.5">
              {nearestBins.map(bin => {
                const isFull = bin.fillLevel >= 75;
                const estimatedWeight = bin.weightKg || (bin.fillLevel * 0.32 + 2.4).toFixed(1);

                return (
                  <div 
                    key={bin.id}
                    className="p-3.5 bg-slate-50/60 rounded-xl border border-slate-200/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs hover:bg-slate-50 transition-colors"
                  >
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-semibold text-slate-900 text-xs">#{bin.id}</span>
                        <span className="text-slate-700 font-medium">{bin.locationDetail}</span>
                        <WasteBadge category={bin.category} />
                      </div>
                      
                      <div className="flex items-center gap-3 text-[11px] text-slate-500 font-mono">
                        <span>Fill: <strong className="text-slate-900">{bin.fillLevel}%</strong></span>
                        <span>•</span>
                        <span>Weight: <strong className="text-slate-900">{estimatedWeight} kg</strong></span>
                        <span>•</span>
                        <span>Next Shift: {bin.nextShiftTime}</span>
                      </div>

                      <div className="w-full sm:w-56 bg-slate-200/80 h-1.5 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-300 ${
                            isFull ? 'bg-rose-500' : bin.fillLevel > 50 ? 'bg-amber-500' : 'bg-emerald-600'
                          }`}
                          style={{ width: `${bin.fillLevel}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex items-center sm:flex-col justify-end gap-2">
                      {isFull ? (
                        <button
                          type="button"
                          onClick={onOpenReportModal}
                          className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs transition-colors cursor-pointer"
                        >
                          Report Overfill
                        </button>
                      ) : (
                        <span className="text-[11px] font-mono text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-2.5 py-0.5 rounded-md font-medium">
                          Available
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-400">200 sensor-equipped bins active in pilot</span>
              <button
                type="button"
                onClick={() => onNavigateTab('all_bins')}
                className="text-slate-900 hover:text-emerald-700 font-medium inline-flex items-center gap-1 cursor-pointer"
              >
                <span>Explore all 200 bins</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Hostel Re-Use Exchange Preview */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 space-y-3.5 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.04)]">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-slate-700" />
                <h4 className="font-semibold text-slate-900 text-sm">Hostel Peer-to-Peer Re-Use Exchange</h4>
              </div>
              <button
                type="button"
                onClick={() => onNavigateTab('marketplace')}
                className="text-xs text-slate-600 hover:text-slate-900 font-medium inline-flex items-center gap-1 cursor-pointer"
              >
                <span>Browse Catalog</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {featuredMarketItems.map(item => (
                <div 
                  key={item.id}
                  onClick={() => onNavigateTab('marketplace')}
                  className="p-3 rounded-xl border border-slate-200/70 bg-slate-50/50 hover:bg-slate-100/70 transition-colors flex items-center justify-between cursor-pointer"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img src={item.photoUrl} alt={item.title} className="w-11 h-11 rounded-lg object-cover border border-slate-200 flex-shrink-0" />
                    <div className="min-w-0">
                      <div className="font-semibold text-slate-900 truncate">{item.title}</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">{item.sellerRoom}</div>
                    </div>
                  </div>
                  <span className="font-mono font-semibold text-xs bg-white border border-slate-200 text-slate-900 px-2.5 py-1 rounded-lg ml-2 whitespace-nowrap">
                    {item.isFree ? 'Free' : `${item.ecoPointsPrice} Pts`}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: PC-Only Empirical Analytics & Vault Treasury (5 Cols on PC, Hidden on Mobile) */}
        <div className="hidden lg:block lg:col-span-5 space-y-5">
          
          {/* Card 1: Campus Waste Stream Analytics */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 space-y-4 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.04)]">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h4 className="font-semibold text-slate-900 text-sm">
                  Campus Waste Stream Telemetry
                </h4>
                <p className="text-xs text-slate-500">Empirical IIT Roorkee benchmark</p>
              </div>
              <div className="text-right">
                <span className="font-mono font-semibold text-slate-900 text-sm">5,500 kg/day</span>
                <span className="text-[11px] text-emerald-700 block font-medium">73.4% Diverted</span>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              {[
                { label: 'Organic & Mess Food (Biogas)', kg: '1,676 kg', pct: 30.5, color: 'bg-emerald-600' },
                { label: 'Paper & Cardboard (ITC Baled)', kg: '1,580 kg', pct: 28.7, color: 'bg-slate-800' },
                { label: 'Plastic & PET Polymers', kg: '613 kg', pct: 11.1, color: 'bg-blue-600' },
                { label: 'Garden Foliage (Briquetting)', kg: '569 kg', pct: 10.3, color: 'bg-amber-500' },
                { label: 'Inert Municipal Residual', kg: '595 kg', pct: 10.8, color: 'bg-slate-300' }
              ].map((stream, i) => (
                <div key={i} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-600">{stream.label}</span>
                    <span className="font-mono font-medium text-slate-900">{stream.kg} ({stream.pct}%)</span>
                  </div>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div className={`${stream.color} h-full rounded-full`} style={{ width: `${stream.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Card 2: Circular Vault Treasury Partition */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 space-y-4 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.04)]">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h4 className="font-semibold text-slate-900 text-sm">
                  Circular Vault Allocation
                </h4>
                <p className="text-xs text-slate-500">Funded by B2B recyclable tenders</p>
              </div>
              <div className="text-right">
                <span className="font-mono font-semibold text-emerald-700 text-base">₹{vault.totalCashInr.toLocaleString()}</span>
                <span className="text-[10px] text-slate-400 block font-mono">LIQUID POOL</span>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              {[
                { title: 'Student Canteen Subsidies', share: '30%', amount: Math.round(vault.totalCashInr * 0.30), icon: Coffee },
                { title: 'Sanitation Crew UPI Bonus', share: '30%', amount: Math.round(vault.totalCashInr * 0.30), icon: Zap },
                { title: 'IoT Sensor & Baler Upkeep', share: '25%', amount: Math.round(vault.totalCashInr * 0.25), icon: Scale },
                { title: 'NSS Uttarakhand Flood Relief', share: '15%', amount: Math.round(vault.totalCashInr * 0.15), icon: HeartHandshake }
              ].map((pool, idx) => {
                const Icon = pool.icon;
                return (
                  <div key={idx} className="p-3 bg-slate-50/70 rounded-xl border border-slate-200/60 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <Icon className="w-4 h-4 text-slate-600" />
                      <div>
                        <div className="font-medium text-slate-900">{pool.title}</div>
                        <div className="text-[11px] text-slate-400">Allocation: {pool.share}</div>
                      </div>
                    </div>
                    <div className="font-mono font-semibold text-slate-900">
                      ₹{pool.amount.toLocaleString()}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Card 3: Hostel Leaderboard Standing */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-4.5 flex items-center justify-between text-xs shadow-[0_2px_10px_-3px_rgba(0,0,0,0.04)]">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-900 flex items-center justify-center font-mono font-bold text-xs">
                #1
              </div>
              <div>
                <div className="font-semibold text-slate-900">Govind Bhawan Leads Campus</div>
                <div className="text-[11px] text-slate-500">96.4% Segregation Purity • 420 kg Diverted</div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => onNavigateTab('leaderboard')}
              className="text-xs font-medium text-slate-700 hover:text-slate-900 underline underline-offset-4 cursor-pointer"
            >
              Standings
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}
