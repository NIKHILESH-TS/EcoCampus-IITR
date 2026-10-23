// Pre-seeded Complaints Dataset for SOCIOTHON 2026 Demo

export const INITIAL_COMPLAINTS = [
  {
    id: 'CMP-2026-081',
    type: 'Govind Bhawan Bin',
    binId: 'GB-018',
    location: 'Govind Bhawan, Block A, 1st Floor (Near Staircase 2)',
    category: 'biodegradable',
    reportedBy: 'Aarav Sharma (Room A-114)',
    reportedEmail: 'student@iitr.ac.in',
    timestamp: 'Today, 08:45 AM',
    status: 'Dispatched to Crew',
    issueType: 'Bin overflowing past 90% capacity after morning hours',
    photoUrl: 'https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?auto=format&fit=crop&w=600&q=80',
    aiClassification: {
      tag: 'Food Scrap / Fruit Peels',
      confidence: 96,
      category: 'biodegradable',
      collectionGroup: 'IITR Organic Composting & Bio-Methanation Unit'
    },
    adminAcknowledgment: {
      sentAt: 'Today, 08:46 AM',
      message: '[IITR Administration Auto-Ack] Complaint #CMP-2026-081 received for Bin GB-018. Bio-Methanation Cart #2 assigned for priority emptying before 11:00 AM.',
      adminOfficer: 'Sanitation Cell, Estate Office IITR'
    }
  },
  {
    id: 'CMP-2026-082',
    type: 'Random Geo-Tagged Spot',
    binId: null,
    location: 'LBS Jogging Track & Pavilion (Near 200m mark bench)',
    category: 'recyclable',
    reportedBy: 'Priya Verma (Bio-Tech Dept)',
    reportedEmail: 'priya.v@bt.iitr.ac.in',
    timestamp: 'Today, 09:12 AM',
    status: 'In Progress',
    issueType: 'Accumulation of plastic hydration bottles and sports drink cups on grass verge',
    photoUrl: 'https://images.unsplash.com/photo-1528323273322-d81458248d40?auto=format&fit=crop&w=600&q=80',
    aiClassification: {
      tag: 'Plastic Beverage Bottle / PET',
      confidence: 98,
      category: 'recyclable',
      collectionGroup: 'IITR Authorized Kabariwala & NSS Recyclers Network'
    },
    adminAcknowledgment: {
      sentAt: 'Today, 09:13 AM',
      message: '[IITR Administration Auto-Ack] Photo complaint verified via Azure Cloud AI (PET Bottles detected with 98% confidence). Route patrol tractor trolley redirected to LBS Track.',
      adminOfficer: 'Campus Cleanliness Cell'
    }
  },
  {
    id: 'CMP-2026-083',
    type: 'Govind Bhawan Bin',
    binId: 'GB-104',
    location: 'Govind Bhawan, Mess & Dining Hall (Backyard Wash Area)',
    category: 'e-waste',
    reportedBy: 'Kunal Singhal (Room C-232)',
    reportedEmail: 'kunal.s@me.iitr.ac.in',
    timestamp: 'Today, 10:20 AM',
    status: 'Resolved',
    issueType: 'Someone dumped discarded laptop charger and cables in organic bin',
    photoUrl: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=600&q=80',
    aiClassification: {
      tag: 'Electronic Circuit / Cable / Charger',
      confidence: 94,
      category: 'e-waste',
      collectionGroup: 'IITR Green Campus Precious Metals & E-Waste Recovery Cell'
    },
    adminAcknowledgment: {
      sentAt: 'Today, 10:21 AM',
      message: '[IITR Administration Auto-Ack] E-waste segregation mismatch verified. Safe handling squad retrieved electronics for secondary circuit extraction. Eco-points credit added to student profile.',
      adminOfficer: 'Hostel Supervisor, Govind Bhawan'
    }
  },
  {
    id: 'CMP-2026-084',
    type: 'Random Geo-Tagged Spot',
    binId: null,
    location: 'Central Library Courtyard & Portico',
    category: 'recyclable',
    reportedBy: 'Rohan Mehra (Civil Engg)',
    reportedEmail: 'rohan.m@ce.iitr.ac.in',
    timestamp: 'Today, 11:05 AM',
    status: 'Dispatched to Crew',
    issueType: 'Discarded courier cartons and Xerox spiral bindings after semester project submissions',
    photoUrl: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=600&q=80',
    aiClassification: {
      tag: 'Discarded Notebook / Paper / Carton',
      confidence: 95,
      category: 'recyclable',
      collectionGroup: 'IITR NSS Eco-Paper Drive & Local Recyclers'
    },
    adminAcknowledgment: {
      sentAt: 'Today, 11:06 AM',
      message: '[IITR Administration Auto-Ack] Paper carton batch logged. NSS Eco-Paper truck scheduled for 01:30 PM collection for campus hand-made paper conversion.',
      adminOfficer: 'Estate Office SWM Cell'
    }
  }
];
