import React, { useState } from 'react';
import Navbar from './components/Navbar';
import StudentPortal from './components/Student/StudentPortal';
import AdminPortal from './components/Admin/AdminPortal';
import FieldCrewPortal from './components/Crew/FieldCrewPortal';
import RecyclerBiddingPortal from './components/Recycler/RecyclerBiddingPortal';
import CampusVaultModal from './components/Vault/CampusVaultModal';
import ElevenLabsProModal from './components/AI/ElevenLabsProModal';
import NotificationsModal from './components/Common/NotificationsModal';
import EcoVoiceAgentModal from './components/AI/EcoVoiceAgentModal';
import BinQRScannerModal from './components/QR/BinQRScannerModal';
import PrintableQRSheetsModal from './components/QR/PrintableQRSheetsModal';
import AuthGatewayModal from './components/Auth/AuthGatewayModal';
import { Leaf, KeyRound } from 'lucide-react';

export default function App() {
  const [role, setRole] = useState('student'); // 'student' | 'worker' | 'admin' | 'recycler'
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isVoiceAgentOpen, setIsVoiceAgentOpen] = useState(false);
  const [isQrScannerOpen, setIsQrScannerOpen] = useState(false);
  const [isPrintQrOpen, setIsPrintQrOpen] = useState(false);
  const [isVaultOpen, setIsVaultOpen] = useState(false);
  const [isProConnectOpen, setIsProConnectOpen] = useState(false);
  const [isAuthGatewayOpen, setIsAuthGatewayOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans text-slate-900 antialiased">
      
      {/* Unified Apple/Google-Style Translucent Header */}
      <Navbar 
        currentRole={role}
        onRoleChange={setRole}
        onOpenNotifications={() => setIsNotifOpen(true)}
        onOpenVoiceAgent={() => setIsVoiceAgentOpen(true)}
        onOpenQrScanner={() => setIsQrScannerOpen(true)}
        onOpenPrintQr={() => setIsPrintQrOpen(true)}
        onOpenVault={() => setIsVaultOpen(true)}
        onOpenProConnect={() => setIsProConnectOpen(true)}
        onOpenAuthGateway={() => setIsAuthGatewayOpen(true)}
      />

      {/* Main Role-Specific View */}
      <main className="flex-1 pb-12">
        {role === 'student' && (
          <StudentPortal 
            onOpenQrScanner={() => setIsQrScannerOpen(true)}
            onOpenVoiceAgent={() => setIsVoiceAgentOpen(true)}
          />
        )}
        {role === 'worker' && <FieldCrewPortal />}
        {role === 'admin' && (
          <AdminPortal onOpenPrintQr={() => setIsPrintQrOpen(true)} />
        )}
        {role === 'recycler' && <RecyclerBiddingPortal />}
      </main>

      {/* Clean Minimalist Footer */}
      <footer className="bg-white border-t border-slate-200/80 mt-auto text-xs text-slate-500 font-sans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-5 h-5 rounded-md bg-slate-900 flex items-center justify-center text-white">
              <Leaf className="w-3 h-3 text-emerald-400" />
            </div>
            <span className="font-semibold text-slate-900">EcoCampus IIT Roorkee</span>
            <span className="text-slate-300">•</span>
            <span>Circular Solid Waste Operating System</span>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-400">
            <button
              type="button"
              onClick={() => setIsAuthGatewayOpen(true)}
              className="text-slate-600 hover:text-slate-900 font-medium flex items-center gap-1 cursor-pointer"
            >
              <KeyRound className="w-3 h-3" />
              <span>Demo Credentials (4 Personas)</span>
            </button>
            <span>•</span>
            <button
              type="button"
              onClick={() => setIsProConnectOpen(true)}
              className="text-slate-500 hover:text-slate-800 cursor-pointer"
            >
              ElevenLabs Voice Config
            </button>
            <span>•</span>
            <button
              type="button"
              onClick={() => setIsVaultOpen(true)}
              className="text-slate-500 hover:text-slate-800 cursor-pointer"
            >
              Campus Circular Vault
            </button>
          </div>
        </div>
      </footer>

      {/* Sign-In / Sign-Up & 4-Persona Demo Credentials Modal */}
      <AuthGatewayModal
        isOpen={isAuthGatewayOpen}
        onClose={() => setIsAuthGatewayOpen(false)}
        currentRole={role}
        onSelectRole={setRole}
      />

      {/* Campus Vault & Treasury Modal */}
      <CampusVaultModal
        isOpen={isVaultOpen}
        onClose={() => setIsVaultOpen(false)}
      />

      {/* ElevenLabs Pro API Key Connector Modal */}
      <ElevenLabsProModal
        isOpen={isProConnectOpen}
        onClose={() => setIsProConnectOpen(false)}
      />

      {/* Notifications Drawer */}
      <NotificationsModal
        isOpen={isNotifOpen}
        onClose={() => setIsNotifOpen(false)}
      />

      {/* ElevenLabs Bilingual Voice Assistant Modal */}
      <EcoVoiceAgentModal
        isOpen={isVoiceAgentOpen}
        onClose={() => setIsVoiceAgentOpen(false)}
      />

      {/* Mobile Bin QR Camera Scanner Modal */}
      <BinQRScannerModal
        isOpen={isQrScannerOpen}
        onClose={() => setIsQrScannerOpen(false)}
      />

      {/* Printable QR Sticker Sheets Modal (for 200 Bins) */}
      <PrintableQRSheetsModal
        isOpen={isPrintQrOpen}
        onClose={() => setIsPrintQrOpen(false)}
      />

    </div>
  );
}
