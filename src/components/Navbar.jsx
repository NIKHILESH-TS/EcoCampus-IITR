import React, { useState, useEffect } from 'react';
import { 
  Leaf, 
  Bell, 
  Shield, 
  User, 
  Mic, 
  QrCode,
  Truck,
  Landmark,
  Building2,
  ChevronDown
} from 'lucide-react';
import { db } from '../services/db';

const ROLE_META = {
  student: { label: 'Student', icon: User },
  worker: { label: 'Field Crew', icon: Truck },
  admin: { label: 'Admin', icon: Shield },
  recycler: { label: 'Recycler', icon: Building2 }
};

export default function Navbar({ 
  currentRole, 
  onRoleChange, 
  onOpenNotifications, 
  onOpenVoiceAgent,
  onOpenQrScanner,
  onOpenVault,
  onOpenAuthGateway
}) {
  const [vault, setVault] = useState(db.getVault());
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const handleUpdate = () => {
      setVault(db.getVault());
      setUnreadCount(db.getAllDispatches().length);
    };

    handleUpdate();
    window.addEventListener('ecocampus_db_change', handleUpdate);
    return () => window.removeEventListener('ecocampus_db_change', handleUpdate);
  }, []);

  const handleRoleSelect = (newRole) => {
    onRoleChange(newRole);
    if (newRole === 'student') db.setCurrentUser('USR-001');
    else if (newRole === 'admin') db.setCurrentUser('USR-002');
    else if (newRole === 'worker') db.setCurrentUser('USR-003');
    else if (newRole === 'recycler') db.setCurrentUser('USR-004');
  };

  const activeMeta = ROLE_META[currentRole] || ROLE_META.student;
  const ActiveRoleIcon = activeMeta.icon;

  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-xl border-b border-slate-200/70 font-sans">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-2">
        
        {/* Left: Clean Brand Mark */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-slate-900 flex items-center justify-center text-white shadow-2xs">
            <Leaf className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-semibold text-slate-900 text-sm sm:text-base tracking-tight">
              EcoCampus
            </span>
            <span className="text-xs text-slate-400 hidden sm:inline font-normal">
              IIT Roorkee
            </span>
          </div>
        </div>

        {/* Center (Desktop Only): Segmented Role Pill */}
        <div className="hidden md:flex items-center bg-slate-100/80 p-1 rounded-xl border border-slate-200/50">
          {Object.entries(ROLE_META).map(([id, meta]) => {
            const Icon = meta.icon;
            const active = currentRole === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => handleRoleSelect(id)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                  active
                    ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${active ? 'text-emerald-600' : 'text-slate-400'}`} />
                <span>{meta.label}</span>
              </button>
            );
          })}
        </div>

        {/* Right: Minimalist Action Controls (Mobile-Safe) */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          
          {/* Vault Balance Pill (Desktop/Tablet) */}
          <button
            type="button"
            onClick={onOpenVault}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100/80 hover:bg-slate-200/70 text-slate-700 text-xs font-medium transition-colors cursor-pointer"
            title="Campus Circular Vault"
          >
            <Landmark className="w-3.5 h-3.5 text-emerald-600" />
            <span className="font-mono font-semibold text-slate-900">
              ₹{(vault.totalCashInr / 1000).toFixed(0)}k
            </span>
          </button>

          {/* QR Scanner Icon Button */}
          <button
            type="button"
            onClick={onOpenQrScanner}
            className="w-9 h-9 rounded-xl bg-slate-100/80 hover:bg-slate-200/70 text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
            title="Scan Bin QR Code"
          >
            <QrCode className="w-4 h-4" />
          </button>

          {/* Voice Assistant Icon Button */}
          <button
            type="button"
            onClick={onOpenVoiceAgent}
            className="w-9 h-9 rounded-xl bg-slate-100/80 hover:bg-slate-200/70 text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
            title="Voice AI Assistant"
          >
            <Mic className="w-4 h-4 text-emerald-600" />
          </button>

          {/* Notifications Icon Button */}
          <button
            type="button"
            onClick={onOpenNotifications}
            className="relative w-9 h-9 rounded-xl bg-slate-100/80 hover:bg-slate-200/70 text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-600 ring-2 ring-white" />
            )}
          </button>

          {/* Unified Persona / Sign-In Pill (Works on both Mobile & Desktop) */}
          <button
            type="button"
            onClick={onOpenAuthGateway}
            className="flex items-center gap-1.5 pl-2.5 pr-2 sm:px-3 py-1.5 h-9 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium transition-colors cursor-pointer"
            title="Switch Account or Demo Persona"
          >
            <ActiveRoleIcon className="w-3.5 h-3.5 text-emerald-400" />
            <span className="font-medium">{activeMeta.label}</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

        </div>

      </div>
    </header>
  );
}
