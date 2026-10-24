import os
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
from pptx.enum.shapes import MSO_SHAPE

TEMPLATE_PATH = r"C:\Users\nikhi\.gemini\antigravity\brain\4ebcde99-ae0a-4e72-8c05-1e2f487e2a2a\.user_uploaded\media_1792835457996_ffbdf9e3.pptx"
SCREENSHOT_DIR = os.path.abspath("presentation/screenshots")
OUTPUT_PPTX = os.path.abspath("presentation/EcoCampus_IITR_SOCIOTHON_2026.pptx")

# Colors matching template & clean Apple/Linear aesthetic
DARK_SLATE = RGBColor(15, 23, 42)      # #0F172A
BODY_SLATE = RGBColor(51, 65, 85)      # #334155
MUTED_SLATE = RGBColor(100, 116, 139)  # #64748B
CARD_BG = RGBColor(248, 250, 252)      # #F8FAFC
WHITE = RGBColor(255, 255, 255)
BORDER_GRAY = RGBColor(226, 232, 240)  # #E2E8F0
EMERALD = RGBColor(5, 150, 105)        # #059669
EMERALD_BG = RGBColor(236, 253, 245)   # #ECFDF5
NEON_LIME = RGBColor(163, 230, 53)     # #A3E635
PURPLE = RGBColor(124, 58, 237)        # #7C3AED
AMBER = RGBColor(217, 119, 6)          # #D97706
ROSE = RGBColor(225, 29, 72)           # #E11D48


def add_card(slide, left, top, width, height, bg_color=WHITE, border_color=BORDER_GRAY):
    shape = slide.shapes.add_shape(
        MSO_SHAPE.ROUNDED_RECTANGLE,
        Inches(left), Inches(top), Inches(width), Inches(height)
    )
    shape.fill.solid()
    shape.fill.fore_color.rgb = bg_color
    if border_color:
        shape.line.color.rgb = border_color
        shape.line.width = Pt(1.2)
    else:
        shape.line.fill.background()
    if hasattr(shape, "adjustments") and len(shape.adjustments) > 0:
        shape.adjustments[0] = 0.04
    return shape


def add_textbox(slide, left, top, width, height, lines, align=PP_ALIGN.LEFT):
    tb = slide.shapes.add_textbox(Inches(left), Inches(top), Inches(width), Inches(height))
    tf = tb.text_frame
    tf.word_wrap = True
    tf.margin_left = Inches(0.08)
    tf.margin_right = Inches(0.08)
    tf.margin_top = Inches(0.06)
    tf.margin_bottom = Inches(0.06)

    for idx, item in enumerate(lines):
        p = tf.paragraphs[0] if idx == 0 else tf.add_paragraph()
        p.alignment = align
        p.space_after = Pt(item.get("space_after", 6))
        run = p.add_run()
        run.text = item["text"]
        run.font.name = item.get("font", "Segoe UI")
        run.font.size = Pt(item.get("size", 14))
        run.font.bold = item.get("bold", False)
        run.font.color.rgb = item.get("color", DARK_SLATE)
    return tb


def add_screenshot_card(slide, img_name, left, top, width, caption):
    img_path = os.path.join(SCREENSHOT_DIR, img_name)
    if not os.path.exists(img_path):
        return
    # Maintain 16:10 aspect ratio of 1440x900 screenshots
    img_height = width * (900.0 / 1440.0)
    add_card(slide, left - 0.08, top - 0.08, width + 0.16, img_height + 0.52, WHITE, BORDER_GRAY)
    slide.shapes.add_picture(img_path, Inches(left), Inches(top), width=Inches(width))
    add_textbox(slide, left, top + img_height + 0.04, width, 0.36, [
        {"text": caption, "size": 11, "bold": True, "color": BODY_SLATE}
    ], align=PP_ALIGN.CENTER)


def build_deck():
    prs = Presentation(TEMPLATE_PATH)

    # =========================================================================
    # SLIDE 1: COVER SLIDE
    # =========================================================================
    s1 = prs.slides[0]
    for shape in s1.shapes:
        if shape.name == "object 35" and shape.has_text_frame:
            tf = shape.text_frame
            tf.clear()
            tf.word_wrap = True

            p1 = tf.paragraphs[0]
            r1 = p1.add_run()
            r1.text = "ECOCAMPUS IIT ROORKEE"
            r1.font.name = "Arial Black"
            r1.font.size = Pt(40)
            r1.font.bold = True
            r1.font.color.rgb = DARK_SLATE
            p1.space_after = Pt(12)

            p2 = tf.add_paragraph()
            r2 = p2.add_run()
            r2.text = "“Turning IIT Roorkee’s 5,500 kg/day Waste Liability into a Self-Funding Circular Economy through 4-Way Incentive Alignment.”"
            r2.font.name = "Segoe UI"
            r2.font.size = Pt(20)
            r2.font.bold = True
            r2.font.color.rgb = EMERALD
            p2.space_after = Pt(18)

            p3 = tf.add_paragraph()
            r3 = p3.add_run()
            r3.text = "Team Name: Team EcoCampus  |  SOCIOTHON 2026 (NSS IIT Roorkee × OSEN × Craftora)\nLive Prototype: github.com/NIKHILESH-TS/EcoCampus-IITR"
            r3.font.name = "Segoe UI"
            r3.font.size = Pt(15)
            r3.font.bold = True
            r3.font.color.rgb = BODY_SLATE

    # =========================================================================
    # SLIDE 2: THE PROBLEM (Empirical IIT Roorkee Data & Broken Incentives)
    # =========================================================================
    s2 = prs.slides[1]
    # Left Card 1: Empirical IITR Audit
    add_card(s2, 1.3, 3.2, 8.2, 3.3, CARD_BG, BORDER_GRAY)
    add_textbox(s2, 1.5, 3.35, 7.8, 3.0, [
        {"text": "1. EMPIRICAL IIT ROORKEE WASTE AUDIT (MDPI STUDY)", "size": 15, "bold": True, "color": EMERALD, "space_after": 8},
        {"text": "• 5,500 kg / day (5.5 Metric Tonnes) across 365 Acres & 12,000 Residents (0.46 kg/capita/day).", "size": 13, "bold": True, "color": DARK_SLATE},
        {"text": "• Stream Breakdown: Organic Food 30.5% (1,676 kg) | Paper & Cardboard 28.7% (1,580 kg) | Plastic 11.1% (613 kg) | Inert 10.8% (595 kg) | Dry Leaves 10.3% (569 kg).", "size": 12.5, "color": BODY_SLATE},
        {"text": "• Infrastructure Gap: 200 bins in Govind Bhawan & 80 community bins operate on fixed shifts without fill/weight telemetry or contamination checks.", "size": 12.5, "color": BODY_SLATE}
    ])

    # Left Card 2: The Core Problem — Misaligned Incentives
    add_card(s2, 1.3, 6.75, 8.2, 3.3, DARK_SLATE, None)
    add_textbox(s2, 1.5, 6.9, 7.8, 3.0, [
        {"text": "2. ROOT CAUSE: BROKEN INCENTIVES ACROSS STAKEHOLDERS", "size": 15, "bold": True, "color": NEON_LIME, "space_after": 8},
        {"text": "• Students: Zero personal reward to segregate at the bin; complaint portals fail due to either student apathy or unverified fake reports.", "size": 12.5, "color": WHITE},
        {"text": "• Sanitation Crew: Fixed wages regardless of waste purity; language barriers; unoptimized tractor routes burn 1,420 L/month excess diesel.", "size": 12.5, "color": WHITE},
        {"text": "• Campus & Recyclers: Wet food mixed into dry paper destroys 60% of B2B scrap value (₹8/kg mixed vs ₹17.20/kg baled Grade-A).", "size": 12.5, "color": WHITE}
    ])

    # Right: Real Website Screenshot of 200-Bin Admin Command
    add_screenshot_card(s2, "05_admin_command.png", 9.9, 3.3, 8.3, "Live App Screenshot: Govind Bhawan 200-Bin Telemetry & SLA Dispatch Console")

    # =========================================================================
    # SLIDE 3: THE IDEA (EcoCampus IITR — 4-Stakeholder Circular OS)
    # =========================================================================
    s3 = prs.slides[2]
    for shape in s3.shapes:
        if shape.name == "object 3" and shape.has_text_frame:
            shape.text_frame.paragraphs[0].runs[0].text = "ECOCAMPUS IITR"

    steps = [
        ("1. STUDENT", "AI Camera & Voice Sorter", "• Scans trash via MobileNetV3 (+10 Pts)\n• Reports full bin via QR (+35 Pts on fix)\n• Redeems Nescafe & Mess Coupons", EMERALD),
        ("2. FIELD CREW", "Hindi Voice & Ground Truth", "• Receives Hindi ElevenLabs audio route\n• Verifies issue or flags False Alarm (-25 Pts)\n• Earns +₹150 bonus & 30% scrap share", AMBER),
        ("3. ESTATE ADMIN", "IoT Sensor Fusion & TSP", "• Ultrasonic + Load Cell tracks 200 bins\n• 2-Opt TSP optimizes tractor beat\n• Batches weekly dry recyclable lots", PURPLE),
        ("4. B2B RECYCLER", "Reverse Auction & Vault", "• ITC / Nepra bid live on baled lots\n• Highest bid settles into Campus Vault\n• Funds Canteen, Crew UPI & Flood Relief", DARK_SLATE),
    ]
    for i, (role, sub, body, col) in enumerate(steps):
        x = 1.3 + i * 4.25
        add_card(s3, x, 3.4, 4.05, 2.35, CARD_BG, BORDER_GRAY)
        add_textbox(s3, x + 0.12, 3.5, 3.8, 2.15, [
            {"text": role, "size": 13, "bold": True, "color": col, "space_after": 2},
            {"text": sub, "size": 12, "bold": True, "color": DARK_SLATE, "space_after": 6},
            {"text": body, "size": 11.5, "color": BODY_SLATE}
        ])

    add_screenshot_card(s3, "01_student_overview.png", 1.8, 6.05, 7.5, "Live Student Portal: Action-First Overview & Wallet")
    add_screenshot_card(s3, "08_auth_gateway.png", 10.1, 6.05, 7.5, "Live 4-Persona SSO & Demo Credentials Gateway")

    # =========================================================================
    # SLIDE 4: KEY FEATURES (Live Product Showcase Across All 4 Portals)
    # =========================================================================
    s4 = prs.slides[3]
    add_screenshot_card(s4, "02_ai_waste_scanner.png", 1.3, 3.25, 5.4, "1. MobileNetV3 Vision + Bilingual Voice Guide")
    add_screenshot_card(s4, "04_field_crew_portal.png", 7.1, 3.25, 5.4, "2. Field Crew Hindi Portal & Anti-Spam Verification")
    add_screenshot_card(s4, "07_recycler_bidding.png", 12.9, 3.25, 5.4, "3. B2B Recycler Reverse Auction & Gate Passes")

    add_card(s4, 1.3, 7.55, 17.0, 2.45, CARD_BG, BORDER_GRAY)
    add_textbox(s4, 1.5, 7.7, 16.6, 2.2, [
        {"text": "END-TO-END FUNCTIONAL CAPABILITIES BUILT IN PROTOTYPE", "size": 14, "bold": True, "color": EMERALD, "space_after": 6},
        {"text": "• Student Suite: Live WebRTC Camera Classifier (Top-3 Softmax Logits), 2-Tap QR Overflow Reporting, P2P Hostel Re-Use Bazaar (Books/Kettles/Skates), & Instant Nescafe Voucher Generator.", "size": 12.5, "color": DARK_SLATE},
        {"text": "• Sanitation Crew Suite: One-tap Hindi/English ElevenLabs spoken instructions, MobileNetV3 rapid secondary sorter, Ground-Truth Photo Proof (False Alarm vs Verified Clean).", "size": 12.5, "color": DARK_SLATE},
        {"text": "• Admin & B2B Suite: 200-Bin Load/Volume Telemetry, Printable QR Sticker Sheet Generator, 2-Opt Route Optimizer, Live B2B Reverse Bidding & Weighbridge Gate Pass PDF.", "size": 12.5, "color": DARK_SLATE}
    ])

    # =========================================================================
    # SLIDE 5: INNOVATION / THE DIFFERENTIATOR (4-Way Incentive Alignment)
    # =========================================================================
    s5 = prs.slides[4]
    add_card(s5, 1.3, 3.2, 9.2, 6.8, DARK_SLATE, None)
    add_textbox(s5, 1.55, 3.4, 8.7, 6.4, [
        {"text": "KEY DISTINCTION: ECOSYSTEM-WIDE INCENTIVE ALIGNMENT", "size": 16, "bold": True, "color": NEON_LIME, "space_after": 8},
        {"text": "Most waste apps fail because they rely on voluntary charity. We engineered a self-funding game-theoretic loop where every actor profits from clean segregation:", "size": 12.5, "color": WHITE, "space_after": 10},
        {"text": "1. Students (Game-Theoretic Anti-Griefing):", "size": 13.5, "bold": True, "color": NEON_LIME, "space_after": 2},
        {"text": "   • +10 EcoTokens per AI-verified disposal | +35 Tokens when worker verifies overflow report.\n   • -25 Token Penalty if field crew photo proves a False Alarm (eliminates spam).\n   • Liquid Value: 1 Token = ₹0.50 at Campus Nescafe, Night Canteen, or Hostel Re-Use Bazaar.", "size": 12, "color": WHITE, "space_after": 8},
        {"text": "2. Sanitation Field Crew (Dignity + Direct Wealth Share):", "size": 13.5, "bold": True, "color": NEON_LIME, "space_after": 2},
        {"text": "   • +₹150 instant bonus per verified SLA cleanup + 30% share of weekly B2B scrap revenue paid every Friday via UPI.", "size": 12, "color": WHITE, "space_after": 8},
        {"text": "3. B2B Recyclers & Self-Funding Campus Vault:", "size": 13.5, "bold": True, "color": NEON_LIME, "space_after": 2},
        {"text": "   • ITC & Nepra bid up to ₹17.20/kg (+56% over informal rates) for dry baled lots.\n   • Vault Split: 30% Student Food Pass | 30% Crew UPI | 25% Baler/IoT Upkeep | 15% NSS Flood Relief.", "size": 12, "color": WHITE}
    ])

    add_screenshot_card(s5, "03_canteen_rewards.png", 10.8, 3.3, 7.5, "Live Canteen Voucher Pass & NSS Flood Relief Matching Vault")

    # =========================================================================
    # SLIDE 6: TECH STACK & CORE ALGORITHMS
    # =========================================================================
    s6 = prs.slides[5]
    add_card(s6, 1.3, 3.2, 8.8, 6.8, CARD_BG, BORDER_GRAY)
    add_textbox(s6, 1.5, 3.35, 8.4, 6.5, [
        {"text": "PRODUCTION ARCHITECTURE & ALGORITHMS", "size": 15, "bold": True, "color": EMERALD, "space_after": 8},
        {"text": "1. Edge Computer Vision (MobileNetV3-Small INT8):", "size": 13.5, "bold": True, "color": DARK_SLATE, "space_after": 2},
        {"text": "   • Depthwise separable convolutions + Hard-Swish activation (2.9M params, 2.5 MB weights, ~12ms WebGL inference) classifying 6 campus waste streams.", "size": 12, "color": BODY_SLATE, "space_after": 8},
        {"text": "2. IoT Dual-Sensor Fusion Anomaly Algorithm (₹465/Bin BOM):", "size": 13.5, "bold": True, "color": DARK_SLATE, "space_after": 2},
        {"text": "   • ESP32 + HC-SR04 Ultrasonic (fill %) + HX711 50kg Load Cell (mass kg).\n   • Computes Apparent Bulk Density ρ = Δm / ΔV. If ρ > 0.65 kg/L in a Paper Bin, flags Wet Contamination Alert automatically.", "size": 12, "color": BODY_SLATE, "space_after": 8},
        {"text": "3. ElevenLabs Multilingual v2 Voice Synthesis:", "size": 13.5, "bold": True, "color": DARK_SLATE, "space_after": 2},
        {"text": "   • Low-latency Hindi & English spoken guidance for field workers & students.", "size": 12, "color": BODY_SLATE, "space_after": 8},
        {"text": "4. 2-Opt TSP Routing & Algorithmic Re-Use Pricing:", "size": 13.5, "bold": True, "color": DARK_SLATE, "space_after": 2},
        {"text": "   • 2-Opt heuristic cuts tractor distance by 34%. Dynamic Bazaar valuation: P = (Bc × Mcond) + Uacad + Afree.", "size": 12, "color": BODY_SLATE}
    ])

    add_screenshot_card(s6, "06_iot_sensor_simulator.png", 10.4, 3.3, 7.9, "Live ESP32 Ultrasonic + HX711 Load Cell Sensor-Fusion Simulator")

    # =========================================================================
    # SLIDE 7: IMPACT & SCALABILITY
    # =========================================================================
    s7 = prs.slides[6]
    kpis = [
        ("73.4%", "Landfill Diversion", "4,037 kg/day diverted into biogas & B2B recycling at IIT Roorkee", EMERALD),
        ("₹2.4L / mo", "B2B Scrap Surplus", "Unlocked via competitive reverse bidding with ITC & Nepra", PURPLE),
        ("384 Tonnes", "CO₂e Avoided / Yr", "+ 1,420 L/month tractor diesel saved via IoT-triggered TSP routing", DARK_SLATE),
        ("₹465 / Bin", "Retrofittable IoT Node", "18-day payback period from increased Grade-A scrap realization", AMBER),
    ]
    for i, (num, title, desc, col) in enumerate(kpis):
        x = 1.3 + i * 4.25
        add_card(s7, x, 3.3, 4.05, 2.4, WHITE, BORDER_GRAY)
        add_textbox(s7, x + 0.15, 3.45, 3.75, 2.1, [
            {"text": num, "size": 28, "bold": True, "color": col, "space_after": 4},
            {"text": title, "size": 14, "bold": True, "color": DARK_SLATE, "space_after": 4},
            {"text": desc, "size": 11.5, "color": BODY_SLATE}
        ])

    add_card(s7, 1.3, 6.0, 17.0, 3.8, CARD_BG, BORDER_GRAY)
    add_textbox(s7, 1.55, 6.2, 16.5, 3.4, [
        {"text": "3-PHASE SCALABILITY ROADMAP: FROM GOVIND BHAWAN TO PAN-INDIA SMART CAMPUSES", "size": 15, "bold": True, "color": EMERALD, "space_after": 10},
        {"text": "• Phase 1 (Months 1–2) — Govind Bhawan Pilot (200 Bins): Deploy QR stickers & ESP32 load/ultrasonic nodes on main wing bins; onboard Squad #2 & Campus Nescafe kiosk.", "size": 13, "bold": True, "color": DARK_SLATE, "space_after": 8},
        {"text": "• Phase 2 (Months 3–6) — Full IIT Roorkee Rollout (365 Acres, 5,500 kg/day): Expand across all 14 Bhawans, LHC, Central Library, and Messes; integrate Central SWM Baler Yard weighbridge.", "size": 13, "bold": True, "color": DARK_SLATE, "space_after": 8},
        {"text": "• Phase 3 (Year 1+) — Pan-IIT & Smart Municipality SaaS Blueprint: Replicable zero-capex circular treasury model for 23 IITs, NITs, and gated townships across India.", "size": 13, "bold": True, "color": DARK_SLATE}
    ])

    # =========================================================================
    # SLIDE 8: FROM IDEA TO IMPACT (One Powerful Statement)
    # =========================================================================
    s8 = prs.slides[7]
    for shape in s8.shapes:
        if shape.name == "object 30" and shape.has_text_frame:
            tf = shape.text_frame
            tf.clear()
            tf.word_wrap = True

            p1 = tf.paragraphs[0]
            r1 = p1.add_run()
            r1.text = "FROM IDEA TO IMPACT"
            r1.font.name = "Arial Black"
            r1.font.size = Pt(30)
            r1.font.bold = True
            r1.font.color.rgb = DARK_SLATE
            p1.space_after = Pt(14)

            p2 = tf.add_paragraph()
            r2 = p2.add_run()
            r2.text = "“Waste is only a design flaw of broken incentives. When a student’s clean segregation buys their evening Nescafe, a worker’s verified cleanup funds their Friday UPI bonus, and ITC bids live for campus scrap—zero-waste becomes an unstoppable, self-funding engine.”"
            r2.font.name = "Segoe UI"
            r2.font.size = Pt(18)
            r2.font.bold = True
            r2.font.color.rgb = EMERALD

    add_screenshot_card(s8, "01_student_overview.png", 6.2, 5.5, 7.6, "EcoCampus IIT Roorkee — Live & Production-Ready at github.com/NIKHILESH-TS/EcoCampus-IITR")

    os.makedirs(os.path.dirname(OUTPUT_PPTX), exist_ok=True)
    prs.save(OUTPUT_PPTX)
    print(f"Successfully generated presentation at: {OUTPUT_PPTX}")


if __name__ == "__main__":
    build_deck()
