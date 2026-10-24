import React, { useState } from 'react';
import { 
  X, 
  Camera, 
  AlertCircle, 
  CheckCircle2, 
  MapPin, 
  Sparkles,
  ShieldCheck,
  Send
} from 'lucide-react';
import { db } from '../../services/db';

const QUICK_ISSUES = [
  { id: 'overflow', label: '🗑️ Overfilled / Spilling', desc: 'Waste piled above bin brim' },
  { id: 'broken', label: '🛠️ Broken Pedal / Lid', desc: 'Hardware damaged or lid jammed' },
  { id: 'odor', label: '🦨 Bad Odor / Surrounding Trash', desc: 'Food waste decaying or floor littered' }
];

export default function QuickReportModal({ isOpen, onClose, defaultBinId = 'GB-042' }) {
  const [selectedBinId, setSelectedBinId] = useState(defaultBinId);
  const [selectedIssue, setSelectedIssue] = useState(QUICK_ISSUES[0].id);
  const [customDetails, setCustomDetails] = useState('');
  const [photoUrl, setPhotoUrl] = useState('https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?auto=format&fit=crop&w=500&q=80');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedAck, setSubmittedAck] = useState(null);

  if (!isOpen) return null;

  const bins = db.getBins().slice(0, 15);
  const currentBin = db.getBinById(selectedBinId) || bins[0];

  const handleSubmit = (e) => {
    e.preventDefault();
    const issueObj = QUICK_ISSUES.find(i => i.id === selectedIssue) || QUICK_ISSUES[0];
    
    const result = db.createComplaint({
      binId: currentBin.id,
      locationText: currentBin.locationDetail,
      category: currentBin.category,
      issueType: issueObj.label,
      details: customDetails || issueObj.desc,
      photoUrl: photoUrl
    });

    setSubmittedAck(result);
    setIsSubmitted(true);
  };

  const handleDone = () => {
    setIsSubmitted(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-5 space-y-4 border border-slate-200 shadow-xl text-xs font-sans animate-fadeIn">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
              <AlertCircle className="w-4 h-4 text-amber-700" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Quick Bin Issue Report</h3>
              <p className="text-[11px] text-slate-400">Govind Bhawan Sanitation Beat</p>
            </div>
          </div>
          <button 
            type="button" 
            onClick={onClose} 
            className="text-slate-400 hover:text-slate-700 font-bold p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSubmitted ? (
          <div className="text-center py-4 space-y-3">
            <div className="w-12 h-12 bg-emerald-100 border border-emerald-300 rounded-full flex items-center justify-center mx-auto text-emerald-700">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-base">Report Dispatched!</h4>
              <p className="text-xs text-slate-600 mt-1 max-w-xs mx-auto">
                Sanitation Squad #2 (Ramesh Kumar) has received your notification.
              </p>
            </div>

            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-[11px] text-emerald-950 font-mono text-left space-y-1">
              <div className="font-semibold text-emerald-900 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                <span>Ticket #{submittedAck?.complaint?.id} Created</span>
              </div>
              <div>📍 Location: {currentBin.locationDetail}</div>
              <div>🎁 Reward: +35 EcoTokens when worker confirms & clears.</div>
            </div>

            <button
              type="button"
              onClick={handleDone}
              className="w-full py-2.5 rounded-xl bg-slate-900 text-white font-semibold text-xs hover:bg-slate-800 transition-colors shadow-xs"
            >
              Done & Return to Home
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3.5">
            
            {/* 1. Pick Bin */}
            <div>
              <label className="block font-semibold text-slate-800 mb-1">
                1. Select Dustbin:
              </label>
              <select
                value={selectedBinId}
                onChange={(e) => setSelectedBinId(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 bg-slate-50 text-slate-800 text-xs font-medium focus:bg-white focus:ring-2 focus:ring-blue-500"
              >
                {bins.map(b => (
                  <option key={b.id} value={b.id}>
                    #{b.id} • {b.block} • {b.locationDetail} ({b.fillLevel}% full)
                  </option>
                ))}
              </select>
            </div>

            {/* 2. Choose Issue */}
            <div>
              <label className="block font-semibold text-slate-800 mb-1">
                2. What is the issue?
              </label>
              <div className="space-y-2">
                {QUICK_ISSUES.map(issue => (
                  <button
                    key={issue.id}
                    type="button"
                    onClick={() => setSelectedIssue(issue.id)}
                    className={`w-full p-2.5 rounded-xl border text-left flex items-start justify-between transition-all ${
                      selectedIssue === issue.id
                        ? 'border-blue-600 bg-blue-50/70 text-blue-950 ring-1 ring-blue-600 font-medium'
                        : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div>
                      <div className="font-semibold text-xs">{issue.label}</div>
                      <div className="text-[10px] text-slate-500">{issue.desc}</div>
                    </div>
                    {selectedIssue === issue.id && (
                      <span className="text-blue-600 font-bold text-xs">✓</span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Photo Evidence Preview */}
            <div>
              <label className="block font-semibold text-slate-800 mb-1">
                3. Attached Photo Evidence:
              </label>
              <div className="flex items-center gap-3 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                <img 
                  src={photoUrl} 
                  alt="Bin Preview" 
                  className="w-14 h-14 rounded-lg object-cover border border-slate-200 flex-shrink-0"
                />
                <div className="text-[11px] text-slate-600 leading-tight">
                  <span className="font-medium text-slate-900 block">Photo Tagged</span>
                  <span>Captured with GPS timestamp & Govind Bhawan geofence.</span>
                </div>
              </div>
            </div>

            {/* Anti-griefing incentive pill */}
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-[11px] text-slate-600 flex items-center justify-between">
              <span>Earn on verified fix:</span>
              <span className="font-mono font-bold text-emerald-700">+35 EcoTokens (≈ ₹17.50)</span>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 pt-1 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                className="w-1/3 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-medium text-xs transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="w-2/3 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-all shadow-xs flex items-center justify-center gap-1.5 active:scale-98"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit & Dispatch Squad</span>
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
}
