import React, { useState, useEffect } from 'react';
import { Leaf, Bell, Shield, User, Coins, RefreshCw, CheckCircle2 } from 'lucide-react';
import { db } from '../services/db';

export default function Navbar({ currentRole, onRoleChange, onOpenNotifications }) {
  const [user, setUser] = useState(db.getCurrentUser());
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const handleUpdate = () => {
      setUser(db.getCurrentUser());
      const dispatches = db.getAllDispatches();
      setUnreadCount(dispatches.length);
    };

    handleUpdate();
    window.addEventListener('ecocampus_db_change', handleUpdate);
    return () => window.removeEventListener('ecocampus_db_change', handleUpdate);
  }, []);

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200">
      {/* Top Thin Hackathon Bar */}
      <div className="bg-slate-900 text-slate-300 text-[11px] px-4 py-1.5 flex items-center justify-between font-sans">
        <div className="flex items-center gap-2 max-w-7xl mx-auto w-full">
          <span className="bg-emerald-500/20 text-emerald-400 px-1.5 py-0.2 rounded font-mono font-medium text-[10px]">
            SOCIOTHON 2026
          </span>
          <span className="text-slate-300">IIT Roorkee Smart Waste Management System</span>
          <span className="text-slate-500 hidden sm:inline">•</span>
          <span className="text-slate-400 hidden sm:inline">Pilot: Govind Bhawan (200 Dustbins)</span>

          <div className="ml-auto flex items-center gap-4">
            <button
              onClick={() => {
                if (confirm('Reset database to clean initial state?')) {
                  db.reset();
                }
              }}
              className="text-slate-400 hover:text-slate-200 flex items-center gap-1 text-[10px] transition-colors"
              title="Reset all complaints and items"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Reset Demo State</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
        
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-brand-dark flex items-center justify-center text-white">
            <Leaf className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <div className="font-semibold text-slate-900 text-sm tracking-tight flex items-center gap-2">
              <span>EcoCampus IITR</span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                v2.0
              </span>
            </div>
            <div className="text-[11px] text-slate-500">
              {currentRole === 'student' ? 'Student Portal • Govind Bhawan' : 'Campus Estate Administration'}
            </div>
          </div>
        </div>

        {/* Right Tools & Role Switcher */}
        <div className="flex items-center gap-3">
          
          {/* Student EcoPoints Badge */}
          {currentRole === 'student' && (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs">
              <Coins className="w-3.5 h-3.5 text-emerald-700" />
              <span className="font-bold font-mono">{user.ecoPointsBalance}</span>
              <span className="text-[11px] text-emerald-700">EcoPoints</span>
            </div>
          )}

          {/* Minimalist Role Switcher */}
          <div className="bg-slate-100 p-0.5 rounded-lg flex items-center border border-slate-200 text-xs">
            <button
              type="button"
              onClick={() => onRoleChange('student')}
              className={`px-3 py-1 rounded-md font-medium transition-colors flex items-center gap-1.5 ${
                currentRole === 'student'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <User className="w-3 h-3 text-emerald-700" />
              <span>Student</span>
            </button>
            <button
              type="button"
              onClick={() => onRoleChange('admin')}
              className={`px-3 py-1 rounded-md font-medium transition-colors flex items-center gap-1.5 ${
                currentRole === 'admin'
                  ? 'bg-brand-dark text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Shield className="w-3 h-3 text-amber-300" />
              <span>Admin</span>
            </button>
          </div>

          {/* Notifications Button */}
          <button
            type="button"
            onClick={onOpenNotifications}
            className="relative p-2 rounded-lg text-slate-600 hover:bg-slate-100 border border-slate-200 hover:text-slate-900 transition-colors"
            title="View One-Way Administrative Acknowledgment Log"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-600 text-white font-mono text-[9px] font-bold flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

        </div>

      </div>
    </header>
  );
}
