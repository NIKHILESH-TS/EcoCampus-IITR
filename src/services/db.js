// Normalized Relational Data Engine & Persistence Store
// Context: SOCIOTHON 2026 - IIT Roorkee Smart Solid Waste Management

const STORAGE_KEY = 'ecocampus_iitr_db_v2';

export const SHIFT_TIMINGS = [
  { id: 'shift_1', label: 'Morning Shift', time: '07:30 AM', focus: 'Hostel Rooms, Mess Prep & Lawns Sweep' },
  { id: 'shift_2', label: 'Afternoon Shift', time: '02:00 PM', focus: 'Post-Lunch Mess & Corridor Recyclables' },
  { id: 'shift_3', label: 'Evening Shift', time: '08:30 PM', focus: 'Post-Dinner Mess & Common Area Clearance' },
];

export const WASTE_TYPES = {
  biodegradable: {
    label: 'Bio-Degradable',
    streamName: 'Organic / Wet Waste',
    colorHex: '#15803d',
    badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    binColor: 'Green Bin',
    assignedSquad: 'IITR Organic Composting & Bio-Methanation Unit'
  },
  recyclable: {
    label: 'Recyclable',
    streamName: 'Dry Recyclables (Paper, PET, Cans)',
    colorHex: '#2563eb',
    badgeClass: 'bg-blue-50 text-blue-800 border-blue-200',
    binColor: 'Blue Bin',
    assignedSquad: 'IITR Authorized Kabariwala & NSS Recyclers'
  },
  non_recyclable: {
    label: 'Non-Recyclable',
    streamName: 'Inert / Multilayer Packaging',
    colorHex: '#475569',
    badgeClass: 'bg-slate-100 text-slate-800 border-slate-200',
    binColor: 'Grey Bin',
    assignedSquad: 'Roorkee Municipal MSW Landfill & RDF Unit'
  },
  e_waste: {
    label: 'E-Waste',
    streamName: 'Electronic Scrap & Circuits',
    colorHex: '#d97706',
    badgeClass: 'bg-amber-50 text-amber-900 border-amber-200',
    binColor: 'Orange Bin',
    assignedSquad: 'IITR Precious Metals & E-Waste Recovery Cell'
  },
  hazardous: {
    label: 'Hazardous',
    streamName: 'Chemical Reagents & Broken Glass',
    colorHex: '#dc2626',
    badgeClass: 'bg-rose-50 text-rose-800 border-rose-200',
    binColor: 'Red Bin',
    assignedSquad: 'IITR Bio-Medical & Chemical Safety Disposal'
  }
};

export const ITEM_CATEGORIES = {
  academic_books: { label: 'Textbooks & Academic Notes', basePoints: 60, academicBonus: 15 },
  appliances: { label: 'Hostel Appliances & Kettles', basePoints: 75, academicBonus: 5 },
  lab_gear: { label: 'Engineering Drafters & Lab Coats', basePoints: 50, academicBonus: 20 },
  cycles: { label: 'Campus Bicycles & Locks', basePoints: 85, academicBonus: 10 },
  furniture: { label: 'Study Tables, Mattresses & Racks', basePoints: 70, academicBonus: 5 }
};

export const CONDITIONS = {
  mint: { label: 'Mint / Like New', multiplier: 1.25 },
  good: { label: 'Good / Lightly Used', multiplier: 1.0 },
  fair: { label: 'Fair / Functional', multiplier: 0.75 }
};

// Initial Seed Generators
function createInitialUsers() {
  return [
    {
      id: 'USR-001',
      name: 'Nikhil S.',
      email: 'student@iitr.ac.in',
      role: 'student',
      room: 'Room B-112',
      hostel: 'Govind Bhawan',
      department: 'Computer Science & Engineering',
      ecoPointsBalance: 240,
      createdAt: '2026-10-01T08:00:00Z'
    },
    {
      id: 'USR-002',
      name: 'Campus Estate Sanitation Officer',
      email: 'admin.sanitation@iitr.ac.in',
      role: 'admin',
      room: 'Estate Office, Room 104',
      hostel: 'Main Building Complex',
      department: 'IIT Roorkee Administration',
      ecoPointsBalance: 0,
      createdAt: '2026-10-01T08:00:00Z'
    }
  ];
}

function create200GovindBhawanBins() {
  const blocks = [
    { name: 'Block A', floors: ['Ground Floor', '1st Floor', '2nd Floor', '3rd Floor'], count: 44 },
    { name: 'Block B', floors: ['Ground Floor', '1st Floor', '2nd Floor', '3rd Floor'], count: 44 },
    { name: 'Block C', floors: ['Ground Floor', '1st Floor', '2nd Floor', '3rd Floor'], count: 44 },
    { name: 'Block D', floors: ['Ground Floor', '1st Floor', '2nd Floor', '3rd Floor'], count: 40 },
    { name: 'Mess & Dining Hall', floors: ['Kitchen Entry', 'Dining Hall', 'Backyard Wash Area'], count: 16 },
    { name: 'Central Quadrangle', floors: ['Open Court', 'Cycle Stand', 'Common Room Corridor'], count: 12 },
  ];

  const types = ['biodegradable', 'recyclable', 'non_recyclable', 'e_waste', 'hazardous'];
  const bins = [];
  let id = 1;

  blocks.forEach(block => {
    for (let i = 0; i < block.count; i++) {
      const floor = block.floors[i % block.floors.length];
      const category = types[i % types.length];
      const fillVariation = (id * 37) % 100;
      
      let status = 'Cleaned';
      if (fillVariation > 85) status = 'Overflowing';
      else if (fillVariation > 65) status = 'Needs Attention';
      else if (fillVariation > 35) status = 'Moderate';

      const nextShift = (id % 3 === 0) ? '02:00 PM' : ((id % 3 === 1) ? '08:30 PM' : '07:30 AM');
      const lastCleaned = (id % 2 === 0) ? 'Today, 07:30 AM' : 'Yesterday, 08:30 PM';

      bins.push({
        id: `GB-${String(id).padStart(3, '0')}`,
        block: block.name,
        floor: floor,
        locationDetail: `${block.name}, ${floor} (Wing ${(id % 4) + 1})`,
        category: category,
        fillLevel: fillVariation,
        status: status,
        lastCleanedAt: lastCleaned,
        nextShiftTime: nextShift,
        assignedGroup: WASTE_TYPES[category].assignedSquad,
        uncleanedReportsCount: status === 'Overflowing' ? 2 : (status === 'Needs Attention' ? 1 : 0)
      });
      id++;
      if (id > 200) break;
    }
  });

  return bins;
}

function createInitialComplaints() {
  return [
    {
      id: 'CMP-2026-001',
      userId: 'USR-001',
      reporterName: 'Nikhil S. (Room B-112)',
      binId: 'GB-018',
      locationText: 'Govind Bhawan, Block A, 1st Floor (Wing 2)',
      category: 'biodegradable',
      issueType: 'Missed Cleaning: Not emptied as per 07:30 AM schedule',
      details: 'Food scrap bin is over 90% full after morning breakfast hours. Attracting flies.',
      photoUrl: 'https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?auto=format&fit=crop&w=500&q=80',
      status: 'in_progress',
      createdAt: 'Today, 08:45 AM',
      resolvedAt: null
    },
    {
      id: 'CMP-2026-002',
      userId: 'USR-001',
      reporterName: 'Nikhil S. (Room B-112)',
      binId: null,
      locationText: 'LBS Jogging Track & Pavilion (Near 200m bench)',
      category: 'recyclable',
      issueType: 'Overflowing / Scattered Waste on Ground',
      details: 'Plastic hydration bottles and energy drink cans scattered on track verge after morning sports practice.',
      photoUrl: 'https://images.unsplash.com/photo-1528323273322-d81458248d40?auto=format&fit=crop&w=500&q=80',
      status: 'pending',
      createdAt: 'Today, 09:15 AM',
      resolvedAt: null
    },
    {
      id: 'CMP-2026-003',
      userId: 'USR-001',
      reporterName: 'Aditya M. (Room A-302)',
      binId: 'GB-104',
      locationText: 'Govind Bhawan, Mess & Dining Hall (Backyard Wash Area)',
      category: 'e_waste',
      issueType: 'Segregation Error / Non-compliant items dumped',
      details: 'Discarded laptop charger and burned battery found inside wet food waste bin.',
      photoUrl: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=500&q=80',
      status: 'resolved',
      createdAt: 'Yesterday, 04:30 PM',
      resolvedAt: 'Yesterday, 05:45 PM'
    }
  ];
}

function createInitialDispatches() {
  return [
    {
      id: 'DISP-001',
      complaintId: 'CMP-2026-001',
      messageText: '[Estate Office Auto-Ack] Complaint received for Bin #GB-018. Bio-Methanation Squad Cart #2 dispatched for expedited collection.',
      squadAssigned: 'IITR Organic Composting & Bio-Methanation Unit',
      sentAt: 'Today, 08:46 AM',
      isOneWay: true
    },
    {
      id: 'DISP-002',
      complaintId: 'CMP-2026-002',
      messageText: '[Estate Office Auto-Ack] LBS Track spot report logged. Dry recyclables pickup scheduled on tractor patrol route #3.',
      squadAssigned: 'IITR Authorized Kabariwala & NSS Recyclers',
      sentAt: 'Today, 09:16 AM',
      isOneWay: true
    },
    {
      id: 'DISP-003',
      complaintId: 'CMP-2026-003',
      messageText: '[Estate Office Resolution] E-waste recovered safely and sent to secondary recovery cell. Wet bin sanitized.',
      squadAssigned: 'IITR Precious Metals & E-Waste Recovery Cell',
      sentAt: 'Yesterday, 05:45 PM',
      isOneWay: true
    }
  ];
}

function createInitialMarketplace() {
  return [
    {
      id: 'GB-TRADE-001',
      sellerId: 'USR-001',
      sellerName: 'Vikram J.',
      sellerRoom: 'Govind Bhawan, Room B-218',
      sellerEmail: 'vikram.j@me.iitr.ac.in',
      title: 'Advanced Engineering Mathematics (10th Ed - Kreyszig)',
      category: 'academic_books',
      condition: 'good',
      ecoPointsPrice: 75,
      description: 'Used for 1st Year Maths at IITR. Clean condition, no missing pages.',
      photoUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=500&q=80',
      isFree: false,
      status: 'available',
      createdAt: 'Today, 10:00 AM'
    },
    {
      id: 'GB-TRADE-002',
      sellerId: 'USR-001',
      sellerName: 'Aditya M.',
      sellerRoom: 'Govind Bhawan, Room A-302',
      sellerEmail: 'aditya.m@ece.iitr.ac.in',
      title: 'Pigeon 1.5L Stainless Steel Electric Kettle',
      category: 'appliances',
      condition: 'mint',
      ecoPointsPrice: 95,
      description: 'Fully working electric kettle. Great for midterm late-night tea.',
      photoUrl: 'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?auto=format&fit=crop&w=500&q=80',
      isFree: false,
      status: 'available',
      createdAt: 'Yesterday, 02:15 PM'
    },
    {
      id: 'GB-TRADE-003',
      sellerId: 'USR-001',
      sellerName: 'Sneha P.',
      sellerRoom: 'Govind Bhawan, Room C-108',
      sellerEmail: 'sneha.p@ce.iitr.ac.in',
      title: 'Omega Mini Drafter & Board Clip Kit',
      category: 'lab_gear',
      condition: 'mint',
      ecoPointsPrice: 80,
      description: 'Essential for 1st Year Engineering Drawing course. Includes padded case.',
      photoUrl: 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&w=500&q=80',
      isFree: true,
      status: 'available',
      createdAt: '2 days ago'
    },
    {
      id: 'GB-TRADE-004',
      sellerId: 'USR-001',
      sellerName: 'Tanmay S.',
      sellerRoom: 'Govind Bhawan, Room D-104',
      sellerEmail: 'tanmay.s@cs.iitr.ac.in',
      title: 'Hero Sprint Single-Speed Campus Bicycle',
      category: 'cycles',
      condition: 'fair',
      ecoPointsPrice: 120,
      description: 'Sturdy cycle with basket and lock. Great for commute between Govind and LHC.',
      photoUrl: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=500&q=80',
      isFree: false,
      status: 'available',
      createdAt: '3 days ago'
    }
  ];
}

function createInitialClaims() {
  return [];
}

function createInitialLedger() {
  return [
    {
      id: 'LEDGER-001',
      userId: 'USR-001',
      amount: 200,
      eventType: 'initial_grant',
      referenceId: 'WELCOME-IITR',
      timestamp: '2026-10-01T08:00:00Z'
    },
    {
      id: 'LEDGER-002',
      userId: 'USR-001',
      amount: 15,
      eventType: 'complaint_bonus',
      referenceId: 'CMP-2026-001',
      timestamp: 'Today, 08:45 AM'
    },
    {
      id: 'LEDGER-003',
      userId: 'USR-001',
      amount: 25,
      eventType: 'spot_report_bonus',
      referenceId: 'CMP-2026-002',
      timestamp: 'Today, 09:15 AM'
    }
  ];
}

// Relational DB Store Class
class EcoCampusDB {
  constructor() {
    this.data = this.load();
  }

  load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) {
      console.warn('DB load failed, reinitializing defaults', e);
    }
    return this.initDefaults();
  }

  initDefaults() {
    const initial = {
      users: createInitialUsers(),
      bins: create200GovindBhawanBins(),
      complaints: createInitialComplaints(),
      adminDispatches: createInitialDispatches(),
      marketplaceItems: createInitialMarketplace(),
      marketplaceClaims: createInitialClaims(),
      ecoPointsLedger: createInitialLedger(),
      currentUserId: 'USR-001'
    };
    this.save(initial);
    return initial;
  }

  save(data = this.data) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      window.dispatchEvent(new Event('ecocampus_db_change'));
    } catch (e) {
      console.error('Failed to save to localStorage', e);
    }
  }

  reset() {
    localStorage.removeItem(STORAGE_KEY);
    this.data = this.initDefaults();
    return this.data;
  }

  // User Methods
  getCurrentUser() {
    return this.data.users.find(u => u.id === this.data.currentUserId) || this.data.users[0];
  }

  setCurrentUser(userId) {
    this.data.currentUserId = userId;
    this.save();
  }

  getUserById(id) {
    return this.data.users.find(u => u.id === id);
  }

  // Bins Methods
  getBins(filterBlock = 'All', filterCategory = 'All', filterStatus = 'All', search = '') {
    return this.data.bins.filter(bin => {
      const matchBlock = filterBlock === 'All' || bin.block === filterBlock;
      const matchCat = filterCategory === 'All' || bin.category === filterCategory;
      const matchStatus = filterStatus === 'All' || bin.status === filterStatus;
      const matchSearch = search === '' || 
        bin.id.toLowerCase().includes(search.toLowerCase()) ||
        bin.locationDetail.toLowerCase().includes(search.toLowerCase());
      return matchBlock && matchCat && matchStatus && matchSearch;
    });
  }

  getBinById(id) {
    return this.data.bins.find(b => b.id === id);
  }

  updateBin(id, updates) {
    const idx = this.data.bins.findIndex(b => b.id === id);
    if (idx !== -1) {
      this.data.bins[idx] = { ...this.data.bins[idx], ...updates };
      this.save();
      return this.data.bins[idx];
    }
    return null;
  }

  cleanBin(id) {
    return this.updateBin(id, {
      fillLevel: 5,
      status: 'Cleaned',
      lastCleanedAt: 'Just now',
      uncleanedReportsCount: 0
    });
  }

  // Complaint Methods
  getComplaints(filterType = 'All', filterStatus = 'All') {
    return this.data.complaints.filter(c => {
      const matchType = filterType === 'All' || (filterType === 'bin' ? !!c.binId : !c.binId);
      const matchStatus = filterStatus === 'All' || c.status === filterStatus;
      return matchType && matchStatus;
    });
  }

  getComplaintById(id) {
    return this.data.complaints.find(c => c.id === id);
  }

  createComplaint({ binId, locationText, category, issueType, details, photoUrl }) {
    const user = this.getCurrentUser();
    const newId = `CMP-2026-${String(this.data.complaints.length + 1).padStart(3, '0')}`;
    const targetCategory = category || (binId ? this.getBinById(binId)?.category : 'recyclable') || 'recyclable';
    const assignedSquad = WASTE_TYPES[targetCategory]?.assignedSquad || 'IITR Sanitation Fleet';

    const complaint = {
      id: newId,
      userId: user.id,
      reporterName: `${user.name} (${user.room})`,
      binId: binId || null,
      locationText: locationText || (binId ? this.getBinById(binId)?.locationDetail : 'Campus Location'),
      category: targetCategory,
      issueType: issueType || 'Cleanliness issue reported',
      details: details || '',
      photoUrl: photoUrl || 'https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?auto=format&fit=crop&w=500&q=80',
      status: 'pending',
      createdAt: 'Just now',
      resolvedAt: null
    };

    this.data.complaints.unshift(complaint);

    // If attached to a bin, increment uncleaned counter and update status
    if (binId) {
      const bin = this.getBinById(binId);
      if (bin) {
        this.updateBin(binId, {
          uncleanedReportsCount: (bin.uncleanedReportsCount || 0) + 1,
          status: bin.fillLevel > 70 ? 'Overflowing' : 'Needs Attention'
        });
      }
    }

    // Auto-create one-way administrative acknowledgment
    const autoDispatchMsg = binId 
      ? `[Estate Office Auto-Ack] Complaint #${newId} logged for Bin #${binId}. Assigned to ${assignedSquad}. Next scheduled clearance prioritized.`
      : `[Estate Office Auto-Ack] Spot waste report #${newId} received for ${complaint.locationText}. Sanitation cart routed.`;

    const dispatch = {
      id: `DISP-${String(this.data.adminDispatches.length + 1).padStart(3, '0')}`,
      complaintId: newId,
      messageText: autoDispatchMsg,
      squadAssigned: assignedSquad,
      sentAt: 'Just now',
      isOneWay: true
    };
    this.data.adminDispatches.unshift(dispatch);

    // Credit EcoPoints bonus (+15 pts) & record in ledger
    const bonus = 15;
    user.ecoPointsBalance += bonus;
    this.data.ecoPointsLedger.unshift({
      id: `LEDGER-${String(this.data.ecoPointsLedger.length + 1).padStart(3, '0')}`,
      userId: user.id,
      amount: bonus,
      eventType: 'complaint_bonus',
      referenceId: newId,
      timestamp: 'Just now'
    });

    this.save();
    return { complaint, dispatch, bonusAwarded: bonus };
  }

  updateComplaintStatus(id, newStatus, customDispatchMessage = null) {
    const complaint = this.getComplaintById(id);
    if (!complaint) return null;

    complaint.status = newStatus;
    if (newStatus === 'resolved') {
      complaint.resolvedAt = 'Just now';
      if (complaint.binId) {
        this.cleanBin(complaint.binId);
      }
    }

    if (customDispatchMessage) {
      const dispatch = {
        id: `DISP-${String(this.data.adminDispatches.length + 1).padStart(3, '0')}`,
        complaintId: id,
        messageText: customDispatchMessage,
        squadAssigned: WASTE_TYPES[complaint.category]?.assignedSquad || 'IITR Sanitation Fleet',
        sentAt: 'Just now',
        isOneWay: true
      };
      this.data.adminDispatches.unshift(dispatch);
    }

    this.save();
    return complaint;
  }

  getDispatchesForComplaint(complaintId) {
    return this.data.adminDispatches.filter(d => d.complaintId === complaintId);
  }

  getAllDispatches() {
    return this.data.adminDispatches;
  }

  // Marketplace Methods & Algorithmic Points Calculation
  calculateItemPoints(categoryKey, conditionKey, isFree = false) {
    const cat = ITEM_CATEGORIES[categoryKey] || ITEM_CATEGORIES.academic_books;
    const cond = CONDITIONS[conditionKey] || CONDITIONS.good;
    const raw = Math.round((cat.basePoints * cond.multiplier) + cat.academicBonus + (isFree ? 15 : 0));
    return raw;
  }

  getMarketplaceItems(filterCategory = 'All', filterStatus = 'All', search = '') {
    return this.data.marketplaceItems.filter(item => {
      const matchCat = filterCategory === 'All' || item.category === filterCategory;
      const matchStatus = filterStatus === 'All' || item.status === filterStatus;
      const matchSearch = search === '' ||
        item.title.toLowerCase().includes(search.toLowerCase()) ||
        item.description.toLowerCase().includes(search.toLowerCase()) ||
        item.sellerRoom.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchStatus && matchSearch;
    });
  }

  createMarketplaceItem({ title, description, category, condition, photoUrl, isFree }) {
    const user = this.getCurrentUser();
    const newId = `GB-TRADE-${String(this.data.marketplaceItems.length + 1).padStart(3, '0')}`;
    const pointsValue = this.calculateItemPoints(category, condition, isFree);

    const item = {
      id: newId,
      sellerId: user.id,
      sellerName: user.name,
      sellerRoom: `${user.hostel}, ${user.room}`,
      sellerEmail: user.email,
      title: title.trim(),
      description: description.trim() || 'Item available for Govind Bhawan residents.',
      category: category,
      condition: condition,
      ecoPointsPrice: pointsValue,
      photoUrl: photoUrl || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=500&q=80',
      isFree: !!isFree,
      status: 'available',
      createdAt: 'Just now'
    };

    this.data.marketplaceItems.unshift(item);

    // Award bonus points to the student for contributing to circular reuse
    const reward = isFree ? 25 : 15;
    user.ecoPointsBalance += reward;
    this.data.ecoPointsLedger.unshift({
      id: `LEDGER-${String(this.data.ecoPointsLedger.length + 1).padStart(3, '0')}`,
      userId: user.id,
      amount: reward,
      eventType: 'listing_bonus',
      referenceId: newId,
      timestamp: 'Just now'
    });

    this.save();
    return { item, rewardAwarded: reward };
  }

  claimMarketplaceItem(itemId) {
    const item = this.data.marketplaceItems.find(i => i.id === itemId);
    if (!item) return { success: false, error: 'Item not found' };
    if (item.status !== 'available') return { success: false, error: 'Item has already been claimed' };

    const buyer = this.getCurrentUser();
    if (!item.isFree && buyer.ecoPointsBalance < item.ecoPointsPrice) {
      return { 
        success: false, 
        error: `Insufficient EcoPoints. You need ${item.ecoPointsPrice} points, but have ${buyer.ecoPointsBalance}.` 
      };
    }

    // Execute atomic claim transaction
    item.status = 'claimed';
    item.claimedBy = `${buyer.name} (${buyer.room})`;

    if (!item.isFree) {
      buyer.ecoPointsBalance -= item.ecoPointsPrice;
      this.data.ecoPointsLedger.unshift({
        id: `LEDGER-${String(this.data.ecoPointsLedger.length + 1).padStart(3, '0')}`,
        userId: buyer.id,
        amount: -item.ecoPointsPrice,
        eventType: 'item_claimed',
        referenceId: item.id,
        timestamp: 'Just now'
      });
    }

    const claim = {
      id: `CLAIM-${String(this.data.marketplaceClaims.length + 1).padStart(3, '0')}`,
      itemId: item.id,
      buyerId: buyer.id,
      buyerName: buyer.name,
      buyerRoom: `${buyer.hostel}, ${buyer.room}`,
      pointsPaid: item.isFree ? 0 : item.ecoPointsPrice,
      claimedAt: 'Just now'
    };
    this.data.marketplaceClaims.unshift(claim);

    this.save();
    return { success: true, item, claim };
  }

  getLedgerForUser(userId = this.getCurrentUser().id) {
    return this.data.ecoPointsLedger.filter(l => l.userId === userId);
  }
}

export const db = new EcoCampusDB();
