import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  Key, 
  Settings, 
  X, 
  Send, 
  Radio,
  CheckCircle2,
  Languages
} from 'lucide-react';
import { 
  speakText, 
  stopSpeaking, 
  queryEcoVoiceBilingual, 
  BILINGUAL_KNOWLEDGE_BASE, 
  getElevenLabsConfig, 
  saveElevenLabsConfig, 
  ELEVENLABS_VOICES 
} from '../../services/elevenlabs';

export default function EcoVoiceAgentModal({ isOpen, onClose }) {
  const [query, setQuery] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [language, setLanguage] = useState('en'); // 'en' | 'hi'

  const [conversation, setConversation] = useState([
    {
      sender: 'agent',
      text: 'Hello! I am EcoVoice AI, IIT Roorkee’s smart sustainability assistant powered by ElevenLabs. Ask me where to dispose of any item, about Govind Bhawan cleaning shifts, or how to earn EcoPoints!',
      timestamp: 'Just now'
    }
  ]);
  
  // Settings toggle & config
  const [showSettings, setShowSettings] = useState(false);
  const [config, setConfig] = useState(getElevenLabsConfig());
  const [configSavedToast, setConfigSavedToast] = useState(false);

  const recognitionRef = useRef(null);
  const chatEndRef = useRef(null);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [conversation]);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = language === 'hi' ? 'hi-IN' : 'en-IN';

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setQuery(transcript);
        handleSendQuery(transcript);
        setIsListening(false);
      };

      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);

      recognitionRef.current = recognition;
    }

    return () => {
      stopSpeaking();
      if (recognitionRef.current) recognitionRef.current.abort();
    };
  }, [language]);

  if (!isOpen) return null;

  const handleToggleLanguage = (newLang) => {
    stopSpeaking();
    setLanguage(newLang);
    const greeting = newLang === 'hi'
      ? 'नमस्ते! मैं इको-वॉयस एआई (EcoVoice AI) हूँ। सफाई कर्मियों और छात्रों के लिए 11Labs द्वारा संचालित। आप मुझसे किसी भी कचरे के सही डस्टबिन या गोविंद भवन के सफाई समय के बारे में पूछ सकते हैं।'
      : 'Hello! I am EcoVoice AI, IIT Roorkee’s smart sustainability assistant powered by ElevenLabs. Ask me where to dispose of any item, about Govind Bhawan cleaning shifts, or how to earn EcoPoints!';
    
    setConversation(prev => [
      ...prev,
      {
        sender: 'agent',
        text: greeting,
        timestamp: 'Just now'
      }
    ]);

    speakText(greeting, () => setIsSpeaking(true), () => setIsSpeaking(false), newLang);
  };

  const handleToggleMic = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported in this browser. Please type your query.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      stopSpeaking();
      try {
        recognitionRef.current.lang = language === 'hi' ? 'hi-IN' : 'en-IN';
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        console.error('Speech recognition start failed', err);
      }
    }
  };

  const handleSendQuery = (textToSend = query) => {
    const text = textToSend.trim();
    if (!text) return;

    const userMsg = {
      sender: 'user',
      text: text,
      timestamp: 'Just now'
    };

    const answerData = queryEcoVoiceBilingual(text, language);
    const agentMsg = {
      sender: 'agent',
      text: answerData.answer,
      timestamp: 'Just now'
    };

    setConversation(prev => [...prev, userMsg, agentMsg]);
    setQuery('');

    // Speak answer via ElevenLabs Voice
    speakText(
      answerData.answer,
      () => setIsSpeaking(true),
      () => setIsSpeaking(false),
      language
    );
  };

  const handleSaveSettings = (e) => {
    e.preventDefault();
    saveElevenLabsConfig(config);
    setConfigSavedToast(true);
    setTimeout(() => setConfigSavedToast(false), 3000);
  };

  const currentKB = BILINGUAL_KNOWLEDGE_BASE[language] || BILINGUAL_KNOWLEDGE_BASE.en;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs font-sans">
      <div className="bg-white rounded-2xl max-w-xl w-full h-[620px] max-h-[92vh] border border-slate-200 shadow-card flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="bg-brand-dark text-white px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-700/80 flex items-center justify-center text-white relative">
              <Sparkles className="w-4 h-4 text-amber-300" />
              {isSpeaking && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full animate-ping" />
              )}
            </div>
            <div>
              <div className="font-semibold text-sm flex items-center gap-2">
                <span>EcoVoice AI</span>
                <span className="bg-amber-400/20 text-amber-300 text-[10px] font-mono font-medium px-2 py-0.2 rounded-full border border-amber-300/30">
                  ElevenLabs Multilingual V2
                </span>
              </div>
              <p className="text-[11px] text-emerald-200/80">
                {language === 'hi' ? 'आईआईटी रुड़की द्विभाषी वॉयस सहायक (हिंदी/अंग्रेजी)' : 'IIT Roorkee Bilingual Voice Assistant (EN/HI)'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Language Switcher Pill */}
            <div className="bg-white/10 p-0.5 rounded-lg flex items-center border border-white/20 text-[11px]">
              <button
                type="button"
                onClick={() => handleToggleLanguage('en')}
                className={`px-2 py-0.5 rounded font-medium transition-colors ${
                  language === 'en' ? 'bg-white text-slate-900 font-bold' : 'text-emerald-200 hover:text-white'
                }`}
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => handleToggleLanguage('hi')}
                className={`px-2 py-0.5 rounded font-medium transition-colors ${
                  language === 'hi' ? 'bg-amber-400 text-slate-950 font-bold' : 'text-emerald-200 hover:text-white'
                }`}
              >
                हिन्दी
              </button>
            </div>

            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-1.5 rounded-lg text-emerald-200 hover:text-white hover:bg-white/10 transition-colors"
              title="ElevenLabs API Settings"
            >
              <Settings className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                stopSpeaking();
                onClose();
              }}
              className="p-1.5 rounded-lg text-emerald-200 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ElevenLabs API Settings Drawer (Expandable) */}
        {showSettings && (
          <form onSubmit={handleSaveSettings} className="bg-slate-50 border-b border-slate-200 p-4 text-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-amber-600" />
                <span>Configure ElevenLabs Credits & Multilingual V2</span>
              </span>
              <span className="text-[10px] text-slate-400">
                SOCIOTHON 2026 Sponsor Track
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-600 font-medium mb-1">
                  ElevenLabs API Key (`xi-api-key`):
                </label>
                <input
                  type="password"
                  placeholder="Paste your ElevenLabs API Key"
                  value={config.apiKey}
                  onChange={(e) => setConfig({ ...config, apiKey: e.target.value })}
                  className="w-full p-2 rounded-lg border border-slate-200 text-xs font-mono bg-white"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">
                  Select ElevenLabs Voice:
                </label>
                <select
                  value={config.voiceId}
                  onChange={(e) => setConfig({ ...config, voiceId: e.target.value })}
                  className="w-full p-2 rounded-lg border border-slate-200 text-xs bg-white text-slate-800"
                >
                  {ELEVENLABS_VOICES.map(v => (
                    <option key={v.id} value={v.id}>
                      {v.name} ({v.description})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-[11px] text-slate-500">
                {config.apiKey ? '✓ ElevenLabs Multilingual V2 active' : '⚡ Using Browser Speech fallback (enter key for ElevenLabs credits)'}
              </span>

              <button
                type="submit"
                className="px-3 py-1 rounded-lg bg-brand-primary hover:bg-brand-dark text-white font-medium text-xs transition-colors"
              >
                Save Settings
              </button>
            </div>

            {configSavedToast && (
              <div className="text-emerald-700 text-[11px] font-medium flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Settings saved successfully!
              </div>
            )}
          </form>
        )}

        {/* Conversation Message Feed */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs bg-slate-50/50">
          {conversation.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-slate-900 text-white rounded-br-xs'
                    : 'bg-white border border-slate-200 text-slate-800 rounded-bl-xs shadow-subtle'
                }`}
              >
                {msg.sender === 'agent' && (
                  <div className="flex items-center justify-between text-[10px] text-emerald-800 font-medium mb-1">
                    <span className="flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-amber-600" />
                      EcoVoice AI ({language.toUpperCase()})
                    </span>
                    <button
                      onClick={() => speakText(msg.text, () => setIsSpeaking(true), () => setIsSpeaking(false), language)}
                      className="text-slate-400 hover:text-slate-700"
                      title="Replay Voice"
                    >
                      <Volume2 className="w-3 h-3" />
                    </button>
                  </div>
                )}
                <div>{msg.text}</div>
              </div>
            </div>
          ))}

          {isListening && (
            <div className="flex justify-start">
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3 text-xs text-amber-900 flex items-center gap-2 animate-pulse">
                <Radio className="w-3.5 h-3.5 text-amber-600 animate-spin" />
                <span>
                  {language === 'hi' ? 'आपकी आवाज़ सुन रहे हैं... बोलिए!' : 'Listening to your voice... Speak now!'}
                </span>
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Quick Question Prompts */}
        <div className="px-4 py-2 border-t border-slate-100 bg-white">
          <span className="text-[10px] text-slate-400 block mb-1">
            {language === 'hi' ? 'त्वरित प्रश्न (क्लिक करके पूछें):' : 'Quick Voice Prompts (Click to ask):'}
          </span>
          <div className="flex gap-1.5 overflow-x-auto pb-1 text-[11px] scrollbar-none">
            {currentKB.slice(0, 4).map((kb, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSendQuery(kb.question)}
                className="whitespace-nowrap px-2.5 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] transition-colors border border-slate-200"
              >
                {kb.question}
              </button>
            ))}
          </div>
        </div>

        {/* Voice Input & Query Bar */}
        <div className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
          <button
            type="button"
            onClick={handleToggleMic}
            className={`p-2.5 rounded-xl text-white transition-all flex items-center justify-center ${
              isListening 
                ? 'bg-rose-600 animate-bounce' 
                : 'bg-emerald-700 hover:bg-emerald-800'
            }`}
            title="Click to speak (Microphone)"
          >
            {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </button>

          <input
            type="text"
            placeholder={
              isListening 
                ? (language === 'hi' ? 'सुन रहे हैं...' : 'Listening...') 
                : (language === 'hi' ? 'कचरा या डस्टबिन का सवाल पूछें...' : 'Type or ask a waste question...')
            }
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendQuery()}
            className="flex-1 p-2 rounded-xl border border-slate-200 text-xs bg-slate-50 focus:bg-white focus:outline-none"
          />

          {isSpeaking && (
            <button
              type="button"
              onClick={stopSpeaking}
              className="p-2 rounded-xl bg-amber-100 text-amber-900 border border-amber-300 hover:bg-amber-200 text-xs"
              title="Stop voice playback"
            >
              <VolumeX className="w-4 h-4" />
            </button>
          )}

          <button
            type="button"
            onClick={() => handleSendQuery()}
            className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
}
