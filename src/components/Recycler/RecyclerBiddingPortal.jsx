import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Gavel, 
  Clock, 
  TrendingUp, 
  CheckCircle2, 
  AlertCircle, 
  ShieldCheck, 
  QrCode, 
  FileText, 
  Scale, 
  Droplets, 
  Sparkles,
  ArrowUpRight,
  ExternalLink,
  ChevronRight,
  Coins
} from 'lucide-react';
import { db } from '../../services/db';
import { WasteBadge } from '../Common/Badges';

export default function RecyclerBiddingPortal() {
  const [lots, setLots] = useState([]);
  const [selectedLot, setSelectedLot] = useState(null);
  const [bidAmount, setBidAmount] = useState('');
  const [activeTab, setActiveTab] = useState('active'); // 'active' | 'awarded'
  const [notification, setNotification] = useState(null);
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    loadLots();
    const interval = setInterval(() => {
      setNow(Date.now());
    }, 1000);

    window.addEventListener('ecocampus_db_change', loadLots);
    return () => {
      clearInterval(interval);
      window.removeEventListener('ecocampus_db_change', loadLots);
    };
  }, []);

  const loadLots = () => {
    setLots(db.getAuctionLots());
  };

  const handlePlaceBid = (e) => {
    e.preventDefault();
    if (!selectedLot || !bidAmount) return;

    const res = db.placeBid(
      selectedLot.id, 
      'ITC Paperboards & Specialty Papers Ltd.', 
      parseFloat(bidAmount),
      'USR-004'
    );

    if (res.success) {
      setNotification({
        type: 'success',
        text: `Bid of ₹${bidAmount}/kg successfully placed for ${selectedLot.id}! You are now the leading bidder.`
      });
      setBidAmount('');
      setSelectedLot(null);
    } else {
      setNotification({
        type: 'error',
        text: res.error || 'Failed to submit bid'
      });
    }
  };

  const activeLots = lots.filter(l => l.status === 'active');
  const awardedLots = lots.filter(l => l.status === 'awarded');

  const isUrgent = (expiresAt) => {
    const diff = new Date(expiresAt).getTime() - now;
    return diff > 0 && diff < 2 * 60 * 60 * 1000; // less than 2 hours
  };

  const formatCountdown = (expiresAt) => {
    const diff = new Date(expiresAt).getTime() - now;
    if (diff <= 0) return 'Tender Expired (Pending Clearing)';
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const secs = Math.floor((diff % (1000 * 60)) / 1000);
    return `${hours}h ${mins}m ${secs}s`;
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-6 font-sans">
      
      {/* Clean Corporate Partner Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="text-xs text-slate-500 font-medium flex items-center gap-2">
            <span>Verified B2B Tender Desk</span>
            <span>·</span>
            <span className="font-mono text-emerald-700">GSTIN: 05AAACI1234Q1Z2</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-slate-900">
            Recyclable Commodities & Reverse Auction
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-2xl leading-relaxed">
            Competitive bidding for baled dry recyclables from IIT Roorkee. Highest bid at tender close settles directly into the Campus Circular Vault.
          </p>
        </div>

        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 min-w-[210px] sm:text-right">
          <div className="text-[11px] text-slate-400">Partner Account</div>
          <div className="font-semibold text-slate-900 text-sm mt-0.5">ITC Paperboards Ltd.</div>
          <div className="text-xs font-mono text-emerald-600 mt-0.5">Credit Line: ₹5,00,000</div>
        </div>
      </div>

      {notification && (
        <div className={`p-4 rounded-xl border flex items-center justify-between text-xs animate-fadeIn ${
          notification.type === 'success' 
            ? 'bg-emerald-50 border-emerald-300 text-emerald-900' 
            : 'bg-rose-50 border-rose-300 text-rose-900'
        }`}>
          <div className="flex items-center gap-2">
            {notification.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-700 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-700 flex-shrink-0" />
            )}
            <span>{notification.text}</span>
          </div>
          <button onClick={() => setNotification(null)} className="font-bold text-xs">✕</button>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-2">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('active')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 ${
              activeTab === 'active'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200'
            }`}
          >
            <Gavel className="w-3.5 h-3.5" />
            <span>Active Tender Lots ({activeLots.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('awarded')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 ${
              activeTab === 'awarded'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Awarded & Gate Passes ({awardedLots.length})</span>
          </button>
        </div>

        <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-500 font-mono">
          <Clock className="w-3.5 h-3.5 text-slate-400" />
          <span>Timer Auto-Refreshes</span>
        </div>
      </div>

      {/* Active Tender Lots */}
      {activeTab === 'active' && (
        activeLots.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {activeLots.map(lot => {
              const isLeading = lot.highestBidderName.includes('ITC');
              const grossVal = Math.round(lot.weightKg * lot.currentHighestBid);

              return (
                <div 
                  key={lot.id}
                  className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4 hover:shadow-sm transition-shadow flex flex-col justify-between"
                >
                  <div>
                    {/* Top Bar */}
                    <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-xs text-slate-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                            {lot.id}
                          </span>
                          <WasteBadge category={lot.category} />
                        </div>
                        <h3 className="font-semibold text-slate-900 text-sm mt-1.5">
                          {lot.title}
                        </h3>
                      </div>

                      <div className="text-right">
                        {isUrgent(lot.expiresAt) ? (
                          <div className="font-mono text-xs font-bold text-rose-700 bg-rose-50 border border-rose-300 px-2.5 py-1 rounded-md flex items-center gap-1 shadow-xs animate-pulse">
                            <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
                            <span>{formatCountdown(lot.expiresAt)}</span>
                          </div>
                        ) : (
                          <div className="font-mono text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-md flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-amber-600" />
                            <span>{formatCountdown(lot.expiresAt)}</span>
                          </div>
                        )}
                        <span className="text-[10px] text-slate-400 block mt-0.5">Tender Window: {lot.durationHours}h</span>
                      </div>
                    </div>

                    {/* Certified Lab Specs Grid */}
                    <div className="grid grid-cols-3 gap-2.5 my-3.5 text-xs">
                      <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                        <div className="text-[11px] text-slate-500 flex items-center gap-1">
                          <Scale className="w-3 h-3 text-slate-400" />
                          <span>Net Mass</span>
                        </div>
                        <div className="font-mono font-bold text-slate-900 text-sm mt-0.5">
                          {lot.weightKg.toLocaleString()} kg
                        </div>
                        <div className="text-[10px] text-slate-400">Weighbridge Calibrated</div>
                      </div>

                      <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                        <div className="text-[11px] text-slate-500 flex items-center gap-1">
                          <Droplets className="w-3 h-3 text-slate-400" />
                          <span>Moisture</span>
                        </div>
                        <div className="font-mono font-bold text-emerald-700 text-sm mt-0.5">
                          {lot.moisturePercent}
                        </div>
                        <div className="text-[10px] text-slate-400">{lot.materialGrade}</div>
                      </div>

                      <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                        <div className="text-[11px] text-slate-500 flex items-center gap-1">
                          <Coins className="w-3 h-3 text-slate-400" />
                          <span>Reserve Floor</span>
                        </div>
                        <div className="font-mono font-bold text-slate-800 text-sm mt-0.5">
                          ₹{lot.reservePricePerKg.toFixed(2)} /kg
                        </div>
                        <div className="text-[10px] text-slate-400">Min Base Price</div>
                      </div>
                    </div>

                    {/* Pricing & Leader Board */}
                    <div className="bg-slate-900 text-white p-3.5 rounded-xl space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-400">Current Leader Bid</span>
                        <span className="font-mono font-bold text-emerald-400 text-lg">
                          ₹{lot.currentHighestBid.toFixed(2)} <span className="text-xs text-slate-400 font-normal">/kg</span>
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-xs border-t border-slate-800 pt-2">
                        <span className="text-slate-400">Leading Buyer:</span>
                        <span className="font-medium text-slate-200 flex items-center gap-1">
                          {lot.highestBidderName}
                          {isLeading && (
                            <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-mono px-1.5 py-0.2 rounded">
                              YOU ARE LEADING
                            </span>
                          )}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-slate-400">
                        <span>Total Consignment Value:</span>
                        <span className="font-mono font-semibold text-white">₹{grossVal.toLocaleString()}</span>
                      </div>
                    </div>

                    {/* Competing Bids Timeline */}
                    <div className="mt-3 space-y-1.5">
                      <div className="text-[11px] font-medium text-slate-600 flex items-center justify-between">
                        <span>Recent Bid Progression ({lot.bids.length} bids)</span>
                        <span className="text-[10px] text-slate-400">Live Feed</span>
                      </div>
                      <div className="space-y-1 max-h-24 overflow-y-auto pr-1">
                        {lot.bids.slice(0, 3).map((b, idx) => (
                          <div key={idx} className="flex items-center justify-between text-[11px] p-1.5 bg-slate-50 rounded border border-slate-100">
                            <span className="text-slate-700 font-medium truncate max-w-[200px]">{b.bidder}</span>
                            <div className="flex items-center gap-2 font-mono">
                              <span className="font-bold text-slate-900">₹{b.amountPerKg.toFixed(2)}/kg</span>
                              <span className="text-[10px] text-slate-400">{b.time}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Bid Action */}
                  <div className="border-t border-slate-100 pt-3">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedLot(lot);
                        setBidAmount((lot.currentHighestBid + 0.50).toFixed(2));
                      }}
                      className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs transition-colors flex items-center justify-center gap-2 shadow-xs"
                    >
                      <Gavel className="w-3.5 h-3.5" />
                      <span>Place Counter-Bid (Min: ₹{(lot.currentHighestBid + 0.20).toFixed(2)}/kg)</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
            <div className="w-12 h-12 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto">
              <Gavel className="w-6 h-6" />
            </div>
            <h3 className="font-semibold text-slate-900 text-sm">No Active B2B Tenders Open</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Consolidated dry recyclable lots are batched every Tuesday and Saturday at the Central SWM Baler facility. Check back for newly posted lots.
            </p>
          </div>
        )
      )}

      {/* Awarded Tenders & Gate Passes */}
      {activeTab === 'awarded' && (
        awardedLots.length > 0 ? (
          <div className="space-y-4">
            {awardedLots.map(lot => (
              <div key={lot.id} className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-xs text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                        {lot.id}
                      </span>
                      <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded font-mono">
                        AUCTION AWARDED & SETTLED
                      </span>
                    </div>
                    <h3 className="font-semibold text-slate-900 text-base mt-1">
                      {lot.title}
                    </h3>
                    <div className="text-xs text-slate-500 mt-0.5">
                      Winning Buyer: <strong>{lot.highestBidderName}</strong> at <strong>₹{lot.currentHighestBid.toFixed(2)}/kg</strong>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-xs text-slate-400">Total Settlement Value</div>
                    <div className="font-mono font-bold text-xl text-slate-900">
                      ₹{(lot.weightKg * lot.currentHighestBid).toLocaleString()}
                    </div>
                    <div className="text-[10px] text-emerald-700">Credited into Campus Vault</div>
                  </div>
                </div>

                {/* Digital Gate Pass Card */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="space-y-1 text-xs">
                    <div className="flex items-center gap-2">
                      <QrCode className="w-4 h-4 text-slate-700" />
                      <span className="font-semibold text-slate-900">Digital Gate Pass & Weighbridge Token:</span>
                      <span className="font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                        {lot.gatePassNumber}
                      </span>
                    </div>
                    <p className="text-slate-600 text-[11px] leading-relaxed">
                      Present this pass at Century Gate security and proceed to Central SWM Baler Yard. Driver must weigh tare weight on ingress and gross weight on egress.
                    </p>
                    <div className="text-[10px] text-slate-400 font-mono">
                      Authorized by Estate Sanitation Officer • Valid for 48 Hours
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => alert(`Digital Gate Pass #${lot.gatePassNumber} downloaded. PDF sent to registered email.`)}
                    className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium rounded-lg flex items-center gap-1.5 transition-colors whitespace-nowrap"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Download Pass PDF</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
            <div className="w-12 h-12 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="font-semibold text-slate-900 text-sm">No Awarded Tenders Yet</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              When bidding windows expire and lots are settled, official digital gate passes and weighbridge manifests will be accessible here.
            </p>
          </div>
        )
      )}

      {/* Place Bid Interactive Modal */}
      {selectedLot && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 border border-slate-200 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-semibold text-slate-900 text-base">Submit Competitive Tender Bid</h3>
                <span className="font-mono text-xs text-slate-500">{selectedLot.id} • {selectedLot.title}</span>
              </div>
              <button 
                onClick={() => setSelectedLot(null)} 
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handlePlaceBid} className="space-y-4 text-xs">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1">
                <div className="flex justify-between text-slate-600">
                  <span>Net Consignment Mass:</span>
                  <span className="font-mono font-bold text-slate-900">{selectedLot.weightKg.toLocaleString()} kg</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Current Leader Bid:</span>
                  <span className="font-mono font-bold text-emerald-700">₹{selectedLot.currentHighestBid.toFixed(2)} /kg</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Leading Company:</span>
                  <span className="font-medium text-slate-800 truncate max-w-[200px]">{selectedLot.highestBidderName}</span>
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Your Offer (₹ / kg) <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 font-bold text-slate-500">₹</span>
                  <input
                    type="number"
                    step="0.10"
                    min={(selectedLot.currentHighestBid + 0.10).toFixed(2)}
                    value={bidAmount}
                    onChange={(e) => setBidAmount(e.target.value)}
                    required
                    className="w-full pl-7 pr-16 py-2 rounded-lg border border-slate-300 font-mono text-sm font-bold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter rate per kg"
                  />
                  <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-mono">/ kg</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Minimum qualifying bid: ₹{(selectedLot.currentHighestBid + 0.10).toFixed(2)}/kg
                </p>

                {/* Quick Increment Preset Counter-Bid Buttons */}
                <div className="flex items-center gap-1.5 pt-2">
                  <span className="text-[11px] font-medium text-slate-500">Quick Increment:</span>
                  {[0.20, 0.50, 1.00, 2.00].map(inc => (
                    <button
                      key={inc}
                      type="button"
                      onClick={() => setBidAmount((selectedLot.currentHighestBid + inc).toFixed(2))}
                      className="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300 border border-slate-200 text-slate-700 text-[11px] font-mono font-semibold transition-all active:scale-95"
                    >
                      +₹{inc.toFixed(2)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Total Estimated Consignment Cost */}
              {bidAmount && parseFloat(bidAmount) > 0 && (
                <div className="bg-blue-50 border border-blue-200 p-3 rounded-xl space-y-1">
                  <div className="flex justify-between text-blue-900 font-medium">
                    <span>Total Purchase Commitment:</span>
                    <span className="font-mono font-bold text-base text-blue-950">
                      ₹{Math.round(selectedLot.weightKg * parseFloat(bidAmount)).toLocaleString()}
                    </span>
                  </div>
                  <div className="text-[10px] text-blue-700 leading-tight">
                    Includes GST weighbridge certification and baled forklift loading at IIT Roorkee Central SWM facility.
                  </div>
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSelectedLot(null)}
                  className="px-4 py-2 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium flex items-center gap-1.5 shadow-xs"
                >
                  <Gavel className="w-3.5 h-3.5" />
                  <span>Confirm & Submit Bid</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
