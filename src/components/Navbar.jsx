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
  Printer,
  Landmark,
  Building2,
  SlidersHorizontal,
  HeartHandshake
} from 'lucide-react';
import { db } from '../services/db';
import { getElevenLabsConfig } from '../services/elevenlabs';

export default function Navbar({ 
  currentRole, 
  onRoleChange, 
  onOpenNotifications, 
  onOpenVoiceAgent,
  onOpenQrScanner,
  onOpenPrintQr,
  onOpenVault,
  onOpenProConnect
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
      setIsProActive(elevenConfig.apiKey && elevenConfig.apiKey.trim().length > 10);
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
    // Switch currentUser in DB if switching roles
    if (newRole === 'student') db.setCurrentUser('USR-001');
    else if (newRole === 'admin') db.setCurrentUser('USR-002');
    else if (newRole === 'worker') db.setCurrentUser('USR-003');
    else if (newRole === 'recycler') db.setCurrentUser('USR-004');
  };

  const getRoleSubtitle = () => {
    switch (currentRole) {
      case 'student': return 'Student Portal • Govind Bhawan (200 Bins)';
      case 'worker': return 'Field Crew • Squad #2 (Ramesh Kumar)';
      case 'admin': return 'Campus Estate Office & SWM Master Command';
      case 'recycler': return 'B2B Recycler Hub • ITC Paperboards / Nepra';
      default: return 'Smart Solid Waste Management';
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200 font-sans shadow-xs">
      {/* Top Thin Hackathon Bar */}
      <div className="bg-slate-900 text-slate-300 text-[11px] px-4 py-1.5 flex items-center justify-between">
        <div className="flex items-center gap-2 max-w-7xl mx-auto w-full">
          <span className="bg-emerald-500/20 text-emerald-400 px-1.5 py-0.2 rounded font-mono font-medium text-[10px]">
            SOCIOTHON 2026
          </span>
          <span className="text-slate-300">IIT Roorkee Smart Waste Operating System</span>
          <span className="text-slate-500 hidden sm:inline">•</span>
          <span className="text-slate-400 hidden sm:inline">4-Persona Circular Economy</span>

          <div className="ml-auto flex items-center gap-3">
            <button
              onClick={onOpenVault}
              className="text-emerald-400 hover:text-emerald-300 font-mono text-[10px] flex items-center gap-1 font-bold transition-colors"
            >
              <Landmark className="w-3 h-3 text-emerald-400" />
              <span>Campus Vault: ₹{vault.totalCashInr.toLocaleString()}</span>
            </button>

            <span className="text-slate-600 hidden md:inline">|</span>

            <button
              onClick={onOpenProConnect}
              className="text-amber-400 hover:text-amber-300 font-mono text-[10px] hidden md:flex items-center gap-1 transition-colors"
            >
              <Mic className="w-3 h-3 text-amber-400" />
              <span>{isProActive ? '🎙️ ElevenLabs Pro Connected' : '🎙️ Connect ElevenLabs Pro'}</span>
            </button>

            <button
              onClick={() => {
                if (confirm('Reset database to clean initial state?')) {
                  db.reset();
                }
              }}
              className="text-slate-400 hover:text-slate-200 flex items-center gap-1 text-[10px] transition-colors ml-2"
              title="Reset all complaints and items"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between gap-3">
        
        {/* Brand */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center text-white shadow-xs">
            <Leaf className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <div className="font-semibold text-slate-900 text-sm tracking-tight flex items-center gap-1.5">
              <span>EcoCampus IITR</span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-100 text-slate-700 border border-slate-200">
                v2.5
              </span>
            </div>
            <div className="text-[11px] text-slate-500">
              {getRoleSubtitle()}
            </div>
          </div>
        </div>

        {/* 4-Way Role Switcher */}
        <div className="bg-slate-100 p-0.5 rounded-xl hidden md:flex items-center border border-slate-200 text-xs shadow-inner">
          <button
            type="button"
            onClick={() => handleRoleSelect('student')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
              currentRole === 'student'
                ? 'bg-white text-slate-900 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <User className="w-3.5 h-3.5 text-emerald-600" />
            <span>Student</span>
          </button>

          <button
            type="button"
            onClick={() => handleRoleSelect('worker')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
              currentRole === 'worker'
                ? 'bg-amber-500 text-slate-950 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Truck className="w-3.5 h-3.5 text-slate-800" />
            <span>Worker</span>
          </button>

          <button
            type="button"
            onClick={() => handleRoleSelect('admin')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
              currentRole === 'admin'
                ? 'bg-slate-900 text-white shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Shield className="w-3.5 h-3.5 text-amber-300" />
            <span>Admin</span>
          </button>

          <button
            type="button"
            onClick={() => handleRoleSelect('recycler')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
              currentRole === 'recycler'
                ? 'bg-blue-600 text-white shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Building2 className="w-3.5 h-3.5 text-blue-200" />
            <span>Recycler</span>
          </button>
        </div>

        {/* Right Action Tools */}
        <div className="flex items-center gap-2">
          
          {/* Mobile Role Switcher (select dropdown) */}
          <div className="md:hidden">
            <select
              value={currentRole}
              onChange={(e) => handleRoleSelect(e.target.value)}
              className="p-1.5 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-800"
            >
              <option value="student">🎓 Student</option>
              <option value="worker">🧹 Worker</option>
              <option value="admin">🏛️ Admin</option>
              <option value="recycler">🏭 Recycler</option>
            </select>
          </div>

          {/* Campus Vault Button */}
          <button
            type="button"
            onClick={onOpenVault}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-950 text-xs font-medium transition-colors shadow-xs"
            title="Open Campus Circular Vault & Food Voucher Hub"
          >
            <Landmark className="w-3.5 h-3.5 text-emerald-700" />
            <span className="hidden sm:inline">Vault:</span>
            <span className="font-mono font-bold text-emerald-900">₹{(vault.totalCashInr / 1000).toFixed(0)}k</span>
          </button>

          {/* Scan Bin QR Button */}
          <button
            type="button"
            onClick={onOpenQrScanner}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-800 text-xs font-medium transition-colors"
            title="Scan Physical Bin QR Sticker"
          >
            <QrCode className="w-3.5 h-3.5 text-slate-700" />
            <span className="hidden sm:inline">Scan QR</span>
          </button>

          {/* Admin: Print Stickers Button */}
          {currentRole === 'admin' && (
            <button
              type="button"
              onClick={onOpenPrintQr}
              className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-800 text-xs font-medium transition-colors"
              title="Print QR Sticker Sheets for Govind Bhawan"
            >
              <Printer className="w-3.5 h-3.5 text-slate-700" />
              <span>Stickers</span>
            </button>
          )}

          {/* ElevenLabs Voice Assistant Pill */}
          <button
            type="button"
            onClick={onOpenVoiceAgent}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-900 text-xs font-medium transition-all shadow-xs"
            title="Open ElevenLabs Multilingual Voice AI"
          >
            <Mic className="w-3.5 h-3.5 text-amber-700" />
            <span className="hidden sm:inline">EcoVoice</span>
          </button>

          {/* Student EcoPoints Balance (shown when role === 'student') */}
          {currentRole === 'student' && (
            <div 
              onClick={onOpenVault}
              className="cursor-pointer hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-900 text-xs"
              title="Click to exchange EcoTokens for canteen vouchers or cash"
            >
              <Coins className="w-3.5 h-3.5 text-emerald-700" />
              <span className="font-bold font-mono">{user.ecoPointsBalance}</span>
              <span className="text-[10px] text-emerald-700">Pts</span>
            </div>
          )}

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
