import React, { useState } from 'react';
import { 
  Camera, 
  MapPin, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  Send, 
  Volume2, 
  RefreshCw, 
  Navigation, 
  ChevronRight,
  ShieldAlert,
  HelpCircle,
  FileText
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { IITR_CAMPUS_LOCATIONS } from '../../data/campusLocations';
import { classifyWasteWithAzure, WASTE_DETECTION_CLASSES } from '../../services/azureCustomVision';
import { store } from '../../services/store';
import { WasteCategoryBadge } from '../Common/StatusBadge';
import VoiceGuideButton from '../Common/VoiceGuideButton';

// Sample curated images for instant testing
const TEST_SAMPLES = [
  {
    name: 'Plastic Water Bottle',
    url: 'https://images.unsplash.com/photo-1528323273322-d81458248d40?auto=format&fit=crop&w=600&q=80',
    hint: 'plastic water bottle'
  },
  {
    name: 'Mess Food / Banana Peel',
    url: 'https://images.unsplash.com/photo-1528825871115-3581a5387919?auto=format&fit=crop&w=600&q=80',
    hint: 'banana peel food scrap'
  },
  {
    name: 'Hostel E-Waste & Chargers',
    url: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=600&q=80',
    hint: 'circuit board cable charger e-waste'
  },
  {
    name: 'Cardboard Parcels & Notes',
    url: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=600&q=80',
    hint: 'cardboard parcel paper'
  },
  {
    name: 'Soda Aluminium Can',
    url: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=600&q=80',
    hint: 'tin aluminium can'
  },
  {
    name: 'Chemistry Lab Glass / Reagent',
    url: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=600&q=80',
    hint: 'chemical bottle glass'
  }
];

export default function SpotAiWasteComplaint() {
  const [selectedLocation, setSelectedLocation] = useState(IITR_CAMPUS_LOCATIONS[0].id);
  const [customLocationDetail, setCustomLocationDetail] = useState('');
  const [photoPreview, setPhotoPreview] = useState(TEST_SAMPLES[0].url);
  const [photoFile, setPhotoFile] = useState(null);
  const [currentHint, setCurrentHint] = useState(TEST_SAMPLES[0].hint);
  
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiResult, setAiResult] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedAck, setSubmittedAck] = useState(null);

  const activeLocation = IITR_CAMPUS_LOCATIONS.find(l => l.id === selectedLocation) || IITR_CAMPUS_LOCATIONS[0];

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhotoFile(file);
      setCurrentHint(file.name);
      const reader = new FileReader();
      reader.onload = () => {
        setPhotoPreview(reader.result);
        setAiResult(null);
        setIsSubmitted(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePickSample = (sample) => {
    setPhotoPreview(sample.url);
    setPhotoFile(null);
    setCurrentHint(sample.hint);
    setAiResult(null);
    setIsSubmitted(false);
  };

  const handleRunAiAnalysis = async () => {
    setIsAnalyzing(true);
    setAiResult(null);
    try {
      const result = await classifyWasteWithAzure(photoFile || photoPreview, currentHint);
      setAiResult(result);
    } catch (err) {
      console.error('AI classification failed', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSubmitComplaint = (e) => {
    e.preventDefault();
    if (!aiResult) return;

    const user = store.getUser();
    const locString = `${activeLocation.name} (${activeLocation.zone})${customLocationDetail ? ` - ${customLocationDetail}` : ''}`;
    
    const ackMessage = `[IITR Administration Auto-Ack] Spot waste complaint verified via Azure Cloud AI as "${aiResult.prediction.tag}" (${aiResult.prediction.confidence}% confidence). Dispatched to ${aiResult.prediction.collectionGroup}. Cleanliness tractor #4 notified for ${activeLocation.name}. Thank you ${user.name}!`;

    const complaintData = {
      type: 'Random Geo-Tagged Spot',
      binId: null,
      location: locString,
      category: aiResult.prediction.category,
      reportedBy: `${user.name} (${user.room})`,
      reportedEmail: user.email,
      issueType: `Spot Waste Detected: ${aiResult.prediction.tag}. Designated for ${aiResult.prediction.binColor}.`,
      photoUrl: photoPreview,
      status: 'Dispatched to Crew',
      aiClassification: {
        tag: aiResult.prediction.tag,
        confidence: aiResult.prediction.confidence,
        category: aiResult.prediction.category,
        collectionGroup: aiResult.prediction.collectionGroup,
        binColor: aiResult.prediction.binColor
      },
      adminAcknowledgment: {
        sentAt: 'Just now',
        message: ackMessage,
        adminOfficer: 'Campus Chief Sanitation Officer'
      }
    };

    store.addComplaint(complaintData);

    try {
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {}

    setSubmittedAck(ackMessage);
    setIsSubmitted(true);
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* Hallmark Aesthetic Banner */}
      <div className="bg-gradient-to-r from-hallmark-dark via-hallmark-primary to-emerald-800 rounded-3xl p-6 sm:p-8 text-white shadow-lifted relative overflow-hidden">
        <div className="max-w-3xl relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-emerald-200 text-xs font-medium mb-3 backdrop-blur-sm border border-white/10">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Campus-Wide Random Spot Reporter • Azure Custom Vision AI</span>
          </div>

          <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight">
            Spot Any Waste in IIT Roorkee & Classify with Cloud AI
          </h2>
          <p className="text-emerald-100/90 text-sm mt-2 leading-relaxed">
            Spotted unmanaged garbage at the LBS Jogging Track, Central Library lawns, Thomason building, or hostel mess backyards? 
            Snap or select a photo. Our <strong>Azure Custom Vision model</strong> immediately identifies the material stream, assigns the correct segregation group, and sends an automatic one-way dispatch confirmation from the Administrator.
          </p>
        </div>
      </div>

      {/* Confirmation of Administrator Auto-Ack */}
      {isSubmitted && submittedAck && (
        <div className="bg-emerald-50 border-2 border-emerald-400 rounded-3xl p-6 shadow-soft flex items-start gap-4 animate-fadeIn">
          <div className="w-12 h-12 rounded-2xl bg-emerald-700 text-white flex items-center justify-center flex-shrink-0 shadow-md">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <div className="flex-1 text-sm">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-bold text-lg text-emerald-950">
                Automatic Administrator Confirmation Received!
              </h3>
              <span className="text-xs font-bold font-mono text-emerald-800 bg-emerald-200/70 px-3 py-1 rounded-full">
                +25 EcoPoints Added!
              </span>
            </div>
            <p className="text-emerald-950 bg-white/90 p-4 rounded-2xl border border-emerald-200 text-xs sm:text-sm mt-2 font-mono leading-relaxed shadow-sm">
              "{submittedAck}"
            </p>
            <div className="mt-3 flex items-center justify-between">
              <span className="text-xs text-emerald-800">
                Action: <strong>Covered tractor trolley route assigned</strong> • Logged in Central Administrator Desk.
              </span>
              <button
                onClick={() => {
                  setIsSubmitted(false);
                  setAiResult(null);
                }}
                className="text-xs font-semibold text-emerald-900 underline hover:text-emerald-950"
              >
                Report Another Spot →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Two Column Layout: Camera & Spot Details on Left, AI Inference on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Image Upload & Geo-Tagging */}
        <div className="lg:col-span-6 bg-white rounded-3xl p-6 border border-hallmark-border shadow-soft space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-bold text-lg text-hallmark-dark">
              1. Snap Photo & Tag Location
            </h3>
            <span className="text-xs text-slate-400">Step 1 of 2</span>
          </div>

          {/* Location Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-hallmark-primary" />
                Select IIT Roorkee Location / Landmark:
              </span>
              <span className="text-[11px] text-emerald-700 font-mono">
                Lat: {activeLocation.latitude}°N, Long: {activeLocation.longitude}°E
              </span>
            </label>
            
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-hallmark-primary"
            >
              {IITR_CAMPUS_LOCATIONS.map(loc => (
                <option key={loc.id} value={loc.id}>
                  {loc.name} ({loc.zone})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Exact Spot Landmark / Room / Pillar Note:
            </label>
            <input
              type="text"
              value={customLocationDetail}
              onChange={(e) => setCustomLocationDetail(e.target.value)}
              placeholder="e.g. Near high-jump mat on LBS Track, 20m from APJ complex gate"
              className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-1 focus:ring-hallmark-primary bg-slate-50/50"
            />
          </div>

          {/* Photo Preview with Bounding Box Container */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-slate-700">
                Waste Image Preview:
              </label>
              <label className="cursor-pointer text-xs font-semibold text-hallmark-primary hover:underline flex items-center gap-1">
                <Camera className="w-3.5 h-3.5" />
                <span>Upload Custom Photo</span>
                <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
              </label>
            </div>

            <div className="relative w-full h-64 bg-slate-900 rounded-2xl overflow-hidden border border-slate-200 shadow-inner flex items-center justify-center group">
              <img 
                src={photoPreview} 
                alt="Waste Capture" 
                className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-500" 
              />

              {/* Bounding Box Overlay if AI Result exists */}
              {aiResult && aiResult.prediction.boundingBox && (
                <div 
                  className="absolute border-2 border-emerald-400 bg-emerald-400/20 rounded shadow-glow pointer-events-none transition-all duration-300"
                  style={{
                    left: `${aiResult.prediction.boundingBox.left * 100}%`,
                    top: `${aiResult.prediction.boundingBox.top * 100}%`,
                    width: `${aiResult.prediction.boundingBox.width * 100}%`,
                    height: `${aiResult.prediction.boundingBox.height * 100}%`,
                  }}
                >
                  <span className="absolute -top-6 left-0 bg-emerald-600 text-white font-mono text-[10px] px-2 py-0.5 rounded font-bold shadow-sm whitespace-nowrap">
                    {aiResult.prediction.tag} ({aiResult.prediction.confidence}%)
                  </span>
                </div>
              )}

              {/* Model Tag pill */}
              <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-md text-white text-[10px] px-2.5 py-1 rounded-full font-mono flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-amber-400" />
                <span>Azure Custom Vision • Object Detection</span>
              </div>
            </div>
          </div>

          {/* Quick Test Samples */}
          <div>
            <span className="text-[11px] font-semibold text-slate-500 block mb-1.5">
              Or pick instant demo sample images:
            </span>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {TEST_SAMPLES.map((sample, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handlePickSample(sample)}
                  className={`relative rounded-xl overflow-hidden h-14 border transition-all ${
                    photoPreview === sample.url ? 'border-hallmark-primary ring-2 ring-emerald-500/40 scale-105' : 'border-slate-200 opacity-75 hover:opacity-100'
                  }`}
                  title={sample.name}
                >
                  <img src={sample.url} alt={sample.name} className="w-full h-full object-cover" />
                  <div className="absolute inset-x-0 bottom-0 bg-black/60 text-[9px] text-white p-0.5 text-center truncate">
                    {sample.name.split(' ')[0]}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Analyze Button */}
          <button
            type="button"
            onClick={handleRunAiAnalysis}
            disabled={isAnalyzing}
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-hallmark-primary to-hallmark-dark hover:shadow-lg text-white font-semibold text-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isAnalyzing ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Running Azure Cloud Vision Neural Model...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Run AI Waste Identification</span>
              </>
            )}
          </button>

        </div>

        {/* Right Column: AI Inference & One-Way Administrative Dispatch */}
        <div className="lg:col-span-6 bg-white rounded-3xl p-6 border border-hallmark-border shadow-soft flex flex-col justify-between space-y-5">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-display font-bold text-lg text-hallmark-dark">
                2. AI Identification & Segregation Guide
              </h3>
              <span className="text-xs text-slate-400">Step 2 of 2</span>
            </div>

            {!aiResult && !isAnalyzing && (
              <div className="py-14 text-center space-y-3">
                <div className="w-14 h-14 rounded-3xl bg-hallmark-cream border border-hallmark-border flex items-center justify-center mx-auto text-hallmark-primary shadow-sm">
                  <Sparkles className="w-7 h-7 text-amber-600" />
                </div>
                <h4 className="font-display font-bold text-slate-800 text-base">
                  Awaiting Image Analysis
                </h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                  Click <strong>"Run AI Waste Identification"</strong> on the left. The Azure Custom Vision model will detect the object, determine its waste stream, and designate the IIT Roorkee collection squad.
                </p>
              </div>
            )}

            {isAnalyzing && (
              <div className="py-16 text-center space-y-3">
                <div className="w-12 h-12 rounded-full border-4 border-emerald-600 border-t-transparent animate-spin mx-auto" />
                <h4 className="font-display font-bold text-slate-800 text-sm">
                  Classifying with Azure Custom Vision...
                </h4>
                <p className="text-xs text-slate-400 font-mono">
                  Evaluating bounding box & material confidence...
                </p>
              </div>
            )}

            {/* AI Result Card */}
            {aiResult && (
              <div className="space-y-4 pt-2">
                
                {/* Result header banner */}
                <div className="bg-hallmark-cream p-4 rounded-2xl border border-hallmark-border/80 flex items-start justify-between">
                  <div>
                    <span className="text-[11px] font-mono font-semibold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                      Confidence: {aiResult.prediction.confidence}% Match
                    </span>
                    <h4 className="font-display font-bold text-lg text-hallmark-dark mt-1">
                      {aiResult.prediction.tag}
                    </h4>
                    <div className="mt-1">
                      <WasteCategoryBadge category={aiResult.prediction.category} />
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Recommended Bin</span>
                    <span className="text-xs font-bold text-hallmark-dark bg-white px-2.5 py-1 rounded-xl border border-slate-200 inline-block mt-0.5 shadow-sm">
                      {aiResult.prediction.binColor}
                    </span>
                  </div>
                </div>

                {/* Voice Guidance Button (ElevenLabs Track Feature) */}
                <div className="flex items-center justify-between bg-emerald-50/70 p-3 rounded-2xl border border-emerald-200">
                  <div className="text-xs text-emerald-900">
                    <span className="font-semibold block">Voice Guidance for Student:</span>
                    <span className="text-[11px] text-emerald-700">Audio readout of segregation steps</span>
                  </div>
                  <VoiceGuideButton 
                    text={`This item is identified as ${aiResult.prediction.tag}. Please discard it into the ${aiResult.prediction.binColor}. It will be transported to ${aiResult.prediction.collectionGroup}.`} 
                  />
                </div>

                {/* Structured Breakdown List */}
                <div className="space-y-2.5 text-xs text-slate-700">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-2.5">
                    <span className="font-semibold text-slate-500 w-28 flex-shrink-0">Disposal Action:</span>
                    <span className="text-slate-800 font-medium">{aiResult.prediction.actionInstructions}</span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-2.5">
                    <span className="font-semibold text-slate-500 w-28 flex-shrink-0">Assigned Crew:</span>
                    <span className="text-emerald-800 font-bold">{aiResult.prediction.collectionGroup}</span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-2.5">
                    <span className="font-semibold text-slate-500 w-28 flex-shrink-0">Eco Treatment:</span>
                    <span className="text-slate-700">{aiResult.prediction.treatmentMethod}</span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-2.5">
                    <span className="font-semibold text-slate-500 w-28 flex-shrink-0">Carbon Offset:</span>
                    <span className="text-emerald-700 font-semibold">
                      Avoids ~{aiResult.prediction.carbonFactorKg} kg CO2e per unit processed
                    </span>
                  </div>
                </div>

                {/* Preview of Automatic One-Way Message */}
                <div className="bg-amber-50/80 p-3.5 rounded-2xl border border-amber-200 text-xs space-y-1">
                  <div className="flex items-center gap-1.5 font-semibold text-amber-900">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-700" />
                    <span>Automatic One-Way Admin Acknowledgment to Student:</span>
                  </div>
                  <p className="font-mono text-[11px] text-amber-950 bg-white/70 p-2 rounded-xl border border-amber-200/60 leading-snug">
                    "{aiResult.suggestedAutomatedMessage}"
                  </p>
                </div>

              </div>
            )}
          </div>

          {/* Submit Action */}
          {aiResult && !isSubmitted && (
            <div className="pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={handleSubmitComplaint}
                className="w-full py-3 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-sm transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 group"
              >
                <Send className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                <span>Submit Spot Report & Trigger Admin Dispatch</span>
              </button>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
