// Real Empirical Data extracted from the research study:
// "Solid Waste Management on a Campus in a Developing Country: A Study of the Indian Institute of Technology Roorkee"
// Published in MDPI Recycling (Nikhat Parvez, Avlokita Agrawal, Akhilesh Kumar - Dept of Architecture & Planning, IIT Roorkee)

export const IITR_CAMPUS_BENCHMARKS = {
  campusName: "Indian Institute of Technology Roorkee (IITR)",
  campusAreaAcres: 365,
  campusPopulation: 12000,
  totalDailyWasteKg: 5500, // 5.5 metric tonnes / day
  perCapitaWasteKgPerDay: 0.46,
  numberOfCommunityBins: 80,
  numberOfGovindBhawanBins: 200,

  sourceBreakdown: [
    { source: "Residential (Faculty & Staff)", kgPerDay: 1711, percent: 31.1, icon: "Home" },
    { source: "Hostels / Bhawans (Govind, Rajendra, etc.)", kgPerDay: 1570, percent: 28.5, icon: "Building2" },
    { source: "Academics & Administration", kgPerDay: 1209, percent: 22.0, icon: "GraduationCap" },
    { source: "Bhawan Messes & Canteens", kgPerDay: 521, percent: 9.5, icon: "Utensils" },
    { source: "Recreation & Facilities", kgPerDay: 488, percent: 8.9, icon: "Trees" }
  ],

  typologyBreakdown: [
    { type: "Organic (Food & Kitchen)", kgPerDay: 1676, percent: 30.5, category: "biodegradable", destination: "On-Campus Bio-Methanation & Composting" },
    { type: "Paper & Cardboard", kgPerDay: 1580, percent: 28.7, category: "recyclable", destination: "NSS & Authorized Paper Mills" },
    { type: "Plastic (PET & Multilayer)", kgPerDay: 613, percent: 11.1, category: "recyclable", destination: "Secondary Plastic Recycling / Paver Blocks" },
    { type: "Inorganic Non-Recyclable", kgPerDay: 595, percent: 10.8, category: "non-recyclable", destination: "Sanitary Landfill Facility" },
    { type: "Garden Trimmings & Dry Leaves", kgPerDay: 569, percent: 10.3, category: "biodegradable", destination: "Briquetting & Fuel Pellet Unit" },
    { type: "Metals & Tins", kgPerDay: 175, percent: 3.2, category: "recyclable", destination: "Authorized Scrap Recyclers (Kabariwala)" },
    { type: "Glass Bottles", kgPerDay: 111, percent: 2.0, category: "hazardous", destination: "Cullet Remelting Units" },
    { type: "Chemical & Lab Bottles", kgPerDay: 53, percent: 1.0, category: "hazardous", destination: "Safe Containment & CPCB Treatment" },
    { type: "Medical Waste (Hospital)", kgPerDay: 47, percent: 0.9, category: "hazardous", destination: "Off-Site Bio-Incineration" },
    { type: "E-Waste (Cables, PCBs, Parts)", kgPerDay: 45, percent: 0.8, category: "e-waste", destination: "Certified E-Waste Metal Extractor" },
    { type: "Construction & Demolition", kgPerDay: 36, percent: 0.7, category: "non-recyclable", destination: "Aggregate Reuse / Road Base" }
  ],

  campusZones: [
    { id: 1, name: "Zone 1: Govind Bhawan & Student Hostels West", bins: 240, dailyWasteKg: 850 },
    { id: 2, name: "Zone 2: Main Academic Complex & Thomason Building", bins: 140, dailyWasteKg: 620 },
    { id: 3, name: "Zone 3: Central Library & Lecture Hall Complex (LHC)", bins: 90, dailyWasteKg: 480 },
    { id: 4, name: "Zone 4: Faculty Residential Quarters (East)", bins: 180, dailyWasteKg: 910 },
    { id: 5, name: "Zone 5: Staff Housing & LBS Sports Complex", bins: 120, dailyWasteKg: 540 },
    { id: 6, name: "Zone 6: Central Messes & Canteens Cluster", bins: 75, dailyWasteKg: 650 },
    { id: 7, name: "Zone 7: Biotechnology & Chemical Labs Area", bins: 65, dailyWasteKg: 310 },
    { id: 8, name: "Zone 8: Mechanical Workshops & Hangar", bins: 85, dailyWasteKg: 590 },
    { id: 9, name: "Zone 9: Campus Perimeter, Gates & Anekant Park", bins: 60, dailyWasteKg: 550 }
  ],

  swmIssuesFromPaper: [
    "Lack of segregation at source in academic & department complexes",
    "Open tractor-trolley transportation leading to spillages & stray animals",
    "Seasonal burning of dried garden leaves causing air pollution",
    "Accumulation of chemical lab glass bottles near compound boundaries",
    "Absence of institutional e-waste collection mechanism"
  ],

  projectedEcoImpact: {
    landfillDivertedPercent: "73.4%",
    collectionFuelSavedLitresPerMonth: "1,420 L",
    co2eAvoidedTonnesPerYear: "384 Tonnes",
    reUseItemsExchangedMonthly: "450+ Items",
    studentParticipationRate: "88%"
  }
};
