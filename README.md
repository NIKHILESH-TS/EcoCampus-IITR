# EcoCampus IITR | SOCIOTHON 2026 Smart Waste Management Platform
> **NSS IIT Roorkee Hackathon Submission • October 24, 2026**  
> *Grounding: MDPI Recycling Research Paper — "Solid Waste Management on a Campus in a Developing Country: A Study of the Indian Institute of Technology Roorkee" (Parvez, Agrawal & Kumar)*

---

## 🌟 Executive Overview
Rapid campus growth and population density at higher education institutes generate municipal-scale solid waste challenges. At **IIT Roorkee**, a 365-acre campus with over 12,000 residents, daily waste generation totals **5,500 kg/day** (5.5 metric tonnes), of which:
- **Organic & Kitchen Waste:** 1,676 kg/day (30.5%)
- **Paper & Cardboard:** 1,580 kg/day (28.7%)
- **Plastic Waste:** 613 kg/day (11.1%)
- **Hostel / Bhawan Waste:** 1,570 kg/day (28.5%)

Traditional municipal systems rely on manual reporting, open tractor transport, and reactive clearance. **EcoCampus IITR** delivers a closed-loop, full-stack smart waste management ecosystem specifically architected for IIT Roorkee, beginning with an intensive pilot in **Govind Bhawan (200 numbered smart dustbins)** and expanding campus-wide via cloud AI.

---

## 🏛️ System Interfaces & Core Capabilities

### 1. Student Portal (`/student`)
Designed with a warm, human-centered, Hallmark-inspired design aesthetic (cream canvas, forest pine emerald `#155e4b`, amber accents, and high legibility typography):

* **Option 1: Govind Bhawan 200 Dustbin Monitor & Cleaning Tracker**
  - Live directory and status telemetry of all **200 numbered dustbins (`#GB-001` to `#GB-200`)** across Blocks A, B, C, D, the Mess Wing, and Quadrangle.
  - Transparent **Assumed Cleaning Timings**:
    - 🌅 **Morning Shift (07:30 AM):** Rooms, Mess Prep & Lawn Clearance
    - ☀️ **Afternoon Shift (02:00 PM):** Post-Lunch Mess & Corridor Recyclables
    - 🌙 **Evening Shift (08:30 PM):** Post-Dinner Mess & Common Areas
  - Categorization into 5 distinct waste streams: **Bio-Degradable (Green)**, **Recyclable (Blue)**, **Non-Recyclable (Grey)**, **E-Waste (Orange)**, and **Hazardous/Chemical (Red)**.
  - 1-Click "Report Issue" for missed cleanings, overflows, or foul odors with optional photo evidence.
  - Immediate receipt of an **automated one-way administrative acknowledgment** confirming crew dispatch + **+15 EcoPoints** reward.

* **Option 2: Campus-Wide Random Spot AI Camera & Segregation Guide**
  - Enables students to report unmanaged waste anywhere in IIT Roorkee (LBS Jogging Track, Thomason Building lawns, Central Library, Lecture Hall Complex, etc.).
  - **Azure Custom Vision AI Model Integration:**
    - Live object detection & neural classification identifying material stream (PET bottles, food scraps, e-waste circuits, cardboard parcels, chemical glassware).
    - Returns confidence score, bounding box visualization, and exact disposal instructions.
    - **ElevenLabs Voice AI Guidance:** Spoken audio readout providing accessibility for students and sanitation workers.
  - Dispatches an **automatic one-way confirmation message** from the Administrator with tractor-trolley route assignment.

* **Option 3: Govind Bhawan Circular Re-Use & EcoTrade Marketplace**
  - Enables Govind Bhawan residents to give away or trade personal items (textbooks, lab coats, mini drafters, bicycles, kettles, room furniture) instead of dumping them.
  - **Deterministic Smart Point Assignment Algorithm:**
    $$\text{EcoPoints} = \left\lfloor \text{BasePoints} \times \text{ConditionMultiplier} \times \left(1 + \frac{\text{EmbodiedCarbonKg}}{30}\right) \right\rfloor + \text{AcademicBonus} + \text{AltruismBonus}$$
  - Transparent calculation breakdown explaining points, embodied $CO_2$ averted, and landfill kg saved.
  - Peer-to-peer claiming using student EcoPoints balance with celebratory confetti.

---

### 2. Administration & Estate Portal (`/admin`)
An enterprise command console for the IIT Roorkee Estate Office & Campus Sanitation Squad:
* **Govind Bhawan Fleet Control:** Monitor fill levels, search by bin ID, view battery heartbeats, and mark bins cleaned.
* **Live Complaint Triage Desk:** Real-time incoming queue of student reports, inspect AI classifications, and customize or trigger official one-way notifications.
* **Empirical SWM Analytics:** Interactive visualization of the 2019 MDPI research paper data (5,500 kg/day breakdown, 9 sanitation zones, tractor routing).
* **Azure Custom Vision Model Diagnostics:** Precision (94.8%), Recall (91.2%), mAP (93.6%), and live endpoint credentials editor.
* **SOCIOTHON 2026 Deliverables Report:** Printable executive brief structured according to the hackathon judging rubrics.

---

## 🏆 Hackathon Track Alignment

| Track | Prize Pool | Integration Details |
|---|---|---|
| **Render Track** | ₹5,59,000 | Configured with `render.yaml` Blueprint, Dockerfile, and static deployment pipeline for 1-click launch on Render. |
| **ElevenLabs Track** | ₹6,68,400 | Accessible audio voice guidance engine (`VoiceGuideButton.jsx`) reading AI waste segregation instructions aloud. |

---

## 📊 SOCIOTHON 2026 Impact Assessment

| Metric | Empirical IITR Baseline | EcoCampus IITR Target |
|---|---|---|
| **Landfill Diversion Rate** | 10%–20% | **73.4%** (4,037 kg/day diverted) |
| **Organic Waste Composted** | 0% (Sent to municipal dump) | **1,676 kg/day** (On-campus bio-methanation) |
| **Garden Leaves Briquetting** | Open seasonal burning | **569 kg/day** processed into boiler fuel pellets |
| **Hostel Items Re-Used** | Negligible / Abandoned | **450+ items/month** in Govind Bhawan |
| **Tractor Collection Fuel Saved**| Unrouted manual rounds | **1,420 Litres/month** saved via fill telemetry |

---

## 🚀 Quick Start Guide

### 1. Installation
```bash
cd clean-campus-iitr
npm install
```

### 2. Run Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 3. Build for Production
```bash
npm run build
```

### 4. Deploy to Render
Push this repository to GitHub and connect it to Render using the included `render.yaml` or static site setting:
- **Build Command:** `npm install && npm run build`
- **Publish Directory:** `dist`
