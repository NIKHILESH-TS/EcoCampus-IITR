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
  BarChart3,
  TrendingUp,
  Leaf,
  Scale,
  Zap,
  ShoppingBag,
  Award,
  HeartHandshake
} from 'lucide-react';
import { db } from '../../services/db';
import { IITR_CAMPUS_BENCHMARKS } from '../../data/iitrCampusData';
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
    
    // Top 3 nearest bins in Govind Bhawan Wing B
    const all = db.getBins();
    setNearestBins(all.slice(0, 3));

    // Get recent student complaints for ticket tracking
    const comps = db.getComplaints().slice(0, 2);
    setRecentComplaints(comps);

    // Get 2 featured marketplace items for preview
    const market = db.getMarketplaceItems().filter(i => i.status === 'available').slice(0, 2);
    setFeaturedMarketItems(market);
  };

  const inrValue = Math.round(user.ecoPointsBalance * (vault.exchangeRateInrPerToken || 0.50));

  return (
    <div className="space-y-6 pb-6 font-sans">
      
      {/* 1. ADAPTIVE HERO: Mobile Compact Greeting vs Desktop Rich Header */}
      <div className="bg-slate-900 text-white rounded-2xl p-5 sm:p-6 border border-slate-800 shadow-sm relative overflow-hidden">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          
          {/* Left: User Welcome & Hostel Info */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="bg-emerald-500/20 text-emerald-300 font-mono text-[10px] sm:text-[11px] font-bold px-2 py-0.5 rounded border border-emerald-500/30 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-emerald-400" />
                GOVIND BHAWAN • ROOM 214
              </span>
              <span className="bg-slate-800 text-slate-300 font-mono text-[10px] px-2 py-0.5 rounded hidden sm:inline">
                Wing B Floor 2 Beat
              </span>
            </div>
            
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <span>Hey {user.name.split(' ')[0]} 👋</span>
              <span className="text-xs font-normal text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded-full hidden md:inline-flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                Active Campus Contributor
              </span>
            </h1>
            
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
              Throw waste cleanly, report overfilled bins, and convert your EcoTokens into instant Nescafe coffee vouchers backed by IIT Roorkee's scrap circular economy.
            </p>
          </div>

          {/* Right: Quick EcoToken Pass + Desktop Live Stats Strip */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3">
            
            {/* Desktop-Only Mini Stats Bar */}
            <div className="hidden xl:flex items-center gap-3 bg-slate-800/70 p-3 rounded-xl border border-slate-700/80 text-xs">
              <div className="space-y-0.5 pr-3 border-r border-slate-700">
                <div className="text-[10px] text-slate-400">Campus Diversion</div>
                <div className="font-mono font-bold text-emerald-400 text-sm">73.4%</div>
              </div>
              <div className="space-y-0.5 pr-3 border-r border-slate-700">
                <div className="text-[10px] text-slate-400">CO₂ Avoided/Yr</div>
                <div className="font-mono font-bold text-blue-400 text-sm">384 T</div>
              </div>
              <div className="space-y-0.5">
                <div className="text-[10px] text-slate-400">Circular Vault</div>
                <div className="font-mono font-bold text-amber-300 text-sm">₹149k</div>
              </div>
            </div>

            {/* Tap-to-Redeem Wallet Card */}
            <button
              type="button"
              onClick={() => onNavigateTab('rewards')}
              className="w-full sm:w-auto bg-gradient-to-br from-slate-800 to-slate-800/90 hover:from-slate-750 hover:to-slate-800 border border-slate-700 p-3.5 rounded-xl text-right transition-all active:scale-95 cursor-pointer shadow-xs min-w-[190px]"
            >
              <div className="flex items-center justify-between gap-2 text-[10px] text-slate-400 font-mono uppercase tracking-wider mb-0.5">
                <span>Wallet Balance</span>
                <span className="text-emerald-400 font-bold">1 Token = ₹0.50</span>
              </div>
              
              <div className="font-mono font-bold text-2xl text-emerald-400 flex items-center justify-end gap-1.5">
                <Coins className="w-5 h-5 text-emerald-400" />
                <span>{user.ecoPointsBalance}</span>
                <span className="text-xs text-slate-400 font-sans font-normal">Pts</span>
              </div>
              
              <div className="text-[11px] text-emerald-300 font-medium mt-0.5 flex items-center justify-end gap-1">
                <span>Worth ≈ ₹{inrValue} Nescafe Pass</span>
                <ChevronRight className="w-3.5 h-3.5 text-emerald-400" />
              </div>
            </button>

          </div>

        </div>

        {/* Ambient background glow */}
        <div className="absolute -bottom-12 -right-12 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* 2. THE 3 CORE ACTION TARGETS: Stacks on mobile, 3-column horizontal grid on desktop */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
        
        {/* ACTION 1: Throw Waste / AI Camera Scan */}
        <div 
          onClick={() => onNavigateTab('ai_classifier')}
          className="bg-gradient-to-br from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white rounded-2xl p-5 shadow-xs transition-all active:scale-98 cursor-pointer flex flex-col justify-between group relative overflow-hidden min-h-[170px]"
        >
          <div>
            <div className="flex items-center justify-between gap-2 mb-2.5">
              <span className="bg-white/20 text-white font-mono text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-300" />
                AI CAMERA & BILINGUAL VOICE
              </span>
              <div className="w-8 h-8 rounded-xl bg-white/15 flex items-center justify-center text-white group-hover:scale-105 transition-transform">
                <Camera className="w-4 h-4 text-white" />
              </div>
            </div>

            <h3 className="text-base sm:text-lg font-bold tracking-tight text-white leading-tight">
              Scan Waste to Throw
            </h3>
            
            <p className="text-xs text-emerald-100 mt-1.5 leading-relaxed">
              Unsure which bin to use? Snap a photo or ask in Hindi/English to classify into the 4 campus streams.
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-white/20 flex items-center justify-between text-xs font-semibold text-emerald-50">
            <span>MobileNetV3 Edge Scan</span>
            <span className="flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              Start Scan <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>

        {/* ACTION 2: Report Full or Broken Bin */}
        <div 
          onClick={onOpenReportModal}
          className="bg-white hover:bg-slate-50/80 border border-slate-200 rounded-2xl p-5 shadow-xs transition-all active:scale-98 cursor-pointer flex flex-col justify-between group min-h-[170px]"
        >
          <div>
            <div className="flex items-center justify-between gap-2 mb-2.5">
              <span className="bg-amber-50 text-amber-900 border border-amber-200 font-mono text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                <AlertCircle className="w-3 h-3 text-amber-700" />
                SLA DISPATCH • +35 TOKENS
              </span>
              <div className="w-8 h-8 rounded-xl bg-amber-100/70 flex items-center justify-center text-amber-800 group-hover:scale-105 transition-transform">
                <AlertCircle className="w-4 h-4 text-amber-700" />
              </div>
            </div>

            <h3 className="text-base sm:text-lg font-bold tracking-tight text-slate-900 leading-tight">
              Report a Full / Broken Bin
            </h3>
            
            <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
              Hostel bin overflowing or smelling? 2-tap photo report. Squad #2 is routed immediately for clearance.
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-800">
            <span className="text-[11px] text-slate-400 font-normal">Spam penalty: -25 pts</span>
            <span className="text-amber-800 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              Report Issue <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>

        {/* ACTION 3: Canteen & Nescafe Food Pass */}
        <div 
          onClick={() => onNavigateTab('rewards')}
          className="bg-white hover:bg-slate-50/80 border border-slate-200 rounded-2xl p-5 shadow-xs transition-all active:scale-98 cursor-pointer flex flex-col justify-between group min-h-[170px]"
        >
          <div>
            <div className="flex items-center justify-between gap-2 mb-2.5">
              <span className="bg-emerald-50 text-emerald-900 border border-emerald-200 font-mono text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                <Coffee className="w-3 h-3 text-emerald-700" />
                CAMPUS CIRCULAR VAULT
              </span>
              <div className="w-8 h-8 rounded-xl bg-emerald-100/70 flex items-center justify-center text-emerald-800 group-hover:scale-105 transition-transform">
                <Coffee className="w-4 h-4 text-emerald-700" />
              </div>
            </div>

            <h3 className="text-base sm:text-lg font-bold tracking-tight text-slate-900 leading-tight">
              Redeem Canteen Coupons
            </h3>
            
            <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
              Exchange tokens for espresso at Nescafe, night mess meals, or donate to Uttarakhand flood relief.
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-emerald-800">
            <span className="font-mono text-[11px] text-slate-500 font-normal">Instant digital coupon code</span>
            <span className="flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              Open Pass <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>

      </div>

      {/* 3. RESPONSIVE SPLIT: 
          - On Mobile: Shows Nearest Bins & Active Tickets only (Clean, no clutter).
          - On Desktop (lg:): Shows 2-column layout with Advanced Campus Circular Analytics & ESG Telemetry! 
      */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: Local Hostel Actions, Nearest Bins & Active Tickets (7 Cols on PC) */}
        <div className="lg:col-span-7 space-y-5">
          
          {/* Active Ticket Status (If Any) */}
          {recentComplaints.length > 0 && (
            <div className="bg-white rounded-2xl border border-slate-200 p-4.5 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                  <Clock className="w-4 h-4 text-blue-600" />
                  <span>Your Active Ticket Status</span>
                </div>
                <span className="text-[10px] font-mono text-blue-700 bg-blue-50 px-2 py-0.5 rounded font-semibold border border-blue-200">
                  Live Dispatch
                </span>
              </div>

              {recentComplaints.map(c => (
                <div key={c.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-900 text-xs">{c.locationText}</span>
                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                      c.status === 'resolved' 
                        ? 'bg-emerald-100 text-emerald-800' 
                        : c.status === 'assigned'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {c.status.toUpperCase()}
                    </span>
                  </div>
                  
                  <p className="text-slate-600 text-[11px]">{c.issueType}</p>
                  
                  {c.verificationStatus === 'verified_legitimate' && (
                    <div className="text-[11px] text-emerald-800 font-medium flex items-center gap-1.5 bg-emerald-50/80 p-2 rounded-lg border border-emerald-200">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                      <span>Squad #2 verified & cleared. +35 EcoTokens added to your balance!</span>
                    </div>
                  )}
                  {c.verificationStatus === 'reported_false' && (
                    <div className="text-[11px] text-rose-800 font-medium flex items-center gap-1.5 bg-rose-50/80 p-2 rounded-lg border border-rose-200">
                      <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                      <span>Inspected by worker: Bin was clean. -25 EcoTokens anti-spam penalty applied.</span>
                    </div>
                  )}
                  {!c.verificationStatus && (
                    <div className="text-[11px] text-slate-500 flex items-center justify-between pt-1 border-t border-slate-200/60">
                      <span>Assigned to Ramesh Kumar (Squad #2)</span>
                      <span className="font-mono text-emerald-700 font-semibold">+35 Tokens Pending</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Nearest Govind Bhawan Bins & Quick Gauge */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4.5 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <div>
                <h3 className="font-bold text-slate-900 text-xs sm:text-sm">
                  Nearest Govind Bhawan Bins
                </h3>
                <p className="text-[11px] text-slate-400">Live fill level and weight near your wing</p>
              </div>

              <button
                type="button"
                onClick={onOpenQrScanner}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium transition-colors cursor-pointer"
              >
                <QrCode className="w-3.5 h-3.5" />
                <span>Scan QR</span>
              </button>
            </div>

            <div className="space-y-2.5">
              {nearestBins.map(bin => {
                const isFull = bin.fillLevel >= 75;
                const estimatedWeight = bin.weightKg || (bin.fillLevel * 0.32 + 2.4).toFixed(1);

                return (
                  <div 
                    key={bin.id}
                    className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs hover:bg-slate-100/60 transition-colors"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-slate-900 text-xs">#{bin.id}</span>
                        <span className="text-slate-800 font-medium">{bin.locationDetail}</span>
                        <WasteBadge category={bin.category} />
                      </div>
                      
                      <div className="flex items-center gap-3 text-[11px] text-slate-500 font-mono">
                        <span>Fill: <strong className="text-slate-800">{bin.fillLevel}%</strong></span>
                        <span>•</span>
                        <span>Load: <strong>{estimatedWeight} kg</strong></span>
                        <span>•</span>
                        <span>Shift: {bin.nextShiftTime}</span>
                      </div>

                      {/* Visual fill gauge */}
                      <div className="w-full sm:w-48 bg-slate-200 h-1.5 rounded-full overflow-hidden mt-1">
                        <div 
                          className={`h-full rounded-full transition-all duration-300 ${
                            isFull ? 'bg-rose-500' : bin.fillLevel > 50 ? 'bg-amber-500' : 'bg-emerald-500'
                          }`}
                          style={{ width: `${bin.fillLevel}%` }}
                        />
                      </div>
                    </div>

                    <div className="sm:text-right flex items-center sm:flex-col gap-2 sm:gap-1">
                      {isFull ? (
                        <button
                          type="button"
                          onClick={onOpenReportModal}
                          className="px-3 py-1 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-medium text-[11px] transition-colors shadow-xs cursor-pointer"
                        >
                          Report Overfill
                        </button>
                      ) : (
                        <span className="text-[10px] font-mono text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded font-medium">
                          Space Available
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="text-center pt-1.5 border-t border-slate-100">
              <button
                type="button"
                onClick={() => onNavigateTab('all_bins')}
                className="text-xs text-blue-600 hover:text-blue-800 font-medium inline-flex items-center gap-1 cursor-pointer"
              >
                <span>Looking for a specific bin? Search all 200 hostel bins →</span>
              </button>
            </div>
          </div>

          {/* Quick Hostel Re-Use Bazaar Teaser */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4.5 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-blue-600" />
                <h4 className="font-bold text-slate-900 text-xs sm:text-sm">Govind Hostel Zero-Waste Bazaar</h4>
              </div>
              <button
                type="button"
                onClick={() => onNavigateTab('marketplace')}
                className="text-xs text-blue-600 hover:text-blue-800 font-medium inline-flex items-center gap-0.5 cursor-pointer"
              >
                <span>View All ({db.getMarketplaceItems().length})</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {featuredMarketItems.map(item => (
                <div 
                  key={item.id}
                  onClick={() => onNavigateTab('marketplace')}
                  className="p-3 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-slate-100 transition-colors flex items-center justify-between cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <img src={item.photoUrl} alt={item.title} className="w-10 h-10 rounded-lg object-cover border border-slate-200" />
                    <div>
                      <div className="font-semibold text-slate-900 line-clamp-1">{item.title}</div>
                      <div className="text-[10px] text-slate-500">📍 {item.sellerRoom}</div>
                    </div>
                  </div>
                  <span className="font-mono font-bold text-xs bg-slate-900 text-white px-2 py-0.5 rounded shadow-xs whitespace-nowrap">
                    {item.isFree ? 'FREE' : `${item.ecoPointsPrice} Pts`}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: Advanced Campus Data Analytics & Circular Insights (Visible on PC, hidden on mobile) */}
        <div className="hidden lg:block lg:col-span-5 space-y-5">
          
          {/* Card 1: IIT Roorkee Empirical Solid Waste Stream Analytics */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="font-mono text-[10px] font-bold text-brand-dark bg-slate-100 px-2 py-0.5 rounded">
                  CAMPUS EMPIRICAL AUDIT
                </span>
                <h4 className="font-bold text-slate-900 text-sm mt-1">
                  IIT Roorkee Daily Waste Stream
                </h4>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 block">Total Campus Generation</span>
                <span className="font-mono font-bold text-slate-900 text-sm">5,500 kg / day</span>
              </div>
            </div>

            {/* Landfill Diversion Rate Progress */}
            <div className="bg-emerald-50 border border-emerald-200 p-3.5 rounded-xl space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-emerald-950 flex items-center gap-1.5">
                  <Leaf className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Landfill Diversion Efficiency</span>
                </span>
                <span className="font-mono font-bold text-emerald-800 text-base">73.4%</span>
              </div>

              <div className="w-full bg-emerald-200/60 h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-600 h-full rounded-full" style={{ width: '73.4%' }} />
              </div>
              
              <div className="text-[10px] text-emerald-800 flex justify-between">
                <span>4,037 kg diverted to recycling & biogas</span>
                <span>Target: 85% by Dec 2026</span>
              </div>
            </div>

            {/* Stream Breakdown Bars */}
            <div className="space-y-2 text-xs">
              <div className="text-[11px] font-semibold text-slate-700">Material Stream Distribution:</div>
              
              <div className="space-y-1.5">
                <div>
                  <div className="flex justify-between text-[11px] mb-0.5">
                    <span className="text-slate-600">🍌 Organic Food (Biogas Unit)</span>
                    <span className="font-mono font-bold text-slate-900">1,676 kg (30.5%)</span>
                  </div>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-emerald-600 h-full rounded-full" style={{ width: '30.5%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] mb-0.5">
                    <span className="text-slate-600">📄 Paper & Cardboard (ITC Baled)</span>
                    <span className="font-mono font-bold text-slate-900">1,580 kg (28.7%)</span>
                  </div>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-blue-600 h-full rounded-full" style={{ width: '28.7%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] mb-0.5">
                    <span className="text-slate-600">🥤 Plastic Bottles & Polymers</span>
                    <span className="font-mono font-bold text-slate-900">613 kg (11.1%)</span>
                  </div>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-teal-600 h-full rounded-full" style={{ width: '11.1%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] mb-0.5">
                    <span className="text-slate-600">🍂 Dry Garden Foliage (Briquetting)</span>
                    <span className="font-mono font-bold text-slate-900">569 kg (10.3%)</span>
                  </div>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-amber-600 h-full rounded-full" style={{ width: '10.3%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] mb-0.5">
                    <span className="text-slate-600">🪨 Inert Municipal Waste (Landfill)</span>
                    <span className="font-mono font-bold text-slate-900">595 kg (10.8%)</span>
                  </div>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-slate-400 h-full rounded-full" style={{ width: '10.8%' }} />
                  </div>
                </div>
              </div>
            </div>

            <div className="text-[10px] text-slate-400 border-t border-slate-100 pt-2 font-mono">
              Source: MDPI Indian Institute of Technology Roorkee Solid Waste Field Study
            </div>
          </div>

          {/* Card 2: Campus Circular Vault Financial Allocation Radar */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="font-mono text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                  TREASURY LIQUID BACKING
                </span>
                <h4 className="font-bold text-slate-900 text-sm mt-1">
                  Campus Circular Vault Split
                </h4>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 block">Scrap Auction Yield</span>
                <span className="font-mono font-bold text-emerald-700 text-base">₹{vault.totalCashInr.toLocaleString()}</span>
              </div>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              Every rupee earned from B2B recyclers (ITC Paperboards, Nepra) is automatically partitioned by smart contract rules to fund campus welfare:
            </p>

            <div className="space-y-2 text-xs">
              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Coffee className="w-4 h-4 text-emerald-700" />
                  <div>
                    <div className="font-semibold text-slate-800">30% Student Food Pass</div>
                    <div className="text-[10px] text-slate-400">Nescafe & Night Mess Subsidies</div>
                  </div>
                </div>
                <div className="font-mono font-bold text-slate-900">₹{Math.round(vault.totalCashInr * 0.30).toLocaleString()}</div>
              </div>

              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-700" />
                  <div>
                    <div className="font-semibold text-slate-800">30% Worker UPI Bonus</div>
                    <div className="text-[10px] text-slate-400">Direct incentive per verified clean</div>
                  </div>
                </div>
                <div className="font-mono font-bold text-slate-900">₹{Math.round(vault.totalCashInr * 0.30).toLocaleString()}</div>
              </div>

              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Scale className="w-4 h-4 text-blue-700" />
                  <div>
                    <div className="font-semibold text-slate-800">25% Baler & IoT Upkeep</div>
                    <div className="text-[10px] text-slate-400">Sensors, balers & spare parts</div>
                  </div>
                </div>
                <div className="font-mono font-bold text-slate-900">₹{Math.round(vault.totalCashInr * 0.25).toLocaleString()}</div>
              </div>

              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <HeartHandshake className="w-4 h-4 text-rose-700" />
                  <div>
                    <div className="font-semibold text-slate-800">15% NSS Flood Relief</div>
                    <div className="text-[10px] text-slate-400">Uttarakhand Disaster Relief Fund</div>
                  </div>
                </div>
                <div className="font-mono font-bold text-slate-900">₹{Math.round(vault.totalCashInr * 0.15).toLocaleString()}</div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onNavigateTab('rewards')}
              className="w-full py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>Redeem or Donate Your Tokens</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Card 3: Hostel Leaderboard Snippet */}
          <div className="bg-slate-50 rounded-2xl border border-slate-200 p-4 flex items-center justify-between text-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                🏆 #1
              </div>
              <div>
                <div className="font-semibold text-slate-900">Govind Bhawan Leads Campus</div>
                <div className="text-[11px] text-slate-500">96.4% Segregation Score • 420 kg Diverted</div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => onNavigateTab('leaderboard')}
              className="text-xs font-semibold text-slate-700 hover:text-slate-900 underline cursor-pointer"
            >
              Full Ranks
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}
