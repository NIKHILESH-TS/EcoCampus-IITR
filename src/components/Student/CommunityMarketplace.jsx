import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Coins, 
  Search, 
  Filter, 
  CheckCircle2, 
  Tag, 
  Sparkles, 
  BookOpen, 
  Clock,
  ArrowRight,
  ShieldCheck,
  Heart
} from 'lucide-react';
import { db, ITEM_CATEGORIES, CONDITIONS } from '../../services/db';

const PRESET_PHOTOS = [
  { label: 'Academic Books', url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=500&q=80' },
  { label: 'Electric Kettle', url: 'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?auto=format&fit=crop&w=500&q=80' },
  { label: 'Mini Drafter / Board', url: 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&w=500&q=80' },
  { label: 'Campus Bicycle', url: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=500&q=80' },
  { label: 'Inline Roller Skates', url: 'https://images.unsplash.com/photo-1596704017254-9b121068fb31?auto=format&fit=crop&w=500&q=80' },
  { label: 'Gym Shoes / Cleats', url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=500&q=80' },
  { label: 'Study Table / Desk', url: 'https://images.unsplash.com/photo-1541123437800-1bb1317badc2?auto=format&fit=crop&w=500&q=80' },
  { label: 'Lab Coat', url: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=500&q=80' }
];

export default function CommunityMarketplace() {
  const [items, setItems] = useState([]);
  const [user, setUser] = useState(db.getCurrentUser());
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [sortBy, setSortBy] = useState('newest'); // 'newest' | 'price_low' | 'price_high' | 'free_first'
  const [searchQuery, setSearchQuery] = useState('');

  // Add Item Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('academic_books');
  const [newCondition, setNewCondition] = useState('good');
  const [newDesc, setNewDesc] = useState('');
  const [newPhoto, setNewPhoto] = useState(PRESET_PHOTOS[0].url);
  const [isFree, setIsFree] = useState(false);

  // Status message
  const [tradeMessage, setTradeMessage] = useState(null);

  useEffect(() => {
    loadData();
    window.addEventListener('ecocampus_db_change', loadData);
    return () => window.removeEventListener('ecocampus_db_change', loadData);
  }, []);

  const loadData = () => {
    setItems(db.getMarketplaceItems());
    setUser(db.getCurrentUser());
  };

  // Live algorithmic score calculation
  const calculatedPoints = db.calculateItemPoints(newCategory, newCondition, isFree);

  const filteredItems = items
    .filter(item => {
      const matchCat = filterCategory === 'All' || item.category === filterCategory;
      const matchStatus = filterStatus === 'All' || item.status === filterStatus;
      const matchSearch = searchQuery === '' ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.sellerRoom.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchStatus && matchSearch;
    })
    .sort((a, b) => {
      if (sortBy === 'price_low') {
        const pA = a.isFree ? 0 : a.ecoPointsPrice;
        const pB = b.isFree ? 0 : b.ecoPointsPrice;
        return pA - pB;
      }
      if (sortBy === 'price_high') {
        const pA = a.isFree ? 0 : a.ecoPointsPrice;
        const pB = b.isFree ? 0 : b.ecoPointsPrice;
        return pB - pA;
      }
      if (sortBy === 'free_first') {
        if (a.isFree && !b.isFree) return -1;
        if (!a.isFree && b.isFree) return 1;
        return 0;
      }
      // default: newest
      return (b.id || '').localeCompare(a.id || '');
    });

  const handlePostItem = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const res = db.createMarketplaceItem({
      title: newTitle,
      description: newDesc,
      category: newCategory,
      condition: newCondition,
      photoUrl: newPhoto,
      isFree: isFree
    });

    setTradeMessage(`Item listed successfully! +${res.rewardAwarded} EcoPoints credited to your balance.`);
    setIsModalOpen(false);
    setNewTitle('');
    setNewDesc('');
  };

  const handleClaimItem = (item) => {
    const res = db.claimMarketplaceItem(item.id);
    if (!res.success) {
      alert(res.error);
      return;
    }

    setTradeMessage(`Item claimed! Contact ${item.sellerName} at ${item.sellerRoom} to collect it.`);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner & EcoPoints Summary */}
      <div className="bg-white rounded-xl border border-slate-200 p-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3 mb-3">
          <div>
            <h3 className="font-semibold text-slate-900 text-sm">
              Govind Bhawan Community Re-Use & Zero-Waste Exchange
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Trade and give away personal items to prevent hostel landfill waste. Algorithmic EcoPoints reward reuse.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200 text-xs flex items-center gap-2">
              <Coins className="w-3.5 h-3.5 text-emerald-700" />
              <span>Balance: <strong className="font-mono text-emerald-950">{user.ecoPointsBalance} Pts</strong></span>
            </div>

            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="px-3.5 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-medium flex items-center gap-1.5 transition-colors shadow-subtle"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>List Item for Re-Use</span>
            </button>
          </div>
        </div>

        {/* Algorithm details */}
        <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-[11px] text-slate-600 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <span>
            <strong>Smart Point Algorithm:</strong> Points = (BaseCategory × ConditionMultiplier) + AcademicUtilityBonus + AltruismBonus
          </span>
          <span className="text-emerald-800 font-medium">
            Academic books (+15 bonus) • Lab tools (+20 bonus)
          </span>
        </div>
      </div>

      {/* Trade Success Message */}
      {tradeMessage && (
        <div className="bg-emerald-50 border border-emerald-300 rounded-xl p-3 flex items-center justify-between gap-2 text-xs text-emerald-900 animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-700 flex-shrink-0" />
            <span>{tradeMessage}</span>
          </div>
          <button onClick={() => setTradeMessage(null)} className="text-xs font-bold text-emerald-800">
            ✕
          </button>
        </div>
      )}

      {/* Search and Filters */}
      <div className="bg-white p-3 rounded-xl border border-slate-200 flex flex-wrap items-center gap-2 text-xs">
        
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
          <input
            type="text"
            placeholder="Search items by title, category, or room number..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-slate-200 text-xs bg-slate-50 focus:bg-white"
          />
        </div>

        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="p-1.5 rounded-lg border border-slate-200 bg-white text-xs text-slate-700"
        >
          <option value="All">All Categories</option>
          {Object.entries(ITEM_CATEGORIES).map(([k, v]) => (
            <option key={k} value={k}>{v.label}</option>
          ))}
        </select>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="p-1.5 rounded-lg border border-slate-200 bg-white text-xs text-slate-700"
        >
          <option value="All">All Statuses</option>
          <option value="available">Available</option>
          <option value="claimed">Claimed</option>
        </select>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="p-1.5 rounded-lg border border-slate-200 bg-white text-xs text-slate-700 font-medium"
        >
          <option value="newest">Sort: Newest First</option>
          <option value="free_first">Sort: Free Items First</option>
          <option value="price_low">Sort: EcoPoints (Low to High)</option>
          <option value="price_high">Sort: EcoPoints (High to Low)</option>
        </select>

      </div>

      {/* Marketplace Catalog Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredItems.map(item => {
          const isOwner = item.sellerId === user.id;
          const isClaimed = item.status === 'claimed';
          const catInfo = ITEM_CATEGORIES[item.category] || ITEM_CATEGORIES.academic_books;

          return (
            <div 
              key={item.id}
              className={`bg-white rounded-xl border text-xs flex flex-col justify-between overflow-hidden transition-colors ${
                isClaimed ? 'border-slate-200 opacity-60 bg-slate-50/50' : 'border-slate-200 shadow-subtle'
              }`}
            >
              <div>
                {/* Photo */}
                <div className="relative h-40 bg-slate-100 overflow-hidden border-b border-slate-100">
                  <img src={item.photoUrl} alt={item.title} className="w-full h-full object-cover" />
                  
                  <div className="absolute top-2 right-2">
                    <span className="font-mono font-bold text-xs bg-slate-900 text-white px-2 py-0.5 rounded shadow-sm">
                      {item.isFree ? 'FREE' : `${item.ecoPointsPrice} Pts`}
                    </span>
                  </div>

                  <div className="absolute bottom-2 left-2">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded shadow-xs uppercase tracking-wider ${
                      item.condition === 'mint' 
                        ? 'bg-emerald-600 text-white' 
                        : item.condition === 'good'
                        ? 'bg-blue-600 text-white'
                        : 'bg-amber-600 text-white'
                    }`}>
                      {item.condition}
                    </span>
                  </div>
                </div>

                <div className="p-3.5 space-y-2">
                  <div className="text-[10px] font-semibold text-emerald-800 uppercase tracking-wider">
                    {catInfo.label}
                  </div>

                  <h4 className="font-semibold text-slate-900 text-sm leading-snug line-clamp-1">
                    {item.title}
                  </h4>

                  <p className="text-slate-600 text-[11px] line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>

                  <div className="text-[11px] text-slate-500 pt-1 border-t border-slate-100 flex items-center justify-between">
                    <span>Seller: <strong>{item.sellerName}</strong></span>
                    <span className="text-slate-400">📍 {item.sellerRoom}</span>
                  </div>
                </div>
              </div>

              {/* Action */}
              <div className="p-3.5 pt-0">
                {isClaimed ? (
                  <div className="text-center text-[11px] font-medium text-slate-400 py-1 bg-slate-100 rounded">
                    Claimed by {item.claimedBy || 'Hostel Mate'}
                  </div>
                ) : isOwner ? (
                  <div className="text-center text-[11px] font-medium text-emerald-800 py-1 bg-emerald-50 rounded border border-emerald-200">
                    Your Listing
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleClaimItem(item)}
                    className="w-full py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium transition-colors flex items-center justify-center gap-1.5"
                  >
                    <span>{item.isFree ? 'Claim Free Item' : `Trade for ${item.ecoPointsPrice} EcoPoints`}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

            </div>
          );
        })}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-12 px-4 bg-white rounded-xl border border-slate-200 space-y-3">
          <div className="w-10 h-10 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto">
            <Search className="w-5 h-5" />
          </div>
          <h4 className="font-semibold text-slate-900 text-sm">No marketplace items found</h4>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            No active listings match your current filters. Try searching with different keywords or reset filters.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setFilterCategory('All');
              setFilterStatus('All');
              setSortBy('newest');
            }}
            className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-lg transition-colors cursor-pointer"
          >
            Reset All Filters
          </button>
        </div>
      )}

      {/* Add Item Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-5 border border-slate-200 shadow-card text-xs space-y-4">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="font-semibold text-sm text-slate-900 flex items-center gap-1.5">
                <Plus className="w-4 h-4 text-emerald-700" />
                <span>List Personal Item to Give Away or Trade</span>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-700 text-xs font-bold">
                ✕
              </button>
            </div>

            <form onSubmit={handlePostItem} className="space-y-3.5">
              
              <div>
                <label className="block text-slate-700 font-medium mb-1">
                  Item Title:
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Erwin Kreyszig Engineering Mathematics 10th Ed"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-200 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Category:</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-200 text-xs bg-white text-slate-800"
                  >
                    {Object.entries(ITEM_CATEGORIES).map(([k, v]) => (
                      <option key={k} value={k}>{v.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-medium mb-1">Condition:</label>
                  <select
                    value={newCondition}
                    onChange={(e) => setNewCondition(e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-200 text-xs bg-white text-slate-800"
                  >
                    {Object.entries(CONDITIONS).map(([k, v]) => (
                      <option key={k} value={k}>{v.label} ({v.multiplier}x)</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-2 p-2.5 rounded-lg bg-emerald-50 border border-emerald-200">
                <input
                  type="checkbox"
                  id="modalFree"
                  checked={isFree}
                  onChange={(e) => setIsFree(e.target.checked)}
                  className="rounded border-slate-300 text-emerald-700"
                />
                <label htmlFor="modalFree" className="text-xs text-emerald-950 font-medium cursor-pointer">
                  Mark as 100% Free Giveaway (+25 bonus points rewarded to you!)
                </label>
              </div>

              {/* Dynamic Algorithmic Price Output */}
              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 flex items-center justify-between text-xs">
                <span className="text-slate-600">
                  Algorithmic EcoPoints Value:
                </span>
                <span className="font-mono font-bold text-slate-900 bg-white px-2.5 py-1 rounded border border-slate-200">
                  {isFree ? 'FREE' : `${calculatedPoints} EcoPoints`}
                </span>
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Description & Pickup Details:</label>
                <textarea
                  rows={2}
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="e.g. Good condition, pickup from Govind Bhawan Room B-112 after 6 PM..."
                  className="w-full p-2 rounded-lg border border-slate-200 text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1.5">Select Sample Photo:</label>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
                  {PRESET_PHOTOS.map((p, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setNewPhoto(p.url)}
                      className={`relative h-12 rounded overflow-hidden border transition-all ${
                        newPhoto === p.url ? 'ring-2 ring-emerald-600 border-emerald-600' : 'border-slate-200 opacity-70'
                      }`}
                    >
                      <img src={p.url} alt={p.label} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg text-slate-600 hover:bg-slate-100 text-xs font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-medium transition-colors"
                >
                  Publish Item
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
