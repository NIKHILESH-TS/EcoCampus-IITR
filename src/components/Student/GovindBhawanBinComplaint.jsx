import React, { useState, useEffect } from 'react';
import { 
  Trash2, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  Filter, 
  Search, 
  ChevronRight, 
  Send, 
  Camera, 
  Sparkles,
  Info,
  Calendar,
  Layers,
  ArrowUpRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { store } from '../../services/store';
import { CLEANING_SHIFTS, WASTE_CATEGORIES } from '../../data/govindBhawanBins';
import { WasteCategoryBadge, BinStatusBadge, ComplaintStatusBadge } from '../Common/StatusBadge';

export default function GovindBhawanBinComplaint() {
  const [bins, setBins] = useState([]);
  const [selectedBlock, setSelectedBlock] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Complaint modal state
  const [reportingBin, setReportingBin] = useState(null);
  const [complaintReason, setComplaintReason] = useState('Bin uncleaned as per morning 07:30 AM schedule');
  const [complaintNote, setComplaintNote] = useState('');
  const [complaintPhoto, setComplaintPhoto] = useState(null);
  const [recentAck, setRecentAck] = useState(null);

  // My complaints tab
  const [showMyComplaints, setShowMyComplaints] = useState(false);
  const [myComplaints, setMyComplaints] = useState([]);

  useEffect(() => {
    loadData();
    window.addEventListener('iitr_store_update', loadData);
    return () => window.removeEventListener('iitr_store_update', loadData);
  }, []);

  const loadData = () => {
    setBins(store.getBins());
    const allC = store.getComplaints();
    setMyComplaints(allC.filter(c => c.type.includes('Govind')));
  };

  const filteredBins = bins.filter(bin => {
    const matchBlock = selectedBlock === 'All' || bin.block === selectedBlock;
    const matchCategory = selectedCategory === 'All' || bin.category === selectedCategory;
    const matchStatus = selectedStatus === 'All' || bin.status === selectedStatus;
    const matchSearch = searchQuery === '' || 
      bin.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bin.locationDetail.toLowerCase().includes(searchQuery.toLowerCase());
    return matchBlock && matchCategory && matchStatus && matchSearch;
  });

  const handleOpenReport = (bin) => {
    setReportingBin(bin);
    setRecentAck(null);
    setComplaintNote(`Observed near ${bin.locationDetail}. Fill level looks full and needs scheduled clearance.`);
  };

  const handlePhotoSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setComplaintPhoto(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitComplaint = (e) => {
    e.preventDefault();
    if (!reportingBin) return;

    const user = store.getUser();
    const ackMessage = `[IITR Administration Auto-Ack] Complaint logged for Bin #${reportingBin.id} (${reportingBin.block}, ${reportingBin.floor}). The ${reportingBin.dispatchTeam} has received this alert. Sanitation squad dispatch scheduled within 45 mins. Thank you ${user.name}!`;

    const complaintData = {
      type: 'Govind Bhawan Bin',
      binId: reportingBin.id,
      location: reportingBin.locationDetail,
      category: reportingBin.category,
      reportedBy: `${user.name} (${user.room})`,
      reportedEmail: user.email,
      issueType: complaintReason + (complaintNote ? ` - Note: ${complaintNote}` : ''),
      photoUrl: complaintPhoto || 'https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?auto=format&fit=crop&w=600&q=80',
      status: 'Dispatched to Crew',
      aiClassification: {
        tag: WASTE_CATEGORIES[reportingBin.category]?.name || 'Solid Waste',
        confidence: 95,
        category: reportingBin.category,
        collectionGroup: reportingBin.dispatchTeam
      },
      adminAcknowledgment: {
        sentAt: 'Just now',
        message: ackMessage,
        adminOfficer: 'Campus Chief Sanitation Officer'
      }
    };

    store.addComplaint(complaintData);

    // Confetti effect for community contribution
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 }
      });
    } catch (e) {}

    setRecentAck({
      binId: reportingBin.id,
      message: ackMessage,
      ptsAwarded: 15
    });

    setReportingBin(null);
    setComplaintPhoto(null);
  };

  return (
    <div className="space-y-6">
      
      {/* Hallmark Header Banner */}
      <div className="bg-gradient-to-r from-hallmark-dark via-hallmark-primary to-emerald-800 rounded-3xl p-6 sm:p-8 text-white shadow-lifted relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-96 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent pointer-events-none" />
        
        <div className="max-w-3xl relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-emerald-200 text-xs font-medium mb-3 backdrop-blur-sm border border-white/10">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Pilot Hostel: Govind Bhawan (200 Smart Numbered Dustbins)</span>
          </div>

          <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight">
            Govind Bhawan Dustbin Monitor & Cleanliness Reports
          </h2>
          <p className="text-emerald-100/90 text-sm mt-2 leading-relaxed font-sans">
            Monitor real-time fill levels of all 200 dustbins in Govind Bhawan across 4 blocks and the mess. 
            If a bin is overflowing or uncleaned past its scheduled shift, file a 1-click report to automatically trigger collection crews with instant administrative acknowledgment.
          </p>

          {/* Assumed Cleaning Timings Card */}
          <div className="mt-6 pt-5 border-t border-emerald-600/50">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-300 mb-3">
              <Clock className="w-4 h-4" />
              <span>Assumed Daily Cleaning Timings (Govind Bhawan Sanitation Roster)</span>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {CLEANING_SHIFTS.map((shift, idx) => (
                <div key={idx} className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/15">
                  <div className="flex items-center justify-between text-xs font-medium text-emerald-200">
                    <span>{shift.shift}</span>
                    <span className="font-mono text-amber-300 font-bold bg-amber-400/20 px-2 py-0.5 rounded-full text-[11px]">{shift.time}</span>
                  </div>
                  <div className="text-[11px] text-emerald-100/80 mt-1 leading-snug">
                    {shift.focus}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Instant Notification Banner if a recent complaint was submitted */}
      {recentAck && (
        <div className="bg-emerald-50 border-2 border-emerald-300 rounded-3xl p-5 shadow-soft flex items-start gap-4 animate-fadeIn">
          <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center flex-shrink-0 shadow-sm">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div className="flex-1 text-sm font-sans">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-emerald-950 font-display">
                Automated Administrator Message Dispatched
              </h4>
              <span className="text-xs font-mono font-semibold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                +{recentAck.ptsAwarded} EcoPoints Earned!
              </span>
            </div>
            <p className="text-emerald-900 mt-1 text-xs sm:text-sm bg-white/80 p-3 rounded-xl border border-emerald-200 font-mono">
              "{recentAck.message}"
            </p>
            <div className="mt-2 flex items-center gap-3 text-xs text-emerald-700">
              <span>Status: <strong className="text-emerald-900">Queued in Sanitation Control Desk</strong></span>
              <span>•</span>
              <button 
                onClick={() => setShowMyComplaints(true)}
                className="font-medium underline hover:text-emerald-950"
              >
                View in My Active Complaints →
              </button>
            </div>
          </div>
          <button 
            onClick={() => setRecentAck(null)} 
            className="text-emerald-700 hover:text-emerald-950 text-xs font-bold px-2 py-1"
          >
            ✕
          </button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-3xl p-5 border border-hallmark-border shadow-soft space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search by Bin ID (#GB-042) or Location (Block C, Mess...)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-hallmark-primary/30 text-sm bg-slate-50/60"
            />
          </div>

          {/* Toggle between 200 Bins and My Past Complaints */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowMyComplaints(false)}
              className={`px-4 py-2 rounded-2xl text-xs font-medium transition-all ${
                !showMyComplaints
                  ? 'bg-hallmark-primary text-white shadow-sm'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              All 200 Dustbins ({bins.length})
            </button>
            <button
              onClick={() => setShowMyComplaints(true)}
              className={`px-4 py-2 rounded-2xl text-xs font-medium transition-all relative ${
                showMyComplaints
                  ? 'bg-hallmark-primary text-white shadow-sm'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              My Complaints Log ({myComplaints.length})
              {myComplaints.length > 0 && (
                <span className="ml-1.5 px-1.5 py-0.2 bg-amber-500 text-white rounded-full text-[10px]">
                  {myComplaints.length}
                </span>
              )}
            </button>
          </div>

        </div>

        {/* Filter Pills */}
        {!showMyComplaints && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-100 text-xs">
            
            {/* Block Filter */}
            <div>
              <label className="text-slate-500 font-medium block mb-1">Hostel Block / Wing:</label>
              <select
                value={selectedBlock}
                onChange={(e) => setSelectedBlock(e.target.value)}
                className="w-full p-2 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-1 focus:ring-hallmark-primary"
              >
                <option value="All">All Govind Bhawan Wings</option>
                <option value="Block A">Block A</option>
                <option value="Block B">Block B</option>
                <option value="Block C">Block C</option>
                <option value="Block D">Block D</option>
                <option value="Mess & Dining Hall">Mess & Dining Hall</option>
                <option value="Central Quadrangle & Lawns">Central Quadrangle & Lawns</option>
              </select>
            </div>

            {/* Category Filter */}
            <div>
              <label className="text-slate-500 font-medium block mb-1">Waste Stream Type:</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full p-2 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-1 focus:ring-hallmark-primary"
              >
                <option value="All">All Streams (Bio, Recyclable, E-Waste...)</option>
                <option value="biodegradable">Bio-Degradable / Organic (Green)</option>
                <option value="recyclable">Recyclable Dry (Blue)</option>
                <option value="non-recyclable">Non-Recyclable Inert (Grey)</option>
                <option value="e-waste">E-Waste Scrap (Orange)</option>
                <option value="hazardous">Hazardous / Glass (Red)</option>
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <label className="text-slate-500 font-medium block mb-1">Cleanliness / Fill Status:</label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full p-2 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-1 focus:ring-hallmark-primary"
              >
                <option value="All">All Statuses</option>
                <option value="Overflowing">⚠️ Overflowing (&gt;85% Full)</option>
                <option value="Needs Attention">⚡ Needs Attention (65-85%)</option>
                <option value="Moderate">Moderate (35-65%)</option>
                <option value="Cleaned">✓ Cleaned (&lt;35%)</option>
              </select>
            </div>

          </div>
        )}

      </div>

      {/* Content Area */}
      {!showMyComplaints ? (
        <div>
          {/* Results count & status summary */}
          <div className="flex items-center justify-between text-xs text-slate-600 mb-3 px-1">
            <span>
              Showing <strong>{filteredBins.length}</strong> of 200 Govind Bhawan bins
            </span>
            <span className="flex items-center gap-3">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span> Overflowing ({bins.filter(b=>b.status==='Overflowing').length})</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500"></span> Needs Care ({bins.filter(b=>b.status==='Needs Attention').length})</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> Cleaned ({bins.filter(b=>b.status==='Cleaned').length})</span>
            </span>
          </div>

          {/* Bins Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredBins.slice(0, 36).map((bin) => {
              const categoryDef = WASTE_CATEGORIES[bin.category] || {};
              const isFull = bin.fillLevel > 75;

              return (
                <div 
                  key={bin.id}
                  className={`bg-white rounded-3xl p-5 border transition-all card-hover ${
                    isFull ? 'border-rose-200 ring-1 ring-rose-300/40 bg-rose-50/20' : 'border-hallmark-border'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-sm text-hallmark-dark bg-slate-100 px-2.5 py-1 rounded-xl">
                          #{bin.id}
                        </span>
                        <span className="text-xs font-medium text-slate-500">
                          {bin.block} • {bin.floor}
                        </span>
                      </div>
                      <div className="mt-2">
                        <WasteCategoryBadge category={bin.category} />
                      </div>
                    </div>

                    <BinStatusBadge status={bin.status} fillLevel={bin.fillLevel} />
                  </div>

                  {/* Fill progress bar */}
                  <div className="mt-4">
                    <div className="flex justify-between text-[11px] text-slate-500 mb-1">
                      <span>Fill Volume</span>
                      <span className="font-semibold">{bin.fillLevel}% (120L Bin)</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${
                          bin.fillLevel > 85 ? 'bg-rose-500' :
                          bin.fillLevel > 65 ? 'bg-amber-500' :
                          bin.fillLevel > 35 ? 'bg-blue-500' : 'bg-emerald-500'
                        }`}
                        style={{ width: `${bin.fillLevel}%` }}
                      />
                    </div>
                  </div>

                  {/* Location & Timings Details */}
                  <div className="mt-3.5 space-y-1.5 text-xs text-slate-600 bg-hallmark-cream/60 p-3 rounded-2xl border border-hallmark-border/60">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Scheduled Pick:</span>
                      <span className="font-semibold text-slate-800 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-amber-600" />
                        {bin.nextScheduledCleaning}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-400">Last Emptied:</span>
                      <span className="text-slate-700">{bin.lastCleaned}</span>
                    </div>
                    <div className="text-[11px] text-slate-500 truncate pt-1 border-t border-slate-200/50" title={bin.locationDetail}>
                      📍 {bin.locationDetail}
                    </div>
                  </div>

                  {/* Destination Group */}
                  <div className="mt-3 text-[11px] text-slate-500 flex items-center justify-between">
                    <span className="text-slate-400">Assigned Team:</span>
                    <span className="font-medium text-emerald-800 truncate max-w-[190px]" title={bin.dispatchTeam}>
                      {bin.dispatchTeam.split('&')[0]}
                    </span>
                  </div>

                  {/* Report Complaint Button */}
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    {bin.uncleanedComplaints > 0 ? (
                      <span className="text-[11px] font-semibold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-xl border border-amber-200 flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" />
                        {bin.uncleanedComplaints} report pending
                      </span>
                    ) : (
                      <span className="text-[11px] text-slate-400">No active complaints</span>
                    )}

                    <button
                      type="button"
                      onClick={() => handleOpenReport(bin)}
                      className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-rose-700 hover:text-white bg-rose-50 hover:bg-rose-600 border border-rose-200 transition-colors flex items-center gap-1.5 ml-auto shadow-sm"
                    >
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>Report Issue</span>
                    </button>
                  </div>

                </div>
              );
            })}
          </div>

          {filteredBins.length > 36 && (
            <div className="text-center py-6 text-xs text-slate-500">
              Showing first 36 bins of {filteredBins.length}. Use filters above to drill down to specific wings or categories.
            </div>
          )}
        </div>
      ) : (
        /* My Complaints View */
        <div className="bg-white rounded-3xl p-6 border border-hallmark-border shadow-soft space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="font-display text-lg font-bold text-hallmark-dark">
                My Govind Bhawan Complaints & Auto-Acknowledgements
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Direct record of complaints filed for Govind Bhawan bins and official automatic admin dispatch acknowledgments.
              </p>
            </div>
            <button
              onClick={() => setShowMyComplaints(false)}
              className="text-xs font-semibold text-hallmark-primary hover:underline"
            >
              ← Back to 200 Bins Directory
            </button>
          </div>

          {myComplaints.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-sm">
              No complaints filed yet. If any dustbin is overflowing or missed during morning/afternoon shifts, click "Report Issue" to file.
            </div>
          ) : (
            <div className="space-y-4">
              {myComplaints.map(complaint => (
                <div key={complaint.id} className="border border-slate-200 rounded-2xl p-4 bg-slate-50/50 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold bg-slate-200 px-2 py-0.5 rounded-lg text-slate-800">
                          {complaint.id}
                        </span>
                        <span className="text-xs font-semibold text-slate-800">{complaint.binId ? `Bin #${complaint.binId}` : 'Spot Report'}</span>
                        <ComplaintStatusBadge status={complaint.status} />
                      </div>
                      <p className="text-xs text-slate-600 mt-1">📍 {complaint.location}</p>
                    </div>
                    <span className="text-[11px] text-slate-400 font-mono">{complaint.timestamp}</span>
                  </div>

                  <p className="text-xs text-slate-800 bg-white p-2.5 rounded-xl border border-slate-200">
                    <strong className="text-slate-500">Reported Issue:</strong> {complaint.issueType}
                  </p>

                  {/* One-way admin acknowledgment message */}
                  {complaint.adminAcknowledgment && (
                    <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-xs text-emerald-900">
                      <div className="flex items-center justify-between text-[11px] text-emerald-700 font-semibold mb-1">
                        <span className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          Official Auto-Acknowledgement ({complaint.adminAcknowledgment.adminOfficer})
                        </span>
                        <span>{complaint.adminAcknowledgment.sentAt}</span>
                      </div>
                      <p className="font-sans italic">
                        "{complaint.adminAcknowledgment.message}"
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Report Complaint Modal */}
      {reportingBin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-lifted border border-hallmark-border font-sans">
            
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center font-bold">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-base text-slate-900">
                    Report Dustbin Issue • #{reportingBin.id}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {reportingBin.block} • {reportingBin.floor}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setReportingBin(null)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitComplaint} className="mt-4 space-y-4 text-xs">
              
              {/* Bin summary card */}
              <div className="bg-hallmark-cream p-3 rounded-2xl border border-hallmark-border/70 space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-500">Category:</span>
                  <WasteCategoryBadge category={reportingBin.category} />
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Assigned Team:</span>
                  <span className="font-medium text-emerald-900">{reportingBin.dispatchTeam}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Cleaning Shift:</span>
                  <span className="font-semibold text-amber-700">{reportingBin.nextScheduledCleaning}</span>
                </div>
              </div>

              {/* Reason Selector */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1.5">
                  Select Cleanliness / Operational Issue:
                </label>
                <select
                  value={complaintReason}
                  onChange={(e) => setComplaintReason(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-hallmark-primary"
                >
                  <option value="Bin uncleaned as per morning 07:30 AM schedule">
                    Missed Cleaning: Not emptied as per 07:30 AM / 02:00 PM shift
                  </option>
                  <option value="Bin overflowing onto hostel corridor floor">
                    Overflowing: Waste spilling onto hostel floor
                  </option>
                  <option value="Severe foul odor attracting stray dogs & pests">
                    Hygiene hazard: Foul odor & stray dog scavengers
                  </option>
                  <option value="Wrong waste category dumped inside this bin">
                    Segregation breach: Non-recyclables or food dumped in wrong bin
                  </option>
                  <option value="Dustbin lid broken or damaged structure">
                    Hardware defect: Broken lid, wheel, or cracked bin body
                  </option>
                </select>
              </div>

              {/* Details input */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1.5">
                  Specific Notes / Landmark details:
                </label>
                <textarea
                  rows={2}
                  value={complaintNote}
                  onChange={(e) => setComplaintNote(e.target.value)}
                  placeholder="e.g. Near Staircase 2 water cooler, cardboard boxes blocking corridor..."
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-1 focus:ring-hallmark-primary"
                />
              </div>

              {/* Photo Upload Attachment */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Attach Photo Evidence (Optional):
                </label>
                <label className="flex items-center justify-center gap-2 p-3 border-2 border-dashed border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors">
                  <Camera className="w-4 h-4 text-slate-500" />
                  <span className="text-slate-600 font-medium">
                    {complaintPhoto ? 'Photo Attached (Click to replace)' : 'Snap or Upload Photo'}
                  </span>
                  <input type="file" accept="image/*" onChange={handlePhotoSelect} className="hidden" />
                </label>

                {complaintPhoto && (
                  <div className="mt-2 relative rounded-xl overflow-hidden h-28 border border-slate-200">
                    <img src={complaintPhoto} alt="Evidence" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setComplaintPhoto(null)}
                      className="absolute top-1.5 right-1.5 bg-black/70 text-white rounded-full p-1 text-[10px]"
                    >
                      ✕
                    </button>
                  </div>
                )}
              </div>

              {/* Automatic one-way admin note notification preview */}
              <div className="bg-amber-50 p-2.5 rounded-xl border border-amber-200 text-[11px] text-amber-900 flex items-start gap-2">
                <Info className="w-3.5 h-3.5 text-amber-700 flex-shrink-0 mt-0.5" />
                <div>
                  <strong>Automatic Confirmation:</strong> You will immediately receive a verifiable one-way notification from the IITR Estate Officer confirming team dispatch, plus <strong>+15 EcoPoints</strong>.
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setReportingBin(null)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl text-white font-semibold bg-rose-600 hover:bg-rose-700 transition-colors shadow-sm flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Complaint to Admin</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
