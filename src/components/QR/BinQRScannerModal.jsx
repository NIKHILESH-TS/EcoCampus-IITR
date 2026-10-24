import React, { useState, useEffect } from 'react';
import { 
  QrCode, 
  Camera, 
  CheckCircle2, 
  X, 
  Clock, 
  AlertTriangle, 
  Send, 
  Layers, 
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { db, WASTE_TYPES } from '../../services/db';
import { WasteBadge, FillStatusBadge } from '../Common/Badges';
import { generateBinQRCode } from '../../services/qrGenerator';

export default function BinQRScannerModal({ isOpen, onClose }) {
  const [scannedBinId, setScannedBinId] = useState(null);
  const [binData, setBinData] = useState(null);
  const [binQrUrl, setBinQrUrl] = useState(null);
  const [isScanning, setIsScanning] = useState(true);
  
  // Issue report inside scanner
  const [isReporting, setIsReporting] = useState(false);
  const [issueType, setIssueType] = useState('Missed Cleaning: Not emptied as per scheduled shift');
  const [issueNote, setIssueNote] = useState('');
  const [ackNotice, setAckNotice] = useState(null);

  useEffect(() => {
    if (scannedBinId) {
      const data = db.getBinById(scannedBinId);
      setBinData(data);
      if (data) {
        generateBinQRCode(data.id).then(setBinQrUrl);
      }
    }
  }, [scannedBinId]);

  if (!isOpen) return null;

  const handleSimulateScan = (id) => {
    setIsScanning(false);
    setScannedBinId(id);
    setAckNotice(null);
    setIsReporting(false);
  };

  const handleResetScanner = () => {
    setIsScanning(true);
    setScannedBinId(null);
    setBinData(null);
    setAckNotice(null);
    setIsReporting(false);
  };

  const handleSubmitQuickReport = (e) => {
    e.preventDefault();
    if (!binData) return;

    const result = db.createComplaint({
      binId: binData.id,
      locationText: binData.locationDetail,
      category: binData.category,
      issueType: issueType,
      details: issueNote || `Scanned via QR code at ${binData.locationDetail}. Fill level ${binData.fillLevel}%.`,
      photoUrl: 'https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?auto=format&fit=crop&w=500&q=80'
    });

    setAckNotice(result.dispatch.messageText);
    setIsReporting(false);
    setBinData(db.getBinById(binData.id)); // Reload updated bin state
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs font-sans">
      <div className="bg-white rounded-2xl max-w-lg w-full p-5 border border-slate-200 shadow-card text-xs space-y-4 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-brand-dark text-white flex items-center justify-center font-bold">
              <QrCode className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <h3 className="font-semibold text-sm text-slate-900">
                Govind Bhawan Bin QR Scanner
              </h3>
              <p className="text-[11px] text-slate-500">
                Point camera at any bin's physical sticker to pull live telemetry
              </p>
            </div>
          </div>
          <button 
            onClick={() => {
              handleResetScanner();
              onClose();
            }} 
            className="text-slate-400 hover:text-slate-700 text-xs font-bold"
          >
            ✕
          </button>
        </div>

        {/* Viewfinder State */}
        {isScanning ? (
          <div className="space-y-4">
            
            {/* Viewfinder View */}
            <div className="relative w-full h-64 bg-slate-950 rounded-xl overflow-hidden flex flex-col items-center justify-center border-2 border-dashed border-slate-700 text-slate-400">
              <div className="absolute inset-x-8 inset-y-6 border-2 border-emerald-500/60 rounded-lg pointer-events-none">
                <div className="w-full h-0.5 bg-emerald-400 shadow-lg animate-bounce mt-10" />
              </div>
              <Camera className="w-8 h-8 text-emerald-400/80 mb-2" />
              <span className="text-xs text-slate-300 font-medium">Scanning for QR code...</span>
              <span className="text-[10px] text-slate-500 mt-1">Center the bin QR sticker within the reticle</span>
            </div>

            {/* Simulated Bin Scanner buttons for live demo presentation */}
            <div className="space-y-2 pt-1">
              <span className="text-[11px] font-semibold text-slate-600 block">
                Instant Demo Quick-Scans (Simulate Camera Scan):
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => handleSimulateScan('GB-018')}
                  className="p-2.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-emerald-50 hover:border-emerald-300 text-left transition-colors"
                >
                  <div className="font-mono font-bold text-slate-900">Scan #GB-018</div>
                  <div className="text-[10px] text-slate-500">Block A (Bio 88%)</div>
                </button>

                <button
                  type="button"
                  onClick={() => handleSimulateScan('GB-042')}
                  className="p-2.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-emerald-50 hover:border-emerald-300 text-left transition-colors"
                >
                  <div className="font-mono font-bold text-slate-900">Scan #GB-042</div>
                  <div className="text-[10px] text-slate-500">Block B (Recycle 92%)</div>
                </button>

                <button
                  type="button"
                  onClick={() => handleSimulateScan('GB-104')}
                  className="p-2.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-emerald-50 hover:border-emerald-300 text-left transition-colors"
                >
                  <div className="font-mono font-bold text-slate-900">Scan #GB-104</div>
                  <div className="text-[10px] text-slate-500">Mess Backyard (E-Waste)</div>
                </button>
              </div>
            </div>

          </div>
        ) : (
          /* Scanned Bin Details Card */
          binData && (
            <div className="space-y-4 animate-fadeIn">
              
              {/* QR and Title Card */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex items-start gap-4">
                {binQrUrl && (
                  <img 
                    src={binQrUrl} 
                    alt={`QR ${binData.id}`} 
                    className="w-20 h-20 rounded bg-white p-1 border border-slate-200 flex-shrink-0" 
                  />
                )}
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-sm text-slate-900">
                      #{binData.id}
                    </span>
                    <FillStatusBadge status={binData.status} fillLevel={binData.fillLevel} />
                  </div>
                  <div className="font-medium text-slate-800 text-xs">
                    {binData.block} • {binData.floor}
                  </div>
                  <div className="text-[11px] text-slate-500">
                    📍 {binData.locationDetail}
                  </div>
                  <div className="pt-1">
                    <WasteBadge category={binData.category} />
                  </div>
                </div>
              </div>

              {/* Volume Progress */}
              <div className="bg-white p-3 rounded-lg border border-slate-200 space-y-1.5">
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-600 font-medium">Real-Time Fill Telemetry:</span>
                  <span className="font-mono font-bold text-slate-900">{binData.fillLevel}% (120L Capacity)</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${
                      binData.fillLevel > 80 ? 'bg-rose-500' :
                      binData.fillLevel > 60 ? 'bg-amber-500' : 'bg-emerald-500'
                    }`}
                    style={{ width: `${binData.fillLevel}%` }}
                  />
                </div>
              </div>

              {/* Cleaning Shift Times */}
              <div className="bg-emerald-50/70 p-3 rounded-lg border border-emerald-200 space-y-1 text-xs">
                <div className="flex items-center justify-between text-emerald-950 font-medium">
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-emerald-700" />
                    Next Scheduled Cleaning Shift:
                  </span>
                  <span className="font-mono font-bold text-emerald-800 bg-white px-2 py-0.5 rounded border border-emerald-300">
                    {binData.nextShiftTime}
                  </span>
                </div>
                <div className="text-[11px] text-emerald-800">
                  Daily shifts: <strong>07:30 AM</strong>, <strong>02:00 PM</strong>, and <strong>08:30 PM</strong>. Last emptied: {binData.lastCleanedAt}.
                </div>
              </div>

              {/* Auto-Ack Notification Banner if complaint filed */}
              {ackNotice && (
                <div className="bg-emerald-50 border border-emerald-300 p-3 rounded-lg space-y-1">
                  <div className="flex items-center gap-1.5 font-semibold text-emerald-950 text-xs">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                    <span>One-Way Confirmation Dispatched from Estate Desk:</span>
                  </div>
                  <p className="font-mono text-[11px] text-emerald-900 bg-white p-2 rounded border border-emerald-200">
                    "{ackNotice}"
                  </p>
                  <span className="text-[10px] text-emerald-700 block">
                    +15 EcoPoints added to your balance!
                  </span>
                </div>
              )}

              {/* 1-Tap Report Issue Form */}
              {isReporting ? (
                <form onSubmit={handleSubmitQuickReport} className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2.5">
                  <div className="font-semibold text-slate-800 text-xs">
                    File Quick Complaint for #{binData.id}:
                  </div>
                  
                  <select
                    value={issueType}
                    onChange={(e) => setIssueType(e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-200 bg-white text-xs"
                  >
                    <option value="Missed Cleaning: Not emptied as per scheduled shift">
                      Missed Cleaning: Not emptied as per 07:30 AM / 02:00 PM shift
                    </option>
                    <option value="Overflowing: Spilling onto corridor floor">
                      Overflowing: Waste spilling onto floor
                    </option>
                    <option value="Severe Odor & Stray Animal Hazard">
                      Hygiene Hazard: Foul odor & stray animals
                    </option>
                    <option value="Segregation Error: Incompatible waste dumped">
                      Segregation Error: Incompatible waste dumped
                    </option>
                  </select>

                  <input
                    type="text"
                    placeholder="Optional note / specific detail..."
                    value={issueNote}
                    onChange={(e) => setIssueNote(e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-200 bg-white text-xs"
                  />

                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setIsReporting(false)}
                      className="px-3 py-1 rounded text-slate-600 hover:bg-slate-200 text-xs"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1 rounded bg-rose-600 hover:bg-rose-700 text-white font-medium text-xs flex items-center gap-1"
                    >
                      <Send className="w-3 h-3" />
                      <span>Submit 1-Tap Alert</span>
                    </button>
                  </div>
                </form>
              ) : (
                <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={handleResetScanner}
                    className="flex-1 py-2 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 font-medium text-xs transition-colors"
                  >
                    ← Scan Another Bin
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsReporting(true)}
                    className="flex-1 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-medium text-xs flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>Report Uncleaned / Full</span>
                  </button>
                </div>
              )}

            </div>
          )
        )}

      </div>
    </div>
  );
}
