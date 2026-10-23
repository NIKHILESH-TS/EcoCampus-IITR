import React from 'react';
import { WASTE_TYPES } from '../../services/db';

export function WasteBadge({ category }) {
  const item = WASTE_TYPES[category] || {
    label: category,
    badgeClass: 'bg-slate-100 text-slate-700 border-slate-200',
    colorHex: '#64748b'
  };

  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-medium border ${item.badgeClass}`}>
      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: item.colorHex }} />
      <span>{item.label}</span>
    </span>
  );
}

export function FillStatusBadge({ status, fillLevel }) {
  let style = 'bg-emerald-50 text-emerald-800 border-emerald-200';
  if (status === 'Overflowing' || fillLevel > 80) {
    style = 'bg-rose-50 text-rose-700 border-rose-200 font-semibold';
  } else if (status === 'Needs Attention' || fillLevel > 60) {
    style = 'bg-amber-50 text-amber-800 border-amber-200';
  } else if (status === 'Moderate') {
    style = 'bg-blue-50 text-blue-800 border-blue-200';
  }

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium border ${style}`}>
      <span>{status}</span>
      <span className="font-mono text-[10px] opacity-80">({fillLevel}%)</span>
    </span>
  );
}

export function ComplaintBadge({ status }) {
  switch (status) {
    case 'resolved':
      return <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-50 text-emerald-800 border border-emerald-200">✓ Resolved</span>;
    case 'in_progress':
      return <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-amber-50 text-amber-800 border border-amber-200">● In Progress</span>;
    default:
      return <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-700 border border-slate-200">⏱ Pending</span>;
  }
}
