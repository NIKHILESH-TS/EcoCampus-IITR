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
  HeartHandshake, 
  Navigation, 
  Sparkles, 
  Cpu, 
  Trophy, 
  Printer,
  Gavel,
  Landmark,
  Scale,
  Coins,
  PlusCircle,
  ThumbsDown,
  ThumbsUp
} from 'lucide-react';
import { db, SHIFT_TIMINGS, WASTE_TYPES } from '../../services/db';
import { WasteBadge, FillStatusBadge, ComplaintBadge } from '../Common/Badges';
import RouteOptimizer from '../Collection/RouteOptimizer';
import WasteMonitoringDashboard from '../Analytics/WasteMonitoringDashboard';
import IoTSensorSimulator from '../IoT/IoTSensorSimulator';
import FieldCrewPortal from '../Crew/FieldCrewPortal';
import GreenBhawanLeaderboard from '../Leaderboard/GreenBhawanLeaderboard';

export default function AdminPortal({ onOpenPrintQr }) {
  const [activeTab, setActiveTab] = useState('complaints'); 
  // 'complaints' | 'bins' | 'routing' | 'crew_sla' | 'auctions' | 'iot_sim' | 'monitoring' | 'leaderboard'
  
  const [bins, setBins] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [auctionLots, setAuctionLots] = useState([]);
  const [vault, setVault] = useState(db.getVault());
  const [selectedBlock, setSelectedBlock] = useState('All');
  const [searchBin, setSearchBin] = useState('');
  
  // Custom dispatch modal
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [customDispatchNote, setCustomDispatchNote] = useState('');

  // New Auction Lot Modal
  const [isNewLotOpen, setIsNewLotOpen] = useState(false);
  const [newLotTitle, setNewLotTitle] = useState('');
  const [newLotCategory, setNewLotCategory] = useState('recyclable');
  const [newLotWeight, setNewLotWeight] = useState('3200');
  const [newLotReserve, setNewLotReserve] = useState('14.50');
  const [newLotHours, setNewLotHours] = useState('24');
  const [newLotGrade, setNewLotGrade] = useState('Grade A Baled');

  useEffect(() => {
    loadData();
    window.addEventListener('ecocampus_db_change', loadData);
    return () => window.removeEventListener('ecocampus_db_change', loadData);
  }, []);

  const loadData = () => {
    setBins(db.getBins());
    setComplaints(db.getComplaints());
    setAuctionLots(db.getAuctionLots());
    setVault(db.getVault());
  };

  const overflowingCount = bins.filter(b => b.status === 'Overflowing' || b.fillLevel > 80).length;
  const pendingComplaintsCount = complaints.filter(c => c.status === 'pending').length;

  const handleCleanBin = (binId) => {
    db.cleanBin(binId);
  };

  const handleAssignWorker = (complaintId) => {
    db.assignWorkerToComplaint(complaintId, 'USR-003');
  };

  const handleCreateLot = (e) => {
    e.preventDefault();
    db.createAuctionLot({
      title: newLotTitle || `${newLotWeight} kg Baled ${newLotCategory}`,
      category: newLotCategory,
      weightKg: newLotWeight,
      reservePricePerKg: newLotReserve,
      durationHours: newLotHours,
      materialGrade: newLotGrade,
      moisturePercent: '< 8%'
    });
    setIsNewLotOpen(false);
    setNewLotTitle('');
  };

  const handleCloseAuction = (lotId) => {
    const res = db.closeAuctionLot(lotId);
    if (res) {
      alert(`Tender ${lotId} successfully awarded to ${res.lot.highestBidderName}! ₹${res.grossInr.toLocaleString()} added to Campus Circular Vault.`);
    }
  };

  const handleDispatchSquad = (complaint) => {
    const msg = customDispatchNote || `[Estate Office Dispatch] Sanitation Cart #2 dispatched to ${complaint.locationText}. Clearance prioritized.`;
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6 font-sans">
      
      {/* Admin Executive Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-subtle">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] font-bold bg-brand-dark text-white px-2 py-0.5 rounded">
                IITR ESTATE SWM COMMAND
              </span>
              <span className="text-xs text-slate-500 font-medium">Govind Bhawan Pilot (200 Bins) & Campus Fleet</span>
            </div>
            <h2 className="text-base font-semibold text-slate-900 mt-1">
              Operations, Telemetry, Routing & SLA Console
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onOpenPrintQr}
              className="px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-medium text-slate-700 flex items-center gap-1.5 transition-colors"
              title="Print QR label stickers for bins"
            >
              <Printer className="w-3.5 h-3.5 text-slate-600" />
              <span>Print 200 QR Stickers</span>
            </button>

            <div className="bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg text-xs">
              <span className="text-slate-500">Campus Waste:</span>
              <strong className="ml-1 text-slate-900 font-mono">5,500 kg/day</strong>
            </div>
            <div className="bg-rose-50 border border-rose-200 px-3 py-1.5 rounded-lg text-xs">
              <span className="text-rose-700">Urgent Bins:</span>
              <strong className="ml-1 text-rose-900 font-mono">{overflowingCount}</strong>
            </div>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex flex-wrap gap-1 mt-4 text-xs">
          <button
            type="button"
            onClick={() => setActiveTab('complaints')}
            className={`px-3 py-1.5 rounded-lg font-medium flex items-center gap-1.5 transition-colors ${
              activeTab === 'complaints'
                ? 'bg-slate-900 text-white font-semibold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
            <span>Complaints ({complaints.length})</span>
            {pendingComplaintsCount > 0 && (
              <span className="bg-rose-500 text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold ml-1">
                {pendingComplaintsCount}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('bins')}
            className={`px-3 py-1.5 rounded-lg font-medium flex items-center gap-1.5 transition-colors ${
              activeTab === 'bins'
                ? 'bg-slate-900 text-white font-semibold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Trash2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>200 Bins Fleet</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('routing')}
            className={`px-3 py-1.5 rounded-lg font-medium flex items-center gap-1.5 transition-colors ${
              activeTab === 'routing'
                ? 'bg-slate-900 text-white font-semibold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Truck className="w-3.5 h-3.5 text-blue-400" />
            <span>Route Optimization</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('crew_sla')}
            className={`px-3 py-1.5 rounded-lg font-medium flex items-center gap-1.5 transition-colors ${
              activeTab === 'crew_sla'
                ? 'bg-slate-900 text-white font-semibold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Crew Verification & SLA</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('auctions')}
            className={`px-3 py-1.5 rounded-lg font-medium flex items-center gap-1.5 transition-colors ${
              activeTab === 'auctions'
                ? 'bg-slate-900 text-white font-semibold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Gavel className="w-3.5 h-3.5 text-blue-400" />
            <span>B2B Tenders & Vault</span>
            <span className="bg-emerald-500/20 text-emerald-400 text-[10px] px-1.5 py-0.2 rounded font-mono font-bold ml-1">
              ₹{(vault.totalCashInr / 1000).toFixed(0)}k
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('iot_sim')}
            className={`px-3 py-1.5 rounded-lg font-medium flex items-center gap-1.5 transition-colors ${
              activeTab === 'iot_sim'
                ? 'bg-slate-900 text-white font-semibold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Cpu className="w-3.5 h-3.5 text-purple-400" />
            <span>IoT Hardware Simulator</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('monitoring')}
            className={`px-3 py-1.5 rounded-lg font-medium flex items-center gap-1.5 transition-colors ${
              activeTab === 'monitoring'
                ? 'bg-slate-900 text-white font-semibold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5 text-indigo-400" />
            <span>Analytics & Forecasts</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('leaderboard')}
            className={`px-3 py-1.5 rounded-lg font-medium flex items-center gap-1.5 transition-colors ${
              activeTab === 'leaderboard'
                ? 'bg-slate-900 text-white font-semibold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Trophy className="w-3.5 h-3.5 text-amber-500" />
            <span>Hostel Trophy Audit</span>
          </button>
        </div>
      </div>

      {/* TAB 1: Complaints Queue */}
      {activeTab === 'complaints' && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <h3 className="font-semibold text-slate-900 text-sm">
              Student Complaints & Official Dispatch Queue
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Review issues reported by students, dispatch sanitation squad carts, and deliver automatic or customized one-way status updates.
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

                  {/* Verification Status Banner */}
                  {complaint.verificationStatus === 'reported_false' && (
                    <div className="bg-rose-50 border border-rose-200 rounded-lg p-3 space-y-1.5 text-rose-950">
                      <div className="flex items-center gap-1.5 font-semibold text-rose-800">
                        <ThumbsDown className="w-3.5 h-3.5" />
                        <span>Field Squad Confirmed False Alarm (Spam Prevention)</span>
                      </div>
                      <p className="text-[11px] text-rose-700">
                        Inspected by Ramesh Kumar. Bin was completely clean. <strong>25 EcoTokens deducted from student</strong> to protect system integrity.
                      </p>
                      {complaint.workerRemarks && (
                        <div className="text-[10px] italic text-rose-600 bg-white/60 p-1.5 rounded">
                          Worker note: "{complaint.workerRemarks}"
                        </div>
                      )}
                    </div>
                  )}

                  {complaint.verificationStatus === 'verified_legitimate' && (
                    <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 space-y-1 text-emerald-950">
                      <div className="flex items-center gap-1.5 font-semibold text-emerald-800">
                        <ThumbsUp className="w-3.5 h-3.5" />
                        <span>Ground Truth Verified & Restored</span>
                      </div>
                      <p className="text-[11px] text-emerald-700">
                        Student awarded <strong>+35 EcoTokens</strong> for legitimate reporting. Sanitation squad awarded <strong>₹150 weekly bonus</strong>.
                      </p>
                    </div>
                  )}

                  {dispatches.length > 0 && (
                    <div className="space-y-1">
                      <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">
                        One-Way Dispatch Messages Delivered:
                      </span>
                      {dispatches.map(d => (
                        <div key={d.id} className="bg-emerald-50 border border-emerald-200 p-2 rounded text-[11px] text-emerald-950 font-mono">
                          <span className="text-emerald-700 text-[10px] mr-2">[{d.sentAt}]:</span>
                          "{d.messageText}"
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                    <div className="text-[11px] text-slate-500">
                      {complaint.assignedWorkerName ? (
                        <span className="font-medium text-slate-700 flex items-center gap-1">
                          <Truck className="w-3 h-3 text-slate-400" />
                          Assigned: <strong>{complaint.assignedWorkerName}</strong>
                        </span>
                      ) : (
                        <span className="text-amber-700 font-medium">Unassigned</span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      {!complaint.assignedWorkerName && complaint.status !== 'resolved' && complaint.status !== 'false_alarm' && (
                        <button
                          type="button"
                          onClick={() => handleAssignWorker(complaint.id)}
                          className="px-2.5 py-1 rounded text-xs font-medium text-slate-800 bg-slate-100 hover:bg-slate-200 border border-slate-300 transition-colors"
                        >
                          👷 Assign Squad #2
                        </button>
                      )}

                      {complaint.status !== 'resolved' && complaint.status !== 'false_alarm' && (
                        <>
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedComplaint(complaint);
                              setCustomDispatchNote(`[Estate Office Dispatch] Sanitation squad routed to ${complaint.locationText} with covered container cart.`);
                            }}
                            className="px-3 py-1 rounded text-xs font-medium text-amber-900 bg-amber-50 hover:bg-amber-100 border border-amber-300 transition-colors"
                          >
                            🚚 Dispatch Note
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

                      {(complaint.status === 'resolved' || complaint.status === 'false_alarm') && (
                        <span className="text-slate-500 text-[11px] font-mono">
                          Case Closed
                        </span>
                      )}
                    </div>
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
                      <td className="p-3 pl-4 font-mono font-bold text-slate-900">#{b.id}</td>
                      <td className="p-3">
                        <div className="font-medium text-slate-800">{b.block}</div>
                        <div className="text-[10px] text-slate-400">{b.floor}</div>
                      </td>
                      <td className="p-3"><WasteBadge category={b.category} /></td>
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
                      <td className="p-3 font-mono text-slate-700">{b.nextShiftTime}</td>
                      <td className="p-3"><FillStatusBadge status={b.status} fillLevel={b.fillLevel} /></td>
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
          </div>
        </div>
      )}

      {/* TAB 3: Route Optimization */}
      {activeTab === 'routing' && <RouteOptimizer />}

      {/* TAB 4: Field Crew Verification & SLA */}
      {activeTab === 'crew_sla' && <FieldCrewPortal />}

      {/* TAB: B2B Scrap Reverse Auctions & Campus Vault */}
      {activeTab === 'auctions' && (
        <div className="space-y-6">
          {/* Vault Overview Card */}
          <div className="bg-slate-900 text-white rounded-2xl p-6 border border-slate-800 shadow-sm relative overflow-hidden">
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="bg-emerald-500/20 text-emerald-300 font-mono text-[11px] font-bold px-2 py-0.5 rounded border border-emerald-500/30 flex items-center gap-1">
                    <Landmark className="w-3 h-3 text-emerald-400" />
                    CAMPUS CIRCULAR VAULT TREASURY
                  </span>
                  <span className="bg-blue-500/20 text-blue-300 font-mono text-[10px] px-2 py-0.5 rounded">
                    B2B Reverse Auction Clearing
                  </span>
                </div>
                <h3 className="text-xl font-bold tracking-tight text-white">
                  Total Recovered Surplus: ₹{vault.totalCashInr.toLocaleString()}
                </h3>
                <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
                  Gross revenue generated from selling campus cardboard, PET flakes, and scrap metals to certified recyclers (ITC, Nepra). Automatically routed into student and worker pools.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsNewLotOpen(true)}
                className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs flex items-center gap-2 shadow-xs whitespace-nowrap self-start md:self-auto"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Create Weekly Scrap Tender Lot</span>
              </button>
            </div>

            {/* Fund Allocation Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 relative z-10 text-xs">
              <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700">
                <div className="text-[10px] text-emerald-400 font-medium">30% Student Canteen Pool</div>
                <div className="font-mono font-bold text-base text-white mt-0.5">
                  ₹{vault.breakdown.studentCanteenPoolInr.toLocaleString()}
                </div>
                <div className="text-[10px] text-slate-400">Backs Food Vouchers</div>
              </div>

              <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700">
                <div className="text-[10px] text-blue-400 font-medium">30% Worker UPI Bonus Pool</div>
                <div className="font-mono font-bold text-base text-white mt-0.5">
                  ₹{vault.breakdown.workerUpiBonusPoolInr.toLocaleString()}
                </div>
                <div className="text-[10px] text-slate-400">Direct Staff Incentives</div>
              </div>

              <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700">
                <div className="text-[10px] text-amber-400 font-medium">25% Baler & Sensor Upkeep</div>
                <div className="font-mono font-bold text-base text-white mt-0.5">
                  ₹{vault.breakdown.equipmentMaintenanceInr.toLocaleString()}
                </div>
                <div className="text-[10px] text-slate-400">Hardware Self-Funding</div>
              </div>

              <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700">
                <div className="text-[10px] text-rose-400 font-medium">15% Disaster & Flood Relief</div>
                <div className="font-mono font-bold text-base text-white mt-0.5">
                  ₹{vault.breakdown.disasterReliefReserveInr.toLocaleString()}
                </div>
                <div className="text-[10px] text-slate-400">NSS Matching Grant</div>
              </div>
            </div>
          </div>

          {/* Active Scrap Tenders List */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h4 className="font-bold text-slate-900 text-sm">
                  Active Campus Commodity Lots ({auctionLots.length} Total)
                </h4>
                <p className="text-xs text-slate-500">
                  Weekly consignments created by Estate Office for B2B buyer bidding.
                </p>
              </div>
              <span className="text-[11px] font-mono text-slate-400">
                Bidding Duration Managed by Estate Officer
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {auctionLots.map(lot => (
                <div key={lot.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3 text-xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200">
                          {lot.id}
                        </span>
                        <WasteBadge category={lot.category} />
                      </div>
                      <span className={`px-2 py-0.5 rounded font-mono font-bold text-[10px] ${
                        lot.status === 'active' 
                          ? 'bg-amber-100 text-amber-800' 
                          : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {lot.status === 'active' ? 'BIDDING OPEN' : 'AWARDED & CLOSED'}
                      </span>
                    </div>

                    <h5 className="font-semibold text-slate-900 text-sm mt-2">{lot.title}</h5>
                    
                    <div className="grid grid-cols-3 gap-2 mt-2.5 text-[11px]">
                      <div className="bg-white p-2 rounded border border-slate-200">
                        <span className="text-slate-400 block text-[10px]">Net Mass</span>
                        <strong className="font-mono text-slate-800">{lot.weightKg.toLocaleString()} kg</strong>
                      </div>
                      <div className="bg-white p-2 rounded border border-slate-200">
                        <span className="text-slate-400 block text-[10px]">Current Bid</span>
                        <strong className="font-mono text-emerald-700">₹{lot.currentHighestBid.toFixed(2)}/kg</strong>
                      </div>
                      <div className="bg-white p-2 rounded border border-slate-200">
                        <span className="text-slate-400 block text-[10px]">Gross Value</span>
                        <strong className="font-mono text-slate-900">₹{Math.round(lot.weightKg * lot.currentHighestBid).toLocaleString()}</strong>
                      </div>
                    </div>

                    <div className="mt-2.5 p-2 bg-white rounded border border-slate-200 flex items-center justify-between text-[11px]">
                      <span className="text-slate-500">Leading Bidder:</span>
                      <strong className="text-slate-800 truncate max-w-[200px]">{lot.highestBidderName}</strong>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                    <span className="text-[10px] text-slate-400 font-mono">
                      Window: {lot.durationHours} Hours • {lot.bids.length} Bids Logged
                    </span>

                    {lot.status === 'active' ? (
                      <button
                        type="button"
                        onClick={() => handleCloseAuction(lot.id)}
                        className="px-3 py-1 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-medium text-xs flex items-center gap-1 transition-colors"
                      >
                        <Gavel className="w-3 h-3" />
                        <span>Award & Close Tender</span>
                      </button>
                    ) : (
                      <span className="text-emerald-700 font-mono text-[10px] font-bold">
                        Pass: {lot.gatePassNumber}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* New Scrap Tender Modal */}
      {isNewLotOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 border border-slate-200 shadow-xl text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-semibold text-slate-900 text-base">Create Weekly B2B Scrap Tender Lot</h3>
                <span className="text-slate-500 text-[11px]">Post accumulated dry baled scrap for corporate reverse auction</span>
              </div>
              <button onClick={() => setIsNewLotOpen(false)} className="text-slate-400 hover:text-slate-600 font-bold">✕</button>
            </div>

            <form onSubmit={handleCreateLot} className="space-y-3">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Lot Title</label>
                <input
                  type="text"
                  value={newLotTitle}
                  onChange={(e) => setNewLotTitle(e.target.value)}
                  placeholder="e.g. 3,500 kg Compressed Cardboard Bales"
                  className="w-full p-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Net Mass (kg)</label>
                  <input
                    type="number"
                    value={newLotWeight}
                    onChange={(e) => setNewLotWeight(e.target.value)}
                    required
                    className="w-full p-2 border border-slate-300 rounded-lg font-mono"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">Reserve Floor (₹/kg)</label>
                  <input
                    type="number"
                    step="0.50"
                    value={newLotReserve}
                    onChange={(e) => setNewLotReserve(e.target.value)}
                    required
                    className="w-full p-2 border border-slate-300 rounded-lg font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Material Category</label>
                  <select
                    value={newLotCategory}
                    onChange={(e) => setNewLotCategory(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg bg-white"
                  >
                    <option value="recyclable">Paper / Cardboard</option>
                    <option value="recyclable">PET / Polymer Flakes</option>
                    <option value="e_waste">Electronic / PCB Scrap</option>
                    <option value="non_recyclable">Refuse-Derived Fuel (RDF)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">Bidding Window Duration</label>
                  <select
                    value={newLotHours}
                    onChange={(e) => setNewLotHours(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg bg-white font-mono"
                  >
                    <option value="24">24 Hours (Standard)</option>
                    <option value="48">48 Hours (Weekend)</option>
                    <option value="72">72 Hours (Bulk)</option>
                    <option value="168">7 Days (Full Week)</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsNewLotOpen(false)}
                  className="px-3 py-1.5 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium"
                >
                  Publish Tender Lot
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TAB 5: IoT Sensor Hardware Simulator */}
      {activeTab === 'iot_sim' && <IoTSensorSimulator />}

      {/* TAB 6: Analytics & Forecasting */}
      {activeTab === 'monitoring' && <WasteMonitoringDashboard />}

      {/* TAB 7: Inter-Hostel Leaderboard */}
      {activeTab === 'leaderboard' && <GreenBhawanLeaderboard />}

      {/* Dispatch Modal */}
      {selectedComplaint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 border border-slate-200 shadow-card text-xs space-y-4">
            
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="font-semibold text-sm text-slate-900 flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-emerald-700" />
                <span>Dispatch Sanitation Squad • {selectedComplaint.id}</span>
              </div>
              <button onClick={() => setSelectedComplaint(null)} className="text-slate-400 hover:text-slate-700 text-xs font-bold">✕</button>
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
