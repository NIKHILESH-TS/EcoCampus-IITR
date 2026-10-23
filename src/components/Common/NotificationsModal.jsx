import React, { useState, useEffect } from 'react';
import { Bell, Clock, CheckCircle2 } from 'lucide-react';
import { db } from '../../services/db';

export default function NotificationsModal({ isOpen, onClose }) {
  const [dispatches, setDispatches] = useState([]);

  useEffect(() => {
    if (isOpen) {
      setDispatches(db.getAllDispatches());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-lg w-full p-5 border border-slate-200 shadow-card text-xs space-y-4 max-h-[85vh] overflow-y-auto">
        
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-semibold text-sm text-slate-900">
                Official Estate Dispatches & Auto-Acks
              </h3>
              <p className="text-[11px] text-slate-500">
                Automatic one-way status notifications sent to students
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 text-xs font-bold">
            ✕
          </button>
        </div>

        <div className="space-y-2.5">
          {dispatches.length === 0 ? (
            <div className="text-center py-8 text-slate-400 text-xs">
              No dispatches logged yet.
            </div>
          ) : (
            dispatches.map(item => (
              <div key={item.id} className="p-3 rounded-lg border border-slate-200 bg-slate-50 text-xs space-y-1.5">
                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span className="font-mono font-bold text-slate-800 bg-white px-1.5 py-0.2 rounded border border-slate-200">
                    Ref: {item.complaintId}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-400" />
                    {item.sentAt}
                  </span>
                </div>

                <div className="bg-emerald-50/90 border border-emerald-200 p-2 rounded text-[11px] font-mono text-emerald-950">
                  "{item.messageText}"
                </div>

                <div className="flex justify-between text-[10px] text-slate-400 pt-0.5">
                  <span>Assigned: <strong className="text-slate-600">{item.squadAssigned}</strong></span>
                  <span className="text-emerald-700 font-medium">✓ Delivered</span>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="pt-2 border-t border-slate-100 text-center">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs transition-colors"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
