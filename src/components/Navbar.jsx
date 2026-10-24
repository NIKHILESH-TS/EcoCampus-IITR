import React, { useState, useEffect } from 'react';
import { 
  Leaf, 
  Bell, 
  Shield, 
  User, 
  Coins, 
  RefreshCw, 
  Mic, 
  QrCode,
  Truck,
  Landmark,
  Building2,
  KeyRound
} from 'lucide-react';
import { db } from '../services/db';
import { getElevenLabsConfig } from '../services/elevenlabs';

export default function Navbar({ 
  currentRole, 
  onRoleChange, 
  onOpenNotifications, 
  onOpenVoiceAgent,
  onOpenQrScanner,
  onOpenVault,
  onOpenProConnect,
  onOpenAuthGateway
}) {
  const [user, setUser] = useState(db.getCurrentUser());
  const [vault, setVault] = useState(db.getVault());
  const [unreadCount, setUnreadCount] = useState(0);
  const [isProActive, setIsProActive] = useState(false);

  useEffect(() => {
    const handleUpdate = () => {
      setUser(db.getCurrentUser());
      setVault(db.getVault());
      const dispatches = db.getAllDispatches();
      setUnreadCount(dispatches.length);
      const elevenConfig = getElevenLabsConfig();
      setIsProActive(Boolean(elevenConfig.apiKey && elevenConfig.apiKey.trim().length > 10));
    };

    handleUpdate();
    window.addEventListener('ecocampus_db_change', handleUpdate);
    window.addEventListener('elevenlabs_config_change', handleUpdate);
    return () => {
      window.removeEventListener('ecocampus_db_change', handleUpdate);
      window.removeEventListener('elevenlabs_config_change', handleUpdate);
    };
  }, []);

  const handleRoleSelect = (newRole) => {
    onRoleChange(newRole);
    if (newRole === 'student') db.setCurrentUser('USR-001');
    else if (newRole === 'admin') db.setCurrentUser('USR-002');
    else if (newRole === 'worker') db.setCurrentUser('USR-003');
    else if (newRole === 'recycler') db.setCurrentUser('USR-004');
  };

  return (
    <header className="sticky top-0 z-30 bg-white/85 backdrop-blur-xl border-b border-slate-200/80 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
        
        {/* Left: Brand Identity */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-slate-900 flex items-center justify-center text-white shadow-xs">
            <Leaf className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <div className="font-semibold text-slate-900 text-sm tracking-tight flex items-center gap-2">
              <span>EcoCampus</span>
              <span className="text-[11px] font-normal text-slate-400 hidden sm:inline">IIT Roorkee</span>
            </div>
            <div className="text-[11px] text-slate-500 hidden sm:block">
              Circular Waste Operating System
            </div>
          </div>
        </div>

        {/* Center: Clean Apple-Style Segmented Persona Switcher */}
        <div className="bg-slate-100/90 p-1 rounded-xl hidden md:flex items-center border border-slate-200/60 text-xs">
          {[
            { id: 'student', label: 'Student', icon: User },
            { id: 'worker', label: 'Field Crew', icon: Truck },
            { id: 'admin', label: 'Admin', icon: Shield },
            { id: 'recycler', label: 'B2B Recycler', icon: Building2 }
          ].map(tab => {
            const Icon = tab.icon;
            const active = currentRole === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => handleRoleSelect(tab.id)}
                className={`px-3.5 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                  active
                    ? 'bg-white text-slate-900 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${active ? 'text-slate-900' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Right: Clean Utility Actions */}
        <div className="flex items-center gap-2">
          
          {/* Mobile Role Select */}
          <div className="md:hidden">
            <select
              value={currentRole}
              onChange={(e) => handleRoleSelect(e.target.value)}
              className="py-1.5 px-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-900"
            >
              <option value="student">Student</option>
              <option value="worker">Field Crew</option>
              <option value="admin">Admin</option>
              <option value="recycler">Recycler</option>
            </select>
          </div>

          {/* Campus Vault Pill */}
          <button
            type="button"
            onClick={onOpenVault}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200/70 text-slate-800 text-xs font-medium transition-colors cursor-pointer"
            title="Campus Circular Vault & Treasury"
          >
            <Landmark className="w-3.5 h-3.5 text-emerald-600" />
            <span className="font-mono font-semibold text-slate-900">₹{(vault.totalCashInr / 1000).toFixed(0)}k</span>
          </button>

          {/* QR Scanner */}
          <button
            type="button"
            onClick={onOpenQrScanner}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200/70 text-slate-700 transition-colors cursor-pointer"
            title="Scan Bin QR Code"
          >
            <QrCode className="w-4 h-4" />
          </button>

          {/* ElevenLabs Voice Assistant */}
          <button
            type="button"
            onClick={onOpenVoiceAgent}
            onDoubleClick={onOpenProConnect}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
              isProActive
                ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                : 'bg-slate-100 hover:bg-slate-200/70 text-slate-800'
            }`}
            title="Multilingual Voice Assistant"
          >
            <Mic className="w-3.5 h-3.5 text-emerald-600" />
            <span className="hidden lg:inline">Voice AI</span>
          </button>

          {/* Student EcoTokens Pill */}
          {currentRole === 'student' && (
            <div className="hidden lg:flex items-center gap-1.5 bg-emerald-50/80 border border-emerald-200/80 px-3 py-1.5 rounded-xl text-xs">
              <Coins className="w-3.5 h-3.5 text-emerald-600" />
              <span className="font-mono font-semibold text-emerald-950">{user.ecoPointsBalance}</span>
            </div>
          )}

          {/* Notifications */}
          <button
            type="button"
            onClick={onOpenNotifications}
            className="relative p-2 rounded-xl bg-slate-100 hover:bg-slate-200/70 text-slate-700 transition-colors cursor-pointer"
            title="Dispatch Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-emerald-600 text-white text-[9px] font-bold flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Sign In / Demo Credentials Button */}
          <button
            type="button"
            onClick={onOpenAuthGateway}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium transition-colors shadow-xs cursor-pointer"
            title="Switch Account or View Demo Login Credentials"
          >
            <KeyRound className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Sign In / Demo</span>
          </button>

          {/* Subtle Reset */}
          <button
            type="button"
            onClick={() => {
              if (confirm('Reset demo database to initial state?')) {
                db.reset();
              }
            }}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer hidden xl:flex"
            title="Reset Demo State"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>

        </div>

      </div>
    </header>
  );
}
