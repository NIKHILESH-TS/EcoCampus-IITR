// ElevenLabs Bilingual Voice AI Integration Service for SOCIOTHON 2026
// Powers EcoVoice AI Assistant & Bilingual Spoken Guidance (English & Hindi)
// Supports direct ElevenLabs API + Multilingual V2 Model + Web Speech fallback

const ELEVENLABS_STORAGE_KEY = 'ecocampus_elevenlabs_config';

export const ELEVENLABS_VOICES = [
  { id: '21m00Tcm4TlvDq8ikWAM', name: 'Rachel', description: 'Calm, natural female (Multilingual)', accent: 'English/Hindi' },
  { id: 'pNInz6obpgDQGcFmaJgB', name: 'Adam', description: 'Deep, clear male (Multilingual)', accent: 'English/Hindi' },
  { id: 'EXAVITQu4vr4xnSDxMaL', name: 'Bella', description: 'Warm, empathetic female', accent: 'English/Hindi' },
  { id: 'ErXwobaYiN019PkySvjV', name: 'Antoni', description: 'Friendly, youthful male', accent: 'English/Hindi' },
  { id: 'VR6AewLTigWG4xSOukaG', name: 'Arnold', description: 'Crisp narration male', accent: 'English/Hindi' },
];

export const DEFAULT_ELEVENLABS_CONFIG = {
  apiKey: '', // Users can paste their hackathon credit API key
  voiceId: '21m00Tcm4TlvDq8ikWAM', // Rachel
  modelId: 'eleven_multilingual_v2', // Multilingual V2 for seamless Hindi & English
  stability: 0.5,
  similarityBoost: 0.75,
  language: 'en' // 'en' | 'hi'
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
 * Speaks text using ElevenLabs Multilingual V2 with fallback to Web Speech
 */
export async function speakText(text, onStart = () => {}, onEnd = () => {}, forcedLang = null) {
  stopSpeaking();
  const config = getElevenLabsConfig();
  const currentLang = forcedLang || config.language || 'en';

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
          model_id: 'eleven_multilingual_v2',
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
          fallbackWebSpeech(text, onStart, onEnd, currentLang);
        };

        await activeAudio.play();
        return true;
      }
    } catch (err) {
      console.warn('ElevenLabs API fetch error, falling back to Web Speech:', err);
    }
  }

  // Reliable Fallback: Native Web Speech API
  return fallbackWebSpeech(text, onStart, onEnd, currentLang);
}

function fallbackWebSpeech(text, onStart, onEnd, lang = 'en') {
  if (!('speechSynthesis' in window)) {
    console.warn('Speech synthesis not supported in this browser.');
    onEnd();
    return false;
  }

  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 0.95;
  utterance.pitch = 1.0;
  utterance.lang = lang === 'hi' ? 'hi-IN' : 'en-IN';

  const voices = window.speechSynthesis.getVoices();
  const preferred = voices.find(v => (lang === 'hi' ? v.lang.includes('hi') : v.lang.includes('en')));
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

// Bilingual Knowledge Base
export const BILINGUAL_KNOWLEDGE_BASE = {
  en: [
    {
      keywords: ['maggi', 'wrapper', 'packet', 'chips', 'foil', 'pouch'],
      question: 'Where do I dispose of a Maggi or chip wrapper?',
      answer: 'Multilayer plastic wrappers like Maggi packets belong in the Grey Non-Recyclable Bin. At IIT Roorkee, these are sent to the Refuse Derived Fuel unit or engineered sanitary landfill.'
    },
    {
      keywords: ['bottle', 'pet bottle', 'water bottle', 'coke', 'plastic'],
      question: 'Where should I throw an empty plastic bottle?',
      answer: 'This plastic bottle should be placed in the Blue Recyclable Bin. Please empty any liquid and crush it slightly. It will be collected by our authorized recycling vendor network.'
    },
    {
      keywords: ['timing', 'shift', 'schedule', 'cleaning time', 'govind'],
      question: 'What are the cleaning shift timings for Govind Bhawan?',
      answer: 'Govind Bhawan has three daily cleaning shifts: Morning Shift at 07:30 AM for rooms and mess preparation; Afternoon Shift at 02:00 PM for corridor recyclables; and Evening Shift at 08:30 PM for mess and common areas.'
    },
    {
      keywords: ['banana', 'apple', 'food', 'mess', 'leftover', 'peel'],
      question: 'Where do food scraps and mess leftovers go?',
      answer: 'Food leftovers and fruit peels belong exclusively in the Green Bio-Degradable Bin. They are transported directly to IIT Roorkees on-campus anaerobic bio-digester, generating clean methane fuel and organic manure.'
    },
    {
      keywords: ['battery', 'charger', 'cable', 'earphone', 'laptop', 'e-waste'],
      question: 'How do I dispose of broken electronics or batteries?',
      answer: 'Discarded electronics and chargers belong in the Orange E-Waste Bin. Never throw them into regular hostel bins. They are handled by the IIT Roorkee E-Waste Cell under the 2016 rules.'
    }
  ],
  hi: [
    {
      keywords: ['प्लास्टिक', 'बोतल', 'पानी', 'कचरा', 'bottle', 'plastic'],
      question: 'प्लास्टिक की खाली बोतल कहाँ फेंकें?',
      answer: 'यह प्लास्टिक की बोतल नीले डस्टबिन (सूखा कचरा) में डालें। इसे कबाड़ीवाला नेटवर्क द्वारा रिसाइकिल किया जाएगा।'
    },
    {
      keywords: ['खाना', 'गीला', 'सब्जी', 'फल', 'मेस', 'food', 'mess'],
      question: 'बचा हुआ भोजन और फलों के छिलके कहाँ डालें?',
      answer: 'गीला कचरा और भोजन के अवशेष केवल हरे डस्टबिन (बायो-डिग्रेडेबल) में डालें। इसे सीधे आईआईटी रुड़की के बायोगैस प्लांट और खाद बनाने की इकाई में भेजा जाएगा।'
    },
    {
      keywords: ['समय', 'शिफ्ट', 'सफाई', 'टाइमिंग', 'timing', 'shift', 'govind'],
      question: 'गोविंद भवन में डस्टबिन की सफाई का क्या समय है?',
      answer: 'गोविंद भवन में सफाई के तीन दैनिक समय हैं: सुबह 7:30 बजे कमरों और मेस की सफाई, दोपहर 2:00 बजे कॉरिडोर के सूखे कचरे की सफाई, और रात 8:30 बजे मेस और लॉन की सफाई।'
    },
    {
      keywords: ['मैगी', 'चिप्स', 'रैपर', 'पैकेट', 'wrapper', 'chips'],
      question: 'चिप्स या मैगी का रैपर किस डस्टबिन में जाएगा?',
      answer: 'चिप्स और नमकीन के बहुपरतीय पैकेट धूसर (ग्रे) डस्टबिन में डालें। यह नॉन-रिसाइकिलेबल कचरा है जिसे लैंडफिल या ईंधन ब्रिकेट में इस्तेमाल किया जाता है।'
    },
    {
      keywords: ['बैटरी', 'चार्जर', 'तार', 'मोबाइल', 'इलेक्ट्रॉनिक', 'battery', 'charger'],
      question: 'खराब चार्जर, बैटरी और बिजली के तार कहाँ डालें?',
      answer: 'ई-कचरा जैसे खराब चार्जर और बैटरी नारंगी (ऑरेंज) डस्टबिन में डालें। इसे कभी भी साधारण कचरे में न मिलाएं।'
    }
  ]
};

export function queryEcoVoiceBilingual(userQuery, lang = 'en') {
  const clean = userQuery.toLowerCase();
  const kb = BILINGUAL_KNOWLEDGE_BASE[lang] || BILINGUAL_KNOWLEDGE_BASE.en;
  
  for (const item of kb) {
    if (item.keywords.some(k => clean.includes(k))) {
      return item;
    }
  }

  if (lang === 'hi') {
    return {
      question: userQuery,
      answer: 'आईआईटी रुड़की में 5 प्रकार के डस्टबिन हैं: हरा (गीला कचरा), नीला (सूखा रिसाइकिलेबल), ग्रे (नॉन-रिसाइकिलेबल), नारंगी (ई-कचरा), और लाल (खतरनाक रसायन व कांच)। कृपया सही डस्टबिन का उपयोग करें।'
    };
  }

  return {
    question: userQuery,
    answer: 'EcoCampus IIT Roorkee segregates waste into 5 streams: Green (Bio), Blue (Recyclable), Grey (Inert), Orange (E-Waste), and Red (Hazardous). Please use the correct bin!'
  };
}
