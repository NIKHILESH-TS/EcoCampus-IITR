import React, { useState } from 'react';
import { 
  Trophy, 
  Award, 
  TrendingUp, 
  CheckCircle2, 
  Recycle, 
  Flame, 
  Sparkles, 
  ArrowUpRight,
  ShieldCheck
} from 'lucide-react';
import { db } from '../../services/db';

const HOSTEL_RANKINGS = [
  {
    rank: 1,
    name: 'Govind Bhawan (Smart Pilot)',
    score: 94.6,
    trophyHolder: true,
    segregationRate: 89.4,
    wasteDivertedKg: 142,
    resolutionSlaRate: 96.2,
    activeBins: 200,
    residents: 920,
    badge: 'Current Champion 🏆',
    trend: '+4.2%'
  },
  {
    rank: 2,
    name: 'Rajendra Bhawan',
    score: 88.2,
    trophyHolder: false,
    segregationRate: 81.0,
    wasteDivertedKg: 98,
    resolutionSlaRate: 89.5,
    activeBins: 180,
    residents: 850,
    badge: 'Silver Contender',
    trend: '+2.1%'
  },
  {
    rank: 3,
    name: 'Kasturba Bhawan',
    score: 86.5,
    trophyHolder: false,
    segregationRate: 84.5,
    wasteDivertedKg: 76,
    resolutionSlaRate: 85.0,
    activeBins: 160,
    residents: 780,
    badge: 'Top Girls Hostel',
    trend: '+3.5%'
  },
  {
    rank: 4,
    name: 'Ravindra Bhawan',
    score: 79.1,
    trophyHolder: false,
    segregationRate: 72.0,
    wasteDivertedKg: 54,
    resolutionSlaRate: 81.2,
    activeBins: 140,
    residents: 690,
    badge: 'Improving',
    trend: '+1.0%'
  },
  {
    rank: 5,
    name: 'Sarojini Bhawan',
    score: 76.4,
    trophyHolder: false,
    segregationRate: 68.5,
    wasteDivertedKg: 48,
    resolutionSlaRate: 77.8,
    activeBins: 130,
    residents: 640,
    badge: 'Phase 2 Scale',
    trend: '+0.8%'
  }
];

export default function GreenBhawanLeaderboard() {
  const [hostels, setHostels] = useState(HOSTEL_RANKINGS);
  const [pledgeTaken, setPledgeTaken] = useState(false);

  const handleSupportGovind = () => {
    setHostels(prev => prev.map(h => h.rank === 1 ? { ...h, score: +(h.score + 0.2).toFixed(1) } : h));
    setPledgeTaken(true);
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3 mb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] font-bold bg-brand-dark text-white px-2 py-0.5 rounded">
                BEHAVIORAL GAMIFICATION
              </span>
              <h3 className="font-semibold text-slate-900 text-sm">
                Inter-Hostel Cleanliness Leaderboard ("Green Bhawan Trophy")
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Empirical gamification ranking hostels on segregation accuracy, re-use trades, and complaint resolution speed.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-amber-900 bg-amber-100 border border-amber-300 px-3 py-1 rounded-lg flex items-center gap-1.5">
              <Trophy className="w-3.5 h-3.5 text-amber-600" />
              <span>October 2026 Cup: Govind Bhawan</span>
            </span>
          </div>
        </div>

        {/* Champion Trophy Showcase Card */}
        <div className="bg-gradient-to-r from-brand-dark to-emerald-900 text-white rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold shadow-lg flex-shrink-0">
              <Trophy className="w-8 h-8" />
            </div>
            <div>
              <div className="text-[11px] font-mono text-emerald-300 uppercase tracking-wider font-semibold">
                NSS IIT Roorkee • Rolling Monthly Cup
              </div>
              <h4 className="font-bold text-lg text-white mt-0.5">
                Govind Bhawan Leads with 94.6 Points!
              </h4>
              <p className="text-xs text-emerald-100/80 mt-1 max-w-xl leading-relaxed">
                Govind Bhawan residents achieved 89.4% source segregation and diverted 142 kg of usable textbooks and kettles through our circular marketplace this month.
              </p>
            </div>
          </div>

          <div className="text-right flex-shrink-0">
            {pledgeTaken ? (
              <span className="text-xs text-emerald-300 font-semibold bg-white/10 px-3 py-1.5 rounded-lg border border-white/20 inline-block">
                ✓ Pledged for Govind Bhawan (+0.2 pts)
              </span>
            ) : (
              <button
                type="button"
                onClick={handleSupportGovind}
                className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs transition-colors shadow-md"
              >
                Boost Govind Score (+0.2)
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Leaderboard Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden text-xs">
        <div className="p-3 border-b border-slate-100 flex items-center justify-between">
          <span className="font-semibold text-slate-800">
            Current Inter-Hostel Standings (Updated Daily at 08:30 PM Shift)
          </span>
          <span className="text-[11px] text-slate-400">
            Evaluated by NSS IIT Roorkee & Estate Office
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[10px]">
              <tr>
                <th className="p-3 pl-4">Rank</th>
                <th className="p-3">Hostel / Bhawan</th>
                <th className="p-3">Overall Score</th>
                <th className="p-3">Segregation Rate</th>
                <th className="p-3">Re-Use Diverted</th>
                <th className="p-3">SLA Clean Rate</th>
                <th className="p-3 pr-4 text-right">Trend</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {hostels.map(h => (
                <tr key={h.rank} className={`hover:bg-slate-50/70 ${h.rank === 1 ? 'bg-amber-50/20' : ''}`}>
                  <td className="p-3 pl-4 font-mono font-bold">
                    {h.rank === 1 ? (
                      <span className="w-6 h-6 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center text-xs shadow-sm">
                        1
                      </span>
                    ) : (
                      <span className="text-slate-600 font-bold text-xs ml-2">#{h.rank}</span>
                    )}
                  </td>

                  <td className="p-3">
                    <div className="font-semibold text-slate-900">{h.name}</div>
                    <div className="text-[10px] text-slate-400">{h.residents} Residents • {h.activeBins} Bins</div>
                  </td>

                  <td className="p-3">
                    <span className="font-mono font-bold text-sm text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                      {h.score}/100
                    </span>
                  </td>

                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-emerald-600 h-full rounded-full" style={{ width: `${h.segregationRate}%` }} />
                      </div>
                      <span className="font-mono text-slate-700">{h.segregationRate}%</span>
                    </div>
                  </td>

                  <td className="p-3 font-mono font-semibold text-emerald-800">
                    {h.wasteDivertedKg} kg
                  </td>

                  <td className="p-3 font-mono text-slate-700">
                    {h.resolutionSlaRate}%
                  </td>

                  <td className="p-3 pr-4 text-right font-mono font-medium text-emerald-700">
                    {h.trend}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-3 bg-slate-50 border-t border-slate-100 text-slate-500 text-[11px] flex justify-between px-4">
          <span>Winner receives ₹25,000 Special Mess Dinner Grant from Dean of Student Welfare</span>
          <span className="text-emerald-800 font-medium">Next Evaluation: October 31, 2026</span>
        </div>
      </div>

    </div>
  );
}
