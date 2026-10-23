import React, { useState, useEffect } from 'react';
import { 
  Trash2, 
  Send, 
  CheckCircle2, 
  BarChart3, 
  Search, 
  Filter, 
  Clock, 
  ShieldCheck, 
  AlertCircle,
  Truck,
  HeartHandshake
} from 'lucide-react';
import { db, SHIFT_TIMINGS, WASTE_TYPES } from '../../services/db';
import { IITR_CAMPUS_BENCHMARKS } from '../../data/iitrCampusData';
import { WasteBadge, FillStatusBadge, ComplaintBadge } from '../Common/Badges';

export default function AdminPortal() {
  const [activeTab, setActiveTab] = useState('complaints'); // 'complaints' | 'bins' | 'market_audit' | 'analytics'
  const [bins, setBins] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [marketItems, setMarketItems] = useState([]);
  
  // Filters for Bins
  const [selectedBlock, setSelectedBlock] = useState('All');
  const [searchBin, setSearchBin] = useState('');
  
  // Custom dispatch modal
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [customDispatchNote, setCustomDispatchNote] = useState('');

  useEffect(() => {
    loadData();
    window.addEventListener('ecocampus_db_change', loadData);
    return () => window.removeEventListener('ecocampus_db_change', loadData);
  }, []);

  const loadData = () => {
    setBins(db.getBins());
    setComplaints(db.getComplaints());
    setMarketItems(db.getMarketplaceItems());
  };

  const overflowingCount = bins.filter(b => b.status === 'Overflowing' || b.fillLevel > 80).length;
  const pendingComplaintsCount = complaints.filter(c => c.status === 'pending').length;

  const handleCleanBin = (binId) => {
    db.cleanBin(binId);
  };

  const handleDispatchSquad = (complaint) => {
    const msg = customDispatchNote || `[Estate Office Dispatch] Sanitation Cart #2 dispatched to ${complaint.locationText}. Waste removal prioritized.`;
    db.updateComplaintStatus(complaint.id, 'in_progress', msg);
    setSelectedComplaint(null);
    setCustomDispatchNote('');
  };

  const handleResolveComplaint = (complaint) => {
    const msg = `[Estate Office Resolution] Cleanliness at ${complaint.locationText} verified and restored. Issue marked resolved.`;
    db.updateComplaintStatus(complaint.id, 'resolved', msg);
  };

  const filteredBins = bins.filter(b => {
    const matchBlock = selectedBlock === 'All' || b.block === selectedBlock;
    const matchSearch = searchBin === '' || 
      b.id.toLowerCase().includes(searchBin.toLowerCase()) ||
      b.locationDetail.toLowerCase().includes(searchBin.toLowerCase());
    return matchBlock && matchSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      
      {/* Admin Executive Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-subtle">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] font-bold bg-slate-900 text-white px-2 py-0.5 rounded">
                IITR ESTATE SWM DESK
              </span>
              <span className="text-xs text-slate-500 font-medium">Govind Bhawan Pilot & Campus Community Bins</span>
            </div>
            <h2 className="text-base font-semibold text-slate-900 mt-1">
              Campus Solid Waste Operations & Dispatch Center
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg text-xs">
              <span className="text-slate-500">Daily Campus Waste:</span>
              <strong className="ml-1 text-slate-900 font-mono">5,500 kg</strong>
            </div>
            <div className="bg-rose-50 border border-rose-200 px-3 py-1.5 rounded-lg text-xs">
              <span className="text-rose-700">Urgent Bins:</span>
              <strong className="ml-1 text-rose-900 font-mono">{overflowingCount} Units</strong>
            </div>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex flex-wrap gap-1 mt-4">
          <button
            type="button"
            onClick={() => setActiveTab('complaints')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              activeTab === 'complaints'
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
            <span>Complaints & Auto-Dispatches ({complaints.length})</span>
            {pendingComplaintsCount > 0 && (
              <span className="bg-rose-500 text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold ml-1">
                {pendingComplaintsCount}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('bins')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              activeTab === 'bins'
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Trash2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Govind Bhawan 200 Bins Fleet</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('market_audit')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              activeTab === 'market_audit'
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <HeartHandshake className="w-3.5 h-3.5 text-blue-400" />
            <span>Community Re-Use Audit ({marketItems.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('analytics')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              activeTab === 'analytics'
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5 text-purple-400" />
            <span>IITR Empirical SWM Analytics (MDPI Study)</span>
          </button>
        </div>
      </div>

      {/* TAB 1: Live Complaints & Dispatch Console */}
      {activeTab === 'complaints' && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <h3 className="font-semibold text-slate-900 text-sm">
              Student Complaints & Official Dispatch Queue
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Review issues filed by students, dispatch sanitation squad carts, and deliver automatic or customized one-way status updates.
            </p>
          </div>

          <div className="space-y-3">
            {complaints.map(complaint => {
              const dispatches = db.getDispatchesForComplaint(complaint.id);
              return (
                <div key={complaint.id} className="bg-white rounded-xl border border-slate-200 p-4 text-xs space-y-3 shadow-subtle">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                          {complaint.id}
                        </span>
                        <span className="font-medium text-slate-800">
                          {complaint.binId ? `Bin #${complaint.binId}` : 'Spot Report'}
                        </span>
                        <WasteBadge category={complaint.category} />
                        <ComplaintBadge status={complaint.status} />
                      </div>
                      <div className="text-slate-600 mt-1">
                        📍 {complaint.locationText} • Reported by: <strong>{complaint.reporterName}</strong>
                      </div>
                    </div>
                    <span className="text-[11px] text-slate-400 font-mono">{complaint.createdAt}</span>
                  </div>

                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 flex items-start gap-3">
                    <img 
                      src={complaint.photoUrl} 
                      alt="Evidence" 
                      className="w-14 h-14 rounded object-cover border border-slate-200 flex-shrink-0"
                    />
                    <div>
                      <div className="font-medium text-slate-900">{complaint.issueType}</div>
                      <p className="text-slate-600 text-[11px] mt-0.5">{complaint.details}</p>
                    </div>
                  </div>

                  {/* Sent One-Way Auto Acknowledgment History */}
                  {dispatches.length > 0 && (
                    <div className="space-y-1">
                      <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">
                        One-Way Dispatch Messages Sent to Student:
                      </span>
                      {dispatches.map(d => (
                        <div key={d.id} className="bg-emerald-50 border border-emerald-200 p-2 rounded text-[11px] text-emerald-950 font-mono">
                          <span className="text-emerald-700 text-[10px] mr-2">[{d.sentAt}]:</span>
                          "{d.messageText}"
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2">
                    {complaint.status !== 'resolved' && (
                      <>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedComplaint(complaint);
                            setCustomDispatchNote(`[Estate Office Dispatch] Sanitation squad routed to ${complaint.locationText} with covered container cart.`);
                          }}
                          className="px-3 py-1 rounded text-xs font-medium text-amber-900 bg-amber-50 hover:bg-amber-100 border border-amber-300 transition-colors"
                        >
                          🚚 Dispatch Crew & Message
                        </button>

                        <button
                          type="button"
                          onClick={() => handleResolveComplaint(complaint)}
                          className="px-3 py-1 rounded text-xs font-medium text-emerald-900 bg-emerald-50 hover:bg-emerald-600 hover:text-white border border-emerald-300 transition-colors"
                        >
                          ✓ Mark Resolved
                        </button>
                      </>
                    )}

                    {complaint.status === 'resolved' && (
                      <span className="text-emerald-800 text-[11px] font-medium">
                        ✓ Completed & Verified by Estate Office
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: Govind Bhawan 200 Dustbins Fleet Control */}
      {activeTab === 'bins' && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 p-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-semibold text-slate-900 text-sm">
                Govind Bhawan Bin Telemetry (200 Units)
              </h3>
              <p className="text-xs text-slate-500">
                Shift schedule: <strong>07:30 AM</strong>, <strong>02:00 PM</strong>, and <strong>08:30 PM</strong>.
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                <input
                  type="text"
                  placeholder="Filter Bin ID..."
                  value={searchBin}
                  onChange={(e) => setSearchBin(e.target.value)}
                  className="pl-8 pr-3 py-1 rounded-lg border border-slate-200 text-xs"
                />
              </div>

              <select
                value={selectedBlock}
                onChange={(e) => setSelectedBlock(e.target.value)}
                className="p-1 rounded-lg border border-slate-200 bg-white text-xs"
              >
                <option value="All">All Wings</option>
                <option value="Block A">Block A</option>
                <option value="Block B">Block B</option>
                <option value="Block C">Block C</option>
                <option value="Block D">Block D</option>
                <option value="Mess & Dining Hall">Mess Wing</option>
                <option value="Central Quadrangle">Quadrangle</option>
              </select>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden text-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[10px]">
                  <tr>
                    <th className="p-3 pl-4">Bin ID</th>
                    <th className="p-3">Location</th>
                    <th className="p-3">Category</th>
                    <th className="p-3">Fill Level</th>
                    <th className="p-3">Next Shift</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 pr-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredBins.slice(0, 30).map(b => (
                    <tr key={b.id} className="hover:bg-slate-50/70">
                      <td className="p-3 pl-4 font-mono font-bold text-slate-900">
                        #{b.id}
                      </td>
                      <td className="p-3">
                        <div className="font-medium text-slate-800">{b.block}</div>
                        <div className="text-[10px] text-slate-400">{b.floor}</div>
                      </td>
                      <td className="p-3">
                        <WasteBadge category={b.category} />
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full ${
                                b.fillLevel > 80 ? 'bg-rose-500' :
                                b.fillLevel > 60 ? 'bg-amber-500' : 'bg-emerald-500'
                              }`}
                              style={{ width: `${b.fillLevel}%` }}
                            />
                          </div>
                          <span className="font-mono text-[10px]">{b.fillLevel}%</span>
                        </div>
                      </td>
                      <td className="p-3 font-mono text-slate-700">
                        {b.nextShiftTime}
                      </td>
                      <td className="p-3">
                        <FillStatusBadge status={b.status} fillLevel={b.fillLevel} />
                      </td>
                      <td className="p-3 pr-4 text-right">
                        {b.fillLevel > 30 ? (
                          <button
                            type="button"
                            onClick={() => handleCleanBin(b.id)}
                            className="px-2 py-0.5 rounded text-[11px] font-medium text-emerald-800 bg-emerald-50 hover:bg-emerald-600 hover:text-white border border-emerald-200 transition-colors"
                          >
                            Mark Cleaned
                          </button>
                        ) : (
                          <span className="text-[11px] text-slate-400">✓ In Spec</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-3 bg-slate-50 border-t border-slate-100 text-slate-500 text-[11px] flex justify-between px-4">
              <span>Showing 30 of {filteredBins.length} bins</span>
              <span>Total Govind Bhawan Pilot: 200 Units</span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Community Re-Use Audit */}
      {activeTab === 'market_audit' && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <h3 className="font-semibold text-slate-900 text-sm">
              Govind Bhawan Community Re-Use Audit
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Monitor circular economy activity, items saved from move-out trash, and student EcoPoints circulation.
            </p>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden text-xs">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[10px]">
                <tr>
                  <th className="p-3 pl-4">Item ID</th>
                  <th className="p-3">Title</th>
                  <th className="p-3">Seller</th>
                  <th className="p-3">Condition</th>
                  <th className="p-3">Price</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 pr-4">Claimed By</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {marketItems.map(item => (
                  <tr key={item.id} className="hover:bg-slate-50/70">
                    <td className="p-3 pl-4 font-mono font-bold text-slate-900">{item.id}</td>
                    <td className="p-3 font-medium text-slate-800">{item.title}</td>
                    <td className="p-3 text-slate-600">{item.sellerName} ({item.sellerRoom.split(',')[1]})</td>
                    <td className="p-3 capitalize">{item.condition}</td>
                    <td className="p-3 font-mono font-semibold">{item.isFree ? 'FREE' : `${item.ecoPointsPrice} Pts`}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-medium border ${
                        item.status === 'claimed' ? 'bg-slate-100 text-slate-600 border-slate-200' : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      }`}>
                        {item.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="p-3 pr-4 text-slate-600">{item.claimedBy || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: IITR Empirical SWM Analytics (MDPI 2019 Study Data) */}
      {activeTab === 'analytics' && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <h3 className="font-semibold text-slate-900 text-sm">
              IIT Roorkee Empirical Solid Waste Profile
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Empirical data from the 2019 MDPI study: 365 acres, 12,000 population, 5,500 kg/day total solid waste.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
            {IITR_CAMPUS_BENCHMARKS.sourceBreakdown.map((src, idx) => (
              <div key={idx} className="bg-white p-3.5 rounded-xl border border-slate-200 text-xs">
                <div className="text-slate-500 text-[11px] truncate">{src.source.split('(')[0]}</div>
                <div className="font-bold text-lg text-slate-900 font-mono mt-1">{src.kgPerDay} kg</div>
                <div className="text-[11px] text-emerald-800 font-medium">{src.percent}% of campus</div>
              </div>
            ))}
          </div>

          {/* Detailed Typology table */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden text-xs">
            <div className="p-3 border-b border-slate-100 font-semibold text-slate-800">
              Waste Typology & Target Processing Destination
            </div>
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-slate-500 font-semibold uppercase text-[10px]">
                <tr>
                  <th className="p-3 pl-4">Waste Type</th>
                  <th className="p-3">Daily (kg)</th>
                  <th className="p-3">Share (%)</th>
                  <th className="p-3 pr-4">Assigned Processing / Recovery Unit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {IITR_CAMPUS_BENCHMARKS.typologyBreakdown.map((t, idx) => (
                  <tr key={idx} className="hover:bg-slate-50">
                    <td className="p-3 pl-4 font-medium text-slate-800">{t.type}</td>
                    <td className="p-3 font-mono font-bold text-slate-900">{t.kgPerDay} kg</td>
                    <td className="p-3 font-mono text-slate-600">{t.percent}%</td>
                    <td className="p-3 pr-4 text-emerald-800">{t.destination}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Dispatch Modal */}
      {selectedComplaint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 border border-slate-200 shadow-card text-xs space-y-4">
            
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="font-semibold text-sm text-slate-900 flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-emerald-700" />
                <span>Dispatch Sanitation Squad • {selectedComplaint.id}</span>
              </div>
              <button onClick={() => setSelectedComplaint(null)} className="text-slate-400 hover:text-slate-700 text-xs font-bold">
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 space-y-1">
                <div>Location: <strong>{selectedComplaint.locationText}</strong></div>
                <div>Issue: <strong>{selectedComplaint.issueType}</strong></div>
                <div>Assigned Squad: <strong className="text-emerald-800">{WASTE_TYPES[selectedComplaint.category]?.assignedSquad}</strong></div>
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">
                  Custom One-Way Message Delivered to Student:
                </label>
                <textarea
                  rows={3}
                  value={customDispatchNote}
                  onChange={(e) => setCustomDispatchNote(e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-200 text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSelectedComplaint(null)}
                  className="px-3 py-1.5 rounded-lg text-slate-600 hover:bg-slate-100 text-xs"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => handleDispatchSquad(selectedComplaint)}
                  className="px-4 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium"
                >
                  Confirm Dispatch
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
