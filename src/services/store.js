import { generate200GovindBhawanBins } from '../data/govindBhawanBins';
import { INITIAL_COMPLAINTS } from '../data/defaultComplaints';
import { INITIAL_MARKET_LISTINGS } from '../data/marketListings';

const BINS_KEY = 'iitr_govind_bhawan_bins_v2';
const COMPLAINTS_KEY = 'iitr_complaints_v2';
const MARKET_KEY = 'iitr_market_listings_v2';
const USER_KEY = 'iitr_active_student_user_v2';
const ADMIN_STATS_KEY = 'iitr_admin_live_stats_v2';

const DEFAULT_USER = {
  name: 'Nikhil S.',
  rollNo: '23114092',
  email: 'student@iitr.ac.in',
  role: 'student',
  hostel: 'Govind Bhawan',
  room: 'Room B-112',
  department: 'Computer Science & Engineering',
  ecoPoints: 240,
  wasteDivertedKg: 14.8,
  complaintsFiled: 3,
  itemsGivenAway: 2
};

export const store = {
  getBins() {
    const raw = localStorage.getItem(BINS_KEY);
    if (!raw) {
      const initial = generate200GovindBhawanBins();
      localStorage.setItem(BINS_KEY, JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(raw);
  },

  updateBin(id, updates) {
    const bins = this.getBins();
    const index = bins.findIndex(b => b.id === id);
    if (index !== -1) {
      bins[index] = { ...bins[index], ...updates };
      localStorage.setItem(BINS_KEY, JSON.stringify(bins));
      window.dispatchEvent(new Event('iitr_store_update'));
      return bins[index];
    }
    return null;
  },

  cleanBin(id) {
    return this.updateBin(id, {
      fillLevel: 5,
      status: 'Cleaned',
      lastCleaned: 'Just now',
      uncleanedComplaints: 0
    });
  },

  getComplaints() {
    const raw = localStorage.getItem(COMPLAINTS_KEY);
    if (!raw) {
      localStorage.setItem(COMPLAINTS_KEY, JSON.stringify(INITIAL_COMPLAINTS));
      return INITIAL_COMPLAINTS;
    }
    return JSON.parse(raw);
  },

  addComplaint(complaint) {
    const complaints = this.getComplaints();
    const newComplaint = {
      ...complaint,
      id: `CMP-2026-${String(complaints.length + 85).padStart(3, '0')}`,
      timestamp: 'Just now'
    };

    // If it is a Govind Bhawan bin complaint, update the bin's uncleanedComplaints counter
    if (newComplaint.binId) {
      const bins = this.getBins();
      const bin = bins.find(b => b.id === newComplaint.binId);
      if (bin) {
        this.updateBin(bin.id, {
          uncleanedComplaints: (bin.uncleanedComplaints || 0) + 1,
          status: bin.fillLevel > 70 ? 'Overflowing' : 'Needs Attention'
        });
      }
    }

    complaints.unshift(newComplaint);
    localStorage.setItem(COMPLAINTS_KEY, JSON.stringify(complaints));

    // Award eco reporting incentive points to student
    this.awardEcoPoints(15, `Reporting waste issue ${newComplaint.id}`);

    window.dispatchEvent(new Event('iitr_store_update'));
    return newComplaint;
  },

  updateComplaintStatus(id, status, customMessage = null) {
    const complaints = this.getComplaints();
    const index = complaints.findIndex(c => c.id === id);
    if (index !== -1) {
      complaints[index].status = status;
      if (customMessage) {
        complaints[index].adminAcknowledgment = {
          sentAt: 'Just now',
          message: customMessage,
          adminOfficer: 'Campus Chief Sanitation Officer'
        };
      }
      localStorage.setItem(COMPLAINTS_KEY, JSON.stringify(complaints));
      window.dispatchEvent(new Event('iitr_store_update'));
      return complaints[index];
    }
    return null;
  },

  getListings() {
    const raw = localStorage.getItem(MARKET_KEY);
    if (!raw) {
      localStorage.setItem(MARKET_KEY, JSON.stringify(INITIAL_MARKET_LISTINGS));
      return INITIAL_MARKET_LISTINGS;
    }
    return JSON.parse(raw);
  },

  addListing(item) {
    const listings = this.getListings();
    const newListing = {
      ...item,
      id: `GB-TRADE-${String(listings.length + 7).padStart(3, '0')}`,
      listedAt: 'Just now',
      status: 'Available'
    };
    listings.unshift(newListing);
    localStorage.setItem(MARKET_KEY, JSON.stringify(listings));

    // Give bonus points for listing an item to re-use
    this.awardEcoPoints(newListing.ecoPoints, `Listing item for reuse: ${newListing.title}`);

    window.dispatchEvent(new Event('iitr_store_update'));
    return newListing;
  },

  claimListing(listingId) {
    const listings = this.getListings();
    const item = listings.find(l => l.id === listingId);
    if (!item) return { success: false, error: 'Item not found' };

    const user = this.getUser();
    if (user.ecoPoints < item.ecoPoints && !item.isFreeGiveaway) {
      return { success: false, error: `Insufficient EcoPoints. You need ${item.ecoPoints} pts, but have ${user.ecoPoints} pts.` };
    }

    // Deduct points if not free
    if (!item.isFreeGiveaway) {
      user.ecoPoints -= item.ecoPoints;
    }
    user.wasteDivertedKg = +(user.wasteDivertedKg + (item.wasteSavedKg || 2.0)).toFixed(1);
    localStorage.setItem(USER_KEY, JSON.stringify(user));

    item.status = 'Claimed';
    item.claimedBy = `${user.name} (${user.room})`;
    localStorage.setItem(MARKET_KEY, JSON.stringify(listings));

    window.dispatchEvent(new Event('iitr_store_update'));
    return { success: true, item };
  },

  getUser() {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : DEFAULT_USER;
  },

  updateUser(updates) {
    const user = { ...this.getUser(), ...updates };
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    window.dispatchEvent(new Event('iitr_store_update'));
    return user;
  },

  awardEcoPoints(pts, reason) {
    const user = this.getUser();
    user.ecoPoints += pts;
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    return user;
  },

  resetDefaults() {
    localStorage.removeItem(BINS_KEY);
    localStorage.removeItem(COMPLAINTS_KEY);
    localStorage.removeItem(MARKET_KEY);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(ADMIN_STATS_KEY);
    window.dispatchEvent(new Event('iitr_store_update'));
  }
};
