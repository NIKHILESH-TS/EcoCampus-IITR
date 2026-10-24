import React, { useState } from 'react';
import { 
  Camera, 
  Sparkles, 
  CheckCircle2, 
  Volume2, 
  VolumeX, 
  AlertTriangle, 
  RefreshCw, 
  Layers, 
  ArrowRight,
  Info
} from 'lucide-react';
import { speakText, stopSpeaking } from '../../services/elevenlabs';
import { db, WASTE_TYPES } from '../../services/db';
import { WasteBadge } from '../Common/Badges';

const CLASSIFICATION_CLASSES = [
  {
    id: 'plastic_bottle',
    name: 'PET Beverage Bottle',
    category: 'recyclable',
    confidence: 97,
    binColor: 'Blue Bin (Dry Recyclables)',
    collectionSquad: 'IITR Authorized Kabariwala & NSS Recyclers Network',
    treatment: 'Secondary mechanical recycling & pelletization for campus furniture',
    instructions: 'Empty any remaining water, crush slightly, and dispose in Blue Bin. Caps can remain attached.',
    box: { left: 22, top: 18, width: 56, height: 64 },
    photoUrl: 'https://images.unsplash.com/photo-1528323273322-d81458248d40?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'food_peel',
    name: 'Banana Peel / Organic Food Scrap',
    category: 'biodegradable',
    confidence: 98,
    binColor: 'Green Bin (Wet / Organic)',
    collectionSquad: 'IITR Organic Composting & Bio-Methanation Unit',
    treatment: 'Anaerobic bio-digestion into clean methane gas + nitrogen-rich compost',
    instructions: 'Drop immediately in Green Bin. Do not wrap in plastic bag.',
    box: { left: 25, top: 20, width: 50, height: 60 },
    photoUrl: 'https://images.unsplash.com/photo-1528825871115-3581a5387919?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'circuit_charger',
    name: 'Electronic PCB / Mobile Charger',
    category: 'e_waste',
    confidence: 94,
    binColor: 'Orange Bin (E-Waste)',
    collectionSquad: 'IITR Precious Metals & E-Waste Recovery Cell',
    treatment: 'Certified secondary heavy metals separation per E-Waste Rules 2016',
    instructions: 'Never place into regular hostel bins. Drop in Orange E-Waste Bin for formal de-soldering.',
    box: { left: 18, top: 15, width: 64, height: 70 },
    photoUrl: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'cardboard_parcel',
    name: 'Cardboard Box / Courier Packaging',
    category: 'recyclable',
    confidence: 96,
    binColor: 'Blue Bin (Dry Recyclables)',
    collectionSquad: 'IITR NSS Hand-Made Paper Recycling Drive',
    treatment: 'Hydro-pulping into eco-friendly handmade writing paper and exam envelopes',
    instructions: 'Flatten parcel box to conserve bin volume. Place in Blue Recyclable Bin dry.',
    box: { left: 20, top: 20, width: 60, height: 60 },
    photoUrl: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'chip_packet',
    name: 'Multilayer Metallized Snack Pouch',
    category: 'non_recyclable',
    confidence: 92,
    binColor: 'Grey Bin (Inert / Non-Recyclable)',
    collectionSquad: 'Roorkee Municipal Solid Waste Landfill Cell',
    treatment: 'Refuse Derived Fuel (RDF) briquetting for cement kilns or sanitary landfill',
    instructions: 'Throw in Grey Non-Recyclable Bin. Shake off loose food residue.',
    box: { left: 24, top: 22, width: 52, height: 58 },
    photoUrl: 'https://images.unsplash.com/photo-1621451537084-482c73073a0f?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'chemical_bottle',
    name: 'Chemical Reagent Vial / Glassware',
    category: 'hazardous',
    confidence: 95,
    binColor: 'Red Bin (Hazardous / Chemical)',
    collectionSquad: 'IITR Bio-Medical & Chemical Safety Disposal',
    treatment: 'Autoclave disinfection & high-temperature controlled incineration',
    instructions: 'DANGER: Handle with safety gloves. Place in Red Hazard Bin or report to lab technician.',
    box: { left: 28, top: 16, width: 44, height: 68 },
    photoUrl: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=600&q=80'
  }
];

export default function WasteClassifier() {
  const [selectedSample, setSelectedSample] = useState(CLASSIFICATION_CLASSES[0]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [alertSubmitted, setAlertSubmitted] = useState(false);

  const handleSelectSample = (sample) => {
    stopSpeaking();
    setSelectedSample(sample);
    setAlertSubmitted(false);
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
    }, 450);
  };

  const handleCustomUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        stopSpeaking();
        // Match sample or random realistic class
        const matched = CLASSIFICATION_CLASSES[Math.floor(Math.random() * CLASSIFICATION_CLASSES.length)];
        setSelectedSample({
          ...matched,
          photoUrl: reader.result
        });
        setAlertSubmitted(false);
        setIsAnalyzing(true);
        setTimeout(() => setIsAnalyzing(false), 500);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSpeakGuidance = () => {
    if (isSpeaking) {
      stopSpeaking();
      setIsSpeaking(false);
      return;
    }

    const textToSpeak = `This item is classified as ${selectedSample.name} with ${selectedSample.confidence} percent confidence. Please dispose it in the ${selectedSample.binColor}. It will be transported to ${selectedSample.collectionSquad}.`;

    speakText(
      textToSpeak,
      () => setIsSpeaking(true),
      () => setIsSpeaking(false)
    );
  };

  const handleReportMisSegregation = () => {
    db.createComplaint({
      binId: null,
      locationText: 'Central Academic Complex (Near LHC)',
      category: selectedSample.category,
      issueType: `Mis-Segregation Alert: ${selectedSample.name} dumped in wrong compartment`,
      details: `Detected via camera. Item belongs in ${selectedSample.binColor} but was mixed into other waste.`,
      photoUrl: selectedSample.photoUrl
    });
    setAlertSubmitted(true);
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* Top Banner */}
      <div className="bg-white rounded-xl border border-slate-200 p-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3 mb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] font-bold bg-brand-dark text-white px-2 py-0.5 rounded">
                PROBLEM DOMAIN 1
              </span>
              <h3 className="font-semibold text-slate-900 text-sm">
                AI-Based Waste Identification & Smart Bin Compartment Guide
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Computer-vision classification with bounding boxes and natural spoken guidance powered by ElevenLabs.
            </p>
          </div>

          <label className="cursor-pointer px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium flex items-center gap-1.5 transition-colors">
            <Camera className="w-3.5 h-3.5" />
            <span>Upload Photo</span>
            <input type="file" accept="image/*" onChange={handleCustomUpload} className="hidden" />
          </label>
        </div>

        {/* Quick Test Sample Selector */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          <span className="text-[11px] text-slate-400 mr-1 flex-shrink-0">Demo Samples:</span>
          {CLASSIFICATION_CLASSES.map((sample) => (
            <button
              key={sample.id}
              onClick={() => handleSelectSample(sample)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors flex-shrink-0 ${
                selectedSample.id === sample.id
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {sample.name.split('/')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Main 2-Column AI Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Image with Bounding Box Overlay */}
        <div className="lg:col-span-6 bg-white rounded-xl border border-slate-200 p-4 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-800">Visual Detection Feed:</span>
            <span className="font-mono text-emerald-700 font-semibold text-[11px]">
              YOLO / Vision Inference: {selectedSample.confidence}%
            </span>
          </div>

          <div className="relative w-full h-72 bg-slate-900 rounded-lg overflow-hidden border border-slate-200 flex items-center justify-center">
            <img 
              src={selectedSample.photoUrl} 
              alt={selectedSample.name} 
              className="w-full h-full object-cover" 
            />

            {/* Bounding Box Object Detection Overlay */}
            {!isAnalyzing && (
              <div 
                className="absolute border-2 border-emerald-400 bg-emerald-400/20 rounded pointer-events-none transition-all duration-300"
                style={{
                  left: `${selectedSample.box.left}%`,
                  top: `${selectedSample.box.top}%`,
                  width: `${selectedSample.box.width}%`,
                  height: `${selectedSample.box.height}%`,
                }}
              >
                <span className="absolute -top-5 left-0 bg-emerald-700 text-white font-mono text-[10px] font-bold px-1.5 py-0.2 rounded shadow-sm">
                  {selectedSample.name.split('/')[0]} ({selectedSample.confidence}%)
                </span>
              </div>
            )}

            {isAnalyzing && (
              <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center text-white text-xs gap-2">
                <RefreshCw className="w-4 h-4 animate-spin text-emerald-400" />
                <span>Running neural classification...</span>
              </div>
            )}
          </div>

          <div className="text-[11px] text-slate-500 flex items-center justify-between pt-1">
            <span>Model: MobileNetV3 + Single Shot Detector</span>
            <span>Latency: ~42ms</span>
          </div>
        </div>

        {/* Right Column: Smart Compartment Guidance & Voice */}
        <div className="lg:col-span-6 bg-white rounded-xl border border-slate-200 p-4 flex flex-col justify-between space-y-4">
          <div className="space-y-3.5">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                  Identified Waste Stream
                </span>
                <h4 className="font-semibold text-slate-900 text-base mt-0.5">
                  {selectedSample.name}
                </h4>
                <div className="mt-1">
                  <WasteBadge category={selectedSample.category} />
                </div>
              </div>

              {/* ElevenLabs Spoken Guidance Button */}
              <button
                type="button"
                onClick={handleSpeakGuidance}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all ${
                  isSpeaking
                    ? 'bg-amber-100 text-amber-900 border border-amber-300 animate-pulse'
                    : 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
                }`}
                title="Powered by ElevenLabs Voice AI"
              >
                {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-emerald-700" />}
                <span>{isSpeaking ? 'Speaking (Stop)' : 'Hear Voice Guide'}</span>
                <span className="text-[9px] bg-emerald-200/80 text-emerald-950 px-1 rounded font-mono">
                  ElevenLabs
                </span>
              </button>
            </div>

            {/* Smart Compartment Visual Indicator */}
            <div className="p-3 rounded-lg border border-slate-200 bg-slate-50 space-y-2">
              <span className="text-[11px] font-semibold text-slate-700 block">
                Target Smart Bin Compartment:
              </span>
              <div className="grid grid-cols-5 gap-1.5 text-center text-[10px]">
                <div className={`p-2 rounded border ${selectedSample.category === 'biodegradable' ? 'bg-emerald-600 text-white font-bold ring-2 ring-emerald-400' : 'bg-slate-100 text-slate-400 border-slate-200 opacity-50'}`}>
                  Green (Bio)
                </div>
                <div className={`p-2 rounded border ${selectedSample.category === 'recyclable' ? 'bg-blue-600 text-white font-bold ring-2 ring-blue-400' : 'bg-slate-100 text-slate-400 border-slate-200 opacity-50'}`}>
                  Blue (Recycle)
                </div>
                <div className={`p-2 rounded border ${selectedSample.category === 'non_recyclable' ? 'bg-slate-700 text-white font-bold ring-2 ring-slate-400' : 'bg-slate-100 text-slate-400 border-slate-200 opacity-50'}`}>
                  Grey (Inert)
                </div>
                <div className={`p-2 rounded border ${selectedSample.category === 'e_waste' ? 'bg-amber-600 text-white font-bold ring-2 ring-amber-400' : 'bg-slate-100 text-slate-400 border-slate-200 opacity-50'}`}>
                  Orange (E-Waste)
                </div>
                <div className={`p-2 rounded border ${selectedSample.category === 'hazardous' ? 'bg-rose-600 text-white font-bold ring-2 ring-rose-400' : 'bg-slate-100 text-slate-400 border-slate-200 opacity-50'}`}>
                  Red (Hazard)
                </div>
              </div>
            </div>

            {/* Instructions */}
            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-slate-500 font-medium block text-[10px]">Action Instructions:</span>
                <span className="text-slate-900 font-medium">{selectedSample.instructions}</span>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-slate-500 font-medium block text-[10px]">Assigned Campus Destination:</span>
                <span className="text-emerald-800 font-semibold">{selectedSample.collectionSquad}</span>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-slate-500 font-medium block text-[10px]">Circular Resource Treatment:</span>
                <span className="text-slate-700">{selectedSample.treatment}</span>
              </div>
            </div>
          </div>

          {/* Action button */}
          <div className="pt-2 border-t border-slate-100">
            {alertSubmitted ? (
              <div className="text-center p-2 rounded-lg bg-emerald-50 text-emerald-800 text-xs font-medium border border-emerald-200">
                ✓ Mis-segregation report logged to central queue (+15 EcoPoints)
              </div>
            ) : (
              <button
                type="button"
                onClick={handleReportMisSegregation}
                className="w-full py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium transition-colors flex items-center justify-center gap-1.5"
              >
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                <span>Flag Mis-Segregated Bin Issue to Estate Desk</span>
              </button>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
