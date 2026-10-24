import React, { useState } from 'react';
import { 
  Recycle, 
  Leaf, 
  Flame, 
  FileText, 
  Cpu, 
  ExternalLink, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles,
  PhoneCall
} from 'lucide-react';
import { IITR_CAMPUS_BENCHMARKS } from '../../data/iitrCampusData';

const RECOVERY_FACILITIES = [
  {
    id: 'fac-1',
    stream: 'Mess & Food Waste',
    dailyVolumeKg: 1676,
    icon: 'Leaf',
    destination: 'On-Campus Anaerobic Bio-Digester & Composting Yard',
    technology: 'Anaerobic bio-methanation with continuous stirred tank reactor',
    products: '120 kg/day Methane Fuel (replaces LPG in hostel kitchens) + 180 kg/day organic fertilizer',
    partner: 'IITR Organic Farm & Sanitation Division',
    status: 'Operational (70% capacity)',
    contact: 'sanitation.bio@iitr.ac.in • +91 1332 284100'
  },
  {
    id: 'fac-2',
    stream: 'Dry Garden Leaves & Foliage',
    dailyVolumeKg: 569,
    icon: 'Flame',
    destination: 'Campus Biomass Briquetting Facility',
    technology: 'High-density mechanical compression without chemical binders',
    products: 'Smokeless high-calorific fuel pellets for mess water heaters (replaces seasonal open burning)',
    partner: 'IITR Horticulture & Estate Office',
    status: 'Operational (Winter Peak Active)',
    contact: 'horticulture@iitr.ac.in • +91 1332 284200'
  },
  {
    id: 'fac-3',
    stream: 'Paper, Cardboard & Parcels',
    dailyVolumeKg: 1580,
    icon: 'FileText',
    destination: 'NSS Eco-Paper & Shreyans Paper Processing Unit',
    technology: 'Hydro-pulping, fiber de-inking, and manual sheet rolling',
    products: 'Handmade certificate sheets, campus conference folders, official exam dispatch envelopes',
    partner: 'National Service Scheme (NSS) IIT Roorkee',
    status: 'Active Bi-Weekly Pickup',
    contact: 'nss@iitr.ac.in • APJ Complex'
  },
  {
    id: 'fac-4',
    stream: 'Plastic Bottles & Scrap Metal',
    dailyVolumeKg: 788,
    icon: 'Recycle',
    destination: 'Authorized Local Scrap Network (Kabariwalas)',
    technology: 'Optical density sorting, shredding, and secondary melting/pelleting',
    products: 'Recycled composite paver blocks, campus footpath tiles, park benches',
    partner: 'Registered Roorkee Informal Waste Collectors Union',
    status: 'Twice-Weekly Scheduled Beat',
    contact: 'estate.recycling@iitr.ac.in'
  },
  {
    id: 'fac-5',
    stream: 'E-Waste, Chargers & Circuits',
    dailyVolumeKg: 45,
    icon: 'Cpu',
    destination: 'CPCB Certified E-Waste Recovery Dismantler',
    technology: 'Safe PCB de-soldering, heavy metal extraction, and acid-free precious metal recovery',
    products: 'Recovered copper, tin, gold traces, and inert polycarbonate casings',
    partner: 'Attero Recycling / State Pollution Control Board Registered',
    status: 'Monthly Safe Extraction Drive',
    contact: 'ewaste.cell@iitr.ac.in'
  }
];

export default function CircularResourceDirectory() {
  const [selectedFacility, setSelectedFacility] = useState(RECOVERY_FACILITIES[0]);
  const [requestSubmitted, setRequestSubmitted] = useState(false);

  return (
    <div className="space-y-6 font-sans">
      
      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3 mb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] font-bold bg-brand-dark text-white px-2 py-0.5 rounded">
                PROBLEM DOMAIN 3
              </span>
              <h3 className="font-semibold text-slate-900 text-sm">
                Recycling & Waste-to-Resource Circular Platform
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Tracks the recovery pathways transforming campus waste streams into valuable energy, handmade paper, and compost.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg text-xs">
              <span className="text-emerald-800">Target Diversion:</span>
              <strong className="ml-1 text-emerald-950 font-mono">73.4% Landfill Averted</strong>
            </div>
          </div>
        </div>

        {/* 5 Pathways Summary Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-2.5">
          {RECOVERY_FACILITIES.map(fac => (
            <button
              key={fac.id}
              type="button"
              onClick={() => setSelectedFacility(fac)}
              className={`p-3 rounded-lg border text-left text-xs transition-all ${
                selectedFacility.id === fac.id
                  ? 'border-emerald-600 bg-emerald-50/70 shadow-sm ring-1 ring-emerald-500/30'
                  : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100'
              }`}
            >
              <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                {fac.stream.split('&')[0]}
              </div>
              <div className="font-bold text-slate-900 text-sm mt-0.5 font-mono">
                {fac.dailyVolumeKg} kg/day
              </div>
              <div className="text-[10px] text-emerald-800 font-medium truncate mt-1">
                {fac.destination.split('(')[0]}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Selected Facility Deep Dive */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
        <div className="flex items-start justify-between border-b border-slate-100 pb-3">
          <div>
            <span className="text-[10px] font-mono font-semibold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
              Circular Recovery Unit
            </span>
            <h4 className="font-semibold text-slate-900 text-base mt-1">
              {selectedFacility.destination}
            </h4>
            <div className="text-xs text-slate-500 mt-0.5">
              Processing: <strong>{selectedFacility.dailyVolumeKg} kg/day</strong> of {selectedFacility.stream}
            </div>
          </div>

          <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg">
            ✓ {selectedFacility.status}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
            <span className="text-slate-500 font-medium block text-[10px]">Processing Technology:</span>
            <p className="text-slate-800 font-medium leading-relaxed">{selectedFacility.technology}</p>
          </div>

          <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 space-y-1">
            <span className="text-emerald-800 font-semibold block text-[10px]">Recovered Resource Outputs:</span>
            <p className="text-emerald-950 font-medium leading-relaxed">{selectedFacility.products}</p>
          </div>

          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
            <span className="text-slate-500 font-medium block text-[10px]">Operating Partner & Contact:</span>
            <div className="text-slate-800 font-medium">{selectedFacility.partner}</div>
            <div className="text-slate-500 font-mono text-[11px] pt-1">{selectedFacility.contact}</div>
          </div>
        </div>

        {/* Schedule a Bulk Pickup Action */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
          <div className="text-xs text-slate-600">
            Have bulk recyclables or mess trimmings from a department or hostel event?
          </div>

          {requestSubmitted ? (
            <span className="text-xs font-medium text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
              ✓ Pickup Request Logged with {selectedFacility.partner.split('&')[0]}
            </span>
          ) : (
            <button
              type="button"
              onClick={() => setRequestSubmitted(true)}
              className="px-3.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs flex items-center gap-1.5 transition-colors"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Request Direct Campus Collector Beat</span>
            </button>
          )}
        </div>
      </div>

    </div>
  );
}
