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
import { Leaf } from 'lucide-react';

export default function App() {
  const [role, setRole] = useState('student'); // 'student' | 'worker' | 'admin' | 'recycler'
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isVoiceAgentOpen, setIsVoiceAgentOpen] = useState(false);
  const [isQrScannerOpen, setIsQrScannerOpen] = useState(false);
  const [isPrintQrOpen, setIsPrintQrOpen] = useState(false);
  const [isVaultOpen, setIsVaultOpen] = useState(false);
  const [isProConnectOpen, setIsProConnectOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800">
      
      {/* Universal 4-Role Navigation Bar */}
      <Navbar 
        currentRole={role}
        onRoleChange={setRole}
        onOpenNotifications={() => setIsNotifOpen(true)}
        onOpenVoiceAgent={() => setIsVoiceAgentOpen(true)}
        onOpenQrScanner={() => setIsQrScannerOpen(true)}
        onOpenPrintQr={() => setIsPrintQrOpen(true)}
        onOpenVault={() => setIsVaultOpen(true)}
        onOpenProConnect={() => setIsProConnectOpen(true)}
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
      <footer className="bg-white border-t border-slate-200 mt-auto text-xs text-slate-500 font-sans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-slate-900 flex items-center justify-center text-white">
              <Leaf className="w-3 h-3 text-emerald-400" />
            </div>
            <span className="font-semibold text-slate-800">EcoCampus IIT Roorkee</span>
            <span>•</span>
            <span>SOCIOTHON 2026 Champion Prototype</span>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400">
            <span>Govind Bhawan (200 Bins)</span>
            <span>•</span>
            <span>MobileNetV3 Edge Inference</span>
            <span>•</span>
            <span>🎙️ ElevenLabs Multilingual V2</span>
            <span>•</span>
            <span>🏛️ Campus Circular Vault</span>
            <span>•</span>
            <span>🚀 Render Production Ready</span>
          </div>
        </div>
      </footer>

      {/* Campus Vault & Treasury Modal (Canteen Vouchers, Worker UPI, Flood Relief) */}
      <CampusVaultModal
        isOpen={isVaultOpen}
        onClose={() => setIsVaultOpen(false)}
      />

      {/* ElevenLabs Pro API Key Connector Modal */}
      <ElevenLabsProModal
        isOpen={isProConnectOpen}
        onClose={() => setIsProConnectOpen(false)}
      />

      {/* Notifications Drawer (One-Way Admin Acknowledgments) */}
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
