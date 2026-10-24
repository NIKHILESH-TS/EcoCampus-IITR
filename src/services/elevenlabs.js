// ElevenLabs Voice AI Integration Service for SOCIOTHON 2026
// Powers EcoVoice AI Assistant & Spoken Waste Segregation Guidance
// Supports direct ElevenLabs API with API key + Browser Speech fallback for 100% demo reliability

const ELEVENLABS_STORAGE_KEY = 'ecocampus_elevenlabs_config';

export const ELEVENLABS_VOICES = [
  { id: '21m00Tcm4TlvDq8ikWAM', name: 'Rachel', description: 'Calm, natural & professional (Female)', accent: 'American' },
  { id: 'pNInz6obpgDQGcFmaJgB', name: 'Adam', description: 'Deep, confident & authoritative (Male)', accent: 'American' },
  { id: 'EXAVITQu4vr4xnSDxMaL', name: 'Bella', description: 'Warm, clear & empathetic (Female)', accent: 'American' },
  { id: 'ErXwobaYiN019PkySvjV', name: 'Antoni', description: 'Friendly, youthful & engaging (Male)', accent: 'American' },
  { id: 'VR6AewLTigWG4xSOukaG', name: 'Arnold', description: 'Crisp narration (Male)', accent: 'American' },
];

export const DEFAULT_ELEVENLABS_CONFIG = {
  apiKey: '', // Users can paste their hackathon credit API key
  voiceId: '21m00Tcm4TlvDq8ikWAM', // Rachel
  modelId: 'eleven_monolingual_v1',
  stability: 0.5,
  similarityBoost: 0.75,
  useFallbackWhenEmpty: true
};

export function getElevenLabsConfig() {
  try {
    const raw = localStorage.getItem(ELEVENLABS_STORAGE_KEY);
    return raw ? { ...DEFAULT_ELEVENLABS_CONFIG, ...JSON.parse(raw) } : DEFAULT_ELEVENLABS_CONFIG;
  } catch (e) {
    return DEFAULT_ELEVENLABS_CONFIG;
  }
}

export function saveElevenLabsConfig(config) {
  try {
    localStorage.setItem(ELEVENLABS_STORAGE_KEY, JSON.stringify(config));
    window.dispatchEvent(new Event('elevenlabs_config_change'));
  } catch (e) {
    console.error('Failed to save ElevenLabs config', e);
  }
}

let activeAudio = null;

/**
 * Speaks text using ElevenLabs API with fallback to Web Speech API
 * @param {string} text - Text to be spoken
 * @param {Function} onStart - Callback when audio playback starts
 * @param {Function} onEnd - Callback when audio playback ends
 * @returns {Promise<boolean>}
 */
export async function speakText(text, onStart = () => {}, onEnd = () => {}) {
  // Stop any currently playing audio
  stopSpeaking();

  const config = getElevenLabsConfig();

  // If user provided a live ElevenLabs API Key, call ElevenLabs REST endpoint
  if (config.apiKey && config.apiKey.trim().length > 10) {
    try {
      const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${config.voiceId}`, {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': config.apiKey.trim()
        },
        body: JSON.stringify({
          text: text,
          model_id: config.modelId || 'eleven_monolingual_v1',
          voice_settings: {
            stability: config.stability || 0.5,
            similarity_boost: config.similarityBoost || 0.75
          }
        })
      });

      if (response.ok) {
        const blob = await response.blob();
        const audioUrl = URL.createObjectURL(blob);
        activeAudio = new Audio(audioUrl);
        
        activeAudio.onplay = () => onStart();
        activeAudio.onended = () => {
          onEnd();
          URL.revokeObjectURL(audioUrl);
          activeAudio = null;
        };
        activeAudio.onerror = () => {
          fallbackWebSpeech(text, onStart, onEnd);
        };

        await activeAudio.play();
        return true;
      } else {
        console.warn('ElevenLabs API returned error status:', response.status, await response.text());
      }
    } catch (err) {
      console.warn('ElevenLabs API fetch error, falling back to Web Speech:', err);
    }
  }

  // Reliable Fallback: Native Web Speech API
  return fallbackWebSpeech(text, onStart, onEnd);
}

function fallbackWebSpeech(text, onStart, onEnd) {
  if (!('speechSynthesis' in window)) {
    console.warn('Speech synthesis not supported in this browser.');
    onEnd();
    return false;
  }

  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 1.0;
  utterance.pitch = 1.02;

  // Attempt to select a clean English voice
  const voices = window.speechSynthesis.getVoices();
  const preferred = voices.find(v => v.lang.includes('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha')));
  if (preferred) utterance.voice = preferred;

  utterance.onstart = () => onStart();
  utterance.onend = () => onEnd();
  utterance.onerror = () => onEnd();

  window.speechSynthesis.speak(utterance);
  return true;
}

export function stopSpeaking() {
  if (activeAudio) {
    activeAudio.pause();
    activeAudio.currentTime = 0;
    activeAudio = null;
  }
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}

/**
 * Knowledge Base Q&A logic for the EcoVoice AI Agent
 */
export const ECOVOICE_KNOWLEDGE_BASE = [
  {
    keywords: ['maggi', 'wrapper', 'packet', 'chips', 'foil', 'biscuit', 'kurkure', 'plastic pouch'],
    question: 'How do I dispose of a Maggi or chip wrapper?',
    answer: 'Multilayer plastic wrappers like Maggi or chip packets are non-recyclable inert waste. Please dispose of them in the Grey Non-Recyclable Bin. At IIT Roorkee, these are sent to the Refuse Derived Fuel unit or engineered sanitary landfill.'
  },
  {
    keywords: ['bottle', 'pet bottle', 'water bottle', 'cold drink', 'coca cola', 'plastic bottle'],
    question: 'Where should I throw an empty plastic bottle?',
    answer: 'Plastic beverage bottles belong in the Blue Recyclable Bin. Please empty any remaining liquid and crush the bottle slightly before dropping it in. They are collected by our authorized recycling vendors for secondary pelletization.'
  },
  {
    keywords: ['timing', 'shift', 'schedule', 'when cleaned', 'cleaning time', 'govind timings', 'morning shift'],
    question: 'What are the cleaning shift timings for Govind Bhawan?',
    answer: 'Govind Bhawan has three daily cleaning shifts: Morning Shift at 07:30 AM for rooms and mess preparation; Afternoon Shift at 02:00 PM for corridor recyclables; and Evening Shift at 08:30 PM for mess and common areas.'
  },
  {
    keywords: ['banana', 'apple', 'food', 'mess', 'leftover', 'roti', 'rice', 'fruit', 'peel', 'vegetable'],
    question: 'Where do food scraps and mess leftovers go?',
    answer: 'Food leftovers and fruit peels belong exclusively in the Green Bio-Degradable Bin. They are transported directly to IIT Roorkees on-campus anaerobic bio-digester, generating clean biogas for cooking and rich organic manure.'
  },
  {
    keywords: ['book', 'textbook', 'notes', 'points', 'sell', 'give away', 'trade', 'kreyszig'],
    question: 'How do I earn EcoPoints for my old engineering books?',
    answer: 'Go to the Govind Bhawan Re-Use tab and click "List Item". Academic textbooks receive 60 base points plus a 15-point academic utility bonus! Other Govind Bhawan students can claim them, preventing move-out trash.'
  },
  {
    keywords: ['battery', 'charger', 'cable', 'earphone', 'laptop', 'circuit', 'e-waste', 'wire'],
    question: 'How do I dispose of broken electronics or batteries?',
    answer: 'Discarded electronics, USB cords, and batteries belong in the Orange E-Waste Bin. Never throw them into regular hostel bins. They are safely handled by the IIT Roorkee E-Waste Extraction Cell under the 2016 e-waste rules.'
  },
  {
    keywords: ['chemical', 'glass', 'flask', 'acid', 'lab', 'broken glass'],
    question: 'Where do lab chemicals and broken glassware belong?',
    answer: 'Broken glass and chemical containers belong in the Red Hazardous Bin. Do not handle broken shards bare-handed. They are neutralized and autoclaved by the campus bio-medical and safety disposal cell.'
  },
  {
    keywords: ['complaint', 'overflow', 'uncleaned', 'report', 'dog', 'odor'],
    question: 'How do I report an uncleaned or overflowing bin?',
    answer: 'In the Complaints tab, find your dustbin by ID or block and click "Report Issue". You will immediately receive an official one-way administrative acknowledgment confirming crew dispatch, plus 15 EcoPoints reward!'
  }
];

export function queryEcoVoice(userQuery) {
  const clean = userQuery.toLowerCase();
  for (const item of ECOVOICE_KNOWLEDGE_BASE) {
    if (item.keywords.some(k => clean.includes(k))) {
      return item;
    }
  }
  // Default general answer
  return {
    question: userQuery,
    answer: 'EcoCampus IIT Roorkee segregates waste into 5 streams: Green for bio-degradable organic waste, Blue for dry recyclables like paper and plastic, Grey for non-recyclable packaging, Orange for e-waste, and Red for hazardous glass and lab materials. You can also file a complaint or trade reusable items in Govind Bhawan!'
  };
}
