import React from 'react';
import { WASTE_CATEGORIES } from '../../data/govindBhawanBins';

export function WasteCategoryBadge({ category }) {
  const cat = WASTE_CATEGORIES[category] || {
    name: category,
    badgeColor: 'bg-slate-100 text-slate-800 border-slate-300'
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${cat.badgeColor}`}>
      <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${cat.color || 'bg-slate-500'}`} />
      {cat.name}
    </span>
  );
}

export function BinStatusBadge({ status, fillLevel }) {
  let style = 'bg-emerald-50 text-emerald-800 border-emerald-300';
  let dotColor = 'bg-emerald-500';

  if (status === 'Overflowing' || fillLevel > 85) {
    style = 'bg-rose-50 text-rose-800 border-rose-300 font-semibold animate-pulse';
    dotColor = 'bg-rose-500';
  } else if (status === 'Needs Attention' || fillLevel > 65) {
    style = 'bg-amber-50 text-amber-800 border-amber-300';
    dotColor = 'bg-amber-500';
  } else if (status === 'Moderate') {
    style = 'bg-blue-50 text-blue-800 border-blue-300';
    dotColor = 'bg-blue-500';
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs border ${style}`}>
      <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${dotColor}`} />
      {status} ({fillLevel}%)
    </span>
  );
}

export function ComplaintStatusBadge({ status }) {
  switch (status) {
    case 'Resolved':
      return <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 border border-emerald-200">✓ Resolved</span>;
    case 'In Progress':
      return <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 border border-amber-200">⚡ In Progress</span>;
    case 'Dispatched to Crew':
      return <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">🚚 Dispatched</span>;
    default:
      return <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800 border border-slate-200">⏱ Logged</span>;
  }
}
