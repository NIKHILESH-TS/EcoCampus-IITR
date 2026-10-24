import React, { useState, useEffect } from 'react';
import { 
  Landmark, 
  Coins, 
  TrendingUp, 
  HeartHandshake, 
  ShieldCheck, 
  Coffee, 
  Utensils, 
  Smartphone, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  Sparkles,
  QrCode,
  Award
} from 'lucide-react';
import { db } from '../../services/db';

export default function CampusVaultModal({ isOpen, onClose }) {
  const [vault, setVault] = useState(db.getVault());
  const [user, setUser] = useState(db.getCurrentUser());
  const [activeTab, setActiveTab] = useState('redeem'); // 'redeem' | 'relief' | 'transactions'
  
  // Redeem form state
  const [redeemTokens, setRedeemTokens] = useState(100);
  const [redeemType, setRedeemType] = useState('nescafe'); // 'nescafe' | 'canteen' | 'upi'
  const [upiId, setUpiId] = useState('nikhil.iitr@okhdfcbank');
  const [redeemResult, setRedeemResult] = useState(null);

  // Flood relief donation state
  const [donationTokens, setDonationTokens] = useState(50);
  const [donationResult, setDonationResult] = useState(null);

  useEffect(() => {
    const handleUpdate = () => {
      setVault(db.getVault());
      setUser(db.getCurrentUser());
    };
    handleUpdate();
    window.addEventListener('ecocampus_db_change', handleUpdate);
    return () => window.removeEventListener('ecocampus_db_change', handleUpdate);
  }, []);

  if (!isOpen) return null;

  const inrEquivalent = Math.round(redeemTokens * vault.exchangeRateInrPerToken);

  const handleRedeem = (e) => {
    e.preventDefault();
    if (user.ecoPointsBalance < redeemTokens) {
      alert(`Insufficient EcoTokens. You have ${user.ecoPointsBalance} tokens.`);
      return;
    }

    const res = db.redeemTokensForCash(user.id, redeemTokens, redeemType, upiId);
    if (res.success) {
      setRedeemResult(res);
    } else {
      alert(res.error || 'Redemption failed');
    }
  };

  const handleDonate = (e) => {
    e.preventDefault();
    if (user.ecoPointsBalance < donationTokens) {
      alert(`Insufficient EcoTokens. You have ${user.ecoPointsBalance} tokens.`);
      return;
    }

    const res = db.donateTokensToFloodRelief(user.id, donationTokens);
    if (res.success) {
      setDonationResult(res);
    } else {
      alert(res.error || 'Donation failed');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto font-sans">
      <div className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden my-8">
        
        {/* Top Vault Treasury Header */}
        <div className="bg-slate-900 text-white p-5 relative overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3 relative z-10">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Landmark className="w-4 h-4" />
              </div>
              <div>
                <h2 className="font-bold text-sm tracking-tight text-white flex items-center gap-2">
                  <span>Campus Circular Vault & Treasury</span>
                  <span className="bg-emerald-500/20 text-emerald-300 font-mono text-[10px] px-2 py-0.5 rounded font-normal">
                    100% Backed by B2B Scrap Sales
                  </span>
                </h2>
                <div className="text-[11px] text-slate-400">
                  Total Liquid Reserve: <strong className="text-white font-mono font-bold text-xs">₹{vault.totalCashInr.toLocaleString()}</strong> • 1 EcoToken = ₹{vault.exchangeRateInrPerToken.toFixed(2)}
                </div>
              </div>
            </div>

            <button 
              onClick={onClose}
              className="text-slate-400 hover:text-white text-base font-bold transition-colors"
            >
              ✕
            </button>
          </div>

          {/* 4-Way Allocation Pill Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs relative z-10">
            <div className="bg-slate-800/80 p-2 rounded-lg border border-slate-700">
              <div className="text-[10px] text-emerald-400">Student Canteen (30%)</div>
              <div className="font-mono font-bold text-slate-100 text-xs">₹{vault.breakdown.studentCanteenPoolInr.toLocaleString()}</div>
            </div>

            <div className="bg-slate-800/80 p-2 rounded-lg border border-slate-700">
              <div className="text-[10px] text-blue-400">Worker UPI (30%)</div>
              <div className="font-mono font-bold text-slate-100 text-xs">₹{vault.breakdown.workerUpiBonusPoolInr.toLocaleString()}</div>
            </div>

            <div className="bg-slate-800/80 p-2 rounded-lg border border-slate-700">
              <div className="text-[10px] text-amber-400">Baler Maint. (25%)</div>
              <div className="font-mono font-bold text-slate-100 text-xs">₹{vault.breakdown.equipmentMaintenanceInr.toLocaleString()}</div>
            </div>

            <div className="bg-slate-800/80 p-2 rounded-lg border border-slate-700">
              <div className="text-[10px] text-rose-400">Relief Fund (15%)</div>
              <div className="font-mono font-bold text-slate-100 text-xs">₹{vault.breakdown.disasterReliefReserveInr.toLocaleString()}</div>
            </div>
          </div>
        </div>

        {/* User Balance Strip */}
        <div className="bg-emerald-50 px-5 py-2.5 border-b border-emerald-100 flex items-center justify-between text-xs text-emerald-950">
          <div className="flex items-center gap-2">
            <Coins className="w-4 h-4 text-emerald-700" />
            <span>Your Balance: <strong className="font-mono font-bold text-sm text-emerald-900">{user.ecoPointsBalance} EcoTokens</strong></span>
            <span className="text-emerald-700">(≈ ₹{(user.ecoPointsBalance * vault.exchangeRateInrPerToken).toFixed(2)} purchasing power)</span>
          </div>

          <div className="text-[11px] text-emerald-800 font-medium">
            Status: Fully Liquid & Redeemable
          </div>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="flex items-center border-b border-slate-200 px-5 pt-3 gap-2">
          <button
            type="button"
            onClick={() => { setActiveTab('redeem'); setRedeemResult(null); }}
            className={`pb-2.5 text-xs font-semibold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'redeem'
                ? 'border-slate-900 text-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Coffee className="w-3.5 h-3.5" />
            <span>Exchange for Canteen & Cash</span>
          </button>

          <button
            type="button"
            onClick={() => { setActiveTab('relief'); setDonationResult(null); }}
            className={`pb-2.5 text-xs font-semibold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'relief'
                ? 'border-slate-900 text-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <HeartHandshake className="w-3.5 h-3.5" />
            <span>Uttarakhand Flood Relief</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('transactions')}
            className={`pb-2.5 text-xs font-semibold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'transactions'
                ? 'border-slate-900 text-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Vault Ledger</span>
          </button>
        </div>

        {/* Tab 1: Redeem */}
        {activeTab === 'redeem' && (
          <div className="p-5 space-y-4">
            {redeemResult ? (
              <div className="bg-emerald-50 border border-emerald-300 rounded-xl p-5 text-center space-y-3 animate-fadeIn">
                <div className="w-12 h-12 rounded-full bg-emerald-100 border border-emerald-300 flex items-center justify-center mx-auto text-emerald-800">
                  <CheckCircle2 className="w-6 h-6 text-emerald-700" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Voucher Issued Successfully!</h3>
                  <p className="text-xs text-slate-600 mt-0.5">
                    ₹{redeemResult.inrValue} disbursed from Campus Vault student reserve.
                  </p>
                </div>

                <div className="bg-white p-3 rounded-lg border border-emerald-200 max-w-xs mx-auto">
                  <div className="text-[10px] text-slate-400 font-mono">REDEEMABLE CODE / VOUCHER</div>
                  <div className="font-mono font-bold text-base text-emerald-800 tracking-wider">
                    {redeemResult.voucherCode}
                  </div>
                  <div className="text-[10px] text-slate-500 mt-1">Show at Campus Nescafe Counter or Night Mess</div>
                </div>

                <button
                  type="button"
                  onClick={() => setRedeemResult(null)}
                  className="px-4 py-1.5 bg-emerald-700 text-white rounded-lg text-xs font-medium"
                >
                  Make Another Redemption
                </button>
              </div>
            ) : (
              <form onSubmit={handleRedeem} className="space-y-4 text-xs">
                <div>
                  <label className="block font-medium text-slate-700 mb-1.5">
                    Select Redemption Voucher Type
                  </label>
                  <div className="grid grid-cols-3 gap-2.5">
                    <button
                      type="button"
                      onClick={() => setRedeemType('nescafe')}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        redeemType === 'nescafe'
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-semibold ring-1 ring-emerald-600'
                          : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <Coffee className="w-4 h-4 text-amber-700 mb-1" />
                      <div className="font-medium text-xs">Campus Nescafe</div>
                      <div className="text-[10px] text-slate-500">Coffee & snacks</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setRedeemType('canteen')}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        redeemType === 'canteen'
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-semibold ring-1 ring-emerald-600'
                          : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <Utensils className="w-4 h-4 text-blue-700 mb-1" />
                      <div className="font-medium text-xs">Night Canteen</div>
                      <div className="text-[10px] text-slate-500">Meals & maggi</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setRedeemType('upi')}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        redeemType === 'upi'
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-semibold ring-1 ring-emerald-600'
                          : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <Smartphone className="w-4 h-4 text-purple-700 mb-1" />
                      <div className="font-medium text-xs">Direct UPI Bank</div>
                      <div className="text-[10px] text-slate-500">Instant cashout</div>
                    </button>
                  </div>
                </div>

                {/* Token Amount Slider / Selector */}
                <div>
                  <div className="flex justify-between font-medium text-slate-700 mb-1">
                    <span>Tokens to Exchange:</span>
                    <span className="font-mono font-bold text-slate-900">{redeemTokens} Tokens</span>
                  </div>
                  <input
                    type="range"
                    min="20"
                    max={Math.max(20, user.ecoPointsBalance)}
                    step="10"
                    value={redeemTokens}
                    onChange={(e) => setRedeemTokens(parseInt(e.target.value))}
                    className="w-full accent-emerald-600"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
                    <span>Min: 20</span>
                    <span>Max: {user.ecoPointsBalance}</span>
                  </div>
                </div>

                {/* UPI ID input if UPI chosen */}
                {redeemType === 'upi' && (
                  <div>
                    <label className="block font-medium text-slate-700 mb-1">Enter Student UPI ID</label>
                    <input
                      type="text"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      required
                      placeholder="e.g. username@okhdfcbank"
                      className="w-full p-2 rounded-lg border border-slate-300 font-mono text-xs"
                    />
                  </div>
                )}

                {/* Conversion Preview Box */}
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 flex items-center justify-between">
                  <div>
                    <div className="text-slate-500 text-[11px]">Payout Disbursement</div>
                    <div className="font-mono font-bold text-lg text-slate-900 mt-0.5">
                      ₹{inrEquivalent} <span className="text-xs font-normal text-slate-500">INR</span>
                    </div>
                  </div>
                  <div className="text-right text-[11px] text-emerald-800">
                    <span className="bg-emerald-100 px-2 py-0.5 rounded font-mono font-bold">1 Token = ₹0.50</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={user.ecoPointsBalance < redeemTokens}
                  className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-medium text-xs transition-colors flex items-center justify-center gap-2 shadow-xs"
                >
                  <Coins className="w-3.5 h-3.5" />
                  <span>Confirm Vault Disbursement (₹{inrEquivalent})</span>
                </button>
              </form>
            )}
          </div>
        )}

        {/* Tab 2: Flood Relief */}
        {activeTab === 'relief' && (
          <div className="p-5 space-y-4 text-xs">
            {donationResult ? (
              <div className="bg-rose-50 border border-rose-300 rounded-xl p-5 text-center space-y-3 animate-fadeIn">
                <div className="w-12 h-12 rounded-full bg-rose-100 border border-rose-300 flex items-center justify-center mx-auto text-rose-800">
                  <Award className="w-6 h-6 text-rose-700" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Thank You for Your Donation!</h3>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Your contribution matched ₹{donationResult.cashMatch} from the campus vault for Uttarakhand Flood Relief.
                  </p>
                </div>

                <div className="bg-white p-3 rounded-lg border border-rose-200 max-w-xs mx-auto">
                  <div className="text-[10px] text-slate-400 font-mono">NSS PHILANTHROPY CERTIFICATE ID</div>
                  <div className="font-mono font-bold text-sm text-rose-900">
                    {donationResult.certId}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setDonationResult(null)}
                  className="px-4 py-1.5 bg-rose-700 text-white rounded-lg text-xs font-medium"
                >
                  Back to Relief Hub
                </button>
              </div>
            ) : (
              <form onSubmit={handleDonate} className="space-y-4">
                <div className="bg-gradient-to-r from-rose-50 to-amber-50 p-4 rounded-xl border border-rose-200">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="bg-rose-600 text-white font-mono text-[10px] font-bold px-1.5 py-0.2 rounded">
                      NSS IITR INITIATIVE
                    </span>
                    <span className="font-semibold text-rose-950 text-xs">Uttarakhand Flood & Landslide Relief Fund</span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    Convert your circular waste tokens into emergency disaster aid for affected mountain villages in Garhwal. Every token you donate is 100% matched by IIT Roorkee's Estate Disaster Vault reserve.
                  </p>

                  <div className="mt-3 space-y-1">
                    <div className="flex justify-between text-[11px] font-medium text-slate-700">
                      <span>Drive Progress: {vault.floodRelief.tokensDonated.toLocaleString()} / {vault.floodRelief.targetTokens.toLocaleString()} Tokens</span>
                      <span className="font-mono font-bold text-rose-700">₹{vault.floodRelief.cashDisbursedInr.toLocaleString()} Raised</span>
                    </div>
                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div 
                        className="bg-rose-600 h-full rounded-full transition-all" 
                        style={{ width: `${(vault.floodRelief.tokensDonated / vault.floodRelief.targetTokens) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">Tokens to Donate</label>
                  <div className="flex gap-2">
                    {[25, 50, 100, 200].map(amt => (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => setDonationTokens(amt)}
                        className={`flex-1 py-2 rounded-lg border text-xs font-mono font-bold transition-all ${
                          donationTokens === amt
                            ? 'bg-rose-600 text-white border-rose-600'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        {amt} Pts
                      </button>
                    ))}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1.5 flex justify-between">
                    <span>Will disburse ₹{(donationTokens * 0.50).toFixed(2)} directly to CM Relief Fund.</span>
                    <span>Your Balance: {user.ecoPointsBalance}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={user.ecoPointsBalance < donationTokens}
                  className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white font-medium text-xs transition-colors flex items-center justify-center gap-2 shadow-xs"
                >
                  <HeartHandshake className="w-3.5 h-3.5" />
                  <span>Donate {donationTokens} Tokens (Matched by Vault)</span>
                </button>
              </form>
            )}
          </div>
        )}

        {/* Tab 3: Transactions Ledger */}
        {activeTab === 'transactions' && (
          <div className="p-5 space-y-3 text-xs">
            <div className="font-semibold text-slate-800 text-xs border-b border-slate-100 pb-1">
              Live Campus Vault Inflow & Disbursement Ledger
            </div>

            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {vault.recentTransactions.map((tx, idx) => (
                <div key={idx} className="p-2.5 rounded-lg border border-slate-200 bg-slate-50/50 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="font-medium text-slate-800 text-xs">{tx.description}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{tx.id} • {tx.timestamp}</div>
                  </div>
                  <div className={`font-mono font-bold text-xs ${
                    tx.type.includes('credit') ? 'text-emerald-700' : 'text-slate-800'
                  }`}>
                    {tx.type.includes('credit') ? '+' : '-'}₹{tx.amountInr.toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="bg-slate-50 p-4 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
          <span>Audited by NSS IIT Roorkee & Estate Office</span>
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1 bg-white border border-slate-200 rounded-md text-slate-700 hover:bg-slate-100"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
