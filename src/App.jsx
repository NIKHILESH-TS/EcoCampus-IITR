import React, { useState } from 'react';
import Navbar from './components/Navbar';
import StudentPortal from './components/Student/StudentPortal';
import AdminPortal from './components/Admin/AdminPortal';
import LoginModal from './components/Auth/LoginModal';
import NotificationsModal from './components/Common/NotificationsModal';
import { Leaf, ShieldCheck, HeartHandshake, Sparkles, BookOpen, ExternalLink } from 'lucide-react';

export default function App() {
  const [role, setRole] = useState('student'); // 'student' | 'admin'
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  const handleRoleChange = (newRole) => {
    setRole(newRole);
  };

  const handleLoginSuccess = (selectedRole) => {
    setRole(selectedRole);
  };

  return (
    <div className="min-h-screen bg-hallmark-cream flex flex-col selection:bg-hallmark-primary/20 selection:text-hallmark-dark">
      {/* Hallmark Navigation */}
      <Navbar 
        currentRole={role}
        onRoleChange={handleRoleChange}
        onOpenLogin={() => setIsLoginOpen(true)}
        onOpenNotifications={() => setIsNotifOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 pb-16">
        {role === 'student' ? (
          <StudentPortal />
        ) : (
          <AdminPortal />
        )}
      </main>

      {/* Hallmark Inspired Warm Elegant Footer */}
      <footer className="bg-white border-t border-hallmark-border mt-auto font-sans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            
            {/* Column 1: Brand & Theme */}
            <div className="md:col-span-2 space-y-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-hallmark-primary flex items-center justify-center text-white">
                  <Leaf className="w-5 h-5 text-emerald-300" />
                </div>
                <span className="font-display font-bold text-lg text-hallmark-dark">
                  EcoCampus IIT Roorkee
                </span>
              </div>
              <p className="text-xs text-slate-500 max-w-md leading-relaxed">
                Smart and sustainable solid waste management platform engineered for <strong>SOCIOTHON 2026</strong> (NSS IIT Roorkee). 
                Empowered by <strong>Azure Custom Vision AI</strong> object detection, Govind Bhawan 200 smart bins telemetry, and circular economy peer-to-peer re-use marketplace.
              </p>
              <div className="text-[11px] text-emerald-800 font-medium">
                Research Grounding: <em>MDPI Recycling 2019 — "Solid Waste Management on a Campus in a Developing Country: A Study of IIT Roorkee"</em>
              </div>
            </div>

            {/* Column 2: Quick Links */}
            <div className="text-xs space-y-2 text-slate-600">
              <div className="font-bold text-slate-900 font-display text-sm mb-2">Platform Features</div>
              <div>• Govind Bhawan 200 Smart Dustbins</div>
              <div>• Assumed Shifts (07:30 AM / 02:00 PM / 08:30 PM)</div>
              <div>• Spot Waste AI Camera & Auto-Ack</div>
              <div>• Re-Use Marketplace Point Algorithm</div>
              <div>• Administrator Central Telemetry Desk</div>
            </div>

            {/* Column 3: Hackathon Tracks */}
            <div className="text-xs space-y-2 text-slate-600">
              <div className="font-bold text-slate-900 font-display text-sm mb-2">Hackathon Tracks</div>
              <div className="p-2 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-[11px]">
                <strong>🎙️ ElevenLabs Track:</strong> Voice disposal reader provides accessible spoken instructions for student waste classification.
              </div>
              <div className="p-2 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 text-[11px] mt-2">
                <strong>🚀 Render Track:</strong> Deployable service with <code>render.yaml</code>, Docker, and zero-downtime configuration.
              </div>
            </div>

          </div>

          <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-2">
            <span>© 2026 NSS IIT Roorkee • SOCIOTHON 2026 Hackathon Prototype</span>
            <div className="flex items-center gap-4">
              <span>IIT Roorkee Campus • 365 Acres • 5,500 kg/day Zero-Waste Mission</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <LoginModal 
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      <NotificationsModal
        isOpen={isNotifOpen}
        onClose={() => setIsNotifOpen(false)}
      />
    </div>
  );
}
