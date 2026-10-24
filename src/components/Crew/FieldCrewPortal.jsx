import React, { useState, useEffect } from 'react';
import { 
  Truck, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Camera, 
  ShieldCheck, 
  AlertCircle, 
  QrCode, 
  Sparkles, 
  ArrowRight,
  Languages,
  Mic,
  Volume2,
  Coins,
  Cpu,
  Layers,
  ThumbsDown,
  ThumbsUp,
  X
} from 'lucide-react';
import { db } from '../../services/db';
import { WasteBadge, FillStatusBadge } from '../Common/Badges';
import { speakText, stopSpeaking } from '../../services/elevenlabs';

export default function FieldCrewPortal() {
  const [bins, setBins] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [completedList, setCompletedList] = useState([]);
  const [lang, setLang] = useState('hi'); // 'hi' | 'en'
  const [toastMessage, setToastMessage] = useState(null);
  const [worker, setWorker] = useState(db.getUserById('USR-003') || { name: 'Ramesh Kumar (Squad #2)', weeklyBonusInr: 1250 });

  // Verification modal state
  const [activeComplaintForReview, setActiveComplaintForReview] = useState(null);
  const [reviewRemarks, setReviewRemarks] = useState('');
  const [reviewPhoto, setReviewPhoto] = useState('https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=500&q=80');

  // MobileNetV3 Sorter state
  const [isAiSorterOpen, setIsAiSorterOpen] = useState(false);
  const [classifiedItem, setClassifiedItem] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    loadData();
    window.addEventListener('ecocampus_db_change', loadData);
    return () => window.removeEventListener('ecocampus_db_change', loadData);
  }, []);

  const loadData = () => {
    const allBins = db.getBins();
    const urgent = allBins.filter(b => b.fillLevel > 70 || b.uncleanedReportsCount > 0);
    setBins(urgent.length > 0 ? urgent : allBins.slice(0, 12));
    
    // Load assigned or open complaints
    const allComplaints = db.getComplaints();
    const myComplaints = allComplaints.filter(c => c.status !== 'resolved' && c.status !== 'false_alarm');
    setComplaints(myComplaints);

    const w = db.getUserById('USR-003');
    if (w) setWorker(w);
  };

  const handleConfirmClearance = (bin) => {
    db.cleanBin(bin.id);

    // Auto-resolve any related complaints
    const related = complaints.filter(c => c.binId === bin.id);
    related.forEach(c => {
      db.verifyAndResolveComplaint(c.id, 'USR-003', null, `Emptied on morning schedule by Squad #2.`);
    });

    setCompletedList(prev => [...prev, {
      binId: bin.id,
      location: bin.locationDetail,
      timestamp: 'Just now',
      slaMinutes: Math.floor(Math.random() * 12) + 14
    }]);

    const msg = lang === 'hi' 
      ? `डस्टबिन #${bin.id} खाली किया गया। SLA सत्यापन दर्ज किया गया।`
      : `Bin #${bin.id} emptied. SLA clearance logged.`;
    setToastMessage(msg);

    if (lang === 'hi') {
      speakText(`डस्टबिन नंबर ${bin.id} खाली कर दिया गया है।`, () => {}, () => {}, 'hi');
    }
  };

  const handleReportFalseAlarm = (complaint) => {
    db.reportFalseComplaint(
      complaint.id,
      'USR-003',
      reviewPhoto,
      reviewRemarks || 'Bin was verified completely clean and functional. False report confirmed.'
    );

    setActiveComplaintForReview(null);
    setReviewRemarks('');
    setToastMessage(lang === 'hi' 
      ? 'फर्जी शिकायत दर्ज की गई। छात्र से 25 इको-टोकन काटे गए।' 
      : 'False complaint reported. 25 EcoTokens deducted from reporting student.'
    );

    if (lang === 'hi') {
      speakText('गलत शिकायत दर्ज कर ली गई है। विद्यार्थी से पच्चीस टोकन काट लिए गए हैं।', () => {}, () => {}, 'hi');
    }
  };

  const handleVerifyLegitimate = (complaint) => {
    db.verifyAndResolveComplaint(
      complaint.id,
      'USR-003',
      reviewPhoto,
      reviewRemarks || 'Verified issue and cleaned. Disposed according to category.'
    );

    setActiveComplaintForReview(null);
    setReviewRemarks('');
    setToastMessage(lang === 'hi'
      ? 'सत्यापित सफाई पूर्ण। छात्र को +35 टोकन मिले, आपके खाते में ₹150 बोनस जुड़ा।'
      : 'Complaint resolved. Student awarded +35 tokens, ₹150 added to worker bonus.'
    );

    if (lang === 'hi') {
      speakText('सफाई पूरी हो गई है। छात्र को पैंतीस टोकन और आपके खाते में बोनस जोड़ दिया गया है।', () => {}, () => {}, 'hi');
    }
  };

  // MobileNetV3 Fast Sorter Simulation
  const handleSimulateMobileNetSort = (itemType) => {
    setIsAnalyzing(true);
    setTimeout(() => {
      let classification = null;
      if (itemType === 'bottle') {
        classification = {
          name: 'PET Mineral Water Bottle (Clean Plastic)',
          nameHi: 'पीईटी प्लास्टिक की बोतल (साफ सूखा कचरा)',
          stream: 'recyclable',
          compartment: 'Blue Bag / नीली बोरी',
          confidence: '98.4%',
          latencyMs: 12.8,
          weightKg: 0.045,
          voiceHi: 'यह प्लास्टिक की बोतल नीली बोरी में डालें। इसे कबाड़ीवाला नेटवर्क द्वारा रिसाइकिल किया जाएगा।',
          voiceEn: 'Place this plastic bottle into the blue dry recyclables bag.'
        };
      } else if (itemType === 'cardboard') {
        classification = {
          name: 'Corrugated Amazon Delivery Box (Grade A)',
          nameHi: 'गत्ते का डिब्बा / कार्टन (ग्रेड ए)',
          stream: 'recyclable',
          compartment: 'Blue Bag / नीली बोरी',
          confidence: '99.1%',
          latencyMs: 11.2,
          weightKg: 0.420,
          voiceHi: 'गत्ते का डिब्बा सूखा रीसाइक्लेबल बोरी में रखें। यह आईटीसी नीलामी में जाएगा।',
          voiceEn: 'Cardboard box detected. Put in dry recyclables for ITC auction.'
        };
      } else if (itemType === 'food') {
        classification = {
          name: 'Mess Rice & Lentil Food Scrap',
          nameHi: 'मेस का बचा हुआ खाना और सब्जी के छिलके',
          stream: 'biodegradable',
          compartment: 'Green Drum / हरा ड्रम',
          confidence: '96.7%',
          latencyMs: 14.1,
          weightKg: 0.650,
          voiceHi: 'सब्जी और बचा खाना हरे गीले कचरे के ड्रम में डालें। यह बायोगैस प्लांट में जाएगा।',
          voiceEn: 'Food scrap detected. Place into green organic drum for biogas.'
        };
      } else {
        classification = {
          name: 'Lithium 18650 Battery / PCB Scrap',
          nameHi: 'ई-कचरा / बैटरी / सर्किट',
          stream: 'e_waste',
          compartment: 'Orange Bin / नारंगी पेटी',
          confidence: '97.9%',
          latencyMs: 13.5,
          weightKg: 0.120,
          voiceHi: 'सावधान! यह ई-कचरा है। इसे नारंगी डिब्बे में अलग रखें।',
          voiceEn: 'Warning: Electronic waste. Place into orange hazardous bin.'
        };
      }

      setClassifiedItem(classification);
      setIsAnalyzing(false);

      // Play bilingual audio
      const speech = lang === 'hi' ? classification.voiceHi : classification.voiceEn;
      speakText(speech, () => {}, () => {}, lang);
    }, 400);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6 font-sans">
      
      {/* Sanitation Worker Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] font-bold bg-amber-600 text-white px-2 py-0.5 rounded flex items-center gap-1">
                <Truck className="w-3 h-3" />
                {lang === 'hi' ? 'सफाई कर्मचारी पोर्टल' : 'SANITATION FIELD CREW'}
              </span>
              <span className="bg-slate-100 text-slate-700 font-mono text-[10px] px-2 py-0.5 rounded border border-slate-200">
                Unit #2 • Govind Bhawan Beat
              </span>
            </div>
            <h1 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
              {lang === 'hi' 
                ? 'रमेश कुमार (फील्ड स्क्वाड #2) • कार्य आदेश व मोबाइल वर्गीकरण'
                : 'Field Operations & SLA Verification Dispatch Desk'
              }
            </h1>
            <p className="text-xs text-slate-500 max-w-2xl">
              {lang === 'hi'
                ? 'टर्न-बाय-टर्न डस्टबिन सफाई, शिकायतों का सत्यापन (फर्जी रिपोर्ट पर पेनल्टी), और मोबाइलनेट द्वारा तेज वर्गीकरण।'
                : 'Turn-by-turn bin clearance, ground truth complaint verification, and MobileNetV3 edge sorting with ElevenLabs voice.'
              }
            </p>
          </div>

          {/* Right Tools: Language Switcher & Bonus Counter */}
          <div className="flex flex-wrap items-center gap-3">
            
            {/* Hindi / English Toggle */}
            <div className="bg-slate-100 p-1 rounded-xl flex items-center border border-slate-200 text-xs">
              <button
                type="button"
                onClick={() => setLang('hi')}
                className={`px-3 py-1 rounded-lg font-medium transition-all flex items-center gap-1 ${
                  lang === 'hi'
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Languages className="w-3 h-3" />
                <span>हिन्दी (Hindi)</span>
              </button>

              <button
                type="button"
                onClick={() => setLang('en')}
                className={`px-3 py-1 rounded-lg font-medium transition-all ${
                  lang === 'en'
                    ? 'bg-slate-900 text-white font-bold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                English
              </button>
            </div>

            {/* Weekly Scrap Bonus Tally */}
            <div className="bg-emerald-50 border border-emerald-200 px-3.5 py-2 rounded-xl text-xs flex items-center gap-2">
              <Coins className="w-4 h-4 text-emerald-700" />
              <div>
                <div className="text-[10px] text-emerald-800 font-medium">
                  {lang === 'hi' ? 'इस सप्ताह का स्क्रैप बोनस' : 'Weekly 30% Scrap Share'}
                </div>
                <div className="font-mono font-bold text-emerald-950 text-sm">
                  ₹{worker.weeklyBonusInr || 1250} <span className="text-[10px] text-emerald-700 font-normal">UPI Pending Fri</span>
                </div>
              </div>
            </div>

            {/* Launch AI Sorter Button */}
            <button
              type="button"
              onClick={() => setIsAiSorterOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <Cpu className="w-3.5 h-3.5 text-blue-200" />
              <span>{lang === 'hi' ? 'मोबाइलनेट एआई सॉर्टर' : 'MobileNetV3 Sorter'}</span>
            </button>

          </div>
        </div>

        {/* Operational Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 text-xs">
          <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
            <div className="text-slate-500 text-[11px]">{lang === 'hi' ? 'वर्तमान शिफ्ट' : 'Active Shift'}</div>
            <div className="font-mono font-bold text-slate-900 text-sm mt-0.5">07:30 AM Morning</div>
            <div className="text-[10px] text-slate-400">Govind Bhawan Route</div>
          </div>

          <div className="bg-amber-50 p-2.5 rounded-lg border border-amber-200">
            <div className="text-amber-800 text-[11px]">{lang === 'hi' ? 'लंबित शिकायतें' : 'Assigned Complaints'}</div>
            <div className="font-mono font-bold text-amber-950 text-sm mt-0.5">{complaints.length} To Inspect</div>
            <div className="text-[10px] text-amber-700">Verification Required</div>
          </div>

          <div className="bg-blue-50 p-2.5 rounded-lg border border-blue-200">
            <div className="text-blue-800 text-[11px]">{lang === 'hi' ? 'खाली किए गए डस्टबिन' : 'Bins Emptied Today'}</div>
            <div className="font-mono font-bold text-blue-950 text-sm mt-0.5">{completedList.length + 18} Bins</div>
            <div className="text-[10px] text-blue-700">100% SLA Compliance</div>
          </div>

          <div className="bg-emerald-50 p-2.5 rounded-lg border border-emerald-200">
            <div className="text-emerald-800 text-[11px]">{lang === 'hi' ? 'औसत प्रतिक्रिया समय' : 'Avg Clearance Time'}</div>
            <div className="font-mono font-bold text-emerald-950 text-sm mt-0.5">18.5 Mins</div>
            <div className="text-[10px] text-emerald-700">Target: &lt; 45 Mins</div>
          </div>
        </div>
      </div>

      {toastMessage && (
        <div className="bg-emerald-50 border border-emerald-300 rounded-xl p-3 flex items-center justify-between text-xs text-emerald-900 animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-700 flex-shrink-0" />
            <span>{toastMessage}</span>
          </div>
          <button onClick={() => setToastMessage(null)} className="font-bold text-xs text-emerald-800">✕</button>
        </div>
      )}

      {/* Main Section: Assigned Complaints with False-Alarm Penalty vs Bins Itinerary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Assigned Complaints Requiring Verification */}
        <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200 p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <div className="flex items-center gap-1.5 font-semibold text-slate-900 text-xs">
              <AlertCircle className="w-4 h-4 text-amber-600" />
              <span>{lang === 'hi' ? 'विद्यार्थी शिकायतें (जांच व सत्यापन)' : 'Assigned Complaints for Verification'}</span>
            </div>
            <span className="font-mono text-[10px] bg-amber-100 text-amber-900 px-1.5 py-0.2 rounded font-bold">
              {complaints.length} PENDING
            </span>
          </div>

          <p className="text-[11px] text-slate-500 leading-snug">
            {lang === 'hi'
              ? 'स्थान पर पहुंचकर निरीक्षण करें: यदि डस्टबिन साफ है और शिकायत गलत है, तो "फर्जी रिपोर्ट" करें जिससे छात्र के टोकन कटेंगे।'
              : 'Inspect site: If the bin is clean and report is fake, report false alarm with photo to penalize the student with 25 token deduction.'
            }
          </p>

          <div className="space-y-3">
            {complaints.length === 0 ? (
              <div className="text-center py-8 text-slate-400 text-xs">
                {lang === 'hi' ? 'कोई लंबित शिकायत नहीं है।' : 'No pending complaints assigned.'}
              </div>
            ) : (
              complaints.map(c => (
                <div key={c.id} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 space-y-2 text-xs">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-slate-900">{c.id}</span>
                        <WasteBadge category={c.category} />
                      </div>
                      <div className="font-medium text-slate-800 mt-1">📍 {c.locationText}</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">Reported by: {c.reporterName}</div>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">{c.createdAt}</span>
                  </div>

                  <div className="p-2 bg-white rounded-lg border border-slate-200 text-[11px] text-slate-700">
                    <strong>{lang === 'hi' ? 'विवरण:' : 'Issue:'}</strong> {c.issueType} {c.details ? `— "${c.details}"` : ''}
                  </div>

                  {/* Inspection & Resolution Action Buttons */}
                  <div className="flex items-center justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        setActiveComplaintForReview(c);
                        setReviewRemarks('Bin is completely clean, functioning properly, and was emptied on schedule.');
                      }}
                      className="px-3 py-1.5 rounded-lg border border-rose-300 bg-rose-50 hover:bg-rose-100 text-rose-800 font-medium text-xs flex items-center gap-1.5 transition-colors"
                    >
                      <ThumbsDown className="w-3.5 h-3.5 text-rose-600" />
                      <span>{lang === 'hi' ? 'फर्जी रिपोर्ट (पेनल्टी)' : 'Report False Alarm'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setActiveComplaintForReview(c);
                        setReviewRemarks('Cleared waste, cleaned surrounding perimeter, and sorted into designated bags.');
                      }}
                      className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs flex items-center gap-1.5 transition-colors shadow-xs"
                    >
                      <ThumbsUp className="w-3.5 h-3.5" />
                      <span>{lang === 'hi' ? 'सत्यापित व साफ (+बोनस)' : 'Confirm & Clean'}</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Column: Scheduled Stops (TSP Optimized Route) */}
        <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200 p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <span className="font-semibold text-slate-800 text-xs">
              {lang === 'hi' ? 'नियमित सफाई कार्य (रूट क्रम)' : 'Scheduled Clearance Stops (TSP Order)'}
            </span>
            <span className="text-[10px] text-slate-400">Tractor Cart #2 Beat</span>
          </div>

          <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
            {bins.slice(0, 8).map((b, idx) => (
              <div 
                key={b.id}
                className="p-3 rounded-xl border border-slate-200 bg-slate-50/50 flex items-center justify-between text-xs hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-md bg-slate-900 text-white font-mono text-[11px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-slate-900 text-xs">#{b.id}</span>
                      <span className="font-medium text-slate-800">{b.block}</span>
                      <WasteBadge category={b.category} />
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">📍 {b.locationDetail}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      Weight: <strong>{b.weightKg || 12.4} kg</strong> • Shift: {b.nextShiftTime}
                    </div>
                  </div>
                </div>

                <div className="text-right space-y-1">
                  <FillStatusBadge status={b.status} fillLevel={b.fillLevel} />
                  <button
                    type="button"
                    onClick={() => handleConfirmClearance(b)}
                    className="block ml-auto px-3 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-medium text-[11px] transition-colors shadow-xs"
                  >
                    {lang === 'hi' ? 'खाली किया' : 'Confirm Empty'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Review & Photo Verification Modal */}
      {activeComplaintForReview && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 border border-slate-200 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-semibold text-slate-900 text-base">
                  {lang === 'hi' ? 'स्थल सत्यापन एवं फोटो प्रमाण' : 'Ground Inspection & Proof of Work'}
                </h3>
                <span className="font-mono text-xs text-slate-500">{activeComplaintForReview.id} • {activeComplaintForReview.locationText}</span>
              </div>
              <button 
                onClick={() => setActiveComplaintForReview(null)} 
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  {lang === 'hi' ? 'सफाई कर्मचारी टिप्पणी:' : 'Worker Inspection Remark:'}
                </label>
                <textarea
                  value={reviewRemarks}
                  onChange={(e) => setReviewRemarks(e.target.value)}
                  rows="2"
                  className="w-full p-2.5 rounded-lg border border-slate-300 text-xs"
                  placeholder="Enter observation notes..."
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1 flex items-center gap-1.5">
                  <Camera className="w-3.5 h-3.5 text-slate-500" />
                  <span>{lang === 'hi' ? 'कैमरा फोटो प्रमाण (SLA रिकॉर्ड)' : 'Camera Proof Photo (Uploaded to SLA Record)'}</span>
                </label>
                <div className="relative rounded-xl overflow-hidden border border-slate-200 h-36 bg-slate-100 flex items-center justify-center">
                  <img 
                    src={reviewPhoto} 
                    alt="Proof" 
                    className="w-full h-full object-cover" 
                  />
                  <div className="absolute bottom-2 left-2 bg-black/70 text-white font-mono text-[9px] px-2 py-0.5 rounded">
                    GPS: 29.8649° N, 77.8966° E • Govind Bhawan
                  </div>
                </div>
              </div>

              {/* Two Distinct Outcomes with Explanations */}
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-2">
                <div className="text-[11px] text-slate-600">
                  <strong>{lang === 'hi' ? 'कार्रवाई चुनें:' : 'Select Outcome Action:'}</strong>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleReportFalseAlarm(activeComplaintForReview)}
                    className="p-2.5 rounded-lg border border-rose-300 bg-rose-50 hover:bg-rose-100 text-rose-950 text-left font-medium transition-colors"
                  >
                    <div className="font-bold flex items-center gap-1 text-rose-800">
                      <ThumbsDown className="w-3.5 h-3.5" />
                      <span>{lang === 'hi' ? 'फर्जी रिपोर्ट' : 'False Alarm'}</span>
                    </div>
                    <div className="text-[10px] text-rose-700 mt-0.5">
                      {lang === 'hi' ? 'छात्र से -25 टोकन कटेंगे' : 'Deducts 25 Tokens from Student'}
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleVerifyLegitimate(activeComplaintForReview)}
                    className="p-2.5 rounded-lg border border-emerald-300 bg-emerald-50 hover:bg-emerald-100 text-emerald-950 text-left font-medium transition-colors"
                  >
                    <div className="font-bold flex items-center gap-1 text-emerald-800">
                      <ThumbsUp className="w-3.5 h-3.5" />
                      <span>{lang === 'hi' ? 'सत्यापित सफाई' : 'Valid & Cleaned'}</span>
                    </div>
                    <div className="text-[10px] text-emerald-700 mt-0.5">
                      {lang === 'hi' ? 'छात्र को +35, आपको +₹150' : 'Student +35 Pts, Worker +₹150'}
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MobileNetV3 Rapid AI Waste Sorter Modal */}
      {isAiSorterOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 border border-slate-200 shadow-2xl animate-fadeIn">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-700 flex items-center justify-center">
                  <Cpu className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">
                    MobileNetV3 Edge Waste Classifier
                  </h3>
                  <div className="text-[11px] text-slate-500 font-mono">
                    2.9M Params • ~12ms On-Device Latency • ElevenLabs Spoken Guidance
                  </div>
                </div>
              </div>
              <button 
                onClick={() => { setIsAiSorterOpen(false); setClassifiedItem(null); stopSpeaking(); }}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <p className="text-slate-600 text-[11px]">
                {lang === 'hi'
                  ? 'सफाई कर्मचारी किसी भी कचरे की वस्तु पर कैमरा केंद्रित करके तुरंत सही बोरी (नीली, हरी, या नारंगी) का निर्देश पा सकते हैं:'
                  : 'Point camera at mixed waste to instantly hear spoken audio directing it into the correct baling stream:'
                }
              </p>

              {/* Sample Objects Buttons */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  type="button"
                  onClick={() => handleSimulateMobileNetSort('cardboard')}
                  className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-blue-50 hover:border-blue-300 text-left transition-all"
                >
                  <div className="font-semibold text-slate-900">📦 Cardboard Box</div>
                  <div className="text-[10px] text-slate-500">गत्ता / कार्टन</div>
                </button>

                <button
                  type="button"
                  onClick={() => handleSimulateMobileNetSort('bottle')}
                  className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-blue-50 hover:border-blue-300 text-left transition-all"
                >
                  <div className="font-semibold text-slate-900">🧴 PET Bottle</div>
                  <div className="text-[10px] text-slate-500">प्लास्टिक बोतल</div>
                </button>

                <button
                  type="button"
                  onClick={() => handleSimulateMobileNetSort('food')}
                  className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-emerald-50 hover:border-emerald-300 text-left transition-all"
                >
                  <div className="font-semibold text-slate-900">🍎 Food Scrap</div>
                  <div className="text-[10px] text-slate-500">बचा हुआ खाना</div>
                </button>

                <button
                  type="button"
                  onClick={() => handleSimulateMobileNetSort('battery')}
                  className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-amber-50 hover:border-amber-300 text-left transition-all"
                >
                  <div className="font-semibold text-slate-900">🔋 Li-Ion Battery</div>
                  <div className="text-[10px] text-slate-500">ई-कचरा</div>
                </button>
              </div>

              {/* Classification Result Card */}
              {classifiedItem && (
                <div className="bg-slate-900 text-white rounded-xl p-4 space-y-3 animate-fadeIn">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <div>
                      <div className="text-[10px] font-mono text-emerald-400">
                        CONFIDENCE: {classifiedItem.confidence} • INFERENCE: {classifiedItem.latencyMs}ms
                      </div>
                      <h4 className="font-bold text-white text-sm mt-0.5">
                        {lang === 'hi' ? classifiedItem.nameHi : classifiedItem.name}
                      </h4>
                    </div>

                    <span className="px-2.5 py-1 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30 font-mono font-bold text-xs">
                      {classifiedItem.compartment}
                    </span>
                  </div>

                  <div className="bg-slate-800/80 p-3 rounded-lg border border-slate-700 flex items-start gap-2.5">
                    <Volume2 className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5 animate-pulse" />
                    <div className="space-y-0.5">
                      <div className="text-[10px] font-mono text-amber-300 font-semibold">
                        ELEVENLABS BILINGUAL AUDIO ({lang === 'hi' ? 'HINDI' : 'ENGLISH'})
                      </div>
                      <div className="text-xs text-slate-200 italic leading-snug">
                        "{lang === 'hi' ? classifiedItem.voiceHi : classifiedItem.voiceEn}"
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                    <span>Estimated Net Mass: <strong>{classifiedItem.weightKg} kg</strong></span>
                    <button
                      type="button"
                      onClick={() => {
                        setToastMessage(lang === 'hi' ? 'बोरी में दर्ज किया गया।' : 'Logged into stream consignment.');
                        setClassifiedItem(null);
                      }}
                      className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded font-medium text-xs"
                    >
                      {lang === 'hi' ? 'बोरी में डाला गया' : 'Confirm Sorted'}
                    </button>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      )}

    </div>
  );
}
