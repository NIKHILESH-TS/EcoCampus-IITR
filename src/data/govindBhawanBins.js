// Govind Bhawan 200 Dustbins Dataset & Model
// Context: SOCIOTHON 2026 - IIT Roorkee Smart Waste Management

export const CLEANING_SHIFTS = [
  { shift: 'Morning Shift', time: '07:30 AM', focus: 'Hostel Rooms, Mess Prep & Lawn Clearance' },
  { shift: 'Afternoon Shift', time: '02:00 PM', focus: 'Post-Lunch Mess, Corridor Bins & Recyclables' },
  { shift: 'Evening Shift', time: '08:30 PM', focus: 'Post-Dinner Mess, Reading Rooms & Quadrangle' },
];

export const WASTE_CATEGORIES = {
  'biodegradable': {
    name: 'Bio-Degradable / Organic',
    color: 'bg-emerald-700',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    iconColor: 'text-emerald-700',
    hex: '#15803d',
    collectionGroup: 'IITR Organic Composting & Bio-Methanation Unit',
    disposalGuide: 'Food scraps, fruit peels, leftover bread, tea leaves, compostable napkins. Sent directly to on-campus organic compost pits.',
  },
  'recyclable': {
    name: 'Recyclable (Dry)',
    color: 'bg-blue-600',
    badgeColor: 'bg-blue-100 text-blue-800 border-blue-300',
    iconColor: 'text-blue-600',
    hex: '#2563eb',
    collectionGroup: 'IITR Authorized Kabariwala & NSS Recyclers Network',
    disposalGuide: 'Clean paper, plastic pet bottles, soda cans, cardboard parcels, notebooks. Sorted for secondary mechanical recycling.',
  },
  'non-recyclable': {
    name: 'Non-Recyclable / Inert',
    color: 'bg-slate-700',
    badgeColor: 'bg-slate-100 text-slate-800 border-slate-300',
    iconColor: 'text-slate-700',
    hex: '#475569',
    collectionGroup: 'Roorkee Municipal Solid Waste (MSW) Landfill Cell',
    disposalGuide: 'Multi-layer packaging (chips packets), composite wrappers, sweepings, soiled tissue. Directed to engineered disposal facility.',
  },
  'e-waste': {
    name: 'E-Waste / Tech Scrap',
    color: 'bg-amber-600',
    badgeColor: 'bg-amber-100 text-amber-900 border-amber-300',
    iconColor: 'text-amber-600',
    hex: '#d97706',
    collectionGroup: 'IITR Green Campus Precious Metals & E-Waste Recovery Cell',
    disposalGuide: 'Faulty earbuds, discarded chargers, USB cords, PCB boards, calculators, mouse. Managed under E-Waste Rules 2016.',
  },
  'hazardous': {
    name: 'Hazardous / Chemical / Glass',
    color: 'bg-rose-600',
    badgeColor: 'bg-rose-100 text-rose-800 border-rose-300',
    iconColor: 'text-rose-600',
    hex: '#dc2626',
    collectionGroup: 'IITR Bio-Medical & Chemical Safety Cell (Treated Incineration)',
    disposalGuide: 'Broken glass, lab glassware, batteries, chemical bottles, expired meds, aerosol cans.',
  }
};

const BLOCKS = [
  { name: 'Block A', floors: ['Ground Floor', '1st Floor', '2nd Floor', '3rd Floor'], count: 44 },
  { name: 'Block B', floors: ['Ground Floor', '1st Floor', '2nd Floor', '3rd Floor'], count: 44 },
  { name: 'Block C', floors: ['Ground Floor', '1st Floor', '2nd Floor', '3rd Floor'], count: 44 },
  { name: 'Block D', floors: ['Ground Floor', '1st Floor', '2nd Floor', '3rd Floor'], count: 40 },
  { name: 'Mess & Dining Hall', floors: ['Kitchen Entry', 'Main Dining Hall', 'Backyard Wash Area'], count: 16 },
  { name: 'Central Quadrangle & Lawns', floors: ['Open Court', 'Bicycle Stand Area', 'Common Room Corridor'], count: 12 },
];

export function generate200GovindBhawanBins() {
  const bins = [];
  const categories = ['biodegradable', 'recyclable', 'non-recyclable', 'e-waste', 'hazardous'];
  let currentId = 1;

  BLOCKS.forEach(block => {
    for (let i = 0; i < block.count; i++) {
      const floor = block.floors[i % block.floors.length];
      const category = categories[i % categories.length];
      
      // Deterministic variation for realistic dashboard feel
      const fillVariation = (currentId * 37) % 100;
      let status = 'Cleaned';
      if (fillVariation > 88) status = 'Overflowing';
      else if (fillVariation > 70) status = 'Needs Attention';
      else if (fillVariation > 35) status = 'Moderate';

      const uncleanedComplaints = status === 'Overflowing' ? Math.floor((currentId % 4) + 1) : (status === 'Needs Attention' ? 1 : 0);

      // Determine next scheduled cleaning based on current time
      const nextShift = (currentId % 3 === 0) ? 'Today 02:00 PM' : ((currentId % 3 === 1) ? 'Today 08:30 PM' : 'Tomorrow 07:30 AM');
      const lastCleanedTime = (currentId % 2 === 0) ? 'Today 07:30 AM' : 'Yesterday 08:45 PM';

      bins.push({
        id: `GB-${String(currentId).padStart(3, '0')}`,
        block: block.name,
        floor: floor,
        locationDetail: `${block.name}, ${floor} (Near Staircase/Wing ${(currentId % 4) + 1})`,
        category: category,
        fillLevel: fillVariation,
        status: status,
        lastCleaned: lastCleanedTime,
        nextScheduledCleaning: nextShift,
        dispatchTeam: WASTE_CATEGORIES[category].collectionGroup,
        uncleanedComplaints: uncleanedComplaints,
        isSmartSensorConnected: true,
        batteryPercent: 80 + (currentId % 20),
        capacityLiters: 120
      });

      currentId++;
      if (currentId > 200) break;
    }
  });

  return bins;
}
