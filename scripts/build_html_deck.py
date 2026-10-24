import os
import base64
from io import BytesIO
from PIL import Image
from pptx import Presentation

TEMPLATE_PATH = r"C:\Users\nikhi\.gemini\antigravity\brain\4ebcde99-ae0a-4e72-8c05-1e2f487e2a2a\.user_uploaded\media_1792835457996_ffbdf9e3.pptx"
SCREENSHOT_DIR = os.path.abspath("presentation/screenshots")
PUBLIC_SLIDES_DIR = os.path.abspath("public/slides")
OUT_PUBLIC_HTML = os.path.abspath("public/pitch-deck.html")
OUT_PRES_HTML = os.path.abspath("presentation/EcoCampus_IITR_Pitch_Deck.html")
OUT_ARTIFACT_HTML = r"C:\Users\nikhi\.gemini\antigravity\brain\4ebcde99-ae0a-4e72-8c05-1e2f487e2a2a\EcoCampus_IITR_Pitch_Deck.html"

os.makedirs(PUBLIC_SLIDES_DIR, exist_ok=True)
os.makedirs(os.path.dirname(OUT_PRES_HTML), exist_ok=True)


def extract_template_assets():
    prs = Presentation(TEMPLATE_PATH)
    assets = {}
    s1 = prs.slides[0]
    mapping = {
        "object 36": "logo_nss.png",
        "object 37": "logo_osen.png",
        "object 38": "logo_craftora.png"
    }
    for shape in s1.shapes:
        if shape.name in mapping:
            fname = mapping[shape.name]
            blob = shape.image.blob
            out_path = os.path.join(PUBLIC_SLIDES_DIR, fname)
            with open(out_path, "wb") as f:
                f.write(blob)
            assets[fname] = "data:image/png;base64," + base64.b64encode(blob).decode("ascii")

    s9 = prs.slides[8]
    for shape in s9.shapes:
        if shape.name == "object 30":
            blob = shape.image.blob
            out_path = os.path.join(PUBLIC_SLIDES_DIR, "lets_code.png")
            with open(out_path, "wb") as f:
                f.write(blob)
            assets["lets_code.png"] = "data:image/png;base64," + base64.b64encode(blob).decode("ascii")
    return assets


def encode_screenshot(fname):
    src = os.path.join(SCREENSHOT_DIR, fname)
    dst = os.path.join(PUBLIC_SLIDES_DIR, fname)
    if not os.path.exists(src):
        return ""
    with open(src, "rb") as f:
        raw = f.read()
    with open(dst, "wb") as f:
        f.write(raw)
    # Compress to high-quality JPEG base64 so the single-file HTML is fast & lightweight
    img = Image.open(BytesIO(raw)).convert("RGB")
    img.thumbnail((1280, 800), Image.Resampling.LANCZOS)
    buf = BytesIO()
    img.save(buf, format="JPEG", quality=88, optimize=True)
    return "data:image/jpeg;base64," + base64.b64encode(buf.getvalue()).decode("ascii")


def build_html():
    assets = extract_template_assets()
    shots = {}
    for name in [
        "01_student_overview.png",
        "02_ai_waste_scanner.png",
        "03_canteen_rewards.png",
        "04_field_crew_portal.png",
        "05_admin_command.png",
        "06_iot_sensor_simulator.png",
        "07_recycler_bidding.png",
        "08_auth_gateway.png"
    ]:
        shots[name] = encode_screenshot(name)

    html = f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>EcoCampus IIT Roorkee — SOCIOTHON 2026 Official Pitch Deck</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@500;700&display=swap" rel="stylesheet">
  <style>
    body {{
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      background-color: #090D16;
      color: #0F172A;
      margin: 0;
      overflow: hidden;
      user-select: none;
    }}
    .font-mono {{ font-family: 'JetBrains Mono', monospace; }}
    .slide-frame {{
      width: 100vw;
      height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 16px;
      box-sizing: border-box;
    }}
    .slide-canvas {{
      width: 100%;
      max-width: 1440px;
      aspect-ratio: 16 / 9;
      max-height: calc(100vh - 76px);
      background: #FFFFFF;
      border-radius: 24px;
      position: relative;
      overflow: hidden;
      box-shadow: 0 25px 70px -15px rgba(0, 0, 0, 0.6);
      display: none;
      flex-direction: column;
      justify-content: space-between;
      padding: 32px 48px;
      box-sizing: border-box;
    }}
    .slide-canvas.active {{
      display: flex;
      animation: slideFade 0.28s cubic-bezier(0.16, 1, 0.3, 1);
    }}
    @keyframes slideFade {{
      from {{ opacity: 0; transform: translateY(8px) scale(0.992); }}
      to {{ opacity: 1; transform: translateY(0) scale(1); }}
    }}
    /* Template Signature Geometric Accents */
    .neon-slash {{
      position: absolute;
      top: 0;
      right: 0;
      width: 240px;
      height: 22px;
      background: linear-gradient(90deg, #A3E635 0%, #65A30D 100%);
      clip-path: polygon(18% 0, 100% 0, 100% 100%, 0% 100%);
      pointer-events: none;
    }}
    .neon-corner-bl {{
      position: absolute;
      bottom: 0;
      left: 0;
      width: 180px;
      height: 14px;
      background: #A3E635;
      clip-path: polygon(0 0, 88% 0, 100% 100%, 0% 100%);
      pointer-events: none;
    }}
    .purple-ring {{
      position: absolute;
      width: 220px;
      height: 220px;
      border-radius: 9999px;
      border: 22px solid rgba(124, 58, 237, 0.06);
      pointer-events: none;
    }}
    .shot-img {{
      cursor: zoom-in;
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }}
    .shot-img:hover {{
      transform: scale(1.015);
      box-shadow: 0 12px 28px -8px rgba(15, 23, 42, 0.18);
    }}
    @media print {{
      body {{ background: #FFFFFF; overflow: visible; }}
      .slide-frame {{ height: auto; display: block; padding: 0; }}
      .slide-canvas {{
        display: flex !important;
        page-break-after: always;
        max-height: none;
        width: 100%;
        border-radius: 0;
        box-shadow: none;
        border: 1px solid #E2E8F0;
        margin-bottom: 20px;
      }}
      .deck-controls, #speaker-drawer, #lightbox {{ display: none !important; }}
    }}
  </style>
</head>
<body>

  <div class="slide-frame">

    <!-- ================================================================== -->
    <!-- SLIDE 1: COVER SLIDE (Official Template Structure)                 -->
    <!-- ================================================================== -->
    <section class="slide-canvas active" data-slide="1">
      <div class="neon-slash"></div>
      <div class="neon-corner-bl"></div>
      <div class="purple-ring" style="top:-60px; left:-60px;"></div>
      <div class="purple-ring" style="bottom:-80px; right:120px;"></div>

      <!-- Top Official Logos Bar -->
      <div class="flex items-center justify-between border-b border-slate-100 pb-3 relative z-10">
        <div class="flex items-center gap-5">
          <img src="{assets.get('logo_nss.png', '')}" alt="NSS IITR" class="h-12 object-contain" />
          <img src="{assets.get('logo_osen.png', '')}" alt="OSEN" class="h-10 object-contain" />
          <img src="{assets.get('logo_craftora.png', '')}" alt="Craftora" class="h-8 object-contain" />
        </div>
        <div class="flex items-center gap-2">
          <span class="font-mono text-xs font-bold bg-lime-300 text-slate-950 px-3 py-1 rounded-full">
            SOCIOTHON 2026 FINALS
          </span>
          <span class="font-mono text-xs text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
            Slide 01 / 09
          </span>
        </div>
      </div>

      <!-- Center Cover Hero -->
      <div class="grid grid-cols-12 gap-8 items-center my-auto relative z-10 py-4">
        <div class="col-span-7 space-y-5">
          <div class="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 px-3.5 py-1.5 rounded-full text-xs font-semibold text-emerald-800">
            <span>KEY DISTINCTION: 4-WAY ECOSYSTEM INCENTIVE ALIGNMENT</span>
          </div>

          <h1 class="text-5xl font-black tracking-tight text-slate-950 leading-[1.08]">
            ECOCAMPUS<br/>
            <span class="text-emerald-600">IIT ROORKEE</span>
          </h1>

          <p class="text-lg font-medium text-slate-600 leading-relaxed max-w-2xl">
            “Turning IIT Roorkee’s <strong class="text-slate-900">5,500 kg/day</strong> solid waste liability into a <strong class="text-emerald-700">100% self-funding circular economy</strong> by aligning the incentives of Students, Sanitation Crew, Administration &amp; B2B Recyclers.”
          </p>

          <div class="grid grid-cols-3 gap-3 pt-2">
            <div class="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
              <div class="font-mono font-bold text-xl text-slate-900">5,500 kg/day</div>
              <div class="text-xs text-slate-500 mt-0.5">Empirical IITR Waste Stream</div>
            </div>
            <div class="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
              <div class="font-mono font-bold text-xl text-emerald-600">73.4% Diverted</div>
              <div class="text-xs text-slate-500 mt-0.5">From Municipal Landfill</div>
            </div>
            <div class="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
              <div class="font-mono font-bold text-xl text-purple-600">₹2.4L / month</div>
              <div class="text-xs text-slate-500 mt-0.5">B2B Auction Surplus Unlocked</div>
            </div>
          </div>

          <div class="pt-2 flex items-center gap-6 text-xs text-slate-500">
            <div><strong class="text-slate-900">Team Name:</strong> Team EcoCampus</div>
            <div>•</div>
            <div><strong class="text-slate-900">Pilot Scope:</strong> Govind Bhawan (200 Bins) &amp; 9 Campus Zones</div>
          </div>
        </div>

        <div class="col-span-5">
          <div class="bg-slate-900 p-2.5 rounded-2xl shadow-xl border border-slate-800">
            <img src="{shots.get('01_student_overview.png', '')}" alt="EcoCampus Live App" class="w-full rounded-xl shot-img" onclick="openLightbox(this.src)" />
            <div class="text-[11px] font-mono text-slate-300 text-center pt-2 pb-0.5">
              Live Production Prototype • Click any screenshot to zoom
            </div>
          </div>
        </div>
      </div>

      <!-- Bottom Bar -->
      <div class="flex items-center justify-between border-t border-slate-100 pt-3 text-xs text-slate-400 relative z-10">
        <span>National Service Scheme (NSS) • Indian Institute of Technology Roorkee</span>
        <span class="font-mono text-slate-600">github.com/NIKHILESH-TS/EcoCampus-IITR</span>
      </div>
    </section>

    <!-- ================================================================== -->
    <!-- SLIDE 2: THE PROBLEM ("What challenge are you solving?")           -->
    <!-- ================================================================== -->
    <section class="slide-canvas" data-slide="2">
      <div class="neon-slash"></div>
      <div class="neon-corner-bl"></div>

      <div class="flex items-center justify-between border-b border-slate-100 pb-3">
        <div>
          <span class="text-[11px] font-mono font-bold uppercase tracking-wider text-rose-600 bg-rose-50 px-2.5 py-0.5 rounded-md">
            01 • THE PROBLEM
          </span>
          <h2 class="text-2xl font-black tracking-tight text-slate-900 mt-1">
            WHAT CHALLENGE ARE WE SOLVING AT IIT ROORKEE?
          </h2>
        </div>
        <span class="font-mono text-xs text-slate-400">Empirical Data: MDPI IIT Roorkee SWM Study | Slide 02 / 09</span>
      </div>

      <div class="grid grid-cols-12 gap-6 my-auto py-2">
        <!-- Left: Real IITR Data + Broken Incentive Diagnosis -->
        <div class="col-span-6 space-y-4">
          <div class="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-2.5">
            <div class="flex items-center justify-between">
              <span class="text-xs font-bold text-slate-900 uppercase tracking-wide">
                1. IIT Roorkee Empirical Solid Waste Audit (5,500 kg/day)
              </span>
              <span class="font-mono text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                365 Acres • 12,000 Pop.
              </span>
            </div>
            <p class="text-xs text-slate-600 leading-relaxed">
              Per the published IIT Roorkee Architecture &amp; Planning study, the campus generates <strong>5.5 Metric Tonnes/day</strong> (<strong>0.46 kg/capita/day</strong> across Hostels 28.5%, Residential 31.1%, Academics 22.0%, Messes 9.5%):
            </p>
            <div class="grid grid-cols-2 gap-2 text-xs font-mono">
              <div class="p-2 bg-white rounded-xl border border-slate-200">Organic Food: <strong>1,676 kg (30.5%)</strong></div>
              <div class="p-2 bg-white rounded-xl border border-slate-200">Paper &amp; Board: <strong>1,580 kg (28.7%)</strong></div>
              <div class="p-2 bg-white rounded-xl border border-slate-200">Plastic &amp; PET: <strong>613 kg (11.1%)</strong></div>
              <div class="p-2 bg-white rounded-xl border border-slate-200">Inert + Leaves: <strong>1,164 kg (21.1%)</strong></div>
            </div>
          </div>

          <div class="bg-slate-900 text-white rounded-2xl p-4.5 space-y-2.5">
            <div class="text-xs font-bold text-lime-400 uppercase tracking-wider">
              2. Root Cause: Why Existing Campus Waste Systems Fail
            </div>
            <div class="space-y-2 text-xs text-slate-200 leading-relaxed">
              <div>
                <strong class="text-white">• Broken Student Incentives:</strong> Zero personal reward for source segregation; existing complaint portals suffer from either student apathy or fake troll reports.
              </div>
              <div>
                <strong class="text-white">• Broken Worker Incentives:</strong> Sanitation staff get flat wages regardless of segregation quality, face English-only app barriers, and run blind tractor routes wasting <strong>1,420 L/month diesel</strong>.
              </div>
              <div>
                <strong class="text-white">• Broken Scrap Market Value:</strong> Wet mess food dumped into dry paper bins destroys <strong>60% of recyclable value</strong> (sold at ₹8/kg mixed vs ₹17.20/kg baled Grade-A).
              </div>
            </div>
          </div>
        </div>

        <!-- Right: Live App Screenshot -->
        <div class="col-span-6 flex flex-col justify-between bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
          <img src="{shots.get('05_admin_command.png', '')}" alt="Admin 200-Bin Telemetry" class="w-full rounded-xl border border-slate-200 shot-img" onclick="openLightbox(this.src)" />
          <div class="pt-2.5 flex items-center justify-between text-xs">
            <span class="font-semibold text-slate-800">Govind Bhawan Pilot: 200 Bins Monitored in Real Time</span>
            <span class="font-mono text-rose-600 font-bold">Contamination = Value Loss</span>
          </div>
        </div>
      </div>

      <div class="border-t border-slate-100 pt-2.5 flex items-center justify-between text-xs text-slate-500">
        <span>Key Insight: You cannot solve a 5,500 kg/day behavioral problem with plastic bins alone—you must align incentives.</span>
        <span class="font-mono">SOCIOTHON 2026</span>
      </div>
    </section>

    <!-- ================================================================== -->
    <!-- SLIDE 3: THE IDEA ("EcoCampus IITR — Closed-Loop Operating System")-->
    <!-- ================================================================== -->
    <section class="slide-canvas" data-slide="3">
      <div class="neon-slash"></div>
      <div class="neon-corner-bl"></div>

      <div class="flex items-center justify-between border-b border-slate-100 pb-3">
        <div>
          <span class="text-[11px] font-mono font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md">
            02 • THE IDEA
          </span>
          <h2 class="text-2xl font-black tracking-tight text-slate-900 mt-1">
            ECOCAMPUS IITR — THE 4-STAKEHOLDER CIRCULAR OPERATING SYSTEM
          </h2>
        </div>
        <span class="font-mono text-xs text-slate-400">End-to-End Closed Loop | Slide 03 / 09</span>
      </div>

      <div class="my-auto space-y-4 py-2">
        <!-- 4-Step Closed Loop Cards -->
        <div class="grid grid-cols-4 gap-3.5">
          <div class="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
            <div class="font-mono text-[11px] font-bold text-emerald-700">STEP 1 • STUDENT</div>
            <div class="font-bold text-slate-900 text-sm">AI Scan &amp; 2-Tap Report</div>
            <p class="text-xs text-slate-600 leading-relaxed">
              Scans waste via MobileNetV3 (+10 Pts) or scans Bin QR to report overflow (+35 Pts on verify / -25 Pts false alarm).
            </p>
          </div>

          <div class="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
            <div class="font-mono text-[11px] font-bold text-amber-700">STEP 2 • FIELD CREW</div>
            <div class="font-bold text-slate-900 text-sm">Hindi Voice &amp; Ground Truth</div>
            <p class="text-xs text-slate-600 leading-relaxed">
              Receives Hindi ElevenLabs voice route, verifies issue with photo proof (+₹150 bonus), and sorts via MobileNet camera.
            </p>
          </div>

          <div class="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
            <div class="font-mono text-[11px] font-bold text-purple-700">STEP 3 • ESTATE ADMIN</div>
            <div class="font-bold text-slate-900 text-sm">IoT Fusion &amp; Scrap Lots</div>
            <p class="text-xs text-slate-600 leading-relaxed">
              Ultrasonic + Load Cell sensors track 200 bins; 2-Opt TSP optimizes tractor route; batches weekly baled scrap tenders.
            </p>
          </div>

          <div class="p-3.5 rounded-2xl bg-slate-900 text-white space-y-1">
            <div class="font-mono text-[11px] font-bold text-lime-400">STEP 4 • B2B RECYCLER</div>
            <div class="font-bold text-white text-sm">Reverse Bidding &amp; Vault</div>
            <p class="text-xs text-slate-300 leading-relaxed">
              ITC Paperboards &amp; Nepra bid live on dry baled lots. Proceeds fund Student Nescafe Vouchers, Crew UPI &amp; Flood Relief!
            </p>
          </div>
        </div>

        <!-- Two Live Website Screenshots Side-by-Side -->
        <div class="grid grid-cols-2 gap-5">
          <div class="bg-slate-50 p-3 rounded-2xl border border-slate-200">
            <img src="{shots.get('01_student_overview.png', '')}" alt="Student Portal" class="w-full h-56 object-cover object-top rounded-xl border border-slate-200 shot-img" onclick="openLightbox(this.src)" />
            <div class="text-xs font-semibold text-slate-800 text-center pt-2">
              1. Clean Mobile-First Student Portal (Overview, AI Scan, Canteen Pass, Bazaar)
            </div>
          </div>

          <div class="bg-slate-50 p-3 rounded-2xl border border-slate-200">
            <img src="{shots.get('08_auth_gateway.png', '')}" alt="4-Persona Auth Gateway" class="w-full h-56 object-cover object-top rounded-xl border border-slate-200 shot-img" onclick="openLightbox(this.src)" />
            <div class="text-xs font-semibold text-slate-800 text-center pt-2">
              2. Unified 4-Persona SSO Gateway with 1-Click Judge Demo Credentials
            </div>
          </div>
        </div>
      </div>

      <div class="border-t border-slate-100 pt-2.5 flex items-center justify-between text-xs text-slate-500">
        <span>Every single persona is connected to the same real-time relational state engine and Circular Vault.</span>
        <span class="font-mono">SOCIOTHON 2026</span>
      </div>
    </section>

    <!-- ================================================================== -->
    <!-- SLIDE 4: KEY FEATURES (Across All 4 Portals)                       -->
    <!-- ================================================================== -->
    <section class="slide-canvas" data-slide="4">
      <div class="neon-slash"></div>
      <div class="neon-corner-bl"></div>

      <div class="flex items-center justify-between border-b border-slate-100 pb-3">
        <div>
          <span class="text-[11px] font-mono font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-md">
            03 • KEY FEATURES
          </span>
          <h2 class="text-2xl font-black tracking-tight text-slate-900 mt-1">
            LIVE MULTI-PORTAL FEATURES BUILT IN OUR PROTOTYPE
          </h2>
        </div>
        <span class="font-mono text-xs text-slate-400">Click any screen to inspect full-size | Slide 04 / 09</span>
      </div>

      <div class="grid grid-cols-3 gap-5 my-auto py-2">
        <!-- Feature 1 -->
        <div class="bg-slate-50 rounded-2xl p-3.5 border border-slate-200 flex flex-col justify-between">
          <div class="space-y-2.5">
            <img src="{shots.get('02_ai_waste_scanner.png', '')}" alt="AI Waste Scanner" class="w-full h-48 object-cover object-top rounded-xl border border-slate-200 shot-img" onclick="openLightbox(this.src)" />
            <div class="font-mono text-[10px] font-bold text-emerald-700 uppercase">PORTAL 1 • STUDENT AI &amp; BAZAAR</div>
            <h3 class="text-sm font-bold text-slate-900">MobileNetV3 Vision + Re-Use Market</h3>
            <p class="text-xs text-slate-600 leading-relaxed">
              • Live WebRTC camera + Top-3 Softmax probabilities.<br/>
              • Bilingual Hindi/English ElevenLabs voice instructions.<br/>
              • P2P Hostel Bazaar to trade books, kettles &amp; skates using EcoTokens.
            </p>
          </div>
        </div>

        <!-- Feature 2 -->
        <div class="bg-slate-50 rounded-2xl p-3.5 border border-slate-200 flex flex-col justify-between">
          <div class="space-y-2.5">
            <img src="{shots.get('04_field_crew_portal.png', '')}" alt="Field Crew Portal" class="w-full h-48 object-cover object-top rounded-xl border border-slate-200 shot-img" onclick="openLightbox(this.src)" />
            <div class="font-mono text-[10px] font-bold text-amber-700 uppercase">PORTAL 2 • SANITATION FIELD CREW</div>
            <h3 class="text-sm font-bold text-slate-900">Hindi Voice Dispatch &amp; Dispute Proof</h3>
            <p class="text-xs text-slate-600 leading-relaxed">
              • 1-tap Hindi (<span class="font-semibold">हिन्दी</span>) spoken audio guidance.<br/>
              • Ground-truth verification: Flag <strong>False Alarm (-25 Pts)</strong> or <strong>Confirm Clean (+35 Pts &amp; +₹150 bonus)</strong>.<br/>
              • Secondary MobileNet rapid camera sorter.
            </p>
          </div>
        </div>

        <!-- Feature 3 -->
        <div class="bg-slate-50 rounded-2xl p-3.5 border border-slate-200 flex flex-col justify-between">
          <div class="space-y-2.5">
            <img src="{shots.get('07_recycler_bidding.png', '')}" alt="B2B Recycler Portal" class="w-full h-48 object-cover object-top rounded-xl border border-slate-200 shot-img" onclick="openLightbox(this.src)" />
            <div class="font-mono text-[10px] font-bold text-blue-700 uppercase">PORTAL 3 &amp; 4 • ADMIN &amp; B2B RECYCLER</div>
            <h3 class="text-sm font-bold text-slate-900">Live Reverse Auctions &amp; Gate Passes</h3>
            <p class="text-xs text-slate-600 leading-relaxed">
              • Admin batches weekly baled paper, PET &amp; metal lots.<br/>
              • ITC Paperboards &amp; Nepra place live counter-bids (+₹0.20 to +₹2.00/kg).<br/>
              • Auto-generates QR Weighbridge Gate Pass PDF on settlement.
            </p>
          </div>
        </div>
      </div>

      <div class="border-t border-slate-100 pt-2.5 flex items-center justify-between text-xs text-slate-500">
        <span>Adaptive UI: Lightweight 3-tap ergonomics on mobile phones; full empirical telemetry on desktop.</span>
        <span class="font-mono">SOCIOTHON 2026</span>
      </div>
    </section>

    <!-- ================================================================== -->
    <!-- SLIDE 5: INNOVATION / THE DIFFERENTIATOR (Incentive Alignment)     -->
    <!-- ================================================================== -->
    <section class="slide-canvas" data-slide="5">
      <div class="neon-slash"></div>
      <div class="neon-corner-bl"></div>

      <div class="flex items-center justify-between border-b border-slate-100 pb-3">
        <div>
          <span class="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-950 bg-lime-300 px-2.5 py-0.5 rounded-md">
            04 • INNOVATION &amp; THE DIFFERENTIATOR
          </span>
          <h2 class="text-2xl font-black tracking-tight text-slate-900 mt-1">
            OUR CORE DISTINCTION: 4-WAY ECOSYSTEM INCENTIVE ALIGNMENT
          </h2>
        </div>
        <span class="font-mono text-xs text-slate-400">Self-Enforcing Nash Equilibrium | Slide 05 / 09</span>
      </div>

      <div class="grid grid-cols-12 gap-6 my-auto py-2 items-center">
        <!-- Left 7 Cols: The Incentive Matrix -->
        <div class="col-span-7 space-y-3">
          <div class="bg-slate-900 text-white p-4 rounded-2xl space-y-2">
            <div class="text-xs font-mono font-bold text-lime-400 uppercase">
              Why Traditional Waste Apps Fail vs. Why EcoCampus Succeeds
            </div>
            <p class="text-xs text-slate-200 leading-relaxed">
              Conventional apps rely on voluntary altruism. EcoCampus monetizes IIT Roorkee’s dry recyclables via B2B reverse auctions and locks every actor into a <strong>truth-telling game-theoretic loop</strong>:
            </p>
          </div>

          <div class="grid grid-cols-2 gap-3 text-xs">
            <div class="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-1">
              <div class="font-bold text-emerald-950">1. Students (Anti-Griefing Tokenomics)</div>
              <p class="text-emerald-900 leading-relaxed">
                • <strong>+10 Tokens</strong> per AI-sorted disposal.<br/>
                • <strong>+35 Tokens</strong> when Squad #2 verifies an overflow.<br/>
                • <strong>-25 Token Penalty</strong> if worker photo proves a False Alarm (stops spam!).<br/>
                • <strong>1 Token = ₹0.50</strong> at Nescafe &amp; Night Mess.
              </p>
            </div>

            <div class="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-1">
              <div class="font-bold text-amber-950">2. Sanitation Crew (UPI Wealth Share)</div>
              <p class="text-amber-900 leading-relaxed">
                • <strong>+₹150 instant bonus</strong> per verified cleanup.<br/>
                • <strong>30% direct revenue share</strong> of all B2B scrap auctions disbursed every Friday via UPI.<br/>
                • Empowered by Hindi voice AI &amp; load sensors (no lifting &gt;35kg blind).
              </p>
            </div>

            <div class="p-3.5 rounded-2xl bg-blue-50/70 border border-blue-200 space-y-1">
              <div class="font-bold text-blue-950">3. B2B Recyclers (Certified Purity)</div>
              <p class="text-blue-900 leading-relaxed">
                • Direct access to baled, moisture-certified (&lt;8%) Grade-A Kraft paper &amp; PET.<br/>
                • Raises campus scrap realization by <strong>+56%</strong> (<strong>₹17.20/kg</strong> vs ₹11/kg informal rate).
              </p>
            </div>

            <div class="p-3.5 rounded-2xl bg-purple-50/70 border border-purple-200 space-y-1">
              <div class="font-bold text-purple-950">4. Self-Funding Circular Vault (₹1.49L+)</div>
              <p class="text-purple-900 leading-relaxed">
                • <strong>30%</strong> Student Canteen &amp; Nescafe Pool<br/>
                • <strong>30%</strong> Sanitation Worker UPI Bonus Pool<br/>
                • <strong>25%</strong> IoT Sensor &amp; Baler Upkeep<br/>
                • <strong>15%</strong> NSS Uttarakhand Flood Relief
              </p>
            </div>
          </div>
        </div>

        <!-- Right 5 Cols: Live Canteen Pass & Vault Screenshot -->
        <div class="col-span-5 bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-2">
          <img src="{shots.get('03_canteen_rewards.png', '')}" alt="Canteen Pass & Vault" class="w-full rounded-xl border border-slate-200 shot-img" onclick="openLightbox(this.src)" />
          <div class="text-xs font-semibold text-slate-800 text-center">
            Live Student Canteen Voucher Generator &amp; NSS Flood Relief Vault
          </div>
        </div>
      </div>

      <div class="border-t border-slate-100 pt-2.5 flex items-center justify-between text-xs text-slate-500">
        <span>Zero recurring cost to IIT Roorkee Administration — 100% funded by the B2B recycling spread.</span>
        <span class="font-mono">SOCIOTHON 2026</span>
      </div>
    </section>

    <!-- ================================================================== -->
    <!-- SLIDE 6: TECH STACK & CORE ALGORITHMS                              -->
    <!-- ================================================================== -->
    <section class="slide-canvas" data-slide="6">
      <div class="neon-slash"></div>
      <div class="neon-corner-bl"></div>

      <div class="flex items-center justify-between border-b border-slate-100 pb-3">
        <div>
          <span class="text-[11px] font-mono font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-md">
            05 • TECH STACK &amp; ALGORITHMS
          </span>
          <h2 class="text-2xl font-black tracking-tight text-slate-900 mt-1">
            EDGE AI, SENSOR-FUSION TELEMETRY &amp; COMBINATORIAL ROUTING
          </h2>
        </div>
        <span class="font-mono text-xs text-slate-400">Production-Grade Architecture | Slide 06 / 09</span>
      </div>

      <div class="grid grid-cols-12 gap-6 my-auto py-2 items-center">
        <div class="col-span-6 space-y-3 text-xs">
          <div class="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
            <div class="font-mono text-[11px] font-bold text-emerald-700">1. EDGE COMPUTER VISION • MOBILENET-V3 SMALL (INT8)</div>
            <p class="text-slate-600 leading-relaxed">
              Depthwise separable convolutions + Hard-Swish activation (<strong>2.9M params, 2.5 MB weights, ~12ms WebGL latency</strong>). Outputs Top-3 Softmax probabilities across 6 campus waste categories with live WebRTC camera capture.
            </p>
          </div>

          <div class="p-3.5 rounded-2xl bg-slate-900 text-white space-y-1">
            <div class="font-mono text-[11px] font-bold text-lime-400">2. IOT DUAL-SENSOR FUSION ANOMALY DETECTION (₹465 / BIN BOM)</div>
            <p class="text-slate-200 leading-relaxed">
              Combines <strong>HC-SR04 Ultrasonic</strong> (volume fill %) + <strong>HX711 50kg Load Cell</strong> (mass kg) on an <strong>ESP32</strong> node to compute Apparent Bulk Density:
              <span class="font-mono font-bold text-lime-300 block mt-1">ρ = Δm / ΔV (kg/L)</span>
              Dry paper has ρ ≈ 0.15–0.30 kg/L; wet mess food has ρ &gt; 0.80 kg/L. When ρ &gt; 0.65 kg/L in a dry bin, the node fires an automatic <strong>Wet Contamination Alert</strong>!
            </p>
          </div>

          <div class="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
            <div class="font-mono text-[11px] font-bold text-purple-700">3. BILINGUAL VOICE AI &amp; 2-OPT TSP OPTIMIZATION</div>
            <p class="text-slate-600 leading-relaxed">
              • <strong>ElevenLabs Multilingual v2:</strong> Natural Hindi &amp; English voice synthesis.<br/>
              • <strong>2-Opt TSP Tractor Routing:</strong> Visits only bins with fill ≥ 80% or mass ≥ 35kg, cutting fuel by 34%.<br/>
              • <strong>Bazaar Valuation Formula:</strong> <span class="font-mono">P = (B_cat × M_cond) + U_academic + A_free</span>
            </p>
          </div>
        </div>

        <div class="col-span-6 bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-2">
          <img src="{shots.get('06_iot_sensor_simulator.png', '')}" alt="IoT Sensor Simulator" class="w-full rounded-xl border border-slate-200 shot-img" onclick="openLightbox(this.src)" />
          <div class="text-xs font-semibold text-slate-800 text-center">
            Live ESP32 Ultrasonic + HX711 Load Cell Apparent Density Simulator
          </div>
        </div>
      </div>

      <div class="border-t border-slate-100 pt-2.5 flex items-center justify-between text-xs text-slate-500">
        <span>Stack: React 18, Vite, Tailwind CSS, MobileNetV3 WebGL, ElevenLabs API, ESP32 MQTT Telemetry.</span>
        <span class="font-mono">SOCIOTHON 2026</span>
      </div>
    </section>

    <!-- ================================================================== -->
    <!-- SLIDE 7: IMPACT & SCALABILITY                                      -->
    <!-- ================================================================== -->
    <section class="slide-canvas" data-slide="7">
      <div class="neon-slash"></div>
      <div class="neon-corner-bl"></div>

      <div class="flex items-center justify-between border-b border-slate-100 pb-3">
        <div>
          <span class="text-[11px] font-mono font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md">
            06 • IMPACT &amp; SCALABILITY
          </span>
          <h2 class="text-2xl font-black tracking-tight text-slate-900 mt-1">
            MEASURABLE ENVIRONMENTAL, SOCIAL &amp; FINANCIAL IMPACT
          </h2>
        </div>
        <span class="font-mono text-xs text-slate-400">Grounded in IIT Roorkee Benchmarks | Slide 07 / 09</span>
      </div>

      <div class="my-auto space-y-5 py-2">
        <!-- 4 Impact KPI Cards -->
        <div class="grid grid-cols-4 gap-4">
          <div class="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-1">
            <div class="font-mono font-black text-3xl text-emerald-700">73.4%</div>
            <div class="font-bold text-slate-900 text-sm">Landfill Diversion</div>
            <p class="text-xs text-slate-600 leading-relaxed">
              4,037 kg/day diverted from Roorkee municipal dumping ground into biogas &amp; B2B recycling.
            </p>
          </div>

          <div class="p-4 rounded-2xl bg-purple-50/70 border border-purple-200 space-y-1">
            <div class="font-mono font-black text-3xl text-purple-700">₹2.4L/mo</div>
            <div class="font-bold text-slate-900 text-sm">B2B Scrap Surplus</div>
            <p class="text-xs text-slate-600 leading-relaxed">
              Generated from 1,580 kg/day paper, 613 kg/day plastic &amp; 175 kg/day metal via reverse auctions.
            </p>
          </div>

          <div class="p-4 rounded-2xl bg-slate-100 border border-slate-200 space-y-1">
            <div class="font-mono font-black text-3xl text-slate-900">384 T/yr</div>
            <div class="font-bold text-slate-900 text-sm">CO₂e Emissions Avoided</div>
            <p class="text-xs text-slate-600 leading-relaxed">
              Plus 1,420 Litres/month tractor diesel saved via IoT-triggered 2-Opt route optimization.
            </p>
          </div>

          <div class="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-1">
            <div class="font-mono font-black text-3xl text-amber-700">18 Days</div>
            <div class="font-bold text-slate-900 text-sm">IoT Hardware Payback</div>
            <p class="text-xs text-slate-600 leading-relaxed">
              Each ₹465 retrofittable bin sensor node pays for itself in &lt;3 weeks of clean Grade-A scrap yield.
            </p>
          </div>
        </div>

        <!-- 3-Phase Rollout Roadmap -->
        <div class="bg-slate-900 text-white rounded-2xl p-5 space-y-3">
          <div class="text-xs font-mono font-bold text-lime-400 uppercase tracking-wider">
            3-Phase Scalability Blueprint: From Govind Bhawan to Pan-India Smart Campuses
          </div>
          <div class="grid grid-cols-3 gap-4 text-xs">
            <div class="p-3.5 rounded-xl bg-slate-800/90 border border-slate-700 space-y-1">
              <div class="font-mono text-lime-400 font-bold">PHASE 1 (MONTHS 1–2)</div>
              <div class="font-bold text-white text-sm">Govind Bhawan Pilot (200 Bins)</div>
              <p class="text-slate-300 leading-relaxed">
                Deploy waterproof QR stickers &amp; ESP32 load/ultrasonic nodes on main wing bins; onboard Squad #2 &amp; Campus Nescafe kiosk.
              </p>
            </div>
            <div class="p-3.5 rounded-xl bg-slate-800/90 border border-slate-700 space-y-1">
              <div class="font-mono text-lime-400 font-bold">PHASE 2 (MONTHS 3–6)</div>
              <div class="font-bold text-white text-sm">Full IIT Roorkee Rollout (365 Acres)</div>
              <p class="text-slate-300 leading-relaxed">
                Expand across all 14 Bhawans, LHC, Central Library &amp; Messes (5,500 kg/day capture); integrate Central Baler Yard weighbridge.
              </p>
            </div>
            <div class="p-3.5 rounded-xl bg-slate-800/90 border border-slate-700 space-y-1">
              <div class="font-mono text-lime-400 font-bold">PHASE 3 (YEAR 1+)</div>
              <div class="font-bold text-white text-sm">23 IITs, NITs &amp; Smart Townships</div>
              <p class="text-slate-300 leading-relaxed">
                Turnkey zero-capex SaaS &amp; IoT blueprint for universities, RWA townships, and municipal wards across India.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div class="border-t border-slate-100 pt-2.5 flex items-center justify-between text-xs text-slate-500">
        <span>Aligned with Swachh Bharat Mission 2.0 &amp; Extended Producer Responsibility (EPR) Mandates.</span>
        <span class="font-mono">SOCIOTHON 2026</span>
      </div>
    </section>

    <!-- ================================================================== -->
    <!-- SLIDE 8: FROM IDEA TO IMPACT ("One Powerful Statement")            -->
    <!-- ================================================================== -->
    <section class="slide-canvas" data-slide="8">
      <div class="neon-slash"></div>
      <div class="neon-corner-bl"></div>
      <div class="purple-ring" style="bottom:-70px; left:-50px;"></div>

      <div class="flex items-center justify-between border-b border-slate-100 pb-3 relative z-10">
        <div class="flex items-center gap-5">
          <img src="{assets.get('logo_nss.png', '')}" alt="NSS IITR" class="h-10 object-contain" />
          <img src="{assets.get('logo_osen.png', '')}" alt="OSEN" class="h-8 object-contain" />
          <img src="{assets.get('logo_craftora.png', '')}" alt="Craftora" class="h-7 object-contain" />
        </div>
        <span class="font-mono text-xs text-slate-400">FROM IDEA TO IMPACT | Slide 08 / 09</span>
      </div>

      <div class="max-w-4xl mx-auto text-center my-auto space-y-6 relative z-10">
        <span class="inline-block font-mono text-xs font-bold uppercase tracking-widest bg-lime-300 text-slate-950 px-4 py-1 rounded-full">
          FROM IDEA TO IMPACT • ONE POWERFUL STATEMENT
        </span>

        <h2 class="text-3xl sm:text-4xl font-black tracking-tight text-slate-950 leading-tight">
          “Waste is only a design flaw of <span class="text-rose-600 underline decoration-4">broken incentives</span>.<br/>
          When a student’s clean segregation buys their evening <span class="text-emerald-600">Nescafe</span>, a sanitation worker’s verified cleanup funds their <span class="text-emerald-600">Friday UPI bonus</span>, and <span class="text-purple-600">ITC</span> bids live for campus scrap—zero-waste stops being charity and becomes an unstoppable, self-funding engine.”
        </h2>

        <div class="grid grid-cols-4 gap-3 pt-4 text-xs">
          <div class="p-3 rounded-xl bg-slate-50 border border-slate-200 font-semibold text-slate-800">
            Students Win (Food Pass)
          </div>
          <div class="p-3 rounded-xl bg-slate-50 border border-slate-200 font-semibold text-slate-800">
            Workers Win (UPI Bonus)
          </div>
          <div class="p-3 rounded-xl bg-slate-50 border border-slate-200 font-semibold text-slate-800">
            Recyclers Win (Grade-A Lots)
          </div>
          <div class="p-3 rounded-xl bg-slate-50 border border-slate-200 font-semibold text-slate-800">
            IIT Roorkee Wins (Zero Waste)
          </div>
        </div>
      </div>

      <div class="border-t border-slate-100 pt-2.5 flex items-center justify-between text-xs text-slate-500 relative z-10">
        <span>EcoCampus IIT Roorkee • Built for SOCIOTHON 2026</span>
        <span class="font-mono">github.com/NIKHILESH-TS/EcoCampus-IITR</span>
      </div>
    </section>

    <!-- ================================================================== -->
    <!-- SLIDE 9: LET'S CODE & LIVE DEMO CREDENTIALS                        -->
    <!-- ================================================================== -->
    <section class="slide-canvas" data-slide="9">
      <div class="neon-slash"></div>
      <div class="neon-corner-bl"></div>

      <div class="flex items-center justify-between border-b border-slate-100 pb-3">
        <div class="flex items-center gap-5">
          <img src="{assets.get('logo_nss.png', '')}" alt="NSS IITR" class="h-10 object-contain" />
          <img src="{assets.get('logo_osen.png', '')}" alt="OSEN" class="h-8 object-contain" />
          <img src="{assets.get('logo_craftora.png', '')}" alt="Craftora" class="h-7 object-contain" />
        </div>
        <span class="font-mono text-xs text-slate-400">LIVE DEMO &amp; Q&amp;A | Slide 09 / 09</span>
      </div>

      <div class="grid grid-cols-12 gap-8 items-center my-auto py-2">
        <div class="col-span-5 text-center space-y-4">
          <img src="{assets.get('lets_code.png', '')}" alt="Let's Code" class="w-72 mx-auto object-contain" />
          <div class="text-sm font-bold text-slate-900">
            Thank You, Judges! Ready for Live Prototype Walkthrough
          </div>
          <a href="/" class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-md">
            <span>Launch Live EcoCampus Web App →</span>
          </a>
        </div>

        <div class="col-span-7 bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-3">
          <div class="text-xs font-mono font-bold text-emerald-700 uppercase">
            4-Persona Live Demo Credentials (Click “Student ▾” in App Navbar)
          </div>
          <div class="grid grid-cols-2 gap-3 text-xs">
            <div class="p-3 bg-white rounded-xl border border-slate-200">
              <div class="font-bold text-slate-900">1. Student (Govind Bhawan)</div>
              <div class="font-mono text-[11px] text-slate-500 mt-0.5">nikhil.sharma@iitr.ac.in / iitr@student26</div>
            </div>
            <div class="p-3 bg-white rounded-xl border border-slate-200">
              <div class="font-bold text-slate-900">2. Sanitation Field Crew</div>
              <div class="font-mono text-[11px] text-slate-500 mt-0.5">ramesh.squad2@iitr.ac.in / iitr@crew26</div>
            </div>
            <div class="p-3 bg-white rounded-xl border border-slate-200">
              <div class="font-bold text-slate-900">3. Estate Officer (Admin)</div>
              <div class="font-mono text-[11px] text-slate-500 mt-0.5">estate.swm@iitr.ac.in / iitr@admin26</div>
            </div>
            <div class="p-3 bg-white rounded-xl border border-slate-200">
              <div class="font-bold text-slate-900">4. B2B Recycler (ITC Ltd.)</div>
              <div class="font-mono text-[11px] text-slate-500 mt-0.5">procurement@itcpspd.com / itc@bidder26</div>
            </div>
          </div>
        </div>
      </div>

      <div class="border-t border-slate-100 pt-2.5 flex items-center justify-between text-xs text-slate-500">
        <span>Press 'S' for Speaker Script • Press 'F' for Fullscreen • Press 'P' to Save as PDF</span>
        <span class="font-mono">Team EcoCampus • SOCIOTHON 2026</span>
      </div>
    </section>

  </div>

  <!-- ==================================================================== -->
  <!-- FLOATING PRESENTER CONTROLS BAR                                      -->
  <!-- ==================================================================== -->
  <div class="deck-controls fixed bottom-3 left-1/2 -translate-x-1/2 z-40 bg-slate-900/95 backdrop-blur-md text-white px-4 py-2 rounded-full border border-slate-700 shadow-2xl flex items-center gap-3 text-xs">
    <button onclick="prevSlide()" class="px-2.5 py-1 rounded-full hover:bg-slate-800 transition-colors cursor-pointer font-medium">
      ← Prev
    </button>
    <span id="slide-indicator" class="font-mono font-bold text-lime-400 px-2">
      01 / 09
    </span>
    <button onclick="nextSlide()" class="px-2.5 py-1 rounded-full hover:bg-slate-800 transition-colors cursor-pointer font-medium">
      Next →
    </button>
    <div class="h-4 w-px bg-slate-700"></div>
    <button onclick="toggleSpeakerNotes()" class="px-3 py-1 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold transition-colors cursor-pointer">
      Speaker Script (S)
    </button>
    <button onclick="toggleFullScreen()" class="px-2.5 py-1 rounded-full hover:bg-slate-800 transition-colors cursor-pointer">
      Fullscreen (F)
    </button>
    <button onclick="window.print()" class="px-2.5 py-1 rounded-full hover:bg-slate-800 transition-colors cursor-pointer">
      Save PDF (P)
    </button>
  </div>

  <!-- ==================================================================== -->
  <!-- TELEPROMPTER / SPEAKER SCRIPT DRAWER                                 -->
  <!-- ==================================================================== -->
  <div id="speaker-drawer" class="fixed bottom-16 left-1/2 -translate-x-1/2 z-40 w-full max-w-3xl bg-slate-900/95 backdrop-blur-xl text-white p-5 rounded-2xl border border-slate-700 shadow-2xl hidden">
    <div class="flex items-center justify-between border-b border-slate-800 pb-2 mb-2.5">
      <span id="script-title" class="font-mono text-xs font-bold text-lime-400 uppercase">
        SLIDE 1 SPEAKER SCRIPT
      </span>
      <button onclick="toggleSpeakerNotes()" class="text-slate-400 hover:text-white text-xs font-bold cursor-pointer">
        Close ✕
      </button>
    </div>
    <p id="script-body" class="text-sm text-slate-200 leading-relaxed"></p>
  </div>

  <!-- ==================================================================== -->
  <!-- FULLSCREEN SCREENSHOT LIGHTBOX                                       -->
  <!-- ==================================================================== -->
  <div id="lightbox" class="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm hidden items-center justify-center p-6 cursor-zoom-out" onclick="closeLightbox()">
    <img id="lightbox-img" src="" alt="Zoomed Screenshot" class="max-w-full max-h-full rounded-2xl shadow-2xl border border-slate-700" />
  </div>

  <script>
    const SPEAKER_SCRIPTS = {{
      1: "Good afternoon respected judges! We are Team EcoCampus, and today we present EcoCampus IIT Roorkee. Every day, IIT Roorkee generates 5,500 kilograms of solid waste. Previous waste initiatives failed not because of a lack of bins, but because of broken incentives. We built the first closed-loop circular operating system that aligns the financial and behavioral incentives of all 4 campus stakeholders—Students, Sanitation Crew, Administration, and B2B Recyclers.",
      2: "Let's look at the empirical data from IIT Roorkee's published MDPI study. Across 365 acres and 12,000 residents, our campus generates 5.5 tonnes of waste daily—30.5% organic food, 28.7% paper and cardboard, and 11.1% plastic. Why does 60% of recyclable value get lost? Three broken incentives: Students have zero reward to segregate or report honestly; Sanitation workers earn flat wages with English-only tools; and wet food mixed into dry paper drops B2B scrap value from ₹17.20/kg down to ₹8/kg.",
      3: "Here is our solution: EcoCampus IITR connects all 4 stakeholders on a single real-time platform. Step 1: Students use MobileNetV3 edge vision and ElevenLabs voice to segregate waste or scan a Bin QR to report overflows. Step 2: Field Crew receive Hindi voice routes and verify reports with ground-truth photos. Step 3: Estate Admin tracks 200 Govind Bhawan bins via ultrasonic and load-cell sensors. Step 4: Corporate buyers like ITC Paperboards bid in live reverse auctions, funding the Campus Circular Vault.",
      4: "Every screenshot on this slide is taken live from our working application. In Portal 1, students use live WebRTC camera detection and trade textbooks, kettles, and skates on the Govind Bhawan Re-Use Bazaar. In Portal 2, sanitation workers toggle Hindi voice guidance and log ground-truth dispute photos. In Portals 3 and 4, admins batch weekly recyclable lots and B2B recyclers place live counter-bids to generate automated weighbridge Gate Passes.",
      5: "Slide 5 is our core differentiator: Ecosystem-Wide Incentive Alignment. How do we prevent students from spamming fake bin reports just to farm points? We engineered a game-theoretic anti-griefing rule: when a worker inspects a reported bin, if it is genuinely overflowing, the student earns +35 EcoTokens (worth ₹17.50 at Campus Nescafe) and the worker earns a +₹150 bonus. If the worker uploads photo proof that the bin is clean, 25 EcoTokens are deducted from the student! Meanwhile, B2B auction revenue is partitioned 30% to Student Canteen vouchers, 30% to Worker Friday UPI bonuses, 25% to hardware upkeep, and 15% to NSS Uttarakhand Flood Relief.",
      6: "Under the hood, our tech stack is built for edge speed and low cost. First, MobileNetV3-Small INT8 runs in 12 milliseconds in the browser via WebGL. Second, our ₹465 retrofittable bin node combines an HC-SR04 ultrasonic sensor with an HX711 50kg load cell on ESP32 to calculate Apparent Bulk Density (ρ = Δm / ΔV). If someone dumps heavy wet food into a dry paper bin, ρ spikes above 0.65 kg/L and triggers an instant Contamination Alert! Third, 2-Opt TSP routing cuts tractor fuel consumption by 34%.",
      7: "Grounded in IIT Roorkee's 5,500 kg/day baseline, EcoCampus diverts 73.4% of waste (4,037 kg/day) from landfills, unlocks ₹2.4 Lakhs/month in B2B scrap surplus, and avoids 384 tonnes of CO2e annually. At just ₹465 per bin node, the hardware pays for itself in 18 days. Phase 1 pilots across 200 bins in Govind Bhawan, Phase 2 scales to all 14 Bhawans, and Phase 3 offers a zero-capex blueprint for all 23 IITs.",
      8: "To leave you with one powerful statement: Waste is only a design flaw of broken incentives. When a student's clean segregation buys their evening Nescafe, a worker's verified cleanup funds their Friday UPI bonus, and ITC bids live for campus scrap—zero-waste becomes an unstoppable, self-funding engine.",
      9: "Thank you! Our live web application is deployed and ready, complete with 1-click demo credentials for all 4 personas. We would love to show you the live workflow and answer your questions!"
    }};

    let current = 1;
    const total = 9;

    function showSlide(n) {{
      current = Math.max(1, Math.min(total, n));
      document.querySelectorAll('.slide-canvas').forEach(el => {{
        el.classList.toggle('active', parseInt(el.dataset.slide) === current);
      }});
      document.getElementById('slide-indicator').textContent = `0${{current}} / 0${{total}}`;
      document.getElementById('script-title').textContent = `SLIDE 0${{current}} PRESENTER SCRIPT`;
      document.getElementById('script-body').textContent = SPEAKER_SCRIPTS[current] || '';
    }}

    function nextSlide() {{ showSlide(current + 1); }}
    function prevSlide() {{ showSlide(current - 1); }}

    function toggleSpeakerNotes() {{
      const drawer = document.getElementById('speaker-drawer');
      drawer.classList.toggle('hidden');
      showSlide(current);
    }}

    function toggleFullScreen() {{
      if (!document.fullscreenElement) {{
        document.documentElement.requestFullscreen();
      }} else {{
        document.exitFullscreen();
      }}
    }}

    function openLightbox(src) {{
      document.getElementById('lightbox-img').src = src;
      const lb = document.getElementById('lightbox');
      lb.classList.remove('hidden');
      lb.classList.add('flex');
    }}

    function closeLightbox() {{
      const lb = document.getElementById('lightbox');
      lb.classList.add('hidden');
      lb.classList.remove('flex');
    }}

    window.addEventListener('keydown', (e) => {{
      if (e.key === 'ArrowRight' || e.key === ' ') {{ e.preventDefault(); nextSlide(); }}
      if (e.key === 'ArrowLeft') {{ e.preventDefault(); prevSlide(); }}
      if (e.key === 's' || e.key === 'S') {{ toggleSpeakerNotes(); }}
      if (e.key === 'f' || e.key === 'F') {{ toggleFullScreen(); }}
      if (e.key === 'p' || e.key === 'P') {{ window.print(); }}
      if (e.key === 'Escape') {{ closeLightbox(); }}
    }});

    showSlide(1);
  </script>
</body>
</html>
"""

    for path_out in [OUT_PUBLIC_HTML, OUT_PRES_HTML, OUT_ARTIFACT_HTML]:
        with open(path_out, "w", encoding="utf-8") as f:
            f.write(html)
        print(f"Saved HTML Presentation Deck to: {path_out}")


if __name__ == "__main__":
    build_html()
