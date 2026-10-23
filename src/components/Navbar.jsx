import React, { useState, useEffect } from 'react';
import { 
  Leaf, 
  ShieldCheck, 
  User, 
  Coins, 
  Bell, 
  RefreshCw, 
  Sparkles, 
  LogOut, 
  Award,
  Layers
} from 'lucide-react';
import { store } from '../services/store';

export default function Navbar({ currentRole, onRoleChange, onOpenLogin, onOpenNotifications }) {
  const [user, setUser] = useState(store.getUser());
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const handleUpdate = () => {
      setUser(store.getUser());
      const complaints = store.getComplaints();
      const recentAcks = complaints.filter(c => c.adminAcknowledgment && !c.readByStudent).length;
      setUnreadCount(recentAcks || 2);
    };

    handleUpdate();
    window.addEventListener('iitr_store_update', handleUpdate);
    return () => window.removeEventListener('iitr_store_update', handleUpdate);
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-hallmark-border shadow-soft">
      {/* Top micro announcement bar */}
      <div className="bg-hallmark-dark text-emerald-100/90 text-xs py-1.5 px-4 font-sans border-b border-emerald-900/40">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] bg-amber-500/20 text-amber-300 font-semibold uppercase tracking-wider">
              SOCIOTHON 2026
            </span>
            <span className="hidden sm:inline">NSS IIT Roorkee • Smart & Sustainable Waste Management Initiative</span>
            <span className="sm:hidden">IIT Roorkee Smart SWM</span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <span className="text-emerald-300/80 hidden md:inline">
              Empirical Data: MDPI Study 2019 • 5.5 Tonnes/Day Target
            </span>
            <button 
              onClick={() => {
                if (confirm("Reset demo data to default initial state?")) {
                  store.resetDefaults();
                }
              }}
              className="inline-flex items-center gap-1 text-emerald-300 hover:text-white transition-colors"
              title="Reset data for fresh demo"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Reset Demo Data</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main navigation header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand & Emblem */}
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-hallmark-primary to-hallmark-dark flex items-center justify-center text-white shadow-md ring-2 ring-emerald-600/20">
              <Leaf className="w-6 h-6 text-emerald-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display font-bold text-xl text-hallmark-dark tracking-tight">
                  EcoCampus <span className="text-hallmark-primary">IITR</span>
                </span>
                <span className="hidden sm:inline-block text-[11px] font-mono font-medium px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                  Govind Bhawan Pilot
                </span>
              </div>
              <p className="text-xs text-slate-500 font-sans -mt-0.5">
                AI Waste Segregation & Circular Economy Platform
              </p>
            </div>
          </div>

          {/* Role Switcher & Student Status pill */}
          <div className="flex items-center gap-3">
            
            {/* Student EcoPoints Badge */}
            {currentRole === 'student' && (
              <div className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-50/90 border border-amber-200 text-amber-900 shadow-sm">
                <div className="w-6 h-6 rounded-full bg-amber-200/80 flex items-center justify-center text-amber-800">
                  <Coins className="w-3.5 h-3.5" />
                </div>
                <div className="text-left">
                  <div className="text-xs font-bold leading-none">{user.ecoPoints} <span className="font-normal text-[10px]">EcoPoints</span></div>
                  <div className="text-[10px] text-amber-700 leading-none mt-0.5">{user.wasteDivertedKg} kg waste saved</div>
                </div>
              </div>
            )}

            {/* Quick Demo Switcher Pill */}
            <div className="bg-slate-100 p-1 rounded-xl flex items-center border border-slate-200">
              <button
                onClick={() => onRoleChange('student')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  currentRole === 'student'
                    ? 'bg-white text-hallmark-dark shadow-sm font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <User className="w-3.5 h-3.5 text-emerald-700" />
                <span>Student View</span>
              </button>

              <button
                onClick={() => onRoleChange('admin')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  currentRole === 'admin'
                    ? 'bg-hallmark-dark text-white shadow-sm font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5 text-amber-300" />
                <span>Admin View</span>
              </button>
            </div>

            {/* Notifications Button */}
            <button
              onClick={onOpenNotifications}
              className="relative p-2 rounded-xl text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors border border-transparent hover:border-slate-200"
              title="View Administrator Auto-Acknowledgements"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-bounce">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Logout / Switch persona */}
            <button
              onClick={onOpenLogin}
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-hallmark-border hover:bg-hallmark-muted text-xs font-medium text-slate-700 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5 text-slate-500" />
              <span>Switch Login</span>
            </button>

          </div>
        </div>
      </div>
    </header>
  );
}
