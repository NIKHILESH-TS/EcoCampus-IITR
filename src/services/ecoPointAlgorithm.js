// Smart Point Assignment Algorithm for Govind Bhawan Re-Use & EcoTrade
// Promotes circular economy and eliminates hostel landfill generation

export const ITEM_CATEGORIES = {
  academic_books: {
    label: 'Textbooks, Notes & Reference Manuals',
    basePoints: 60,
    carbonKg: 6.8,
    wasteSavedKg: 1.8,
    academicBonus: 15,
    icon: 'BookOpen'
  },
  electronics_gadgets: {
    label: 'Hostel Electronics & Peripherals',
    basePoints: 80,
    carbonKg: 18.5,
    wasteSavedKg: 2.2,
    academicBonus: 10,
    icon: 'Laptop'
  },
  appliances: {
    label: 'Kettles, Room Heaters & Fans',
    basePoints: 75,
    carbonKg: 14.2,
    wasteSavedKg: 3.5,
    academicBonus: 5,
    icon: 'Zap'
  },
  room_furniture: {
    label: 'Mattresses, Study Tables & Storage Racks',
    basePoints: 70,
    carbonKg: 12.0,
    wasteSavedKg: 8.0,
    academicBonus: 5,
    icon: 'Armchair'
  },
  drawing_lab_gear: {
    label: 'Engineering Drafters, Lab Coats & Instruments',
    basePoints: 50,
    carbonKg: 8.4,
    wasteSavedKg: 1.5,
    academicBonus: 20, // High priority for junior students
    icon: 'Compass'
  },
  sports_mobility: {
    label: 'Bicycles, Helmets & Sports Equipment',
    basePoints: 85,
    carbonKg: 28.0,
    wasteSavedKg: 12.0,
    academicBonus: 10,
    icon: 'Bike'
  },
  room_essentials: {
    label: 'Curtains, Clothes Racks, Buckets & Organizers',
    basePoints: 35,
    carbonKg: 4.5,
    wasteSavedKg: 2.0,
    academicBonus: 5,
    icon: 'Home'
  }
};

export const CONDITIONS = {
  mint: { label: 'Like New / Mint Condition', multiplier: 1.25, badge: 'text-emerald-700 bg-emerald-50 border-emerald-200' },
  good: { label: 'Good / Lightly Used', multiplier: 1.0, badge: 'text-blue-700 bg-blue-50 border-blue-200' },
  fair: { label: 'Fair / Functional Wear', multiplier: 0.75, badge: 'text-amber-700 bg-amber-50 border-amber-200' },
  salvage: { label: 'Usable with Minor Fix', multiplier: 0.5, badge: 'text-rose-700 bg-rose-50 border-rose-200' }
};

/**
 * Calculates EcoTrade points based on multi-factor sustainability formula
 * @param {string} categoryKey 
 * @param {string} conditionKey 
 * @param {boolean} isFreeGiveaway If true, grants altruism bonus points
 * @returns {Object} Calculated points and mathematical breakdown
 */
export function calculateEcoPoints(categoryKey, conditionKey, isFreeGiveaway = false) {
  const cat = ITEM_CATEGORIES[categoryKey] || ITEM_CATEGORIES.academic_books;
  const cond = CONDITIONS[conditionKey] || CONDITIONS.good;

  const base = cat.basePoints;
  const conditionFactor = cond.multiplier;
  const carbonImpact = cat.carbonKg;
  const academicUtility = cat.academicBonus;
  
  // Mathematical formula: Base * ConditionMultiplier * (1 + CarbonKg / 25) + AcademicBonus + AltruismBonus
  const carbonMultiplier = 1 + (carbonImpact / 30);
  const altruismBonus = isFreeGiveaway ? 15 : 0;

  const rawPoints = (base * conditionFactor * carbonMultiplier) + academicUtility + altruismBonus;
  const finalPoints = Math.round(rawPoints);

  return {
    finalPoints,
    breakdown: {
      basePoints: base,
      conditionMultiplier: conditionFactor,
      carbonOffsetKg: cat.carbonKg,
      carbonFactorValue: Math.round(base * conditionFactor * (carbonImpact / 30)),
      academicBonus: academicUtility,
      altruismBonus: altruismBonus,
      wasteDivertedKg: cat.wasteSavedKg
    },
    formulaString: `[Base (${base}) × Condition (${conditionFactor}) × CarbonFactor (${carbonMultiplier.toFixed(2)})] + UtilityBonus (${academicUtility})${altruismBonus ? ' + AltruismBonus (15)' : ''} = ${finalPoints} EcoPoints`
  };
}
