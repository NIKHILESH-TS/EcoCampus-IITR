import React from 'react';
import { X, Bell, CheckCircle2, AlertTriangle, ShieldCheck, Clock } from 'lucide-react';
import { store } from '../../services/store';

export default function NotificationsModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const complaints = store.getComplaints();
  const acks = complaints.filter(c => c.adminAcknowledgment);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-lifted border border-hallmark-border font-sans max-h-[85vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-bold text-base text-slate-900">
                Official Administrative Notifications
              </h3>
              <p className="text-xs text-slate-500">
                Automated one-way dispatches & status logs
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 text-sm">
            ✕
          </button>
        </div>

        <div className="mt-4 space-y-3">
          {acks.length === 0 ? (
            <div className="text-center py-8 text-xs text-slate-400">
              No notifications yet. File a bin or spot complaint to trigger an automatic one-way update.
            </div>
          ) : (
            acks.map((complaint) => (
              <div key={complaint.id} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-2">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-mono font-bold text-slate-800 bg-white px-2 py-0.5 rounded border border-slate-200">
                    {complaint.id}
                  </span>
                  <span className="text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {complaint.adminAcknowledgment.sentAt}
                  </span>
                </div>

                <div className="text-slate-700 font-medium">
                  📍 {complaint.location}
                </div>

                <div className="bg-emerald-50/90 p-2.5 rounded-xl border border-emerald-200 text-emerald-950 font-mono text-[11px] leading-relaxed">
                  "{complaint.adminAcknowledgment.message}"
                </div>

                <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                  <span>Signatory: <strong>{complaint.adminAcknowledgment.adminOfficer}</strong></span>
                  <span className="text-emerald-700 font-semibold">✓ Dispatched</span>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="mt-6 pt-3 border-t border-slate-100 text-center">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-hallmark-primary text-white font-medium text-xs hover:bg-hallmark-dark transition-colors"
          >
            Close Notification Center
          </button>
        </div>
      </div>
    </div>
  );
}
