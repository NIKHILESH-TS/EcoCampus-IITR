import React, { useState, useEffect } from 'react';
import { 
  AlertCircle, 
  Clock, 
  Filter, 
  Search, 
  Send, 
  CheckCircle2, 
  Camera, 
  MapPin, 
  ChevronRight,
  Sparkles,
  Layers,
  ArrowRight
} from 'lucide-react';
import { db, SHIFT_TIMINGS, WASTE_TYPES } from '../../services/db';
import { WasteBadge, FillStatusBadge, ComplaintBadge } from '../Common/Badges';

const CAMPUS_SPOT_LOCATIONS = [
  'LBS Jogging Track & Stadium',
  'Thomason Main Building Lawns',
  'Lecture Hall Complex (LHC-1 & LHC-2)',
  'Central Library Portico',
  'Multi Activity Center (MAC) Amphitheatre',
  'Rajendra Bhawan Mess Backyard',
  'Biotechnology / Chemistry Lab Lane',
  'Century Gate & Commercial Center'
];

export default function ComplaintPortal() {
  const [activeSubTab, setActiveSubTab] = useState('bins'); // 'bins' | 'my_complaints'
  const [bins, setBins] = useState([]);
  const [complaints, setComplaints] = useState([]);
  
  // Filters
  const [selectedBlock, setSelectedBlock] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Post Issue Form state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [targetType, setTargetType] = useState('bin'); // 'bin' | 'campus_spot'
  const [targetBinId, setTargetBinId] = useState('GB-001');
  const [spotLocation, setSpotLocation] = useState(CAMPUS_SPOT_LOCATIONS[0]);
  const [issueType, setIssueType] = useState('Missed Cleaning: Not emptied as per scheduled shift');
  const [issueDetails, setIssueDetails] = useState('');
  const [photoUrl, setPhotoUrl] = useState('https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?auto=format&fit=crop&w=500&q=80');
  
  // Success toast with auto-ack preview
  const [recentAck, setRecentAck] = useState(null);

  useEffect(() => {
    loadData();
    window.addEventListener('ecocampus_db_change', loadData);
    return () => window.removeEventListener('ecocampus_db_change', loadData);
  }, []);

  const loadData = () => {
    setBins(db.getBins());
    setComplaints(db.getComplaints());
  };

  const filteredBins = bins.filter(bin => {
    const matchBlock = selectedBlock === 'All' || bin.block === selectedBlock;
    const matchCat = selectedCategory === 'All' || bin.category === selectedCategory;
    const matchStatus = selectedStatus === 'All' || bin.status === selectedStatus;
    const matchSearch = searchQuery === '' || 
      bin.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bin.locationDetail.toLowerCase().includes(searchQuery.toLowerCase());
    return matchBlock && matchCat && matchStatus && matchSearch;
  });

  const handleOpenReportForBin = (bin) => {
    setTargetType('bin');
    setTargetBinId(bin.id);
    setIssueDetails(`Observed at ${bin.locationDetail}. Fill level is ${bin.fillLevel}% and needs shift collection.`);
    setIsModalOpen(true);
  };

  const handleOpenSpotReport = () => {
    setTargetType('campus_spot');
    setIssueDetails('Waste accumulated on ground/sidewalk. Requesting tractor squad clearance.');
    setIsModalOpen(true);
  };

  const handleSubmitComplaint = (e) => {
    e.preventDefault();

    const result = db.createComplaint({
      binId: targetType === 'bin' ? targetBinId : null,
      locationText: targetType === 'bin' ? db.getBinById(targetBinId)?.locationDetail : spotLocation,
      category: targetType === 'bin' ? db.getBinById(targetBinId)?.category : 'recyclable',
      issueType: issueType,
      details: issueDetails,
      photoUrl: photoUrl
    });

    setRecentAck(result.dispatch.messageText);
    setIsModalOpen(false);
    setIssueDetails('');
  };

  return (
    <div className="space-y-6">
      
      {/* Shift Timings Banner */}
      <div className="bg-white rounded-xl border border-slate-200 p-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3 mb-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-800">
            <Clock className="w-4 h-4 text-emerald-700" />
            <span>Govind Bhawan Daily Cleaning Shift Timings</span>
          </div>
          <span className="text-[11px] text-slate-500">
            Assumed operational roster for 200 hostel bins
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {SHIFT_TIMINGS.map(shift => (
            <div key={shift.id} className="bg-slate-50 rounded-lg p-2.5 border border-slate-200 text-xs">
              <div className="flex items-center justify-between font-medium text-slate-700">
                <span>{shift.label}</span>
                <span className="font-mono font-bold text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded text-[11px]">
                  {shift.time}
                </span>
              </div>
              <div className="text-[11px] text-slate-500 mt-1">
                {shift.focus}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Auto-Ack Notice Banner */}
      {recentAck && (
        <div className="bg-emerald-50 border border-emerald-300 rounded-xl p-4 flex items-start justify-between gap-3 animate-fadeIn">
          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-700 flex-shrink-0 mt-0.5" />
            <div className="text-xs">
              <strong className="text-emerald-950 font-semibold block">
                Automatic One-Way Acknowledgment Dispatched from Estate Administration
              </strong>
              <p className="text-emerald-900 mt-1 font-mono text-[11px] bg-white/70 p-2 rounded border border-emerald-200">
                "{recentAck}"
              </p>
              <span className="text-[11px] text-emerald-700 mt-1 inline-block">
                +15 EcoPoints added to your balance. View real-time status in "My Complaints Log".
              </span>
            </div>
          </div>
          <button onClick={() => setRecentAck(null)} className="text-xs text-emerald-800 font-bold p-1">
            ✕
          </button>
        </div>
      )}

      {/* Main Tabs & Action */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveSubTab('bins')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              activeSubTab === 'bins'
                ? 'bg-slate-900 text-white'
                : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900'
            }`}
          >
            Govind Bhawan Bins ({bins.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('my_complaints')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              activeSubTab === 'my_complaints'
                ? 'bg-slate-900 text-white'
                : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900'
            }`}
          >
            My Complaints Log ({complaints.length})
          </button>
        </div>

        <button
          type="button"
          onClick={handleOpenSpotReport}
          className="px-3.5 py-1.5 rounded-lg bg-brand-primary hover:bg-brand-dark text-white text-xs font-medium transition-colors flex items-center justify-center gap-1.5 shadow-subtle"
        >
          <MapPin className="w-3.5 h-3.5" />
          <span>Report Campus Spot Issue</span>
        </button>
      </div>

      {/* Subtab 1: 200 Dustbins Grid */}
      {activeSubTab === 'bins' ? (
        <div className="space-y-4">
          
          {/* Filters Bar */}
          <div className="bg-white p-3 rounded-xl border border-slate-200 flex flex-wrap items-center gap-2 text-xs">
            
            <div className="relative flex-1 min-w-[200px]">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                placeholder="Search Bin ID (e.g. GB-018) or floor..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-slate-200 text-xs bg-slate-50 focus:bg-white"
              />
            </div>

            <select
              value={selectedBlock}
              onChange={(e) => setSelectedBlock(e.target.value)}
              className="p-1.5 rounded-lg border border-slate-200 bg-white text-xs text-slate-700"
            >
              <option value="All">All Blocks & Mess</option>
              <option value="Block A">Block A</option>
              <option value="Block B">Block B</option>
              <option value="Block C">Block C</option>
              <option value="Block D">Block D</option>
              <option value="Mess & Dining Hall">Mess & Dining Hall</option>
              <option value="Central Quadrangle">Central Quadrangle</option>
            </select>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="p-1.5 rounded-lg border border-slate-200 bg-white text-xs text-slate-700"
            >
              <option value="All">All Waste Streams</option>
              <option value="biodegradable">Bio-Degradable (Green)</option>
              <option value="recyclable">Recyclable (Blue)</option>
              <option value="non_recyclable">Non-Recyclable (Grey)</option>
              <option value="e_waste">E-Waste (Orange)</option>
              <option value="hazardous">Hazardous (Red)</option>
            </select>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="p-1.5 rounded-lg border border-slate-200 bg-white text-xs text-slate-700"
            >
              <option value="All">All Statuses</option>
              <option value="Overflowing">Overflowing (&gt;80%)</option>
              <option value="Needs Attention">Needs Attention (60-80%)</option>
              <option value="Moderate">Moderate (35-60%)</option>
              <option value="Cleaned">Cleaned (&lt;35%)</option>
            </select>

          </div>

          {/* Bins List Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredBins.slice(0, 30).map(bin => (
              <div 
                key={bin.id}
                className={`bg-white rounded-xl p-3.5 border text-xs flex flex-col justify-between transition-colors ${
                  bin.status === 'Overflowing' ? 'border-rose-300 bg-rose-50/10' : 'border-slate-200'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                      #{bin.id}
                    </span>
                    <FillStatusBadge status={bin.status} fillLevel={bin.fillLevel} />
                  </div>

                  <div className="text-slate-800 font-medium text-xs">
                    {bin.block} • {bin.floor}
                  </div>
                  <div className="text-[11px] text-slate-500 mb-2 truncate">
                    📍 {bin.locationDetail}
                  </div>

                  <div className="mb-2.5">
                    <WasteBadge category={bin.category} />
                  </div>

                  {/* Fill progress & Weight Bar */}
                  <div className="space-y-1 mb-2">
                    <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                      <span>Vol: <strong>{bin.fillLevel}%</strong></span>
                      <span>Weight: <strong>{bin.weightKg || (bin.fillLevel * 0.35 + 2.5).toFixed(1)} kg</strong></span>
                      <span>Shift: <strong className="text-slate-800">{bin.nextShiftTime}</strong></span>
                    </div>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${
                          bin.fillLevel > 80 ? 'bg-rose-500' :
                          bin.fillLevel > 60 ? 'bg-amber-500' : 'bg-emerald-500'
                        }`}
                        style={{ width: `${bin.fillLevel}%` }}
                      />
                    </div>
                  </div>

                  <div className="text-[10px] text-slate-400">
                    Collection Squad: <span className="text-slate-600">{bin.assignedGroup.split('&')[0]}</span>
                  </div>
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between">
                  {bin.uncleanedReportsCount > 0 ? (
                    <span className="text-[10px] font-medium text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                      {bin.uncleanedReportsCount} issue reported
                    </span>
                  ) : (
                    <span className="text-[10px] text-slate-400">Regular shift</span>
                  )}

                  <button
                    type="button"
                    onClick={() => handleOpenReportForBin(bin)}
                    className="px-2.5 py-1 rounded text-[11px] font-medium text-rose-700 hover:text-white bg-rose-50 hover:bg-rose-600 border border-rose-200 transition-colors"
                  >
                    Report Issue
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredBins.length > 30 && (
            <div className="text-center py-4 text-xs text-slate-500">
              Showing first 30 of {filteredBins.length} dustbins in Govind Bhawan. Use filters above to pinpoint specific blocks.
            </div>
          )}

        </div>
      ) : (
        /* Subtab 2: Complaints & Acknowledgment Log */
        <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-semibold text-slate-900 text-sm">
                My Complaints & Official One-Way Responses
              </h3>
              <p className="text-xs text-slate-500">
                Verifiable logs of student-submitted issues with automated confirmation messages from the IITR Estate Office.
              </p>
            </div>
          </div>

          {complaints.length === 0 ? (
            <div className="text-center py-8 text-xs text-slate-400">
              No complaints filed yet. Click "Report Issue" on any dustbin to file.
            </div>
          ) : (
            <div className="space-y-3">
              {complaints.map(item => {
                const dispatches = db.getDispatchesForComplaint(item.id);
                return (
                  <div key={item.id} className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/50 text-xs space-y-2.5">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200 text-[11px]">
                          {item.id}
                        </span>
                        <span className="font-medium text-slate-800">
                          {item.binId ? `Bin #${item.binId}` : 'Campus Spot Report'}
                        </span>
                        <ComplaintBadge status={item.status} />
                      </div>
                      <span className="text-[11px] text-slate-400 font-mono">{item.createdAt}</span>
                    </div>

                    <div className="text-slate-600">
                      📍 {item.locationText}
                    </div>

                    <div className="bg-white p-2.5 rounded border border-slate-200 space-y-1">
                      <div className="font-medium text-slate-900">{item.issueType}</div>
                      {item.details && <p className="text-slate-600 text-[11px]">{item.details}</p>}
                    </div>

                    {/* Verification & Anti-Griefing Outcome */}
                    {item.verificationStatus === 'reported_false' && (
                      <div className="bg-rose-50 border border-rose-200 rounded-lg p-2.5 space-y-1 text-rose-950">
                        <div className="font-semibold text-rose-800 flex items-center justify-between">
                          <span>⚠️ Verified False Alarm</span>
                          <span className="font-mono font-bold text-[10px] bg-rose-200 text-rose-950 px-1.5 py-0.2 rounded">-25 TOKENS</span>
                        </div>
                        <p className="text-[11px] text-rose-700">
                          Field crew inspected location and verified the bin was clean and operational. 25 EcoTokens were deducted to discourage false alarms.
                        </p>
                        {item.workerRemarks && (
                          <div className="text-[10px] italic text-rose-600 bg-white/70 p-1.5 rounded">
                            Field note: "{item.workerRemarks}"
                          </div>
                        )}
                      </div>
                    )}

                    {item.verificationStatus === 'verified_legitimate' && (
                      <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-2.5 space-y-1 text-emerald-950">
                        <div className="font-semibold text-emerald-800 flex items-center justify-between">
                          <span>✓ Verified Issue & Restored</span>
                          <span className="font-mono font-bold text-[10px] bg-emerald-200 text-emerald-950 px-1.5 py-0.2 rounded">+35 TOKENS</span>
                        </div>
                        <p className="text-[11px] text-emerald-700">
                          Thank you for keeping campus clean! Issue verified by Squad #2 and +35 EcoTokens added to your balance.
                        </p>
                      </div>
                    )}

                    {/* One-Way Administrator Dispatches */}
                    {dispatches.length > 0 && (
                      <div className="space-y-1.5 pt-1">
                        <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">
                          Official Administrator One-Way Message:
                        </span>
                        {dispatches.map(disp => (
                          <div key={disp.id} className="bg-emerald-50/90 border border-emerald-200 p-2.5 rounded text-[11px] text-emerald-950 font-mono">
                            <div className="flex justify-between text-[10px] text-emerald-700 font-sans mb-1">
                              <span>From: Campus Estate Sanitation Office</span>
                              <span>{disp.sentAt}</span>
                            </div>
                            "{disp.messageText}"
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Post Complaint Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-5 border border-slate-200 shadow-card text-xs space-y-4">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="font-semibold text-sm text-slate-900 flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-rose-600" />
                <span>
                  {targetType === 'bin' ? `Report Issue for Bin #${targetBinId}` : 'Report Campus Spot Waste Issue'}
                </span>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-700 text-xs font-bold">
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitComplaint} className="space-y-3.5">
              
              {targetType === 'campus_spot' ? (
                <div>
                  <label className="block text-slate-700 font-medium mb-1">
                    Select Campus Landmark / Location:
                  </label>
                  <select
                    value={spotLocation}
                    onChange={(e) => setSpotLocation(e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-200 text-xs bg-white text-slate-800"
                  >
                    {CAMPUS_SPOT_LOCATIONS.map((loc, idx) => (
                      <option key={idx} value={loc}>{loc}</option>
                    ))}
                  </select>
                </div>
              ) : (
                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                  <div className="flex justify-between text-slate-600">
                    <span>Target Bin:</span>
                    <strong className="font-mono text-slate-900">#{targetBinId}</strong>
                  </div>
                  <div className="flex justify-between text-slate-600 mt-0.5">
                    <span>Location:</span>
                    <span>{db.getBinById(targetBinId)?.locationDetail}</span>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-slate-700 font-medium mb-1">
                  Issue Classification:
                </label>
                <select
                  value={issueType}
                  onChange={(e) => setIssueType(e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-200 text-xs bg-white text-slate-800"
                >
                  <option value="Missed Cleaning: Not emptied as per scheduled shift">
                    Missed Cleaning: Not emptied as per 07:30 AM / 02:00 PM shift
                  </option>
                  <option value="Overflowing: Waste spilling onto floor">
                    Overflowing: Waste spilling onto corridor or ground
                  </option>
                  <option value="Severe Odor & Stray Animal Hazard">
                    Hygiene Issue: Foul odor & stray animals scavenging
                  </option>
                  <option value="Segregation Mismatch: Wrong waste dumped">
                    Segregation Error: Incompatible waste dumped in this bin
                  </option>
                  <option value="Damaged Bin Hardware or Broken Lid">
                    Hardware Defect: Cracked bin body or broken lid
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">
                  Specific Notes / Landmark details:
                </label>
                <textarea
                  rows={2}
                  value={issueDetails}
                  onChange={(e) => setIssueDetails(e.target.value)}
                  placeholder="e.g. Near 2nd floor pantry, cardboard packaging spilling over..."
                  className="w-full p-2 rounded-lg border border-slate-200 text-xs"
                />
              </div>

              {/* Anti-griefing incentive notice */}
              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-[11px] text-slate-600 space-y-1">
                <div className="flex items-center justify-between text-slate-800 font-semibold">
                  <span>Incentive & Anti-Spam Rule:</span>
                  <span className="text-emerald-700 font-bold font-mono">+35 Pts on Clearance</span>
                </div>
                <p className="leading-snug">
                  Submitting dispatches Squad #2 for inspection. Verified legitimate issues award <strong>+35 EcoTokens</strong>. To protect crew time, photo-verified false alarms incur a <strong>25 token penalty</strong>.
                </p>
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
                  className="px-4 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-medium flex items-center gap-1.5 transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit Issue</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
