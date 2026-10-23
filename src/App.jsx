import React, { useState } from 'react';
import Navbar from './components/Navbar';
import StudentPortal from './components/Student/StudentPortal';
import AdminPortal from './components/Admin/AdminPortal';
import NotificationsModal from './components/Common/NotificationsModal';
import { Leaf } from 'lucide-react';

export default function App() {
  const [role, setRole] = useState('student'); // 'student' | 'admin'
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800">
      
      {/* Clean Navbar */}
      <Navbar 
        currentRole={role}
        onRoleChange={setRole}
        onOpenNotifications={() => setIsNotifOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 pb-12">
        {role === 'student' ? (
          <StudentPortal />
        ) : (
          <AdminPortal />
        )}
      </main>

      {/* Minimalist Clean Footer */}
      <footer className="bg-white border-t border-slate-200 mt-auto text-xs text-slate-500 font-sans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-brand-dark flex items-center justify-center text-white">
              <Leaf className="w-3 h-3 text-emerald-400" />
            </div>
            <span className="font-semibold text-slate-800">EcoCampus IIT Roorkee</span>
            <span>•</span>
            <span>SOCIOTHON 2026 Prototype</span>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-slate-400">
            <span>Govind Bhawan Pilot (200 Bins)</span>
            <span>•</span>
            <span>Shifts: 07:30 AM / 02:00 PM / 08:30 PM</span>
            <span>•</span>
            <span>Zero-Waste Circular Exchange</span>
          </div>
        </div>
      </footer>

      {/* One-Way Notifications Log Modal */}
      <NotificationsModal
        isOpen={isNotifOpen}
        onClose={() => setIsNotifOpen(false)}
      />

    </div>
  );
}
