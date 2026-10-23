import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Coins, 
  Plus, 
  Tag, 
  CheckCircle2, 
  Search, 
  ArrowRight, 
  Layers, 
  Camera, 
  BookOpen, 
  Zap, 
  Laptop, 
  Armchair, 
  Bike, 
  Compass, 
  Leaf,
  Info,
  HeartHandshake
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { store } from '../../services/store';
import { ITEM_CATEGORIES, CONDITIONS, calculateEcoPoints } from '../../services/ecoPointAlgorithm';

// Preset sample photos for easy item listing during demos
const SAMPLE_ITEM_PHOTOS = [
  { name: 'Textbook / Notes', url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80' },
  { name: 'Electric Kettle', url: 'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?auto=format&fit=crop&w=600&q=80' },
  { name: 'Mini Drafter / Board', url: 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&w=600&q=80' },
  { name: 'Campus Bicycle', url: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=600&q=80' },
  { name: 'Bedside Table', url: 'https://images.unsplash.com/photo-1541123437800-1bb1317badc2?auto=format&fit=crop&w=600&q=80' },
  { name: 'Lab Coat', url: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=600&q=80' }
];

export default function GovindBhawanReUseMarket() {
  const [listings, setListings] = useState([]);
  const [user, setUser] = useState(store.getUser());
  const [filterCategory, setFilterCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Listing modal
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [newItemTitle, setNewItemTitle] = useState('');
  const [newItemCategory, setNewItemCategory] = useState('academic_books');
  const [newItemCondition, setNewItemCondition] = useState('good');
  const [newItemDesc, setNewItemDesc] = useState('');
  const [newItemPhoto, setNewItemPhoto] = useState(SAMPLE_ITEM_PHOTOS[0].url);
  const [isFreeGiveaway, setIsFreeGiveaway] = useState(false);

  // Claim notification
  const [claimSuccessMsg, setClaimSuccessMsg] = useState(null);

  useEffect(() => {
    loadData();
    window.addEventListener('iitr_store_update', loadData);
    return () => window.removeEventListener('iitr_store_update', loadData);
  }, []);

  const loadData = () => {
    setListings(store.getListings());
    setUser(store.getUser());
  };

  // Dynamic algorithmic point calculation preview
  const liveAlgoResult = calculateEcoPoints(newItemCategory, newItemCondition, isFreeGiveaway);

  const filteredListings = listings.filter(item => {
    const matchCat = filterCategory === 'All' || item.category === filterCategory;
    const matchSearch = searchQuery === '' || 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.ownerRoom.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  const handleCreateListing = (e) => {
    e.preventDefault();
    if (!newItemTitle.trim()) return;

    const listing = {
      title: newItemTitle,
      category: newItemCategory,
      condition: newItemCondition,
      ecoPoints: liveAlgoResult.finalPoints,
      carbonOffsetKg: liveAlgoResult.breakdown.carbonOffsetKg,
      wasteSavedKg: liveAlgoResult.breakdown.wasteDivertedKg,
      description: newItemDesc || 'Pre-owned item in Govind Bhawan offered for circular re-use.',
      photoUrl: newItemPhoto,
      ownerName: user.name,
      ownerRoom: `${user.hostel}, ${user.room}`,
      ownerEmail: user.email,
      isFreeGiveaway: isFreeGiveaway
    };

    store.addListing(listing);

    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 }
      });
    } catch (e) {}

    setIsAddingItem(false);
    setNewItemTitle('');
    setNewItemDesc('');
    setClaimSuccessMsg(`Item listed successfully! You earned +${liveAlgoResult.finalPoints} EcoPoints via the Sustainability Algorithm.`);
  };

  const handleClaim = (item) => {
    const res = store.claimListing(item.id);
    if (!res.success) {
      alert(res.error);
      return;
    }

    try {
      confetti({
        particleCount: 40,
        spread: 50,
        origin: { y: 0.6 }
      });
    } catch (e) {}

    setClaimSuccessMsg(`Congratulations! You claimed "${item.title}". Contact ${item.ownerName} at ${item.ownerRoom} to collect it. Waste diverted: ${item.wasteSavedKg} kg.`);
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* Hallmark Header Banner */}
      <div className="bg-gradient-to-r from-hallmark-dark via-hallmark-primary to-emerald-800 rounded-3xl p-6 sm:p-8 text-white shadow-lifted relative overflow-hidden">
        <div className="max-w-3xl relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-emerald-200 text-xs font-medium mb-3 backdrop-blur-sm border border-white/10">
            <HeartHandshake className="w-3.5 h-3.5 text-amber-300" />
            <span>Govind Bhawan Circular Economy & Zero-Waste Exchange</span>
          </div>

          <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight">
            Give Away & Trade Personal Items — Zero Waste in Govind Bhawan
          </h2>
          <p className="text-emerald-100/90 text-sm mt-2 leading-relaxed">
            Don't throw away usable textbooks, kettles, lab coats, furniture, or bicycles at semester end. 
            List them for your fellow Govind Bhawan residents! Our <strong>Smart Point Assignment Algorithm</strong> calculates instant EcoPoints based on item condition, embodied carbon offset, and academic utility.
          </p>

          {/* User Points Bar */}
          <div className="mt-5 pt-4 border-t border-emerald-600/40 flex flex-wrap items-center gap-4 text-xs">
            <div className="flex items-center gap-2 bg-white/15 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/20">
              <Coins className="w-4 h-4 text-amber-300" />
              <span>Your Balance: <strong className="text-amber-300 text-sm font-mono">{user.ecoPoints}</strong> EcoPoints</span>
            </div>

            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/15">
              <Leaf className="w-4 h-4 text-emerald-300" />
              <span>Personal Waste Diverted: <strong className="text-emerald-300 text-sm font-mono">{user.wasteDivertedKg} kg</strong></span>
            </div>

            <button
              onClick={() => setIsAddingItem(true)}
              className="ml-auto inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-all shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>List Item to Give Away / Trade</span>
            </button>
          </div>
        </div>
      </div>

      {/* Claim / List Success Message Banner */}
      {claimSuccessMsg && (
        <div className="bg-emerald-50 border-2 border-emerald-300 rounded-3xl p-5 shadow-soft flex items-start justify-between gap-4 animate-fadeIn">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-700 flex-shrink-0 mt-0.5" />
            <p className="text-xs sm:text-sm text-emerald-950 font-medium">
              {claimSuccessMsg}
            </p>
          </div>
          <button onClick={() => setClaimSuccessMsg(null)} className="text-xs font-bold text-emerald-800">
            ✕
          </button>
        </div>
      )}

      {/* Algorithm Explainer Box */}
      <div className="bg-white rounded-3xl p-5 border border-hallmark-border shadow-soft">
        <div className="flex items-center gap-2 text-xs font-bold text-hallmark-dark uppercase tracking-wider mb-2">
          <Sparkles className="w-4 h-4 text-amber-600" />
          <span>SOCIOTHON 2026 Smart Point Assignment Algorithm</span>
        </div>
        <p className="text-xs text-slate-600 leading-relaxed">
          Points are computed deterministically using the formula:
        </p>
        <div className="bg-hallmark-cream/80 p-3 rounded-2xl border border-hallmark-border/70 my-2 text-xs font-mono text-hallmark-dark flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <span>Points = [BaseCategory × ConditionMultiplier × (1 + EmbodiedCarbonKg / 30)] + AcademicUtilityBonus + AltruismBonus</span>
          <span className="text-[11px] text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full font-sans font-semibold">
            Zero Landfill Incentivized
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] text-slate-500 pt-1">
          <div>📚 Books: 60 base pts (+15 academic)</div>
          <div>💻 Electronics: 80 base pts (+18.5 kg CO2)</div>
          <div>🚲 Bicycles: 85 base pts (+28 kg CO2)</div>
          <div>📐 Lab Tools: 50 base pts (+20 academic)</div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-3xl p-5 border border-hallmark-border shadow-soft flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search items by name, category, or Govind Bhawan room..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-2xl border border-slate-200 text-xs focus:outline-none focus:ring-1 focus:ring-hallmark-primary bg-slate-50/50"
          />
        </div>

        <div className="flex items-center gap-2">
          <label className="text-xs text-slate-500 font-medium">Category:</label>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="p-2 rounded-xl border border-slate-200 text-xs bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-hallmark-primary"
          >
            <option value="All">All Categories</option>
            <option value="academic_books">Textbooks & Notes</option>
            <option value="appliances">Appliances & Kettles</option>
            <option value="drawing_lab_gear">Lab Gear & Drafters</option>
            <option value="sports_mobility">Cycles & Sports</option>
            <option value="room_furniture">Furniture & Tables</option>
          </select>
        </div>
      </div>

      {/* Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredListings.map(item => {
          const catInfo = ITEM_CATEGORIES[item.category] || ITEM_CATEGORIES.academic_books;
          const condInfo = CONDITIONS[item.condition] || CONDITIONS.good;
          const isOwner = item.ownerEmail === user.email;
          const isClaimed = item.status === 'Claimed';

          return (
            <div 
              key={item.id}
              className={`bg-white rounded-3xl p-5 border transition-all card-hover flex flex-col justify-between ${
                isClaimed ? 'border-slate-200 opacity-60 bg-slate-50' : 'border-hallmark-border shadow-soft'
              }`}
            >
              <div>
                {/* Photo & Status Badge */}
                <div className="relative h-44 rounded-2xl overflow-hidden border border-slate-200 mb-3 bg-slate-100">
                  <img src={item.photoUrl} alt={item.title} className="w-full h-full object-cover" />
                  
                  {isClaimed ? (
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center">
                      <span className="font-bold text-white text-xs bg-slate-800 px-3 py-1 rounded-full uppercase tracking-wider">
                        ✓ Re-Used & Claimed
                      </span>
                    </div>
                  ) : (
                    <div className="absolute top-2.5 right-2.5">
                      <span className="inline-flex items-center gap-1 font-bold text-xs bg-amber-400 text-slate-950 px-2.5 py-1 rounded-xl shadow-md">
                        <Coins className="w-3.5 h-3.5" />
                        {item.isFreeGiveaway ? 'FREE' : `${item.ecoPoints} Pts`}
                      </span>
                    </div>
                  )}

                  <div className="absolute bottom-2 left-2">
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${condInfo.badge}`}>
                      {condInfo.label}
                    </span>
                  </div>
                </div>

                <div className="text-[11px] font-medium text-emerald-800 uppercase tracking-wider mb-1">
                  {catInfo.label.split('&')[0]}
                </div>

                <h4 className="font-display font-bold text-base text-hallmark-dark leading-snug line-clamp-2">
                  {item.title}
                </h4>

                <p className="text-xs text-slate-500 mt-1.5 line-clamp-2 leading-relaxed">
                  {item.description}
                </p>

                {/* Impact metrics pill */}
                <div className="mt-3 py-2 px-3 rounded-2xl bg-hallmark-cream/70 border border-hallmark-border/60 flex items-center justify-between text-[11px] text-slate-600">
                  <span className="flex items-center gap-1">
                    <Leaf className="w-3 h-3 text-emerald-600" />
                    Avoids <strong>{item.carbonOffsetKg} kg CO2</strong>
                  </span>
                  <span>
                    Saves <strong>{item.wasteSavedKg} kg waste</strong>
                  </span>
                </div>

                <div className="mt-3 text-xs text-slate-500 space-y-0.5">
                  <div className="truncate">Listed by: <strong>{item.ownerName}</strong></div>
                  <div className="text-slate-400 truncate">📍 {item.ownerRoom}</div>
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-4 pt-3 border-t border-slate-100">
                {isClaimed ? (
                  <div className="text-center text-xs text-slate-400 font-medium py-1">
                    Claimed by {item.claimedBy || 'Hostel Mate'}
                  </div>
                ) : isOwner ? (
                  <div className="text-center text-xs text-emerald-800 font-medium bg-emerald-50 py-1.5 rounded-xl border border-emerald-200">
                    Your Listing (+{item.ecoPoints} pts credited)
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleClaim(item)}
                    className="w-full py-2.5 rounded-xl text-xs font-semibold text-white bg-hallmark-primary hover:bg-hallmark-dark transition-all shadow-sm flex items-center justify-center gap-1.5"
                  >
                    <span>{item.isFreeGiveaway ? 'Claim Free Item' : `Trade for ${item.ecoPoints} EcoPoints`}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

            </div>
          );
        })}
      </div>

      {/* Add Item Modal */}
      {isAddingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-lifted border border-hallmark-border font-sans max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                  <Plus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-lg text-slate-900">
                    Give Away or Trade Item in Govind Bhawan
                  </h3>
                  <p className="text-xs text-slate-500">
                    Promote circular re-use • Earn algorithmic EcoPoints
                  </p>
                </div>
              </div>
              <button onClick={() => setIsAddingItem(false)} className="text-slate-400 hover:text-slate-700 text-sm">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateListing} className="mt-4 space-y-4 text-xs">
              
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Item Name / Title:
                </label>
                <input
                  type="text"
                  required
                  value={newItemTitle}
                  onChange={(e) => setNewItemTitle(e.target.value)}
                  placeholder="e.g. Erwin Kreyszig Engineering Mathematics 10th Ed"
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-1 focus:ring-hallmark-primary"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Category:
                  </label>
                  <select
                    value={newItemCategory}
                    onChange={(e) => setNewItemCategory(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-hallmark-primary"
                  >
                    {Object.entries(ITEM_CATEGORIES).map(([key, cat]) => (
                      <option key={key} value={key}>{cat.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Condition:
                  </label>
                  <select
                    value={newItemCondition}
                    onChange={(e) => setNewItemCondition(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-hallmark-primary"
                  >
                    {Object.entries(CONDITIONS).map(([key, cond]) => (
                      <option key={key} value={key}>{cond.label} ({cond.multiplier}x multiplier)</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Free giveaway toggle */}
              <div className="flex items-center gap-2 p-3 rounded-2xl bg-amber-50 border border-amber-200">
                <input
                  type="checkbox"
                  id="freeGiveaway"
                  checked={isFreeGiveaway}
                  onChange={(e) => setIsFreeGiveaway(e.target.checked)}
                  className="w-4 h-4 text-hallmark-primary rounded border-slate-300 focus:ring-hallmark-primary"
                />
                <label htmlFor="freeGiveaway" className="text-xs text-amber-900 font-medium cursor-pointer">
                  <strong>Mark as 100% Free Altruistic Giveaway</strong> (+15 bonus community points awarded!)
                </label>
              </div>

              {/* Algorithmic Score Preview Box */}
              <div className="bg-emerald-50/80 p-4 rounded-2xl border border-emerald-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-emerald-950 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    Algorithmic EcoPoints Calculated:
                  </span>
                  <span className="font-mono text-base font-bold text-emerald-800 bg-white px-3 py-0.5 rounded-xl border border-emerald-300 shadow-sm">
                    {liveAlgoResult.finalPoints} EcoPoints
                  </span>
                </div>
                <div className="text-[11px] text-emerald-800 font-mono leading-relaxed bg-white/60 p-2 rounded-xl">
                  {liveAlgoResult.formulaString}
                </div>
                <div className="flex items-center justify-between text-[11px] text-emerald-700 pt-1">
                  <span>Carbon Offset: <strong>{liveAlgoResult.breakdown.carbonOffsetKg} kg CO2e</strong></span>
                  <span>Hostel Landfill Prevented: <strong>{liveAlgoResult.breakdown.wasteDivertedKg} kg</strong></span>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Short Description / Hostel Location:
                </label>
                <textarea
                  rows={2}
                  value={newItemDesc}
                  onChange={(e) => setNewItemDesc(e.target.value)}
                  placeholder="e.g. Excellent working condition, pickup from Govind Bhawan Room B-112 after 6 PM..."
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-1 focus:ring-hallmark-primary"
                />
              </div>

              {/* Photo Selector */}
              <div>
                <span className="block font-semibold text-slate-700 mb-1.5">
                  Select Item Photo:
                </span>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {SAMPLE_ITEM_PHOTOS.map((pic, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setNewItemPhoto(pic.url)}
                      className={`relative h-14 rounded-xl overflow-hidden border transition-all ${
                        newItemPhoto === pic.url ? 'ring-2 ring-emerald-600 border-emerald-600 scale-105' : 'border-slate-200 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={pic.url} alt={pic.name} className="w-full h-full object-cover" />
                      <div className="absolute inset-x-0 bottom-0 bg-black/60 text-[8px] text-white p-0.5 truncate text-center">
                        {pic.name.split(' ')[0]}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddingItem(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl text-white font-semibold bg-hallmark-primary hover:bg-hallmark-dark transition-all shadow-sm flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Publish Item & Earn {liveAlgoResult.finalPoints} Pts</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
