import React, { useState, useEffect } from 'react';
import { 
  Landmark, 
  Coins, 
  Coffee, 
  Utensils, 
  Smartphone, 
  CheckCircle2, 
  HeartHandshake, 
  Award, 
  ArrowRight, 
  Sparkles,
  QrCode,
  ShieldCheck,
  TrendingUp,
  Receipt
} from 'lucide-react';
import { db } from '../../services/db';

export default function StudentRewardsHub() {
  const [user, setUser] = useState(db.getCurrentUser());
  const [vault, setVault] = useState(db.getVault());
  const [redeemTokens, setRedeemTokens] = useState(100);
  const [redeemType, setRedeemType] = useState('nescafe');
  const [upiId, setUpiId] = useState('nikhil.iitr@okhdfcbank');
  const [redeemSuccess, setRedeemSuccess] = useState(null);

  // Donation state
  const [donateTokens, setDonateTokens] = useState(50);
  const [donateSuccess, setDonateSuccess] = useState(null);

  useEffect(() => {
    const handleUpdate = () => {
      setUser(db.getCurrentUser());
      setVault(db.getVault());
    };
    handleUpdate();
    window.addEventListener('ecocampus_db_change', handleUpdate);
    return () => window.removeEventListener('ecocampus_db_change', handleUpdate);
  }, []);

  const inrEquivalent = Math.round(redeemTokens * vault.exchangeRateInrPerToken);

  const handleRedeem = (e) => {
    e.preventDefault();
    if (user.ecoPointsBalance < redeemTokens) {
      alert(`Insufficient EcoTokens. Balance: ${user.ecoPointsBalance}`);
      return;
    }

    const res = db.redeemTokensForCash(user.id, redeemTokens, redeemType, upiId);
    if (res.success) {
      setRedeemSuccess(res);
    } else {
      alert(res.error || 'Redemption failed');
    }
  };

  const handleDonate = (e) => {
    e.preventDefault();
    if (user.ecoPointsBalance < donateTokens) {
      alert(`Insufficient EcoTokens. Balance: ${user.ecoPointsBalance}`);
      return;
    }

    const res = db.donateTokensToFloodRelief(user.id, donateTokens);
    if (res.success) {
      setDonateSuccess(res);
    } else {
      alert(res.error || 'Donation failed');
    }
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* Clean Student Treasury Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="text-xs text-emerald-700 font-medium">
            Campus Circular Vault · 1 Token = ₹{vault.exchangeRateInrPerToken.toFixed(2)}
          </div>
          <h2 className="text-xl font-semibold tracking-tight text-slate-900">
            Canteen & Nescafe Voucher Pass
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-xl leading-relaxed">
            Redeem your EcoTokens for coffee at Nescafe, night canteen meals, or donate directly to Uttarakhand flood relief.
          </p>
        </div>

        <div className="bg-slate-50 border border-slate-200/80 px-5 py-3.5 rounded-2xl min-w-[200px] sm:text-right">
          <div className="text-[11px] text-slate-400 font-medium">Available Balance</div>
          <div className="font-mono font-semibold text-2xl text-slate-900 mt-0.5">
            {user.ecoPointsBalance} <span className="text-xs text-slate-500 font-sans font-normal">Tokens</span>
          </div>
          <div className="text-xs text-emerald-600 font-medium mt-0.5">
            Worth ₹{(user.ecoPointsBalance * vault.exchangeRateInrPerToken).toFixed(2)}
          </div>
        </div>
      </div>

      {/* Main Grid: Redemption Form + Flood Relief Drive */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Canteen & Cashout Form */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                <Coffee className="w-4 h-4 text-amber-700" />
                <span>Instant Voucher & Cashout Generator</span>
              </h3>
              <p className="text-xs text-slate-500">
                100% self-funded from IIT Roorkee's B2B recyclable auctions.
              </p>
            </div>
            <span className="font-mono text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">
              VAULT LIQUID
            </span>
          </div>

          {redeemSuccess ? (
            <div className="bg-emerald-50 border border-emerald-300 rounded-xl p-5 text-center space-y-3 animate-fadeIn">
              <div className="w-12 h-12 rounded-full bg-emerald-100 border border-emerald-300 flex items-center justify-center mx-auto text-emerald-800">
                <CheckCircle2 className="w-6 h-6 text-emerald-700" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-base">Redemption Successful!</h4>
                <p className="text-xs text-slate-600 mt-0.5">
                  ₹{redeemSuccess.inrValue} coupon issued from the Campus Circular Vault.
                </p>
              </div>

              <div className="bg-white p-3.5 rounded-xl border border-emerald-200 max-w-xs mx-auto shadow-xs">
                <div className="text-[10px] text-slate-400 font-mono">DIGITAL VOUCHER CODE</div>
                <div className="font-mono font-bold text-lg text-emerald-800 tracking-wider mt-0.5">
                  {redeemSuccess.voucherCode}
                </div>
                <div className="text-[10px] text-slate-500 mt-1">Show at counter for instant discount</div>
              </div>

              <button
                type="button"
                onClick={() => setRedeemSuccess(null)}
                className="px-4 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-medium transition-colors"
              >
                Redeem Another Voucher
              </button>
            </div>
          ) : (
            <form onSubmit={handleRedeem} className="space-y-4 text-xs">
              <div>
                <label className="block font-medium text-slate-700 mb-2">
                  1. Choose Your Reward Partner:
                </label>
                <div className="grid grid-cols-3 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setRedeemType('nescafe')}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      redeemType === 'nescafe'
                        ? 'border-emerald-600 bg-emerald-50/70 text-emerald-950 font-semibold ring-1 ring-emerald-600'
                        : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <Coffee className="w-4 h-4 text-amber-700 mb-1" />
                    <div className="font-medium text-xs">Campus Nescafe</div>
                    <div className="text-[10px] text-slate-500">Espresso & snacks</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRedeemType('canteen')}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      redeemType === 'canteen'
                        ? 'border-emerald-600 bg-emerald-50/70 text-emerald-950 font-semibold ring-1 ring-emerald-600'
                        : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <Utensils className="w-4 h-4 text-blue-700 mb-1" />
                    <div className="font-medium text-xs">Night Canteen</div>
                    <div className="text-[10px] text-slate-500">Meals & parathas</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRedeemType('upi')}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      redeemType === 'upi'
                        ? 'border-emerald-600 bg-emerald-50/70 text-emerald-950 font-semibold ring-1 ring-emerald-600'
                        : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <Smartphone className="w-4 h-4 text-purple-700 mb-1" />
                    <div className="font-medium text-xs">Direct UPI Bank</div>
                    <div className="text-[10px] text-slate-500">Instant cashout</div>
                  </button>
                </div>
              </div>

              {/* Slider */}
              <div>
                <div className="flex justify-between font-medium text-slate-700 mb-1.5">
                  <span>2. Tokens to Convert:</span>
                  <span className="font-mono font-bold text-slate-900">{redeemTokens} Tokens</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max={Math.max(20, user.ecoPointsBalance)}
                  step="10"
                  value={redeemTokens}
                  onChange={(e) => setRedeemTokens(parseInt(e.target.value))}
                  className="w-full accent-emerald-600 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
                  <span>Min: 20 Tokens</span>
                  <span>Max Available: {user.ecoPointsBalance} Tokens</span>
                </div>
              </div>

              {redeemType === 'upi' && (
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Enter Student UPI ID</label>
                  <input
                    type="text"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    required
                    placeholder="e.g. username@okhdfcbank"
                    className="w-full p-2.5 rounded-lg border border-slate-300 font-mono text-xs focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              )}

              {/* Conversion Preview Box */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex items-center justify-between">
                <div>
                  <div className="text-slate-500 text-[11px]">Instant Payout Value</div>
                  <div className="font-mono font-bold text-xl text-slate-900 mt-0.5">
                    ₹{inrEquivalent} <span className="text-xs font-normal text-slate-500">INR</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="bg-emerald-100 text-emerald-800 text-[11px] font-mono font-bold px-2.5 py-1 rounded-md">
                    Rate: ₹0.50 / Token
                  </span>
                  <div className="text-[10px] text-slate-400 mt-1">Backed by B2B Vault</div>
                </div>
              </div>

              <button
                type="submit"
                disabled={user.ecoPointsBalance < redeemTokens}
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-medium text-xs transition-colors flex items-center justify-center gap-2 shadow-xs"
              >
                <Coins className="w-3.5 h-3.5" />
                <span>Confirm Voucher Generation (₹{inrEquivalent})</span>
              </button>
            </form>
          )}
        </div>

        {/* Right Column: NSS Uttarakhand Flood Relief Drive */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-5 space-y-4 text-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
              <div className="flex items-center gap-1.5 font-bold text-slate-900 text-sm">
                <HeartHandshake className="w-4 h-4 text-rose-600" />
                <span>NSS Uttarakhand Flood Relief</span>
              </div>
              <span className="font-mono text-[10px] bg-rose-100 text-rose-900 px-2 py-0.5 rounded font-bold">
                1:1 MATCHED
              </span>
            </div>

            {donateSuccess ? (
              <div className="bg-rose-50 border border-rose-300 rounded-xl p-5 text-center space-y-3 animate-fadeIn">
                <div className="w-12 h-12 rounded-full bg-rose-100 border border-rose-300 flex items-center justify-center mx-auto text-rose-800">
                  <Award className="w-6 h-6 text-rose-700" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Certificate of Philanthropy Issued!</h4>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Your donation matched ₹{donateSuccess.cashMatch} from the campus vault for mountain relief.
                  </p>
                </div>

                <div className="bg-white p-3 rounded-lg border border-rose-200 max-w-xs mx-auto">
                  <div className="text-[10px] text-slate-400 font-mono">NSS RECOGNITION ID</div>
                  <div className="font-mono font-bold text-sm text-rose-900">
                    {donateSuccess.certId}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setDonateSuccess(null)}
                  className="px-4 py-1.5 bg-rose-700 text-white rounded-lg text-xs font-medium"
                >
                  Make Another Donation
                </button>
              </div>
            ) : (
              <form onSubmit={handleDonate} className="space-y-4">
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  Convert your waste sorting tokens into direct humanitarian aid for flood-affected families in Uttarakhand. Every token is 100% matched by IIT Roorkee's estate emergency fund.
                </p>

                {/* Progress Bar */}
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-2">
                  <div className="flex justify-between font-medium text-slate-700 text-[11px]">
                    <span>Drive Progress</span>
                    <span className="font-mono text-rose-700 font-bold">
                      {vault.floodRelief.tokensDonated.toLocaleString()} / {vault.floodRelief.targetTokens.toLocaleString()} Tokens
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-rose-600 h-full rounded-full transition-all" 
                      style={{ width: `${(vault.floodRelief.tokensDonated / vault.floodRelief.targetTokens) * 100}%` }}
                    />
                  </div>
                  <div className="text-[10px] text-slate-400 flex justify-between">
                    <span>₹{vault.floodRelief.cashDisbursedInr.toLocaleString()} Disbursed to CM Fund</span>
                    <span>48% Complete</span>
                  </div>
                </div>

                {/* Preset Chips */}
                <div>
                  <label className="block font-medium text-slate-700 mb-1.5">Select Donation Amount</label>
                  <div className="grid grid-cols-4 gap-2">
                    {[25, 50, 100, 200].map(amt => (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => setDonateTokens(amt)}
                        className={`py-2 rounded-lg border text-xs font-mono font-bold transition-all ${
                          donateTokens === amt
                            ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        {amt} Pts
                      </button>
                    ))}
                  </div>
                  <div className="text-[10px] text-slate-500 mt-1.5 flex justify-between">
                    <span>Disburses ₹{(donateTokens * 0.50).toFixed(2)} to relief fund</span>
                    <span>Your Balance: {user.ecoPointsBalance}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={user.ecoPointsBalance < donateTokens}
                  className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white font-medium text-xs transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <HeartHandshake className="w-3.5 h-3.5" />
                  <span>Donate {donateTokens} Tokens</span>
                </button>
              </form>
            )}
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-500 leading-snug">
            <strong>NSS IIT Roorkee Guarantee:</strong> 100% of matching grants are audited and directly transferred to the Uttarakhand State Disaster Management Authority.
          </div>
        </div>

      </div>

    </div>
  );
}
